'use strict';
/**
 * Servidor web de AkiraPvP (sin Express; solo Node 18+ y, opcionalmente, mysql2).
 *  - Sirve /public
 *  - /api/status   jugadores online (Server List Ping al servidor de Minecraft)
 *  - /api/stats    Practice + Kitmap desde MySQL (se refresca solo en la web)
 *  - /api/bans     sanciones desde MySQL
 *  - /api/posts    novedades (staff puede crear/eliminar)
 *  - /api/login    login con el código de /web del juego
 *  - /api/plugin/code  endpoint que usa el plugin para registrar códigos
 */
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto'), net = require('net');

// ---------- .env ----------
try {
  for (const l of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) { /* sin .env */ }

const E = process.env;
const cfg = {
  port: +E.PORT || 3000,
  mcHost: E.MC_HOST || 'akirapvp.lat', mcPort: +E.MC_PORT || 25565,
  pluginSecret: E.PLUGIN_SECRET || '',
  sessionSecret: E.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  storeUrl: E.STORE_URL || '', discord: E.DISCORD_URL || '', ip: E.SERVER_IP || '',
  trustProxy: E.TRUST_PROXY === '1'
};
if (!E.SESSION_SECRET) console.warn('[aviso] SESSION_SECRET no definido: las sesiones se cerrarán al reiniciar.');
if (!cfg.pluginSecret) console.warn('[aviso] PLUGIN_SECRET no definido: el plugin /web NO podrá registrar códigos.');
const Q = require('./queries');
const PUBLIC = path.join(__dirname, '..', 'public');

// ---------- almacenamiento: MySQL o archivo ----------
let pool = null;
if (E.DB_HOST) {
  try {
    const mysql = require('mysql2/promise');
    pool = mysql.createPool({
      host: E.DB_HOST, port: +E.DB_PORT || 3306, user: E.DB_USER, password: E.DB_PASSWORD, database: E.DB_NAME,
      waitForConnections: true, connectionLimit: 5, ssl: E.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
    });
  } catch (e) { console.error('[error] DB_HOST definido pero falta mysql2: ejecuta "npm install" en /server'); }
}
const FILE = path.join(__dirname, 'data', 'store.json');
let fileDb = { codes: {}, posts: [], nextId: 1 };
try { fileDb = Object.assign(fileDb, JSON.parse(fs.readFileSync(FILE, 'utf8'))); } catch (e) { /* nuevo */ }
const saveFile = () => { try { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(fileDb)); } catch (e) { console.error(e.message); } };

const store = {
  async init() {
    if (!pool) return;
    await pool.query('CREATE TABLE IF NOT EXISTS web_codes (name_lc VARCHAR(16) PRIMARY KEY, name VARCHAR(16), uuid VARCHAR(36), code VARCHAR(9), staff TINYINT(1), expires BIGINT)');
    await pool.query('CREATE TABLE IF NOT EXISTS web_posts (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(120), tag VARCHAR(24), text TEXT, author VARCHAR(16), created BIGINT)');
  },
  async putCode(c) {
    if (pool) await pool.query('REPLACE INTO web_codes (name_lc,name,uuid,code,staff,expires) VALUES (?,?,?,?,?,?)', [c.name.toLowerCase(), c.name, c.uuid, c.code, c.staff ? 1 : 0, c.expires]);
    else { fileDb.codes[c.name.toLowerCase()] = c; saveFile(); }
  },
  async takeCode(name) { // lee y borra (un solo uso)
    const k = name.toLowerCase();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM web_codes WHERE name_lc=?', [k]);
      if (!rows.length) return null;
      await pool.query('DELETE FROM web_codes WHERE name_lc=?', [k]);
      const r = rows[0]; return { name: r.name, code: r.code, staff: !!r.staff, expires: +r.expires };
    }
    const c = fileDb.codes[k]; if (!c) return null; delete fileDb.codes[k]; saveFile(); return c;
  },
  async peekCode(name) { // para validar sin consumir si el código es incorrecto
    const k = name.toLowerCase();
    if (pool) { const [r] = await pool.query('SELECT * FROM web_codes WHERE name_lc=?', [k]); return r[0] ? { name: r[0].name, code: r[0].code, staff: !!r[0].staff, expires: +r[0].expires } : null; }
    return fileDb.codes[k] || null;
  },
  async delCode(name) { const k = name.toLowerCase(); if (pool) await pool.query('DELETE FROM web_codes WHERE name_lc=?', [k]); else { delete fileDb.codes[k]; saveFile(); } },
  async posts() {
    if (pool) { const [r] = await pool.query('SELECT id,title,tag,text,author,created FROM web_posts ORDER BY created DESC LIMIT 100'); return r.map(x => ({ ...x, created: +x.created })); }
    return [...fileDb.posts].sort((a, b) => b.created - a.created);
  },
  async addPost(p) {
    if (pool) { const [r] = await pool.query('INSERT INTO web_posts (title,tag,text,author,created) VALUES (?,?,?,?,?)', [p.title, p.tag, p.text, p.author, p.created]); return { id: r.insertId, ...p }; }
    const post = { id: fileDb.nextId++, ...p }; fileDb.posts.push(post); saveFile(); return post;
  },
  async delPost(id) {
    if (pool) { const [r] = await pool.query('DELETE FROM web_posts WHERE id=?', [id]); return r.affectedRows > 0; }
    const n = fileDb.posts.length; fileDb.posts = fileDb.posts.filter(p => p.id !== id); saveFile(); return fileDb.posts.length < n;
  }
};

