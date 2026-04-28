import { memo } from 'react';
import { TYPE_COLORS } from '../../constants/typeColors';

interface TypeGridProps {
  selectedType: string | null;
  onTypeClick: (type: string) => void;
  mobile?: boolean;
}

const POKEMON_TYPES = [
  { id: 'all', label: 'Todos', icon: '✦' },
  { id: 'normal', label: 'Normal', icon: '◆' },
  { id: 'fire', label: 'Fuego', icon: '🔥' },
  { id: 'water', label: 'Agua', icon: '💧' },
  { id: 'grass', label: 'Planta', icon: '🌿' },
  { id: 'electric', label: 'Eléctrico', icon: '⚡' },
  { id: 'ice', label: 'Hielo', icon: '❄️' },
  { id: 'fighting', label: 'Lucha', icon: '🥊' },
  { id: 'poison', label: 'Veneno', icon: '☠️' },
  { id: 'ground', label: 'Tierra', icon: '🏔️' },
  { id: 'flying', label: 'Volador', icon: '🕊️' },
  { id: 'psychic', label: 'Psíquico', icon: '🔮' },
  { id: 'bug', label: 'Bicho', icon: '🐛' },
  { id: 'rock', label: 'Roca', icon: '🪨' },
  { id: 'ghost', label: 'Fantasma', icon: '👻' },
  { id: 'dragon', label: 'Dragón', icon: '🐉' },
  { id: 'dark', label: 'Siniestro', icon: '🌑' },
  { id: 'steel', label: 'Acero', icon: '⚙️' },
  { id: 'fairy', label: 'Hada', icon: '✨' },
];

const LIGHT_TYPES = new Set(['electric', 'ice', 'ground', 'normal']);

export const TypeGrid: React.FC<TypeGridProps> = memo(({ selectedType, onTypeClick, mobile }) => {
  const gridCols = mobile
    ? 'grid-cols-4 sm:grid-cols-5'
    : 'grid-cols-6 lg:grid-cols-9';

  return (
    <div className={`grid ${gridCols} ${mobile ? 'gap-2.5' : 'gap-2'}`}>
      {POKEMON_TYPES.map((type) => {
        const isAll = type.id === 'all';
        const isSelected = isAll ? !selectedType : selectedType === type.id;
        const color = TYPE_COLORS[type.id];
        const isLight = LIGHT_TYPES.has(type.id);

        return (
          <button
            key={type.id}
            onClick={() => isAll ? onTypeClick(selectedType!) : onTypeClick(type.id)}
            className={`
              group relative flex flex-col items-center justify-center gap-0.5
              rounded-2xl transition-all duration-200 cursor-pointer
              select-none outline-none focus-visible:ring-2 focus-visible:ring-rose-500
              ${mobile ? 'py-3 px-1' : 'py-2.5 px-1'}
              ${isSelected
                ? 'ring-2 ring-white ring-offset-2 scale-[1.03]'
                : 'hover:scale-[1.05] hover:brightness-110 active:scale-95'
              }
            `}
            style={{
              background: isAll
                ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #fb7185 100%)'
                : `linear-gradient(145deg, ${color} 0%, ${color}cc 100%)`,
              color: isAll ? '#fff' : isLight ? '#1e293b' : '#fff',
              boxShadow: isSelected
                ? isAll
                  ? '0 6px 20px -4px rgba(244,63,94,0.5)'
                  : `0 6px 20px -4px ${color}80`
                : `0 1px 3px ${color}30`,
            }}
          >
            <span className="text-base leading-none">{type.icon}</span>
            <span className={`font-extrabold uppercase tracking-wider leading-none ${mobile ? 'text-[9px]' : 'text-[8px] lg:text-[9px]'}`}>
              {type.label}
            </span>
            {isSelected && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center">
                <span className="text-rose-500 text-[10px] font-black leading-none">✓</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
});

TypeGrid.displayName = 'TypeGrid';