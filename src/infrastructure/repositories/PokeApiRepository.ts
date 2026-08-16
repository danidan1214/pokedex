import type { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';
import type { PokemonBase, PokemonDetail } from '../../domain/models/Pokemon';
import { PokemonMapper, type LocalPokemonEntry } from '../mappers/PokemonMapper';

interface LocalDataset {
  count: number;
  pokemon: LocalPokemonEntry[];
}

export class PokeApiRepository implements IPokemonRepository {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  private localDataset: LocalDataset | null = null;
  private localDatasetPromise: Promise<LocalDataset> | null = null;

  /**
   * Loads the minimal local dataset (one request, ~25 KB gzipped) and caches
   * it for the session. This replaces the previous N+1 detail fan-out that
   * downloaded ~270 KB per pokemon just to render the list.
   *
   * The in-flight promise is cached too so concurrent callers (e.g. when the
   * items-per-page state changes right after mount) share a single request.
   */
  private getLocalDataset(): Promise<LocalDataset> {
    if (this.localDataset) return Promise.resolve(this.localDataset);
    if (!this.localDatasetPromise) {
      this.localDatasetPromise = fetch('/data/pokemon.min.json')
        .then((response) => response.json())
        .then((data) => {
          this.localDataset = data as LocalDataset;
          return data as LocalDataset;
        });
    }
    return this.localDatasetPromise;
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
    const dataset = await this.getLocalDataset();
    const term = name.toLowerCase();

    const filtered = dataset.pokemon
      .filter((p) => p.name.includes(term) || String(p.id) === term)
      .slice(0, 20);

    return filtered.map((entry) => PokemonMapper.fromLocal(entry));
  }

  async getPokemonByType(type: string): Promise<PokemonBase[]> {
    const dataset = await this.getLocalDataset();
    const term = type.toLowerCase();

    const filtered = dataset.pokemon
      .filter((p) => p.types.some((t) => t.toLowerCase() === term))
      .slice(0, 40);

    return filtered.map((entry) => PokemonMapper.fromLocal(entry));
  }
}