// ---------- cache simple ----------
const cache = {};
async function cached(key, ttl, fn) {
  const c = cache[key];
  if (c && Date.now() - c.t < ttl) return c.v;
  try { const v = await fn(); cache[key] = { t: Date.now(), v }; return v; }
  catch (e) { if (c) return c.v; throw e; }
}

// ---------- Server List Ping (jugadores online) ----------
const varint = n => { const b = []; do { let t = n & 0x7f; n >>>= 7; if (n) t |= 0x80; b.push(t); } while (n); return Buffer.from(b); };
function readVarint(b, o) { let v = 0, s = 0; for (;;) { if (o >= b.length) return null; const x = b[o++]; v |= (x & 0x7f) << s; if (!(x & 0x80)) return { v, o }; s += 7; if (s > 35) throw new Error('varint'); } }
function pingMc(host, port, timeout = 4000) {
  return new Promise((resolve, reject) => {
    const s = net.createConnection({ host, port }); let buf = Buffer.alloc(0), end = false;
    const done = (e, v) => { if (end) return; end = true; s.destroy(); e ? reject(e) : resolve(v); };
    s.setTimeout(timeout, () => done(new Error('timeout')));
    s.on('error', done);
    s.on('connect', () => {
      const h = Buffer.from(host, 'utf8');
      const data = Buffer.concat([varint(0), varint(47), varint(h.length), h, Buffer.from([port >> 8, port & 255]), varint(1)]);
      s.write(Buffer.concat([varint(data.length), data, Buffer.from([1, 0])]));
    });
    s.on('data', d => {
      buf = Buffer.concat([buf, d]);
      try {
        const len = readVarint(buf, 0); if (!len || buf.length < len.o + len.v) return;
        const id = readVarint(buf, len.o); const sl = readVarint(buf, id.o);
        if (!sl || buf.length < sl.o + sl.v) return;
        done(null, JSON.parse(buf.slice(sl.o, sl.o + sl.v).toString('utf8')));
      } catch (e) { done(e); }
    });
  });
}
const getStatus = () => cached('status', 15000, async () => {
  try { const j = await pingMc(cfg.mcHost, cfg.mcPort); return { ok: true, online: j.players ? j.players.online : 0, max: j.players ? j.players.max : 0 }; }
  catch (e) { return { ok: false, online: null, max: null }; }
});

