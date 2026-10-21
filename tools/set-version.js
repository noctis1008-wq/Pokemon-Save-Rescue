#!/usr/bin/env node
// 版番号をそろえる: node tools/set-version.js 74 [2026-10-22]
// 版番号の元は version.json の 1 か所。このスクリプトが次をすべて同じ値に書き換える。
//   version.json / js/version.js(APP_VERSION・APP_VERSION_DATE)/ index.html・privacy.html・style.css の ?v=
// 引数を省くと version.json の値で書き直す(手で version.json を変えたあとに実行)。
// 版がそろっているかは node --test tests/ で確かめられる(tests/version.test.js)。
'use strict';
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const rd=f=>fs.readFileSync(path.join(ROOT,f),'utf8'),wr=(f,s)=>fs.writeFileSync(path.join(ROOT,f),s);
const cur=JSON.parse(rd('version.json'));
const version=String(process.argv[2]||cur.version);
const date=process.argv[3]||(process.argv[2]?new Date().toISOString().slice(0,10):cur.date)||new Date().toISOString().slice(0,10);
if(!/^\d+$/.test(version)){console.error('版番号は数字で指定してください');process.exit(1)}
wr('version.json',JSON.stringify({version,date})+'\n');
let v=rd('js/version.js');
v=v.replace(/const APP_VERSION = "[^"]*";/,`const APP_VERSION = "${version}";`).replace(/const APP_VERSION_DATE = "[^"]*";/,`const APP_VERSION_DATE = "${date}";`);
wr('js/version.js',v);
for(const f of ['index.html','privacy.html','style.css'])wr(f,rd(f).replace(/\?v=\d+/g,'?v='+version));
console.log(`v${version} (${date}) にそろえました`);
