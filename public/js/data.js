// Contenido estático del sitio. Lo dinámico (online, stats, sanciones, novedades) viene de la API.
window.SITE = {
  name: "AkiraPvP", domain: "akirapvp.lat", ip: "play.akirapvp.lat",
  discord: "https://discord.gg/tu-invite",
  storeUrl: "https://tienda.akirapvp.lat", // el servidor puede sobrescribirlo con STORE_URL
  tagline: ["PvP competitivo.", "En español."], sub: "Practice, Kitmap y Meetup.",
  openings: [
    { label: "Practice", at: "2026-12-05T00:00:00-04:00", text: "sábado, 5 de diciembre, 00:00" },
    { label: "Kitmap y Meetup", at: "2026-12-06T00:00:00-04:00", text: "domingo, 6 de diciembre, 00:00" }
  ],
  // Staff por rango: usa el nick real de Minecraft (la skin se carga sola)
  staff: [
    {rank:"Owner",color:"#ff2d2d",members:[{name:"Owner1",role:"Fundador"},{name:"Owner2",role:"Co-Fundador"}]},
    {rank:"Admin",color:"#ff7a2d",members:[{name:"Admin1",role:"Administrador"},{name:"Admin2",role:"Administrador"}]},
    {rank:"Developer",color:"#55e07a",members:[{name:"Dev1",role:"Desarrollador"}]},
    {rank:"Moderador",color:"#4d9bff",members:[{name:"Mod1",role:"Moderador"},{name:"Mod2",role:"Moderador"},{name:"Mod3",role:"Moderador"}]},
    {rank:"Helper",color:"#c77dff",members:[{name:"Helper1",role:"Ayudante"},{name:"Helper2",role:"Ayudante"}]}
  ]
};
