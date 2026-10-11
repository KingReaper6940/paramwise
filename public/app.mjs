import {cleanBatch,toText,toCSV,outputRows} from './src/batch.mjs';
const el=id=>document.getElementById(id);
let rows=[];
const sample='https://example.com/article?utm_source=newsletter&ref=reading#intro\nhttps://example.com/article?ref=reading#intro\nhttps://example.com/search?q=blue%20shoes&gclid=demo\nhttps://example.com/download?Signature=demo&utm_source=email\nnot-a-url';
function invalidate(){rows=[];el('results').hidden=true;el('notice').textContent='';}
el('input').addEventListener('input',invalidate);
el('dedupe').addEventListener('change',invalidate);
el('sample').addEventListener('click',()=>{el('input').value=sample;invalidate();el('input').focus();});
const node=(tag,text,className)=>{const n=document.createElement(tag);n.textContent=text;if(className)n.className=className;return n;};
el('clean').addEventListener('click',()=>{
 invalidate();
 try{rows=cleanBatch(el('input').value,{dedupe:el('dedupe').checked});if(!rows.length)throw Error('Paste at least one link to get started.');}
 catch(e){el('notice').textContent=e.message;return;}
 el('results').hidden=false;
 el('stats').replaceChildren();
 const stats=[[outputRows(rows).length,'Links in export'],[rows.reduce((s,r)=>s+r.removed.length,0),'Parameters removed'],[rows.filter(r=>r.status==='protected').length,'Protected links'],[rows.filter(r=>r.duplicate).length,'Duplicates excluded']];
 for(const [value,label] of stats){const box=node('div','','stat');box.append(node('strong',value),node('span',label));el('stats').append(box);}
 el('rows').replaceChildren();
 for(const r of rows){
 const box=node('article','','row');const top=node('div','','row-top');
 top.append(node('strong','Line '+r.line+(r.hostname?' · '+r.hostname:'')),node('span',r.duplicate?'Duplicate · excluded':r.status,'badge'));
 box.append(top,node('p',r.original,'url original'));
 if(r.status==='changed')box.append(node('p','→ '+r.cleaned,'url'));
 box.append(node('p',r.message || (r.removed.length?'Removed: '+r.removed.join(', '):'No known tracking parameters found.'),'detail'));
 el('rows').append(box);
 }
 for(const id of ['copy','txt','csv'])el(id).disabled=!outputRows(rows).length;
 el('notice').textContent=rows.filter(r=>r.status==='error').length+' invalid link(s) excluded. Review protected links before sharing.';
});
el('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(toText(rows));el('notice').textContent='Cleaned links copied.';}catch{el('notice').textContent='Clipboard unavailable. Download TXT instead.';}});
function download(content,type,name){
 const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
el('txt').addEventListener('click',()=>download(toText(rows),'text/plain;charset=utf-8','paramwise-links.txt'));
el('csv').addEventListener('click',()=>download(toCSV(rows),'text/csv;charset=utf-8','paramwise-report.csv'));
