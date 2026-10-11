import {cleanURL} from './clean.mjs';
export function cleanBatch(text,{dedupe=false}={}) {
 if(new TextEncoder().encode(text).length>102400) throw Error('Keep input under 100 KiB.');
 const lines=text.split(/\r?\n/);
 if(lines.filter(x=>x.trim()).length>500) throw Error('Use at most 500 links per batch.');
 const seen=new Set();
 return lines.flatMap((line,index)=>{
  if(!line.trim())return [];
  const row={...cleanURL(line),line:index+1,duplicate:false};
  if(row.status!=='error'){
   row.duplicate=dedupe && seen.has(row.cleaned); seen.add(row.cleaned);
  }
  return [row];
 });
}
export const outputRows = rows => rows.filter(r=>r.status!=='error'&&!r.duplicate);
export const toText = rows => outputRows(rows).map(r=>r.cleaned).join('\n');
const quote=value=>'"'+String(value).replaceAll('"','""')+'"';
export function toCSV(rows){
 return [['Original','Cleaned','Status','Removed parameters'],...outputRows(rows).map(r=>[r.original,r.cleaned,r.status,r.removed.join('; ')])].map(row=>row.map(quote).join(',')).join('\r\n');
}
