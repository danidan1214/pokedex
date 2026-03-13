import React, { memo, useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { TypeBadge } from '../TypeBadge';
import { motion, AnimatePresence } from 'framer-motion';

interface TypeFilterProps {
  selectedType: string | null;
  onTypeClick: (type: string) => void;
  viewMode: 'grid' | 'list';
  onToggleViewMode: () => void;
}

const POKEMON_TYPES = [
  'all', 'normal', 'fire', 'water', 'grass', 'electric', 'ice', 
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export const TypeFilter: React.FC<TypeFilterProps> = memo(({ selectedType, onTypeClick, viewMode, onToggleViewMode }) => {
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
    <div className="w-full max-w-7xl mt-6 px-4 md:px-8">
      {/* Container: Row on desktop, Column on mobile */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
        
        {/* Left Side: Types Carousel */}
        <div className="relative w-full lg:flex-1 bg-white/60 backdrop-blur-md rounded-[2rem] border border-slate-200/50 shadow-sm overflow-hidden flex items-center h-16">
          
          {/* Solid Mask & Button - Left */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 top-0 bottom-0 z-20 flex items-center bg-gradient-to-r from-white via-white/90 to-transparent pl-2 pr-8 pointer-events-none hidden md:flex"
              >
                <button 
                  onClick={() => handleScroll('left')}
                  className="w-10 h-10 bg-white shadow-md border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-500 hover:scale-105 active:scale-95 transition-all pointer-events-auto"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scrollable Area */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-2 overflow-x-auto py-2 px-3 md:px-6 no-scrollbar scroll-smooth w-full h-full"
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
          </div>

          {/* Solid Mask & Button - Right */}
          <AnimatePresence>
            {canScrollRight && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-0 bottom-0 z-20 flex items-center bg-gradient-to-l from-white via-white/90 to-transparent pr-2 pl-8 pointer-events-none hidden md:flex"
              >
                <button 
                  onClick={() => handleScroll('right')}
                  className="w-10 h-10 bg-white shadow-md border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-500 hover:scale-105 active:scale-95 transition-all pointer-events-auto"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: View Mode Toggle */}
        <div className="flex bg-white/60 backdrop-blur-md rounded-[2rem] p-1.5 border border-slate-200/50 shadow-sm w-full sm:w-auto shrink-0 h-16 items-center">
          <button
            onClick={() => viewMode !== 'grid' && onToggleViewMode()}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-full rounded-[1.5rem] font-bold text-sm transition-all ${
              viewMode === 'grid' 
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            Tarjetas
          </button>
          <button
            onClick={() => viewMode !== 'list' && onToggleViewMode()}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-full rounded-[1.5rem] font-bold text-sm transition-all ${
              viewMode === 'list' 
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            <List className="w-5 h-5" />
            Lista
          </button>
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