import React, { memo } from 'react';

interface Props {
  type: string;
  onClick?: (type: string) => void;
  isSelected?: boolean;
  large?: boolean;
}

export const TypeBadge: React.FC<Props> = memo(({ type, onClick, isSelected, large }) => {
  const bgColors: Record<string, string> = {
    bug: 'bg-[#A6B91A]',
    dark: 'bg-[#705746]',
    dragon: 'bg-[#6F35FC]',
    electric: 'bg-[#F7D02C] text-slate-900',
    fairy: 'bg-[#D685AD]',
    fighting: 'bg-[#C22E28]',
    fire: 'bg-[#EE8130]',
    flying: 'bg-[#A98FF3]',
    ghost: 'bg-[#705898]',
    grass: 'bg-[#7AC74C]',
    ground: 'bg-[#E2BF65]',
    ice: 'bg-[#96D9D6] text-slate-900',
    normal: 'bg-[#A8A77A]',
    poison: 'bg-[#A33EA1]',
    psychic: 'bg-[#F95587]',
    rock: 'bg-[#B6A136]',
    steel: 'bg-[#B7B7CE]',
    water: 'bg-[#6390F0]',
  };

  const colorClass = bgColors[type.toLowerCase()] || 'bg-slate-400 text-white';
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
