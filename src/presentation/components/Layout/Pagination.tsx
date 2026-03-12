import { memo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

export const Pagination = memo(({ currentPage, totalPages, onPageChange, isFetching }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(0, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);

      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 3) {
        start = totalPages - 5;
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
      className="mt-20 flex flex-col items-center gap-6"
    >
      <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0 || isFetching}
          className="p-3 bg-white text-slate-600 rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center justify-center"
          title="Primera página"
        >
          <ChevronsLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || isFetching}
          className="p-3 bg-white text-slate-600 rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center justify-center"
          title="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              disabled={isFetching}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-bold transition-all active:scale-90 ${
                currentPage === p 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
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
          className="p-3 bg-white text-slate-600 rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center justify-center"
          title="Página siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1 || isFetching}
          className="p-3 bg-white text-slate-600 rounded-xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center justify-center"
          title="Última página"
        >
          <ChevronsRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <p className="text-slate-400 font-medium text-sm">
          Página {currentPage + 1} de {totalPages}
        </p>
        <div className="h-1 w-48 bg-slate-200 rounded-full overflow-hidden">
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
