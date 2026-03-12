# Modern Pokédex

A highly interactive and performant Pokédex built with **React 19**, **TypeScript**, and **Tailwind CSS 4**. This project follows **Clean Architecture** principles to ensure maintainability, scalability, and a clear separation of concerns.

![Pokédex Preview]

## 🚀 Features

- **Infinite Scrolling**: Seamlessly explore the Pokémon world with efficient data fetching using TanStack Query.
- **Real-time Search**: Debounced search functionality to find your favorite Pokémon by name or ID.
- **Detailed View**: Interactive modal with comprehensive stats, types, and high-quality sprites.
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing.
- **Fluid Animations**: Smooth transitions and micro-interactions powered by Framer Motion.
- **Type-Safe**: Fully typed with TypeScript for a robust developer experience.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management & Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **API**: [PokéAPI](https://pokeapi.co/)

## 🏗️ Architecture

This project implements a **Clean Architecture** (Domain-Driven Design inspired) pattern:

- **Domain**: Core business logic, models, and repository interfaces. Completely decoupled from external libraries.
- **Infrastructure**: Implementation of the domain interfaces (e.g., API calls, data mappers). This is where PokéAPI integration lives.
- **Presentation**: UI layer containing React components, custom hooks, and context providers.

```text
src/
├── domain/           # Models & Repository Interfaces
├── infrastructure/   # API implementations & Mappers
└── presentation/     # Components, Hooks, Contexts & Styles
```

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

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

---