// ---------- stats y sanciones ----------
const DEMO = {
  practice: [['Jugador1', 1170], ['Jugador2', 1124], ['Jugador3', 1108], ['Jugador4', 1082], ['Jugador5', 1076]].map(([name, value]) => ({ name, value })),
  factions: [['Alpha', 2551], ['Bravo', 838], ['Charlie', 274]].map(([name, value]) => ({ name, value })),
  bans: [{ player: 'Cheater1', type: 'Ban', reason: 'Hacks (KillAura)', staff: 'Staff1', time: Date.now() - 864e5, until: -1 }, { player: 'Toxico2', type: 'Mute', reason: 'Insultos', staff: 'Staff2', time: Date.now() - 2 * 864e5, until: Date.now() + 5 * 864e5 }]
};
const getStats = () => cached('stats', 20000, async () => {
  if (!pool) return { demo: true, practice: DEMO.practice, factions: DEMO.factions };
  const [[p], [f]] = await Promise.all([pool.query(Q.practice), pool.query(Q.factions)]);
  const norm = r => ({ name: String(r.name), value: Number(r.value) });
  return { demo: false, practice: p.map(norm), factions: f.map(norm) };
});
const getBans = () => cached('bans', 20000, async () => {
  if (!pool) return { demo: true, bans: DEMO.bans };
  const [rows] = await pool.query(Q.bans);
  return { demo: false, bans: rows.map(r => ({ player: String(r.player), type: String(r.type), reason: String(r.reason || '—'), staff: String(r.staff || '—'), time: Number(r.time), until: Number(r.until) })) };
});

// ---------- sesiones ----------
const b64 = s => Buffer.from(s).toString('base64url');
const sign = s => crypto.createHmac('sha256', cfg.sessionSecret).update(s).digest('base64url');
const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
function makeSession(user) { const p = b64(JSON.stringify({ n: user.name, s: user.staff ? 1 : 0, e: Date.now() + 7 * 864e5 })); return p + '.' + sign(p); }
function readSession(req) {
  const m = /(?:^|;\s*)sid=([^;]+)/.exec(req.headers.cookie || ''); if (!m) return null;
  const [p, sig] = m[1].split('.'); if (!p || !sig || !safeEq(sig, sign(p))) return null;
  try { const d = JSON.parse(Buffer.from(p, 'base64url').toString()); return d.e > Date.now() ? { name: d.n, staff: !!d.s } : null; } catch (e) { return null; }
}
const cookie = (v, age) => `sid=${v}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${cfg.trustProxy ? '; Secure' : ''}`;

// ---------- utilidades HTTP ----------
const send = (res, code, obj, headers = {}) => { const b = JSON.stringify(obj); res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }); res.end(b); };
const readBody = req => new Promise((resolve, reject) => {
  let n = 0; const chunks = [];
  req.on('data', c => { n += c.length; if (n > 20000) { reject(new Error('big')); req.destroy(); } else chunks.push(c); });
  req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}')); } catch (e) { reject(new Error('json')); } });
  req.on('error', reject);
});
const clientIp = req => (cfg.trustProxy && req.headers['x-forwarded-for'] ? String(req.headers['x-forwarded-for']).split(',')[0].trim() : req.socket.remoteAddress) || '?';
const hits = new Map();
function limited(ip, max, windowMs) {
  const now = Date.now(); let h = hits.get(ip);
  if (!h || now > h.reset) h = { n: 0, reset: now + windowMs };
  h.n++; hits.set(ip, h); return h.n > max;
}
setInterval(() => { const n = Date.now(); for (const [k, v] of hits) if (n > v.reset) hits.delete(k); }, 60000).unref();

const TAGS = ['Anuncio', 'Parche', 'Evento', 'Staff'];
const NAME_RE = /^[A-Za-z0-9_]{1,16}$/, CODE_RE = /^[A-Z0-9]{4}-?[A-Z0-9]{4}$/;

