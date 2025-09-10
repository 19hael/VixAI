function el(tag, cls){ const e = document.createElement(tag); if(cls) e.className = cls; return e; }

export function renderFunctions(){
  const container = el('div','grid cols-3');

  const c1 = el('div','card');
  c1.innerHTML = `
    <h3>Herramientas del Sistema</h3>
    <div class="helper">Colección base de utilidades y accesos rápidos.</div>
    <div class="grid cols-3 mt-2">
      <div class="card"><div class="helper">Generar token</div><button class="btn mt-1" id="genToken">Generar</button></div>
      <div class="card"><div class="helper">Validar URL</div><button class="btn mt-1" id="validateUrl">Validar</button></div>
      <div class="card"><div class="helper">Formatear JSON</div><button class="btn mt-1" id="formatJson">Abrir</button></div>
    </div>
  `;

  const c2 = el('div','card');
  c2.innerHTML = `
    <h3>Salida</h3>
    <pre id="out" style="white-space:pre-wrap; max-height:420px; overflow:auto"></pre>
  `;

  container.append(c1,c2);

  const out = c2.querySelector('#out');
  c1.querySelector('#genToken').addEventListener('click',()=>{
    const arr = new Uint8Array(24); crypto.getRandomValues(arr);
    const token = btoa(String.fromCharCode(...arr)).replace(/[^a-z0-9]/gi,'').slice(0,32);
    out.textContent = `Token: ${token}`;
  });
  c1.querySelector('#validateUrl').addEventListener('click',()=>{
    const url = prompt('URL a validar:','https://example.com');
    try{ const u = new URL(url); out.textContent = `Válida: ${u.href}`; }
    catch(e){ out.textContent = `Inválida: ${url}`; }
  });
  c1.querySelector('#formatJson').addEventListener('click',()=>{
    const txt = prompt('Pega tu JSON','{"ok":true}');
    try{ out.textContent = JSON.stringify(JSON.parse(txt), null, 2); }
    catch(e){ out.textContent = 'JSON inválido'; }
  });

  return container;
}
