/**
 * Builds a minimal pokemon dataset used by the list, search and type
 * filtering features so the app no longer needs the N+1 detail fan-out
 * against PokeAPI at runtime.
 *
 * Output: public/data/pokemon.min.json
 * Shape: { count: number, pokemon: Array<{ id, name, types, sprite, image }> }
 *
 * Run with: npm run gen:data
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://pokeapi.co/api/v2';
const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const CONCURRENCY = 20;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '..', 'public', 'data', 'pokemon.min.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(500 * attempt);
    }
  }
}

function buildUrls(id) {
  return {
    // 96px sprite, ~0.5 KB: ideal for list/mobile thumbnails
    sprite: `${SPRITE_BASE}/${id}.png`,
    // 512px home artwork, ~140 KB: used for the grid view on desktop
    image: `${SPRITE_BASE}/other/home/${id}.png`,
  };
}

async function mapDetail(url) {
  const data = await fetchJson(url);
  const types = data.types.map((t) => t.type.name);
  return {
    id: data.id,
    name: data.name,
    types,
    ...buildUrls(data.id),
  };
}

async function pool(items, worker, size) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await worker(items[index], index);
      }
    }),
  );
  return results;
}

async function main() {
  process.stdout.write('Fetching pokemon index...\n');
  const list = await fetchJson(`${BASE_URL}/pokemon?limit=2000`);
  const entries = list.results; // [{ name, url }]
  process.stdout.write(`Found ${entries.length} pokemon. Fetching details...\n`);

  let done = 0;
  const pokemon = await pool(
    entries,
    async (entry) => {
      const item = await mapDetail(entry.url);
      done++;
      if (done % 50 === 0 || done === entries.length) {
        process.stdout.write(`  ${done}/${entries.length}\n`);
      }
      return item;
    },
    CONCURRENCY,
  );

  pokemon.sort((a, b) => a.id - b.id);

  const payload = { count: pokemon.length, pokemon };
  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(payload), 'utf8');

  const bytes = Buffer.byteLength(JSON.stringify(payload), 'utf8');
  process.stdout.write(
    `Wrote ${OUTPUT} (${pokemon.length} entries, ~${Math.round(bytes / 1024)} KB)\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});