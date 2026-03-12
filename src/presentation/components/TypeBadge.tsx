import React, { memo } from 'react';

interface Props {
  type: string;
}

export const TypeBadge: React.FC<Props> = memo(({ type }) => {
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

  return (
    <span 
      className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-sm ${
        colorClass.includes('text-') ? colorClass : `${colorClass} text-white`
      }`}
    >
      {type}
    </span>
  );
});

TypeBadge.displayName = 'TypeBadge';
