import type { PokemonBase, PokemonDetail, PokemonStats } from '../../domain/models/Pokemon';

interface ApiPokemonBase {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

interface ApiPokemonDetail extends ApiPokemonBase {
  height: number;
  weight: number;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

interface ApiSpecies {
  is_legendary: boolean;
  is_mythic: boolean;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
}

export class PokemonMapper {
  static toDomain(apiData: ApiPokemonBase): PokemonBase {
    return {
      id: apiData.id,
      name: apiData.name,
      image: apiData.sprites.other['official-artwork'].front_default || apiData.sprites.front_default,
      types: apiData.types.map((t) => t.type.name),
    };
  }

  static toDetailDomain(apiData: ApiPokemonDetail, speciesData?: ApiSpecies): PokemonDetail {
    const findStat = (name: string) => apiData.stats.find((s) => s.stat.name === name)?.base_stat || 0;

    const stats: PokemonStats = {
      hp: findStat('hp'),
      attack: findStat('attack'),
      defense: findStat('defense'),
      specialAttack: findStat('special-attack'),
      specialDefense: findStat('special-defense'),
      speed: findStat('speed'),
    };

    const description = speciesData?.flavor_text_entries.find(
      (entry) => entry.language.name === 'es'
    )?.flavor_text.replace(/[\n\f]/g, ' ') || speciesData?.flavor_text_entries.find(
      (entry) => entry.language.name === 'en'
    )?.flavor_text.replace(/[\n\f]/g, ' ');

    return {
      ...this.toDomain(apiData),
      height: apiData.height / 10, // decimeters to meters
      weight: apiData.weight / 10, // hectograms to kg
      abilities: apiData.abilities.map((a) => a.ability.name),
      stats,
      description,
      isLegendary: speciesData?.is_legendary,
      isMythic: speciesData?.is_mythic,
    };
  }
}
