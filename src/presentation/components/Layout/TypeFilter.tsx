import React, { memo, useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Filter, Sparkles } from 'lucide-react';
import { TypeBadge } from '../TypeBadge';
import { motion, AnimatePresence } from 'framer-motion';

interface TypeFilterProps {
  selectedType: string | null;
  onTypeClick: (type: string) => void;
}

const POKEMON_TYPES = [
  'all', 'normal', 'fire', 'water', 'grass', 'electric', 'ice', 
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export const TypeFilter: React.FC<TypeFilterProps> = memo(({ selectedType, onTypeClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mt-12 px-4 flex flex-col gap-6">
      {/* Label Section */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-rose-500 group-hover:border-rose-100 transition-all">
            <Filter className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">
              Categorías Elementales
            </h3>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />
              Selecciona un tipo para filtrar
            </p>
          </div>
        </div>
      </div>

      {/* Main Filter Bar */}
      <div className="relative group/filter bg-white/50 backdrop-blur-md rounded-[2.5rem] p-1.5 border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
        
        {/* Navigation - Left Arrow with Gradient Mask */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute left-0 top-0 bottom-0 z-30 flex items-center pl-2 pr-12 bg-gradient-to-r from-white via-white/95 to-transparent pointer-events-none hidden md:flex"
            >
              <button 
                onClick={() => handleScroll('left')}
                className="w-10 h-10 bg-white shadow-lg border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all pointer-events-auto"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation - Right Arrow with Gradient Mask */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-0 top-0 bottom-0 z-30 flex items-center pr-2 pl-12 bg-gradient-to-l from-white via-white/95 to-transparent pointer-events-none hidden md:flex"
            >
              <button 
                onClick={() => handleScroll('right')}
                className="w-10 h-10 bg-white shadow-lg border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all pointer-events-auto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Edge Gradients - Re-optimized for small screens */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/80 to-transparent pointer-events-none md:hidden z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/80 to-transparent pointer-events-none md:hidden z-20" />

        {/* Scrollable Content Area */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-center gap-4 overflow-x-auto py-4 px-6 md:px-8 no-scrollbar scroll-smooth"
        >
          {POKEMON_TYPES.map((type) => (
            <div key={type} className="flex-shrink-0">
              <TypeBadge
                type={type === 'all' ? 'Todos' : type}
                onClick={() => type === 'all' ? onTypeClick(selectedType!) : onTypeClick(type)}
                isSelected={type === 'all' ? !selectedType : selectedType === type}
                large
              />
            </div>
          ))}
          {/* End spacer for proper scroll end padding */}
          <div className="w-4 flex-shrink-0 h-1" />
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
});

TypeFilter.displayName = 'TypeFilter';
