import { readFile, writeFile, mkdir, rename, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const catalogue = JSON.parse(await readFile(resolve(root, "src/lib/image-catalogue.json"), "utf8"));
const manifestPath = resolve(root, "src/lib/local-images.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const output = resolve(root, "public/images");
const force = process.argv.includes("--refresh");
await mkdir(output, { recursive: true });

function imageExtension(bytes) {
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "png";
  throw new Error("The response is not a supported image (HTML error pages are rejected).");
}

async function download(key, photo, width) {
  const height = Math.round(width * photo.height / photo.width);
  const url = new URL(`https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg`);
  url.search = new URLSearchParams({ auto: "compress", cs: "tinysrgb", fm: "webp", fit: "crop", w: String(width), h: String(height), q: "82" }).toString();
  let lastError;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(15000),
        headers: { Accept: "image/webp,image/jpeg,image/png" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.headers.get("content-type")?.startsWith("image/")) throw new Error("Not an image response.");
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 512 || bytes.length > 15 * 1024 * 1024) throw new Error("Unexpected image size.");
      const extension = imageExtension(bytes);
      const file = `images/${key}-${width}.${extension}`;
      await writeFile(resolve(root, "public", file), bytes);
      return { file, width };
    } catch (error) {
      lastError = error;
      if (attempt === 0) await new Promise((done) => setTimeout(done, 600));
    }
  }
  throw lastError;
}

async function cached(entry) {
  if (!entry?.file || !entry.variants?.length) return false;
  try {
    const files = new Set([entry.file, ...entry.variants.map((variant) => variant.file)]);
    return (await Promise.all([...files].map(async (file) => (await stat(resolve(root, "public", file))).size > 512))).every(Boolean);
  } catch { return false; }
}

const queue = Object.entries(catalogue);
const failures = [];
let succeeded = 0;
async function worker() {
  while (queue.length) {
    const [key, photo] = queue.shift();
    try {
      if (!force && await cached(manifest[key])) {
        succeeded++;
        console.log(`Cached: ${key}`);
        continue;
      }
      const widths = [...new Set([Math.min(800, photo.width), photo.width])];
      const variants = [];
      for (const width of widths) variants.push(await download(key, photo, width));
      manifest[key] = { file: variants[variants.length - 1].file, variants };
      succeeded++;
      console.log(`Saved: ${key}`);
    } catch (error) {
      failures.push(key);
      if (!await cached(manifest[key])) delete manifest[key];
      console.error(`Failed: ${key}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

await Promise.all([worker(), worker(), worker()]);
// Publish the manifest only after complete, validated files exist on disk.
await writeFile(`${manifestPath}.tmp`, `${JSON.stringify(manifest, null, 2)}\n`);
await rename(`${manifestPath}.tmp`, manifestPath);
console.log(`${succeeded}/${Object.keys(catalogue).length} images available locally.`);
if (failures.length) {
  console.error(`Review these source images before publishing: ${failures.join(", ")}`);
  process.exitCode = 1;
}