// Edita aquí los datos del sitio (luego puedes conectarlo a una API/DB)
window.SITE = {
  name: "AkiraPvP", domain: "akirapvp.lat", ip: "play.akirapvp.lat", discord: "https://discord.gg/tu-invite",
  tagline: ["PvP competitivo.", "En español."], sub: "Practice, Kitmap y Meetup.",
  online: 5,
  openings: [
    { label: "Practice", at: "2026-12-05T00:00:00-04:00", text: "sábado, 5 de diciembre, 00:00" },
    { label: "Kitmap y Meetup", at: "2026-12-06T00:00:00-04:00", text: "domingo, 6 de diciembre, 00:00" }
  ],
  practice: [
    {name:"19K2",uuid:"8a38dcf7-e83f-4565-9d24-9338989a827d",elo:1170},
    {name:"Barboza_Vlogs",uuid:"d3f1e2c4-5b6a-4c7e-9f8a-1b2c3d4e5f6g",elo:1120},
    {name:"CallMeLucky_",uuid:"1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",elo:1050},
  ],
  factions: [{name:"Alpha",pts:2551},{name:"Bravo",pts:838},{name:"Charlie",pts:274}],
  posts: [
    {slug:"apertura",title:"Gran apertura de la temporada",date:"2026-11-18",tag:"Anuncio",accent:"#fa0",text:"Abrimos Practice, Kitmap y Meetup con nuevos kits y mapas."},
    {slug:"parche-1",title:"Parche 1.1: balance de kits",date:"2026-11-10",tag:"Parche",accent:"#55e6e6",text:"Ajustes de daño, cooldowns de perlas y correcciones."},
    {slug:"torneo",title:"Torneo 1v1 con premios",date:"2026-11-02",tag:"Evento",accent:"#55e07a",text:"Inscríbete en Discord. Premios en rangos y cosméticos."}
  ],
  // Staff: agrupado por rango. Usa el nick real de Minecraft (se carga la skin sola).
  staff: [
    {rank:"Owner",color:"#ff2d2d",members:[{name:"19K2",role:"Owner"},{name:"Barboza_Vlogs",role:"Owner"}]},
    {rank:"Co-Owner",color:"#bb4444",members:[{name:"CallMeLucky_",role:"Co-Owner"}]},
    {rank:"Admin",color:"#ff7a2d",members:[{name:"Admin1",role:"Administrador"},{name:"Admin2",role:"Administrador"}]},
    {rank:"Developer",color:"#55e07a",members:[{name:"Dev1",role:"Desarrollador"}]},
    {rank:"Moderador",color:"#4d9bff",members:[{name:"Mod1",role:"Moderador"},{name:"Mod2",role:"Moderador"},{name:"Mod3",role:"Moderador"}]},
    {rank:"Helper",color:"#c77dff",members:[{name:"Helper1",role:"Ayudante"},{name:"Helper2",role:"Ayudante"}]}
  ],
  bans: [
    {player:"Cheater1",type:"Ban",reason:"Hacks (KillAura)",staff:"Staff1",date:"2026-11-19",until:"Permanente"},
    {player:"Toxico2",type:"Mute",reason:"Insultos",staff:"Staff2",date:"2026-11-18",until:"7 días"},
    {player:"Bug3",type:"Ban",reason:"Abuso de bugs",staff:"Staff1",date:"2026-11-16",until:"30 días"}
  ]
};
