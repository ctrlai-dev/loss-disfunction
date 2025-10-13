# scripts/playlist_to_tracks.py
import os, json, requests
from pathlib import Path
from xml.etree import ElementTree as ET

PLAYLIST_ID = os.environ.get("PLAYLIST_ID") or input("Enter playlist ID: ").strip()
if not PLAYLIST_ID:
    raise SystemExit("No PLAYLIST_ID provided")

RSS_URL = f"https://www.youtube.com/feeds/videos.xml?playlist_id={PLAYLIST_ID}"
headers = {"User-Agent": "Mozilla/5.0"}

resp = requests.get(RSS_URL, headers=headers, timeout=20)
resp.raise_for_status()

# Namespaces: Atom (default), YouTube, Media RSS
ns = {
    "atom": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
    "media": "http://search.yahoo.com/mrss/",
}

root = ET.fromstring(resp.text)
entries = root.findall("atom:entry", ns)  # ← correct
if not entries:
    print("No <entry> elements found. Is the playlist public and ID correct?")
    # helpful debug:
    feed_title = root.findtext("atom:title", default="(no feed title)", namespaces=ns)
    print("Feed title:", feed_title)
    # bail without writing an empty file
    raise SystemExit(1)

tracks = []
for idx, entry in enumerate(entries):
    title = entry.findtext("atom:title", default="", namespaces=ns).strip()
    vid_el = entry.find("yt:videoId", ns)
    video_id = (vid_el.text if vid_el is not None else "").strip()
    # media:description is inside media:group
    desc_el = entry.find("media:group/media:description", ns)
    description = (desc_el.text or "").strip() if desc_el is not None else ""
    # optional: thumbnail + publishedAt
    thumb_el = entry.find("media:group/media:thumbnail", ns)
    thumbnail = thumb_el.attrib.get("url") if thumb_el is not None else None
    published_at = entry.findtext("atom:published", default="", namespaces=ns)

    tracks.append({
        "title": title,
        "id": video_id,
        "description": description,
        "tags": [],
        "slug": f"/lore#log-{str(idx).zfill(3)}",
        "cover": thumbnail,
        "publishedAt": published_at,
    })

# Write to project-root/src/data/tracks.json
project_root = Path(__file__).resolve().parents[1]
out_path = project_root / "src" / "data" / "tracks.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(tracks, f, indent=2)

print(f"Wrote {len(tracks)} items → {out_path}")
