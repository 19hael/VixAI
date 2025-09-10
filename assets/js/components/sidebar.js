export function buildSidebar(){
  const wrap = document.createElement('div');
  wrap.className = 'sidebar';
  wrap.innerHTML = `
    <div class="brand">
      <img class="brand-logo" src="./IMG/LOGO ND D ANIMATION.png" alt="L"/>
      <span>Lost Premium</span>
    </div>
    <nav>
      <a href="#/admin-panel">Admin Panel</a>
      <a href="#/administration">Administration</a>
      <a href="#/functions">Functions</a>
      <a href="#/h-functions">H Functions</a>
      <a href="#/l-premium">L Premium</a>
    </nav>
  `;
  return wrap;
}
