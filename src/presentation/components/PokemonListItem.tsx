import { memo, useState } from 'react';
import { ImageOff } from 'lucide-react';
import type { PokemonBase } from '../../domain/models/Pokemon';
import { TypeBadge } from './TypeBadge';
import { TYPE_BG_CLASSES } from '../constants/typeColors';

interface Props {
  pokemon: PokemonBase;
  onClick: (id: number | string) => void;
  onTypeClick?: (type: string) => void;
  selectedType?: string | null;
}

export const PokemonListItem: React.FC<Props> = memo(({ pokemon, onClick, onTypeClick, selectedType }) => {
  const [imageError, setImageError] = useState(false);
  const mainType = pokemon.types[0]?.toLowerCase() || 'normal';
  const bgColor = TYPE_BG_CLASSES[mainType] || 'bg-slate-400';

  const hasImage = pokemon.image && !imageError;

  return (
    <div
      onClick={() => onClick(pokemon.id)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center p-3 border border-slate-100/50 animate-card-enter"
    >
      <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl ${bgColor} flex-shrink-0 flex items-center justify-center overflow-hidden mr-4`}>
        {hasImage ? (
          <img
            src={pokemon.image}
            alt={pokemon.name}
            onError={() => setImageError(true)}
            width="64"
            height="64"
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
    </div>
  );
});

PokemonListItem.displayName = 'PokemonListItem';