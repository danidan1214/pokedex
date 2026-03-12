import type { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';
import type { PokemonBase, PokemonDetail } from '../../domain/models/Pokemon';
import { PokemonMapper } from '../mappers/PokemonMapper';

interface PokeApiListResponse {
  count: number;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export class PokeApiRepository implements IPokemonRepository {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  private allPokemonNames: { name: string; url: string }[] | null = null;
  private pokemonCache = new Map<string, PokemonBase>();

  async getPokemonList(limit: number, offset: number): Promise<{ results: PokemonBase[]; count: number }> {
    const response = await fetch(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
    const data: PokeApiListResponse = await response.json();
    
    const detailedPromises = data.results.map(async (p) => {
      // Return from cache if available
      if (this.pokemonCache.has(p.url)) {
        return this.pokemonCache.get(p.url)!;
      }

      const res = await fetch(p.url);
      const pokemonData = await res.json();
      const domainPokemon = PokemonMapper.toDomain(pokemonData);
      
      // Save to cache
      this.pokemonCache.set(p.url, domainPokemon);
      return domainPokemon;
    });

    const results = await Promise.all(detailedPromises);
    return { results, count: data.count };
  }

  async getPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
    const response = await fetch(`${this.baseUrl}/pokemon/${idOrName}`);
    const pokemonData = await response.json();
    
    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();

    return PokemonMapper.toDetailDomain(pokemonData, speciesData);
  }

  async searchPokemon(name: string): Promise<PokemonBase[]> {
    if (!this.allPokemonNames) {
      const response = await fetch(`${this.baseUrl}/pokemon?limit=2000`);
      const data: PokeApiListResponse = await response.json();
      this.allPokemonNames = data.results;
    }

    const term = name.toLowerCase();
    const filtered = this.allPokemonNames!
      .filter(p => p.name.includes(term) || p.url.split('/').filter(Boolean).pop() === term)
      .slice(0, 20);

    const detailedPromises = filtered.map(async (p) => {
      // Return from cache if available
      if (this.pokemonCache.has(p.url)) {
        return this.pokemonCache.get(p.url)!;
      }

      const res = await fetch(p.url);
      const pokemonData = await res.json();
      const domainPokemon = PokemonMapper.toDomain(pokemonData);
      
      // Save to cache
      this.pokemonCache.set(p.url, domainPokemon);
      return domainPokemon;
    });

    return Promise.all(detailedPromises);
  }
}
