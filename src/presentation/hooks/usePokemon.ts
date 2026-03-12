import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { usePokemonRepository } from './usePokemonRepository';

export const usePokemonList = (limit: number = 20) => {
  const repository = usePokemonRepository();

  return useInfiniteQuery({
    queryKey: ['pokemon-list'],
    queryFn: ({ pageParam = 0 }) => repository.getPokemonList(limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < limit ? undefined : allPages.length * limit;
    },
    initialPageParam: 0,
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
