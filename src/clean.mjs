const TRACKERS = new Set('gclid dclid fbclid msclkid igshid mc_cid mc_eid _ga _gl ymclid yclid ttclid twclid li_fat_id srsltid'.split(' '));
const PROTECTED = new Set('signature sig token access_token auth expires policy key-pair-id'.split(' '));
function nameOf(part) {
  try { return decodeURIComponent(part.split('=')[0].replaceAll('+',' ')).toLowerCase(); }
  catch { return null; }
}
export function cleanURL(value) {
  const original = value.trim();
  const result = {original,cleaned:original,removed:[],status:'unchanged',message:''};
  try {
    if (!/^https?:\/\//i.test(original) || /[\s\u0000-\u001f\u007f\\]/.test(original)) throw Error();
    const url = new URL(original);
    if (!url.hostname || url.username || url.password) throw Error();
    result.hostname = url.hostname;
  } catch { return {...result,status:'error',message:'Use an absolute HTTP(S) URL without credentials or whitespace.'}; }
  const hash = original.indexOf('#');
  const head = hash < 0 ? original : original.slice(0,hash);
  const fragment = hash < 0 ? '' : original.slice(hash);
  const query = head.indexOf('?');
  if (query < 0) return result;
  const parts = head.slice(query+1).split('&');
  const names = parts.map(nameOf);
  if (names.some(n => n && (PROTECTED.has(n) || n.startsWith('x-amz-') || n.startsWith('x-goog-')))) {
    return {...result,status:'protected',message:'Looks signed or authenticated; kept exactly as pasted.'};
  }
  const kept = parts.filter((part,index) => {
    const n = names[index];
    if (n && (n.startsWith('utm_') || TRACKERS.has(n))) { result.removed.push(n); return false; }
    return true;
  });
  if (result.removed.length) {
    result.cleaned = head.slice(0,query) + (kept.some(Boolean) ? '?' + kept.join('&') : '') + fragment;
    result.status = 'changed';
  }
  return result;
}
