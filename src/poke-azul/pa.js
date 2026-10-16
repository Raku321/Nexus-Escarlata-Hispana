// Poke Azul para Nexus — Modo simple, Calculadora de IV y Gimnasios (con conquistas de las 10:00 (Brasil) y simulador).
// Todo es SOLO LECTURA: lee lo que el colector de Nexus ya guarda en cada panel (window.__poke) y pide
// por GET las mismas listas que usa la página del juego. Nunca envía nada al juego.
// Usa el motor de src/poke-azul/pa-lib.js (window.PA_LIB).
(function () {
  'use strict';
  const LIB = window.PA_LIB;
  if (!LIB) { console.warn('[Poke Azul] falta pa-lib.js'); return; }
  const { ivcalc, battle, gyms: GY, conquest: CQ } = LIB;

  // ---------------- utilidades ----------------
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const fmt = (n) => { n = Number(n) || 0; const a = Math.abs(n); return a >= 1e9 ? (n / 1e9).toFixed(2).replace('.', ',') + 'B' : a >= 1e6 ? (n / 1e6).toFixed(2).replace('.', ',') + 'M' : a >= 1e4 ? (n / 1e3).toFixed(1).replace('.', ',') + 'k' : Math.round(n).toLocaleString('es-ES'); };
  const f2 = (x) => Number(x || 0).toFixed(2).replace('.', ',');
  const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  // variables globales de Nexus (declaradas en su <script> principal): se leen directamente, sin eval (lo prohíbe la CSP)
  /* global webviews, off, count, tabNames, dexId, cardsOn, applyCards, toggleExpand */
  const WV = () => (typeof webviews !== 'undefined' ? webviews : []);
  const OFF = () => (typeof off !== 'undefined' ? off : []);
  const COUNT = () => (typeof count !== 'undefined' ? count : 4);
  const NAMES = {};   // nombre de usuario de cada cuenta (lo que manda el juego en /api/characters/me)
  const accName = (i) => { const t = typeof tabNames !== 'undefined' ? tabNames : null; return NAMES[i] || (t && t[i]) || 'Cuenta ' + (i + 1); };
  const JS_NAME = `(()=>{const m=window.__poke&&window.__poke.api&&window.__poke.api['/api/characters/me'];return (m&&m.character&&m.character.name)||''})()`;
  async function loadNames() { await Promise.all([...Array(COUNT())].map(async (_, i) => { const n = await run(i, JS_NAME); if (n) NAMES[i] = String(n); })); }
  // la primera cuenta que ya tiene su lista de pokémon (para no abrir en una vacía)
  async function pickAcc(cur, cache) {
    const L0 = await run(cur, JS_ROSTER); if (L0 && L0.length) { cache[cur] = L0; return cur; }
    for (let i = 0; i < COUNT(); i++) { if (i === cur) continue; const L = await run(i, JS_ROSTER); if (L && L.length) { cache[i] = L; return i; } }
    return cur;
  }
  const cap = (s) => String(s || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  // ejecuta una lectura dentro del panel i (con tiempo máximo: un panel colgado no bloquea nada)
  const run = (i, js, ms = 6000) => {
    const w = WV()[i]; if (!w || OFF()[i]) return Promise.resolve(null);
    try { return Promise.race([w.executeJavaScript(js).catch(() => null), new Promise((r) => setTimeout(() => r(null), ms))]); } catch { return Promise.resolve(null); }
  };
  const firstOn = () => { for (let i = 0; i < COUNT(); i++) if (WV()[i] && !OFF()[i]) return i; return -1; };
  const RARS = [[4, 'Divina'], [3, 'Anciana'], [2, 'Mítica'], [1.7, 'Legendaria'], [1.5, 'Épica'], [1.3, 'Rara'], [1.1, 'Poco común'], [1, 'Común']];
  const rarOf = (q) => { for (const [t, n] of RARS) if (q + 1e-9 >= t) return n; return 'Débil'; };
  const COL = { hp: '#22c55e', atk: '#f97316', def: '#facc15', spa: '#3b82f6', spd: '#2dd4bf', spe: '#f472b6' };
  const LAB = { hp: 'HP', atk: 'ATK', def: 'DEF', spa: 'SPA', spd: 'SPD', spe: 'VEL' };
  const EXP = { hp: 0.95, atk: 0.8, def: 0.8, spa: 0.8, spd: 0.8, spe: 0.95 };
  const tyTag = (t) => `<span class="pa-ty pa-ty-${esc(String(t).toUpperCase())}">${esc(String(t).toUpperCase())}</span>`;
  // XP total para llegar a un nivel (la fórmula del juego que ya usa Nexus)
  const xpC = (n) => (n <= 1 ? 0 : Math.round((50 / 3) * (n ** 3 - 6 * n ** 2 + 17 * n - 12)));
  const xpNv = (n) => { n = Math.floor(n); if (n <= 150) return xpC(n); const t = n - 150; if (t <= 100) return Math.round(xpC(150) + 0.5 * ((t * (t + 1)) / 2) ** 2 + ((t * (t + 1) * (2 * t + 1)) / 6) * 197.5 + ((t * (t + 1)) / 2) * 25629 + 1087900 * t); return Math.round(xpNv(250) + 2 * (xpC(n) - xpC(250))); };
  const fmtEta = (s) => { if (!(s > 0) || !isFinite(s)) return '—'; const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60); return h >= 48 ? Math.round(h / 24) + ' días' : h ? `${h} h ${m} min` : `${Math.max(1, m)} min`; };

  // ---------------- especies (creatures.json leído dentro de un panel) ----------------
  const SP = { byId: new Map(), byName: new Map(), list: [], loading: null };
  const JS_SPECIES = `(async()=>{try{const r=await fetch('/game/creatures.json');const j=await r.json();const L=(j&&j.creatures)||[];return L.filter(c=>c&&c.pokeId!=null).map(c=>({id:+c.pokeId,n:String(c.name||''),t:[c.type1,c.type2].filter(Boolean).map(x=>String(x).toLowerCase()),b:[+c.baseHp||0,+c.baseAtk||0,+c.baseDef||0,+c.baseSpAtk||0,+c.baseSpDef||0,+c.baseSpeed||0],a:(c.attacks||[]).filter(a=>a&&+a.power>0).map(a=>[String(a.name||''),+a.power||0,String(a.type||'').toLowerCase(),+a.learnLevel||0,a.tm?1:0,String(a.category||'').slice(0,10)])}))}catch(e){return null}})()`;
  async function loadSpecies() {
    if (SP.list.length) return SP;
    if (SP.loading) return SP.loading;
    SP.loading = (async () => {
      for (let i = 0; i < COUNT() && !SP.list.length; i++) {
        const L = await run(i, JS_SPECIES, 30000);
        if (Array.isArray(L) && L.length) {
          for (const c of L) {
            const s = { id: c.id, name: c.n, types: c.t, base: { hp: c.b[0], atk: c.b[1], def: c.b[2], spa: c.b[3], spd: c.b[4], spe: c.b[5] }, attacks: c.a.map((a) => ({ n: a[0], p: a[1], t: a[2], l: a[3], tm: !!a[4], c: a[5] })) };
            SP.byId.set(s.id, s);
            const k = s.name.toLowerCase();
            if (!SP.byName.has(k) || s.id < SP.byName.get(k).id) SP.byName.set(k, s);
          }
          SP.list = [...SP.byName.values()].filter((s) => s.base.hp > 0).sort((a, b) => a.name.localeCompare(b.name));
        }
      }
      SP.loading = null;
      return SP;
    })();
    return SP.loading;
  }
  const spOf = (idOrName) => (typeof idOrName === 'number' || /^\d+$/.test(String(idOrName)) ? SP.byId.get(+idOrName) : SP.byName.get(String(idOrName || '').toLowerCase()));
  const sprUrl = (idOrName, shiny) => {
    const s = spOf(idOrName); let id = s ? s.id : +idOrName || 0;
    if (typeof dexId === 'function') id = dexId(id);
    return id ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + (shiny ? 'shiny/' : '') + id + '.png' : '';
  };
  const spr = (idOrName, shiny, cls = 'pa-spr') => { const u = sprUrl(idOrName, shiny); return u ? `<img class="${cls}" src="${u}" onerror="this.style.visibility='hidden'">` : `<span class="${cls} pa-nospr">?</span>`; };
  function movesOf(sp, level, tms) {
    const s = spOf(sp); if (!s) return [];
    const owned = (tms || []).map((x) => String(typeof x === 'object' && x ? (x.name || x.type || '') : x).toLowerCase());
    return s.attacks.filter((a) => (a.tm ? owned.some((o) => o === a.t || o === a.n.toLowerCase()) : !a.l || !level || a.l <= level));
  }

  // ---------------- lecturas de cada panel (solo lectura) ----------------
  const JS_READ = `(()=>{const P=window.__poke;if(!P||!P.ws)return null;const L=(P.ws.pokes&&P.ws.pokes.list)||[];const ld=L.find(p=>p&&p.leader)||L.filter(p=>p&&p.team).sort((a,b)=>(a.slot||0)-(b.slot||0))[0]||null;const a=P.ws.analyzer||{};const me=P.api&&P.api['/api/characters/me'];const ch=(me&&me.character)||{};const fi=P.ws['field-init'];const S=P.sess||{};return{ok:true,on:!!(P.sock&&P.sock.readyState===1),name:ch.name||'',tl:+ch.level||0,hunt:(fi&&fi.slug)||'',a:{xph:+a.xpPerHour||0,gph:+a.goldPerHour||0,kph:+a.killsPerHour||0},s:{caps:+S.captures||0,sh:+S.shinyCapN||0,seen:+S.shinyN||0,best:(P.catchLog||[]).filter(c=>(c.t||0)>=(S.start||0)).reduce((m,c)=>Math.max(m,+c.iv||0),0)},tr:(()=>{const k=P.ws['field-kill'];return{lv:(k&&+k.level)||+ch.level||0,tot:(k&&+k.totalXp)||0}})(),gold:+ch.gold||0,faint:!!P.fnt,ld:ld?{tms:Array.isArray(ld.tms)?ld.tms:[],id:String(ld.id),name:ld.name,sp:+ld.speciesId||0,lv:+ld.level||0,xp:+ld.xp||0,sh:!!ld.shiny,t:[ld.type1,ld.type2].filter(Boolean),st:ld.stats||null,q:+ld.quality||0,ivt:ld.ivTotal,hp:+ld.hp||0,mhp:+ld.maxHp||0}:null,rec:(P.catchLog||[]).slice(-8).map(c=>({n:c.n,iv:c.iv,q:c.q,sh:!!c.sh,t:c.t}))}})()`;
  // lista de pokémon; si el que está leveando ya subió de nivel (último poke-xp) y la lista aún no, sus stats se escalan al nivel nuevo
  // (stat = nivel/100 × calidad × (base + 2·IV): crecen en proporción al nivel)
  const JS_ROSTER = `(()=>{const P=window.__poke;if(!P||!P.ws||!P.ws.pokes)return [];const X=P.ws['poke-xp'];return (P.ws.pokes.list||[]).filter(p=>p&&p.stats&&p.level).map(p=>{let lv=+p.level||0,st=p.stats,mhp=+p.maxHp||0,pw=+p.power||0;if(X&&X.id!=null&&String(X.id)===String(p.id)&&+X.level>lv){const f=+X.level/lv;st={};for(const k in p.stats)st[k]=typeof p.stats[k]==='number'?Math.round(p.stats[k]*f):p.stats[k];mhp=Math.round(mhp*f);pw=Math.round(pw*f);lv=+X.level;}return{id:String(p.id),name:p.name,sp:+p.speciesId||0,lv,sh:!!p.shiny,t:[p.type1,p.type2].filter(Boolean),st,q:+p.quality||0,ivt:p.ivTotal,pw,team:!!p.team,ld:!!p.leader,tms:Array.isArray(p.tms)?p.tms:[],mhp}})})()`;
  const JS_GYMS = `(async()=>{try{const P=window.__poke||{};const o=P.auth?{headers:{Authorization:P.auth}}:{};const r=await fetch('/api/game/gyms',o);if(!r.ok)return{err:r.status};return await r.json()}catch(e){return{err:String(e&&e.message||e)}}})()`;

  // IV de cada stat de un pokémon tuyo (con margen cuando el nivel es bajo; exactos desde el 30)
  function perStatIv(sp, L, q, st) {
    const s = spOf(sp); const per = {}; let wide = false;
    if (!s || !(L > 0) || !(q > 0) || !st) return { per, wide: true };
    const W = { hp: 'hp', atk: 'atk', def: 'def', spa: 'spAtk', spd: 'spDef', spe: 'speed' };
    for (const k of Object.keys(LAB)) {
      const v = Number(st[W[k]] ?? st[k]), b = Number(s.base[k]);
      if (!(v > 0 && b > 0)) continue;
      const f = (L / 100) * Math.pow(q, EXP[k]), iv = (v / f - b) / 2, d = 0.5 / f / 2;
      const lo = Math.max(0, Math.min(32, iv - d)), hi = Math.max(0, Math.min(32, iv + d));
      const vv = Math.max(0, Math.min(32, Math.round(iv))), a = Math.ceil(lo - 1e-9), z = Math.floor(hi + 1e-9);
      per[k] = hi - lo < 1 || a >= z ? { v: vv } : { lo: a, hi: z, v: Math.max(a, Math.min(z, vv)) };
      if (per[k].lo != null) wide = true;
    }
    return { per, wide };
  }

  // ================= MODO SIMPLE (sustituye al de Nexus) =================
  const XPS = {}; // muestras de XP real por cuenta y Pokémon
  function leaderEta(i, ld, xphAna) {
    const now = Date.now(), k = i + ':' + ld.id;
    const xp = Number(ld.xp), lv = Number(ld.lv), a = xpNv(lv), b = xpNv(lv + 1);
    if (!Number.isFinite(xp) || !(b > a)) return null;
    const pct = Math.max(0, Math.min(100, ((xp - a) / (b - a)) * 100));
    const st = XPS[k] || (XPS[k] = { lv, points: [] });
    if (st.lv !== lv || (st.points.length && xp < st.points[st.points.length - 1].xp)) {
      st.lv = lv; st.points = [];
    }
    st.points = st.points.filter(p => now - p.t < 20 * 60000);
    if (!st.points.length || st.points[st.points.length - 1].xp !== xp) st.points.push({ t: now, xp });
    let rate = 0, approximate = false;
    if (st.points.length >= 2) {
      const first = st.points[0], last = st.points[st.points.length - 1];
      if (last.t - first.t >= 5000 && last.xp > first.xp)
        rate = (last.xp - first.xp) * 3600000 / (last.t - first.t);
    }
    // La XP/h del analizador no es la XP/h del Pokémon: indicar ≈ al usarla como referencia.
    if (!(rate > 0) && Number(xphAna) > 0) { rate = Number(xphAna); approximate = true; }
    return { pct, eta: rate > 0 ? Math.max(0, (b - xp) * 3600 / rate) : null, approximate };
  }
  function leaderEtaText(e) {
    if (!e || e.eta == null) return 'esperando datos de XP…';
    return (e.approximate ? '≈ ' : '') + fmtEta(e.eta);
  }
  function ivBox(ld) {
    if (!ld || !ld.st) return '';
    const { per, wide } = perStatIv(ld.sp, ld.lv, ld.q, ld.st);
    const exact = ld.lv >= 30 && !wide;
    const tot = ld.ivt != null ? Number(ld.ivt) : null;
    const state = exact ? '<span class="pa-ok">✓ exactos</span>' : ld.lv < 30 ? `<span class="pa-est">≈ exactos al Nv 30 (faltan ${30 - ld.lv})</span>` : '<span class="pa-est">≈ aproximados</span>';
    const cells = Object.keys(LAB).map((k) => {
      const x = per[k], rng = x && x.lo != null && x.lo !== x.hi;
      const tip = !x ? '' : rng ? `${LAB[k]}: entre ${x.lo} y ${x.hi} de 32 (se afina al subir; exacto al Nv 30)` : `${LAB[k]}: ${x.v} de 32`;
      return `<div class="pa-ivs" title="${esc(tip)}"><small style="color:${COL[k]}">${LAB[k]}</small><b>${!x ? '—' : (rng ? '≈' : '') + x.v}<span>/32</span></b>${rng ? `<em>${x.lo}–${x.hi}</em>` : ''}<i><u style="width:${x ? (x.v / 32) * 100 : 0}%;background:${COL[k]}"></u></i></div>`;
    }).join('');
    return `<div class="pa-divb"><div class="pa-divh"><span>🧬 IV de ${esc(ld.name)}</span>${tot != null ? `<b class="pa-ivt">${tot}<span>/192</span></b><span class="pa-mut">(${String(Math.round((tot / 192) * 1000) / 10).replace('.', ',')}%)</span>` : ''}${ld.q ? `<span class="pa-rar pa-rar-${esc(rarOf(ld.q))}">${esc(rarOf(ld.q))} ×${f2(ld.q)}</span>` : ''}${state}</div><div class="pa-ivrow">${cells}</div></div>`;
  }
  let lowBusy = false;
  async function refreshLow() {
    const el = document.getElementById('cards');
    if (!el || typeof cardsOn === 'undefined' || !cardsOn || lowBusy) return;
    lowBusy = true;
    try {
      await loadSpecies();
      const n = COUNT(), D = await Promise.all([...Array(n)].map((_, i) => run(i, JS_READ)));
      const on = D.map((d) => !!(d && d.on));
      D.forEach((d, i) => { if (d && d.name) NAMES[i] = d.name; });
      const sum = (f) => D.reduce((a, d, i) => a + (on[i] ? Number(f(d)) || 0 : 0), 0);
      let h = `<div class="pa-low"><div class="pa-tot">
        <div><small>Cuentas conectadas</small><b>${on.filter(Boolean).length}<span>/${n}</span></b></div>
        <div><small>XP/h total</small><b class="pa-xp">${fmt(sum((d) => d.a.xph))}</b></div>
        <div><small>Oro/h total</small><b class="pa-gold">$${fmt(sum((d) => d.a.gph))}</b></div>
        <div><small>Derrotas/h</small><b>${fmt(sum((d) => d.a.kph))}</b></div>
        <div><small>Capturas (sesión)</small><b>${fmt(sum((d) => d.s.caps))}</b></div>
        <div><small>Shinies (sesión)</small><b class="pa-gold">✨ ${fmt(sum((d) => d.s.sh))}</b></div></div><div class="pa-cards">`;
      for (let i = 0; i < n; i++) {
        const d = D[i], ld = d && d.ld, warn = !on[i] || (d && (d.faint || !d.hunt));
        const status = OFF()[i] ? 'Apagada' : !d ? 'Cargando…' : !on[i] ? '⚠️ Sin conexión con el juego' : d.faint ? '💀 Equipo debilitado' : '📍 ' + (d.hunt ? d.hunt.replace(/[_-]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()) : 'En la ciudad');
        const e = ld ? leaderEta(i, ld, d && d.a && d.a.xph) : null;
        const hpPct = ld && ld.mhp ? Math.max(0, Math.min(100, (ld.hp / ld.mhp) * 100)) : null;
        h += `<div class="pa-card${warn ? ' warn' : ''}" data-i="${i}">
          <div class="pa-left"><div class="pa-av">${ld ? spr(ld.sp, ld.sh, 'pa-sprl') : '<span class="pa-nospr">?</span>'}</div>
            <div class="pa-who"><div class="pa-dn"><span class="pa-dot${on[i] ? ' on' : ''}"></span>${esc((d && d.name) || accName(i))}</div>
            <div class="pa-dl">${ld ? `${ld.sh ? '✨ ' : ''}${esc(ld.name)} · Nv. ${ld.lv}` : 'Sin pokémon líder'}</div>
            <div class="pa-ds${warn ? ' bad' : ''}">${esc(status)}</div>
            ${hpPct != null ? `<div class="pa-hp"><i style="width:${hpPct}%" class="${hpPct < 25 ? 'low' : ''}"></i></div>` : ''}</div></div>
          <div class="pa-mid">
            ${e ? `<div class="pa-lvl"><div class="pa-bar"><i style="width:${e.pct}%"></i></div><div class="pa-lvt"><span>Nv. ${ld.lv} → ${ld.lv + 1} · faltan <b>${String((100 - e.pct).toFixed(1)).replace('.', ',')}%</b></span><span>${'⏱ ' + leaderEtaText(e)}</span></div></div>` : ''}
            ${ivBox(ld)}
            <div class="pa-nums">
              <div><small>XP/h</small><b class="pa-xp">${on[i] && d.a.xph ? fmt(d.a.xph) : '—'}</b></div>
              <div><small>Oro/h</small><b class="pa-gold">${on[i] && d.a.gph ? '$' + fmt(d.a.gph) : '—'}</b></div>
              <div><small>Derrotas/h</small><b>${on[i] && d.a.kph ? fmt(d.a.kph) : '—'}</b></div>
              <div><small>Capturas</small><b>${d ? d.s.caps : 0}</b></div>
              <div><small>Shinies</small><b class="pa-gold">${d ? d.s.sh : 0}</b></div>
              <div><small>Nv. entrenador</small><b>${d && d.tl ? d.tl : '—'}</b></div>
            </div></div>
          <div class="pa-right"><small>Últimas capturas</small><div class="pa-rec">${d && d.rec && d.rec.length ? d.rec.slice().reverse().map((c) => `<span class="pa-rc${c.sh ? ' sh' : ''}" title="${esc(c.n)} · IV ${c.iv == null ? '—' : c.iv} · ×${f2(c.q)}">${spr(c.n, c.sh, 'pa-spr sm')}<small>${c.iv == null ? '—' : c.iv}</small></span>`).join('') : '<span class="pa-mut">Sin capturas todavía</span>'}</div></div>
        </div>`;
      }
      h += '</div><p class="pa-note">Los juegos siguen funcionando por detrás sin dibujarse. Pulsa una tarjeta para abrir esa cuenta. IV de cada stat de 0 a 32 (total 192); con ≈ todavía no son exactos (el juego los da exactos desde el nivel 30).</p></div>';
      el.innerHTML = h;
      el.querySelectorAll('.pa-card').forEach((c) => c.onclick = () => { try { const i = +c.dataset.i; cardsOn = false; applyCards(); toggleExpand(i); } catch (e) { console.warn(e); } });
    } finally { lowBusy = false; }
  }

  // ================= TARJETAS DE LAS CUENTAS (menú lateral, como Poke Azul) =================
  const TRS = {};   // muestras de XP del entrenador por cuenta
  function trainerBar(i, tr) {
    if (!tr || !tr.lv || !tr.tot) return null;
    const a = xpNv(tr.lv), b = xpNv(tr.lv + 1);
    if (!(b > a) || tr.tot < a || tr.tot > b * 1.01) return { lv: tr.lv, pct: null, eta: null };
    const now = Date.now(), arr = (TRS[i] = (TRS[i] || []).filter((x) => now - x.t < 20 * 60000));
    if (!arr.length || arr[arr.length - 1].x !== tr.tot) arr.push({ t: now, x: tr.tot });
    let rate = 0;
    if (arr.length >= 2 && arr[arr.length - 1].t - arr[0].t > 30000) rate = ((arr[arr.length - 1].x - arr[0].x) / (arr[arr.length - 1].t - arr[0].t)) * 3600000;
    return { lv: tr.lv, pct: Math.max(0, Math.min(100, ((tr.tot - a) / (b - a)) * 100)), eta: rate > 0 ? ((b - tr.tot) / rate) * 3600 : null };
  }
  // mejor hunt para el líder, con el mismo modelo que usa Nexus en su Tierlist (tierPoke/sugCalc)
  const BEST = {};
  function bestHunt(ld, tlv) {
    try {
      /* global tierPoke, huntsCache */
      if (typeof tierPoke !== 'function' || typeof huntsCache === 'undefined' || !huntsCache || !huntsCache.length) return null;
      const k = ld.name + '|' + ld.lv + '|' + tlv;
      if (BEST[k] !== undefined) return BEST[k];
      const rows = tierPoke({ sp: String(ld.name || '').toLowerCase(), level: ld.lv, q: ld.q, ivt: ld.ivt, tlv: tlv || 0, mult: 1, tms: ld.tms || [] }, huntsCache, 'xp');
      const r = rows && rows[0];
      BEST[k] = r ? { name: r.x.name, eff: r.sg && r.sg.eff ? +r.sg.eff : null, slug: r.x.sl } : null;
      return BEST[k];
    } catch { return null; }
  }
  const TYCOL = { FIRE: '#7f1d1d', WATER: '#1e3a8a', GRASS: '#14532d', ELECTRIC: '#713f12', ICE: '#155e75', FIGHTING: '#7f1d1d', POISON: '#581c87', GROUND: '#713f12', FLYING: '#312e81', PSYCHIC: '#831843', BUG: '#365314', ROCK: '#57534e', GHOST: '#3b0764', DRAGON: '#312e81', DARK: '#1e293b', STEEL: '#334155', FAIRY: '#831843', NORMAL: '#374151' };
  let accBusy = false, accLast = 0;
  async function renderAccounts(box, panels) {
    if (accBusy || Date.now() - accLast < 2000) return;   // el menú se repinta a menudo: como mucho cada 2 s
    accBusy = true;
    try { await renderAccountsNow(box, panels); } finally { accBusy = false; accLast = Date.now(); }
  }
  async function renderAccountsNow(box, panels) {
    const n = (panels && panels.length) || COUNT();
    const D = await Promise.all([...Array(n)].map((_, i) => run(i, JS_READ, 4000)));
    D.forEach((d, i) => { if (d && d.name) NAMES[i] = d.name; });
    const html = D.map((d, i) => {
      const ld = d && d.ld, on = !!(d && d.on), t = ld && ld.t && ld.t[0] ? String(ld.t[0]).toUpperCase() : '';
      const e = ld ? leaderEta(i, ld, d && d.a && d.a.xph) : null, tb = d ? trainerBar(i, d.tr) : null;
      const best = ld ? bestHunt(ld, d.tr && d.tr.lv) : null;
      const here = best && d.hunt && best.slug && best.slug === d.hunt;
      const huntTxt = !d ? 'Esperando inicio de sesión…' : d.hunt ? cap(d.hunt) : 'En la ciudad';
      return `<button class="pa-acc${on ? '' : ' off'}" data-i="${i}">
        <div class="pa-acch"><div class="pa-accav${ld && ld.sh ? ' sh' : ''}" style="background:radial-gradient(circle at 50% 40%, ${TYCOL[t] || '#1e293b'}, #0b1220 75%)">${ld ? spr(ld.sp, ld.sh, 'pa-accspr') : '<span class="pa-nospr">?</span>'}</div>
          <div class="pa-accw"><div class="pa-accn"><span class="pa-dot${on ? ' on' : ''}"></span>${esc((d && d.name) || accName(i))}</div>
          <div class="pa-accl">${ld ? `${ld.sh ? '✨ ' : ''}${esc(ld.name)} · Nv. ${ld.lv}` : 'Sin pokémon líder'}</div>
          <div>${ld ? ld.t.map(tyTag).join('') : ''}</div></div></div>
        ${e ? `<div class="pa-accbar"><i style="width:${e.pct}%"></i></div><div class="pa-accrow"><span>Nv. ${ld.lv} → ${ld.lv + 1} · faltan <b>${String((100 - e.pct).toFixed(1)).replace('.', ',')}%</b></span><span>⏱ ${leaderEtaText(e)}</span></div>` : ''}
        ${tb ? `<div class="pa-accbar tr"><i style="width:${tb.pct == null ? 0 : tb.pct}%"></i></div><div class="pa-accrow"><span>🧑 Entrenador ${tb.lv} → ${tb.lv + 1}${tb.pct != null ? ` · faltan <b>${String((100 - tb.pct).toFixed(1)).replace('.', ',')}%</b>` : ''}</span><span>${tb.eta != null ? '⏱ ' + fmtEta(tb.eta) : ''}</span></div>` : ''}
        <div class="pa-acchunt">📍 ${esc(huntTxt)}</div>
        ${best ? `<div class="pa-acctip${here ? ' good' : ''}">${here ? '🎯 Estás en la mejor hunt' : `🎯 Mejor para ${esc(ld.name)}: ${esc(best.name)}${best.eff ? ' (×' + String(+best.eff.toFixed(2)).replace('.', ',') + ')' : ''}`}</div>` : ''}
        <div class="pa-accnums"><div><small>XP/H</small><b class="pa-xp">${on && d.a.xph ? fmt(d.a.xph) : '—'}</b></div><div><small>ORO/H</small><b class="${d && d.a.gph < 0 ? 'pa-neg' : 'pa-gold'}">${on && d.a.gph ? (d.a.gph < 0 ? '-$' + fmt(-d.a.gph) : '$' + fmt(d.a.gph)) : '—'}</b></div><div><small>KILLS/H</small><b>${on && d.a.kph ? fmt(d.a.kph) : '—'}</b></div></div>
        <div class="pa-accfoot"><span title="Capturas de la sesión">🎣 ${d ? d.s.caps : 0}</span><span title="Shinies capturados de los que han salido">✨ ${d ? (d.s.seen ? d.s.sh + ' de ' + d.s.seen : d.s.sh) : 0}</span><span title="Mejor IV capturado en la sesión">🏅 IV ${d && d.s.best ? d.s.best : '—'}</span></div>
      </button>`;
    }).join('');
    box.innerHTML = html;
    box.querySelectorAll('.pa-acc').forEach((b) => b.onclick = () => {
      const p = panels && panels[+b.dataset.i]; if (!p) return;
      box.querySelectorAll('.pa-acc').forEach((x) => x.classList.remove('active')); b.classList.add('active');
      try { p.scrollIntoView({ behavior: 'smooth', block: 'center' }); const w = p.querySelector('webview'); if (w) w.focus(); } catch {}
    });
  }

  // ================= CALCULADORA DE IV (sustituye a la de Nexus) =================
  const IVC = { acc: 0, roster: [], find: '', cur: null };
  function modal(id, title, wide) {
    let m = document.getElementById(id);
    if (!m) {
      m = document.createElement('div'); m.id = id; m.className = 'pa-modal'; m.hidden = true;
      m.innerHTML = `<div class="pa-box${wide ? ' wide' : ''}"><header><b>${title}</b><button class="pa-x">✕</button></header><div class="pa-body"></div></div>`;
      document.body.appendChild(m);
      m.querySelector('.pa-x').onclick = () => { m.hidden = true; if (m.onclose) m.onclose(); };
      m.addEventListener('mousedown', (e) => { if (e.target === m) { m.hidden = true; if (m.onclose) m.onclose(); } });
    }
    return m;
  }
  async function openIv() {
    const m = modal('paIv', '🧮 Calculadora de IV y calidad', true);
    m.hidden = false;
    await loadNames();
    const tmp = {}; IVC.acc = await pickAcc(IVC.acc, tmp); if (tmp[IVC.acc]) IVC.pre = tmp[IVC.acc];
    const body = m.querySelector('.pa-body');
    body.innerHTML = `<div class="pa-ivwrap"><div class="pa-ivform">
      <h4>Tus pokémon</h4><div class="pa-ivpick"><select id="paIvAcc">${[...Array(COUNT())].map((_, i) => `<option value="${i}" ${i === IVC.acc ? 'selected' : ''}>${esc(accName(i))}</option>`).join('')}</select><input id="paIvFind" placeholder="Buscar…" value="${esc(IVC.find)}"></div>
      <div id="paIvMine" class="pa-ivmine"><p class="pa-mut">Cargando…</p></div>
      <h4>Otra especie</h4><input id="paIvSp" list="paIvList" placeholder="Escribe el nombre (p. ej. Scizor)"><datalist id="paIvList"></datalist>
      <label class="pa-chk"><input type="checkbox" id="paIvGym"> Pokémon de jugador en gimnasio (bonus ×1,30 en ATK/DEF/SPA/SPD)</label>
      <p class="pa-mut">Edita cualquier campo de la ficha y se recalcula al momento. Si dejas la calidad vacía, se calcula sola a partir de las stats.</p>
      </div><div id="paIvOut" class="pa-ivout"><p class="pa-empty">Elige uno de tus pokémon o escribe una especie.</p></div></div>`;
    await loadSpecies();
    document.getElementById('paIvList').innerHTML = SP.list.map((s) => `<option value="${esc(s.name)}">`).join('');
    document.getElementById('paIvAcc').onchange = (e) => { IVC.acc = +e.target.value; loadIvRoster(); };
    document.getElementById('paIvFind').oninput = (e) => { IVC.find = e.target.value.toLowerCase(); drawIvRoster(); };
    document.getElementById('paIvSp').onchange = (e) => { const s = spOf(e.target.value.trim()); if (s) ivLoad({ sp: s.id, name: s.name, level: 100, stats: {}, quality: null }); };
    document.getElementById('paIvGym').onchange = () => ivDraw();
    loadIvRoster();
  }
  async function loadIvRoster() { IVC.roster = IVC.pre || (await run(IVC.acc, JS_ROSTER)) || []; IVC.pre = null; IVC.roster.sort((a, b) => (b.team - a.team) || (b.pw - a.pw)); drawIvRoster(); }
  function drawIvRoster() {
    const box = document.getElementById('paIvMine'); if (!box) return;
    const list = IVC.roster.filter((m) => !IVC.find || String(m.name).toLowerCase().includes(IVC.find)).slice(0, 80);
    box.innerHTML = list.length ? list.map((m) => `<button class="pa-mon" data-id="${esc(m.id)}">${spr(m.sp, m.sh, 'pa-spr sm')}<span><b>${esc(m.name)}</b><small>Nv. ${m.lv}${m.ivt != null ? ' · IV ' + m.ivt : ''}</small></span></button>`).join('') : '<p class="pa-mut">Esta cuenta aún no tiene la lista de pokémon (tiene que estar dentro del juego).</p>';
    box.querySelectorAll('.pa-mon').forEach((b) => b.onclick = () => {
      const m = IVC.roster.find((x) => x.id === b.dataset.id); if (!m) return;
      document.getElementById('paIvGym').checked = false;
      ivLoad({ sp: m.sp, name: m.name, shiny: m.sh, level: m.lv, quality: m.q || null, gameIv: m.ivt, gamePower: m.pw, acc: accName(IVC.acc),
        stats: { hp: m.st.hp, atk: m.st.atk, def: m.st.def, spa: m.st.spAtk, spd: m.st.spDef, spe: m.st.speed } });
    });
  }
  function ivLoad(o) {
    const s = spOf(o.sp);
    if (!s) { document.getElementById('paIvOut').innerHTML = '<p class="pa-note">⚠️ No tengo los datos de esa especie.</p>'; return; }
    IVC.cur = { ...o, info: s, base: { ...s.base } };
    if (IVC.cur.quality == null) IVC.cur.quality = autoQ(IVC.cur);
    ivDraw();
  }
  function autoQ(c) {
    const st = {}; for (const k of Object.keys(LAB)) if (Number(c.stats[k]) > 0) st[k] = Number(c.stats[k]);
    if (Object.keys(st).length < 4 || !(c.level > 0)) return null;
    const r = ivcalc.solve(c.base, c.level, st, { bonus: document.getElementById('paIvGym').checked });
    return r && !r.unsolvable ? r.quality : null;
  }
  function ivDraw() {
    const c = IVC.cur, out = document.getElementById('paIvOut'); if (!c || !out) return;
    const L = Number(c.level) || 0, q = Number(c.quality) || 0, gym = document.getElementById('paIvGym').checked;
    const ivs = {}; let tot = 0, n = 0;
    for (const k of Object.keys(LAB)) {
      const st = Number(c.stats[k]), b = Number(c.base[k]);
      if (!(st > 0 && b > 0 && L > 0 && q > 0)) { ivs[k] = null; continue; }
      const bonus = gym && k !== 'hp' && k !== 'spe' ? 1.3 : 1;
      ivs[k] = Math.max(0, Math.min(32, Math.round((((st / bonus) / ((L / 100) * Math.pow(q, EXP[k])) - b) / 2) * 10) / 10));
      tot += ivs[k]; n++;
    }
    const pct = n ? Math.round((tot / (n * 32)) * 1000) / 10 : 0;
    const power = Math.round(Object.keys(LAB).reduce((a, k) => a + (Number(c.stats[k]) || 0), 0) * (q || 0));
    const [vt, vd] = pct >= 95 ? ['Excepcional', 'Un ejemplar extremadamente próximo al potencial máximo.'] : pct >= 85 ? ['Excelente', 'Muy por encima de la media: vale la pena entrenarlo.'] : pct >= 70 ? ['Muy bueno', 'Buenos IV en casi todas las stats.'] : pct >= 55 ? ['Bueno', 'Correcto, con alguna stat floja.'] : pct >= 40 ? ['Normal', 'IV en la media.'] : ['Flojo', 'IV bajos: mejor buscar otro.'];
    const moves = c.info.attacks.filter((a) => !a.tm && (!a.l || a.l <= (L || 1))).sort((a, b) => a.l - b.l).slice(0, 12);
    out.innerHTML = `<div class="pa-ivcard">
      <div class="pa-ivh">${spr(c.sp, c.shiny, 'pa-spr')}<b>${esc(c.name)}</b>${c.acc ? `<span class="pa-mut">${esc(c.acc)}</span>` : ''}</div>
      <div class="pa-types">${c.info.types.map(tyTag).join('')}</div>
      <div class="pa-tiles"><div><small>NIVEL</small><input type="number" data-f="level" value="${c.level || ''}"></div>
        <div><small>CALIDAD</small><input type="number" step="0.001" data-f="quality" value="${c.quality != null ? c.quality : ''}" placeholder="auto"></div>
        <div><small>IV TOTAL</small><b class="pa-ivt">${Math.round(tot)}<span>/${n === 6 ? 192 : n * 32}</span></b></div>
        <div><small>PODER ESTIMADO</small><b class="pa-gold">${fmt(power)}</b></div></div>
      <div class="pa-ring"><div class="ring" style="background:conic-gradient(#4ade80 ${pct * 3.6}deg,#1e293b 0deg)"><span>${Math.round(pct)}%</span></div><div><b>${vt}</b><small>${vd}</small></div></div>
      <div class="pa-sub">ATRIBUTOS E IV POR STAT <span class="pa-mut">(${String(pct).replace('.', ',')}% · ${q ? `${rarOf(q)} ×${f2(q)}` : 'sin calidad'})</span></div>
      <div class="pa-stats">${Object.keys(LAB).map((k) => `<div class="pa-st"><div class="h"><b style="color:${COL[k]}">${LAB[k]}</b><span><b>${ivs[k] == null ? '—' : ivs[k].toFixed(1)}</b>/32</span></div>
        <div class="bar"><i style="width:${ivs[k] == null ? 0 : (ivs[k] / 32) * 100}%;background:${COL[k]}"></i></div>
        <label>actual <input type="number" data-s="${k}" value="${c.stats[k] ?? ''}"></label><label>base <input type="number" data-b="${k}" value="${c.base[k] ?? ''}"></label></div>`).join('')}</div>
      <div class="pa-sub">⚔️ GOLPES</div>
      <div class="pa-moves">${moves.map((a) => `<div>${tyTag(a.t)}<b>${esc(a.n)}</b><span class="pa-mut">Nv ${a.l || 1}</span><span class="pw">${a.p}</span></div>`).join('') || '<p class="pa-mut">Sin datos de golpes.</p>'}</div>
      <div class="pa-foot">${c.gamePower ? `Poder en el juego: <b>${fmt(c.gamePower)}</b>` : ''}${c.gameIv != null ? ` · IV en el juego: <b>${c.gameIv}/192</b>` : ''}<span class="pa-mut">edita cualquier campo para recalcular</span></div></div>`;
    let t = null;
    const later = (fn) => (e) => { fn(e.target); clearTimeout(t); t = setTimeout(() => {
      const a = document.activeElement, sel = a && a.dataset && (a.dataset.f ? `[data-f="${a.dataset.f}"]` : a.dataset.s ? `[data-s="${a.dataset.s}"]` : a.dataset.b ? `[data-b="${a.dataset.b}"]` : ''), pos = a && a.selectionStart;
      if (c.qAuto) c.quality = autoQ(c);
      ivDraw();
      if (sel) { const el = out.querySelector('input' + sel); if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch {} } }
    }, 250); };
    out.querySelectorAll('input[data-f]').forEach((i) => i.oninput = later((x) => { const v = x.value === '' ? null : Number(x.value); c[x.dataset.f] = v; if (x.dataset.f === 'quality') c.qAuto = v == null; }));
    out.querySelectorAll('input[data-s]').forEach((i) => i.oninput = later((x) => { c.stats[x.dataset.s] = x.value === '' ? null : Number(x.value); }));
    out.querySelectorAll('input[data-b]').forEach((i) => i.oninput = later((x) => { c.base[x.dataset.b] = x.value === '' ? null : Number(x.value); }));
  }

  // ================= GIMNASIOS =================
  const GYM = { list: [], t: 0, sel: -1, conqDay: 'today', conqSim: null, conqTypeTab: 'TODOS', busy: null, typeTab: 'TODOS' };
  const CONQ_KEY = 'pa-conquistas';
  const conqGet = () => lsGet(CONQ_KEY, { today: null, yesterday: null });
  // calidad e IV de un pokémon de jugador en gimnasio (con el bonus ×1,30)
  function calcMon(m) {
    const s = spOf(m.name);
    if (!s || !m.level) return { ...m, calc: null };
    const st = { ...m.stats };
    if (st.hp != null && !Number.isInteger(st.hp)) delete st.hp;
    return { ...m, calc: ivcalc.solve(s.base, m.level, st, { bonus: true }) };
  }
  async function fetchGyms() {
    if (GYM.busy) return GYM.busy;
    GYM.busy = (async () => {
      await loadSpecies();
      const order = [...Array(COUNT()).keys()].filter((i) => WV()[i] && !OFF()[i]);
      for (const i of order) {
        const askedAt = Date.now();
        const j = await run(i, JS_GYMS, 15000);
        if (j && !j.err) {
          const all = GY.parse(j, '/api/game/gyms');
          GYM.list = all.filter((g) => g.isNpc === false && g.leader).map((g) => ({ ...g, city: GY.gymKey(g.city || g.name), team: (g.team || []).map(calcMon) }));
          GYM.t = Date.now();
          return { ok: true, askedAt };
        }
      }
      return { ok: false };
    })().finally(() => { GYM.busy = null; });
    return GYM.busy;
  }
  // conquistas: de 09:55 a 10:00 (hora de Brasil) se mira cada 10 s y se guarda la última foto antes de las 10:00 (Brasil)
  let conqLast = 0;
  setInterval(async () => {
    const now = Date.now();
    if (!CQ.inWindow(now) || now - conqLast < 10000) return;
    conqLast = now;
    const z = CQ.brasil(now), d = conqGet();
    if (!d.today || d.today.date !== z.date) { if (d.today && d.today.gyms) d.yesterday = d.today; d.today = { date: z.date, gyms: null, at: 0, checks: 0 }; lsSet(CONQ_KEY, d); }
    const r = await fetchGyms();
    if (!r || !r.ok || !CQ.inWindow(r.askedAt)) return;
    const d2 = conqGet(), T = d2.today;
    if (!T || T.date !== z.date || r.askedAt < T.at || (!CQ.inWindow(Date.now()) && T.gyms)) return;
    T.gyms = GYM.list.map((g) => ({ city: g.city, name: g.name, type: g.type, leader: g.leader, since: g.since, defenses: g.defenses, team: g.team }));
    T.at = r.askedAt; T.checks = (T.checks || 0) + 1;
    lsSet(CONQ_KEY, d2);
    if (!document.getElementById('paGym')?.hidden || document.getElementById('ehGymsInline')?.closest('.show')) renderGyms();
  }, 2000);

  function gymHeld(m) {
    const h = m && m.heldItem;
    if (!h || h.status === 'unknown') return '<div class="pa-held unknown">🎒 Held Item: <b>No detectado</b></div>';
    if (h.status === 'none') return '<div class="pa-held">🎒 Held Item: <b>Sin Held Item</b></div>';
    const lvl = h.level != null ? ' · Nivel ' + h.level : '';
    const name = h.name || (h.id != null ? 'Objeto #' + h.id : 'Objeto equipado');
    // No atribuir bonificaciones que la API no entregue: el nombre/nivel son informativos.
    return '<div class="pa-held">🎒 Held Item: <b>' + esc(name) + '</b>' + esc(lvl) + '</div>';
  }
  function monCard(m) {
    const st = (v) => (v == null ? '—' : Number(v).toLocaleString('es-ES'));
    const c = m.calc && !m.calc.unsolvable ? m.calc : null;
    const est = !!(c && (c.estimated || c.exact === false));
    const mis = (c && c.mismatch) || [];
    const NM = { hp: 'HP', atk: 'ATK', def: 'DEF', spa: 'SP.ATK', spd: 'SP.DEF', spe: 'VEL' };
    const ivT = (k) => (c && c.ivs && c.ivs[k] != null ? (est ? '≈' : '') + 'IV ' + c.ivs[k] : '');
    const L = [['ATK', 'atk'], ['DEF', 'def'], ['SP.ATK', 'spa'], ['SP.DEF', 'spd'], ['VEL', 'spe']];
    return `<div class="pa-gmon"><div class="top">${spr(m.name, m.shiny, 'pa-spr')}<b>${m.shiny ? '✨ ' : ''}${esc(m.name)}</b><span class="hp">♥ ${st(m.battleHp != null ? m.battleHp : m.stats.hp != null ? m.stats.hp * 12 : null)}${c && c.ivs ? ` <small>${esc(ivT('hp'))}</small>` : ''}</span></div>
      <div class="pa-mut">Nv. ${m.level == null ? '?' : m.level} · ${(m.types || []).map(tyTag).join('')}</div>
      ${c ? `<div class="qual"><span class="pa-rar pa-rar-${esc(c.rarity)}">${est ? '≈ ' : ''}${esc(c.rarity)} ×${f2(c.quality)}</span><span>IV ${est ? '≈ ' : ''}<b>${c.total}</b>/${c.max} (${String(c.pct).replace('.', ',')}%)</span></div>${mis.length ? `<div class="pa-mis">≈ ${mis.map((k) => NM[k] || k).join(' y ')}: no cuadran exactas (¿potenciador?), IV aproximado</div>` : ''}` : '<div class="pa-note">No se pueden calcular su calidad e IV con estas stats.</div>'}
      ${gymHeld(m)}
      <div class="stats">${L.map(([l, k]) => `<div${mis.includes(k) ? ' class="mis"' : ''}><small>${l}</small><b>${st(m.stats[k])}</b>${c && c.ivs ? `<i>${esc(ivT(k))}</i>` : ''}</div>`).join('')}</div>
      ${(m.moves || []).slice(0, 6).map((mv) => `<div class="mv">${tyTag(mv.type || '?')} ${esc(mv.name)}<span>${mv.power != null ? mv.power : ''}</span></div>`).join('')}</div>`;
  }
  const dt = (t) => (t ? new Date(t).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '');
  async function openGyms(host) {
    const embedded = !!host;
    const m = embedded ? null : modal('paGym', '🏆 Gimnasios', true);
    if (m) m.hidden = false;
    (host || m.querySelector('.pa-body')).innerHTML = '<div class="pa-gwrap"><div class="pa-glist" id="paGList"></div><div class="pa-gbody" id="paGBody"><p class="pa-empty">Cargando gimnasios…</p></div></div>';
    await loadNames();
    if (!SIM.picked) { SIM.picked = true; const tmp = {}; SIM.acc = await pickAcc(SIM.acc, tmp); if (tmp[SIM.acc]) SIM.roster[SIM.acc] = tmp[SIM.acc].sort((a, b) => (b.team - a.team) || (b.pw - a.pw)).slice(0, 80); }
    if (Date.now() - GYM.t > 15000) await fetchGyms();
    renderGyms();
    clearInterval(GYM.timer);
    GYM.timer = setInterval(async () => { if (embedded ? !host.isConnected || !host.closest('.show') : m.hidden) return clearInterval(GYM.timer); await fetchGyms(); if (GYM.sel !== -1 || true) renderGyms(true); }, 60000);
  }
  const GYM_TYPES = [
    ['NORMAL','Normal'],['FIRE','Fuego'],['WATER','Agua'],['ELECTRIC','Eléctrico'],
    ['GRASS','Planta'],['ICE','Hielo'],['FIGHTING','Lucha'],['POISON','Veneno'],
    ['GROUND','Tierra'],['FLYING','Volador'],['PSYCHIC','Psíquico'],['BUG','Bicho'],
    ['ROCK','Roca'],['GHOST','Fantasma'],['DRAGON','Dragón'],['DARK','Siniestro'],
    ['STEEL','Acero'],['FAIRY','Hada']
  ];
  const GYM_TYPE_ALIAS = {
    NORMAL:'NORMAL',FUEGO:'FIRE',AGUA:'WATER',ELECTRICO:'ELECTRIC',ELECTRIC:'ELECTRIC',
    PLANTA:'GRASS',HIELO:'ICE',LUCHA:'FIGHTING',VENENO:'POISON',TIERRA:'GROUND',
    VOLADOR:'FLYING',PSIQUICO:'PSYCHIC',BICHO:'BUG',ROCA:'ROCK',
    FANTASMA:'GHOST',DRAGON:'DRAGON',SINIESTRO:'DARK',ACERO:'STEEL',HADA:'FAIRY'
  };
  function gymType(g) {
    const raw = String(g.type || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
    return GYM_TYPE_ALIAS[raw] || raw || 'DESCONOCIDO';
  }
  function renderGyms(soft) {
    const list = document.getElementById('paGList'), body = document.getElementById('paGBody');
    if (!list || !body) return;
    if (GYM.sel >= GYM.list.length) GYM.sel = -1;
    if (soft && document.querySelector('#paGBody .pa-simbox')) { /* no se cierra el simulador abierto */ }
    const c = conqGet();
    const types = [...new Set(GYM.list.map(gymType))];
    const known = GYM_TYPES.filter(([key]) => types.includes(key));
    const other = types.filter((key) => !GYM_TYPES.some(([k]) => k === key)).map((key) => [key, key === 'DESCONOCIDO' ? 'Sin tipo' : cap(key)]);
    const available = [...known, ...other];
    if (GYM.typeTab !== 'TODOS' && !types.includes(GYM.typeTab)) GYM.typeTab = 'TODOS';
    const visible = GYM.list.map((g, k) => ({g, k})).filter(({g}) => GYM.typeTab === 'TODOS' || gymType(g) === GYM.typeTab);
    // Mantener el gimnasio seleccionado solo si pertenece a la subpestaña activa.
    if (GYM.sel !== -1 && !visible.some(({k}) => k === GYM.sel)) GYM.sel = visible.length ? visible[0].k : -1;
    list.innerHTML = `<button class="pa-gbtn conq${GYM.sel === -1 ? ' on' : ''}" data-k="-1"><b>🏅 Conquistas de las 10:00 (Brasil)</b><small>🕙 ${esc(conquestLocalLabel(CQ.brasil().date))} · ${c.today && c.today.gyms ? c.today.gyms.length + ' guardado(s) hoy' : 'captura entre 09:55 y 10:00 (Brasil)'}</small></button>
      <div class="pa-sec">👑 Gimnasios por tipo (${GYM.list.length})</div>
      <div class="pa-gytype-tabs" role="group" aria-label="Filtrar gimnasios por tipo">
        <button class="${GYM.typeTab === 'TODOS' ? 'on' : ''}" data-type="TODOS">Todos (${GYM.list.length})</button>
        ${available.map(([key, name]) => `<button class="${GYM.typeTab === key ? 'on' : ''}" data-type="${esc(key)}">${esc(name)} (${GYM.list.filter(g => gymType(g) === key).length})</button>`).join('')}
      </div>` +
      (visible.length ? visible.map(({g, k}) => `<button class="pa-gbtn${k === GYM.sel ? ' on' : ''}" data-k="${k}"><b>${esc(cap(g.name || g.city))}</b><small>👑 ${esc(g.leader)}</small></button>`).join('') : '<p class="pa-mut">No hay gimnasios de este tipo ocupados por jugadores.</p>');
    list.querySelectorAll('.pa-gytype-tabs button').forEach(b => b.onclick = () => {
      GYM.typeTab = b.dataset.type;
      const first = GYM.list.findIndex(g => GYM.typeTab === 'TODOS' || gymType(g) === GYM.typeTab);
      GYM.sel = first >= 0 ? first : -1;
      renderGyms();
    });
    list.querySelectorAll('.pa-gbtn').forEach((b) => b.onclick = () => { GYM.sel = +b.dataset.k; renderGyms(); });
    if (GYM.sel === -1) return renderConq();
    const g = GYM.list[GYM.sel];
    body.innerHTML = `<div class="pa-ghead"><b>Gimnasio de ${esc(cap(g.name || g.city))}</b><span>👑 Tomado por <b>${esc(g.leader)}</b>${g.since ? ' desde ' + dt(g.since) : ''}${g.defenses != null ? ' · ' + g.defenses + ' defensa(s)' : ''}</span></div>
      <div class="pa-live">🔄 Se actualiza solo cada minuto${GYM.t ? ' · última vez a las ' + new Date(GYM.t).toLocaleTimeString('es-ES') : ''}</div>
      <div class="pa-simbox" id="paSim"></div>
      <h4>👑 Equipo de ${esc(g.leader)}</h4><div class="pa-team">${g.team.map(monCard).join('')}</div>
      <p class="pa-note">La calidad y los IV se calculan con la fórmula del juego a partir del nivel y las 6 stats. En los gimnasios de jugadores, ATK, DEF, SP.ATK y SP.DEF llevan un bonus ×1,30 que se descuenta solo. Con ≈ es una estimación.</p>`;
    renderSim({ city: g.city, team: g.team });
  }
  // Convertir las 10:00 de São Paulo del día de la conquista al instante real.
  // Se consulta Intl para respetar las reglas de zona horaria, sin asumir UTC-3 fijo.
  function conquestInstant(brDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(brDate || ''))) return null;
    const [y, m, d] = brDate.split('-').map(Number);
    const desired = Date.UTC(y, m - 1, d, 10, 0, 0);
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
    let instant = desired;
    for (let i = 0; i < 4; i++) {
      const parts = Object.fromEntries(formatter.formatToParts(new Date(instant)).filter(p => p.type !== 'literal').map(p => [p.type, Number(p.value)]));
      const shown = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
      const diff = desired - shown;
      instant += diff;
      if (diff === 0) break;
    }
    return new Date(instant);
  }
  function conquestLocalLabel(brDate) {
    const instant = conquestInstant(brDate);
    if (!instant || !Number.isFinite(instant.getTime())) return 'Hora local no disponible';
    return instant.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  function renderConq() {
    const body = document.getElementById('paGBody'), c = conqGet(), z = CQ.brasil();
    const day = GYM.conqDay === 'yesterday' ? c.yesterday : c.today;
    const fecha = (d) => (d ? new Date(d.date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : '');
    const hora = (t) => new Date(t).toLocaleTimeString('es-ES', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const brazilDate = (day && day.date) || z.date;
    const localEvent = conquestLocalLabel(brazilDate);
    const active = z.min >= CQ.START && z.min < CQ.END;
    let h = `<div class="pa-ghead"><b>🏅 Conquistas de las 10:00 (Brasil)</b><span>🕙 10:00 Brasil → 📅 ${esc(localEvent)} (hora del dispositivo) · Fecha del evento seleccionado</span></div>
      <div class="pa-tabs"><button data-d="today" class="${GYM.conqDay !== 'yesterday' ? 'on' : ''}">Hoy${c.today ? ' · ' + esc(fecha(c.today)) : ''}</button><button data-d="yesterday" class="${GYM.conqDay === 'yesterday' ? 'on' : ''}" ${c.yesterday ? '' : 'disabled'}>Anterior${c.yesterday ? ' · ' + esc(fecha(c.yesterday)) : ''}</button></div>`;
    if (active) h += `<div class="pa-live rec">⏺ Guardando ahora (de 09:55 a 10:00, hora de Brasil; cada 10 segundos)${c.today && c.today.at ? ' · última foto ' + hora(c.today.at) : ''}</div>`;
    if (!day || !day.gyms) {
      h += GYM.conqDay === 'yesterday' ? '<p class="pa-note">No hay un guardado anterior.</p>'
        : `<p class="pa-note">${z.min >= CQ.END && (!c.today || c.today.date === z.date) ? 'Hoy no se pudo guardar: Nexus tiene que estar abierto, con al menos una cuenta dentro del juego, entre las 09:55 y las 10:00 (Brasil).' : 'Todavía no se ha guardado hoy. Se guarda solo entre las 09:55 y las 10:00 (hora de Brasil); déjalo abierto con al menos una cuenta dentro del juego.'}</p>`;
    } else {
      h += `<div class="pa-live">📸 Foto de las ${hora(day.at)} · ${day.gyms.length} gimnasio(s) tomados por jugadores · ${day.checks || 0} comprobaciones</div>`;
      if (!day.gyms.length) h += '<p class="pa-note">A esa hora ningún jugador tenía un gimnasio.</p>';
      const dk = GYM.conqDay === 'yesterday' ? 'yesterday' : 'today';
      const allTypes = [...new Set(day.gyms.map(gymType))];
      const knownTypes = GYM_TYPES.filter(([key]) => allTypes.includes(key));
      const extraTypes = allTypes.filter(k => !GYM_TYPES.some(([known]) => known === k)).map(k => [k, k === 'DESCONOCIDO' ? 'Sin tipo' : cap(k)]);
      if (GYM.conqTypeTab !== 'TODOS' && !allTypes.includes(GYM.conqTypeTab)) GYM.conqTypeTab = 'TODOS';
      h += `<div class="pa-sec">🏅 Conquistas por tipo</div><div class="pa-gytype-tabs pa-conqtype-tabs" role="group" aria-label="Filtrar conquistas por tipo">
        <button data-conqtype="TODOS" class="${GYM.conqTypeTab === 'TODOS' ? 'on' : ''}">Todos (${day.gyms.length})</button>
        ${[...knownTypes, ...extraTypes].map(([key, label]) => `<button data-conqtype="${esc(key)}" class="${GYM.conqTypeTab === key ? 'on' : ''}">${esc(label)} (${day.gyms.filter(g => gymType(g) === key).length})</button>`).join('')}
      </div>`;
      const filtered = day.gyms.filter(g => GYM.conqTypeTab === 'TODOS' || gymType(g) === GYM.conqTypeTab);
      if (!filtered.length && day.gyms.length) h += '<p class="pa-note">No hay conquistas de este tipo.</p>';
      for (const g of filtered) {
        const open = GYM.conqSim === dk + '|' + g.city;
        h += `<div class="pa-cg"><div class="h"><b>${esc(cap(g.name || g.city))}</b><span>👑 <b>${esc(g.leader)}</b>${g.since ? ' · desde ' + dt(g.since) : ''}${g.defenses != null ? ' · ' + g.defenses + ' defensa(s)' : ''}</span>
          <button class="pa-go sm pa-cgsim" data-city="${esc(g.city)}">${open ? '✕ Cerrar simulador' : '⚔️ Simular contra él'}</button></div>
          ${open ? '<div class="pa-simbox" id="paSim"></div>' : ''}<div class="pa-team">${(g.team || []).map(monCard).join('') || '<p class="pa-mut">Sin equipo visible.</p>'}</div></div>`;
      }
    }
    h += '<p class="pa-note">Cada día, al empezar el guardado de las 09:55 (Brasil), el de hoy pasa a "Anterior" y el más viejo se borra. Si alguien conquista a las 09:59 (Brasil), también sale: se guarda la última foto antes de las 10:00 (Brasil).</p>';
    body.innerHTML = h;
    body.querySelectorAll('.pa-tabs button').forEach((b) => b.onclick = () => { GYM.conqDay = b.dataset.d; GYM.conqSim = null; renderConq(); });
    body.querySelectorAll('.pa-conqtype-tabs button').forEach((b) => b.onclick = () => { GYM.conqTypeTab = b.dataset.conqtype; GYM.conqSim = null; renderConq(); });
    body.querySelectorAll('.pa-cgsim').forEach((b) => b.onclick = () => { const k = (GYM.conqDay === 'yesterday' ? 'yesterday' : 'today') + '|' + b.dataset.city; GYM.conqSim = GYM.conqSim === k ? null : k; renderConq(); });
    if (GYM.conqSim && document.getElementById('paSim')) {
      const [dk, city] = GYM.conqSim.split('|'), dd = c[dk], cg = dd && (dd.gyms || []).find((x) => x.city === city);
      if (cg) renderSim({ city: GYM.conqSim, team: cg.team });
    }
  }

  // ---------------- simulador de combate ----------------
  // acc = -1: los pokémon de todas las cuentas juntos (sin pasarlos a una); la lista se vuelve a leer cada minuto
  // (los que levean suben de nivel y de stats); bayas por pokémon; los dos equipos salen en orden aleatorio.
  const SIM = { acc: 0, sel: {}, n: 5, roster: {}, rosterT: {}, res: null, key: '', berries: {}, berryPct: 5 };
  const BERRY_T = [['Babiri', 'Acero'], ['Occa', 'Fuego'], ['Passho', 'Agua'], ['Wacan', 'Eléctrico'], ['Rindo', 'Planta'], ['Yache', 'Hielo'], ['Chople', 'Lucha'], ['Kebia', 'Veneno'], ['Shuca', 'Tierra'], ['Coba', 'Volador'], ['Payapa', 'Psíquico'], ['Tanga', 'Bicho'], ['Charti', 'Roca'], ['Kasib', 'Fantasma'], ['Haban', 'Dragón'], ['Colbur', 'Siniestro'], ['Roseli', 'Hada'], ['Chilan', 'Normal']];
  const monTypes = (m) => (m.t || []).map((x) => String(x).toLowerCase());
  const lc = (t) => String(t || '').toLowerCase();
  function myMon(m) {
    const moves = movesOf(m.sp, m.lv, m.tms).sort((a, b) => b.p - a.p).slice(0, 8);
    return { id: m.id, name: m.name, sp: m.sp, level: m.lv, shiny: m.sh, types: monTypes(m), hp: m.mhp || (m.st.hp * 12) || 1,
      stats: { atk: m.st.atk, def: m.st.def, spa: m.st.spAtk, spd: m.st.spDef, spe: m.st.speed }, moves: moves.map((a) => ({ n: a.n, t: a.t, p: a.p, c: a.c })) };
  }
  async function simRoster(acc) {
    const sortL = (L) => L.sort((a, b) => (b.team - a.team) || (b.pw - a.pw));
    if (acc !== -1) return sortL((await run(acc, JS_ROSTER)) || []).slice(0, 80);
    const out = [];
    for (let i = 0; i < COUNT(); i++) {
      const L = sortL((await run(i, JS_ROSTER)) || []).slice(0, 40);
      for (const m of L) out.push({ ...m, id: i + ':' + m.id, acc: i, accN: accName(i) });
    }
    return sortL(out).slice(0, 160);
  }
  function theirTeam(g) {
    return (g.team || []).map((m) => ({ name: m.name, sp: (spOf(m.name) || {}).id, level: m.level || 400, shiny: m.shiny, types: m.types,
      hp: m.battleHp || (m.stats.hp ? m.stats.hp * 12 : 1), stats: { atk: m.stats.atk, def: m.stats.def, spa: m.stats.spa, spd: m.stats.spd, spe: m.stats.spe },
      moves: (m.moves || []).map((x) => ({ n: x.name, t: x.type, p: x.power, c: x.cat })) }));
  }
  async function renderSim(g) {
    const box = document.getElementById('paSim'); if (!box) return;
    if (SIM.key !== g.city) { SIM.res = null; SIM.key = g.city; }
    if (!SIM.roster[SIM.acc] || Date.now() - (SIM.rosterT[SIM.acc] || 0) > 60000) { SIM.roster[SIM.acc] = await simRoster(SIM.acc); SIM.rosterT[SIM.acc] = Date.now(); }
    if (!box.isConnected) return;
    const roster = SIM.roster[SIM.acc];
    if (!SIM.sel[SIM.acc]) SIM.sel[SIM.acc] = new Set((SIM.acc === -1 ? roster.slice().sort((a, b) => (b.pw || 0) - (a.pw || 0)) : roster.filter((m) => m.team)).slice(0, 6).map((m) => m.id));
    const sel = SIM.sel[SIM.acc];
    box.innerHTML = `<div class="pa-simhead"><b>⚔️ Simulador de combate</b>
        <select id="paSimAcc"><option value="-1" ${SIM.acc === -1 ? 'selected' : ''}>🧩 Todas las cuentas juntas</option>${[...Array(COUNT())].map((_, i) => `<option value="${i}" ${i === SIM.acc ? 'selected' : ''}>${esc(accName(i))}</option>`).join('')}</select>
        <label>Batallas <input type="number" id="paSimN" min="1" max="10" value="${SIM.n}"></label>
        <button class="pa-go" id="paSimGo" ${sel.size ? '' : 'disabled'}>▶ Simular</button>
        <span class="pa-mut">Elige hasta 6 (${sel.size}/6)${SIM.acc === -1 ? ' de cualquiera de tus cuentas, sin pasarlos' : ''}. En cada batalla se barajan los dos equipos: el tuyo y el del gimnasio.</span></div>
      <div class="pa-simroster">${roster.length ? roster.map((m) => `<button class="pa-mon${sel.has(m.id) ? ' on' : ''}" data-id="${esc(m.id)}">${spr(m.sp, m.sh, 'pa-spr sm')}<span><b>${esc(m.name)}</b><small>Nv. ${m.lv}${m.team ? ' · equipo' : ''}</small>${m.accN ? `<small class="pa-simacc">${esc(m.accN)}</small>` : ''}</span></button>`).join('') : '<p class="pa-mut">Aún no hay lista de pokémon (la cuenta tiene que estar dentro del juego).</p>'}</div>
      ${sel.size ? `<div class="pa-berry"><div class="pa-bh"><b>🍒 Bayas</b><span class="pa-mut">Cada baya quita un % del daño de los golpes de su tipo.</span>
          <label>Reducción <input type="number" id="paBp" min="1" max="90" value="${SIM.berryPct}">%</label>
          <button class="pa-go sm" id="paBBest">💡 Poner la mejor a cada uno</button><button class="pa-go sm" id="paBNone">Quitar todas</button></div>
        <div class="pa-bl">${[...sel].map((id) => { const m = roster.find((x) => x.id === id); if (!m) return ''; const b = SIM.berries[id] || ''; return `<div class="pa-bm${b ? ' on' : ''}">${spr(m.sp, m.sh, 'pa-spr sm')}<b>${esc(m.name)}</b><select data-id="${esc(id)}"><option value="">Sin baya</option>${BERRY_T.map(([n, t]) => `<option value="${n}" ${b === n ? 'selected' : ''}>${n} Berry · −${SIM.berryPct}% ${t}</option>`).join('')}</select></div>`; }).join('')}</div></div>` : ''}
      <div id="paSimRes"></div>`;
    document.getElementById('paSimAcc').onchange = (e) => { SIM.acc = +e.target.value; SIM.res = null; renderSim(g); };
    document.getElementById('paSimN').onchange = (e) => { SIM.n = Math.max(1, Math.min(10, Math.round(+e.target.value) || 1)); e.target.value = SIM.n; };
    box.querySelectorAll('.pa-mon').forEach((b) => b.onclick = () => { const id = b.dataset.id; if (sel.has(id)) sel.delete(id); else if (sel.size < 6) sel.add(id); renderSim(g); });
    box.querySelectorAll('.pa-berry select').forEach((x) => x.onchange = () => { if (x.value) SIM.berries[x.dataset.id] = x.value; else delete SIM.berries[x.dataset.id]; SIM.res = null; renderSim(g); });
    const bp = document.getElementById('paBp'); if (bp) bp.onchange = (e) => { SIM.berryPct = Math.max(1, Math.min(90, Math.round(+e.target.value) || 5)); SIM.res = null; renderSim(g); };
    const bn = document.getElementById('paBNone'); if (bn) bn.onclick = () => { SIM.berries = {}; SIM.res = null; renderSim(g); };
    const bb = document.getElementById('paBBest'); if (bb) bb.onclick = () => {
      // la baya del tipo con el que el gimnasio le haría más daño a cada uno
      const T = theirTeam(g).map((m) => ({ ...m, types: (m.types || []).map(lc), moves: m.moves.map((x) => ({ ...x, t: lc(x.t), c: /^(f|ph)/i.test(x.c || '') ? 'P' : /^(e|sp)/i.test(x.c || '') ? 'S' : '' })) }));
      for (const id of sel) {
        const m = roster.find((x) => x.id === id); if (!m) continue;
        const M = myMon(m); M.moves = M.moves.map((x) => ({ ...x, t: lc(x.t) }));
        const byType = {};
        for (const e of T) { const r = battle.bestMove(e, M); if (r && r.e > 0 && r.m.t) byType[r.m.t] = (byType[r.m.t] || 0) + r.score; }
        const best = Object.entries(byType).sort((x, y) => y[1] - x[1])[0];
        const name = best && Object.keys(battle.BERRIES || {}).find((n) => battle.BERRIES[n] === best[0]);
        if (name) SIM.berries[id] = name;
      }
      SIM.res = null; renderSim(g);
    };
    document.getElementById('paSimGo').onclick = () => {
      const mine = roster.filter((m) => sel.has(m.id)).map((m) => { const o = myMon(m), b = SIM.berries[m.id]; if (b && battle.BERRIES && battle.BERRIES[b]) o.berry = { t: battle.BERRIES[b], r: SIM.berryPct / 100, n: b }; return o; });
      const theirs = theirTeam(g);
      SIM.res = !mine.length ? { error: 'Elige al menos un pokémon.' } : !theirs.length ? { error: 'Este gimnasio no tiene equipo conocido.' }
        : { ...battle.simulate(mine, theirs, SIM.n, { shuffleMine: true, shuffleTheirs: true }), mine, theirs };
      showSim();
    };
    if (SIM.res) showSim();
  }
  function showSim() {
    const r = SIM.res, out = document.getElementById('paSimRes'); if (!out || !r) return;
    if (r.error) { out.innerHTML = `<p class="pa-note">⚠️ ${esc(r.error)}</p>`; return; }
    const pct = Math.round((r.wins / r.n) * 100);
    const verdict = pct >= 80 ? 'Muy favorable' : pct >= 60 ? 'Favorable' : pct >= 40 ? 'Ajustado' : pct >= 20 ? 'Difícil' : 'Muy difícil';
    const withB = (r.mine || []).filter((m) => m.berry);
    out.innerHTML = `<div class="pa-simsum ${pct >= 50 ? 'good' : 'bad'}"><b>${r.wins}/${r.n}</b><span>${verdict}: ganas ${r.wins} de ${r.n} batallas (${pct}%)</span></div>
      ${r.mvp ? `<p class="pa-mut">⭐ Tu mejor pokémon: <b>${esc(r.mvp[0])}</b> (${r.mvp[1]} derrotas)${r.threat ? ' · 💀 Su más peligroso: <b>' + esc(r.threat[0]) + '</b>' : ''}</p>` : ''}
      ${withB.length ? `<p class="pa-simbl">🍒 Con bayas: ${withB.map((m) => `<b>${esc(m.name)}</b> → ${esc(m.berry.n)} Berry`).join(' · ')}</p>` : ''}
      <div class="pa-simbats">${(r.battles || []).map((b, k) => `<details><summary>${b.won ? '✅' : '❌'} Batalla ${k + 1} <span class="pa-mut">· Tu orden: ${esc((b.order || []).join(', '))} · Su orden: ${esc((b.orderTheirs || []).join(', '))}</span></summary><ol>${(b.log || []).map((e) => `<li>${esc(e.w)} ${e.win === 'mine' ? 'derrota a' : 'derrota a tu'} ${esc(e.l)} <span class="pa-mut">(${e.turns} turnos${e.moveW ? ', ' + esc(e.moveW) : ''})</span></li>`).join('')}</ol></details>`).join('')}</div>
      <p class="pa-note">Estimación con la fórmula clásica de daño (ataque/defensa, potencia, mismo tipo ×1,5, efectividad, crítico y azar). El juego puede tener detalles propios, así que tómalo como guía.</p>`;
  }

  // ================= CERRAR ANUNCIOS DEL JUEGO (opción en Configuración) =================
  // Dentro de cada panel: solo pulsa "Cerrar" en una ventana que es claramente un anuncio (capa encima de todo con una
  // imagen grande, sin campos para rellenar y casi sin texto), p. ej. el "Passe de Batalha".
  const ADBLOCK = `(() => {
  if (window.__pokeAzulAds) return; window.__pokeAzulAds = true;
  const CLOSE = /^(cerrar|fechar|close|x|×|✕)$/i;
  const AD = /pass|passe|batalha|battle|promo|oferta|offer|banner|anuncio|news|novidade|evento|event|vip|loja|shop|premium/i;
  const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  function overlayOf(btn) {
    let el = btn.parentElement;
    for (let i = 0; el && i < 12; i++, el = el.parentElement) {
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      if ((s.position === 'fixed' || s.position === 'absolute') && r.width >= innerWidth * 0.6 && r.height >= innerHeight * 0.6) return el;
    }
    return null;
  }
  function check() {
    if (window.__pokeAzulAdsOff) return;
    for (const btn of document.querySelectorAll('button, [role=button], a')) {
      const label = (btn.textContent || btn.getAttribute('aria-label') || '').trim();
      if (!CLOSE.test(label) || !vis(btn)) continue;
      const ov = overlayOf(btn);
      if (!ov || ov.querySelector('input, textarea, select')) continue;
      const imgs = [...ov.querySelectorAll('img')].filter((im) => vis(im) && im.getBoundingClientRect().width >= 200 && im.getBoundingClientRect().height >= 150);
      if (!imgs.length) continue;
      const text = (ov.innerText || '').replace(label, '').trim();
      const looksAd = imgs.some((im) => AD.test(im.src || '') || AD.test(im.alt || '')) || AD.test(text);
      if (text.length > 200 && !looksAd) continue;   // mucho texto: puede ser una ventana del juego, no se toca
      if (!looksAd && ov.querySelectorAll('button, [role=button]').length > 2) continue;
      btn.click();
      console.log('[PokeAzul] anuncio cerrado: ' + (imgs[0].src || '').slice(0, 200));
      return;
    }
  }
  let t = null;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(check, 400); }).observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(check, 1500);
})();`;
  let adsOn = lsGet('pa-closeAds', true) !== false;
  const adsApply = (w) => { try { w.executeJavaScript(adsOn ? 'window.__pokeAzulAdsOff=false;' + ADBLOCK : 'window.__pokeAzulAdsOff=true;0').catch(() => {}); } catch {} };
  function hookAds() {
    WV().forEach((w, i) => {
      if (!w || w.__paAds) return;
      w.__paAds = 1;
      w.addEventListener('dom-ready', () => { if (adsOn) adsApply(w); });
      if (!OFF()[i]) setTimeout(() => adsApply(w), 1000);
    });
  }
  setInterval(hookAds, 3000);
  function setAds(on) { adsOn = !!on; lsSet('pa-closeAds', adsOn); WV().forEach((w, i) => { if (w && !OFF()[i]) adsApply(w); }); }
  // la opción, dentro de la Configuración de Nexus
  function addAdsOption() {
    if (document.getElementById('paAdsOpt')) return true;
    const secs = [...document.querySelectorAll('#ehOptionList .eh-opt-section')];
    if (!secs.length) return false;
    const sec = secs.find((x) => /apariencia|juego/i.test(x.querySelector('h3')?.textContent || '')) || secs[0];
    const row = document.createElement('label');
    row.id = 'paAdsOpt'; row.className = 'pa-opt';
    row.innerHTML = '<span class="pa-optt"><b>Cerrar los anuncios solos</b><small>Cierra las ventanas de publicidad del juego (por ejemplo "Passe de Batalha") nada más salir.</small></span><input type="checkbox" class="pa-sw">';
    const chk = row.querySelector('input'); chk.checked = adsOn; chk.onchange = () => setAds(chk.checked);
    sec.appendChild(row);
    return true;
  }

  // ================= MEMORIA (opciones en Configuración) =================
  // Limpiar memoria cada 10 min sin recargar; recargar un panel si se pasa del límite; recarga programada cada N horas.
  // Como mucho una recarga cada 10 minutos y 3 por hora y panel; si sigue pasándose, se pausa y avisa.
  const PERF = Object.assign({ trim: true, auto: false, mb: 2500, hours: 0 }, lsGet('pa-perf', {}));
  const savePerf = () => lsSet('pa-perf', PERF);
  const wcId = (w) => { try { return w.getWebContentsId(); } catch { return null; } };
  const RL = { last: 0, per: {}, start: {}, paused: {} };
  let trimLast = Date.now();
  const note = (title, body) => { try { window.pokeAPI && window.pokeAPI.notify && window.pokeAPI.notify(title, body); } catch {} };
  async function perfTick() {
    const api = window.pokeAPI || {};
    const n = COUNT(), now = Date.now(), W = WV();
    const live = [...Array(n).keys()].filter((i) => W[i] && !OFF()[i]);
    live.forEach((i) => { if (!RL.start[i]) RL.start[i] = now; });
    if (PERF.trim && api.paTrim && now - trimLast >= 10 * 60000) { trimLast = now; api.paTrim(live.map((i) => wcId(W[i])).filter(Boolean)).catch(() => {}); }
    if (now - RL.last < 10 * 60000) return;                 // una recarga cada 10 min como mucho
    const reload = (i, why) => {
      const arr = (RL.per[i] = (RL.per[i] || []).filter((t) => now - t < 3600000));
      if (arr.length >= 3) { if (!RL.paused[i]) { RL.paused[i] = 1; note('⚠️ Recarga automática pausada', `${accName(i)} sigue pasándose de memoria tras 3 recargas en una hora. Sube el límite o recárgala a mano.`); } return false; }
      arr.push(now); RL.last = now; RL.start[i] = now;
      try { W[i].reload(); } catch {}
      note('🔄 Cuenta recargada', `${accName(i)}: ${why}. No pierdes la sesión.`);
      return true;
    };
    if (PERF.auto && api.paMem) {
      const mem = await api.paMem(live.map((i) => wcId(W[i]))).catch(() => []);
      for (let k = 0; k < live.length; k++) if (mem[k] > PERF.mb && reload(live[k], `usaba ${mem[k]} MB (límite ${PERF.mb} MB)`)) return;
    }
    if (PERF.hours > 0) for (const i of live) if (now - RL.start[i] >= PERF.hours * 3600000 && reload(i, `recarga programada cada ${PERF.hours} h`)) return;
  }
  setInterval(perfTick, 60000);
  function addPerfOptions() {
    if (document.getElementById('paPerfOpt')) return true;
    const secs = [...document.querySelectorAll('#ehOptionList .eh-opt-section')];
    if (!secs.length) return false;
    const sec = secs.find((x) => /rendimiento|gr[aá]ficos/i.test(x.querySelector('h3')?.textContent || '')) || secs[0];
    const box = document.createElement('div');
    box.id = 'paPerfOpt'; box.className = 'pa-optbox';
    box.innerHTML = `<div class="pa-opth">MEMORIA</div>
      <label class="pa-opt"><span class="pa-optt"><b>Limpiar memoria</b><small>Cada 10 minutos libera memoria de cada cuenta sin recargarla. Recomendado.</small></span><input type="checkbox" class="pa-sw" data-k="trim"></label>
      <label class="pa-opt"><span class="pa-optt"><b>Recargar si se pasa de memoria</b><small>Si una cuenta gasta más del límite, se recarga sola (no pierdes la sesión).</small><span class="pa-optn">límite <input type="number" min="800" max="16000" step="100" data-n="mb"> MB</span></span><input type="checkbox" class="pa-sw" data-k="auto"></label>
      <label class="pa-opt"><span class="pa-optt"><b>Recarga programada</b><small>Recarga cada cuenta cada cierto tiempo para que no acumule memoria. 0 = nunca.</small></span><span class="pa-optn">cada <input type="number" min="0" max="48" data-n="hours"> h</span></label>
      <p class="pa-optnote">Como mucho se recarga una cuenta cada 10 minutos y 3 veces por hora. Si aun así se pasa, la recarga automática se pausa y te avisa.</p>`;
    box.querySelectorAll('[data-k]').forEach((c) => { c.checked = !!PERF[c.dataset.k]; c.onchange = () => { PERF[c.dataset.k] = c.checked; if (c.dataset.k === 'auto') RL.paused = {}; savePerf(); }; });
    box.querySelectorAll('[data-n]').forEach((c) => { c.value = PERF[c.dataset.n]; c.onchange = () => { const k = c.dataset.n, lo = k === 'mb' ? 800 : 0, hi = k === 'mb' ? 16000 : 48; PERF[k] = Math.max(lo, Math.min(hi, Math.round(+c.value) || 0)); c.value = PERF[k]; savePerf(); }; });
    sec.appendChild(box);
    return true;
  }

  // ---------------- estilos ----------------
  const css = document.createElement('style');
  css.textContent = `
.pa-modal{position:fixed;inset:0;z-index:99990;background:rgba(3,6,14,.72);display:flex;align-items:center;justify-content:center}.pa-modal[hidden]{display:none}
.pa-box{background:linear-gradient(180deg,#121b31,#0d1426);border:1px solid #22355c;border-radius:16px;width:min(760px,94vw);max-height:90vh;display:flex;flex-direction:column;color:#e2e8f0;box-shadow:0 20px 60px rgba(0,0,0,.6);font:13px/1.4 "Segoe UI",system-ui,sans-serif}
.pa-box.wide{width:min(1180px,96vw)}.pa-box>header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #1e293b}.pa-box>header b{font-size:16px}
.pa-x{background:none;border:0;color:#94a3b8;font-size:18px;cursor:pointer}.pa-body{overflow:auto;padding:14px 16px}
.pa-mut{color:#94a3b8}.pa-note{background:#0f1a2e;border:1px solid #1e2c48;border-radius:10px;padding:8px 11px;color:#b6c2d6;font-size:12px}.pa-empty{color:#94a3b8;text-align:center;padding:30px}
.pa-spr{width:40px;height:40px;object-fit:contain;image-rendering:pixelated}.pa-spr.sm{width:30px;height:30px}.pa-sprl{width:76px;height:76px;object-fit:contain;image-rendering:pixelated}.pa-nospr{display:inline-grid;place-items:center;width:40px;height:40px;color:#475569}
.pa-ty{font-size:10px;font-weight:800;padding:1px 6px;border-radius:6px;background:#475569;color:#fff;margin-right:3px}
.pa-ty-FIRE{background:#ef4444}.pa-ty-WATER{background:#3b82f6}.pa-ty-GRASS{background:#22c55e}.pa-ty-ELECTRIC{background:#facc15;color:#1f2937}.pa-ty-ICE{background:#67e8f9;color:#0f172a}.pa-ty-FIGHTING{background:#b91c1c}.pa-ty-POISON{background:#a855f7}.pa-ty-GROUND{background:#ca8a04}.pa-ty-FLYING{background:#818cf8}.pa-ty-PSYCHIC{background:#ec4899}.pa-ty-BUG{background:#84cc16}.pa-ty-ROCK{background:#a8a29e;color:#1f2937}.pa-ty-GHOST{background:#6d28d9}.pa-ty-DRAGON{background:#4f46e5}.pa-ty-DARK{background:#334155}.pa-ty-STEEL{background:#64748b}.pa-ty-FAIRY{background:#f9a8d4;color:#1f2937}
.pa-rar{font-size:11px;font-weight:800;padding:2px 7px;border-radius:7px;color:#fff;background:#475569}.pa-rar-Mítica{background:#7c3aed}.pa-rar-Legendaria{background:#d97706}.pa-rar-Anciana{background:#0891b2}.pa-rar-Divina{background:#db2777}.pa-rar-Épica{background:#9333ea}.pa-rar-Rara{background:#2563eb}
.pa-xp{color:#60a5fa}.pa-gold{color:#facc15}
/* modo simple */
.pa-low{padding:14px}.pa-tot{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:12px}.pa-tot>div,.pa-nums>div{background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:8px 10px}
.pa-tot small,.pa-nums small{display:block;color:#94a3b8;font-size:10.5px;text-transform:uppercase;letter-spacing:.4px}.pa-tot b{font-size:20px}.pa-tot b span{color:#64748b;font-size:12px}
.pa-cards{display:flex;flex-direction:column;gap:10px}.pa-card{display:grid;grid-template-columns:260px 1fr 240px;gap:14px;background:linear-gradient(160deg,#18243f,#111a2e);border:1px solid #22355c;border-radius:14px;padding:12px;cursor:pointer;color:#e2e8f0}
.pa-card:hover{border-color:#3b82f6}.pa-card.warn{border-color:#a16207}.pa-left{display:flex;gap:12px;align-items:center}.pa-av{width:86px;height:86px;border-radius:14px;background:#0b1220;border:1px solid #22355c;display:grid;place-items:center}
.pa-dn{font-size:17px;font-weight:800;display:flex;align-items:center;gap:7px}.pa-dot{width:9px;height:9px;border-radius:50%;background:#64748b}.pa-dot.on{background:#22c55e}.pa-dl{color:#cbd5e1}.pa-ds{color:#94a3b8;font-size:12px}.pa-ds.bad{color:#fbbf24}
.pa-hp{height:5px;background:#1e293b;border-radius:3px;overflow:hidden;margin-top:5px}.pa-hp i{display:block;height:100%;background:#22c55e}.pa-hp i.low{background:#ef4444}
.pa-bar{height:7px;background:#1e293b;border-radius:4px;overflow:hidden}.pa-bar i{display:block;height:100%;background:linear-gradient(90deg,#2563eb,#22d3ee)}.pa-lvt{display:flex;justify-content:space-between;font-size:12px;color:#cbd5e1;margin:3px 0 6px}
.pa-nums{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}.pa-nums b{font-size:15px}
.pa-right small{color:#94a3b8;font-size:11px;text-transform:uppercase}.pa-rec{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}.pa-rc{display:flex;flex-direction:column;align-items:center;background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:2px 4px}.pa-rc.sh{border-color:#facc15}.pa-rc small{font-size:10px;color:#2dd4bf}
.pa-divb{background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:6px 9px;margin:0 0 6px}.pa-divh{display:flex;align-items:center;gap:7px;flex-wrap:wrap;font-size:12px;color:#cbd5e1}
.pa-ivt{color:#2dd4bf;font-size:15px}.pa-ivt span{color:#64748b;font-size:11px}.pa-ok{margin-left:auto;color:#4ade80;font-size:11px}.pa-est{margin-left:auto;color:#fbbf24;font-size:11px}
.pa-ivrow{display:grid;grid-template-columns:repeat(6,1fr);gap:5px;margin-top:5px}.pa-ivs{text-align:center}.pa-ivs small{display:block;font-size:10px;font-weight:800}.pa-ivs b{font-size:13px}.pa-ivs b span{color:#64748b;font-size:10px}.pa-ivs em{display:block;font-style:normal;font-size:10px;color:#fbbf24}
.pa-ivs i{display:block;height:4px;background:#1e293b;border-radius:2px;overflow:hidden;margin-top:2px}.pa-ivs i u{display:block;height:100%}
/* tarjetas del menú lateral */
#ehAccountList{display:flex;flex-direction:column;gap:8px}
.pa-acc{display:block;width:100%;text-align:left;background:linear-gradient(170deg,#16223c,#0e1628);border:1px solid #22355c;border-radius:14px;padding:10px;color:#e2e8f0;cursor:pointer;font:12px/1.35 "Segoe UI",system-ui,sans-serif}
.pa-acc:hover,.pa-acc.active{border-color:#3b82f6}.pa-acc.off{opacity:.7}
.pa-acch{display:flex;gap:10px;align-items:center}.pa-accav{width:60px;height:60px;flex:none;border-radius:12px;border:1px solid #2a3c62;display:grid;place-items:center}.pa-accav.sh{border-color:#facc15;box-shadow:0 0 10px rgba(250,204,21,.35)}
.pa-accspr{width:56px;height:56px;object-fit:contain;image-rendering:pixelated}.pa-accw{min-width:0}.pa-accn{display:flex;align-items:center;gap:6px;font-size:15px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pa-accl{color:#e2e8f0;font-weight:600;margin:1px 0 3px}.pa-accbar{height:6px;background:#1e293b;border-radius:3px;overflow:hidden;margin-top:8px}.pa-accbar i{display:block;height:100%;background:linear-gradient(90deg,#2563eb,#22d3ee)}.pa-accbar.tr i{background:linear-gradient(90deg,#b45309,#facc15)}
.pa-accrow{display:flex;flex-wrap:wrap;justify-content:space-between;column-gap:6px;color:#cbd5e1;font-size:10.5px;margin-top:2px}.pa-accrow span:last-child{margin-left:auto;font-weight:700}
.pa-acchunt{color:#fca5a5;margin:6px 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pa-acctip{background:#13213f;border:1px solid #2f4a80;border-radius:9px;padding:5px 8px;color:#dbeafe;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pa-acctip.good{background:#10291b;border-color:#16a34a;color:#bbf7d0}
.pa-accnums{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:7px}.pa-accnums>div{background:#0b1220;border:1px solid #1e293b;border-radius:8px;padding:4px 6px}.pa-accnums small{display:block;color:#94a3b8;font-size:9.5px}.pa-accnums b{font-size:13px}
.pa-neg{color:#f87171}.pa-accfoot{display:flex;gap:10px;margin-top:6px;color:#cbd5e1}.pa-accfoot span:nth-child(2){color:#facc15}.pa-accfoot span:nth-child(3){color:#c4b5fd}
/* Nexus 1.0.9: tarjetas más pequeñas, siempre completas y sin plegarse */
#ehAccountList{gap:5px!important}
#ehAccountList .pa-acc{padding:6px 7px!important;border-radius:10px!important;font-size:10px!important;line-height:1.2!important}
#ehAccountList .pa-acch{gap:6px!important}
#ehAccountList .pa-accav{width:38px!important;height:38px!important;border-radius:8px!important}
#ehAccountList .pa-accspr{width:35px!important;height:35px!important}
#ehAccountList .pa-accn{font-size:12px!important;gap:4px!important}
#ehAccountList .pa-accl{font-size:10px!important;margin:0!important}
#ehAccountList .pa-accbar{height:4px!important;margin-top:4px!important}
#ehAccountList .pa-accrow{font-size:9px!important;margin-top:1px!important}
#ehAccountList .pa-acchunt{margin:3px 0!important;font-size:10px!important}
#ehAccountList .pa-acctip{padding:3px 5px!important;border-radius:6px!important;font-size:9px!important}
#ehAccountList .pa-accnums{gap:3px!important;margin-top:4px!important}
#ehAccountList .pa-accnums>div{padding:3px 4px!important;border-radius:5px!important}
#ehAccountList .pa-accnums small{font-size:8px!important}
#ehAccountList .pa-accnums b{font-size:10px!important}
#ehAccountList .pa-accfoot{gap:7px!important;margin-top:3px!important;font-size:9px!important}
/* opción de anuncios */
.pa-opt{display:flex!important;align-items:center;gap:14px;background:#0f172a;border:1px solid #1e293b;border-radius:11px;padding:10px 14px!important;cursor:pointer}
.pa-optt{flex:1;display:flex;flex-direction:column;gap:2px}.pa-optt b{font-size:14px;color:#f1f5f9}.pa-optt small{color:#94a3b8;font-size:12px}
input.pa-sw{appearance:none;-webkit-appearance:none;width:42px!important;min-height:0!important;height:24px;border-radius:12px;background:#334155;position:relative;flex:none;cursor:pointer;margin:0!important;transition:background .15s}
input.pa-sw::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s}input.pa-sw:checked{background:#22c55e}input.pa-sw:checked::after{transform:translateX(18px)}
.pa-optbox{display:flex;flex-direction:column;gap:7px;min-height:0!important}.pa-opth{color:#93c5fd;font-size:12px;font-weight:800;letter-spacing:.6px;margin-top:6px}
.pa-optn{display:inline-flex;align-items:center;gap:6px;color:#94a3b8;font-size:12px;margin-top:4px;white-space:nowrap}.pa-optn input{width:74px!important;min-height:0!important;background:#0a1224;border:1px solid #22355c;color:#e2e8f0;border-radius:7px;padding:4px 7px}
.pa-optnote{color:#94a3b8;font-size:12px;margin:2px 0 0}
/* calculadora */
.pa-ivwrap{display:grid;grid-template-columns:300px minmax(0,1fr);gap:14px}.pa-ivform h4,.pa-body h4{margin:8px 0 6px;color:#93c5fd;font-size:12px;text-transform:uppercase;letter-spacing:.5px}
.pa-ivform input,.pa-ivform select,.pa-simhead select,.pa-simhead input{background:#0a1224;border:1px solid #22355c;color:#e2e8f0;border-radius:8px;padding:6px 9px}.pa-ivform>input{width:100%}
.pa-ivpick{display:flex;gap:6px}.pa-ivpick>*{flex:1;min-width:0}.pa-ivmine{max-height:50vh;overflow:auto;display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
.pa-mon{display:flex;align-items:center;gap:5px;background:#0f172a;border:1px solid #1e293b;border-radius:9px;padding:3px 8px;color:#e2e8f0;cursor:pointer;text-align:left}.pa-mon.on{border-color:#22c55e;background:#10291b}.pa-mon small{display:block;color:#94a3b8;font-size:10.5px}
.pa-chk{display:flex;gap:6px;align-items:flex-start;margin:8px 0;font-size:12px}.pa-ivout{background:linear-gradient(160deg,#18243f,#121b31);border:1px solid #22355c;border-radius:14px;padding:14px;min-width:0}
.pa-ivh{display:flex;align-items:center;gap:8px}.pa-ivh b{font-size:18px}.pa-types{margin:6px 0 8px}.pa-tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.pa-tiles>div{background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:8px 10px;min-width:0}
.pa-tiles small,.pa-sub{color:#94a3b8;font-size:10.5px;letter-spacing:.5px}.pa-tiles input{width:100%;background:#0b1220;border:1px solid #334155;color:#fff;border-radius:6px;padding:5px 8px;font-size:16px;font-weight:700;margin-top:4px}.pa-tiles b{display:block;font-size:20px;margin-top:6px}
.pa-ring{display:flex;align-items:center;gap:14px;background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:10px 14px;margin:10px 0}.pa-ring .ring{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;position:relative}.pa-ring .ring::before{content:'';position:absolute;inset:6px;background:#0f172a;border-radius:50%}.pa-ring .ring span{position:relative;font-weight:800}.pa-ring b{color:#4ade80;font-size:17px;display:block}.pa-ring small{color:#94a3b8}
.pa-sub{margin:12px 0 6px;text-transform:uppercase}.pa-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.pa-st{background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:8px 10px;min-width:0}.pa-st .h{display:flex;justify-content:space-between;font-size:12px}.pa-st .h span{color:#94a3b8}.pa-st .h span b{color:#2dd4bf}
.pa-st .bar{height:5px;background:#1e293b;border-radius:3px;overflow:hidden;margin:5px 0 6px}.pa-st .bar i{display:block;height:100%}.pa-st label{display:flex;align-items:center;gap:6px;font-size:11px;color:#94a3b8;margin:3px 0}.pa-st input{flex:1;min-width:0;background:#0b1220;border:1px solid #334155;color:#fff;border-radius:6px;padding:3px 7px}
.pa-moves>div{display:flex;align-items:center;gap:8px;background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:5px 10px;margin-bottom:4px}.pa-moves .pw{margin-left:auto;color:#fb923c;font-weight:700}.pa-foot{display:flex;gap:6px;margin-top:10px;font-size:12px}.pa-foot .pa-mut{margin-left:auto}
/* gimnasios */
.pa-held{margin:7px 0 5px;padding:6px 9px;border:1px solid #334155;border-radius:8px;background:#142035;color:#cbd5e1;font-size:12px}.pa-held b{color:#facc15}.pa-held.unknown b{color:#94a3b8}
.pa-gytype-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0 10px;max-height:150px;overflow:auto}
.pa-gytype-tabs button{border:1px solid #334155;border-radius:7px;padding:4px 7px;background:#101c33;color:#cbd5e1;font-size:11px;cursor:pointer}
.pa-gytype-tabs button.on{background:#263e68;border-color:#60a5fa;color:#fff}
.pa-gwrap{display:grid;grid-template-columns:230px minmax(0,1fr);gap:14px}.pa-glist{display:flex;flex-direction:column;gap:5px}.pa-sec{color:#93c5fd;font-size:11px;text-transform:uppercase;margin:8px 0 2px}
.pa-gbtn{display:flex;flex-direction:column;align-items:flex-start;background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:7px 10px;color:#e2e8f0;cursor:pointer;text-align:left}.pa-gbtn small{color:#fbbf24}.pa-gbtn.on{border-color:#3b82f6;background:#13254a}.pa-gbtn.conq{background:linear-gradient(180deg,#3b2a0b,#2a1d07);border-color:#a16207}.pa-gbtn.conq.on{border-color:#facc15}
.pa-ghead{display:flex;flex-direction:column;gap:2px;margin-bottom:6px}.pa-ghead b{font-size:16px}.pa-ghead span{color:#cbd5e1}.pa-live{color:#86efac;font-size:12px;margin:4px 0 8px}.pa-live.rec{color:#fca5a5}
.pa-tabs{display:flex;gap:6px;margin:6px 0}.pa-tabs button{padding:6px 12px;border-radius:8px;background:#0f172a;border:1px solid #1e293b;color:#e2e8f0;cursor:pointer;text-transform:capitalize}.pa-tabs button.on{border-color:#facc15;color:#facc15}.pa-tabs button:disabled{opacity:.4}
.pa-team{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}.pa-gmon{background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:10px}.pa-gmon .top{display:flex;align-items:center;gap:6px}.pa-gmon .top b{font-size:15px}.pa-gmon .hp{margin-left:auto;color:#4ade80;font-weight:700}.pa-gmon .hp small{color:#94a3b8}
.pa-gmon .qual{display:flex;gap:8px;align-items:center;margin:6px 0;flex-wrap:wrap}.pa-mis{color:#fbbf24;font-size:11.5px;margin-bottom:4px}.pa-gmon .stats{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin:6px 0}.pa-gmon .stats>div{background:#0b1220;border:1px solid #1e293b;border-radius:7px;text-align:center;padding:3px}.pa-gmon .stats>div.mis{border-color:#b45309}
.pa-gmon .stats small{display:block;color:#94a3b8;font-size:10px}.pa-gmon .stats i{display:block;font-style:normal;font-size:10px;color:#4ade80}.pa-gmon .mv{display:flex;align-items:center;gap:6px;font-size:12px;padding:2px 0}.pa-gmon .mv span{margin-left:auto;color:#fb923c}
.pa-cg{background:#0b1324;border:1px solid #1e293b;border-radius:12px;padding:10px 12px;margin:8px 0}.pa-cg .h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}.pa-cg .h>span{margin-left:auto;color:#cbd5e1}
.pa-go{background:linear-gradient(180deg,#16a34a,#15803d);border:1px solid #16a34a;color:#fff;border-radius:9px;padding:6px 12px;font-weight:700;cursor:pointer}.pa-go.sm{padding:5px 10px;font-size:12.5px}.pa-go:disabled{opacity:.5}
.pa-simbox{background:#0b1324;border:1px solid #22355c;border-radius:12px;padding:10px 12px;margin:8px 0}.pa-simhead{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pa-simhead input{width:60px}.pa-simroster{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0;max-height:220px;overflow:auto}
.pa-simsum{display:flex;align-items:center;gap:12px;border-radius:10px;padding:10px 14px;margin:6px 0}.pa-simsum.good{background:#10291b;border:1px solid #16a34a}.pa-simsum.bad{background:#2a1608;border:1px solid #b45309}.pa-simsum b{font-size:26px;color:#facc15}
.pa-simacc{display:inline-block;margin-top:2px;font-size:10px!important;color:#93c5fd!important;background:#13264a;border-radius:5px;padding:0 5px}
.pa-berry{margin:8px 0 4px;padding:8px 10px;background:#0d1729;border:1px solid #3b2346;border-radius:10px}.pa-bh{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;margin-bottom:6px}.pa-bh b{color:#f9a8d4}.pa-bh input{width:52px;background:#0a1224;border:1px solid #22355c;color:#e2e8f0;border-radius:7px;padding:3px 6px}
.pa-bl{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:5px}.pa-bm{display:flex;align-items:center;gap:6px;background:#101c33;border:1px solid #1f3053;border-radius:9px;padding:3px 7px;min-width:0}.pa-bm.on{border-color:#9d3a75}.pa-bm b{min-width:70px;font-size:12px}.pa-bm select{flex:1;min-width:0;width:100%;background:#0a1224;border:1px solid #22355c;color:#e2e8f0;border-radius:6px;padding:3px 5px;font-size:12px}.pa-simbl{margin:5px 0;font-size:12px;color:#f9a8d4}
.pa-simbats details{background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:4px 10px;margin:4px 0}.pa-simbats ol{margin:4px 0 4px 18px;padding:0;font-size:12px}
`;
  document.head.appendChild(css);

  // ---------------- conexión con Nexus ----------------
  window.PA = { refreshLow, openIv, openGyms, loadSpecies, renderAccounts };
  const hook = () => {
    // calculadora: los botones de Nexus abren la nuestra
    for (const id of ['paStandaloneCalculatorBtn']) { const b = document.getElementById(id); if (b) b.onclick = (e) => { e.preventDefault(); openIv(); }; }
    // Gimnasios ahora está dentro de Herramientas; retirar el botón lateral anterior.
    document.getElementById('paGymBtn')?.remove();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook); else hook();
  setTimeout(hook, 1500);
  hookAds();
  (function tryOpt(n) { const a = addAdsOption(), b = addPerfOptions(); if (!(a && b) && n < 20) setTimeout(() => tryOpt(n + 1), 1000); })(0);
  setTimeout(() => loadSpecies(), 15000);
})();
