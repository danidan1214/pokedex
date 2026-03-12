import { useState, useMemo, useCallback } from 'react';
import { usePokemonList, useSearchPokemon } from '../usePokemon';
import { useDebounce } from '../useDebounce';

export function usePokemonUI() {
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const isSearching = debouncedSearchTerm.length > 2;

  const { 
    data: listData, 
    isFetching: isListFetching,
    isLoading: isListLoading 
  } = usePokemonList(page, 20, !isSearching);

  const { 
    data: searchResults, 
    isLoading: isSearchLoading 
  } = useSearchPokemon(debouncedSearchTerm, isSearching);

  const isLoading = isSearching ? isSearchLoading : isListLoading;

  const displayPokemon = useMemo(() => {
    if (isSearching) {
      return searchResults || [];
    }
    return listData?.results || [];
  }, [isSearching, searchResults, listData]);

  const totalCount = listData?.count || 0;
  const totalPages = Math.ceil(totalCount / 20);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleSelectPokemon = useCallback((id: number | string) => {
    setSelectedId(id);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedId(null);
  }, []);

  return {
    selectedId,
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
    handleSelectPokemon,
    handleCloseModal,
  };
}
