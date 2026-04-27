import { memo } from 'react';
import { TYPE_BG_CLASSES } from '../constants/typeColors';

interface Props {
  type: string;
  onClick?: (type: string) => void;
  isSelected?: boolean;
  large?: boolean;
}

export const TypeBadge: React.FC<Props> = memo(({ type, onClick, isSelected, large }) => {
  const colorClass = TYPE_BG_CLASSES[type.toLowerCase()] || 'bg-slate-400 text-white';
  const isClickable = !!onClick;

  return (
    <span
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(type);
        }
      }}
      className={`rounded-full font-black uppercase tracking-widest shadow-sm transition-all flex items-center justify-center ${
        large ? 'px-6 py-3 text-sm' : 'px-3 py-1 text-[10px] sm:text-xs'
      } ${
        colorClass.includes('text-') ? colorClass : `${colorClass} text-white`
      } ${isClickable ? 'cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg' : ''} ${
        isSelected ? 'ring-4 ring-rose-500/30 scale-110 shadow-xl' : 'opacity-90 hover:opacity-100'
      }`}
    >
      {type}
    </span>
  );
});

TypeBadge.displayName = 'TypeBadge';