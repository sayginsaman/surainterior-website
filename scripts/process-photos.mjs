// Turns Sura's raw photo drops into web copies under public/work/<slug>/.
// Source mapping lives in scripts/photo-sources.local.json (gitignored: the raw
// folder names are client names). Output + lib/work-manifest.json are committed.
//
//   npm run photos
import sharp from "sharp";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LONG_EDGE = 2200;
const sources = JSON.parse(await readFile(path.join(ROOT, "scripts/photo-sources.local.json"), "utf8"));

// Some exports carry black letterbox bars. Find them on a small greyscale copy
// and crop them off; never touch images whose edges are real content.
async function contentBox(file, meta) {
  const W = 400;
  const { data, info } = await sharp(file).rotate().greyscale().resize({ width: W }).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const rowDark = (y) => { let s = 0, mx = 0; for (let x = 0; x < w; x++) { const v = data[y * w + x]; s += v; mx = Math.max(mx, v); } return s / w < 10 && mx < 40; };
  const colDark = (x) => { let s = 0, mx = 0; for (let y = 0; y < h; y++) { const v = data[y * w + x]; s += v; mx = Math.max(mx, v); } return s / h < 10 && mx < 40; };
  let top = 0, bottom = h - 1, left = 0, right = w - 1;
  while (top < h / 4 && rowDark(top)) top++;
  while (bottom > (3 * h) / 4 && rowDark(bottom)) bottom--;
  while (left < w / 4 && colDark(left)) left++;
  while (right > (3 * w) / 4 && colDark(right)) right--;
  if (top === 0 && left === 0 && bottom === h - 1 && right === w - 1) return null;
  const sx = meta.width / w, sy = meta.height / h, pad = 2;
  const l = Math.round((left + (left ? pad : 0)) * sx), t = Math.round((top + (top ? pad : 0)) * sy);
  const r = Math.round((right + 1 - (right < w - 1 ? pad : 0)) * sx), b = Math.round((bottom + 1 - (bottom < h - 1 ? pad : 0)) * sy);
  return { left: l, top: t, width: Math.min(meta.width - l, r - l), height: Math.min(meta.height - t, b - t) };
}

const manifest = {};
for (const [slug, cfg] of Object.entries(sources)) {
  if (slug.startsWith("_")) continue;
  const outDir = path.join(ROOT, "public/work", slug);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  manifest[slug] = [];
  let i = 0;
  for (const name of cfg.files) {
    i++;
    const file = path.join(ROOT, cfg.dir, name);
    const meta = await sharp(file).rotate().metadata();
    const oriented = meta.orientation >= 5 ? { width: meta.height, height: meta.width } : { width: meta.width, height: meta.height };
    const box = await contentBox(file, oriented);
    let img = sharp(file).rotate();
    if (box) img = img.extract(box);
    const out = `${String(i).padStart(2, "0")}.jpg`;
    const info = await img
      .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: "inside", withoutEnlargement: true })
      .toColorspace("srgb")
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toFile(path.join(outDir, out));
    const blur = await sharp(path.join(outDir, out)).resize(16).webp({ quality: 40 }).toBuffer();
    manifest[slug].push({ src: `/work/${slug}/${out}`, w: info.width, h: info.height, blur: `data:image/webp;base64,${blur.toString("base64")}` });
    console.log(slug, out, `${info.width}x${info.height}`, box ? "trimmed" : "", Math.round(info.size / 1024) + "KB");
  }
}
await writeFile(path.join(ROOT, "lib/work-manifest.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log("manifest written");
