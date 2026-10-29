// Shrinks the site photos in public/images in place (same file names, so
// nothing that links to them changes). The originals were 4000-6500px
// camera files of 2-9 MB each; no page shows them wider than ~1400px.
// Safe to re-run: images already at or below the target width are only
// re-saved if that makes them smaller.
//
//   node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const dir = "public/images";

// Full-bleed hero backgrounds need more pixels than cards and side photos.
const widths = {
  "hero-background.jpg": 2400,
};
const defaultWidth = 1600;

for (const name of await readdir(dir)) {
  if (!/\.jpe?g$/i.test(name)) continue;

  const file = path.join(dir, name);
  const before = (await stat(file)).size;
  const input = await readFile(file);

  const output = await sharp(input)
    .rotate() // apply camera orientation before metadata is dropped
    .resize({ width: widths[name] ?? defaultWidth, withoutEnlargement: true })
    .jpeg({ quality: 78, progressive: true, mozjpeg: true })
    .toBuffer();

  if (output.length < before) {
    await writeFile(file, output);
  }

  const after = Math.min(output.length, before);
  console.log(
    `${name}: ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e3).toFixed(0)} KB`
  );
}
