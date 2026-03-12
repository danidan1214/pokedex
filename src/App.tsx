import { Header } from './presentation/components/Layout/Header';
import { Pagination } from './presentation/components/Layout/Pagination';
import { PokemonGrid } from './presentation/components/Pokemon/PokemonGrid';
import { PokemonModal } from './presentation/components/PokemonModal';
import { usePokemonUI } from './presentation/hooks/logic/usePokemonUI';
import { motion } from 'framer-motion';

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
  } = usePokemonUI();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-200 relative overflow-x-hidden">
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Blobs */}
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-rose-400/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 60, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -50, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] bg-violet-400/15 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -60, 0], 
            y: [0, -20, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[100px]" 
        />

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
        />

        <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 pb-32">
          <PokemonGrid 
            pokemonList={displayPokemon}
            isLoading={isLoading}
            isSearching={isSearching || isFilteringByType}
            onPokemonClick={handleSelectPokemon}
            onTypeClick={handleTypeClick}
            selectedType={selectedType}
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

        <PokemonModal
          pokemonId={selectedId}
          onClose={handleCloseModal}
          onTypeClick={handleTypeClick}
        />
      </div>
    </div>
  );
}

export default App;

