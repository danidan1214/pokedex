import type { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';
import type { PokemonBase, PokemonDetail } from '../../domain/models/Pokemon';
import { PokemonMapper, type LocalPokemonEntry } from '../mappers/PokemonMapper';

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

interface LocalDataset {
  count: number;
  pokemon: LocalPokemonEntry[];
}

export class PokeApiRepository implements IPokemonRepository {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  private static MAX_CACHE_SIZE = 200;
  private allPokemonNames: { name: string; url: string }[] | null = null;
  private pokemonCache = new Map<string, PokemonBase>();
  private localDataset: LocalDataset | null = null;

  private setCache(key: string, value: PokemonBase): void {
    this.pokemonCache.set(key, value);
    if (this.pokemonCache.size > PokeApiRepository.MAX_CACHE_SIZE) {
      const firstKey = this.pokemonCache.keys().next().value;
      if (firstKey !== undefined) {
        this.pokemonCache.delete(firstKey);
      }
    }
  }

  /**
   * Loads the minimal local dataset (one request, ~25 KB gzipped) and caches
   * it for the session. This replaces the previous N+1 detail fan-out that
   * downloaded ~270 KB per pokemon just to render the list.
   */
  private async getLocalDataset(): Promise<LocalDataset> {
    if (this.localDataset) return this.localDataset;
    const response = await fetch('/data/pokemon.min.json');
    const data = (await response.json()) as LocalDataset;
    this.localDataset = data;
    return data;
  }

  async getPokemonList(limit: number, offset: number): Promise<{ results: PokemonBase[]; count: number }> {
    const dataset = await this.getLocalDataset();
    const slice = dataset.pokemon.slice(offset, offset + limit);
    const results = slice.map((entry) => PokemonMapper.fromLocal(entry));
    return { results, count: dataset.count };
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