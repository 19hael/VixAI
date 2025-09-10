export const state = {
  session: null,            
  user: null,              
  site: {
    title: 'HACKING SERVICES',
    subtitle: 'INFECCIONES DE RANSOWARE • ATAQUES DDoS • DOXEOS',
    description: 'Plataforma de administración y funciones premium',
  },
};

export function setSiteParams(params){
  state.site = { ...state.site, ...params };
  const titleEl = document.querySelector('.site-title');
  const subtitleEl = document.querySelector('.site-subtitle');
  if(titleEl) titleEl.textContent = state.site.title;
  if(subtitleEl) subtitleEl.textContent = state.site.subtitle;
  document.title = state.site.title;
}
