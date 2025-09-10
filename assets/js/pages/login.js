import { getSupa } from '../services/supabaseClient.js';
import { state } from '../core/state.js';

function el(tag, cls){ const e = document.createElement(tag); if(cls) e.className = cls; return e; }

async function recordLoginAttempt(payload){
  try{
    const supa = await getSupa();
    await supa.from('login_attempts').insert(payload);
  }catch(e){
  }
}

export function renderLogin(){
  if(state.session){
    if(location.hash !== '#/admin-panel') location.hash = '#/admin-panel';
    const redirecting = el('div', 'card');
    redirecting.textContent = 'Redirigiendo...';
    return redirecting;
  }

  const container = el('div', 'grid cols-2');

  const card = el('div', 'card');
  const title = el('h2'); title.textContent = 'Acceso';
  const desc = el('p'); desc.className = 'helper'; desc.textContent = 'DOXXING SERVICES';

  const form = el('form');
  form.innerHTML = `
    <label class="label">Email</label>
    <input required type="email" class="input" name="email" placeholder="usuario@dominio.com" />
    <label class="label mt-2">Contraseña</label>
    <input required type="password" class="input" name="password" placeholder="••••••••" />
    <div class="row space-between mt-2">
      <button class="btn" type="submit">Entrar</button>
      <button class="btn ghost" type="button" id="logoutBtn">Salir</button>
    </div>
    <div class="helper mt-2" id="loginMsg"></div>
  `;

  form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const fd = new FormData(form);
    const email = String(fd.get('email')).trim();
    const password = String(fd.get('password'));
    const msg = document.getElementById('loginMsg');
    msg.textContent = 'Verificando...';

    const start = Date.now();
    const supa = await getSupa();
    const { data, error } = await supa.auth.signInWithPassword({ email, password });
    const duration = Date.now() - start;

    await recordLoginAttempt({ email, ok: !error, message: error?.message || 'ok', duration_ms: duration, ts: new Date().toISOString() });

    if(error){ msg.textContent = 'Error: ' + error.message; return; }
    state.session = data.session;
    msg.textContent = 'Acceso correcto';
    location.hash = '#/admin-panel';
  });

  card.append(title, desc, form);

  const info = el('div', 'card');
  info.innerHTML = `
    <h3>Estado de sesión</h3>
    <p class="helper">Sesión actual: <code id="sess">-</code></p>
  `;

  container.append(card, info);

  const sess = info.querySelector('#sess');
  const update = ()=>{ sess.textContent = state.session ? 'Activa' : 'No iniciada'; };
  update();
  window.addEventListener('auth:changed', update);

  const redirectOnAuth = (e)=>{
    const session = e?.detail?.session || state.session;
    if(session){
      if(location.hash === '#/login') location.hash = '#/admin-panel';
    }
  };
  window.addEventListener('auth:changed', redirectOnAuth);

  const logoutBtn = form.querySelector('#logoutBtn');
  logoutBtn.addEventListener('click', async ()=>{
    const supa = await getSupa();
    await supa.auth.signOut();
  });

  return container;
}
