import { useState, useMemo } from 'react';
import { Search, Sparkles, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { usePokemonList, useSearchPokemon } from './presentation/hooks/usePokemon';
import { PokemonCard } from './presentation/components/PokemonCard';
import { PokemonModal } from './presentation/components/PokemonModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from './presentation/hooks/useDebounce';

function App() {
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

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(0, page - 2);
      let end = Math.min(totalPages - 1, page + 2);

      if (page <= 2) {
        end = 4;
      } else if (page >= totalPages - 3) {
        start = totalPages - 5;
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-200">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-400/10 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px]" />
      </div>

      {/* Hero Header */}
      <header className="relative z-10 pt-16 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl shadow-rose-200/50 rotate-3">
                <div className="w-8 h-8 border-4 border-white rounded-full relative">
                  <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-800 uppercase">
              Pokédex
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-lg text-lg mb-10"
          >
            Busca a tus Pokémon por nombre o usando su número de la Pokédex Nacional.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-200 to-blue-200 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white rounded-[2rem] shadow-sm ring-1 ring-slate-900/5 focus-within:ring-2 focus-within:ring-rose-500 focus-within:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="pl-6 pr-4 py-4 text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="¿A qué Pokémon estás buscando?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 pr-6 bg-transparent border-none outline-none text-slate-700 text-lg font-medium placeholder:text-slate-400 placeholder:font-normal"
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-8 pb-32">
        {isLoading && !displayPokemon.length ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-rose-500 rounded-full animate-ping" />
              </div>
            </div>
            <p className="mt-6 text-slate-500 font-medium tracking-wide text-lg animate-pulse">
              {isSearching ? 'Buscando por todo el mundo...' : 'Cargando la Pokédex...'}
            </p>
          </div>
        ) : displayPokemon.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[30vh] text-center"
          >
            <div className="w-24 h-24 mb-6 opacity-20 grayscale">
              <img src="/src/assets/react.svg" alt="Empty" className="w-full h-full" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No se encontraron Pokémon</h3>
            <p className="text-slate-500">Intenta ajustar tu término de búsqueda.</p>
          </motion.div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              <AnimatePresence>
                {displayPokemon.map((pokemon) => (
                  <motion.div
                    key={pokemon.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                  >
                    <PokemonCard
                      pokemon={pokemon}
                      onClick={(p) => setSelectedId(p.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {!isSearching && totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-20 flex flex-col items-center gap-6"
              >
                <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
                  <button
                    onClick={() => handlePageChange(0)}
                    disabled={page === 0 || isListFetching}
                    className="p-3 bg-white text-slate-600 rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center justify-center"
                    title="Primera página"
                  >
                    <ChevronsLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0 || isListFetching}
                    className="p-3 bg-white text-slate-600 rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center justify-center"
                    title="Página anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {getPageNumbers().map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        disabled={isListFetching}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-bold transition-all active:scale-90 ${
                          page === p 
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300 hover:bg-rose-50'
                        }`}
                      >
                        {p + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages - 1 || isListFetching}
                    className="p-3 bg-white text-slate-600 rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center justify-center"
                    title="Página siguiente"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handlePageChange(totalPages - 1)}
                    disabled={page === totalPages - 1 || isListFetching}
                    className="p-3 bg-white text-slate-600 rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center justify-center"
                    title="Última página"
                  >
                    <ChevronsRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <p className="text-slate-400 font-medium text-sm">
                    Página {page + 1} de {totalPages}
                  </p>
                  <div className="h-1 w-48 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((page + 1) / totalPages) * 100}%` }}
                      className="h-full bg-rose-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>

      <PokemonModal
        pokemonId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

export default App;
