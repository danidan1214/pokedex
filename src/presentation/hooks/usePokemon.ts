import { useQuery } from '@tanstack/react-query';
import { usePokemonRepository } from './usePokemonRepository';

export const usePokemonList = (page: number, limit: number = 20) => {
  const repository = usePokemonRepository();

  return useQuery({
    queryKey: ['pokemon-list', page, limit],
    queryFn: () => repository.getPokemonList(limit, page * limit),
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

export const useSearchPokemon = (name: string) => {
  const repository = usePokemonRepository();

  return useQuery({
    queryKey: ['pokemon-search', name],
    queryFn: () => repository.searchPokemon(name),
    enabled: name.length > 2,
  });
};
