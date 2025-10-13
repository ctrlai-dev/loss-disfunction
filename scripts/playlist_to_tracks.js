// Usage: node scripts/playlist_to_tracks.js <PLAYLIST_ID>
// Converts YouTube playlist RSS into src/data/tracks.json (no API key).
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const playlistId = process.argv[2];
if (!playlistId) {
  console.error('Provide a PLAYLIST_ID. Example: node scripts/playlist_to_tracks.js PLabcd1234');
  process.exit(1);
}
const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', d => (data += d));
      res.on('end', () => resolve({ status: res.statusCode, text: () => data }));
    }).on('error', reject);
  });
}
function xmlTag(str, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\s\S]*?)</${tag}>`, 'i');
  const m = str.match(re);
  return m ? m[1] : '';
}
function xmlTags(str, tag) {
  const re = new RegExp(`<${tag}[^>]*>[\s\S]*?</${tag}>`, 'ig');
  return [...str.matchAll(re)].map(m => m[0]);
}
function getAttr(tagStr, attr, ns=false) {
  const re = new RegExp(`${ns?attr.replace(':','\\:'):attr}="([^"]+)"`, 'i');
  const m = tagStr.match(re);
  return m ? m[1] : '';
}
function strip(s) {
  return s.replace(/<!\[CDATA\[|\]\]>/g,'').trim();
}

const OUT = path.resolve('src/data/tracks.json');

(async () => {
  const res = await fetch(rssUrl);
  if (res.status !== 200) {
    console.error('Failed to fetch RSS:', res.status);
    process.exit(1);
  }
  const rss = await res.text();

  const entries = xmlTags(rss, 'entry').map(e => {
    const title = strip(xmlTag(e, 'title'));
    const videoId = getAttr(e, 'yt:videoId', true) || strip(xmlTag(e, 'yt:videoId'));
    const desc = strip(xmlTag(e, 'media:description')) || '';
    return { title, id: videoId, description: desc };
  });

  const items = entries.map((it, idx) => ({
    title: it.title,
    id: it.id,
    description: it.description,
    tags: [],
    slug: `/lore#log-${String(idx).padStart(3,'0')}`
  }));

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(items, null, 2));
  console.log(`Wrote ${items.length} items → ${OUT}`);
})();
