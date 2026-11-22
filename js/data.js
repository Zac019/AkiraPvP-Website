// Contenido estático del sitio. Lo dinámico (online, stats, sanciones, novedades) viene de la API.
window.SITE = {
  name: "AkiraPvP", domain: "akirapvp.lat", ip: "akirapvp.lat",
  discord: "https://discord.gg/tu-invite",
  storeUrl: "https://store.akirapvp.lat/", // el servidor puede sobrescribirlo con STORE_URL
  tagline: ["PvP competitivo.", "En español."], sub: "Practice, Kitmap y HCF.",

  name: "AkiraPvP", domain: "akirapvp.lat", ip: "akirapvp.lat", discord: "https://discord.gg/pq58cYQA",
  tagline: ["PvP competitivo.", "En español."], sub: "Practice, Kitmap y HCF.",
  online: 500,

  openings: [
    { label: "Practice", at: "2026-12-05T00:00:00-04:00", text: "sábado, 5 de diciembre, 00:00" },
    { label: "Kitmap y Meetup", at: "2026-12-06T00:00:00-04:00", text: "domingo, 6 de diciembre, 00:00" }
  ],
  // Staff por rango: usa el nick real de Minecraft (la skin se carga sola)
  staff: [
    {rank:"Owner",color:"#ff2d2d",members:[{name:"19K2",role:"Owner"},{name:"Barboza_Vlogs",role:"Owner"}]},
    {rank:"Co-Owner",color:"#bb4444",members:[{name:"CallMeLucky_",role:"Co-Owner"}]},
    {rank:"Manager",color:"#800000",members:[{name:"SoyUnRex0",role:"Manager"},{name:"Tusead0h",role:"SS-Manager"}]},
    {rank:"Coordinator",color:"#ff5555",members:[{name:"none",role:"Coordinator"}]},
    {rank:"Developer",color:"#26a69a",members:[{name:"Noxvian",role:"Developer"},{name:"Greze",role:"Developer"},{name:"Noriiih",role:"Developer"},{name:"zdping",role:"Developer"}]},
    {rank:"Platform-Admin",color:"#ff5555",members:[{name:"zKolah",role:"Platform-Admin"}]},
    {rank:"SrAdmin",color:"#800000",members:[{name:"none",role:"SrAdmin"}]},
    {rank:"Admin",color:"#ff5555",members:[{name:"ItzProfia",role:"Admin"}]},
    {rank:"SrMod",color:"#00aa00",members:[{name:"none",role:"SrMod"}]},
    {rank:"Mod+",color:"#206694",members:[{name:"7Maxxi_",role:"SS-Coordinator"}]},
    {rank:"Mod",color:"#206694",members:[{name:"Oriyn",role:"Mod"}]},
    {rank:"Trial-Mod",color:"#f1c40f",members:[{name:"MiguelRD0880",role:"Trial-Mod"}]}
  ],
  bans: [
    {player:"CallMeLucky_",type:"Ban",reason:"Hacks (KillAura)",staff:"19K2",date:"2026-11-19",until:"Permanente"},
    {player:"Toxico2",type:"Mute",reason:"Insultos",staff:"Staff2",date:"2026-11-18",until:"7 días"},
    {player:"Bug3",type:"Ban",reason:"Abuso de bugs",staff:"Staff1",date:"2026-11-16",until:"30 días"}
  ]
};
