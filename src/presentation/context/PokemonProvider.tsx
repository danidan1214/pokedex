import React from 'react';
import { PokeApiRepository } from '../../infrastructure/repositories/PokeApiRepository';
import { PokemonContext } from './PokemonContext';

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const repository = React.useMemo(() => new PokeApiRepository(), []);

  return (
    <PokemonContext.Provider value={repository}>
      {children}
    </PokemonContext.Provider>
  );
};
