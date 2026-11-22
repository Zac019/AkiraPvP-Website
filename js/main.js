(async function () {
  const S = window.SITE, page = document.body.dataset.page || "home";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const api = async (url, opt = {}) => {
    const r = await fetch(url, { credentials: "same-origin", ...opt, headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" } });
    let d = {}; try { d = await r.json(); } catch { }
    if (!r.ok) throw Object.assign(new Error(d.error || "Error de red"), { status: r.status });
    return d;
  };
  const [cfg, me] = await Promise.all([api("/api/config").catch(() => ({})), api("/api/me").catch(() => ({}))]);
  const storeUrl = cfg.storeUrl || S.storeUrl, discord = cfg.discord || S.discord, ip = cfg.ip || S.ip;
  const head = (name, size) => `https://minotar.net/helm/${encodeURIComponent(name)}/${size}.png`;
  const fmt = n => Number(n).toLocaleString("es");
  const arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
  const ACCENT = { Anuncio: "#ff2d2d", Parche: "#ff7a7a", Evento: "#55e07a", Staff: "#c77dff" };

  const nav = [["home", "index.html", "Inicio"], ["posts", "novedades.html", "Novedades"], ["staff", "staff.html", "Staff"], ["ranking", "ranking.html", "Ranking"], ["sanciones", "sanciones.html", "Sanciones"]];
  const cls = on => on ? "bg-surface-secondary text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" : "text-muted hover:bg-surface-secondary hover:text-foreground";

  /* ---------- shell ---------- */
  const userBtn = me.name
    ? `<a href="cuenta.html" class="pill-user"><img alt="" src="${head(me.name, 56)}"/>${esc(me.name)}</a>`
    : `<a class="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors duration-150 bg-gold text-[#0b0c0e] hover:bg-gold-hover" href="entrar.html">Entrar</a>`;
  const header = `
  <header class="sticky top-3 z-50 px-3 pt-3 sm:px-6">
    <div class="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 glass rounded-full pr-2 pl-5">
      <a class="flex shrink-0 items-center gap-2.5 text-[17px] font-semibold tracking-tight text-foreground" href="index.html">
        <img alt="" width="56" height="56" class="-my-2 size-14 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]" src="img/logo.png"/>${esc(S.domain)}
      </a>
      <nav aria-label="Principal" class="no-scrollbar hidden min-w-0 items-center gap-1 overflow-x-auto text-sm font-medium md:flex">
        ${nav.map(n => `<a class="shrink-0 rounded-full px-3 py-2 transition-colors duration-150 ${cls(n[0] === page)}" href="${n[1]}">${n[2]}</a>`).join("")}
      </nav>
      <div class="flex shrink-0 items-center gap-2">
        ${storeUrl ? `<a class="btn hide-mobile" href="${esc(storeUrl)}" target="_blank" rel="noopener noreferrer">Tienda</a>` : ""}
        ${userBtn}
      </div>
    </div>
  </header>
  <nav aria-label="Principal" class="glass fixed inset-x-3 bottom-3 z-50 flex items-center justify-between gap-1 rounded-full p-1.5 md:hidden">
    ${nav.map(n => `<a class="flex-1 rounded-full px-1 py-2.5 text-center text-xs font-semibold transition-colors duration-150 ${cls(n[0] === page)}" href="${n[1]}">${n[2]}</a>`).join("")}
    ${storeUrl ? `<a class="flex-1 rounded-full px-1 py-2.5 text-center text-xs font-semibold nav-store" href="${esc(storeUrl)}" target="_blank" rel="noopener noreferrer">Tienda</a>` : ""}
  </nav>`;
  const footer = `
  <footer class="relative z-10 border-t border-[#2E2E38] bg-[#0b0c0e] py-10">
    <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-7 md:flex-row">
      <div class="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
        <span class="flex items-center gap-2.5 text-base font-semibold tracking-tight text-foreground"><span class="size-2 rounded-full bg-gold"></span>${esc(S.domain)}</span>
        <span class="max-w-md text-xs leading-relaxed text-muted">Red competitiva de Minecraft. No afiliado con Mojang ni Microsoft.</span>
      </div>
      <nav class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
        ${nav.slice(1).map(n => `<a class="transition-colors duration-150 hover:text-foreground" href="${n[1]}">${n[2]}</a>`).join("")}
        ${storeUrl ? `<a class="transition-colors duration-150 hover:text-foreground" href="${esc(storeUrl)}" target="_blank" rel="noopener noreferrer">Tienda</a>` : ""}
      </nav>
    </div>
  </footer>
  <a href="${esc(discord)}" target="_blank" rel="noopener noreferrer" aria-label="Unirse al Discord" class="group fixed right-4 bottom-24 z-40 flex items-center gap-2 rounded-full bg-[#5865F2] p-3 text-sm font-semibold text-white shadow-lg shadow-black/40 ring-1 ring-white/15 transition-[filter,transform] duration-150 hover:brightness-110 active:scale-95 md:right-6 md:bottom-6">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.2.5a18 18 0 0 0-6.4 0L8.6 3a19.8 19.8 0 0 0-4.9 1.4C.6 9 0 13.5.3 18a20 20 0 0 0 6 3l.8-1.3-1.3-.7.3-.3a14 14 0 0 0 11.8 0l.3.3-1.3.7.8 1.3a20 20 0 0 0 6-3c.4-5.2-.7-9.7-3.4-13.6ZM8.7 15.3c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Zm6.6 0c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Z"/></svg>
    <span class="hidden pr-1 md:inline">Discord</span></a>`;

  /* ---------- componentes ---------- */
  const copyBtn = () => `<button type="button" data-copy="${esc(ip)}" class="group flex h-[52px] cursor-pointer select-none items-center gap-3 rounded-[14px] border border-[#2E2E38] bg-[#121216] pr-2 pl-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_14px_28px_-16px_rgba(0,0,0,0.9)] transition-[border-color,transform] duration-150 hover:border-gold active:scale-[0.98]" aria-label="Copiar IP ${esc(ip)}">
    <span class="font-mono text-[15px] font-medium tracking-tight text-foreground">${esc(ip)}</span>
    <span data-copy-label class="flex h-9 items-center gap-2 rounded-[9px] px-3.5 text-sm font-semibold bg-gold text-[#0b0c0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_16px_-6px_rgba(255,45,45,0.6)]">Copiar</span></button>`;
  const link = (href, t, ext) => `<a class="inline-flex items-center gap-0.5 text-[15px] font-medium text-gold transition-colors duration-150 hover:text-gold-hover" href="${esc(href)}" ${ext ? 'target="_blank" rel="noopener noreferrer"' : ""}>${t} ${arrow}</a>`;
  const rowsHtml = (list, showHead) => list.length ? list.map((p, i) => `<li><a class="flex items-center gap-4 border-t border-white/[0.07] py-3 transition-colors duration-150 hover:bg-white/[0.03]" href="ranking.html">
    <span class="num w-6 text-sm font-semibold ${i === 0 ? "text-gold" : "text-muted"}">${i + 1}</span>
    ${showHead ? `<img alt="Skin de ${esc(p.name)}" loading="lazy" width="28" height="28" class="rounded-lg bg-surface-tertiary" src="${head(p.name, 56)}"/>` : ""}
    <span class="min-w-0 flex-1 truncate font-medium">${esc(p.name)}</span>
    <span class="num font-mono text-sm text-data">${fmt(p.value)}</span></a></li>`).join("") : `<li class="border-t border-white/[0.07] py-4 text-sm text-muted">Sin datos todavía.</li>`;
  const countdown = o => `<section class="bento flex flex-col gap-3 p-5" aria-label="Cuenta regresiva: ${esc(o.label)}">
    <div class="flex items-baseline justify-between gap-3"><h3 class="text-lg font-semibold tracking-[-0.02em]">${esc(o.label)}</h3><span data-open class="hidden rounded-full bg-ok/15 px-3 py-0.5 text-sm font-bold text-ok">¡Ya abrió!</span></div>
    <div data-cd="${o.at}" class="flex gap-2">${["Días", "Horas", "Min", "Seg"].map(n => `<div class="flex min-w-0 flex-1 flex-col items-center rounded-xl bg-black/25 px-2 py-3 ring-1 ring-white/[0.06]"><span class="num font-mono text-3xl leading-none font-semibold tabular-nums sm:text-4xl">00</span><span class="mt-1.5 text-[11px] font-semibold tracking-wider text-muted uppercase">${n}</span></div>`).join("")}</div>
    <p class="text-xs leading-relaxed text-muted"><time datetime="${o.at}">${esc(o.text)}</time></p></section>`;
  const title = (t, s) => `<div class="flex flex-col gap-2 pt-8 pb-4"><h1 class="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">${t}</h1>${s ? `<p class="max-w-xl text-lg text-muted">${s}</p>` : ""}</div>`;
  const postCard = p => `<article class="bento flex flex-col gap-3 p-6" style="--post-accent:${ACCENT[p.tag] || "#ff2d2d"}"><span class="post-accent-rule"></span><span class="post-tag w-fit rounded-full px-3 py-0.5 text-xs font-bold">${esc(p.tag)}</span><h2 class="text-xl font-semibold tracking-[-0.02em]">${esc(p.title)}</h2><p class="text-sm leading-relaxed text-muted" style="white-space:pre-line">${esc(p.text)}</p><p class="mt-auto text-xs text-muted">${new Date(p.created).toLocaleDateString("es", { dateStyle: "long" })} · ${esc(p.author)}</p></article>`;

  /* ---------- páginas ---------- */
  const pages = {
    home: () => `<div class="flex flex-col gap-5 pb-10">
      <section class="relative grid items-center gap-10 overflow-x-clip pt-14 pb-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20">
        <div aria-hidden="true" class="pointer-events-none absolute -top-24 right-0 -z-10 size-[520px] rounded-full bg-gold/15 blur-[120px]"></div>
        <div class="flex min-w-0 flex-col items-start gap-6">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pr-4 pl-3 text-sm backdrop-blur"><span id="online-dot" class="size-2 rounded-full bg-muted"></span><span class="num font-mono font-medium" id="online">—</span><span class="text-muted" id="online-label">en línea ahora</span></span>
          <h1 class="text-balance text-[44px] leading-[0.98] min-[400px]:text-6xl font-semibold tracking-[-0.045em] sm:text-7xl lg:text-[76px] xl:text-[84px]">${esc(S.tagline[0])}<br/><span class="text-gold">${esc(S.tagline[1])}</span></h1>
          <p class="max-w-lg text-xl leading-relaxed text-muted">${esc(S.sub)}</p>
          <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">${copyBtn()}${storeUrl ? link(storeUrl, "Ir a la tienda", true) : ""}</div>
        </div>
        <a class="group relative mx-auto w-full max-w-sm" href="ranking.html">
          <div aria-hidden="true" class="absolute inset-x-6 top-10 -z-10 h-full rounded-[32px] border border-white/10 bg-white/[0.03] [transform:perspective(900px)_rotateY(-14deg)_rotateX(6deg)_translateX(20px)]"></div>
          <div class="bento flex flex-col items-center gap-5 p-8 text-center shadow-[-24px_36px_60px_-20px_rgba(0,0,0,0.9),0_0_80px_rgba(255,45,45,0.18)] [transform:perspective(900px)_rotateY(-14deg)_rotateX(6deg)] transition-transform duration-300 group-hover:[transform:perspective(900px)_rotateY(-6deg)_rotateX(3deg)_translateY(-4px)]">
            <span class="rounded-full bg-gold px-3 py-1 text-xs font-bold tracking-wide text-[#0b0c0e]">N.º 1 EN PRACTICE</span>
            <div id="hero-top" class="flex flex-col items-center gap-5"><p class="text-muted">Cargando…</p></div>
          </div></a>
      </section>
      <section aria-label="Aperturas" class="grid gap-4 md:grid-cols-2">${S.openings.map(countdown).join("")}</section>
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <section class="bento flex flex-col gap-4 p-8 lg:col-span-5"><h2 class="text-[28px] leading-tight font-semibold tracking-[-0.03em]">Practice</h2><ol id="practice-list"></ol><div class="mt-auto">${link("ranking.html", "Ranking completo")}</div></section>
        <section class="bento flex flex-col gap-5 p-8 lg:col-span-7"><h2 class="text-[28px] leading-tight font-semibold tracking-[-0.03em]">Kitmap</h2>
          <p class="text-[15px] leading-relaxed text-muted">Facciones de hasta 8 jugadores, seis clases y kits listos para pelear. Sin farmeo: entras y combates.</p>
          <div class="flex flex-col gap-2"><p class="text-sm font-medium text-muted">Mejores facciones</p><ol id="factions-list"></ol></div><div class="mt-auto">${link("ranking.html", "Ver facciones")}</div></section>
      </div><p id="demo-note" hidden class="text-center text-xs text-muted">Datos de ejemplo: conecta MySQL en el servidor para ver las estadísticas reales.</p></div>`,

    posts: () => title("Novedades", "Anuncios, parches y eventos de la red.") + `<div id="posts-grid" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-10"></div>`,

    staff: () => title("Staff", "El equipo que mantiene la red segura y justa.") + `<div class="flex flex-col gap-5 pb-10">
      ${me.staff ? `<section class="bento flex flex-col gap-5 p-8" id="admin">
        <div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="text-2xl font-semibold tracking-[-0.03em]">Panel de staff</h2><p class="text-sm text-muted">Publica y elimina novedades de la web.</p></div><button type="button" id="toggle-admin" class="btn btn-red">Gestionar novedades</button></div>
        <div id="admin-body" hidden class="flex flex-col gap-6">
          <form id="post-form" class="flex flex-col gap-3">
            <div class="row2"><input name="title" required maxlength="100" placeholder="Título" class="field"/><select name="tag" class="field"><option>Anuncio</option><option>Parche</option><option>Evento</option><option>Staff</option></select></div>
            <textarea name="text" required maxlength="1000" placeholder="Texto de la novedad" class="field field-area"></textarea>
            <p id="post-err" role="alert" hidden class="rounded-xl bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger"></p>
            <div><button type="submit" class="btn btn-red">Publicar novedad</button></div></form>
          <div><h3 class="mb-2 text-sm font-semibold text-muted uppercase tracking-wider">Novedades publicadas</h3><ul id="admin-list" class="flex flex-col gap-2"></ul></div>
        </div></section>` : ""}
      ${S.staff.map(g => `<section class="bento flex flex-col gap-5 p-8"><div class="flex items-center gap-3"><span class="size-3 rounded-full" style="background:${g.color};box-shadow:0 0 12px ${g.color}"></span><h2 class="text-2xl font-semibold tracking-[-0.03em]" style="color:${g.color}">${esc(g.rank)}</h2><span class="num font-mono text-sm text-muted">${g.members.length}</span></div><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">${g.members.map(m => `<div class="staff-card flex items-center gap-4 rounded-2xl bg-black/25 p-4 ring-1 ring-white/[0.06] transition-transform duration-150 hover:-translate-y-0.5"><img alt="Skin de ${esc(m.name)}" loading="lazy" width="56" height="56" class="rounded-xl bg-surface-tertiary" src="${head(m.name, 112)}"/><div class="min-w-0"><p class="truncate font-semibold">${esc(m.name)}</p><p class="truncate text-xs font-semibold" style="color:${g.color}">${esc(m.role)}</p></div></div>`).join("")}</div></section>`).join("")}</div>`,

    ranking: () => title("Ranking", "Se actualiza automáticamente.") + `<div class="grid grid-cols-1 gap-5 lg:grid-cols-2 pb-10"><section class="bento flex flex-col gap-4 p-8"><h2 class="text-[28px] font-semibold tracking-[-0.03em]">Practice</h2><ol id="practice-list"></ol></section><section class="bento flex flex-col gap-4 p-8"><h2 class="text-[28px] font-semibold tracking-[-0.03em]">Facciones Kitmap</h2><ol id="factions-list"></ol></section></div><p id="demo-note" hidden class="pb-10 text-center text-xs text-muted">Datos de ejemplo: conecta MySQL en el servidor para ver las estadísticas reales.</p>`,

    sanciones: () => title("Sanciones", "Historial público de bans y mutes. Se actualiza automáticamente.") + `<div class="doc-table mb-10"><table><thead><tr><th>Jugador</th><th>Tipo</th><th>Motivo</th><th>Staff</th><th>Fecha</th><th>Duración</th></tr></thead><tbody id="bans-body"><tr><td colspan="6" class="text-muted">Cargando…</td></tr></tbody></table></div><p id="demo-note" hidden class="pb-10 text-center text-xs text-muted">Datos de ejemplo: conecta MySQL en el servidor para ver las sanciones reales.</p>`,

    entrar: () => `<div class="mx-auto flex max-w-md flex-col gap-5 pt-16 pb-10"><div class="bento flex flex-col gap-5 p-8"><h1 class="text-3xl font-semibold tracking-[-0.03em]">Entrar</h1><p class="text-sm text-muted">Escribe <span class="font-mono text-foreground">/web</span> en el Hub del servidor para obtener tu código (dura 5 minutos).</p>
      <form id="login" class="flex flex-col gap-4"><label class="flex flex-col gap-1.5 text-sm font-bold">Nombre de Minecraft<input name="name" required maxlength="16" autocomplete="username" class="field text-base font-normal"/></label>
      <label class="flex flex-col gap-1.5 text-sm font-bold">Código de <span class="font-mono">/web</span><input name="code" required maxlength="9" placeholder="XXXX-XXXX" autocomplete="one-time-code" class="field font-mono text-base tracking-widest uppercase"/></label>
      <p id="err" role="alert" hidden class="rounded-xl bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger"></p>
      <button type="submit" id="login-btn" class="h-[52px] rounded-[14px] bg-gold px-7 text-[15px] font-semibold text-[#0b0c0e] hover:bg-gold-hover">Entrar</button></form></div></div>`,

    cuenta: () => me.name ? title("Tu cuenta", "") + `<section class="bento mb-10 flex flex-wrap items-center gap-5 p-8"><img class="rounded-2xl" width="80" height="80" alt="" src="${head(me.name, 160)}"/><div><p class="text-2xl font-semibold">${esc(me.name)} ${me.staff ? '<span class="badge-staff">STAFF</span>' : ""}</p><div class="mt-3 flex gap-2">${me.staff ? '<a class="btn btn-red" href="staff.html">Panel de staff</a>' : ""}<button id="out" class="btn">Cerrar sesión</button></div></div></section>` : `<p class="pt-16 text-muted">No has iniciado sesión. <a class="text-gold" href="entrar.html">Entrar</a></p>`
  };

  /* ---------- montar ---------- */
  document.body.insertAdjacentHTML("afterbegin", header);
  const main = document.createElement("main");
  main.className = "mx-auto w-full max-w-7xl grow px-4 pt-6 pb-28 sm:px-7 md:pb-10";
  main.innerHTML = (pages[page] || pages.home)();
  document.body.append(main);
  document.body.insertAdjacentHTML("beforeend", footer);
  document.title = (page === "home" ? "" : nav.find(n => n[0] === page)?.[2] + " · ") + S.name + " · Red competitiva de Minecraft";

  /* ---------- tiempo real ---------- */
  const poll = (fn, ms) => { fn(); setInterval(() => { if (!document.hidden) fn(); }, ms); };
  const demo = on => { const n = $("#demo-note"); if (n) n.hidden = !on; };

  if ($("#online")) poll(async () => {
    try {
      const s = await api("/api/status");
      $("#online").textContent = s.ok ? s.online : "—";
      $("#online-dot").className = "size-2 rounded-full " + (s.ok ? "bg-ok shadow-[0_0_10px_#55E07A]" : "bg-muted");
      $("#online-label").textContent = s.ok ? "en línea ahora" : "servidor sin conexión";
    } catch { }
  }, 20000);

  if ($("#practice-list")) poll(async () => {
    try {
      const s = await api("/api/stats");
      $("#practice-list").innerHTML = rowsHtml(page === "home" ? s.practice.slice(0, 5) : s.practice, true);
      $("#factions-list").innerHTML = rowsHtml(page === "home" ? s.factions.slice(0, 3) : s.factions, false);
      const top = $("#hero-top"), t = s.practice[0];
      if (top) top.innerHTML = t ? `<img alt="Skin de ${esc(t.name)}" width="112" height="112" class="rounded-2xl bg-surface-tertiary shadow-[0_18px_30px_-12px_rgba(0,0,0,0.9)]" src="${head(t.name, 224)}"/><div><p class="text-3xl font-semibold tracking-[-0.03em]">${esc(t.name)}</p><p class="num mt-1 font-mono text-lg text-data">${fmt(t.value)} <span class="text-muted">ELO</span></p></div>` : `<p class="text-muted">Sin datos todavía.</p>`;
      demo(s.demo);
    } catch { }
  }, 30000);

  if ($("#bans-body")) poll(async () => {
    try {
      const s = await api("/api/bans"), now = Date.now();
      const dur = b => b.until <= 0 ? "Permanente" : b.until > now ? "Hasta " + new Date(b.until).toLocaleDateString("es") : "Expirada";
      $("#bans-body").innerHTML = s.bans.length ? s.bans.map(b => `<tr><td><span class="flex items-center gap-2"><img alt="" width="20" height="20" class="rounded" src="${head(b.player, 40)}"/>${esc(b.player)}</span></td><td>${esc(b.type)}</td><td>${esc(b.reason)}</td><td>${esc(b.staff)}</td><td>${new Date(b.time).toLocaleDateString("es")}</td><td>${dur(b)}</td></tr>`).join("") : `<tr><td colspan="6" class="text-muted">No hay sanciones registradas.</td></tr>`;
      demo(s.demo);
    } catch { }
  }, 30000);

  /* ---------- novedades (públicas + panel staff) ---------- */
  let postsCache = [];
  const renderPosts = () => {
    const g = $("#posts-grid"); if (g) g.innerHTML = postsCache.length ? postsCache.map(postCard).join("") : `<p class="text-muted">Aún no hay novedades.</p>`;
    const l = $("#admin-list"); if (l) l.innerHTML = postsCache.length ? postsCache.map(p => `<li class="flex items-center justify-between gap-3 rounded-xl bg-black/25 px-4 py-3 ring-1 ring-white/[0.06]"><span class="min-w-0 truncate"><span class="font-semibold">${esc(p.title)}</span> <span class="text-xs text-muted">· ${esc(p.tag)} · ${esc(p.author)}</span></span><button type="button" class="btn btn-danger" data-del="${p.id}">Eliminar</button></li>`).join("") : `<li class="text-sm text-muted">No hay novedades.</li>`;
  };
  const loadPosts = async () => { try { postsCache = (await api("/api/posts")).posts; renderPosts(); } catch { } };
  if ($("#posts-grid") || $("#admin-list")) poll(loadPosts, 60000);

  if ($("#toggle-admin")) {
    $("#toggle-admin").onclick = () => { const b = $("#admin-body"); b.hidden = !b.hidden; $("#toggle-admin").textContent = b.hidden ? "Gestionar novedades" : "Cerrar panel"; };
    $("#post-form").addEventListener("submit", async e => {
      e.preventDefault(); const f = e.target, err = $("#post-err"); err.hidden = true;
      try { await api("/api/posts", { method: "POST", body: JSON.stringify({ title: f.title.value, tag: f.tag.value, text: f.text.value }) }); f.reset(); await loadPosts(); }
      catch (x) { err.textContent = x.message; err.hidden = false; }
    });
    $("#admin-list").addEventListener("click", async e => {
      const b = e.target.closest("[data-del]"); if (!b || !confirm("¿Eliminar esta novedad?")) return;
      try { await api("/api/posts/" + b.dataset.del, { method: "DELETE" }); await loadPosts(); } catch (x) { alert(x.message); }
    });
  }

  /* ---------- copiar IP / cuenta regresiva ---------- */
  document.addEventListener("click", async e => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { const t = document.createElement("textarea"); t.value = b.dataset.copy; document.body.append(t); t.select(); document.execCommand("copy"); t.remove(); }
    const l = $("[data-copy-label]", b); l.textContent = "Copiada"; setTimeout(() => { l.textContent = "Copiar"; }, 2000);
  });
  const tick = () => document.querySelectorAll("[data-cd]").forEach(el => {
    let d = new Date(el.dataset.cd) - Date.now(); const done = !(d > 0); if (done) d = 0;
    const s = Math.floor(d / 1000), v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
    el.querySelectorAll(".num").forEach((n, i) => n.textContent = String(v[i]).padStart(2, "0"));
    const badge = el.parentElement.querySelector("[data-open]"); if (badge) badge.classList.toggle("hidden", !done);
  });
  if ($("[data-cd]")) { tick(); setInterval(tick, 1000); }

  /* ---------- login con código de /web ---------- */
  const f = $("#login");
  if (f) {
    const doLogin = async () => {
      const err = $("#err"), btn = $("#login-btn"); err.hidden = true; btn.disabled = true; btn.textContent = "Comprobando…";
      try { await api("/api/login", { method: "POST", body: JSON.stringify({ name: f.name.value.trim(), code: f.code.value.trim() }) }); location.href = "cuenta.html"; }
      catch (x) { err.textContent = x.message; err.hidden = false; btn.disabled = false; btn.textContent = "Entrar"; }
    };
    f.addEventListener("submit", e => { e.preventDefault(); doLogin(); });
    const m = /^#([A-Za-z0-9_]{1,16})\.([A-Za-z0-9]{8})$/.exec(location.hash); // enlace directo desde el juego
    if (m) { history.replaceState(null, "", location.pathname); f.name.value = m[1]; f.code.value = m[2]; doLogin(); }
  }
  const out = $("#out"); if (out) out.onclick = async () => { try { await api("/api/logout", { method: "POST", body: "{}" }); } catch { } location.href = "index.html"; };
})();
