import { initHeroLogo } from '../components/heroLogo.js';

function el(tag, cls){ const e = document.createElement(tag); if(cls) e.className = cls; return e; }

export function renderLPremium(){
  const container = el('div','coming-soon');
  const canvasHost = el('div'); canvasHost.style.position='absolute'; canvasHost.style.inset='0';
  const overlay = el('div','overlay');
  const content = el('div','content');
  content.innerHTML = `
    <img src="./IMG/LOGO ND D ANIMATION.png" alt="L" style="width:84px;height:84px;filter:drop-shadow(0 0 20px rgba(229,9,20,.6))"/>
    <h2>Próximamente</h2>
    <div class="helper">Funciones Premium en desarrollo</div>
  `;
  container.append(canvasHost, overlay, content);

  setTimeout(()=>{
    initHeroLogo(canvasHost, { canvasId:'hero-canvas-premium' });
  }, 0);

  return container;
}
