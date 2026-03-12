import { useContext } from 'react';
import { PokemonContext } from '../context/PokemonContext';

export const usePokemonRepository = () => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemonRepository must be used within a PokemonProvider');
  }
  return context;
};
