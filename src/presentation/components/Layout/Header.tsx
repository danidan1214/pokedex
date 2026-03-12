import { memo } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export const Header = memo(({ searchTerm, onSearchChange, onClearSearch }: HeaderProps) => {
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full py-4 pr-6 bg-transparent border-none outline-none text-slate-700 text-lg font-medium placeholder:text-slate-400 placeholder:font-normal"
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={onClearSearch}
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
  );
});

Header.displayName = 'Header';
