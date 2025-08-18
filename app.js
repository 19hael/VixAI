const SUPABASE_URL="https://bpzxkohrdvcpxhurvock.supabase.co";const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwenhrb2hyZHZjcHhodXJ2b2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MTUzNjcsImV4cCI6MjA3MDk5MTM2N30.6vQZDoNbAYL-HyZ1jvY9D0_8WN6p6hN6CLfAnvElMVA";
const $=s=>document.querySelector(s);const $$=s=>document.querySelectorAll(s);
const authPanel=$("#authPanel");const tabs=$$(".tab");const tabUnderline=$("#tabUnderline");const registerForm=$("#registerForm");const loginForm=$("#loginForm");const avatar=$("#avatar");const avatarCircle=$("#avatarCircle");const avatarMenu=$("#avatarMenu");const hero=$(".hero");const ctaExplore=$("#ctaExplore");const modulesView=$("#modules");const modulesGrid=$("#modulesGrid");const modal=$("#modal");const modalBody=$("#modalBody");const modalClose=$("#modalClose");const progressIndicator=$("#progressIndicator");const progressText=$("#progressText");const progressFill=$("#progressFill");const helpLink=$("#helpLink");const helpView=$("#helpView");const helpClose=$("#helpClose");const confettiCanvas=$("#confetti");
const modules=[{id:1,title:"¿Qué es la IA?",desc:"Conceptos clave y aplicaciones actuales.",quiz:[{q:"La IA se refiere a:",o:["Un lenguaje de programación","Sistemas que realizan tareas que requieren inteligencia humana","Un tipo de base de datos"],a:1},{q:"Un ejemplo cotidiano de IA es:",o:["Un lápiz","Un semáforo","Un asistente de voz"],a:2}]},{id:2,title:"Datos y modelos",desc:"Cómo los datos dan forma a los modelos.",quiz:[{q:"El sobreajuste ocurre cuando:",o:["El modelo generaliza bien","El modelo memoriza el conjunto de entrenamiento","No hay suficientes características"],a:1},{q:"La validación cruzada se usa para:",o:["Acelerar el entrenamiento","Evaluar desempeño generalizable","Reducir el tamaño del dataset"],a:1}]},{id:3,title:"Entrenamiento",desc:"Proceso de optimización y evaluación.",quiz:[{q:"La función de pérdida sirve para:",o:["Medir el error del modelo","Almacenar datos","Visualizar resultados"],a:0},{q:"El aprendizaje por lotes implica:",o:["Actualizar después de cada ejemplo","Actualizar con grupos de ejemplos","No actualizar parámetros"],a:1},{q:"La tasa de aprendizaje controla:",o:["El tamaño del paso en la optimización","La cantidad de datos","El número de clases"],a:0}]},{id:4,title:"Producción y MLOps",desc:"Despliegue, monitoreo y ciclo de vida.",quiz:[{q:"El monitoreo en producción busca:",o:["Reducir el almacenamiento","Detectar deriva y problemas","Aumentar el consumo energético"],a:1},{q:"CI/CD en MLOps ayuda a:",o:["Automatizar integraciones y despliegues","Entrenar más lento","Eliminar pruebas"],a:0}]},{id:5,title:"Ética en IA",desc:"Sesgos, transparencia y responsabilidad.",quiz:[{q:"Un riesgo ético común es:",o:["Mayor exactitud","Sesgo en datos","Menos latencia"],a:1},{q:"La explicabilidad ayuda a:",o:["Ocultar decisiones","Entender decisiones del modelo","Borrar datos"],a:1}]}];
let currentUser=null;let userProgress=new Set();
function moveUnderline(){const active=document.querySelector('.tab.active');if(!active)return;const r=active.getBoundingClientRect();const container=active.parentElement.getBoundingClientRect();tabUnderline.style.width=r.width+"px";tabUnderline.style.left=(r.left-container.left)+"px"}
function switchTab(name){tabs.forEach(b=>b.classList.toggle('active',b.dataset.tab===name));$$(".form").forEach(f=>f.classList.remove('show'));if(name==='register')registerForm.classList.add('show');else loginForm.classList.add('show');moveUnderline()}
function initialsFrom(name){return name.trim().split(/\s+/).map(p=>p[0]?.toUpperCase()).slice(0,2).join('')||'U'}
async function sha256(t){const enc=new TextEncoder().encode(t);const h=await crypto.subtle.digest('SHA-256',enc);return Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,'0')).join('')}
async function sb(path,{method='GET',body,headers,query}={}){
  const q=query?"?"+new URLSearchParams(query).toString():"";
  const isMutating = method && method.toUpperCase() !== 'GET';
  const defaultPrefer = isMutating ? 'return=minimal' : 'return=representation';
  const finalHeaders = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: defaultPrefer,
    ...(headers||{})
  };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}${q}`,{
    method,
    headers: finalHeaders,
    body: body?JSON.stringify(body):undefined
  });
  if(!res.ok){
    const text = await res.text().catch(()=>'');
    console.error('Supabase request failed', {
      path, method, status: res.status, statusText: res.statusText, headers: finalHeaders, query, body
    });
    console.error('Supabase error body:', text);
    const err = new Error(text || `Supabase error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const ct = res.headers.get('Content-Type')||'';
  if(ct.includes('application/json')){
    return await res.json();
  }
  const t = await res.text();
  try{ return t?JSON.parse(t):null }catch{ return t || null }
}
function saveSession(u){currentUser=u;localStorage.setItem('vixai_user',JSON.stringify(u))}
function loadSession(){try{const s=localStorage.getItem('vixai_user');if(s){currentUser=JSON.parse(s)}}catch{}}
function clearSession(){currentUser=null;localStorage.removeItem('vixai_user')}
function showAvatar(){authPanel.style.display='none';avatar.hidden=false;avatarCircle.textContent=initialsFrom(currentUser.nombre_completo||currentUser.email)}
function showAuth(){avatar.hidden=true;avatarMenu.classList.remove('show');authPanel.style.display='block'}
function nudgeAuth(){authPanel.animate([{transform:'translateY(0)'},{transform:'translateY(3px)'},{transform:'translateY(0)'}],{duration:300})}
function renderGrid(){modulesGrid.innerHTML='';modules.forEach(m=>{const card=document.createElement('div');card.className='card';const done=userProgress.has(m.id);card.innerHTML=`<h3>${m.title}</h3><p>${m.desc}</p><div class="card-actions"><span class="badge">${done?"Completado":"Pendiente"}</span><button class="open-btn" data-id="${m.id}">Abrir</button></div>`;modulesGrid.appendChild(card)});$$('.open-btn').forEach(b=>b.addEventListener('click',e=>openModule(parseInt(e.currentTarget.dataset.id))))}
function updateProgressUI(){const completed=userProgress.size;progressText.textContent=`Has completado ${completed}/5 módulos`;progressFill.style.width=`${(completed/5)*100}%`}
function showModules(){modulesView.hidden=false;progressIndicator.hidden=false;renderGrid();updateProgressUI();hero.scrollIntoView({behavior:'smooth',block:'start'})}
function hideModules(){modulesView.hidden=true;progressIndicator.hidden=true}
function openModal(html){modalBody.innerHTML=html;modal.hidden=false}
function closeModal(){modal.hidden=true}
function module1Content(){return `<div class="m-tabs"><button class="m-tab active" data-t="c">Contenido</button><button class="m-tab" data-t="p">Prácticas</button><button class="m-tab" data-t="q">Quiz</button></div>
<div class="m-body show" id="m1-c">
  <div class="m-section">
    <h3>Introducción</h3>
    <p>La inteligencia artificial es el estudio y construcción de sistemas capaces de realizar tareas que normalmente requieren inteligencia humana, como percepción, razonamiento, aprendizaje y toma de decisiones.</p>
    <div class="m-callout"><strong>Enfoques principales:</strong> simbólico, estadístico y conexionista. Hoy predominan los métodos estadísticos y de aprendizaje profundo.</div>
    <h3>Tipos de IA</h3>
    <ul>
      <li>IA débil: sistemas para tareas específicas, como recomendadores o asistentes.</li>
      <li>IA fuerte: hipotética, con capacidades generales comparables a las humanas.</li>
    </ul>
    <h3>Áreas clave</h3>
    <ul>
      <li>Visión por computadora</li>
      <li>Procesamiento de lenguaje natural</li>
      <li>Aprendizaje por refuerzo</li>
      <li>Modelado generativo</li>
    </ul>
    <h3>Pipeline básico</h3>
    <ol>
      <li>Definir el problema y la métrica</li>
      <li>Reunir y preparar datos</li>
      <li>Seleccionar y entrenar un modelo</li>
      <li>Evaluar y validar</li>
      <li>Desplegar y monitorear</li>
    </ol>

    <h3>IA vs. programación tradicional</h3>
    <ul>
      <li><strong>Reglas fijas:</strong> el programador escribe reglas explícitas (if/else). Funciona bien cuando el problema es claro y simple.</li>
      <li><strong>Aprendizaje:</strong> el modelo aprende patrones desde ejemplos (datos) y generaliza a nuevos casos.</li>
      <li><strong>Cuándo usar IA:</strong> visión, lenguaje, recomendaciones, señales con ruido, o cuando escribir reglas sería imposible.</li>
    </ul>

    <h3>Caso práctico: detector de spam</h3>
    <ol>
      <li>Reúnes emails etiquetados como spam/no spam.</li>
      <li>Extraes características (palabras frecuentes, enlaces, remitente).</li>
      <li>Entrenas un modelo (por ejemplo, logística o árbol).</li>
      <li>Evalúas con <em>precision</em>, <em>recall</em> y F1 (importante en clases desbalanceadas).</li>
      <li>Despliegas y monitoreas: revisas deriva y nuevas tácticas de spam.</li>
    </ol>

    <h3>Terminología básica</h3>
    <ul>
      <li><strong>Características (features):</strong> variables de entrada para el modelo.</li>
      <li><strong>Etiqueta (label):</strong> variable objetivo que quieres predecir.</li>
      <li><strong>Overfitting (sobreajuste):</strong> el modelo memoriza y no generaliza.</li>
      <li><strong>Regularización:</strong> técnicas para evitar sobreajuste.</li>
      <li><strong>Validación cruzada:</strong> método para estimar desempeño generalizable.</li>
    </ul>

    <h3>Mitos y realidades</h3>
    <ul>
      <li><strong>“Más complejo siempre es mejor”:</strong> falso. Un baseline simple es el punto de partida.</li>
      <li><strong>“La IA entiende como un humano”:</strong> falso. Aprende correlaciones, no sentido común.</li>
      <li><strong>“Datos enormes sin calidad”:</strong> pueden perjudicar. La limpieza importa más de lo que parece.</li>
    </ul>

    <h3>Limitaciones actuales</h3>
    <ul>
      <li>Sensibilidad a datos fuera de distribución.</li>
      <li>Sesgos heredados de los datos de entrenamiento.</li>
      <li>Necesidad de datos y cómputo para ciertos problemas.</li>
    </ul>

    <h3>Ética y riesgos</h3>
    <ul>
      <li><strong>Sesgo y equidad:</strong> evaluar y mitigar diferencias entre grupos.</li>
      <li><strong>Privacidad:</strong> cumplir regulaciones y minimizar datos sensibles.</li>
      <li><strong>Transparencia:</strong> documentar datasets y modelos; explicar decisiones cuando sea posible.</li>
    </ul>

    <h3>Historia breve</h3>
    <ul>
      <li>1950s: IA simbólica (reglas, lógica).</li>
      <li>1990s-2010s: aprendizaje estadístico y <em>deep learning</em>.</li>
      <li>Hoy: modelos fundacionales y aplicaciones multimodales.</li>
    </ul>

    <h3>Buenas prácticas para empezar</h3>
    <ul>
      <li>Define una métrica alineada al objetivo de negocio.</li>
      <li>Construye un baseline simple y una línea base “tonta” (por ejemplo, azar).</li>
      <li>Controla fuga de información con un buen <em>split</em>.</li>
      <li>Registra experimentos y configura validación cruzada cuando aplique.</li>
    </ul>

    <details class="m-callout">
      <summary><strong>Glosario rápido</strong></summary>
      <p><strong>Precision:</strong> de los positivos predichos, ¿cuántos son correctos?</p>
      <p><strong>Recall:</strong> de todos los positivos reales, ¿cuántos detecto?</p>
      <p><strong>F1:</strong> media armónica entre precision y recall.</p>
      <p><strong>AUC-ROC / AUC-PR:</strong> métricas de ranking y equilibrio entre clases.</p>
    </details>

    <details class="m-callout">
      <summary><strong>Recursos sugeridos</strong></summary>
      <ul>
        <li>“Hands-On Machine Learning” (A. Géron)</li>
        <li>“Pattern Recognition and Machine Learning” (C. Bishop)</li>
        <li>Coursera: Machine Learning (Andrew Ng)</li>
      </ul>
    </details>

    <button class="btn ghost" id="markReadM1">Marcar como leído</button>
  </div>
</div>
<div class="m-body" id="m1-p">
  <div class="m-section">
    <h3>Práctica 1: Reconocer IA</h3>
    <div class="task" id="p1">
      <div class="row">Selecciona todas las opciones que usan IA:</div>
      <label><input type="checkbox" value="a"> Recomendaciones de películas</label>
      <label><input type="checkbox" value="b"> Calculadora básica</label>
      <label><input type="checkbox" value="c"> Detector de spam</label>
      <label><input type="checkbox" value="d"> Editor de texto sin autocorrección</label>
      <button class="btn primary" data-check="p1">Validar</button>
      <div class="row" id="p1-res"></div>
    </div>
    <h3>Práctica 2: Clasificar escenarios</h3>
    <div class="task" id="p2">
      <div class="row">Haz clic para alternar entre IA y No IA:</div>
      <div class="row">
        <button class="btn ghost tag" data-k="t1">Filtrado de correo no deseado</button>
        <button class="btn ghost tag" data-k="t2">Mostrar hora del sistema</button>
        <button class="btn ghost tag" data-k="t3">Traducción automática</button>
        <button class="btn ghost tag" data-k="t4">Copiar archivo</button>
      </div>
      <div class="row"><span id="p2-res"></span></div>
    </div>
    <h3>Práctica 3: Redactar un prompt</h3>
    <div class="task" id="p3">
      <div class="row">Escribe un prompt para pedir un resumen de 3 puntos sobre el cambio climático dirigido a estudiantes de secundaria:</div>
      <input type="text" id="p3-input" placeholder="Escribe aquí">
      <button class="btn primary" data-check="p3">Evaluar</button>
      <div class="row" id="p3-res"></div>
    </div>
    <h3>Práctica 4: Detectar fuga de información</h3>
    <div class="task" id="p4">
      <div class="row">Activa solo las opciones que causan fuga de información:</div>
      <div class="row">
        <button class="btn ghost tag" data-k="l1">Incluir la etiqueta (target) en las features</button>
        <button class="btn ghost tag" data-k="l2">Estandarizar usando únicamente estadísticas del train</button>
        <button class="btn ghost tag" data-k="l3">Hacer join con datos generados después del evento a predecir</button>
        <button class="btn ghost tag" data-k="l4">Aplicar escalado dentro del pipeline con CV</button>
      </div>
      <div class="row" id="p4-res"></div>
    </div>
    <h3>Práctica 5: Elegir la métrica correcta</h3>
    <div class="task" id="p5">
      <div class="row">Tienes 1% positivos y el costo de falsos negativos es alto. ¿Métrica principal?</div>
      <input type="text" id="p5-input" placeholder="Ej: recall, sensibilidad, F1, F2">
      <button class="btn primary" data-check="p5">Evaluar</button>
      <div class="row" id="p5-res"></div>
    </div>
  </div>
</div>
<div class="m-body" id="m1-q"></div>
<div class="m-body" id="m2-c">
  <div class="m-section">
    <h3>Calidad de datos</h3>
    <p>La calidad de los datos determina el techo del rendimiento del modelo. Problemas comunes incluyen valores faltantes, outliers, fuga de información, desbalance de clases y etiquetado ruidoso.</p>
    <div class="m-callout"><strong>Regla práctica:</strong> mejor 1 hora limpiando datos que 10 iteraciones de modelo.</div>
    <h3>Particionado de dataset</h3>
    <ul>
      <li>Entrenamiento (60-80%): para ajustar parámetros.</li>
      <li>Validación (10-20%): para selección de hiperparámetros.</li>
      <li>Prueba (10-20%): para estimar generalización final.</li>
    </ul>
    <h3>Ingeniería de características</h3>
    <p>Transformaciones (normalización, codificación), cruces de variables, agregaciones temporales y extracción de señales. Mantén un pipeline reproducible.</p>
    <h3>Selección de modelo</h3>
    <p>Comienza simple (baselines) y aumenta complejidad sólo si aporta. Evalúa con validación cruzada cuando el dataset es pequeño o ruidoso.</p>
    <h3>Métricas</h3>
    <ul>
      <li>Clasificación: accuracy, precisión, recall, F1, AUC.</li>
      <li>Regresión: MAE, RMSE, R².</li>
      <li>Problemas desbalanceados: usa AUC-PR y métricas por clase.</li>
    </ul>
    <button class="btn ghost" id="markReadM2">Marcar como leído</button>
  </div>
</div>
<div class="m-body" id="m2-p">
  <div class="m-section">
    <h3>Práctica 1: Detectar problemas de calidad</h3>
    <div class="task" id="m2p1">
      <div class="row">Selecciona todos los que son problemas de calidad de datos:</div>
      <label><input type="checkbox" value="a"> 35% de valores nulos en una columna clave</label>
      <label><input type="checkbox" value="b"> Features escaladas con StandardScaler</label>
      <label><input type="checkbox" value="c"> Etiquetas inconsistentes entre anotadores</label>
      <label><input type="checkbox" value="d"> Conjunto de entrenamiento y test mezclados</label>
      <button class="btn primary" data-check="m2p1">Validar</button>
      <div class="row" id="m2p1-res"></div>
    </div>
    <h3>Práctica 2: Particionado correcto</h3>
    <div class="task" id="m2p2">
      <div class="row">Activa sólo la configuración válida para un dataset de clasificación desbalanceado:</div>
      <div class="row">
        <button class="btn ghost tag" data-k="s1">70/15/15 con estratificación</button>
        <button class="btn ghost tag" data-k="s2">90/5/5 sin estratificación</button>
        <button class="btn ghost tag" data-k="s3">60/20/20 con estratificación</button>
        <button class="btn ghost tag" data-k="s4">50/50/0</button>
      </div>
      <div class="row" id="m2p2-res"></div>
    </div>
    <h3>Práctica 3: Métrica adecuada</h3>
    <div class="task" id="m2p3">
      <div class="row">Escribe una métrica PRINCIPAL para un dataset con 2% positivos:</div>
      <input type="text" id="m2p3-input" placeholder="Ej: AUC-PR">
      <button class="btn primary" data-check="m2p3">Evaluar</button>
      <div class="row" id="m2p3-res"></div>
    </div>
  </div>
</div>
<div class="m-body" id="m2-q"></div>
</div>
</div>
<div class="m-body" id="m1-q"></div>
</div>
</div>
<div class="m-body" id="m2-c">
  <div class="m-section">
  <div class=\"m-section\">
    <h3>Calidad de datos</h3>
    <p>La calidad de los datos determina el techo del rendimiento del modelo. Problemas comunes incluyen valores faltantes, outliers, fuga de información, desbalance de clases y etiquetado ruidoso.</p>
    <div class=\"m-callout\"><strong>Regla práctica:</strong> mejor 1 hora limpiando datos que 10 iteraciones de modelo.</div>

    <h3>Particionado de dataset</h3>
    <ul>
      <li>Entrenamiento (60-80%): para ajustar parámetros.</li>
      <li>Validación (10-20%): para selección de hiperparámetros.</li>
      <li>Prueba (10-20%): para estimar generalización final.</li>
    </ul>

    <h3>Ingeniería de características</h3>
    <p>Transformaciones (normalización, codificación), cruces de variables, agregaciones temporales y extracción de señales. Mantén un pipeline reproducible.</p>

    <h3>Selección de modelo</h3>
    <p>Comienza simple (baselines) y aumenta complejidad sólo si aporta. Evalúa con validación cruzada cuando el dataset es pequeño o ruidoso.</p>

    <h3>Métricas</h3>
    <ul>
      <li>Clasificación: accuracy, precisión, recall, F1, AUC.</li>
      <li>Regresión: MAE, RMSE, R².</li>
      <li>Desbalance extremo: prioriza AUC-PR y métricas por clase.</li>
    </ul>

    <h3>Desbalance de clases</h3>
    <ul>
      <li>Re-muestreo: under/over-sampling (SMOTE con cuidado).</li>
      <li>Ponderación de clases: usa <em>class weights</em> en la pérdida.</li>
      <li>Umbral: optimiza el punto de corte según métrica/costo.</li>
    </ul>

    <h3>Fuga de información</h3>
    <ul>
      <li>Usar variables con información del futuro.</li>
      <li>Calcular estadísticas en todo el dataset antes del split.</li>
      <li>Target encoding sin CV dentro del train.</li>
    </ul>

    <h3>Buenas prácticas de pipelines</h3>
    <ul>
      <li>Encapsula transformaciones y el modelo en un solo pipeline.</li>
      <li>Ajusta estadísticas únicamente con <strong>train</strong>.</li>
      <li>Usa CV estratificada y, si hay tiempo, validación por tiempo.</li>
    </ul>

    <h3>Trampas comunes de evaluación</h3>
    <ul>
      <li>Elegir métrica inadecuada (accuracy en desbalance).</li>
      <li>Ajustar hiperparámetros contra test (sobreajuste al test).</li>
      <li>No reportar varianza entre folds ni intervalos.</li>
    </ul>

    <h3>Ejemplo en la vida real: Detección de fraude en pagos</h3>
    <ol>
      <li><strong>Problema y costo:</strong> pocos positivos; FN costosos. Objetivo: alto recall con precisión suficiente.</li>
      <li><strong>Datos:</strong> transacciones con timestamp, importe, país, dispositivo, historial del usuario.</li>
      <li><strong>Split temporal estratificado:</strong> entrenar con meses anteriores, validar con el mes siguiente. Evita fuga temporal.</li>
      <li><strong>Features:</strong> frecuencia por usuario en últimas 24h/7d, ratio de importes, binning de horas, one-hot de país.</li>
      <li><strong>Baseline:</strong> Regresión logística con <em>class_weight</em>=balanced.</li>
      <li><strong>Métrica:</strong> AUC-PR y recall@precisión≥90%. Ajustar umbral para cumplir el objetivo.</li>
      <li><strong>CV:</strong> validación por bloques de tiempo (time series split).</li>
      <li><strong>Producción:</strong> monitorear deriva de datos y tasa de alertas; realimentar con etiquetas confirmadas.</li>
    </ol>
    <pre>
Flujo (simplificado)
datos crudos -> split temporal -> pipeline(escala+onehot) -> modelo ->
búsqueda de umbral -> métricas (AUC-PR, recall@precisión) -> despliegue
    </pre>

    <details class=\"m-callout\">
      <summary><strong>Glosario M2</strong></summary>
      <p><strong>Stratified split:</strong> mantiene proporción de clases por partición.</p>
      <p><strong>Leakage:</strong> información no disponible en producción se filtra al entrenamiento.</p>
      <p><strong>AUC-PR:</strong> área bajo la curva Precision-Recall; útil en desbalance.</p>
    </details>
    <details class=\"m-callout\">
      <summary><strong>Recursos sugeridos</strong></summary>
      <ul>
        <li>Imbalanced-learn: estrategias de re-muestreo</li>
        <li>Scikit-learn: Pipelines y ColumnTransformer</li>
        <li>Artículo: “Leakage in Machine Learning” (Kaufman & Rosset)</li>
      </ul>
    </details>

    <button class=\"btn ghost\" id=\"markReadM2\">Marcar como leído</button>
  </div>
</div>

<div class=\"m-body\" id=\"m2-p\">
  <div class=\"m-section\">
    <h3>Práctica 1: Detectar problemas de calidad</h3>
    <div class=\"task\" id=\"m2p1\">
      <div class=\"row\">Selecciona todos los que son problemas de calidad de datos:</div>
      <label><input type=\"checkbox\" value=\"a\"> 35% de valores nulos en una columna clave</label>
      <label><input type=\"checkbox\" value=\"b\"> Features escaladas con StandardScaler</label>
      <label><input type=\"checkbox\" value=\"c\"> Etiquetas inconsistentes entre anotadores</label>
      <label><input type=\"checkbox\" value=\"d\"> Conjunto de entrenamiento y test mezclados</label>
      <button class=\"btn primary\" data-check=\"m2p1\">Validar</button>
      <div class=\"row\" id=\"m2p1-res\"></div>
    </div>

    <h3>Práctica 2: Particionado correcto</h3>
    <div class=\"task\" id=\"m2p2\">
      <div class=\"row\">Activa sólo la configuración válida para un dataset de clasificación desbalanceado:</div>
      <div class=\"row\">
        <button class=\"btn ghost tag\" data-k=\"s1\">70/15/15 con estratificación</button>
        <button class=\"btn ghost tag\" data-k=\"s2\">90/5/5 sin estratificación</button>
        <button class=\"btn ghost tag\" data-k=\"s3\">60/20/20 con estratificación</button>
        <button class=\"btn ghost tag\" data-k=\"s4\">50/50/0</button>
      </div>
      <div class=\"row\" id=\"m2p2-res\"></div>
    </div>

    <h3>Práctica 3: Métrica adecuada</h3>
    <div class=\"task\" id=\"m2p3\">
      <div class=\"row\">Escribe una métrica PRINCIPAL para un dataset con 2% positivos:</div>
      <input type=\"text\" id=\"m2p3-input\" placeholder=\"Ej: AUC-PR\">
      <button class=\"btn primary\" data-check=\"m2p3\">Evaluar</button>
      <div class=\"row\" id=\"m2p3-res\"></div>
    </div>

    <h3>Práctica 4: ¿Qué causa fuga?</h3>
    <div class=\"task\" id=\"m2p4\">
      <div class=\"row\">Activa sólo las opciones que causan fuga de información:</div>
      <div class=\"row\">
        <button class=\"btn ghost tag\" data-k=\"l1\">Escalar usando media/varianza de train+test</button>
        <button class=\"btn ghost tag\" data-k=\"l2\">Escalar con media/varianza de train dentro del pipeline</button>
        <button class=\"btn ghost tag\" data-k=\"l3\">Usar variable calculada con datos futuros</button>
        <button class=\"btn ghost tag\" data-k=\"l4\">Target encoding con CV en train</button>
      </div>
      <div class=\"row\" id=\"m2p4-res\"></div>
    </div>

    <h3>Práctica 5: Elegir umbral/métrica</h3>
    <div class=\"task\" id=\"m2p5\">
      <div class=\"row\">Costo alto de falsos negativos y pocos positivos. Escribe una métrica o enfoque principal:</div>
      <input type=\"text\" id=\"m2p5-input\" placeholder=\"Ej: recall, F2, AUC-PR, balanced accuracy, optimizar umbral por recall@precisión\">
      <button class=\"btn primary\" data-check=\"m2p5\">Evaluar</button>
      <div class=\"row\" id=\"m2p5-res\"></div>
    </div>
  </div>
</div>

<div class=\"m-body\" id=\"m2-q\"></div>
`}
function renderM2Quiz(){
  const qs=[
    {q:'La fuga de información ocurre cuando:',o:['Se usa información del futuro en entrenamiento','Se pierden filas al hacer merge','Se balancea el dataset'],a:0},
    {q:'Para desbalance extremo, prefieres optimizar:',o:['Accuracy','AUC-PR','RMSE'],a:1},
    {q:'La validación cruzada es útil cuando:',o:['Hay pocos datos','La GPU es lenta','Sólo hay imágenes'],a:0},
    {q:'Una buena práctica de ingeniería de características es:',o:['Aplicar transformaciones fuera del pipeline','Ajustar transformaciones dentro del pipeline','No escalar variables continuas'],a:1},
    {q:'Un split correcto para clasificación desbalanceada incluye:',o:['Estratificación','Barajar desactivado','Sin conjunto de prueba'],a:0},
    {q:'Un baseline recomendable es:',o:['Un modelo complejo de inicio','Un modelo simple como logistic regression','Un ensemble de 10 modelos'],a:1},
    {q:'Para medir error en regresión robusto a outliers:',o:['MAE','RMSE','Accuracy'],a:0}
  ];
  const quizHtml=qs.map((q,i)=>`<div class="q"><div>${i+1}. ${q.q}</div>${q.o.map((opt,j)=>`<label><input type="radio" name="m2q${i}" value="${j}"> <span>${opt}</span></label>`).join('')}</div>`).join('');
  return `<div class="quiz">${quizHtml}<button class="btn primary" id="m2-submit">Enviar</button></div>`;
}

