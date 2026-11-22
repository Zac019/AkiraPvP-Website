'use strict';
// Muestra bases, colecciones y UN documento de ejemplo de cada una (oculta campos sensibles).
// Uso:  MONGO_URI="mongodb+srv://usuario:clave@host" node tools/inspect-mongo.js [nombreBase]
const { MongoClient } = require('mongodb');
const uri = process.argv[3] || process.env.MONGO_URI;
if (!uri) { console.error('Define MONGO_URI (en .env o en la línea de comandos).'); process.exit(1); }
const only = process.argv[2];
const SENS = /pass|token|secret|email|salt|hash|ip$|address|session|2fa|auth/i;
const clean = (v, k = '') => {
  if (SENS.test(k)) return '<oculto>';
  if (Array.isArray(v)) return v.slice(0, 2).map(x => clean(x)).concat(v.length > 2 ? ['…'] : []);
  if (v && typeof v === 'object' && !(v instanceof Date) && !v._bsontype) return Object.fromEntries(Object.entries(v).slice(0, 25).map(([a, b]) => [a, clean(b, a)]));
  if (v && v._bsontype) return String(v);
  return typeof v === 'string' && v.length > 80 ? v.slice(0, 80) + '…' : v;
};
(async () => {
  const c = await new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect();
  let dbs = [];
  try { dbs = (await c.db().admin().listDatabases()).databases.map(d => d.name); } catch (e) { dbs = [c.db().databaseName]; console.log('(sin permiso para listar bases; usando la base de la URI)'); }
  for (const name of dbs.filter(n => !['admin', 'local', 'config'].includes(n) && (!only || n === only))) {
    console.log('\n=== BASE:', name);
    for (const col of await c.db(name).listCollections().toArray()) {
      const co = c.db(name).collection(col.name);
      const n = await co.estimatedDocumentCount();
      const doc = await co.findOne({});
      console.log(`\n-- colección: ${col.name}  (${n} documentos)`);
      if (doc) console.log(JSON.stringify(clean(doc), null, 2));
    }
  }
  await c.close();
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
