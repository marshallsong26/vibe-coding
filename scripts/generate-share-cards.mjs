import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const characterDirectory = path.join(root, "public", "characters");
const outputDirectory = path.join(root, "public", "share-cards");
const width = 1200;
const height = 630;

const pattern = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#fffaf2"/>
    <g opacity="0.13">
      <path d="M90 0v630M1110 0v630" stroke="#ee5426" stroke-width="14"/>
      <path d="M0 70h1200M0 560h1200" stroke="#ffc038" stroke-width="14"/>
      <path d="M185 0v630M1015 0v630" stroke="#f798bd" stroke-width="8"/>
      <path d="M0 130h1200M0 500h1200" stroke="#4b6b54" stroke-width="8"/>
    </g>
  </svg>
`);

await mkdir(outputDirectory, { recursive: true });
const files = (await readdir(characterDirectory)).filter((file) => file.endsWith("-v3.png"));

for (const file of files) {
  const slug = file.replace("-v3.png", "");
  const character = await sharp(path.join(characterDirectory, file))
    .trim()
    .resize({ width: 760, height: 520, fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();
  const metadata = await sharp(character).metadata();
  const left = Math.round((width - (metadata.width ?? 0)) / 2);
  const top = Math.round((height - (metadata.height ?? 0)) / 2);

  await sharp(pattern)
    .composite([{ input: character, left, top }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDirectory, `${slug}.png`));
}

console.log(`Generated ${files.length} share cards in ${outputDirectory}`);
