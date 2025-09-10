const BASE = 'https://www.whoisxmlapi.com/whoisserver/WhoisService';
const API_KEY = 'at_l9RsHeBH0XIaqVq2JLcwJqgX8zfXp';

export async function whoisLookupGET(domain){
  const url = `${BASE}?apiKey=${encodeURIComponent(API_KEY)}&domainName=${encodeURIComponent(domain)}&outputFormat=JSON`;
  const res = await fetch(url);
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function whoisLookupPOST(domain){
  const body = new URLSearchParams({ apiKey: API_KEY, domainName: domain, outputFormat: 'JSON' });
  const res = await fetch(BASE, { method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' }, body });
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