// ---------- API ----------
async function api(req, res, url) {
  const p = url.pathname, m = req.method;
  const mutating = m !== 'GET' && m !== 'HEAD';
  if (mutating && p !== '/api/plugin/code' && req.headers['x-requested-with'] !== 'fetch') return send(res, 403, { error: 'Petición no permitida' });

  if (p === '/api/config' && m === 'GET') return send(res, 200, { storeUrl: cfg.storeUrl, discord: cfg.discord, ip: cfg.ip });
  if (p === '/api/status' && m === 'GET') return send(res, 200, await getStatus());
  if (p === '/api/stats' && m === 'GET') return send(res, 200, await getStats());
  if (p === '/api/bans' && m === 'GET') return send(res, 200, await getBans());
  if (p === '/api/me' && m === 'GET') return send(res, 200, readSession(req) || {});
  if (p === '/api/posts' && m === 'GET') return send(res, 200, { posts: await store.posts() });

  if (p === '/api/posts' && m === 'POST') {
    const me = readSession(req); if (!me || !me.staff) return send(res, 403, { error: 'Solo el staff puede publicar' });
    const b = await readBody(req);
    const title = String(b.title || '').trim().slice(0, 100), text = String(b.text || '').trim().slice(0, 1000), tag = TAGS.includes(b.tag) ? b.tag : 'Anuncio';
    if (!title || !text) return send(res, 400, { error: 'Título y texto son obligatorios' });
    return send(res, 200, { post: await store.addPost({ title, tag, text, author: me.name, created: Date.now() }) });
  }
  let mm;
  if ((mm = /^\/api\/posts\/(\d+)$/.exec(p)) && m === 'DELETE') {
    const me = readSession(req); if (!me || !me.staff) return send(res, 403, { error: 'Solo el staff puede eliminar' });
    return send(res, 200, { ok: await store.delPost(+mm[1]) });
  }

  if (p === '/api/login' && m === 'POST') {
    if (limited(clientIp(req), 10, 10 * 60000)) return send(res, 429, { error: 'Demasiados intentos. Espera unos minutos.' });
    const b = await readBody(req);
    const name = String(b.name || '').trim(), code = String(b.code || '').trim().toUpperCase();
    if (!NAME_RE.test(name) || !CODE_RE.test(code)) return send(res, 400, { error: 'Nombre o código inválido.' });
    const norm = c => (c.length === 8 ? c.slice(0, 4) + '-' + c.slice(4) : c);
    const rec = await store.peekCode(name);
    if (!rec || !safeEq(rec.code, norm(code))) return send(res, 401, { error: 'Código incorrecto. Genera uno nuevo con /web en el servidor.' });
    await store.delCode(name);
    if (rec.expires < Date.now()) return send(res, 401, { error: 'El código expiró. Genera uno nuevo con /web.' });
    const user = { name: rec.name, staff: rec.staff };
    return send(res, 200, { ok: true, ...user }, { 'Set-Cookie': cookie(makeSession(user), 7 * 86400) });
  }
  if (p === '/api/logout' && m === 'POST') return send(res, 200, { ok: true }, { 'Set-Cookie': cookie('', 0) });

  if (p === '/api/plugin/code' && m === 'POST') {
    if (!cfg.pluginSecret) return send(res, 503, { error: 'PLUGIN_SECRET no configurado' });
    if (!safeEq(req.headers['x-plugin-secret'] || '', cfg.pluginSecret)) return send(res, 401, { error: 'No autorizado' });
    const b = await readBody(req);
    const name = String(b.name || ''), code = String(b.code || '').toUpperCase();
    if (!NAME_RE.test(name) || !/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return send(res, 400, { error: 'Datos inválidos' });
    await store.putCode({ name, uuid: String(b.uuid || '').slice(0, 36), code, staff: !!b.staff, expires: Date.now() + 5 * 60000 });
    return send(res, 200, { ok: true });
  }
  return send(res, 404, { error: 'No encontrado' });
}

// ---------- estáticos ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json', '.webp': 'image/webp' };
function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname); if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(PUBLIC, rel));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404 · No encontrado'); }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    return serveStatic(req, res, url);
  } catch (e) {
    console.error(e.message);
    if (!res.headersSent) send(res, e.message === 'json' || e.message === 'big' ? 400 : 500, { error: e.message === 'json' ? 'JSON inválido' : 'Error del servidor' });
  }
});
store.init().then(() => server.listen(cfg.port, () => console.log(`AkiraPvP web en http://localhost:${cfg.port}  (${pool ? 'MySQL' : 'modo archivo/demo'})`)))
  .catch(e => { console.error('No se pudo iniciar el almacenamiento:', e.message); process.exit(1); });
