import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanURL} from '../src/clean.mjs';
test('removes known trackers while preserving raw business values and fragment',()=>{
 const r=cleanURL('https://example.com/p?q=a%20b&UTM_source=email&ref=shop&fbclid=123#part');
 assert.equal(r.cleaned,'https://example.com/p?q=a%20b&ref=shop#part'); assert.deepEqual(r.removed,['utm_source','fbclid']);
});
test('encoded names and repeated trackers',()=>assert.equal(cleanURL('https://example.com?%75tm_source=a&utm_source=b').cleaned,'https://example.com'));
test('protected links remain byte identical',()=>{
 for(const key of ['Signature','token','X-Amz-Signature','X-Goog-Credential','Expires','access_token']){
 const u='https://example.com/a?utm_source=x&'+key+'=abc'; assert.equal(cleanURL(u).status,'protected'); assert.equal(cleanURL(u).cleaned,u);
 }
});
test('invalid or unsafe input',()=>{
 for(const u of ['javascript:alert(1)','/relative','https://u:p@example.com','https://example.com/a b','https://example.com\\x','https://']){
 assert.equal(cleanURL(u).status,'error',u);
 }
});
test('unknown parameters and malformed name escapes stay unchanged',()=>{
 const u='https://example.com?q=a+b&%zz=1&source=s&ref=r#utm_source=a'; assert.equal(cleanURL(u).cleaned,u);
});
test('empty separator handling retains remaining structure',()=>{
 assert.equal(cleanURL('https://example.com?&&utm_source=x&').cleaned,'https://example.com');
 assert.equal(cleanURL('https://example.com?x=1&&utm_source=x&').cleaned,'https://example.com?x=1&&');
});
