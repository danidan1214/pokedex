import { useState, useMemo, useCallback, useEffect } from 'react';
import { usePokemonList, useSearchPokemon, usePokemonByType } from '../usePokemon';
import { useDebounce } from '../useDebounce';

export function usePokemonUI() {
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  useEffect(() => {
    // Determine initial view and items per page based on screen size
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      setViewMode(isMobile ? 'list' : 'grid');
      setItemsPerPage(isMobile ? 10 : 20);
    }
  }, []);
  
  const handleToggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  }, []);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const isSearching = debouncedSearchTerm.length > 2;
  const isFilteringByType = !!selectedType && !isSearching;

  const { 
    data: listData, 
    isFetching: isListFetching,
    isLoading: isListLoading 
  } = usePokemonList(page, itemsPerPage, !isSearching && !selectedType);

  const { 
    data: searchResults, 
    isLoading: isSearchLoading 
  } = useSearchPokemon(debouncedSearchTerm, isSearching);

  const {
    data: typeResults,
    isLoading: isTypeLoading
  } = usePokemonByType(selectedType || '', isFilteringByType);

  const isLoading = isSearching 
    ? isSearchLoading 
    : isFilteringByType 
      ? isTypeLoading 
      : isListLoading;

  const displayPokemon = useMemo(() => {
    if (isSearching) return searchResults || [];
    if (isFilteringByType) return typeResults || [];
    return listData?.results || [];
  }, [isSearching, isFilteringByType, searchResults, typeResults, listData]);

  const totalCount = listData?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setSelectedType(null); // Clear type filter when searching
    setPage(0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleTypeClick = useCallback((type: string) => {
    setSelectedType(prev => prev === type ? null : type);
    setSearchTerm(''); // Clear search when filtering by type
    setPage(0);
  }, []);

  const handleClearType = useCallback(() => {
    setSelectedType(null);
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
    selectedType,
    page,
    isSearching,
    isFilteringByType,
    isLoading,
    isListFetching,
    displayPokemon,
    totalPages,
    handlePageChange,
    handleSearchChange,
    handleClearSearch,
    handleTypeClick,
    handleClearType,
    handleSelectPokemon,
    handleCloseModal,
    viewMode,
    handleToggleViewMode,
  };
}
