import { whoisLookupGET, whoisLookupPOST } from '../services/whoisService.js';
import { searchSocial, iconSVG } from '../services/socialSearch.js';

function el(tag, cls){ const e = document.createElement(tag); if(cls) e.className = cls; return e; }

function pre(obj){ const p = document.createElement('pre'); p.style.whiteSpace='pre-wrap'; p.style.maxHeight='420px'; p.style.overflow='auto'; p.textContent = typeof obj === 'string' ? obj : JSON.stringify(obj,null,2); return p; }

export function renderHFunctions(){
  const container = el('div','grid cols-2');

  // Whois Lookup
  const whoisCard = el('div','card');
  whoisCard.innerHTML = `
    <h3>YEHZ Website API — Whois Lookup</h3>
    <label class="label">Dominio</label>
    <input class="input" id="domain" placeholder="google.com" value="google.com" />
    <div class="row mt-2">
      <button class="btn" id="btnGet">Consultar (GET)</button>
      <button class="btn ghost" id="btnPost">Consultar (POST)</button>
    </div>
    <div class="mt-2 helper">Muestra JSON devuelto por WhoisXML</div>
    <div class="mt-2" id="whoisOut"></div>
  `;
  const whoisOut = whoisCard.querySelector('#whoisOut');
  whoisCard.querySelector('#btnGet').addEventListener('click', async()=>{
    whoisOut.innerHTML = 'Cargando...';
    try{ const res = await whoisLookupGET(whoisCard.querySelector('#domain').value.trim()); whoisOut.innerHTML=''; whoisOut.append(pre(res)); }
    catch(e){ whoisOut.textContent = 'Error: ' + e.message; }
  });
  whoisCard.querySelector('#btnPost').addEventListener('click', async()=>{
    whoisOut.innerHTML = 'Cargando...';
    try{ const res = await whoisLookupPOST(whoisCard.querySelector('#domain').value.trim()); whoisOut.innerHTML=''; whoisOut.append(pre(res)); }
    catch(e){ whoisOut.textContent = 'Error: ' + e.message; }
  });

  // Social Search
  const socialCard = el('div','card');
  socialCard.innerHTML = `
    <h3>Buscador de Redes Sociales</h3>
    <label class="label">Usuario o identificador</label>
    <input class="input" id="username" placeholder="usuario" value="google" />
    <div class="row mt-2"><button class="btn" id="btnSearch">Buscar</button></div>
    <div class="mt-2 helper">Resultados en ~20 plataformas públicas.</div>
    <div class="mt-2 social-list" id="socialList"></div>
  `;
  const list = socialCard.querySelector('#socialList');
  socialCard.querySelector('#btnSearch').addEventListener('click', async()=>{
    list.innerHTML = '<div class="helper">Buscando...</div>';
    const username = socialCard.querySelector('#username').value.trim();
    try{
      const rows = await searchSocial(username);
      list.innerHTML = rows.map(r=>{
        const status = r.exists ? `<span class="status-ok">Existe</span>` : `<span class="status-miss">No existe</span>`;
        return `
          <a class="social-item" href="${r.url}" target="_blank" rel="noopener noreferrer">
            <span class="icon">${iconSVG(r.platform)}</span>
            <div>
              <div style="font-weight:600">${r.name}</div>
              <div class="helper">${status} • ${r.url}</div>
            </div>
          </a>
        `;
      }).join('');
    }catch(e){ list.innerHTML = `<div class="helper">Error: ${e.message}</div>`; }
  });

  container.append(whoisCard, socialCard);
  return container;
}
