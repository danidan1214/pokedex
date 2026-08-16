# Modern Pokédex

A highly interactive and performant Pokédex built with **React 19**, **TypeScript**, and **Tailwind CSS 4**. This project follows **Clean Architecture** principles to ensure maintainability, scalability, and a clear separation of concerns.

![Pokédex Preview]

## 🚀 Features

- **Paginated Browsing**: Explore the Pokémon world with efficient pagination driven by a pre-built local dataset — no per-pokémon network requests at runtime.
- **Real-time Search**: Debounced search to find Pokémon by name or ID, resolved instantly from the local dataset.
- **Type Filtering**: Filter by Pokémon type, computed client-side from the local dataset.
- **Detailed View**: Interactive modal with comprehensive stats, types, and high-quality sprites, fetched on demand from PokéAPI.
- **Responsive Design**: Optimized for mobile, tablet, and desktop, with a list view and lightweight 96px sprites on mobile.
- **Fluid Animations**: Smooth transitions and micro-interactions powered by CSS, with Framer Motion reserved for the detail modal.
- **Type-Safe**: Fully typed with TypeScript for a robust developer experience.
- **Dark Mode**: A complete dark theme with a three-state toggle (Light / Dark / System). It defaults to the OS appearance, persists the user's choice in `localStorage` (`pokedex-theme`), and applies the theme before first paint to avoid a flash of the wrong theme on reload.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management & Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: CSS keyframes, plus [Framer Motion](https://www.framer.com/motion/) in the detail modal
- **Data**: A pre-built local dataset (`public/data/pokemon.min.json`) powers list, search and type filtering; [PokéAPI](https://pokeapi.co/) is used for the detail modal and as the source for generating the dataset

## 🏗️ Architecture

This project implements a **Clean Architecture** (Domain-Driven Design inspired) pattern:

- **Domain**: Core business logic, models, and repository interfaces. Completely decoupled from external libraries.
- **Infrastructure**: Implementation of the domain interfaces (e.g., API calls, data mappers). This is where PokéAPI integration lives.
- **Presentation**: UI layer containing React components, custom hooks, and context providers.

```text
src/
├── domain/           # Models & Repository Interfaces
├── infrastructure/   # Repository implementation & Mappers
└── presentation/     # Components, Hooks, Contexts & Styles
```

The list, search and type-filter operations read from a **pre-built local dataset** (`public/data/pokemon.min.json`, ~25 KB gzipped) so they require zero network requests at runtime. Only the detail modal fetches from PokéAPI on demand.

## 🌗 Dark Mode

The app ships a full dark theme driven by a Tailwind v4 class-based `dark:` variant (a `.dark` class on `<html>`) rather than `prefers-color-scheme`, so the user can override the system default.

- **Three states**: Light, Dark and System. A segmented control in the header (desktop) and a cycling button (mobile) switch between them.
- **Default**: `System` — follows the OS appearance and reacts live to OS theme changes without a reload.
- **Persistence**: the choice is stored in `localStorage` under the `pokedex-theme` key.
- **No FOUC**: a blocking inline script in `index.html` applies the stored/system theme before first paint, so reloading in dark never flashes the light theme.

The theme logic lives in `src/presentation/context/ThemeContext.ts` + `ThemeProvider.tsx` and the `useTheme` hook. Pokémon-type colors and brand accents stay the same in both themes; only neutral surfaces, text and borders flip.

## 📦 Getting Started

### 🐳 Docker (recommended)

The project is dockerized: a multi-stage build that compiles with Node and serves the app with **nginx** (a production-optimized web server, much lighter and faster than serving with Node).

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pokedex.git
   cd pokedex
   ```
2. Run with Docker:
   ```bash
   docker compose up -d --build
   ```
3. Open `http://localhost:8080`
4. Stop:
   ```bash
   docker compose down
   ```

### Without Docker (local development)

#### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pokedex.git
   ```
2. Navigate to the project directory:
   ```bash
   cd pokedex
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Scripts

- `npm run dev`: Starts the development server with HMR.
- `npm run build`: Compiles the project for production.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run preview`: Previews the production build locally.
- `npm run gen:data`: Regenerates the local Pokémon dataset from PokéAPI (one-time build step; the result is committed under `public/data/`).
- `npm run verify:data`: Validates the dataset structure, coverage and the list/search/type logic.
- `npm run test:e2e`: Runs the end-to-end smoke test against the preview build (requires Playwright's Chromium installed).

---

