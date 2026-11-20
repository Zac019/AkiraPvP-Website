(function () {
  const S = window.SITE, page = document.body.dataset.page || "home";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const head = (uuid, size) => `https://minotar.net/helm/${uuid}/${size}.png`;
  const nav = [["home", "index.html", "Inicio"], ["posts", "novedades.html", "Novedades"], ["tienda", "tienda.html", "Tienda", 1], ["ranking", "ranking.html", "Ranking"], ["pase", "pase.html", "Pase"], ["sanciones", "sanciones.html", "Sanciones"]];
  const cls = (k, on, gold, mob) => on ? "bg-surface-secondary text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" : gold ? "text-gold hover:bg-surface-secondary" : "text-muted hover:bg-surface-secondary hover:text-foreground";
  const arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

  /* ---------- shell ---------- */
  const header = `
  <header class="sticky top-3 z-50 px-3 pt-3 sm:px-6">
    <div class="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 glass rounded-full pr-2 pl-5">
      <a class="flex shrink-0 items-center gap-2.5 text-[17px] font-semibold tracking-tight text-foreground" href="index.html">
        <img alt="" width="56" height="56" class="-my-2 size-14 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]" src="img/logo.svg"/>${esc(S.domain)}
      </a>
      <nav aria-label="Principal" class="no-scrollbar hidden min-w-0 items-center gap-1 overflow-x-auto text-sm font-medium md:flex">
        ${nav.map(n => `<a class="shrink-0 rounded-full px-3 py-2 transition-colors duration-150 ${cls(n[0], n[0] === page, n[3])}" href="${n[1]}">${n[2]}</a>`).join("")}
      </nav>
      <a class="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors duration-150 bg-gold text-[#0b0c0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_20px_-8px_rgba(255,170,0,0.55)] hover:bg-gold-hover" href="entrar.html">Entrar</a>
    </div>
  </header>
  <nav aria-label="Principal" class="glass fixed inset-x-3 bottom-3 z-50 flex items-center justify-between gap-1 rounded-full p-1.5 md:hidden">
    ${nav.map(n => `<a class="flex-1 rounded-full px-1 py-2.5 text-center text-xs font-semibold transition-colors duration-150 ${cls(n[0], n[0] === page, n[3])}" href="${n[1]}">${n[2]}</a>`).join("")}
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
      </nav>
    </div>
  </footer>
  <a href="${esc(S.discord)}" target="_blank" rel="noopener noreferrer" aria-label="Unirse al Discord" class="group fixed right-4 bottom-24 z-40 flex items-center gap-2 rounded-full bg-[#5865F2] p-3 text-sm font-semibold text-white shadow-lg shadow-black/40 ring-1 ring-white/15 transition-[filter,transform] duration-150 hover:brightness-110 active:scale-95 md:right-6 md:bottom-6">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.2.5a18 18 0 0 0-6.4 0L8.6 3a19.8 19.8 0 0 0-4.9 1.4C.6 9 0 13.5.3 18a20 20 0 0 0 6 3l.8-1.3-1.3-.7.3-.3a14 14 0 0 0 11.8 0l.3.3-1.3.7.8 1.3a20 20 0 0 0 6-3c.4-5.200-.7-9.700-3.400-13.600ZM8.700 15.300c-1.100 0-2-1-2-2.200s.9-2.200 2-2.200 2 1 2 2.200-.9 2.200-2 2.200Zm6.600 0c-1.100 0-2-1-2-2.200s.9-2.200 2-2.200 2 1 2 2.200-.9 2.200-2 2.200Z"/></svg>
    <span class="hidden pr-1 md:inline">Discord</span></a>`;

  /* ---------- components ---------- */
  const copyBtn = () => `<button type="button" data-copy="${esc(S.ip)}" class="group flex h-[52px] cursor-pointer select-none items-center gap-3 rounded-[14px] border border-[#2E2E38] bg-[#121216] pr-2 pl-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_14px_28px_-16px_rgba(0,0,0,0.9)] transition-[border-color,transform] duration-150 hover:border-gold active:scale-[0.98]" aria-label="Copiar IP ${esc(S.ip)}">
    <span class="font-mono text-[15px] font-medium tracking-tight text-foreground">${esc(S.ip)}</span>
    <span data-copy-label class="flex h-9 items-center gap-2 rounded-[9px] px-3.5 text-sm font-semibold bg-gold text-[#0b0c0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_16px_-6px_rgba(255,170,0,0.6)]">Copiar</span></button>`;
  const link = (href, t) => `<a class="inline-flex items-center gap-0.5 text-[15px] font-medium text-gold transition-colors duration-150 hover:text-gold-hover" href="${href}">${t} ${arrow}</a>`;
  const row = (i, p) => `<li><a class="flex items-center gap-4 border-t border-white/[0.07] py-3 transition-colors duration-150 hover:bg-white/[0.03]" href="#">
    <span class="num w-6 text-sm font-semibold ${i === 0 ? "text-gold" : "text-muted"}">${i + 1}</span>
    ${p.uuid ? `<img alt="Skin de ${esc(p.name)}" loading="lazy" width="28" height="28" class="rounded-lg bg-surface-tertiary" src="${head(p.uuid, 56)}"/>` : ""}
    <span class="min-w-0 flex-1 truncate font-medium">${esc(p.name)}</span>
    <span class="num font-mono text-sm text-data">${(p.elo ?? p.pts).toLocaleString("es")}</span></a></li>`;
  const countdown = o => `<section class="bento flex flex-col gap-3 p-5" aria-label="Cuenta regresiva: ${esc(o.label)}">
    <div class="flex items-baseline justify-between gap-3"><h3 class="text-lg font-semibold tracking-[-0.02em]">${esc(o.label)}</h3><span data-open class="hidden rounded-full bg-ok/15 px-3 py-0.5 text-sm font-bold text-ok">¡Ya abrió!</span></div>
    <div data-cd="${o.at}" class="flex gap-2">${["Días", "Horas", "Min", "Seg"].map(n => `<div class="flex min-w-0 flex-1 flex-col items-center rounded-xl bg-black/25 px-2 py-3 ring-1 ring-white/[0.06]"><span class="num font-mono text-3xl leading-none font-semibold tabular-nums sm:text-4xl">00</span><span class="mt-1.5 text-[11px] font-semibold tracking-wider text-muted uppercase">${n}</span></div>`).join("")}</div>
    <p class="text-xs leading-relaxed text-muted"><time datetime="${o.at}">${esc(o.text)}</time></p></section>`;
  const title = (t, s) => `<div class="flex flex-col gap-2 pt-8 pb-4"><h1 class="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">${t}</h1>${s ? `<p class="max-w-xl text-lg text-muted">${s}</p>` : ""}</div>`;

  /* ---------- pages ---------- */
  const pages = {
    home: () => `<div class="flex flex-col gap-5 pb-10">
      <section class="relative grid items-center gap-10 overflow-x-clip pt-14 pb-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20">
        <div aria-hidden="true" class="pointer-events-none absolute -top-24 right-0 -z-10 size-[520px] rounded-full bg-gold/15 blur-[120px]"></div>
        <div class="flex min-w-0 flex-col items-start gap-6">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pr-4 pl-3 text-sm backdrop-blur"><span class="size-2 rounded-full bg-ok shadow-[0_0_10px_#55E07A]"></span><span class="num font-mono font-medium" id="online">${S.online}</span><span class="text-muted">en línea ahora</span></span>
          <h1 class="text-balance text-[44px] leading-[0.98] min-[400px]:text-6xl font-semibold tracking-[-0.045em] sm:text-7xl lg:text-[76px] xl:text-[84px]">${esc(S.tagline[0])}<br/><span class="text-gold">${esc(S.tagline[1])}</span></h1>
          <p class="max-w-lg text-xl leading-relaxed text-muted">${esc(S.sub)}</p>
          <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">${copyBtn()}${link("tienda.html", "Ver la tienda")}</div>
        </div>
        <a class="group relative mx-auto w-full max-w-sm" href="ranking.html">
          <div aria-hidden="true" class="absolute inset-x-6 top-10 -z-10 h-full rounded-[32px] border border-white/10 bg-white/[0.03] [transform:perspective(900px)_rotateY(-14deg)_rotateX(6deg)_translateX(20px)]"></div>
          <div class="bento flex flex-col items-center gap-5 p-8 text-center shadow-[-24px_36px_60px_-20px_rgba(0,0,0,0.9),0_0_80px_rgba(255,170,0,0.18)] [transform:perspective(900px)_rotateY(-14deg)_rotateX(6deg)] transition-transform duration-300 group-hover:[transform:perspective(900px)_rotateY(-6deg)_rotateX(3deg)_translateY(-4px)]">
            <span class="rounded-full bg-gold px-3 py-1 text-xs font-bold tracking-wide text-[#0b0c0e]">N.º 1 EN PRACTICE</span>
            <img alt="" width="112" height="112" class="rounded-2xl bg-surface-tertiary shadow-[0_18px_30px_-12px_rgba(0,0,0,0.9)]" src="${head(S.practice[0].uuid, 224)}"/>
            <div><p class="text-3xl font-semibold tracking-[-0.03em]">${esc(S.practice[0].name)}</p><p class="num mt-1 font-mono text-lg text-data">${S.practice[0].elo.toLocaleString("es")} <span class="text-muted">ELO</span></p></div>
          </div></a>
      </section>
      <section aria-label="Aperturas" class="grid gap-4 md:grid-cols-2">${S.openings.map(countdown).join("")}</section>
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <section class="bento flex flex-col gap-4 p-8 lg:col-span-5"><h2 class="text-[28px] leading-tight font-semibold tracking-[-0.03em]">Practice</h2><ol>${S.practice.map((p, i) => row(i, p)).join("")}</ol><div class="mt-auto">${link("ranking.html", "Ranking completo")}</div></section>
        <section class="bento flex flex-col gap-5 p-8 lg:col-span-7"><h2 class="text-[28px] leading-tight font-semibold tracking-[-0.03em]">Kitmap</h2>
          <p class="text-[15px] leading-relaxed text-muted">Facciones de hasta 8 jugadores, seis clases y kits listos para pelear. Sin farmeo: entras y combates.</p>
          <div class="flex flex-col gap-2"><p class="text-sm font-medium text-muted">Mejores facciones</p><ol>${S.factions.map((p, i) => row(i, p)).join("")}</ol></div><div class="mt-auto">${link("ranking.html", "Ver facciones")}</div></section>
      </div></div>`,

    posts: () => title("Novedades", "Anuncios, parches y eventos de la red.") + `<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-10">${S.posts.map(p => `<a href="#" class="bento flex flex-col gap-3 p-6" style="--post-accent:${p.accent}"><span class="post-accent-rule"></span><span class="post-tag w-fit rounded-full px-3 py-0.5 text-xs font-bold">${esc(p.tag)}</span><h2 class="text-xl font-semibold tracking-[-0.02em]">${esc(p.title)}</h2><p class="text-sm leading-relaxed text-muted">${esc(p.text)}</p><time class="mt-auto text-xs text-muted">${new Date(p.date).toLocaleDateString("es", { dateStyle: "long" })}</time></a>`).join("")}</div>`,

    tienda: () => title("Tienda", "Apoya a la red y obtén ventajas cosméticas.") + `<div class="grid gap-4 md:grid-cols-3 pb-10">${S.store.map(p => `<section class="bento flex flex-col gap-4 p-8 ${p.hot ? "glow-gold" : ""}"><h2 class="text-2xl font-semibold tracking-[-0.03em]">${esc(p.name)} ${p.hot ? '<span class="ml-2 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-[#0b0c0e]">Popular</span>' : ""}</h2><p class="num font-mono text-3xl font-semibold text-gold">${esc(p.price)}</p><ul class="flex flex-col gap-2 text-sm text-muted">${p.perks.map(x => `<li>✓ ${esc(x)}</li>`).join("")}</ul><a href="#" class="mt-auto inline-flex h-11 items-center justify-center rounded-xl bg-gold px-5 text-sm font-semibold text-[#0b0c0e] hover:bg-gold-hover">Comprar</a></section>`).join("")}</div>`,

    ranking: () => title("Ranking", "Clasificación de Practice y Kitmap.") + `<div class="grid grid-cols-1 gap-5 lg:grid-cols-2 pb-10"><section class="bento flex flex-col gap-4 p-8"><h2 class="text-[28px] font-semibold tracking-[-0.03em]">Practice</h2><ol>${S.practice.map((p, i) => row(i, p)).join("")}</ol></section><section class="bento flex flex-col gap-4 p-8"><h2 class="text-[28px] font-semibold tracking-[-0.03em]">Facciones Kitmap</h2><ol>${S.factions.map((p, i) => row(i, p)).join("")}</ol></section></div>`,

    pase: () => title("Pase de batalla", "Sube de nivel jugando y desbloquea recompensas.") + `<div class="doc-table mb-10"><table><thead><tr><th>Nivel</th><th>Gratis</th><th>Premium</th></tr></thead><tbody>${S.pass.map(r => `<tr><td>${r.lvl}</td><td>${esc(r.free)}</td><td class="text-gold">${esc(r.premium)}</td></tr>`).join("")}</tbody></table></div>`,

    sanciones: () => title("Sanciones", "Historial público de bans y mutes.") + `<div class="doc-table mb-10"><table><thead><tr><th>Jugador</th><th>Tipo</th><th>Motivo</th><th>Staff</th><th>Fecha</th><th>Duración</th></tr></thead><tbody>${S.bans.map(b => `<tr><td>${esc(b.player)}</td><td>${esc(b.type)}</td><td>${esc(b.reason)}</td><td>${esc(b.staff)}</td><td>${esc(b.date)}</td><td>${esc(b.until)}</td></tr>`).join("")}</tbody></table></div>`,

    entrar: () => `<div class="mx-auto flex max-w-md flex-col gap-5 pt-16 pb-10"><div class="bento flex flex-col gap-5 p-8"><h1 class="text-3xl font-semibold tracking-[-0.03em]">Entrar</h1><p class="text-sm text-muted">Genera tu código dentro del juego con <span class="font-mono text-foreground">/web</span>.</p>
      <form id="login" class="flex flex-col gap-4"><label class="flex flex-col gap-1.5 text-sm font-bold">Nombre de Minecraft<input name="name" required maxlength="16" autocomplete="username" class="field text-base font-normal"/></label>
      <label class="flex flex-col gap-1.5 text-sm font-bold">Código de <span class="font-mono">/web</span><input name="code" required maxlength="9" placeholder="XXXX-XXXX" autocomplete="one-time-code" class="field font-mono text-base tracking-widest uppercase"/></label>
      <p id="err" role="alert" hidden class="rounded-xl bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger"></p>
      <button type="submit" class="h-[52px] rounded-[14px] bg-gold px-7 text-[15px] font-semibold text-[#0b0c0e] hover:bg-gold-hover">Entrar</button></form></div></div>`,

    cuenta: () => { const u = JSON.parse(sessionStorage.getItem("user") || "null"); return u ? title("Tu cuenta", "") + `<section class="bento flex items-center gap-5 p-8 mb-10"><img class="rounded-2xl" width="80" height="80" alt="" src="https://minotar.net/helm/${esc(u.name)}/160.png"/><div><p class="text-2xl font-semibold">${esc(u.name)}</p><button id="out" class="mt-2 text-sm text-gold">Cerrar sesión</button></div></section>` : `<p class="pt-16 text-muted">No has iniciado sesión. <a class="text-gold" href="entrar.html">Entrar</a></p>`; }
  };

  /* ---------- mount ---------- */
  document.body.insertAdjacentHTML("afterbegin", header);
  const main = document.createElement("main");
  main.className = "mx-auto w-full max-w-7xl grow px-4 pt-6 pb-28 sm:px-7 md:pb-10";
  main.innerHTML = (pages[page] || pages.home)();
  document.body.append(main);
  document.body.insertAdjacentHTML("beforeend", footer);
  document.title = (page === "home" ? "" : nav.find(n => n[0] === page)?.[2] + " · ") + S.name + " · Red competitiva de Minecraft";

  /* copiar IP */
  document.addEventListener("click", async e => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { const t = document.createElement("textarea"); t.value = b.dataset.copy; document.body.append(t); t.select(); document.execCommand("copy"); t.remove(); }
    const l = $("[data-copy-label]", b); l.textContent = "Copiada"; l.classList.add("bg-ok"); setTimeout(() => { l.textContent = "Copiar"; l.classList.remove("bg-ok"); }, 2000);
  });
  /* cuenta regresiva */
  const tick = () => document.querySelectorAll("[data-cd]").forEach(el => {
    let d = new Date(el.dataset.cd) - Date.now();
    const done = !(d > 0); if (done) d = 0;
    const s = Math.floor(d / 1000), v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
    el.querySelectorAll(".num").forEach((n, i) => n.textContent = String(v[i]).padStart(2, "0"));
    const badge = el.parentElement.querySelector("[data-open]"); if (badge) badge.classList.toggle("hidden", !done);
  });
  if (document.querySelector("[data-cd]")) { tick(); setInterval(tick, 1000); }
  /* login demo (conecta aquí tu backend) */
  const f = $("#login");
  if (f) f.addEventListener("submit", e => {
    e.preventDefault();
    const name = f.name.value.trim(), code = f.code.value.trim().toUpperCase(), err = $("#err");
    if (!/^[A-Za-z0-9_]{1,16}$/.test(name) || !/^[A-Z0-9]{4}-?[A-Z0-9]{4}$/.test(code)) { err.textContent = "Nombre o código inválido."; err.hidden = false; return; }
    // TODO: fetch("/api/login",{method:"POST",body:JSON.stringify({name,code})})
    sessionStorage.setItem("user", JSON.stringify({ name })); location.href = "cuenta.html";
  });
  const out = $("#out"); if (out) out.onclick = () => { sessionStorage.removeItem("user"); location.href = "index.html"; };
})();
