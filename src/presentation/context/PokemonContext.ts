import { createContext } from 'react';
import type { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';

export const PokemonContext = createContext<IPokemonRepository | undefined>(undefined);
