export function buildSidebar(){
  const wrap = document.createElement('div');
  wrap.className = 'sidebar';
  wrap.innerHTML = `
    <div class="brand">
      <img class="brand-logo" src="./IMG/LOGO ND D ANIMATION.png" alt="L"/>
      <span>HACKING PREMIUM SERVICES</span>
    </div>
    <nav>
      <a href="#/admin-panel">Admin Panel</a>
      <a href="#/administration">Administration</a>
      <a href="#/functions">1337</a>
      <a href="#/h-functions">TOOLS</a>
      <a href="#/l-premium">HACKING PREMIUM TOOLS</a>
    </nav>
  `;
  return wrap;
}
