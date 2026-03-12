import { Header } from './presentation/components/Layout/Header';
import { Pagination } from './presentation/components/Layout/Pagination';
import { PokemonGrid } from './presentation/components/Pokemon/PokemonGrid';
import { PokemonModal } from './presentation/components/PokemonModal';
import { usePokemonUI } from './presentation/hooks/logic/usePokemonUI';

function App() {
  const {
    selectedId,
    searchTerm,
    page,
    isSearching,
    isLoading,
    isListFetching,
    displayPokemon,
    totalPages,
    handlePageChange,
    handleSearchChange,
    handleClearSearch,
    handleSelectPokemon,
    handleCloseModal,
  } = usePokemonUI();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-200">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-400/10 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px]" />
      </div>

      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-8 pb-32">
        <PokemonGrid
          pokemonList={displayPokemon}
          isLoading={isLoading}
          isSearching={isSearching}
          onPokemonClick={handleSelectPokemon}
        />

        {!isSearching && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isFetching={isListFetching}
          />
        )}
      </main>

      <PokemonModal
        pokemonId={selectedId}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
