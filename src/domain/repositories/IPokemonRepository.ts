import type { PokemonBase, PokemonDetail } from '../models/Pokemon';

export interface IPokemonRepository {
  getPokemonList(limit: number, offset: number): Promise<PokemonBase[]>;
  getPokemonDetail(idOrName: string | number): Promise<PokemonDetail>;
  searchPokemon(name: string): Promise<PokemonBase[]>;
}
