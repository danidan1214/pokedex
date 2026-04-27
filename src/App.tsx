import { lazy, Suspense } from 'react';
import { Header } from './presentation/components/Layout/Header';
import { Pagination } from './presentation/components/Layout/Pagination';
import { PokemonGrid } from './presentation/components/Pokemon/PokemonGrid';
import { usePokemonUI } from './presentation/hooks/logic/usePokemonUI';

const PokemonModal = lazy(() => import('./presentation/components/PokemonModal').then(m => ({ default: m.PokemonModal })));

function App() {
  const {
    selectedId,
    searchTerm,
    selectedType,
    page,
    isSearching,
    isFilteringByType,
    isLoading,
    isListFetching,
    displayPokemon,
    totalPages,
    handlePageChange,
    handleSearchChange,
    handleClearSearch,
    handleTypeClick,
    handleSelectPokemon,
    handleCloseModal,
    viewMode,
    handleToggleViewMode,
  } = usePokemonUI();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-200 relative overflow-x-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-rose-400/20 rounded-full blur-[60px] md:blur-[120px] animate-blob-1" />
        <div className="absolute top-[10%] left-[-10%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-blue-400/20 rounded-full blur-[60px] md:blur-[120px] animate-blob-2" />
        <div className="absolute bottom-[-10%] left-[20%] w-[225px] h-[225px] md:w-[450px] md:h-[450px] bg-violet-400/15 rounded-full blur-[60px] md:blur-[100px] animate-blob-3" />
        <div className="absolute bottom-[20%] right-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-amber-400/10 rounded-full blur-[60px] md:blur-[100px] animate-blob-4" />

        {/* Subtle Grid Texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
      </div>

      <div className="relative z-10">
        <Header 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          selectedType={selectedType}
          onTypeClick={handleTypeClick}
          viewMode={viewMode}
          onToggleViewMode={handleToggleViewMode}
        />

        <main className="max-w-7xl mx-auto px-4 pt-8 pb-12 md:px-8 md:pb-16">
          <PokemonGrid 
            pokemonList={displayPokemon}
            isLoading={isLoading}
            isSearching={isSearching || isFilteringByType}
            onPokemonClick={handleSelectPokemon}
            onTypeClick={handleTypeClick}
            selectedType={selectedType}
            viewMode={viewMode}
          />

          {!isSearching && !selectedType && (
            <Pagination 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isFetching={isListFetching}
            />
          )}
        </main>

        <Suspense fallback={null}>
          <PokemonModal
            pokemonId={selectedId}
            onClose={handleCloseModal}
            onTypeClick={handleTypeClick}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default App;

