// Edita aquí los datos del sitio (luego puedes conectarlo a una API/DB)
window.SITE = {
  name: "AkiraPvP", domain: "akirapvp.lat", ip: "akirapvp.lat", discord: "https://discord.gg/tu-invite",
  tagline: ["PvP competitivo.", "En español."], sub: "Practice, Kitmap y HCF.",
  online: 500,
  openings: [
    { label: "Practice", at: "2026-11-20T00:00:00-04:00", text: "Viernes, 20 de noviembre, 00:00" },
    { label: "Kitmap", at: "2026-12-06T00:00:00-04:00", text: "domingo, 6 de diciembre, 00:00" },
    { label: "HCF", at: "2027-1-06T00:00:00-04:00", text: "domingo, 6 de diciembre, 00:00" }
  ],
  practice: [
    {name:"19K2",uuid:"8a38dcf7-e83f-4565-9d24-9338989a827d",elo:10000},
    {name:"Barboza_Vlogs",uuid:"9f2b3a15-212e-4dca-b00f-ed5b0c01557d",elo:0},
    {name:"CallMeLucky_",uuid:"c919c3ae-b545-47b9-86b5-9c7c0c9243f5",elo:0},
  ],
  factions: [{name:"Alpha",pts:300},{name:"Bravo",pts:200},{name:"Charlie",pts:100}],
  posts: [
    {slug:"apertura",title:"Gran apertura de la temporada",date:"2026-11-18",tag:"Anuncio",accent:"rgb(255, 0, 0)",text:"Abrimos Practice, Kitmap y HCF con nuevos kits y mapas."},
    {slug:"parche-1",title:"Parche 1.1: balance de kits",date:"2026-11-10",tag:"Parche",accent:"#0084ff",text:"Ajustes de daño, cooldowns de perlas y correcciones."},
  ],
  // Staff: agrupado por rango. Usa el nick real de Minecraft (se carga la skin sola).
  staff: [
    {rank:"Owner",color:"#ff2d2d",members:[{name:"19K2",role:"Owner"},{name:"Barboza_Vlogs",role:"Owner"}]},
    {rank:"Co-Owner",color:"#bb4444",members:[{name:"CallMeLucky_",role:"Co-Owner"}]},
    {rank:"Manager",color:"#800000",members:[{name:"SoyUnRex0",role:"Manager"}]},
    {rank:"Admin",color:"#ff5555",members:[{name:"ItzProfia",role:"Admin"}]},
    {rank:"Developer",color:"#26a69a",members:[{name:"Dev1",role:"Desarrollador"}]},
    {rank:"Mod",color:"#206694",members:[{name:"Mod1",role:"Moderador"},{name:"Mod2",role:"Moderador"},{name:"Mod3",role:"Moderador"}]},
    {rank:"Trial-Mod",color:"#f1c40f",members:[{name:"Helper1",role:"Trial-Mod"},{name:"Helper2",role:"Trial-Mod"}]}
  ],
  bans: [
    {player:"CallMeLucky_",type:"Ban",reason:"Hacks (KillAura)",staff:"19K2",date:"2026-11-19",until:"Permanente"},
    {player:"Toxico2",type:"Mute",reason:"Insultos",staff:"Staff2",date:"2026-11-18",until:"7 días"},
    {player:"Bug3",type:"Ban",reason:"Abuso de bugs",staff:"Staff1",date:"2026-11-16",until:"30 días"}
  ]
};
