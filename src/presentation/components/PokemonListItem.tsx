import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import type { PokemonBase } from '../../domain/models/Pokemon';
import { TypeBadge } from './TypeBadge';

interface Props {
  pokemon: PokemonBase;
  onClick: (pokemon: PokemonBase) => void;
  onTypeClick?: (type: string) => void;
  selectedType?: string | null;
}

const typeColors: Record<string, string> = {
  bug: 'bg-[#A6B91A]',
  dark: 'bg-[#705746]',
  dragon: 'bg-[#6F35FC]',
  electric: 'bg-[#F7D02C]',
  fairy: 'bg-[#D685AD]',
  fighting: 'bg-[#C22E28]',
  fire: 'bg-[#EE8130]',
  flying: 'bg-[#A98FF3]',
  ghost: 'bg-[#705898]',
  grass: 'bg-[#7AC74C]',
  ground: 'bg-[#E2BF65]',
  ice: 'bg-[#96D9D6]',
  normal: 'bg-[#A8A77A]',
  poison: 'bg-[#A33EA1]',
  psychic: 'bg-[#F95587]',
  rock: 'bg-[#B6A136]',
  steel: 'bg-[#B7B7CE]',
  water: 'bg-[#6390F0]',
};

export const PokemonListItem: React.FC<Props> = memo(({ pokemon, onClick, onTypeClick, selectedType }) => {
  const [imageError, setImageError] = useState(false);
  const mainType = pokemon.types[0]?.toLowerCase() || 'normal';
  const bgColor = typeColors[mainType] || 'bg-slate-400';

  const hasImage = pokemon.image && !imageError;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onClick(pokemon)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center p-3 border border-slate-100/50"
    >
      <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl ${bgColor} flex-shrink-0 flex items-center justify-center overflow-hidden mr-4`}>
        {hasImage ? (
          <img
            src={pokemon.image}
            alt={pokemon.name}
            onError={() => setImageError(true)}
            className="w-4/5 h-4/5 object-contain filter drop-shadow-md z-10"
            loading="lazy"
          />
        ) : (
          <ImageOff className="w-6 h-6 text-white/70 z-10" />
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg sm:text-xl font-black capitalize text-slate-800 truncate pr-2">
            {pokemon.name}
          </h3>
          <span className="text-slate-400 font-bold text-sm sm:text-base italic whitespace-nowrap">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pokemon.types.map((type) => (
            <TypeBadge 
              key={type} 
              type={type} 
              onClick={onTypeClick}
              isSelected={selectedType === type}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

PokemonListItem.displayName = 'PokemonListItem';