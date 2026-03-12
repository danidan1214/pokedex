import { useQuery } from '@tanstack/react-query';
import { usePokemonRepository } from './usePokemonRepository';

export const usePokemonList = (page: number, limit: number = 20, enabled: boolean = true) => {
  const repository = usePokemonRepository();

  return useQuery({
    queryKey: ['pokemon-list', page, limit],
    queryFn: () => repository.getPokemonList(limit, page * limit),
    enabled,
  });
};

export const usePokemonDetail = (idOrName: string | number) => {
  const repository = usePokemonRepository();

  return useQuery({
    queryKey: ['pokemon-detail', idOrName],
    queryFn: () => repository.getPokemonDetail(idOrName),
    enabled: !!idOrName,
  });
};

export const useSearchPokemon = (name: string, enabled: boolean = true) => {
  const repository = usePokemonRepository();

  return useQuery({
    queryKey: ['pokemon-search', name],
    queryFn: () => repository.searchPokemon(name),
    enabled: enabled && name.length > 2,
  });
};

export const usePokemonByType = (type: string, enabled: boolean = true) => {
  const repository = usePokemonRepository();

  return useQuery({
    queryKey: ['pokemon-type', type],
    queryFn: () => repository.getPokemonByType(type),
    enabled: enabled && !!type,
  });
};
