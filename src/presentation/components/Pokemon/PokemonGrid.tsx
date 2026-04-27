import { memo } from 'react';
import { SearchX } from 'lucide-react';
import { PokemonCard } from '../PokemonCard';
import { PokemonListItem } from '../PokemonListItem';
import type { PokemonBase } from '../../../domain/models/Pokemon';

interface PokemonGridProps {
  pokemonList: PokemonBase[];
  isLoading: boolean;
  isSearching: boolean;
  onPokemonClick: (id: number | string) => void;
  onTypeClick?: (type: string) => void;
  selectedType?: string | null;
  viewMode: 'grid' | 'list';
}

export const PokemonGrid = memo(({ pokemonList, isLoading, isSearching, onPokemonClick, onTypeClick, selectedType, viewMode }: PokemonGridProps) => {
  if (isLoading && !pokemonList.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-rose-500 rounded-full animate-ping" />
          </div>
        </div>
        <p className="mt-6 text-slate-500 font-medium tracking-wide text-lg animate-pulse">
          {isSearching ? 'Buscando por todo el mundo...' : 'Cargando la Pokédex...'}
        </p>
      </div>
    );
  }

  if (pokemonList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[30vh] text-center p-8 animate-fade-in">
        <div className="w-24 h-24 mb-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
          <SearchX className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-slate-700 mb-2">No se encontraron Pokémon</h3>
        <p className="text-slate-500">Intenta ajustar tu término de búsqueda o revisa que el nombre sea correcto.</p>
      </div>
    );
  }

  return (
    <div
      key={viewMode}
      className={viewMode === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'
        : 'flex flex-col gap-3 w-full'
      }
    >
      {pokemonList.map((pokemon, index) => (
        <div
          key={`${viewMode}-${pokemon.id}`}
          className="animate-card-enter"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          {viewMode === 'grid' ? (
            <PokemonCard
              pokemon={pokemon}
              onClick={onPokemonClick}
              onTypeClick={onTypeClick}
              selectedType={selectedType}
            />
          ) : (
            <PokemonListItem
              pokemon={pokemon}
              onClick={onPokemonClick}
              onTypeClick={onTypeClick}
              selectedType={selectedType}
            />
          )}
        </div>
      ))}
    </div>
  );
});

PokemonGrid.displayName = 'PokemonGrid';