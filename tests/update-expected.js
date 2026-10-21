// 期待値(tests/expected.json)を作り直す: node tests/update-expected.js
// 解析・出力の結果を意図して変えたときだけ実行し、差分を確認してからコミットすること。
'use strict';
const fs=require('fs'),path=require('path');const H=require('./harness');
(async()=>{
  const out={};
  for(const f of H.saveFiles()){const v=H.variants(fs.readFileSync(f.path));for(const [k,b] of Object.entries(v)){out[f.name+'#'+k]=(await H.summarize(b)).summary;process.stdout.write('.')}}
  fs.writeFileSync(path.join(__dirname,'expected.json'),JSON.stringify(out,null,1)+'\n');
  console.log('\n'+Object.keys(out).length+' 件を書き出しました');
})();
