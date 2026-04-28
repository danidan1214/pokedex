import { memo, useState, useEffect, useRef } from 'react';
import { Search, X, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { TypeGrid } from './TypeGrid';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  selectedType: string | null;
  onTypeClick: (type: string) => void;
  viewMode: 'grid' | 'list';
  onToggleViewMode: () => void;
}

export const Header = memo(({ searchTerm, onSearchChange, onClearSearch, selectedType, onTypeClick, viewMode, onToggleViewMode }: HeaderProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on click outside or Escape — keeps selected type
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showFilters && navRef.current && !navRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [showFilters]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleToggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const handleTypeClickAndClose = (type: string) => {
    onTypeClick(type);
    setShowFilters(false);
    setMobileMenuOpen(false);
  };

  const showTypeFilter = showFilters;
  const hasActiveFilters = !!(selectedType || searchTerm);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/60'
            : 'bg-white/50 backdrop-blur-md border-b border-slate-100/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-14 md:h-16 gap-3 md:gap-6">

            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200/50 rotate-3 group-hover:rotate-6 transition-transform duration-300">
                <div className="w-4.5 h-4.5 md:w-5 md:h-5 border-[2.5px] border-white rounded-full relative">
                  <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter text-slate-800 uppercase select-none">
                Pokédex
              </h1>
            </a>

            {/* Desktop: Search */}
            <div className="hidden md:flex flex-1 max-w-xl relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-200 to-blue-200 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 group-focus-within:opacity-70 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 focus-within:ring-2 focus-within:ring-rose-500 focus-within:shadow-lg transition-all duration-300 overflow-hidden w-full">
                <div className="pl-4 pr-2 py-2.5 text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar Pokémon..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full py-2.5 pr-4 bg-transparent border-none outline-none text-slate-700 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal"
                />
                {searchTerm && (
                  <button
                    onClick={onClearSearch}
                    className="p-1.5 mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors animate-fade-in"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Desktop: Controls */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                onClick={handleToggleFilters}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  showTypeFilter
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'bg-white/80 text-slate-500 hover:text-slate-700 hover:bg-white shadow-sm ring-1 ring-slate-200/80'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Tipos</span>
                {selectedType && (
                  <span className="w-2 h-2 bg-blue-400 rounded-full" />
                )}
              </button>

              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-1 ring-1 ring-slate-200/80 shadow-sm flex items-center">
                <button
                  onClick={() => viewMode !== 'grid' && onToggleViewMode()}
                  className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Tarjetas
                </button>
                <button
                  onClick={() => viewMode !== 'list' && onToggleViewMode()}
                  className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  Lista
                </button>
              </div>
            </div>

            {/* Mobile: Action buttons */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-xl transition-all duration-300 shadow-sm ring-1 ${
                  hasActiveFilters
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200 ring-rose-400'
                    : 'bg-white/80 text-slate-500 hover:text-slate-700 ring-slate-200/80'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-xl transition-all duration-300 shadow-sm ring-1 ${
                  selectedType
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200 ring-rose-400'
                    : 'bg-white/80 text-slate-500 hover:text-slate-700 ring-slate-200/80'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: Type filter dropdown */}
        <div className={`hidden md:block filter-panel ${showTypeFilter ? 'open' : ''}`}>
          <div className="px-4 md:px-8 py-4">
            <TypeGrid
              selectedType={selectedType}
              onTypeClick={handleTypeClickAndClose}
            />
          </div>
        </div>
      </nav>

      {/* Mobile: Bottom sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]" onClick={closeMobileMenu}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" />
          <div
            className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl shadow-slate-900/20 max-h-[85vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Search */}
            <div className="px-5 pt-2 pb-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-200 to-blue-200 rounded-2xl blur-lg opacity-50" />
                <div className="relative flex items-center bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 focus-within:ring-2 focus-within:ring-rose-500 focus-within:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="pl-4 pr-2 py-3 text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar Pokémon..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full py-3 pr-4 bg-transparent border-none outline-none text-slate-700 text-base font-medium placeholder:text-slate-400 placeholder:font-normal"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      onClick={onClearSearch}
                      className="p-1.5 mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Types */}
            <div className="px-5 pb-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Tipos</h3>
              </div>
              <TypeGrid
                selectedType={selectedType}
                onTypeClick={handleTypeClickAndClose}
                mobile
              />
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <div className="px-5 pb-5">
                <button
                  onClick={() => {
                    if (selectedType) onTypeClick(selectedType);
                    onClearSearch();
                  }}
                  className="w-full py-3 rounded-2xl bg-rose-50 text-rose-600 font-bold text-sm hover:bg-rose-100 transition-colors"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-14 md:h-16" />
    </>
  );

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }
});

Header.displayName = 'Header';