import { createContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  /** The user's chosen preference (what the toggle controls). */
  theme: Theme;
  /** The resolved theme actually applied ('light' | 'dark'). */
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  /** Cycles light -> dark -> system -> light. */
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);