function handleM2Logic(){
  const tabs=$$('.m-tab');
  const bodies={c:$('#m2-c'),p:$('#m2-p'),q:$('#m2-q')};
  tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');Object.values(bodies).forEach(b=>b.classList.remove('show'));bodies[t.dataset.t].classList.add('show')}));
  const storeKey='vixai_m2';
  function load(){try{return JSON.parse(localStorage.getItem(storeKey)||'{}')}catch{return{}}}
  function save(s){localStorage.setItem(storeKey,JSON.stringify(s))}
  const st=load();
  if(st.read)$('#markReadM2').textContent='Leído';
  $('#markReadM2').addEventListener('click',()=>{const s=load();s.read=true;save(s);$('#markReadM2').textContent='Leído'});
  $('#m2-q').innerHTML=renderM2Quiz();
  document.querySelector('[data-check="m2p1"]').addEventListener('click',()=>{
    const vals=[...document.querySelectorAll('#m2p1 input[type=checkbox]')].filter(i=>i.checked).map(i=>i.value);
    const ok=vals.sort().join(',')==='a,c,d';
    $('#m2p1-res').innerHTML= ok?'<span class="ok">Correcto</span>':'<span class="bad">Problemas: a, c y d</span>';
    const s=load();s.p1=!!ok;save(s);
  });
  $('#m2p2').addEventListener('click',e=>{
    const b=e.target.closest('.tag');if(!b)return; b.classList.toggle('active');
    const act=(k)=>document.querySelector(`[data-k=${k}]`).classList.contains('active');
    const ok=act('s1')&&act('s3')&&!act('s2')&&!act('s4');
    $('#m2p2-res').innerHTML= ok?'<span class="ok">Correcto</span>':'<span class="bad">Activa s1 y s3 con estratificación</span>';
    const s=load();s.p2=!!ok;save(s);
  });
  document.querySelector('[data-check="m2p3"]').addEventListener('click',()=>{
    const v=$('#m2p3-input').value.trim().toLowerCase();
    const ok=v.includes('auc-pr')||v.includes('pr auc')||v.includes('precision-recall')||v.includes('f1');
    $('#m2p3-res').innerHTML= ok?'<span class="ok">Buena elección</span>':'<span class="bad">Sugerencia: AUC-PR o F1</span>';
    const s=load();s.p3=!!ok;save(s);
  });
  $('#m2p4').addEventListener('click',e=>{
    const b=e.target.closest('.tag'); if(!b)return; b.classList.toggle('active');
    const act=(k)=>document.querySelector(`[data-k=${k}]`).classList.contains('active');
    const ok=act('l1')&&act('l3')&&!act('l2')&&!act('l4');
    $('#m2p4-res').innerHTML= ok?'<span class="ok">Correcto</span>':'<span class="bad">Activa l1 y l3; evita l2 y l4</span>';
    const s=load(); s.p4=!!ok; save(s);
  });
  document.querySelector('[data-check="m2p5"]').addEventListener('click',()=>{
    const v=$('#m2p5-input').value.trim().toLowerCase();
    const ok=v.includes('recall')||v.includes('f2')||v.includes('auc-pr')||v.includes('balanced accuracy')||v.includes('balanced accuracy')||v.includes('precision-recall')||v.includes('threshold')||v.includes('umbral');
    $('#m2p5-res').innerHTML= ok?'<span class="ok">Buena dirección</span>':'<span class="bad">Sugerencia: recall/F2 o AUC-PR y optimizar umbral</span>';
    const s=load(); s.p5=!!ok; save(s);
  });
  $('#m2-submit').addEventListener('click',async()=>{
    const names=[0,1,2,3,4,5,6].map(i=>`m2q${i}`);
    const ans=names.map((n)=>parseInt((document.querySelector(`input[name=${n}]:checked`)||{}).value));
    if(ans.some(isNaN))return;
    const solutions=[0,1,0,1,0,1,0];
    const correct=ans.filter((a,i)=>a===solutions[i]).length;
    const pass=correct/solutions.length>=0.8;
    if(!pass){shake($('#m2-q'));return}
    await markCompleted(2);
    closeModal();
    celebrate();
    renderGrid();
    updateProgressUI();
  });
}
function module5Content(){return `
<div class=\"m-tabs\"><button class=\"m-tab active\" data-t=\"c\">Contenido</button><button class=\"m-tab\" data-t=\"p\">Prácticas</button><button class=\"m-tab\" data-t=\"q\">Quiz</button></div>
<div class=\"m-body show\" id=\"m5-c\">
  <div class=\"m-section\">
    <h3>Principios y riesgos</h3>
    <ul>
      <li><strong>Equidad (Fairness):</strong> evitar disparidades injustas entre grupos.</li>
      <li><strong>Transparencia y explicabilidad:</strong> comunicar cómo y por qué decide.</li>
      <li><strong>Privacidad y consentimiento:</strong> minimizar datos y respetar elección del usuario.</li>
      <li><strong>Responsabilidad:</strong> trazabilidad, auditorías y dueños claros de riesgos.</li>
      <li><strong>Seguridad y robustez:</strong> resistencia a ataques y fallos.</li>
      <li><strong>No-maleficencia:</strong> evaluar daños potenciales y grupos vulnerables.</li>
    </ul>

    <h3>Sesgos comunes</h3>
    <ul>
      <li><strong>De muestreo:</strong> grupos subrepresentados.</li>
      <li><strong>De medición/etiquetado:</strong> proxies pobres, anotación con sesgo.</li>
      <li><strong>De selección/uso:</strong> feedback loops, <em>historical bias</em>.</li>
      <li><strong>De interacción:</strong> aprendizaje de comportamientos tóxicos.</li>
    </ul>

    <h3>Métricas de equidad</h3>
    <ul>
      <li><strong>Paridad demográfica:</strong> tasa positiva similar entre grupos.</li>
      <li><strong>Igualdad de oportunidades:</strong> TPR similar entre grupos.</li>
      <li><strong>Equalized odds:</strong> TPR y FPR similares.</li>
      <li><strong>Predictive parity:</strong> PPV similar; trade-offs con otras métricas.</li>
    </ul>

    <h3>Mitigación</h3>
    <ul>
      <li><strong>Pre-proceso:</strong> re-muestreo, re-pesado, reparación de datos.</li>
      <li><strong>En-proceso:</strong> regularización de equidad, restricciones.</li>
      <li><strong>Post-proceso:</strong> calibración/umbral por grupo.</li>
    </ul>

    <h3>Privacidad, seguridad y gobernanza</h3>
    <ul>
      <li><strong>Privacidad:</strong> minimización, anonimización, k-anonimato, privacidad diferencial, federado.</li>
      <li><strong>Seguridad:</strong> hardening, control de acceso, defensa ante <em>prompt/model/data poisoning</em>.</li>
      <li><strong>Gobernanza:</strong> <em>model cards</em>, <em>datasheets</em>, revisiones, auditorías y registro de cambios.</li>
    </ul>

    <h3>Marco regulatorio y riesgo</h3>
    <ul>
      <li><strong>GDPR/consentimiento:</strong> base legal, derechos ARCO.</li>
      <li><strong>EU AI Act (alto riesgo):</strong> gestión de riesgos, datos de calidad, trazabilidad, supervisión humana.</li>
      <li><strong>NIST AI RMF:</strong> identificar, gestionar y comunicar riesgos.</li>
    </ul>

    <h3>Documentación y ciclos</h3>
    <ul>
      <li><strong>Model cards:</strong> propósito, datos, límites, métricas por grupo.</li>
      <li><strong>Datasheets:</strong> procedencia, licencias, calidad, restricciones.</li>
      <li><strong>Red teaming:</strong> pruebas adversarias y de abuso.</li>
      <li><strong>Human-in-the-loop:</strong> revisión humana y rutas de apelación.</li>
    </ul>

    <h3>Ejemplo real: filtro de solicitudes de crédito</h3>
    <ol>
      <li>Definir objetivo y daño: minimizar FN de alto riesgo, sin penalizar injustamente por grupo.</li>
      <li>Datos: balancear cobertura por grupo; auditar variables sensibles/proxies.</li>
      <li>Métricas: AUROC/PR + igualdad de oportunidades; reportar por subgrupos.</li>
      <li>Mitigación: regularización de fairness y ajuste de umbral por grupo si procede.</li>
      <li>Gobernanza: model card + panel de métricas por grupo; proceso de apelaciones.</li>
    </ol>
    <pre>
Pipeline ético (resumen)
[recolección de datos] -> [auditoría sesgos] -> [entrenamiento con constraints]
         |                         |                   |
         v                         v                   v
   [privacidad/consent]     [eval por grupos]     [model card + monitoreo]
    </pre>

    <details class=\"m-callout\">
      <summary><strong>Glosario M5</strong></summary>
      <p><strong>Equalized odds:</strong> igualar TPR y FPR entre grupos.</p>
      <p><strong>Privacidad diferencial:</strong> ruido calibrado para límites de fuga de info.</p>
      <p><strong>Red teaming:</strong> pruebas estructuradas para hallar fallos y abusos.</p>
      <hr>
      <p><strong>Epsilon/Delta (DP):</strong> parámetros que acotan la privacidad diferencial.</p>
      <p><strong>PPV/NPV por grupo:</strong> valor predictivo positivo/negativo para evaluar impactos.</p>
      <p><strong>Trade-off utilidad/fairness:</strong> balancear precisión con equidad.</p>
      <p><strong>De-biasing:</strong> técnicas para reducir sesgo en datos/modelo.</p>
    </details>

    <h3>Casos reales</h3>
    <ul>
      <li><strong>Reclutamiento:</strong> modelos que replican sesgos históricos en CVs; mitigación con auditoría de features y métricas por grupo.</li>
      <li><strong>Reconocimiento facial:</strong> mayores tasas de error en minorías; necesidad de datasets balanceados y umbrales por grupo.</li>
      <li><strong>Moderación de contenido:</strong> bias en dialectos; calibración y revisión humana especializada.</li>
    </ul>

    <h3>Checklist de lanzamiento ético</h3>
    <ul>
      <li>Definición de daño y grupos afectados.</li>
      <li>Métricas de fairness seleccionadas y reportadas por subgrupos.</li>
      <li>Privacidad: base legal, minimización, DP/federado si aplica.</li>
      <li>Gobernanza: model card/datasheet, logs y auditoría habilitados.</li>
      <li>Supervisión humana: rutas de apelación activas.</li>
      <li>Monitoreo en producción: deriva y métricas por grupo.</li>
      <li>Plan de respuesta/rollback ante incidentes éticos.</li>
    </ul>

    <details class=\"m-callout\">
      <summary><strong>Plantilla rápida: Model Card</strong></summary>
      <pre>
Nombre: ____________________________
Propósito: _________________________
Datos de entrenamiento: origen, cobertura, sesgos conocidos
Métricas: globales y por grupo (TPR/FPR/PPV)
Limitaciones: ______________________
Casos de uso aceptables/no aceptables
Supervisión humana y apelaciones
Lanzamiento: versión, fecha, responsables
      </pre>
    </details>

    <details class=\"m-callout\">
      <summary><strong>Plantilla rápida: Datasheet</strong></summary>
      <pre>
Nombre dataset y versión
Procedencia/licencia
Cobertura poblacional y temporal
Proceso de etiquetado (anotadores, calidad, sesgos)
Limitaciones/advertencias de uso
      </pre>
    </details>

    <h3>Revisión ética por etapas</h3>
    <pre>
Ideación -> Datos -> Entrenamiento -> Evaluación -> Despliegue -> Monitoreo
    |         |           |               |             |            |
  impacto   sesgos      fairness       reporte       controles    alertas
    </pre>

    <h3>Flujo de apelaciones</h3>
    <pre>
Usuario -> Solicitud de revisión -> Comité/Operador -> Decisión -> Registro -> Retroalimentación al modelo
    </pre>

    <button class=\"btn ghost\" id=\"markReadM5\">Marcar como leído</button>
  </div>
</div>

<div class=\"m-body\" id=\"m5-p\">
  <div class=\"m-section\">
    <h3>Práctica 1: Detectar sesgos</h3>
    <div class=\"task\" id=\"m5p1\">
      <div class=\"row\">Selecciona los tipos de sesgo en el dataset/proceso:</div>
      <label><input type=\"checkbox\" value=\"a\"> Muestreo desigual</label>
      <label><input type=\"checkbox\" value=\"b\"> Etiquetado inconsistente</label>
      <label><input type=\"checkbox\" value=\"c\"> Normalización por pipeline</label>
      <label><input type=\"checkbox\" value=\"d\"> Feedback loop histórico</label>
      <button class=\"btn primary\" data-check=\"m5p1\">Validar</button>
      <div class=\"row\" id=\"m5p1-res\"></div>
    </div>

    <h3>Práctica 2: Métrica de fairness</h3>
    <div class=\"task\" id=\"m5p2\">
      <div class=\"row\">Escribe una métrica adecuada para comparar grupos:</div>
      <input type=\"text\" id=\"m5p2-input\" placeholder=\"Ej: igualdad de oportunidades, equalized odds, paridad demográfica\">
      <button class=\"btn primary\" data-check=\"m5p2\">Evaluar</button>
      <div class=\"row\" id=\"m5p2-res\"></div>
    </div>

    <h3>Práctica 3: Mitigación</h3>
    <div class=\"task\" id=\"m5p3\">
      <div class=\"row\">Activa sólo las estrategias de mitigación:</div>
      <div class=\"row\">
        <button class=\"btn ghost tag\" data-k=\"m1\">Re-pesado por grupo</button>
        <button class=\"btn ghost tag\" data-k=\"m2\">Regularización de fairness en la pérdida</button>
        <button class=\"btn ghost tag\" data-k=\"m3\">Ordenar por ID ascendente</button>
        <button class=\"btn ghost tag\" data-k=\"m4\">Post-procesar umbrales por grupo</button>
      </div>
      <div class=\"row\" id=\"m5p3-res\"></div>
    </div>

    <h3>Práctica 4: Privacidad</h3>
    <div class=\"task\" id=\"m5p4\">
      <div class=\"row\">Activa sólo técnicas de privacidad:</div>
      <div class=\"row\">
        <button class=\"btn ghost tag\" data-k=\"p1\">Privacidad diferencial</button>
        <button class=\"btn ghost tag\" data-k=\"p2\">Aprendizaje federado</button>
        <button class=\"btn ghost tag\" data-k=\"p3\">Exportar datos sin control</button>
        <button class=\"btn ghost tag\" data-k=\"p4\">Minimización de datos</button>
      </div>
      <div class=\"row\" id=\"m5p4-res\"></div>
    </div>

    <h3>Práctica 5: Plan de gobernanza</h3>
    <div class=\"task\" id=\"m5p5\">
      <div class=\"row\">Describe medidas para responsabilidad y auditoría:</div>
      <input type=\"text\" id=\"m5p5-input\" placeholder=\"Ej: model card, auditorías, logs, revisión humana, rutas de apelación\">
      <button class=\"btn primary\" data-check=\"m5p5\">Evaluar</button>
      <div class=\"row\" id=\"m5p5-res\"></div>
    </div>

    <h3>Práctica 6: Red teaming</h3>
    <div class=\"task\" id=\"m5p6\">
      <div class=\"row\">Propón al menos 2 pruebas y 2 mitigaciones (separa con comas):</div>
      <textarea id=\"m5p6-input\" rows=\"3\" placeholder=\"Ej: jailbreak, prompt injection, fuga de datos, toxicidad; mitigación: filtrado, bloqueo, rate limit, revisión humana\"></textarea>
      <button class=\"btn primary\" data-check=\"m5p6\">Evaluar</button>
      <div class=\"row\" id=\"m5p6-res\"></div>
    </div>
  </div>
</div>

<div class=\"m-body\" id=\"m5-q\"></div>
`}

