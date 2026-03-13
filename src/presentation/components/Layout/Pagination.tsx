import { memo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

export const Pagination = memo(({ currentPage, totalPages, onPageChange, isFetching }: PaginationProps) => {
  const [maxVisiblePages, setMaxVisiblePages] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      setMaxVisiblePages(window.innerWidth < 640 ? 3 : 5);
    };
    handleResize(); // set initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(0, currentPage - halfVisible);
      let end = Math.min(totalPages - 1, currentPage + halfVisible);

      if (currentPage <= halfVisible) {
        end = maxVisiblePages - 1;
      } else if (currentPage >= totalPages - 1 - halfVisible) {
        start = totalPages - maxVisiblePages;
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-16 sm:mt-20 flex flex-col items-center gap-4 sm:gap-6"
    >
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 justify-center w-full max-w-[100vw] overflow-hidden px-2">
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0 || isFetching}
          className="p-2 sm:p-3 bg-white text-slate-600 rounded-lg sm:rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center justify-center shrink-0"
          title="Primera página"
        >
          <ChevronsLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || isFetching}
          className="p-2 sm:p-3 bg-white text-slate-600 rounded-lg sm:rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center justify-center shrink-0"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              disabled={isFetching}
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl font-bold transition-all active:scale-90 text-sm sm:text-base ${
                currentPage === p 
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200/50' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300 hover:bg-rose-50'
              }`}
            >
              {p + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || isFetching}
          className="p-2 sm:p-3 bg-white text-slate-600 rounded-lg sm:rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center justify-center shrink-0"
          title="Página siguiente"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1 || isFetching}
          className="p-2 sm:p-3 bg-white text-slate-600 rounded-lg sm:rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center justify-center shrink-0"
          title="Última página"
        >
          <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <p className="text-slate-400 font-medium text-xs sm:text-sm">
          Página {currentPage + 1} de {totalPages}
        </p>
        <div className="h-1 w-32 sm:w-48 bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            className="h-full bg-rose-500"
          />
        </div>
      </div>
    </motion.div>
  );
});

Pagination.displayName = 'Pagination';
