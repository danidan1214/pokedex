import { useState, useMemo } from 'react';
import { usePokemonList, useSearchPokemon } from '../usePokemon';
import { useDebounce } from '../useDebounce';

export function usePokemonUI() {
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { 
    data: listData, 
    isFetching: isListFetching,
    isLoading: isListLoading 
  } = usePokemonList(page, 20);

  const { 
    data: searchResults, 
    isLoading: isSearchLoading 
  } = useSearchPokemon(debouncedSearchTerm);

  const isSearching = debouncedSearchTerm.length > 2;
  const isLoading = isSearching ? isSearchLoading : isListLoading;

  const displayPokemon = useMemo(() => {
    if (isSearching) {
      return searchResults || [];
    }
    return listData?.results || [];
  }, [isSearching, searchResults, listData]);

  const totalCount = listData?.count || 0;
  const totalPages = Math.ceil(totalCount / 20);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (page !== 0) setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return {
    selectedId,
    setSelectedId,
    searchTerm,
    page,
    isSearching,
    isLoading,
    isListFetching,
    displayPokemon,
    totalPages,
    handlePageChange,
    handleSearchChange,
    handleClearSearch,
  };
}
