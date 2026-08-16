import { memo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

type Item = { type: 'page'; value: number } | { type: 'ellipsis' };

export const Pagination = memo(({ currentPage, totalPages, onPageChange, isFetching }: PaginationProps) => {
  const [siblings, setSiblings] = useState(2);

  useEffect(() => {
    const handleResize = () => setSiblings(window.innerWidth < 640 ? 1 : 2);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (totalPages <= 1) return null;

  const c = currentPage;
  const last = totalPages - 1;

  // First, last, and a window around the current page.
  const shown = new Set<number>([0, last]);
  for (let i = c - siblings; i <= c + siblings; i++) {
    if (i >= 0 && i <= last) shown.add(i);
  }

  // Absorb a single hidden page so "…" never stands for just one page.
  let sorted = [...shown].sort((a, b) => a - b);
  const expanded = new Set<number>(sorted);
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] - sorted[i] === 2) expanded.add(sorted[i] + 1);
  }
  sorted = [...expanded].sort((a, b) => a - b);

  const items: Item[] = [];
  for (const p of sorted) {
    if (items.length) {
      const prev = items[items.length - 1];
      if (prev.type === 'page' && p - prev.value >= 3) items.push({ type: 'ellipsis' });
    }
    items.push({ type: 'page', value: p });
  }

  const basePill =
    'flex items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-30 disabled:cursor-not-allowed';
  const navPill = `${basePill} w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700`;
  const pagePill = (active: boolean) =>
    `${basePill} w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-bold ${
      active
        ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`;

  return (
    <nav aria-label="Paginación" className="mt-16 sm:mt-20 flex flex-col items-center gap-4 animate-fade-in">
      <div className="flex items-center gap-1 sm:gap-1.5 justify-center">
        <button onClick={() => onPageChange(c - 1)} disabled={c === 0 || isFetching} className={navPill} aria-label="Página anterior">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {items.map((item, idx) =>
            item.type === 'ellipsis' ? (
              <span key={`e${idx}`} className="w-6 sm:w-8 text-center text-slate-400 dark:text-slate-500 font-bold select-none" aria-hidden>…</span>
            ) : (
              <button
                key={item.value}
                onClick={() => onPageChange(item.value)}
                disabled={isFetching}
                aria-current={c === item.value ? 'page' : undefined}
                aria-label={`Página ${item.value + 1}`}
                className={pagePill(c === item.value)}
              >
                {item.value + 1}
              </button>
            ),
          )}
        </div>

        <button onClick={() => onPageChange(c + 1)} disabled={c === last || isFetching} className={navPill} aria-label="Página siguiente">
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm">
        Página <span className="font-bold text-slate-700 dark:text-slate-200">{c + 1}</span> de {totalPages}
      </p>
    </nav>
  );
});

Pagination.displayName = 'Pagination';