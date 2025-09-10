import { initRouter } from './core/router.js';
import { state } from './core/state.js';
import { buildHeader } from './components/header.js';
import { buildFooter } from './components/footer.js';
import { initHeroLogo } from './components/heroLogo.js';
import { getSupa } from './services/supabaseClient.js';
import { buildSidebar } from './components/sidebar.js';

const $ = (s, r=document)=>r.querySelector(s);

function initAppShell(){
  const header = buildHeader();
  $('#app-header').className = 'app-header';
  $('#app-header').innerHTML = '';
  $('#app-header').append(header);

  const y = $('#year');
  if(y) y.textContent = String(new Date().getFullYear());
}

let activityTimer = null;
async function startActivityMonitor(){
  if(activityTimer) return;
  activityTimer = setInterval(async()=>{
    try{
      const supa = await getSupa();
      const user = (state.session && state.session.user) ? state.session.user : null;
      if(!user) return;
      const now = new Date();
      await supa.from('user_activity').insert({
        user_id: user.id,
        ts: now.toISOString(),
        hour: now.getHours(),
        day: now.toISOString().slice(0,10),
      });
    }catch(e){ }
  }, 60000);
}

function stopActivityMonitor(){
  if(activityTimer){
    clearInterval(activityTimer);
    activityTimer = null;
  }
}

async function initAuth(){
  const supa = await getSupa();
  const { data } = await supa.auth.getSession();
  state.session = data.session || null;
  if(state.session) startActivityMonitor(); else stopActivityMonitor();
  updateUIByAuth();
  supa.auth.onAuthStateChange((_event, session)=>{
    state.session = session;
    if(session) startActivityMonitor(); else stopActivityMonitor();
    window.dispatchEvent(new CustomEvent('auth:changed', { detail: { session } }));
    updateUIByAuth();
  });
}

function initHero(){
  const heroEl = document.getElementById('hero');
  if(heroEl){
    initHeroLogo(heroEl);
  }
}

function hideSplash(){
  const splash = document.getElementById('splash');
  if(!splash) return;
  splash.classList.add('hide');
  setTimeout(()=>{ if(splash && splash.parentNode) splash.parentNode.removeChild(splash); }, 600);
}

function mountSidebar(){
  const host = document.getElementById('app-sidebar');
  if(!host) return;
  host.innerHTML = '';
  const sb = buildSidebar();
  host.appendChild(sb);
  requestAnimationFrame(()=>{ sb.classList.add('open'); document.body.classList.add('with-sidebar'); });
}

function unmountSidebar(){
  const host = document.getElementById('app-sidebar');
  if(!host) return;
  host.innerHTML = '';
  document.body.classList.remove('with-sidebar');
}

function updateUIByAuth(){
  if(state.session) mountSidebar(); else unmountSidebar();
}

async function bootstrap(){
  initAppShell();
  await initAuth();
  const start = ()=>{
    if(state.session){
      if(location.hash !== '#/admin-panel') location.hash = '#/admin-panel';
    } else {
      if(location.hash !== '#/login') location.hash = '#/login';
    }
    initRouter();
  };
  const logo = document.querySelector('.splash-logo');
  if(logo){
    let done = false;
    logo.addEventListener('animationend', ()=>{ if(done) return; done = true; hideSplash(); start(); }, { once:true });
    setTimeout(()=>{ if(!done){ done = true; hideSplash(); start(); } }, 1400);
  } else {
    hideSplash();
    start();
  }
}

bootstrap();