function renderM5Quiz(){
  const qs=[
    {q:'La paridad demográfica busca:',o:['Igual tasa positiva entre grupos','Mismo TPR y FPR','Mismo PPV'],a:0},
    {q:'Equalized odds se logra cuando:',o:['TPR y FPR son similares entre grupos','PPV es igual para todos','Accuracy es igual'],a:0},
    {q:'Una técnica de privacidad es:',o:['Privacidad diferencial','Aumentar el batch size','Guardar todo sin anonimizar'],a:0},
    {q:'Un documento recomendado es:',o:['Model card','Lista de deseos','README vacío'],a:0},
    {q:'Para reducir sesgo de muestreo:',o:['Re-pesar/estratificar por grupo','Aumentar épocas','Congelar LR'],a:0},
    {q:'Ejemplo de daño potencial:',o:['Discriminación injusta por grupo','Menos commits','Más CPU'],a:0},
    {q:'Supervisión humana implica:',o:['Rutas de apelación y revisiones','Eliminar al humano del proceso','Entrenar sin validación'],a:0}
  ];
  const quizHtml=qs.map((q,i)=>`<div class=\"q\"><div>${i+1}. ${q.q}</div>${q.o.map((opt,j)=>`<label><input type=\"radio\" name=\"m5q${i}\" value=\"${j}\"> <span>${opt}</span></label>`).join('')}</div>`).join('');
  return `<div class=\"quiz\">${quizHtml}<button class=\"btn primary\" id=\"m5-submit\">Enviar</button></div>`;
}

function handleM5Logic(){
  const tabs=$$('.m-tab');
  const bodies={c:$('#m5-c'),p:$('#m5-p'),q:$('#m5-q')};
  tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');Object.values(bodies).forEach(b=>b.classList.remove('show'));bodies[t.dataset.t].classList.add('show')}));
  const storeKey='vixai_m5';
  function load(){try{return JSON.parse(localStorage.getItem(storeKey)||'{}')}catch{return{}}}
  function save(s){localStorage.setItem(storeKey,JSON.stringify(s))}
  const st=load();
  if(st.read)$('#markReadM5').textContent='Leído';
  $('#markReadM5').addEventListener('click',()=>{const s=load();s.read=true;save(s);$('#markReadM5').textContent='Leído'});
  $('#m5-q').innerHTML=renderM5Quiz();
  document.querySelector('[data-check="m5p1"]').addEventListener('click',()=>{
    const vals=[...document.querySelectorAll('#m5p1 input[type=checkbox]')].filter(i=>i.checked).map(i=>i.value);
    const ok=vals.sort().join(',')==='a,b,d';
    $('#m5p1-res').innerHTML= ok?'<span class="ok">Correcto</span>':'<span class="bad">Sesgos: muestreo, etiquetado, feedback loop</span>';
    const s=load();s.p1=!!ok;save(s);
  });
  document.querySelector('[data-check="m5p2"]').addEventListener('click',()=>{
    const v=$('#m5p2-input').value.trim().toLowerCase();
    const ok=['paridad','igualdad de oportunidades','equalized odds','predictive parity','tpr','fpr'].some(k=>v.includes(k));
    $('#m5p2-res').innerHTML= ok?'<span class="ok">Válido</span>':'<span class="bad">Ej: paridad demográfica, igualdad de oportunidades, equalized odds</span>';
    const s=load();s.p2=!!ok;save(s);
  });
  $('#m5p3').addEventListener('click',e=>{
    const b=e.target.closest('.tag'); if(!b)return; b.classList.toggle('active');
    const act=k=>document.querySelector(`[data-k=${k}]`).classList.contains('active');
    const ok=act('m1')&&act('m2')&&act('m4')&&!act('m3');
    $('#m5p3-res').innerHTML= ok?'<span class="ok">Correcto</span>':'<span class="bad">Mitigación: re-pesado, regularización, post-proceso; evita reglas triviales</span>';
    const s=load();s.p3=!!ok;save(s);
  });

  $('#m5p4').addEventListener('click',e=>{
    const b=e.target.closest('.tag'); if(!b)return; b.classList.toggle('active');
    const act=k=>document.querySelector(`[data-k=${k}]`).classList.contains('active');
    const ok=act('p1')&&act('p2')&&act('p4')&&!act('p3');
    $('#m5p4-res').innerHTML= ok?'<span class="ok">Correcto</span>':'<span class="bad">Privacidad: diferencial, federado, minimización</span>';
    const s=load();s.p4=!!ok;save(s);
  });

  document.querySelector('[data-check="m5p5"]').addEventListener('click',()=>{
    const v=$('#m5p5-input').value.trim().toLowerCase();
    const ok=['model card','datasheet','auditor','auditoría','log','bitácora','ruta','apelación','oversight','humano','revisión','comité','risk','riesgo'].some(k=>v.includes(k));
    $('#m5p5-res').innerHTML= ok?'<span class="ok">Buena dirección</span>':'<span class="bad">Incluye model card, auditorías, logs, revisión humana, apelaciones</span>';
    const s=load();s.p5=!!ok;save(s);
  });

  document.querySelector('[data-check="m5p6"]').addEventListener('click',()=>{
    const v=$('#m5p6-input').value.trim().toLowerCase();
    const attacks=['jailbreak','prompt injection','injection','fuga','exfiltr','toxic','toxici','sesgo','bias','spoof','evasion','evasive','poison','poisoning'];
    const mitig=['filtrado','filter','bloqueo','block','rate limit','ratelimit','limitación','moderación','review','revisión','humana','apelación','sandbox','aislamiento','segregación','monitor','alerta'];
    const aCount=attacks.filter(k=>v.includes(k)).length;
    const mCount=mitig.filter(k=>v.includes(k)).length;
    const ok=aCount>=2 && mCount>=2;
    $('#m5p6-res').innerHTML= ok?`<span class="ok">Bien: ataques ${aCount}, mitigaciones ${mCount}</span>`:'<span class="bad">Incluye ≥2 ataques (jailbreak, injection, fuga, toxicidad...) y ≥2 mitigaciones (filtrado, bloqueo, rate limit, revisión humana...)</span>';
    const s=load();s.p6=!!ok;save(s);
  });

  $('#m5-submit').addEventListener('click',async()=>{
    const names=[0,1,2,3,4,5,6].map(i=>`m5q${i}`);
    const ans=names.map((n)=>parseInt((document.querySelector(`input[name=${n}]:checked`)||{}).value));
    if(ans.some(isNaN))return;
    const solutions=[0,0,0,0,0,0,0];
    const correct=ans.filter((a,i)=>a===solutions[i]).length;
    const pass=correct/solutions.length>=0.8;
    if(!pass){shake($('#m5-q'));return}
    await markCompleted(5);
    closeModal();
    celebrate();
    renderGrid();
    updateProgressUI();
  });
}
function module4Content(){return `
<div class=\"m-tabs\"><button class=\"m-tab active\" data-t=\"c\">Contenido</button><button class=\"m-tab\" data-t=\"p\">Prácticas</button><button class=\"m-tab\" data-t=\"q\">Quiz</button></div>
<div class=\"m-body show\" id=\"m4-c\">
  <div class=\"m-section\">
    <h3>De prototipo a producción</h3>
    <ul>
      <li>Empaquetado: pipelines, artefactos, dependencias reproducibles.</li>
      <li>Versionado: modelos, datasets, esquemas y features.</li>
      <li>Contratos de datos: validaciones de esquema en ingreso.</li>
    </ul>

    <h3>Patrones de inferencia</h3>
    <ul>
      <li>Batch vs. tiempo real (online) y near-real-time.</li>
      <li>Sincronía: request/response vs. asíncrono (colas/eventos).</li>
      <li>Feature store para consistencia train/serve.</li>
    </ul>

    <h3>Despliegue y estrategias</h3>
    <ul>
      <li>Canary, Blue/Green, Shadow traffic.</li>
      <li>Feature flags y rollbacks rápidos.</li>
      <li>SLAs/SLOs de latencia y disponibilidad.</li>
    </ul>

    <h3>Monitoreo y observabilidad</h3>
    <ul>
      <li>SLIs: latencia p95/p99, tasa de errores 4xx/5xx, throughput.</li>
      <li>Métricas de modelo: deriva de datos, cambio de distribución, caída de precisión.</li>
      <li>Alertas accionables y tableros por versión.</li>
    </ul>

    <h3>Ejemplo real: Recomendador en producción</h3>
    <ol>
      <li>Sirve top-N recomendaciones con API de baja latencia (p95&lt;150ms).</li>
      <li>Shadow traffic al nuevo modelo por 1 semana; compara CTR y latencia.</li>
      <li>Promueve a canary 10% y aumenta si métricas cumplen SLO.</li>
      <li>Monitorea deriva de features (edad de ítem, popularidad) y CTR por cohorte.</li>
    </ol>
    <pre>
Prod (simple)
[feature store] -> [servicio modelo] -> [métricas SLIs] -> [alertas]
          ^                |                   |
          |                v                   v
      [batch ETL]     [canary/shadow]     [dashboards]
    </pre>

    <details class=\"m-callout\">
      <summary><strong>Glosario M4</strong></summary>
      <p><strong>Shadow:</strong> enruta tráfico al nuevo modelo sin afectar respuestas.</p>
      <p><strong>Canary:</strong> libera a un subconjunto pequeño de usuarios.</p>
      <p><strong>Skew train/serve:</strong> diferencias entre ingeniería de features en entrenamiento vs. servicio.</p>
    </details>

    <button class=\"btn ghost\" id=\"markReadM4\">Marcar como leído</button>
  </div>
</div>

<div class=\"m-body\" id=\"m4-p\">
  <div class=\"m-section\">
    <h3>Práctica 1: ¿Qué monitorear?</h3>
    <div class=\"task\" id=\"m4p1\">
      <div class=\"row\">Selecciona indicadores clave en producción:</div>
      <label><input type=\"checkbox\" value=\"a\"> Latencia p95</label>
      <label><input type=\"checkbox\" value=\"b\"> Número de commits al repositorio</label>
      <label><input type=\"checkbox\" value=\"c\"> Tasa de errores 5xx</label>
      <label><input type=\"checkbox\" value=\"d\"> Deriva de datos</label>
      <button class=\"btn primary\" data-check=\"m4p1\">Validar</button>
      <div class=\"row\" id=\"m4p1-res\"></div>
    </div>

    <h3>Práctica 2: Estrategia de despliegue</h3>
    <div class=\"task\" id=\"m4p2\">
      <div class=\"row\">Activa sólo estrategias seguras:</div>
      <div class=\"row\">
        <button class=\"btn ghost tag\" data-k=\"s1\">Canary</button>
        <button class=\"btn ghost tag\" data-k=\"s2\">Blue/Green</button>
        <button class=\"btn ghost tag\" data-k=\"s3\">Despliegue directo sin rollback</button>
        <button class=\"btn ghost tag\" data-k=\"s4\">Shadow</button>
      </div>
      <div class=\"row\" id=\"m4p2-res\"></div>
    </div>

    <h3>Práctica 3: Métricas a vigilar</h3>
    <div class=\"task\" id=\"m4p3\">
      <div class=\"row\">Escribe una métrica a monitorear (SLI/Modelo/Negocio):</div>
      <input type=\"text\" id=\"m4p3-input\" placeholder=\"Ej: latencia p95, deriva, precision, CTR, conversión\">
      <button class=\"btn primary\" data-check=\"m4p3\">Evaluar</button>
      <div class=\"row\" id=\"m4p3-res\"></div>
    </div>

    <h3>Práctica 4: Evitar skew train/serve</h3>
    <div class=\"task\" id=\"m4p4\">
      <div class=\"row\">Activa sólo lo que puede causar skew:</div>
      <div class=\"row\">
        <button class=\"btn ghost tag\" data-k=\"k1\">Calcular features con código distinto en serving</button>
        <button class=\"btn ghost tag\" data-k=\"k2\">Reutilizar el pipeline serializado para inferencia</button>
        <button class=\"btn ghost tag\" data-k=\"k3\">Normalizar con estadísticas de train+test</button>
        <button class=\"btn ghost tag\" data-k=\"k4\">Validar esquema y contratos de datos</button>
      </div>
      <div class=\"row\" id=\"m4p4-res\"></div>
    </div>

    <h3>Práctica 5: Plan de rollout/rollback</h3>
    <div class=\"task\" id=\"m4p5\">
      <div class=\"row\">Describe brevemente un plan seguro:</div>
      <input type=\"text\" id=\"m4p5-input\" placeholder=\"Ej: shadow -> canary 10% -> 50% -> 100% con rollback\">
      <button class=\"btn primary\" data-check=\"m4p5\">Evaluar</button>
      <div class=\"row\" id=\"m4p5-res\"></div>
    </div>
  </div>
</div>

<div class=\"m-body\" id=\"m4-q\"></div>
`}

function renderM4Quiz(){
  const qs=[
    {q:'Un objetivo del monitoreo en producción es:',o:['Detectar deriva, errores y latencia anómala','Reducir el almacenamiento','Incrementar el uso de CPU sin razón'],a:0},
    {q:'Una estrategia segura de despliegue es:',o:['Canary','Directo sin rollback','Deploy en horas pico sin métricas'],a:0},
    {q:'Para evitar skew, conviene:',o:['Usar el mismo pipeline serializado para servir','Calcular features con scripts distintos','Normalizar con todo el dataset'],a:0},
    {q:'Shadow traffic significa:',o:['Duplicar tráfico al nuevo modelo sin afectar respuestas','Desplegar al 100% inmediatamente','Aumentar batch size'],a:0},
    {q:'Un SLI típico es:',o:['Latencia p95','Longitud del nombre de archivo','Número de ramas en git'],a:0},
    {q:'Un indicador de deriva es:',o:['Cambio de distribución en features','Aumento de commits','Menos reuniones'],a:0},
    {q:'Para rollback rápido ayuda:',o:['Versionar artefactos y feature flags','Eliminar monitoreo','Ignorar alertas'],a:0}
  ];
  const quizHtml=qs.map((q,i)=>`<div class=\"q\"><div>${i+1}. ${q.q}</div>${q.o.map((opt,j)=>`<label><input type=\"radio\" name=\"m4q${i}\" value=\"${j}\"> <span>${opt}</span></label>`).join('')}</div>`).join('');
  return `<div class=\"quiz\">${quizHtml}<button class=\"btn primary\" id=\"m4-submit\">Enviar</button></div>`;
}

function handleM4Logic(){
  const tabs=$$('.m-tab');
  const bodies={c:$('#m4-c'),p:$('#m4-p'),q:$('#m4-q')};
  tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');Object.values(bodies).forEach(b=>b.classList.remove('show'));bodies[t.dataset.t].classList.add('show')}));
  const storeKey='vixai_m4';
  function load(){try{return JSON.parse(localStorage.getItem(storeKey)||'{}')}catch{return{}}}
  function save(s){localStorage.setItem(storeKey,JSON.stringify(s))}
  const st=load();
  if(st.read)$('#markReadM4').textContent='Leído';
  $('#markReadM4').addEventListener('click',()=>{const s=load();s.read=true;save(s);$('#markReadM4').textContent='Leído'});

  $('#m4-q').innerHTML=renderM4Quiz();

  document.querySelector('[data-check="m4p1"]').addEventListener('click',()=>{
    const vals=[...document.querySelectorAll('#m4p1 input[type=checkbox]')].filter(i=>i.checked).map(i=>i.value);
    const ok=vals.sort().join(',')==='a,c,d';
    $('#m4p1-res').innerHTML= ok?'<span class="ok">Correcto</span>':'<span class="bad">Claves: latencia p95, errores 5xx, deriva</span>';
    const s=load();s.p1=!!ok;save(s);
  });

  $('#m4p2').addEventListener('click',e=>{
    const b=e.target.closest('.tag'); if(!b)return; b.classList.toggle('active');
    const act=k=>document.querySelector(`[data-k=${k}]`).classList.contains('active');
    const ok=act('s1')&&act('s2')&&act('s4')&&!act('s3');
    $('#m4p2-res').innerHTML= ok?'<span class="ok">Correcto</span>':'<span class="bad">Usa canary/blue-green/shadow; evita despliegue directo sin rollback</span>';
    const s=load();s.p2=!!ok;save(s);
  });

  document.querySelector('[data-check="m4p3"]').addEventListener('click',()=>{
    const v=$('#m4p3-input').value.trim().toLowerCase();
    const ok=['latencia','p95','p99','deriva','drift','precision','recall','f1','auc','ctr','conversion','conversión','tasa','slo','sla','error'].some(k=>v.includes(k));
    $('#m4p3-res').innerHTML= ok?'<span class="ok">Válido</span>':'<span class="bad">Ej: latencia p95, 5xx, deriva, precision/recall, CTR</span>';
    const s=load();s.p3=!!ok;save(s);
  });

  $('#m4p4').addEventListener('click',e=>{
    const b=e.target.closest('.tag'); if(!b)return; b.classList.toggle('active');
    const act=k=>document.querySelector(`[data-k=${k}]`).classList.contains('active');
    const ok=act('k1')&&act('k3')&&!act('k2')&&!act('k4');
    $('#m4p4-res').innerHTML= ok?'<span class="ok">Correcto</span>':'<span class="bad">Causas: código distinto de features o stats incorrectas</span>';
    const s=load();s.p4=!!ok;save(s);
  });

  document.querySelector('[data-check="m4p5"]').addEventListener('click',()=>{
    const v=$('#m4p5-input').value.trim().toLowerCase();
    const ok=['shadow','canary','blue','green','rollback','feature flag','feature-flag'].some(k=>v.includes(k));
    $('#m4p5-res').innerHTML= ok?'<span class="ok">Buena dirección</span>':'<span class="bad">Ej: shadow -> canary 10% -> 50% -> 100% con rollback</span>';
    const s=load();s.p5=!!ok;save(s);
  });

  $('#m4-submit').addEventListener('click',async()=>{
    const names=[0,1,2,3,4,5,6].map(i=>`m4q${i}`);
    const ans=names.map((n)=>parseInt((document.querySelector(`input[name=${n}]:checked`)||{}).value));
    if(ans.some(isNaN))return;
    const solutions=[0,0,0,0,0,0,0];
    const correct=ans.filter((a,i)=>a===solutions[i]).length;
    const pass=correct/solutions.length>=0.8;
    if(!pass){shake($('#m4-q'));return}
    await markCompleted(4);
    closeModal();
    celebrate();
    renderGrid();
    updateProgressUI();
  });
}
function module3Content(){return `
<div class="m-tabs"><button class="m-tab active" data-t="c">Contenido</button><button class="m-tab" data-t="p">Prácticas</button><button class="m-tab" data-t="q">Quiz</button></div>
<div class="m-body show" id="m3-c">
  <div class="m-section">
    <h3>Bucle de entrenamiento</h3>
    <ol>
      <li>Forward: calcula predicciones y pérdida.</li>
      <li>Backward: calcula gradientes (backprop).</li>
      <li>Update: optimizador actualiza parámetros.</li>
    </ol>

    <h3>Pérdida y optimización</h3>
    <ul>
      <li>Pérdidas comunes: CE para clasificación, MSE/MAE para regresión.</li>
      <li>Optimizadores: SGD(+momentum), Adam/AdamW.</li>
      <li>Tasa de aprendizaje (LR): el hiperparámetro más sensible.</li>
    </ul>

    <h3>Regularización</h3>
    <ul>
      <li>L2 (weight decay), Dropout, Data augmentation.</li>
      <li>Early stopping y checkpointing de mejores pesos.</li>
    </ul>

    <h3>Búsqueda de hiperparámetros</h3>
    <ul>
      <li>Empieza simple: LR, batch size, weight decay.</li>
      <li>Estrategias: grid/random, bayesiana. Limita épocas y usa <em>pruning</em>.</li>
    </ul>

    <h3>Curvas y diagnósticos</h3>
    <ul>
      <li>Overfitting: loss train ↓ mientras val ↑ o métrica val ↓.</li>
      <li>Underfitting: ambos errores altos.</li>
      <li>Gradientes inestables: usa clipping/normalización.</li>
    </ul>

    <h3>Ejemplo real: Clasificación de defectos en imágenes</h3>
    <ol>
      <li>Datos: imágenes etiquetadas por tipo de defecto; split estratificado por lote/tiempo.</li>
      <li>Modelo: CNN pequeña; augmentations (flip, rotación leve, color jitter).</li>
      <li>Optimización: AdamW, LR=3e-4, scheduler OneCycle con 10 épocas.</li>
      <li>Regularización: weight decay=1e-2, dropout 0.2; early stopping (paciencia=3).</li>
      <li>Seguimiento: curva LR, loss/métrica por época; guarda mejor checkpoint por val_F1.</li>
    </ol>
    <pre>
Entrenamiento (simple)
[datos] -> [loader] -> [forward] -> [loss]
                      |              |
                      v              |
                   [backward] <------
                      |
                [optimizer.step]
                      |
                [scheduler.step]
                      |
             [validación/early stop]
    </pre>

    <details class="m-callout">
      <summary><strong>Glosario M3</strong></summary>
      <p><strong>OneCycleLR:</strong> política de LR con warmup y decaimiento.</p>
      <p><strong>Checkpoint:</strong> guardado de pesos para reanudar/mejor modelo.</p>
      <p><strong>Gradient clipping:</strong> límite al tamaño de gradientes para estabilidad.</p>
    </details>

    <button class="btn ghost" id="markReadM3">Marcar como leído</button>
  </div>
</div>

<div class="m-body" id="m3-p">
  <div class="m-section">
    <h3>Práctica 1: Detectar overfitting</h3>
    <div class="task" id="m3p1">
      <div class="row">Selecciona los patrones que indican sobreajuste:</div>
      <label><input type="checkbox" value="a"> Loss train baja, loss valid sube</label>
      <label><input type="checkbox" value="b"> Accuracy train y valid suben juntas</label>
      <label><input type="checkbox" value="c"> Gap creciente entre train y valid</label>
      <button class="btn primary" data-check="m3p1">Validar</button>
      <div class="row" id="m3p1-res"></div>
    </div>

    <h3>Práctica 2: Regularización efectiva</h3>
    <div class="task" id="m3p2">
      <div class="row">Activa sólo las opciones que ayudan a reducir sobreajuste:</div>
      <div class="row">
        <button class="btn ghost tag" data-k="r1">L2 / weight decay</button>
        <button class="btn ghost tag" data-k="r2">Early stopping monitoreando train_loss</button>
        <button class="btn ghost tag" data-k="r3">Dropout</button>
        <button class="btn ghost tag" data-k="r4">Data augmentation</button>
      </div>
      <div class="row" id="m3p2-res"></div>
    </div>

    <h3>Práctica 3: Tasa de aprendizaje</h3>
    <div class="task" id="m3p3">
      <div class="row">Escribe una estrategia de LR o scheduler válida:</div>
      <input type="text" id="m3p3-input" placeholder="Ej: cosine, one-cycle, warmup, decay">
      <button class="btn primary" data-check="m3p3">Evaluar</button>
      <div class="row" id="m3p3-res"></div>
    </div>

    <h3>Práctica 4: Early stopping correcto</h3>
    <div class="task" id="m3p4">
      <div class="row">Activa sólo configuraciones correctas para early stopping:</div>
      <div class="row">
        <button class="btn ghost tag" data-k="e1">Monitorear val_loss/val_F1</button>
        <button class="btn ghost tag" data-k="e2">Monitorear train_loss</button>
        <button class="btn ghost tag" data-k="e3">Paciencia 3-5</button>
        <button class="btn ghost tag" data-k="e4">Restaurar mejores pesos</button>
      </div>
      <div class="row" id="m3p4-res"></div>
    </div>

    <h3>Práctica 5: Elegir optimizador</h3>
    <div class="task" id="m3p5">
      <div class="row">Para una red profunda, sugiere un optimizador razonable:</div>
      <input type="text" id="m3p5-input" placeholder="Ej: Adam, AdamW, SGD con momentum">
      <button class="btn primary" data-check="m3p5">Evaluar</button>
      <div class="row" id="m3p5-res"></div>
    </div>
  </div>
</div>

<div class="m-body" id="m3-q"></div>
`}

function renderM3Quiz(){
  const qs=[
    {q:'La función de pérdida sirve para:',o:['Medir el error para guiar la optimización','Guardar checkpoints','Aumentar datos'],a:0},
    {q:'La LR controla:',o:['El tamaño del paso en la actualización','El tamaño del dataset','El número de épocas'],a:0},
    {q:'Early stopping debe monitorear:',o:['Métrica/pérdida de validación','Solo pérdida de entrenamiento','Tamaño de batch'],a:0},
    {q:'AdamW se diferencia de Adam por:',o:['Usar weight decay desacoplado','Quitar el momentum','No usar bias correction'],a:0},
    {q:'Para sobreajuste, ayuda más:',o:['Más capas siempre','Dropout/Data augmentation/L2','Aprender sin validación'],a:1},
    {q:'Para gradientes explosivos:',o:['Gradient clipping','Subir LR','Quitar normalización'],a:0},
    {q:'Mini-batch learning significa:',o:['Actualizar por grupos de ejemplos','Actualizar por cada ejemplo siempre','Actualizar solo al final de la época'],a:0}
  ];
  const quizHtml=qs.map((q,i)=>`<div class="q"><div>${i+1}. ${q.q}</div>${q.o.map((opt,j)=>`<label><input type="radio" name="m3q${i}" value="${j}"> <span>${opt}</span></label>`).join('')}</div>`).join('');
  return `<div class="quiz">${quizHtml}<button class="btn primary" id="m3-submit">Enviar</button></div>`;
}

function handleM3Logic(){
  const tabs=$$('.m-tab');
  const bodies={c:$('#m3-c'),p:$('#m3-p'),q:$('#m3-q')};
  tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');Object.values(bodies).forEach(b=>b.classList.remove('show'));bodies[t.dataset.t].classList.add('show')}));
  const storeKey='vixai_m3';
  function load(){try{return JSON.parse(localStorage.getItem(storeKey)||'{}')}catch{return{}}}
  function save(s){localStorage.setItem(storeKey,JSON.stringify(s))}
  const st=load();
  if(st.read)$('#markReadM3').textContent='Leído';
  $('#markReadM3').addEventListener('click',()=>{const s=load();s.read=true;save(s);$('#markReadM3').textContent='Leído'});

  $('#m3-q').innerHTML=renderM3Quiz();

  document.querySelector('[data-check="m3p1"]').addEventListener('click',()=>{
    const vals=[...document.querySelectorAll('#m3p1 input[type=checkbox]')].filter(i=>i.checked).map(i=>i.value);
    const ok=vals.sort().join(',')==='a,c';
    $('#m3p1-res').innerHTML= ok?'<span class="ok">Correcto</span>':'<span class="bad">Señales: a y c</span>';
    const s=load();s.p1=!!ok;save(s);
  });

  $('#m3p2').addEventListener('click',e=>{
    const b=e.target.closest('.tag'); if(!b)return; b.classList.toggle('active');
    const act=k=>document.querySelector(`[data-k=${k}]`).classList.contains('active');
    const ok=act('r1')&&act('r3')&&act('r4')&&!act('r2');
    $('#m3p2-res').innerHTML= ok?'<span class="ok">Correcto</span>':'<span class="bad">Activa r1, r3 y r4; evita r2</span>';
    const s=load();s.p2=!!ok;save(s);
  });

  document.querySelector('[data-check="m3p3"]').addEventListener('click',()=>{
    const v=$('#m3p3-input').value.trim().toLowerCase();
    const ok=['cosine','onecycle','one-cycle','warmup','decay','scheduler','reduce lr','step lr','exponential'].some(k=>v.includes(k));
    $('#m3p3-res').innerHTML= ok?'<span class="ok">Válido</span>':'<span class="bad">Ej: cosine/one-cycle/warmup/decay</span>';
    const s=load();s.p3=!!ok;save(s);
  });

  $('#m3p4').addEventListener('click',e=>{
    const b=e.target.closest('.tag'); if(!b)return; b.classList.toggle('active');
    const act=k=>document.querySelector(`[data-k=${k}]`).classList.contains('active');
    const ok=act('e1')&&act('e3')&&act('e4')&&!act('e2');
    $('#m3p4-res').innerHTML= ok?'<span class="ok">Correcto</span>':'<span class="bad">Monitorea validación; usa paciencia y restaura mejores pesos</span>';
    const s=load();s.p4=!!ok;save(s);
  });

  document.querySelector('[data-check="m3p5"]').addEventListener('click',()=>{
    const v=$('#m3p5-input').value.trim().toLowerCase();
    const ok=v.includes('adam')||v.includes('adamw')||v.includes('sgd')&&v.includes('moment');
    $('#m3p5-res').innerHTML= ok?'<span class="ok">Buena elección</span>':'<span class="bad">Sugerencia: Adam/AdamW o SGD con momentum</span>';
    const s=load();s.p5=!!ok;save(s);
  });

  $('#m3-submit').addEventListener('click',async()=>{
    const names=[0,1,2,3,4,5,6].map(i=>`m3q${i}`);
    const ans=names.map((n)=>parseInt((document.querySelector(`input[name=${n}]:checked`)||{}).value));
    if(ans.some(isNaN))return; // incompleto
    const solutions=[0,0,0,0,1,0,0];
    const correct=ans.filter((a,i)=>a===solutions[i]).length;
    const pass=correct/solutions.length>=0.8;
    if(!pass){shake($('#m3-q'));return}
    await markCompleted(3);
    closeModal();
    celebrate();
    renderGrid();
    updateProgressUI();
  });
}
function openModule(id){
  if(id===1){openModal(module1Content());handleM1Logic();return}
  if(id===2){openModal(module2Content());handleM2Logic();return}
  if(id===3){openModal(module3Content());handleM3Logic();return}
  if(id===4){openModal(module4Content());handleM4Logic();return}
  if(id===5){openModal(module5Content());handleM5Logic();return}
  const m=modules.find(x=>x.id===id);
  const quizHtml=m.quiz.map((q,i)=>`<div class="q"><div>${i+1}. ${q.q}</div>${q.o.map((opt,j)=>`<label><input type=\"radio\" name=\"q${i}\" value=\"${j}\"> <span>${opt}</span></label>`).join('')}</div>`).join('');
  openModal(`<h3>${m.title}</h3><p>${m.desc}</p><div class="quiz" id="quiz">${quizHtml}<button class="btn primary" id="submitQuiz">Enviar respuestas</button></div>`);
  $('#submitQuiz').addEventListener('click',async()=>{
    const answers=m.quiz.map((q,i)=>parseInt((document.querySelector(`input[name=\"q${i}\"]:checked`)||{}).value));
    if(answers.some(isNaN))return pulse($('#submitQuiz'));
    const correct=answers.filter((a,i)=>a===m.quiz[i].a).length;
    if(correct!==m.quiz.length)return shake($('#quiz'));
    await markCompleted(id);
    closeModal();
    celebrate();
    renderGrid();
    updateProgressUI();
  })
}
function pulse(el){el.animate([{transform:'scale(1)'},{transform:'scale(1.03)'},{transform:'scale(1)'}],{duration:300})}
function shake(el){el.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:260})}
async function markCompleted(moduleId){userProgress.add(moduleId);localStorage.setItem('vixai_progress',JSON.stringify([...userProgress]));if(currentUser){try{await sb('progreso',{method:'POST',body:{usuario_id:currentUser.id, módulo:moduleId, completado:true}})}catch(e){}}
}
async function fetchProgress(){userProgress=new Set(JSON.parse(localStorage.getItem('vixai_progress')||'[]'));if(currentUser){try{const rows=await sb('progreso',{query:{select:'"módulo",completado',usuario_id:`eq.${currentUser.id}`}});rows.filter(r=>r.completado).forEach(r=>userProgress.add(r["módulo"]))}catch(e){}}}
async function loginHandler(e){e.preventDefault();const email=$('#logEmail').value.trim().toLowerCase();const pass=$('#logPassword').value;const hash=await sha256(pass);try{const rows=await sb('usuarios',{query:{select:'id,nombre_completo,email,password_hash',email:`eq.${email}`}});if(!rows.length)return shake(loginForm);const user=rows[0];if(user.password_hash!==hash)return shake(loginForm);saveSession(user);showAvatar();await fetchProgress();showModules()}catch(err){shake(loginForm)}}
async function registerHandler(e){
 e.preventDefault();
 const nombre=$('#regNombre').value.trim();
 const email=$('#regEmail').value.trim().toLowerCase();
 const pass=$('#regPassword').value;
 if(!nombre||!email||pass.length<6){
  return shake(registerForm);
 }
 try{
  const exists=await sb('usuarios',{query:{select:'id',email:`eq.${email}`,limit:1}});
  if(exists && exists.length){
   return shake(registerForm);
  }
  const hash=await sha256(pass);
  await sb('usuarios',{
    method:'POST',
    body:{
      nombre_completo:nombre,
      email,
      password_hash:hash,
      seccion:'general'
    },
    headers:{Prefer:'return=minimal'}
  });
  const createdRows = await sb('usuarios',{query:{select:'id,nombre_completo,email',email:`eq.${email}`,limit:1}});
  const user=createdRows && createdRows[0];
  if(!user){
   return shake(registerForm);
  }
  saveSession(user);
  showAvatar();
  await fetchProgress();
  showModules();
 }catch(err){
  if(err && err.status===409){
    console.warn('Email ya registrado');
  }
  shake(registerForm);
 }
}
function handleTabs(){
  tabs.forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
  const tabsContainer=document.querySelector('.tabs');
  if(tabsContainer){
    tabsContainer.addEventListener('click',e=>{
      const btn=e.target.closest('.tab');
      if(!btn)return;
      switchTab(btn.dataset.tab);
    });
  }
  window.addEventListener('resize',moveUnderline);
  moveUnderline();
}
function handleAvatar(){avatarCircle.addEventListener('click',()=>{avatarMenu.classList.toggle('show')});document.addEventListener('click',e=>{if(!avatar.contains(e.target))avatarMenu.classList.remove('show')});avatarMenu.addEventListener('click',e=>{const a=e.target.closest('button')?.dataset.action;if(!a)return;if(a==='logout'){clearSession();userProgress=new Set(JSON.parse(localStorage.getItem('vixai_progress')||'[]'));showAuth();hideModules()}if(a==='perfil'){openModal(`<h3>Perfil</h3><p><strong>Nombre:</strong> ${currentUser?.nombre_completo||'-'}</p><p><strong>Email:</strong> ${currentUser?.email||'-'}</p>`)}if(a==='progreso'){const items=modules.map(m=>`<li>${m.title} — ${userProgress.has(m.id)?'Completado':'Pendiente'}</li>`).join('');openModal(`<h3>Progreso</h3><ul>${items}</ul>`)}avatarMenu.classList.remove('show')})}
function handleCTA(){ctaExplore.addEventListener('click',()=>{if(currentUser){showModules()}else{nudgeAuth()}})}
function handleModal(){modalClose.addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal()})}
function handleHelp(){helpLink.addEventListener('click',e=>{e.preventDefault();helpView.hidden=false});helpClose.addEventListener('click',()=>helpView.hidden=true);helpView.addEventListener('click',e=>{if(e.target===helpView)helpView.hidden=true})}
function setupConfetti(){const ctx=confettiCanvas.getContext('2d');function resize(){confettiCanvas.width=innerWidth;confettiCanvas.height=innerHeight}window.addEventListener('resize',resize);resize();let pieces=[];let raf=null;function spawn(n=100){for(let i=0;i<n;i++){pieces.push({x:Math.random()*confettiCanvas.width,y:-20-Math.random()*200,w:6+Math.random()*6,h:10+Math.random()*10,vy:2+Math.random()*3,vx:-2+Math.random()*4,rot:Math.random()*Math.PI,vr:-.2+Math.random()*.4,color:`hsl(${260+Math.random()*60} 90% 60% / ${.6+Math.random()*.4})`})}}
function step(){ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);pieces.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore()});pieces=pieces.filter(p=>p.y<confettiCanvas.height+40);if(pieces.length===0||document.hidden){cancelAnimationFrame(raf);raf=null;return}raf=requestAnimationFrame(step)}function start(){if(!raf){raf=requestAnimationFrame(step)}}document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=null}});return()=>{spawn(120);start();setTimeout(()=>{pieces=[]},2200)}}
let triggerConfetti;function celebrate(){if(!triggerConfetti)triggerConfetti=setupConfetti();triggerConfetti()}
function setupLiquidHover(){let tx=50,ty=50,cx=50,cy=50,raf=null,last=0;function setTarget(e){const r=hero.getBoundingClientRect();const x=((e.clientX||0)-r.left)/r.width*100;const y=((e.clientY||0)-r.top)/r.height*100;tx=Math.max(0,Math.min(100,x));ty=Math.max(0,Math.min(100,y));last=performance.now()}function loop(){cx+=(tx-cx)*0.12;cy+=(ty-cy)*0.12;hero.style.setProperty('--mx',cx+'%');hero.style.setProperty('--my',cy+'%');const idle=performance.now()-last>350;const near=Math.abs(tx-cx)<.05&&Math.abs(ty-cy)<.05;if((idle&&near)||document.hidden){cancelAnimationFrame(raf);raf=null;return}raf=requestAnimationFrame(loop)}function start(){if(!raf){last=performance.now();raf=requestAnimationFrame(loop)}}function stop(){tx=50;ty=50;last=performance.now()}hero.addEventListener('mousemove',e=>{setTarget(e);start()});hero.addEventListener('mouseenter',()=>start());hero.addEventListener('mouseleave',()=>stop());hero.addEventListener('touchmove',e=>{const t=e.touches[0];if(!t)return;setTarget(t);start()},{passive:true});hero.addEventListener('touchend',()=>stop());document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=null}})}
function setupGlobalGlow(){const bg=document.querySelector('.bg');if(!bg)return;let tx=50,ty=85,cx=50,cy=85,raf=null,last=0;function setTargetPos(x,y){tx=Math.max(0,Math.min(100,x));ty=Math.max(0,Math.min(100,y));last=performance.now()}function onPoint(e){const x=e.clientX/innerWidth*100;const y=e.clientY/innerHeight*100;setTargetPos(x,y)}function onTouch(e){const t=e.touches[0];if(!t)return;const x=t.clientX/innerWidth*100;const y=t.clientY/innerHeight*100;setTargetPos(x,y)}function loop(){cx+=(tx-cx)*0.08;cy+=(ty-cy)*0.08;bg.style.setProperty('--gx',cx+'%');bg.style.setProperty('--gy',cy+'%');const idle=performance.now()-last>300;const near=Math.abs(tx-cx)<.05&&Math.abs(ty-cy)<.05;if((idle&&near)||document.hidden){cancelAnimationFrame(raf);raf=null;return}raf=requestAnimationFrame(loop)}function start(){if(!raf){last=performance.now();raf=requestAnimationFrame(loop)}}window.addEventListener('mousemove',e=>{onPoint(e);start()});window.addEventListener('touchmove',e=>{onTouch(e);start()},{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=null}})}
function restoreUI(){loadSession();if(currentUser){showAvatar()}else{showAuth()}fetchProgress().then(()=>{if(currentUser){showModules()}})}
registerForm.addEventListener('submit',registerHandler);loginForm.addEventListener('submit',loginHandler);handleTabs();handleAvatar();handleCTA();handleModal();handleHelp();restoreUI();
setupLiquidHover();
setupGlobalGlow();


