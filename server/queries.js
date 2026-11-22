// ============================================================
//  CONSULTAS SQL — ADÁPTALAS A TUS TABLAS
//  Cada consulta debe devolver estas columnas (usa alias con AS):
//    practice / factions → name, value
//    bans               → player, type, reason, staff, time, until   (time/until en milisegundos)
// ============================================================
module.exports = {
  // Ranking de Practice (ELO). Cambia tabla y columnas por las de tu plugin.
  practice: "SELECT name, elo AS value FROM practice_stats ORDER BY elo DESC LIMIT 10",

  // Mejores facciones de Kitmap/HCF.
  factions: "SELECT name, points AS value FROM factions ORDER BY points DESC LIMIT 10",

  // Sanciones (ejemplo para LiteBans). Si usas otro plugin (AdvancedBan, etc.) cambia esta consulta.
  bans: `
    SELECT * FROM (
      SELECT (SELECT h.name FROM litebans_history h WHERE h.uuid = b.uuid ORDER BY h.date DESC LIMIT 1) AS player,
             'Ban' AS type, b.reason AS reason, b.banned_by_name AS staff, b.time AS time, b.until AS until
        FROM litebans_bans b
      UNION ALL
      SELECT (SELECT h.name FROM litebans_history h WHERE h.uuid = m.uuid ORDER BY h.date DESC LIMIT 1),
             'Mute', m.reason, m.banned_by_name, m.time, m.until
        FROM litebans_mutes m
    ) s
    WHERE player IS NOT NULL
    ORDER BY time DESC LIMIT 50`
};
