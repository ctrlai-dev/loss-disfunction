// tools/plottr-import.mjs
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

// Optional env vars
const INPUT = process.env.PLOTTR_FILE || process.env.PLOTTR_JSON || "./data/Loss Disfunction.pltr";
const IMG_ROOT = process.env.PLOTTR_IMG_ROOT || path.dirname(INPUT);
const SITE_IMG_ROOT = process.env.SITE_IMG_ROOT || "./public/images";
const SITE_IMG_URL = process.env.SITE_IMG_URL || "/images";
const OUT_DIR = "./src/content/universe";

function slugify(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}

function ensureDir(d){ fs.mkdirSync(d, { recursive: true }); }

function safeRead(file){
  try { return fs.readFileSync(file); } catch { return null; }
}

function parsePltr(inputPath){
  // Supports:
  // - Plain JSON at inputPath
  // - .pltr zip with project.json at root
  const buf = safeRead(inputPath);
  if (!buf) throw new Error(`Cannot read: ${inputPath}`);
  const isJson = inputPath.toLowerCase().endsWith(".json") || String(buf.slice(0,1)) === "{";
  if (isJson) return JSON.parse(String(buf));

  // Minimal ZIP reader for project.json (no deps)
  // Look for file name 'project.json' and extract text
  const data = buf;
  const sig = Buffer.from([0x50,0x4b,0x03,0x04]); // local file header
  let offset = 0;
  while (offset < data.length) {
    if (data.slice(offset, offset+4).compare(sig) !== 0) break;
    const nameLen = data.readUInt16LE(offset + 26);
    const extraLen = data.readUInt16LE(offset + 28);
    const compSize = data.readUInt32LE(offset + 18);
    const fileName = data.slice(offset + 30, offset + 30 + nameLen).toString("utf8");
    const contentStart = offset + 30 + nameLen + extraLen;
    const content = data.slice(contentStart, contentStart + compSize);
    if (fileName === "project.json") {
      return JSON.parse(String(content));
    }
    offset = contentStart + compSize;
  }
  throw new Error("project.json not found in .pltr");
}

function rewriteImagePath(p) {
  if (!p) return null;
  // Absolute or URL: leave URLs, copy local files if exist
  if (/^https?:\/\//i.test(p)) return p;
  const abs = path.isAbsolute(p) ? p : path.join(IMG_ROOT, p);
  const base = path.basename(abs);
  const dest = path.join(SITE_IMG_ROOT, base);
  ensureDir(SITE_IMG_ROOT);
  try {
    fs.copyFileSync(abs, dest);
    return `${SITE_IMG_URL}/${base}`;
  } catch {
    return null;
  }
}

function mdxFrontmatter(o){
  const fm = [
    `title: ${o.title}`,
    `type: ${o.type}`,
    `summary: ${o.summary || "TBD"}`,
    o.cover ? `cover: ${o.cover}` : null,
    o.plottrId ? `plottrId: ${o.plottrId}` : null,
    o.order != null ? `order: ${o.order}` : null,
    `tags: [${(o.tags||[]).map(t=>JSON.stringify(t)).join(", ")}]`,
    `related: [${(o.related||[]).map(t=>JSON.stringify(t)).join(", ")}]`,
  ].filter(Boolean).join("\n");
  return `---\n${fm}\n---\n\n`;
}

function mergeBodyIfExists(filePath, newBody){
  const existing = safeRead(filePath);
  if (!existing) return newBody;
  const text = String(existing);
  const idx = text.indexOf("---", 3);
  if (idx === -1) return newBody; // malformed; overwrite body only
  const body = text.slice(idx + 3).trimStart();
  // Preserve existing prose if non-empty
  return body.trim().length > 0 ? body : newBody;
}

function pickEntities(data){
  const chars = data.characters || data.cast || [];
  const places = data.places || data.locations || [];
  const tech = data.technology || data.items || [];
  return { chars, places, tech };
}

function writeEntry(slug, obj){
  const filePath = path.join(OUT_DIR, `${slug}.mdx`);
  const preservedBody = mergeBodyIfExists(filePath, (obj.body || "").trim());
  const front = mdxFrontmatter(obj);
  fs.writeFileSync(filePath, front + preservedBody + (preservedBody.endsWith("\n")?"":"\n"));
}

function run(){
  const data = parsePltr(INPUT);
  const { chars, places, tech } = pickEntities(data);
  const created = [];

  ensureDir(OUT_DIR);
  ensureDir(SITE_IMG_ROOT);

  for (const c of chars){
    const title = c.name || c.title || `Character ${c.id||""}`;
    const slug = slugify(title);
    const cover = rewriteImagePath(c.image || c.cover);
    const o = {
      title,
      type: "character",
      summary: c.summary || c.bio?.slice(0,180) || "Character in the Loss Disfunction universe.",
      tags: c.tags || [],
      cover: cover || null,
      plottrId: c.id || c._id,
      body: (c.bio || "").trim()
    };
    writeEntry(slug, o);
    created.push(slug);
  }

  for (const p of places){
    const title = p.name || p.title || `Location ${p.id||""}`;
    const slug = slugify(title);
    const cover = rewriteImagePath(p.image);
    const o = {
      title,
      type: "location",
      summary: p.summary || p.notes?.slice(0,180) || "Location in the Loss Disfunction universe.",
      tags: p.tags || [],
      cover: cover || null,
      plottrId: p.id || p._id,
      body: (p.notes || "").trim()
    };
    writeEntry(slug, o);
    created.push(slug);
  }

  for (const t of tech){
    const title = t.name || t.title || `Technology ${t.id||""}`;
    const slug = slugify(title);
    const o = {
      title,
      type: "technology",
      summary: t.summary || t.text?.slice(0,180) || "Technology of the Loss Disfunction universe.",
      tags: t.tags || [],
      plottrId: t.id || t._id,
      body: (t.text || "").trim()
    };
    writeEntry(slug, o);
    created.push(slug);
  }

  console.log(`Created/updated ${created.length} universe entries.`);
}

run();


