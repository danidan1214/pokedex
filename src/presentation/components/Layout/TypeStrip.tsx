import { memo } from 'react';
import { TYPE_COLORS } from '../../constants/typeColors';
import { POKEMON_TYPES, LIGHT_TYPES } from '../../constants/typeLabels';

interface TypeStripProps {
  selectedType: string | null;
  onTypeClick: (type: string) => void;
  onClearType: () => void;
}

export const TypeStrip: React.FC<TypeStripProps> = memo(({ selectedType, onTypeClick, onClearType }) => {
  return (
    <div
      role="group"
      aria-label="Filtrar por tipo"
      className="flex flex-wrap gap-2"
    >
      {POKEMON_TYPES.map((type) => {
        const isAll = type.id === 'all';
        const isActive = isAll ? !selectedType : selectedType === type.id;
        const color = TYPE_COLORS[type.id];
        const isLight = LIGHT_TYPES.has(type.id);

        return (
          <button
            key={type.id}
            onClick={() => (isAll ? onClearType() : onTypeClick(type.id))}
            aria-pressed={isActive}
            aria-label={`${type.label}${isActive ? ' (seleccionado)' : ''}`}
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
              isActive
                ? 'shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
            style={
              isActive
                ? isAll
                  ? { background: '#f43f5e', color: '#fff' }
                  : { background: color, color: isLight ? '#1e293b' : '#fff' }
                : undefined
            }
          >
            <span className="text-sm leading-none" aria-hidden>{type.icon}</span>
            <span className="leading-none">{type.label}</span>
          </button>
        );
      })}
    </div>
  );
});

TypeStrip.displayName = 'TypeStrip';