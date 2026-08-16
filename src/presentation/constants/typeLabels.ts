export interface PokemonTypeMeta {
  id: string;
  label: string;
  icon: string;
}

// 'all' = ✦ Todos (clears the type filter) + the 18 Pokémon types in Spanish.
export const POKEMON_TYPES: PokemonTypeMeta[] = [
  { id: 'all', label: 'Todos', icon: '✦' },
  { id: 'normal', label: 'Normal', icon: '◆' },
  { id: 'fire', label: 'Fuego', icon: '🔥' },
  { id: 'water', label: 'Agua', icon: '💧' },
  { id: 'grass', label: 'Planta', icon: '🌿' },
  { id: 'electric', label: 'Eléctrico', icon: '⚡' },
  { id: 'ice', label: 'Hielo', icon: '❄️' },
  { id: 'fighting', label: 'Lucha', icon: '🥊' },
  { id: 'poison', label: 'Veneno', icon: '☠️' },
  { id: 'ground', label: 'Tierra', icon: '🏔️' },
  { id: 'flying', label: 'Volador', icon: '🕊️' },
  { id: 'psychic', label: 'Psíquico', icon: '🔮' },
  { id: 'bug', label: 'Bicho', icon: '🐛' },
  { id: 'rock', label: 'Roca', icon: '🪨' },
  { id: 'ghost', label: 'Fantasma', icon: '👻' },
  { id: 'dragon', label: 'Dragón', icon: '🐉' },
  { id: 'dark', label: 'Siniestro', icon: '🌑' },
  { id: 'steel', label: 'Acero', icon: '⚙️' },
  { id: 'fairy', label: 'Hada', icon: '✨' },
];

// Type colors light enough that white text fails contrast — use dark text on them.
export const LIGHT_TYPES = new Set(['electric', 'ice', 'ground', 'normal']);

export const getTypeMeta = (id: string | null): PokemonTypeMeta | undefined =>
  id ? POKEMON_TYPES.find((t) => t.id === id) : undefined;