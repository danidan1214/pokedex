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

interface PokeApiTypeResponse {
  pokemon: Array<{
    pokemon: {
      name: string;
      url: string;
    };
  }>;
}

export class PokeApiRepository implements IPokemonRepository {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  private static MAX_CACHE_SIZE = 200;
  private allPokemonNames: { name: string; url: string }[] | null = null;
  private pokemonCache = new Map<string, PokemonBase>();

  private setCache(key: string, value: PokemonBase): void {
    this.pokemonCache.set(key, value);
    if (this.pokemonCache.size > PokeApiRepository.MAX_CACHE_SIZE) {
      const firstKey = this.pokemonCache.keys().next().value;
      if (firstKey !== undefined) {
        this.pokemonCache.delete(firstKey);
      }
    }
  }

  async getPokemonList(limit: number, offset: number): Promise<{ results: PokemonBase[]; count: number }> {
    const response = await fetch(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
    const data: PokeApiListResponse = await response.json();

    const detailedPromises = data.results.map(async (p) => {
      if (this.pokemonCache.has(p.url)) {
        return this.pokemonCache.get(p.url)!;
      }

      const res = await fetch(p.url);
      const pokemonData = await res.json();
      const domainPokemon = PokemonMapper.toDomain(pokemonData);

      this.setCache(p.url, domainPokemon);
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
      if (this.pokemonCache.has(p.url)) {
        return this.pokemonCache.get(p.url)!;
      }

      const res = await fetch(p.url);
      const pokemonData = await res.json();
      const domainPokemon = PokemonMapper.toDomain(pokemonData);

      this.setCache(p.url, domainPokemon);
      return domainPokemon;
    });

    return Promise.all(detailedPromises);
  }

  async getPokemonByType(type: string): Promise<PokemonBase[]> {
    const response = await fetch(`${this.baseUrl}/type/${type.toLowerCase()}`);
    const data: PokeApiTypeResponse = await response.json();

    const limitedResults = data.pokemon.slice(0, 40).map(p => p.pokemon);

    const detailedPromises = limitedResults.map(async (p) => {
      if (this.pokemonCache.has(p.url)) {
        return this.pokemonCache.get(p.url)!;
      }

      const res = await fetch(p.url);
      const pokemonData = await res.json();
      const domainPokemon = PokemonMapper.toDomain(pokemonData);

      this.setCache(p.url, domainPokemon);
      return domainPokemon;
    });

    return Promise.all(detailedPromises);
  }
}