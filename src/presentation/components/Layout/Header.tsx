import { memo, useState, useEffect, useRef } from 'react';
import { Search, X, LayoutGrid, List, Sun, Moon, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { TypeStrip } from './TypeStrip';
import { useTheme } from '../../hooks/useTheme';
import { useIsMobile } from '../../hooks/useIsMobile';
import { getTypeMeta } from '../../constants/typeLabels';
import { TYPE_COLORS } from '../../constants/typeColors';

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
  const [scrolled, setScrolled] = useState(false);
  const [typesOpen, setTypesOpen] = useState(false);
  const tiposRef = useRef<HTMLDivElement>(null);
  const { effectiveTheme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Outside-click closes the desktop popover only (mobile sheet self-closes;
  // a mousedown guard there would fire on the chip and break selection).
  useEffect(() => {
    if (!typesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTypesOpen(false);
    };
    window.addEventListener('keydown', onKey);
    if (isMobile) return () => window.removeEventListener('keydown', onKey);

    const onDown = (e: MouseEvent) => {
      if (tiposRef.current && !tiposRef.current.contains(e.target as Node)) setTypesOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [typesOpen, isMobile]);

  useEffect(() => {
    if (!typesOpen || !isMobile) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [typesOpen, isMobile]);

  const isDark = effectiveTheme === 'dark';
  const selectedMeta = getTypeMeta(selectedType);
  const handleClearType = () => {
    if (selectedType) onTypeClick(selectedType);
  };
  const handleTypeClickAndClose = (type: string) => {
    onTypeClick(type);
    setTypesOpen(false);
  };

  const tiposButton = (
    <button
      onClick={() => setTypesOpen((v) => !v)}
      aria-haspopup="true"
      aria-expanded={typesOpen}
      aria-label={`Filtrar por tipos${selectedMeta ? ` (actual: ${selectedMeta.label})` : ''}`}
      className={`flex items-center gap-1.5 rounded-full py-2 pl-3 ${selectedType ? 'pr-1.5' : 'pr-3'} text-xs font-semibold transition-colors ${
        selectedType || typesOpen
          ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
      }`}
      style={selectedType ? { background: TYPE_COLORS[selectedType] } : undefined}
    >
      {selectedType ? (
        <span className="text-sm leading-none" aria-hidden>{selectedMeta?.icon}</span>
      ) : (
        <SlidersHorizontal className="w-3.5 h-3.5" />
      )}
      <span className="hidden sm:inline leading-none">
        {selectedType ? selectedMeta?.label : 'Tipos'}
      </span>
      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${typesOpen ? 'rotate-180' : ''}`} />
    </button>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-b transition-shadow duration-300 ${
          scrolled
            ? 'border-slate-200 dark:border-slate-800 shadow-sm'
            : 'border-slate-200/70 dark:border-slate-800/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="hidden md:flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Logo />
              <div className="w-72 lg:w-96">
                <SearchBox searchTerm={searchTerm} onSearchChange={onSearchChange} onClearSearch={onClearSearch} />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="relative" ref={tiposRef}>
                {tiposButton}
                {typesOpen && !isMobile && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-black/40 p-3 animate-fade-in">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filtrar por tipo</h3>
                      <button onClick={() => setTypesOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Cerrar">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <TypeStrip selectedType={selectedType} onTypeClick={handleTypeClickAndClose} onClearType={() => { handleClearType(); setTypesOpen(false); }} />
                  </div>
                )}
              </div>

              <ThemeToggle isDark={isDark} setTheme={setTheme} />

              <ViewToggle viewMode={viewMode} onToggleViewMode={onToggleViewMode} />
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2 h-14">
            <Logo />
            <div className="flex-1 min-w-0">
              <SearchBox searchTerm={searchTerm} onSearchChange={onSearchChange} onClearSearch={onClearSearch} />
            </div>
            <div className="relative">
              {tiposButton}
            </div>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {typesOpen && isMobile && (
        <div className="md:hidden fixed inset-0 z-[60]" onClick={() => setTypesOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/40 animate-fade-in" />
          <div
            className="absolute inset-x-0 bottom-0 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl shadow-slate-900/20 dark:shadow-black/40 max-h-[80vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Filtrar por tipo</h3>
              <button onClick={() => setTypesOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 pb-5">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tipos</h4>
              <TypeStrip selectedType={selectedType} onTypeClick={handleTypeClickAndClose} onClearType={() => { handleClearType(); setTypesOpen(false); }} />

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Vista</h4>
                <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 w-full">
                  <button
                    onClick={() => { if (viewMode !== 'list') onToggleViewMode(); setTypesOpen(false); }}
                    className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-full text-xs font-semibold transition-colors ${
                      viewMode === 'list'
                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    Lista
                  </button>
                  <button
                    onClick={() => { if (viewMode !== 'grid') onToggleViewMode(); setTypesOpen(false); }}
                    className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-full text-xs font-semibold transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Tarjetas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-14 md:h-16" aria-hidden />
    </>
  );
});

const Logo = () => (
  <a href="#" className="flex items-center gap-2 shrink-0">
    <div className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center shadow-sm shadow-rose-500/30">
      <div className="w-5 h-5 border-2 border-white rounded-full relative">
        <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-white rounded-full" />
      </div>
    </div>
    <h1 className="hidden sm:block text-lg font-extrabold tracking-tight text-slate-900 dark:text-white select-none">
      Pokédex
    </h1>
  </a>
);

const SearchBox = ({ searchTerm, onSearchChange, onClearSearch }: { searchTerm: string; onSearchChange: (v: string) => void; onClearSearch: () => void }) => (
  <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus-within:border-rose-400 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-sm focus-within:shadow-rose-500/10 transition-all">
    <Search className="ml-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
    <input
      type="text"
      placeholder="Buscar Pokémon por nombre..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full py-2.5 px-2.5 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
    />
    {searchTerm && (
      <button
        onClick={onClearSearch}
        className="mr-1.5 p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors"
        aria-label="Limpiar búsqueda"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

const ThemeToggle = ({ isDark, setTheme }: { isDark: boolean; setTheme: (t: 'light' | 'dark') => void }) => (
  <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
    <button
      onClick={() => setTheme('light')}
      aria-label="Tema claro"
      aria-pressed={!isDark}
      title="Tema claro"
      className={`p-1.5 rounded-full transition-colors ${
        !isDark
          ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-700'
      }`}
    >
      <Sun className="w-4 h-4" />
    </button>
    <button
      onClick={() => setTheme('dark')}
      aria-label="Tema oscuro"
      aria-pressed={isDark}
      title="Tema oscuro"
      className={`p-1.5 rounded-full transition-colors ${
        isDark
          ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-700'
      }`}
    >
      <Moon className="w-4 h-4" />
    </button>
  </div>
);

const ViewToggle = ({ viewMode, onToggleViewMode }: { viewMode: 'grid' | 'list'; onToggleViewMode: () => void }) => (
  <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
    <button
      onClick={() => viewMode !== 'grid' && onToggleViewMode()}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        viewMode === 'grid'
          ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-700'
      }`}
    >
      <LayoutGrid className="w-3.5 h-3.5" />
      Tarjetas
    </button>
    <button
      onClick={() => viewMode !== 'list' && onToggleViewMode()}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        viewMode === 'list'
          ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-700'
      }`}
    >
      <List className="w-3.5 h-3.5" />
      Lista
    </button>
  </div>
);

Header.displayName = 'Header';