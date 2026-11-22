// ============================================================
//  ORIGEN DE LOS DATOS EN MONGODB  — AJUSTA LOS NOMBRES (marcados con AJUSTAR)
//  Para ver cómo guardan tus plugins los datos, ejecuta:   npm run inspect
//  y pega la salida: con eso se dejan estos nombres exactos.
//  Variables en .env: MONGO_URI (una sola) o MONGO_URI_PRACTICE / _KITMAP / _BANS (una por plugin).
// ============================================================
const E = process.env;
const base = E.MONGO_URI || '';

module.exports = {
  // StelarPractice → ranking de ELO
  practice: {
    uri: E.MONGO_URI_PRACTICE || base,
    db: E.MONGO_DB_PRACTICE || 'stelarpractice',      // AJUSTAR: nombre de la base
    collection: 'players',                            // AJUSTAR: colección de jugadores
    filter: {},
    sort: { elo: -1 },                                // AJUSTAR: campo del ELO
    limit: 10,
    name: 'name',                                     // AJUSTAR: campo con el nick
    value: 'elo'                                      // AJUSTAR: campo con el ELO
  },
  // Azurite → facciones del Kitmap (hoy en JSON: hay que moverlo a Mongo, ver README)
  factions: {
    uri: E.MONGO_URI_KITMAP || base,
    db: E.MONGO_DB_KITMAP || 'azurite',               // AJUSTAR
    collection: 'factions',                           // AJUSTAR
    filter: {},
    sort: { points: -1 },                             // AJUSTAR
    limit: 10,
    name: 'name',                                     // AJUSTAR
    value: 'points'                                   // AJUSTAR
  },
  // AquaCore → sanciones
  bans: {
    uri: E.MONGO_URI_BANS || base,
    db: E.MONGO_DB_BANS || 'aquacore',                // AJUSTAR
    collection: 'punishments',                        // AJUSTAR
    filter: {},                                       // AJUSTAR (p. ej. {} para todas, activas e inactivas)
    sort: { date: -1 },                               // AJUSTAR: campo de fecha
    limit: 50,
    fields: {                                         // AJUSTAR: nombre de cada campo en el documento
      player: 'name', type: 'type', reason: 'reason',
      staff: 'punisher', time: 'date', until: 'expires'
    },
    timeUnit: 'ms',                                   // 'ms' o 's' según cómo guarde las fechas
    typeMap: {}                                       // opcional: { BAN: 'Ban', MUTE: 'Mute' }
  }
};
