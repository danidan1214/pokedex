/**
 * End-to-end smoke test run against `vite preview`.
 *
 * Proves the N+1 detail fan-out to pokeapi.co is gone:
 *  - the list loads from the local dataset (/data/pokemon.min.json), once
 *  - ZERO requests to pokeapi.co while loading/listing/searching/filtering
 *  - the per-pokemon detail endpoint is only hit when a modal is opened
 *  - on mobile viewport the list uses the tiny 96px sprites (the mobile win)
 *
 * Run: npm run preview -- --port 4179 &  node scripts/e2e-smoke.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.E2E_BASE || 'http://localhost:4179';

let failures = 0;
const assert = (cond, msg) => {
  if (cond) console.log(`  ✓ ${msg}`);
  else { console.error(`  ✗ ${msg}`); failures++; }
};

const browser = await chromium.launch();

// Helper: count requests to pokeapi.co over the lifetime of `page`.
function trackPokeApi(page) {
  let count = 0;
  let since = 0;
  page.on('request', (req) => {
    try { if (new URL(req.url()).hostname === 'pokeapi.co') { count++; } } catch {}
  });
  return {
    total: () => count,
    reset: () => { since = count; },
    since: () => count - since,
  };
}

// ---------------------------------------------------------------------------
// DESKTOP: list/search/type/modal via the accessible desktop UI
// ---------------------------------------------------------------------------
console.log(`\n[desktop] open ${BASE} at 1280×900`);
const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const api = trackPokeApi(desktop);
const recorded = [];
desktop.on('request', (r) => recorded.push(r.url()));
await desktop.goto(BASE, { waitUntil: 'networkidle' });

const datasetHits = recorded.filter((u) => u.includes('/data/pokemon.min.json'));
assert(datasetHits.length === 1, `dataset loaded once (got ${datasetHits.length})`);
assert(api.since() === 0, `zero pokeapi.co requests on initial load (got ${api.since()})`);

const bulbasaur = await desktop.locator('h3', { hasText: 'bulbasaur' }).count();
assert(bulbasaur > 0, 'bulbasaur card rendered from dataset');

console.log('\n[desktop] search stays offline');
api.reset();
await desktop.locator('input[type="text"]').first().fill('char');
await desktop.waitForTimeout(600);
assert((await desktop.locator('h3', { hasText: 'charmander' }).count()) > 0, 'search "char" shows charmander');
assert(api.since() === 0, `search did not hit pokeapi.co (got ${api.since()})`);
await desktop.locator('input[type="text"]').first().fill('');
await desktop.waitForTimeout(600);

console.log('\n[desktop] type filter stays offline');
api.reset();
await desktop.locator('button', { hasText: 'Tipos' }).first().click();
await desktop.waitForTimeout(300);
await desktop.locator('button', { hasText: 'Fuego' }).first().click();
await desktop.waitForTimeout(500);
assert((await desktop.locator('h3').count()) > 0, 'type "fire" shows results');
assert(api.since() === 0, `type filter did not hit pokeapi.co (got ${api.since()})`);

console.log('\n[desktop] modal fetches detail (expected, one pokemon)');
api.reset();
await desktop.locator('h3').first().click();
await desktop.waitForTimeout(1800);
assert((await desktop.locator('text=Acerca de').count()) > 0, 'modal opens with "Acerca de"');
assert((await desktop.locator('text=Velocidad').count()) > 0, 'modal renders base stats');
assert(api.since() > 0, `modal fetched detail from pokeapi.co (got ${api.since()}, expected > 0)`);
await desktop.keyboard.press('Escape');
await desktop.waitForTimeout(300);

console.log('\n[desktop] dark mode persists across reload (anti-FOUC)');
await desktop.evaluate(() => localStorage.setItem('pokedex-theme', 'dark'));
await desktop.reload({ waitUntil: 'networkidle' });
const hasDarkClass = await desktop.evaluate(() => document.documentElement.classList.contains('dark'));
assert(hasDarkClass, 'dark class applied from stored preference before paint');
// restore to system so the shared browser context is not left in dark
await desktop.evaluate(() => localStorage.setItem('pokedex-theme', 'system'));

// ---------------------------------------------------------------------------
// MOBILE: list view forced, thumbnails must be the 96px sprites
// ---------------------------------------------------------------------------
console.log('\n[mobile] open at 375×812');
const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
const mApi = trackPokeApi(mobile);
const mUrls = [];
mobile.on('request', (r) => mUrls.push(r.url()));
await mobile.goto(BASE, { waitUntil: 'networkidle' });

assert(mApi.total() === 0, `mobile initial load hits pokeapi.co zero times (got ${mApi.total()})`);
const mDataset = mUrls.filter((u) => u.includes('/data/pokemon.min.json'));
assert(mDataset.length === 1, `mobile loads dataset once (got ${mDataset.length})`);

// Wait for list thumbnails to render.
await mobile.waitForSelector('img[src*="/sprites/pokemon/"]', { timeout: 5000 });
const spriteImgs = await mobile.locator('img[src*="/sprites/pokemon/"]').count();
const heavyImgs = await mobile.locator('img[src*="/official-artwork/"], img[src*="/other/home/"]').count();
assert(spriteImgs > 0, `mobile list uses 96px sprites (${spriteImgs} found)`);
assert(heavyImgs === 0, `mobile list has zero heavy artwork images (got ${heavyImgs})`);

// Confirm a sprite src is the lightweight path (no /other/).
const oneSrc = await mobile.locator('img[src*="/sprites/pokemon/"]').first().getAttribute('src');
assert(oneSrc.includes('/sprites/pokemon/') && !oneSrc.includes('/other/'), `sprite src is the 96px variant (${oneSrc})`);

await browser.close();
console.log(`\n${failures === 0 ? '✅ All e2e assertions passed' : `❌ ${failures} e2e assertion(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);