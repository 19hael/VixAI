export function buildHeader(){
  const header = document.createElement('div');
  header.className = 'nav';
  header.innerHTML = `
    <div class="brand">
      <img class="brand-logo" src="./IMG/LOGO ND D ANIMATION.png" alt="L"/>
      <span>Lost Premium Services</span>
    </div>
    <nav class="nav-links">
      <a href="#/admin-panel" class="nav-link" id="navPanel" style="display: none;">Panel</a>
      <a href="#/login" class="nav-link" id="navLogin">Iniciar sesión</a>
      <a href="#/login" class="nav-link" id="navLogout" style="display: none;">Cerrar sesión</a>
    </nav>
  `;
  
  // Actualizar la UI según el estado de autenticación
  const updateAuthUI = () => {
    const navPanel = header.querySelector('#navPanel');
    const navLogin = header.querySelector('#navLogin');
    const navLogout = header.querySelector('#navLogout');
    
    if (window.state?.session) {
      // Usuario autenticado
      if (navPanel) navPanel.style.display = 'inline-block';
      if (navLogin) navLogin.style.display = 'none';
      if (navLogout) navLogout.style.display = 'inline-block';
    } else {
      // Usuario no autenticado
      if (navPanel) navPanel.style.display = 'none';
      if (navLogin) navLogin.style.display = 'inline-block';
      if (navLogout) navLogout.style.display = 'none';
    }
  };
  
  // Configurar el evento de cierre de sesión
  const navLogout = header.querySelector('#navLogout');
  if (navLogout) {
    navLogout.addEventListener('click', async (e) => {
      e.preventDefault();
      const supa = await import('../services/supabaseClient.js').then(m => m.getSupa());
      await supa.auth.signOut();
      window.location.hash = '#/login';
    });
  }
  
  // Escuchar cambios en la autenticación
  window.addEventListener('auth:changed', updateAuthUI);
  
  // Actualizar UI con el estado actual
  updateAuthUI();
  
  return header;
}
