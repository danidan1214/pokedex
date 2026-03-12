import type { PokemonBase, PokemonDetail } from '../models/Pokemon';

export interface IPokemonRepository {
  getPokemonList(limit: number, offset: number): Promise<{ results: PokemonBase[]; count: number }>;
  getPokemonDetail(idOrName: string | number): Promise<PokemonDetail>;
  searchPokemon(name: string): Promise<PokemonBase[]>;
  getPokemonByType(type: string): Promise<PokemonBase[]>;
}
