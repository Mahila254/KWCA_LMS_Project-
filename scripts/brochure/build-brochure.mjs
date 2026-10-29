// Prints scripts/brochure/brochure.html to the one-page PDF the homepage
// links to, using the Microsoft Edge that ships with Windows (headless).
//
//   node scripts/brochure/build-brochure.mjs            -> PDF
//   node scripts/brochure/build-brochure.mjs --preview  -> also a PNG to check the layout
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const source = pathToFileURL(join(here, "brochure.html")).href;
const outDir = join(root, "public", "brochure");
const pdf = join(outDir, "kwca-learning-hub-brochure.pdf");

const edge = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);

if (!edge) {
  console.error("Microsoft Edge not found; install it or edit the path above.");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const common = [
  "--headless=new",
  "--disable-gpu",
  "--allow-file-access-from-files",
  // Gives the Google Fonts time to load before printing.
  "--virtual-time-budget=15000",
];

execFileSync(edge, [...common, "--no-pdf-header-footer", `--print-to-pdf=${pdf}`, source], {
  stdio: "inherit",
});
console.log(`Brochure written to ${pdf}`);

if (process.argv.includes("--preview")) {
  const png = join(here, "preview.png");
  // A4 at 96 dpi.
  execFileSync(edge, [...common, "--window-size=794,1123", `--screenshot=${png}`, source], {
    stdio: "inherit",
  });
  console.log(`Preview written to ${png}`);
}
