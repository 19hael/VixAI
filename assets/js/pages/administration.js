function el(tag, cls){ const e = document.createElement(tag); if(cls) e.className = cls; return e; }
export function renderAdministration(){
  const container = el('div','grid cols-2');
  const c1 = el('div','card');
  c1.innerHTML = `
    <h3>Tareas Programadas</h3>
    <div class="grid cols-2 mt-2">
      <div class="card">
        <div class="helper">Limpieza de logs</div>
        <button class="btn mt-1" id="runClean">Ejecutar ahora</button>
      </div>
      <div class="card">
        <div class="helper">Respaldo de configuración</div>
        <button class="btn mt-1" id="runBackup">Iniciar respaldo</button>
      </div>
    </div>
  `;
  const c2 = el('div','card');
  c2.innerHTML = `
    <h3>Parámetros Avanzados</h3>
    <label class="label">Modo mantenimiento</label>
    <select class="input" id="maint"><option value="off">Off</option><option value="on">On</option></select>
    <label class="label mt-2">Nivel de detalle</label>
    <select class="input" id="detail"><option>Normal</option><option>Alto</option><option>Mínimo</option></select>
    <div class="row mt-2"><button class="btn" id="saveAdv">Guardar</button></div>
  `;
  const c3 = el('div','card');
  c3.innerHTML = `
    <h3>Sistema</h3>
    <div class="grid cols-3 mt-2">
      <div class="card"><div class="helper">Versión</div><div style="font-size:22px;font-weight:700">1.0.0</div></div>
      <div class="card"><div class="helper">Estado</div><div style="font-size:22px;font-weight:700">OK</div></div>
      <div class="card"><div class="helper">Latencia</div><div style="font-size:22px;font-weight:700" id="lat">-</div></div>
    </div>
    <div class="row mt-2"><button class="btn ghost" id="ping">Probar latencia</button></div>
  `;
  container.append(c1,c2,c3);
  c1.querySelector('#runClean').addEventListener('click', ()=>{
    alert('Limpieza iniciada.');
  });
  c1.querySelector('#runBackup').addEventListener('click', ()=>{
    alert('Respaldo en progreso.');
  });
  c2.querySelector('#saveAdv').addEventListener('click', ()=>{
    alert('Parámetros guardados.');
  });
  c3.querySelector('#ping').addEventListener('click', async()=>{
    const t0 = performance.now();
    try{ await fetch(location.href, { method:'HEAD', cache:'no-store' }); }catch(e){}
    const t1 = performance.now();
    c3.querySelector('#lat').textContent = Math.round(t1 - t0) + ' ms';
  });
  return container;
}
