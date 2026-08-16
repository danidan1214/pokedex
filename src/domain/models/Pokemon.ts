export interface PokemonType {
  name: string;
  url: string;
}

export interface PokemonBase {
  id: number;
  name: string;
  image: string;
  /** Small 96px sprite, used in the list/mobile thumbnails. */
  sprite?: string;
  types: string[];
  isLegendary?: boolean;
  isMythic?: boolean;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonDetail extends PokemonBase {
  height: number;
  weight: number;
  abilities: string[];
  stats: PokemonStats;
  description?: string;
}
