import { useState, memo } from 'react';
import { ImageOff } from 'lucide-react';
import type { PokemonBase } from '../../domain/models/Pokemon';
import { TypeBadge } from './TypeBadge';
import { TYPE_GRADIENTS } from '../constants/typeColors';

interface Props {
  pokemon: PokemonBase;
  onClick: (id: number | string) => void;
  onTypeClick?: (type: string) => void;
  selectedType?: string | null;
}

export const PokemonCard: React.FC<Props> = memo(({ pokemon, onClick, onTypeClick, selectedType }) => {
  const [imageError, setImageError] = useState(false);
  const mainType = pokemon.types[0]?.toLowerCase() || 'normal';
  const gradient = TYPE_GRADIENTS[mainType] || 'from-slate-400 to-slate-300';

  const hasImage = pokemon.image && !imageError;

  return (
    <div
      onClick={() => onClick(pokemon.id)}
      className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group border border-slate-100/50 animate-card-enter"
    >
      <div className={`relative w-full pt-[100%] bg-gradient-to-br ${gradient} overflow-hidden`}>
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-2xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-black/10 rounded-full blur-2xl" />

        <span className="absolute top-3 right-4 sm:top-4 sm:right-6 text-white/30 font-black text-2xl sm:text-3xl md:text-4xl italic select-none">
          #{pokemon.id.toString().padStart(3, '0')}
        </span>

        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
          {hasImage ? (
            <img
              src={pokemon.image}
              alt={pokemon.name}
              onError={() => setImageError(true)}
              width="96"
              height="96"
              className="max-w-[85%] max-h-[85%] sm:max-w-full sm:max-h-full object-contain filter drop-shadow-xl group-hover:scale-110 transition-transform duration-500 ease-out z-10 animate-img-enter"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white/70 z-10">
              <ImageOff className="w-8 h-8 sm:w-12 sm:h-12 mb-2" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-tighter">Sin imagen</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 bg-white flex-1 flex flex-col relative z-20 rounded-t-[1.5rem] sm:rounded-t-[2rem] -mt-4 sm:-mt-6">
        <h3 className="text-xl sm:text-2xl font-black capitalize text-slate-800 mb-3 sm:mb-4 tracking-tight truncate">
          {pokemon.name}
        </h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
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
    </div>
  );
});

PokemonCard.displayName = 'PokemonCard';