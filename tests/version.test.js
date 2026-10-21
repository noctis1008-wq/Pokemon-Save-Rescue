// 版番号(キャッシュ対策の ?v=)が version.json とそろっているか。そろえるのは node tools/set-version.js
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..'),rd=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const {version,date}=JSON.parse(rd('version.json'));
test('js/version.js の APP_VERSION・APP_VERSION_DATE が version.json と同じ',()=>{
  const v=rd('js/version.js');
  assert.match(v,new RegExp(`const APP_VERSION = "${version}";`));
  assert.match(v,new RegExp(`const APP_VERSION_DATE = "${date}";`));
});
for(const f of ['index.html','privacy.html','style.css'])test(`${f} の ?v= がすべて ${version}`,()=>{
  const all=[...rd(f).matchAll(/\?v=(\d+)/g)].map(m=>m[1]);
  assert.ok(all.length>0,'?v= が見つかりません');
  assert.deepEqual([...new Set(all)],[version]);
});
test('index.html が読み込むファイルがすべてある',()=>{
  const refs=[...rd('index.html').matchAll(/(?:src|href|srcset)="([^"#:]+?)(?:\?v=\d+)?"/g)].map(m=>m[1]).filter(r=>!r.startsWith('..')&&!r.startsWith('//'));
  for(const r of refs)assert.ok(fs.existsSync(path.join(ROOT,r)),r+' がありません');
});
test('CHANGELOG.md の先頭の版が version.json と同じ',()=>{
  assert.match(rd('CHANGELOG.md'),new RegExp(`\\n## v${version} — ${date}`));
});
