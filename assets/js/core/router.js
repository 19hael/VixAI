import { renderLogin } from '../pages/login.js';
import { renderAdminPanel } from '../pages/adminPanel.js';
import { renderAdministration } from '../pages/administration.js';
import { renderFunctions } from '../pages/functions.js';
import { renderHFunctions } from '../pages/hFunctions.js';
import { renderLPremium } from '../pages/lPremium.js';
import { state } from './state.js';

const routes = {
  '': renderLogin,
  '#/login': renderLogin,
  '#/admin-panel': renderAdminPanel,
  '#/administration': renderAdministration,
  '#/functions': renderFunctions,
  '#/h-functions': renderHFunctions,
  '#/l-premium': renderLPremium,
};

const protectedRoutes = new Set(['#/admin-panel', '#/administration', '#/functions', '#/h-functions', '#/l-premium']);

function render(){
  const hash = location.hash || '#/login';
  const view = document.getElementById('view');
  view.innerHTML = '';

  if(!state.session && protectedRoutes.has(hash)){
    location.hash = '#/login';
    return;
  }

  const page = routes[hash] || renderLogin;
  const el = page({ state });

  const hero = document.getElementById('hero');
  const heroOverlay = document.getElementById('hero-overlay');
  const baseOverlay = `
    <h1 class="site-title">${state.site.title}</h1>
    <p class="site-subtitle">${state.site.subtitle}</p>
  `;

  if(hash === '#/login'){
    hero.classList.add('hero-section');
    hero.style.minHeight = '68vh';
    if(heroOverlay){
      heroOverlay.innerHTML = baseOverlay;
      if(el){
        heroOverlay.appendChild(el);
      }
    }
  } else {
    hero.style.minHeight = '24vh';
    if(heroOverlay){ heroOverlay.innerHTML = baseOverlay; }
    if(el){
      el.classList.add('page');
      view.appendChild(el);
      requestAnimationFrame(()=>{ el.classList.add('page-enter-active'); });
    }
  }

  document.querySelectorAll('.nav a, .sidebar a').forEach(a=>{
    if(a.getAttribute('href') === hash) a.classList.add('active');
    else a.classList.remove('active');
  });
}

export function initRouter(){
  window.addEventListener('hashchange', render);
  window.addEventListener('auth:changed', render);
  render();
}

