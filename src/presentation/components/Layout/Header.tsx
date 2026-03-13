import { memo, useState } from 'react';
import { Search, Sparkles, X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeFilter } from './TypeFilter';

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

  const handleToggleFilters = () => {
    if (showFilters || selectedType) {
      // If panel is open or a type is selected, close and clear
      setShowFilters(false);
      if (selectedType) {
        onTypeClick(selectedType); // This clears the filter in usePokemonUI
      }
    } else {
      // Otherwise just open
      setShowFilters(true);
    }
  };

  return (
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
          Busca a tus Pokémon por nombre o usa los filtros elementales.
        </motion.p>

        {/* Search Bar & Toggles */}
        <div className="w-full max-w-2xl flex flex-row items-center gap-2 sm:gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 relative group w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-200 to-blue-200 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white rounded-[2rem] shadow-sm ring-1 ring-slate-900/5 focus-within:ring-2 focus-within:ring-rose-500 focus-within:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="pl-4 sm:pl-6 pr-2 sm:pr-4 py-3 sm:py-4 text-slate-400">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <input
                type="text"
                placeholder="¿A qué Pokémon buscas?"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full py-3 sm:py-4 pr-4 sm:pr-6 bg-transparent border-none outline-none text-slate-700 text-base sm:text-lg font-medium placeholder:text-slate-400 placeholder:font-normal"
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={onClearSearch}
                    className="absolute right-2 sm:right-4 p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center"
          >
            <button
              onClick={handleToggleFilters}
              className={`p-3.5 sm:p-4 rounded-[1.5rem] transition-all shadow-md flex items-center justify-center relative flex-shrink-0 ${
                showFilters || selectedType 
                  ? 'bg-rose-500 text-white shadow-rose-200' 
                  : 'bg-white text-slate-400 hover:text-slate-600'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
              {selectedType && !showFilters && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-blue-500 border-2 border-slate-50 rounded-full" />
              )}
            </button>
          </motion.div>
        </div>

        {/* Type Filter Section */}
        <AnimatePresence>
          {(showFilters || selectedType) && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full flex justify-center overflow-hidden"
            >
              <TypeFilter 
                selectedType={selectedType}
                onTypeClick={onTypeClick}
                viewMode={viewMode}
                onToggleViewMode={onToggleViewMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
