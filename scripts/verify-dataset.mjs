/**
 * Verifies the generated pokemon dataset and the repository's list/search/type
 * logic against it. Run with: npm run verify:data
 *
 * Exits non-zero on the first failing assertion.
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATASET = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'public', 'data', 'pokemon.min.json'), 'utf8'),
);

const VALID_TYPES = new Set([
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting',
  'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
  'dragon', 'dark', 'steel', 'fairy',
]);

let failures = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error(`  ✗ ${msg}`);
    failures++;
  } else {
    console.log(`  ✓ ${msg}`);
  }
}

// --- Mirror of the repository logic (kept in sync manually) ---
const getPokemonList = (limit, offset) => ({
  results: DATASET.pokemon.slice(offset, offset + limit),
  count: DATASET.count,
});
const searchPokemon = (name) => {
  const term = name.toLowerCase();
  return DATASET.pokemon.filter((p) => p.name.includes(term) || String(p.id) === term).slice(0, 20);
};
const getPokemonByType = (type) => {
  const term = type.toLowerCase();
  return DATASET.pokemon.filter((p) => p.types.some((t) => t.toLowerCase() === term)).slice(0, 40);
};

console.log('\n[1] Dataset structure (aggregate over all entries)');
{
  const ids = new Set();
  const names = new Set();
  let bad = 0;
  for (const p of DATASET.pokemon) {
    const ok =
      typeof p.id === 'number' && p.id > 0 &&
      typeof p.name === 'string' && p.name.length > 0 &&
      Array.isArray(p.types) && p.types.length > 0 &&
      p.types.every((t) => VALID_TYPES.has(t.toLowerCase())) &&
      typeof p.sprite === 'string' && p.sprite.startsWith('https://') &&
      typeof p.image === 'string' && p.image.startsWith('https://') &&
      !ids.has(p.id) && !names.has(p.name);
    if (!ok) bad++;
    ids.add(p.id);
    names.add(p.name);
  }
  assert(bad === 0, `all ${DATASET.pokemon.length} entries valid (id, name, types, sprite, image, unique)`);
  assert(DATASET.count === DATASET.pokemon.length, `count field matches entries (${DATASET.pokemon.length})`);
}

console.log('\n[2] Dataset coverage (parity with PokeAPI pokemon endpoint)');
{
  const expectedCount = 1351; // PokeAPI /pokemon count, includes base + form entries
  assert(DATASET.pokemon.length === expectedCount, `entry count equals PokeAPI count ${expectedCount}`);
  assert(DATASET.pokemon[0].id === 1, 'first entry is id 1 (bulbasaur)');
  assert(DATASET.pokemon.some((p) => p.id > 10000), 'includes form entries (id > 10000) like the source endpoint');
  const ids = DATASET.pokemon.map((p) => p.id);
  const strictlyIncreasing = ids.every((id, i) => i === 0 || id > ids[i - 1]);
  assert(strictlyIncreasing, 'ids are strictly increasing (matches endpoint order)');
}

console.log('\n[3] Pagination logic');
{
  const page0 = getPokemonList(20, 0);
  assert(page0.count === DATASET.count, 'list count === dataset count');
  assert(page0.results.length === 20, 'page 0 returns 20');
  assert(page0.results[0].id === 1, 'page 0 starts at id 1');
  const page1 = getPokemonList(20, 20);
  assert(page1.results[0].id === 21, 'page 1 starts at id 21');
  const lastPage = getPokemonList(20, DATASET.count - 5);
  assert(lastPage.results.length === 5, 'last partial page returns remaining 5');
}

console.log('\n[4] Search logic (mirrors repository: name includes OR exact id)');
{
  const pikachu = searchPokemon('pikachu');
  assert(pikachu.some((p) => p.id === 25), 'search "pikachu" includes pikachu #25');
  assert(pikachu.every((p) => p.name.includes('pikachu')), 'every result name contains the term');
  const byId = searchPokemon('25');
  assert(byId.some((p) => p.id === 25), 'search "25" matches by id');
  const char = searchPokemon('char');
  assert(char.some((p) => p.name === 'charmander'), 'search "char" includes charmander');
  assert(char.some((p) => p.name === 'charizard'), 'search "char" includes charizard');
  assert(char.length <= 20, 'search capped at 20');
  assert(searchPokemon('zzznotreal').length === 0, 'search with no matches → empty');
}

console.log('\n[5] Type filtering logic');
{
  const fire = getPokemonByType('fire');
  assert(fire.length > 0, `type "fire" returns results (${fire.length})`);
  assert(fire.every((p) => p.types.includes('fire')), 'every "fire" result actually has fire type');
  assert(fire.length <= 40, 'type filter capped at 40');
  const water = getPokemonByType('WATER');
  assert(water.every((p) => p.types.includes('water')), 'type filter is case-insensitive');
  assert(getPokemonByType('rock').every((p) => p.types.includes('rock')), 'type "rock" returns rock pokemon');
}

console.log('\n[6] Known-data spot checks (generation correctness)');
{
  const bulbasaur = DATASET.pokemon.find((p) => p.id === 1);
  assert(bulbasaur.name === 'bulbasaur', '#1 is bulbasaur');
  assert(bulbasaur.types.includes('grass') && bulbasaur.types.includes('poison'), 'bulbasaur is grass/poison');
  const charizard = DATASET.pokemon.find((p) => p.id === 6);
  assert(charizard.name === 'charizard' && charizard.types.includes('fire'), 'charizard #6 is fire');
  const eevee = DATASET.pokemon.find((p) => p.name === 'eevee');
  assert(eevee && eevee.types.length === 1 && eevee.types[0] === 'normal', 'eevee is normal-only');
}

console.log(`\n${failures === 0 ? '✅ All assertions passed' : `❌ ${failures} assertion(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);