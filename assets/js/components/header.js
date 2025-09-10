import { state } from '../core/state.js';
import { getSupa } from '../services/supabaseClient.js';

export function buildHeader(){
  const header = document.createElement('div');
  header.className = 'nav';
  header.innerHTML = `
    <div class="brand">
      <img class="brand-logo" src="./IMG/LOGO ND D ANIMATION.png" alt="L"/>
      <span>HACKING PREMIUM SERVICES</span>
    </div>
    <nav class="nav-links">
      <a href="#/admin-panel" class="nav-link" id="navPanel" style="display: none;">Panel</a>
      <a href="#/login" class="nav-link" id="navLogin">Iniciar sesión</a>
      <a href="#/login" class="nav-link" id="navLogout" style="display: none;">Cerrar sesión</a>
    </nav>
  `;

  const updateAuthUI = () => {
    console.log('[header] updateAuthUI, session:', state.session);
    const navPanel = header.querySelector('#navPanel');
    const navLogin = header.querySelector('#navLogin');
    const navLogout = header.querySelector('#navLogout');

    if (state.session) {
      if (navPanel) navPanel.style.display = 'inline-block';
      if (navLogin) navLogin.style.display = 'none';
      if (navLogout) navLogout.style.display = 'inline-block';
    } else {
      if (navPanel) navPanel.style.display = 'none';
      if (navLogin) navLogin.style.display = 'inline-block';
      if (navLogout) navLogout.style.display = 'none';
    }
  };

  const navLogout = header.querySelector('#navLogout');
  if (navLogout) {
    navLogout.addEventListener('click', async (e) => {
      e.preventDefault();
      const supa = await getSupa();
      await supa.auth.signOut();
      window.location.hash = '#/login';
    });
  }

  window.addEventListener('auth:changed', updateAuthUI);

  updateAuthUI();

  return header;
}
