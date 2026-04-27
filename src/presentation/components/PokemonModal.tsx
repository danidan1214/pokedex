import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Weight, Zap, Shield, Heart, Swords, Activity, FastForward, Info, Crown, ImageOff } from 'lucide-react';
import { usePokemonDetail } from '../hooks/usePokemon';
import { TypeBadge } from './TypeBadge';
import { TYPE_COLORS } from '../constants/typeColors';

interface Props {
  pokemonId: number | string | null;
  onClose: () => void;
  onTypeClick?: (type: string) => void;
}

const StatBar: React.FC<{ label: string; value: number; max: number; icon: React.ReactNode; color: string }> = ({ label, value, max, icon, color }) => (
  <div className="mb-4 group">
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-2 text-slate-500 font-medium capitalize text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-bold text-slate-700">{value}</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden ring-1 ring-inset ring-slate-200">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
        className="h-full rounded-full relative overflow-hidden"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </motion.div>
    </div>
  </div>
);

export const PokemonModal: React.FC<Props> = memo(({ pokemonId, onClose, onTypeClick }) => {
  const { data: pokemon, isLoading } = usePokemonDetail(pokemonId || '');
  const [imageError, setImageError] = useState(false);

  if (!pokemonId) return null;

  const mainType = pokemon?.types[0]?.toLowerCase() || 'normal';
  const mainColor = TYPE_COLORS[mainType] || '#A8A77A';
  const hasImage = pokemon?.image && !imageError;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl h-auto max-h-[90vh] flex flex-col md:flex-row z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 sm:p-3 rounded-full bg-black/10 hover:bg-black/20 text-white backdrop-blur-sm transition-all z-20 hover:scale-105 active:scale-95"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {isLoading ? (
            <div className="w-full h-[300px] md:h-[500px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Atrapando datos...</p>
              </div>
            </div>
          ) : pokemon ? (
            <>
              {/* Left Side - Image & Basic Info */}
              <div
                className="md:w-[45%] shrink-0 p-6 pt-10 sm:p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden text-white min-h-[35vh] md:min-h-0"
                style={{ backgroundColor: mainColor }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] md:w-[120%] aspect-square bg-white/10 rounded-full blur-2xl md:blur-3xl" />

                <span className="absolute top-4 left-4 sm:top-6 sm:left-8 text-white/30 font-black text-5xl sm:text-6xl md:text-8xl italic select-none">
                  #{pokemon.id.toString().padStart(3, '0')}
                </span>

                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="relative z-10 w-32 h-32 sm:w-48 sm:h-48 md:w-full md:max-w-[280px] aspect-square flex items-center justify-center mt-2 md:mt-8"
                >
                  {hasImage ? (
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      onError={() => setImageError(true)}
                      width="280"
                      height="280"
                      className="w-full h-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)] md:drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white/50">
                      <ImageOff className="w-16 h-16 sm:w-32 sm:h-32 mb-4" />
                      <span className="text-sm sm:text-xl font-black uppercase tracking-widest">Sin imagen</span>
                    </div>
                  )}
                </motion.div>

                <div className="relative z-10 mt-4 sm:mt-6 md:mt-8 text-center w-full">
                  {(pokemon.isLegendary || pokemon.isMythic) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2 sm:mb-4 shadow-lg"
                    >
                      <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-yellow-300" />
                      {pokemon.isMythic ? 'Mítico' : 'Legendario'}
                    </motion.div>
                  )}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black capitalize tracking-tight mb-2 sm:mb-4 drop-shadow-md truncate px-2">
                    {pokemon.name}
                  </h2>
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                    {pokemon.types.map((type) => (
                      <TypeBadge
                        key={type}
                        type={type}
                        onClick={(t) => {
                          if (onTypeClick) {
                            onTypeClick(t);
                            onClose();
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Details & Stats */}
              <div className="flex-1 md:w-[55%] p-5 sm:p-8 md:p-10 overflow-y-auto bg-slate-50">
                {/* About Section */}
                <div className="mb-8 md:mb-10">
                  <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3 md:mb-4 text-base md:text-lg">
                    <Info className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                    Acerca de
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100">
                    {pokemon.description || 'Un Pokémon misterioso. Se sabe poco sobre él.'}
                  </p>
                </div>

                {/* Physical Stats */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
                  <div className="flex flex-col items-center gap-1 sm:gap-2 bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 mb-1">
                      <Weight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Peso</span>
                    </div>
                    <p className="font-bold text-slate-800 text-lg sm:text-xl">{pokemon.weight} <span className="text-xs sm:text-sm text-slate-400 font-normal">kg</span></p>
                  </div>
                  <div className="flex flex-col items-center gap-1 sm:gap-2 bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 mb-1">
                      <Ruler className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Altura</span>
                    </div>
                    <p className="font-bold text-slate-800 text-lg sm:text-xl">{pokemon.height} <span className="text-xs sm:text-sm text-slate-400 font-normal">m</span></p>
                  </div>
                </div>

                {/* Abilities */}
                {pokemon.abilities && pokemon.abilities.length > 0 && (
                  <div className="mb-8 md:mb-10">
                    <h3 className="font-bold text-slate-800 mb-3 md:mb-4 text-base md:text-lg">Habilidades</h3>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.abilities.map(ability => (
                        <span key={ability} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-sm capitalize">
                          {ability.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Base Stats */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-4 md:mb-6 text-base md:text-lg">Estadísticas Base</h3>
                  <div className="space-y-3 bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100">
                    <StatBar label="PS" value={pokemon.stats.hp} max={255} color="#FF5959" icon={<Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} />
                    <StatBar label="Ataque" value={pokemon.stats.attack} max={190} color="#F5AC78" icon={<Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} />
                    <StatBar label="Defensa" value={pokemon.stats.defense} max={230} color="#FAE078" icon={<Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} />
                    <StatBar label="Atq. Esp." value={pokemon.stats.specialAttack} max={194} color="#9DB7F5" icon={<Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} />
                    <StatBar label="Def. Esp." value={pokemon.stats.specialDefense} max={250} color="#A7DB8D" icon={<Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} />
                    <StatBar label="Velocidad" value={pokemon.stats.speed} max={180} color="#FA92B2" icon={<FastForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

PokemonModal.displayName = 'PokemonModal';