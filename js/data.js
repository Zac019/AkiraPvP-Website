// Edita aquí los datos del sitio (luego puedes conectarlo a una API/DB)
window.SITE = {
  name: "AkiraPvP", domain: "akirapvp.lat", ip: "akirapvp.lat", discord: "https://discord.gg/tu-invite",
  tagline: ["PvP competitivo.", "En español."], sub: "Practice, Kitmap y HCF.",
  online: 100,
  openings: [
    { label: "Practice", at: "2026-12-05T00:00:00-04:00", text: "sábado, 5 de diciembre, 00:00" },
    { label: "Kitmap y HCF", at: "2026-12-06T00:00:00-04:00", text: "domingo, 6 de diciembre, 00:00" }
  ],
  practice: [
    {name:"Jugador1",uuid:"ecc38f74-8562-4598-bbac-677fb26c5389",elo:1170},
    {name:"Jugador2",uuid:"52a43a0c-3f93-4dd7-8408-efb0bbdb690c",elo:1124},
    {name:"Jugador3",uuid:"c69b4291-4fd3-4bf1-bdaa-98aa797ae2cb",elo:1108},
    {name:"Jugador4",uuid:"adb0b6be-9c0f-489c-a263-37bf353e3424",elo:1082},
    {name:"Jugador5",uuid:"c36b1002-d0ab-45e0-a064-bcc4c6765e49",elo:1076}
  ],
  factions: [{name:"Alpha",pts:2551},{name:"Bravo",pts:838},{name:"Charlie",pts:274}],
  posts: [
    {slug:"parche-1",title:"Parche 1.1: balance de kits",date:"2026-11-10",tag:"Parche",accent:"#e65555",text:"Ajustes de daño, cooldowns de perlas y correcciones."},
    {slug:"apertura",title:"Gran apertura de la temporada",date:"2026-11-18",tag:"Anuncio",accent:"#fa0",text:"Abrimos Practice, Kitmap y HCF con nuevos kits y mapas."},
    {slug:"evento",title:"Evento de apertura: Practice",date:"2026-11-19",tag:"Evento",accent:"#0af",text:"Durante la primera semana, tendremos eventos especiales."}
  
  ],
  store: [
    {name:"VIP",price:"4,99 US$",perks:["Prefijo VIP","Kit diario","Cola prioritaria"]},
    {name:"MVP",price:"9,99 US$",perks:["Todo VIP","Partículas","Cosméticos exclusivos"],hot:true},
    {name:"Élite",price:"19,99 US$",perks:["Todo MVP","Capa personalizada","Acceso anticipado"]}
  ],
  pass: Array.from({length:10},(_,i)=>({lvl:i+1,free:["Kit cosmético","100 monedas","Tag","—","Partícula"][i%5],premium:["Capa","300 monedas","Skin de espada","Efecto de muerte","Título"][i%5]})),
  bans: [
    {player:"KP_ZK",type:"Ban",reason:"Hacks (KillAura)",staff:"19K2",date:"2026-11-19",until:"Permanente"},
    {player:"D34M",type:"Ban",reason:"Insultos",staff:"SoyUnRex0",date:"2026-11-18",until:"7 días"},
    {player:"HCFAlerts",type:"Ban",reason:"Negro",staff:"Tuseado",date:"2026-11-16",until:"30 días"}
  ]
};
