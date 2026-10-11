import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanBatch,toText,toCSV} from '../src/batch.mjs';
test('dedupes exact cleaned links and keeps line numbers',()=>{
 const rows=cleanBatch('\nhttps://example.com?utm_source=x\nhttps://example.com\nnope',{dedupe:true});
 assert.equal(rows[0].line,2);assert.equal(rows[1].duplicate,true);assert.equal(rows[2].status,'error');
 assert.equal(toText(rows),'https://example.com');
});
test('dedupe optional and no semantic canonicalization',()=>{
 assert.equal(cleanBatch('https://example.com\nhttps://example.com')[1].duplicate,false);
 assert.equal(cleanBatch('https://example.com\nhttps://example.com/',{dedupe:true})[1].duplicate,false);
});
test('protected links included with clear CSV status and escaping',()=>{
 const rows=cleanBatch('https://example.com?a="quoted"&token=abc');
 assert.match(toCSV(rows),/""quoted""/);assert.match(toCSV(rows),/"protected"/);
});
test('input limits reject whole batch',()=>{
 assert.throws(()=>cleanBatch('x'.repeat(102401)),/100 KiB/);
 assert.throws(()=>cleanBatch(Array(501).fill('https://example.com').join('\n')),/500/);
});
