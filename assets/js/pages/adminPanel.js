import { getSupa } from '../services/supabaseClient.js';
import { state, setSiteParams } from '../core/state.js';

function el(tag, cls){ const e = document.createElement(tag); if(cls) e.className = cls; return e; }

function groupByPeriod(rows, period){
  const fmt = (d)=>{
    const dt = new Date(d);
    if(period==='day') return dt.toISOString().slice(0,10);
    if(period==='week'){
      const tmp = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()));
      const day = tmp.getUTCDay()||7; tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
      const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(),0,1));
      const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1)/7);
      return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2,'0')}`;
    }
    if(period==='month') return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth()+1).padStart(2,'0')}`;
    return 'unknown';
  };
  const map = new Map();
  for(const r of rows){
    const k = fmt(r.ts || r.created_at || r.inserted_at || r.timestamp || Date.now());
    map.set(k, (map.get(k)||0)+1);
  }
  return Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
}

async function fetchLoginAttempts(){
  try{
    const supa = await getSupa();
    const { data, error } = await supa.from('login_attempts').select('*').order('ts', { ascending:false }).limit(200);
    if(error) throw error;
    return data || [];
  }catch(e){ return []; }
}

async function fetchUsers(){
  try{
    const supa = await getSupa();
    const { data, error } = await supa.from('users').select('*').limit(200);
    if(error) throw error;
    return data || [];
  }catch(e){ return []; }
}

export function renderAdminPanel(){
  if(!state.session){
    const warn = el('div','card');
    warn.innerHTML = '<h3>Requiere sesión</h3><p class="helper">Por favor inicia sesión para acceder al panel.</p>';
    return warn;
  }

  const container = el('div','grid cols-2');

  // Site params
  const siteCard = el('div','card');
  siteCard.innerHTML = `
    <h3>Parámetros del sitio</h3>
    <label class="label">Título</label>
    <input class="input" id="siteTitle" value="${state.site.title}"/>
    <label class="label mt-2">Subtítulo</label>
    <input class="input" id="siteSubtitle" value="${state.site.subtitle}"/>
    <label class="label mt-2">Descripción</label>
    <textarea class="input" id="siteDesc">${state.site.description}</textarea>
    <div class="row mt-2">
      <button class="btn" id="saveSite">Guardar</button>
      <button class="btn ghost" id="loadSite">Cargar</button>
      <span class="helper" id="siteMsg"></span>
    </div>
  `;
  siteCard.querySelector('#saveSite').addEventListener('click', async()=>{
    const title = siteCard.querySelector('#siteTitle').value.trim();
    const subtitle = siteCard.querySelector('#siteSubtitle').value.trim();
    const description = siteCard.querySelector('#siteDesc').value.trim();
    setSiteParams({ title, subtitle, description });
    const msg = siteCard.querySelector('#siteMsg');
    msg.textContent = 'Guardando...';
    try{
      const supa = await getSupa();
      const row = { id: 1, title, subtitle, description, updated_at: new Date().toISOString() };
      const { error } = await supa.from('site_settings').upsert(row, { onConflict:'id' });
      if(error) throw error;
      msg.textContent = 'Guardado.';
    }catch(e){ msg.textContent = 'Error al guardar'; }
  });
  siteCard.querySelector('#loadSite').addEventListener('click', async()=>{
    const msg = siteCard.querySelector('#siteMsg');
    msg.textContent = 'Cargando...';
    try{
      const supa = await getSupa();
      const { data, error } = await supa.from('site_settings').select('*').eq('id',1).single();
      if(error) throw error;
      if(data){
        setSiteParams({ title:data.title||state.site.title, subtitle:data.subtitle||state.site.subtitle, description:data.description||state.site.description });
        siteCard.querySelector('#siteTitle').value = state.site.title;
        siteCard.querySelector('#siteSubtitle').value = state.site.subtitle;
        siteCard.querySelector('#siteDesc').value = state.site.description;
      }
      msg.textContent = 'Cargado.';
    }catch(e){ msg.textContent = 'No se pudo cargar'; }
  });

  const usersCard = el('div','card');
  usersCard.innerHTML = `
    <h3>Usuarios</h3>
    <div class="helper">Listado de usuarios (tabla "users").</div>
    <table class="table" id="usersTbl">
      <thead><tr><th>Email</th><th>Nombre</th><th>Rol</th></tr></thead>
      <tbody></tbody>
    </table>
  `;

  const logsCard = el('div','card');
  logsCard.innerHTML = `
    <h3>Intentos de inicio de sesión</h3>
    <div class="row mt-1">
      <button class="btn ghost" data-range="day">Diario</button>
      <button class="btn ghost" data-range="week">Semanal</button>
      <button class="btn ghost" data-range="month">Mensual</button>
    </div>
    <div class="grid cols-3 mt-2" id="agg"></div>
    <table class="table mt-2" id="logsTbl">
      <thead><tr><th>Fecha</th><th>Email</th><th>OK</th><th>Mensaje</th><th>Duración (ms)</th></tr></thead>
      <tbody></tbody>
    </table>
  `;

  const activityCard = el('div','card');
  activityCard.innerHTML = `
    <h3>Actividad por hora</h3>
    <div class="helper">Registros recientes por hora del día (tabla user_activity)</div>
    <div class="grid cols-3 mt-2" id="hours"></div>
  `;

  container.append(siteCard, usersCard, logsCard, activityCard);

  fetchUsers().then(users=>{
    const tbody = usersCard.querySelector('tbody');
    tbody.innerHTML = users.map(u=>`<tr><td>${u.email||''}</td><td>${u.name||u.full_name||''}</td><td>${u.role||''}</td></tr>`).join('');
  });

  let logs = [];
  const renderAgg = (period)=>{
    const items = groupByPeriod(logs, period);
    const agg = logsCard.querySelector('#agg');
    agg.innerHTML = items.map(([k,v])=>`<div class="card"><div class="helper">${k}</div><div style="font-size:22px;font-weight:700">${v}</div></div>`).join('');
  };

  fetchLoginAttempts().then(data=>{
    logs = data;
    const tbody = logsCard.querySelector('#logsTbl tbody');
    tbody.innerHTML = logs.map(r=>`<tr><td>${r.ts||''}</td><td>${r.email||''}</td><td>${r.ok? '✔' : '✖'}</td><td>${r.message||''}</td><td>${r.duration_ms||''}</td></tr>`).join('');
    renderAgg('day');
  });

  logsCard.querySelectorAll('button[data-range]').forEach(btn=>{
    btn.addEventListener('click', ()=>renderAgg(btn.dataset.range));
  });

  // Populate activity by hour
  (async()=>{
    try{
      const supa = await getSupa();
      const since = new Date(Date.now() - 1000*60*60*24*7).toISOString();
      const { data, error } = await supa.from('user_activity').select('hour').gte('ts', since).limit(2000);
      if(error) throw error;
      const counts = new Array(24).fill(0);
      for(const r of (data||[])) if(typeof r.hour === 'number') counts[r.hour]++;
      const wrap = activityCard.querySelector('#hours');
      wrap.innerHTML = counts.map((v,i)=>`<div class="card"><div class="helper">${String(i).padStart(2,'0')}:00</div><div style="font-size:22px;font-weight:700">${v}</div></div>`).join('');
    }catch(e){ /* silent */ }
  })();

  return container;
}
