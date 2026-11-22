'use strict';
// Lectura de MongoDB (stats y sanciones) + conexión compartida. Requiere el paquete "mongodb".
let MongoClient = null;
try { ({ MongoClient } = require('mongodb')); } catch (e) { /* se avisa al usarlo */ }
const clients = new Map();

function client(uri) {
  if (!MongoClient) throw new Error('Falta el paquete "mongodb": ejecuta "npm install" en /server');
  if (!clients.has(uri)) {
    const c = new MongoClient(uri, { serverSelectionTimeoutMS: 6000, maxPoolSize: 5 });
    const p = c.connect().catch(e => { clients.delete(uri); throw e; });
    clients.set(uri, p);
  }
  return clients.get(uri);
}
const get = (doc, p) => String(p).split('.').reduce((o, k) => (o == null ? undefined : o[k]), doc);
const num = x => (x && typeof x.toNumber === 'function' ? x.toNumber() : Number(x));

async function find(spec) {
  const c = await client(spec.uri);
  let cur = c.db(spec.db).collection(spec.collection).find(spec.filter || {});
  if (spec.sort) cur = cur.sort(spec.sort);
  return cur.limit(spec.limit || 10).toArray();
}
// Ranking: [{name, value}]
async function ranking(spec) {
  const docs = await find(spec);
  return docs.map(d => ({ name: String(get(d, spec.name) ?? '?'), value: num(get(d, spec.value)) || 0 }));
}
// Sanciones: [{player,type,reason,staff,time,until}]
async function bans(spec) {
  const docs = await find(spec), f = spec.fields, k = spec.timeUnit === 's' ? 1000 : 1;
  return docs.map(d => ({
    player: String(get(d, f.player) ?? '?'),
    type: String((spec.typeMap && spec.typeMap[get(d, f.type)]) || get(d, f.type) || 'Ban'),
    reason: String(get(d, f.reason) ?? '—'),
    staff: String(get(d, f.staff) ?? '—'),
    time: (num(get(d, f.time)) || 0) * k,
    until: get(d, f.until) == null ? -1 : (num(get(d, f.until)) || 0) * (num(get(d, f.until)) > 0 ? k : 1)
  }));
}
module.exports = { client, ranking, bans };
