// tools/plottr-import.mjs
import fs from "node:fs";
import path from "node:path";

const INPUT = process.env.PLOTTR_JSON || "./data/loss-disfunction.pltr"; // plain JSON
const OUT_DIR = "./src/content/universe";

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}

function ensureDir(d){ fs.mkdirSync(d, { recursive: true }); }

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
  return `---\n${fm}\n---\n\n${o.body || ""}\n`;
}

function pickEntities(data){
  const chars = data.characters || data.cast || [];
  const places = data.places || data.locations || [];
  const tech = data.technology || data.items || [];
  return { chars, places, tech };
}

function run(){
  const raw = fs.readFileSync(INPUT, "utf-8");
  const data = JSON.parse(raw);

  const { chars, places, tech } = pickEntities(data);
  const created = [];

  ensureDir(OUT_DIR);

  for (const c of chars){
    const title = c.name || c.title || `Character ${c.id||""}`;
    const slug = slugify(title);
    const o = {
      title,
      type: "character",
      summary: c.summary || c.bio?.slice(0,180) || "Character in the Loss Disfunction universe.",
      tags: c.tags || [],
      cover: c.image || c.cover || null,
      plottrId: c.id || c._id,
      body: (c.bio || "").trim()
    };
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.mdx`), mdxFrontmatter(o));
    created.push(slug);
  }

  for (const p of places){
    const title = p.name || p.title || `Location ${p.id||""}`;
    const slug = slugify(title);
    const o = {
      title,
      type: "location",
      summary: p.summary || p.notes?.slice(0,180) || "Location in the Loss Disfunction universe.",
      tags: p.tags || [],
      cover: p.image || null,
      plottrId: p.id || p._id,
      body: (p.notes || "").trim()
    };
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.mdx`), mdxFrontmatter(o));
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
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.mdx`), mdxFrontmatter(o));
    created.push(slug);
  }

  console.log(`Created/updated ${created.length} universe entries.`);
}

run();


