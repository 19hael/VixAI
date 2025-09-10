const PLATFORMS = [
  { key:'instagram', name:'Instagram', url:(u)=>`https://www.instagram.com/${u}/` },
  { key:'x', name:'X (Twitter)', url:(u)=>`https://x.com/${u}` },
  { key:'twitter', name:'Twitter (legacy)', url:(u)=>`https://twitter.com/${u}` },
  { key:'facebook', name:'Facebook', url:(u)=>`https://www.facebook.com/${u}` },
  { key:'tiktok', name:'TikTok', url:(u)=>`https://www.tiktok.com/@${u}` },
  { key:'youtube', name:'YouTube', url:(u)=>`https://www.youtube.com/@${u}` },
  { key:'twitch', name:'Twitch', url:(u)=>`https://www.twitch.tv/${u}` },
  { key:'github', name:'GitHub', url:(u)=>`https://github.com/${u}` },
  { key:'gitlab', name:'GitLab', url:(u)=>`https://gitlab.com/${u}` },
  { key:'reddit', name:'Reddit', url:(u)=>`https://www.reddit.com/user/${u}` },
  { key:'pinterest', name:'Pinterest', url:(u)=>`https://www.pinterest.com/${u}/` },
  { key:'medium', name:'Medium', url:(u)=>`https://medium.com/@${u}` },
  { key:'devto', name:'DEV.to', url:(u)=>`https://dev.to/${u}` },
  { key:'linkedin', name:'LinkedIn', url:(u)=>`https://www.linkedin.com/in/${u}` },
  { key:'snapchat', name:'Snapchat', url:(u)=>`https://www.snapchat.com/add/${u}` },
  { key:'soundcloud', name:'SoundCloud', url:(u)=>`https://soundcloud.com/${u}` },
  { key:'telegram', name:'Telegram', url:(u)=>`https://t.me/${u}` },
  { key:'vk', name:'VK', url:(u)=>`https://vk.com/${u}` },
  { key:'behance', name:'Behance', url:(u)=>`https://www.behance.net/${u}` },
  { key:'dribbble', name:'Dribbble', url:(u)=>`https://dribbble.com/${u}` },
];

