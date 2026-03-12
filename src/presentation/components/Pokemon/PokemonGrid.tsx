import { motion, AnimatePresence } from 'framer-motion';
import { PokemonCard } from '../PokemonCard';
import type { PokemonBase } from '../../../domain/models/Pokemon';

interface PokemonGridProps {
  pokemonList: PokemonBase[];
  isLoading: boolean;
  isSearching: boolean;
  onPokemonClick: (pokemon: PokemonBase) => void;
}

export function PokemonGrid({ pokemonList, isLoading, isSearching, onPokemonClick }: PokemonGridProps) {
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[30vh] text-center"
      >
        <div className="w-24 h-24 mb-6 opacity-20 grayscale">
          <img src="/src/assets/react.svg" alt="Empty" className="w-full h-full" />
        </div>
        <h3 className="text-2xl font-bold text-slate-700 mb-2">No se encontraron Pokémon</h3>
        <p className="text-slate-500">Intenta ajustar tu término de búsqueda.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
    >
      <AnimatePresence>
        {pokemonList.map((pokemon) => (
          <motion.div
            key={pokemon.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            layout
          >
            <PokemonCard
              pokemon={pokemon}
              onClick={onPokemonClick}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
