import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import type { PokemonBase } from '../../domain/models/Pokemon';
import { TypeBadge } from './TypeBadge';

interface Props {
  pokemon: PokemonBase;
  onClick: (pokemon: PokemonBase) => void;
}

const typeGradients: Record<string, string> = {
  bug: 'from-[#A6B91A] to-[#C6D93A]',
  dark: 'from-[#705746] to-[#907766]',
  dragon: 'from-[#6F35FC] to-[#8F55FC]',
  electric: 'from-[#F7D02C] to-[#F9E05C]',
  fairy: 'from-[#D685AD] to-[#F6A5CD]',
  fighting: 'from-[#C22E28] to-[#E24E48]',
  fire: 'from-[#EE8130] to-[#FEA150]',
  flying: 'from-[#A98FF3] to-[#C9AFF3]',
  ghost: 'from-[#705898] to-[#9078B8]',
  grass: 'from-[#7AC74C] to-[#9AE76C]',
  ground: 'from-[#E2BF65] to-[#F2DF85]',
  ice: 'from-[#96D9D6] to-[#B6F9F6]',
  normal: 'from-[#A8A77A] to-[#C8C79A]',
  poison: 'from-[#A33EA1] to-[#C35EC1]',
  psychic: 'from-[#F95587] to-[#FA75A7]',
  rock: 'from-[#B6A136] to-[#D6C156]',
  steel: 'from-[#B7B7CE] to-[#D7D7EE]',
  water: 'from-[#6390F0] to-[#83B0F0]',
};

export const PokemonCard: React.FC<Props> = memo(({ pokemon, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const mainType = pokemon.types[0]?.toLowerCase() || 'normal';
  const gradient = typeGradients[mainType] || 'from-slate-400 to-slate-300';

  const hasImage = pokemon.image && !imageError;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onClick(pokemon)}
      className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group border border-slate-100/50"
    >
      <div className={`relative w-full pt-[100%] bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Decorative background element */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-2xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-black/10 rounded-full blur-2xl" />
        
        {/* ID Number watermark */}
        <span className="absolute top-4 right-6 text-white/30 font-black text-4xl italic select-none">
          #{pokemon.id.toString().padStart(3, '0')}
        </span>

        {/* Pokemon Image */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {hasImage ? (
            <motion.img
              src={pokemon.image}
              alt={pokemon.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-110 transition-transform duration-500 ease-out z-10"
              loading="lazy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white/70 z-10">
              <ImageOff className="w-12 h-12 mb-2" />
              <span className="text-xs font-bold uppercase tracking-tighter">Sin imagen</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 bg-white flex-1 flex flex-col relative z-20 rounded-t-[2rem] -mt-6">
        <h3 className="text-2xl font-black capitalize text-slate-800 mb-4 tracking-tight">
          {pokemon.name}
        </h3>
        <div className="flex flex-wrap gap-2 mt-auto">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

PokemonCard.displayName = 'PokemonCard';