function iconSVG(key){
  const map = {
    instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6-2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h4l6 7 6-7h4l-8 9 8 9h-4l-6-7-6 7H3l8-9z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.8c-.7.3-1.4.5-2.1.6.8-.5 1.3-1.2 1.6-2-.8.5-1.6.8-2.5 1A3.6 3.6 0 0 0 12 7.5c0 .3 0 .6.1.9A10.2 10.2 0 0 1 3 5.2a3.6 3.6 0 0 0 1.1 4.8c-.6 0-1.1-.2-1.6-.4v.1c0 1.7 1.2 3.2 2.9 3.6-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.4 1.8 2.5 3.4 2.5A7.2 7.2 0 0 1 2 18c1.6 1 3.5 1.6 5.5 1.6 6.6 0 10.2-5.5 10.2-10.2v-.5c.7-.5 1.3-1.2 1.8-2.1z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v3H8v3h3v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 3a5 5 0 0 0 5 5V5a7 7 0 0 1-5-2zM6 14a5 5 0 0 0 9 3v-6a9 9 0 0 0 5 2V9a9 9 0 0 1-5-2v8a3 3 0 1 1-3-3 3 3 0 0 1 1 .2V9a6 6 0 1 0-7 5z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 8s0-3-3-3H4C1 5 1 8 1 8v8s0 3 3 3h16c3 0 3-3 3-3V8zM10 9l6 3-6 3V9z"/></svg>',
    twitch: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h17v11l-5 5h-4l-3 3H7v-3H4V3zm3 2v9h2v3l3-3h4l3-3V5H7zm8 2h2v5h-2V7zm-5 0h2v5H10V7z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3 19c.5.1.7-.2.7-.5v-2c-3 .6-3.6-1.4-3.6-1.4-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.6-.7 1.6-.7-.9-.1-1.9-.5-2.4-1.4-.3-.6-.5-1.3-.5-2 0-3 2-4.4 4.3-4.6-.3-.4-.4-.9-.4-1.5 0-1.1.3-1.9.8-2.5 0 0 .6-.2 2 .8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2-.8 2-.8.5.6.8 1.4.8 2.5 0 .6-.1 1.1-.4 1.5 2.4.3 4.3 1.6 4.3 4.6 0 2.7-1.8 4.5-4.3 4.8.2.2.4.6.4 1.2v3c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>',
    gitlab: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22l-9-7 3-9 3 7h6l3-7 3 9-9 7z"/></svg>',
    reddit: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a5 5 0 0 1-2.1 4.1c.1.3.1.6.1.9 0 2.9-3.8 5-8 5s-8-2.1-8-5c0-.3 0-.6.1-.9A5 5 0 1 1 22 12zM9 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM8 16c.8.6 2.4 1 4 1s3.2-.4 4-1"/></svg>',
    pinterest: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.5 19.4c-.1-.8-.2-2.1 0-3 0-.8 1.8-7.7 1.8-7.7s-.4-.9-.4-2.2c0-2.1 1.2-3.7 2.6-3.7 1.2 0 1.8.9 1.8 2 0 1.2-.8 3-1.2 4.7-.3 1.4.7 2.5 2 2.5 2.4 0 4.2-2.5 4.2-6.1 0-3.2-2.3-5.4-5.6-5.4-3.8 0-6.2 2.8-6.2 5.9 0 1.2.5 2.5 1.1 3.2.1.1.1.2.1.3-.1.3-.3 1-.4 1.1-.1.2-.2.2-.4.1-1.4-.6-2.3-2.4-2.3-3.8 0-3.1 2.2-6 6.5-6 3.4 0 6 .2 7.7 2.8 1.3 2 1.1 6.6-2.2 8.8-1.2.8-3.4.8-4.5 0-.3-.2-.7-.5-.8-.8-.2.8-.5 1.6-.6 2.4-.2.8-.1 2-.1 2.3-.1.2-.2.3-.3.5-.1.1-.2.2-.3.1A10 10 0 0 1 12 2z"/></svg>',
    medium: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 7l6 10 4-7 4 7 6-10H2z"/></svg>',
    devto: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v16H3V4zm5 4H6v8h2c1 0 2-1 2-2V10c0-1-1-2-2-2zm4 0h2v8h-2V8zm5 0h-2v8h2c1 0 2-1 2-2V10c0-1-1-2-2-2z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM4 10h4v10H4V10zm6 0h4v2a4 4 0 0 1 7 3v5h-4v-5a2 2 0 0 0-4 0v5h-3V10z"/></svg>',
    snapchat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-3 0-5 2.3-5 5.1 0 1-.3 1.8-.8 2.6C5.5 10.4 6.7 11 8 11.3V14c-1.2.7-2.6 1.2-4 1.4.7.8 1.6 1.5 2.7 1.9 1.3.5 2.7.9 3.3 1.8.3.4.5 1 1 1 .5 0 .7-.6 1-1 .6-.9 2-1.3 3.3-1.8 1.1-.4 2-.9 2.7-1.9-1.4-.2-2.8-.7-4-1.4v-2.7c1.3-.3 2.5-.9 3.8-1.6-.5-.8-.8-1.6-.8-2.6C17 4.3 15 2 12 2z"/></svg>',
    soundcloud: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 7a5 5 0 0 1 5 5h3a3 3 0 1 1 0 6H7a4 4 0 1 1 0-8c.3 0 .7 0 1 .1A5 5 0 0 1 11 7z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 3L3 11l6 2 2 6 4-5 4-11z"/></svg>',
    vk: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h4l3 5-3 7H6l2-5-5-7zM21 6h-4l-3 5 3 7h1l-2-5 5-7z"/></svg>',
    behance: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h7a3 3 0 1 1 0 6 3 3 0 1 1 0 6H3V6zm12 0h6v2h-6V6zm0 4h6v8h-3a4 4 0 1 1 0-8z"/></svg>',
    dribbble: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 8.5c-2.4-.4-4.8-.3-7.2.1-.5-1-1.1-2-1.8-2.9 3.6-1.7 6.8-1 9 2.8zM9.5 5.9c.7.9 1.3 1.9 1.8 2.9-2.1.6-4.1 1.6-5.9 2.9-.6-2.7.6-5 4.1-5.8zM5.2 13.6c1.9-1.4 4.1-2.4 6.4-2.9.3.7.5 1.4.7 2.2-2.4.6-4.8 1.6-7.1 2.9 0-.7 0-1.5 0-2.2zm1.2 3.4c2.2-1.3 4.6-2.2 7-2.7.2.9.3 1.8.3 2.7 0 .3 0 .6 0 .9-2.5.5-5 .5-7.3-.9z"/></svg>',
  };
  return map[key] || '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>';
}

async function fetchExist(url){
  const proxied = `https://r.jina.ai/http://${url.replace(/^https?:\/\//,'')}`;
  try{
    const ctrl = new AbortController();
    const t = setTimeout(()=>ctrl.abort(), 8000);
    const res = await fetch(proxied, { signal: ctrl.signal, headers:{ 'Accept':'text/html' } });
    clearTimeout(t);
    const text = await res.text();
    if(!text) return { exists:false, code: res.status||0 };
    const notFoundHints = ['not found','page not found','doesn\'t exist','error 404','no existe','user not found'];
    const lower = text.toLowerCase();
    const miss = notFoundHints.some(h=>lower.includes(h));
    return { exists: !miss, code: res.status||200 };
  }catch(e){
    return { exists:false, code:0, error: String(e) };
  }
}

export async function searchSocial(username){
  const tasks = PLATFORMS.map(async p=>{
    const url = p.url(username);
    const { exists, code } = await fetchExist(url);
    return { platform: p.key, name: p.name, url, exists, code };
  });
  return Promise.all(tasks);
}

export { PLATFORMS, iconSVG };
