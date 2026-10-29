// v84: 作る main のボックスは、いつも 31 個すべて開いていて(+0x43E = 31)、31 個目を開けたしるし(+0x43D の 0x80)も立っている。
// 「数は 31 なのにしるしがない」状態はゲームが作らないので、出さない。救出(buildRescueMain)とまるごと復元(buildFullRestore)の両方を確かめる。
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs');
const H=require('./harness');

function checkBoxes(data,label){
  const l=findGen6Layout(new Uint8Array(data));
  assert.ok(l,`${label}: ブロック表が見つからない`);
  assert.equal(l.okCount,l.blocks.length,`${label}: CRC が合わないブロックがある`);
  const lb=l.blocks.find(b=>b.len===0x440);
  assert.equal(data[lb.orig+0x43E],31,`${label}: 使えるボックスの数が 31 でない`);
  assert.equal(data[lb.orig+0x43D]&0x80,0x80,`${label}: 31 個目を開けたしるしがない`);
}
// まるごと復元はボックス表示(boxState.pages)を使うので、読めた個体から最小限を作る
function setPages(r){
  const slots=Array.from({length:930},()=>({status:'unreadable'}));
  if(r.l6){const pc=r.l6.blocks.find(b=>b.len===0x34AD0);
    for(const h of r.allHits){const i=(r.l6.toOrig(h.offset)-pc.orig)/232;if(Number.isInteger(i)&&i>=0&&i<930)slots[i]={status:'pokemon',hit:h}}}
  boxState.pages=[{slots}];
}

test('空のセーブ(templates/)は、はじめからボックス 31 個がすべて開いている',()=>{
  H.load();
  for(const f of H.saveFiles().filter(f=>f.name.startsWith('templates/')))checkBoxes(fs.readFileSync(f.path),f.name);
});

for(const f of H.saveFiles()){
  for(const kind of ['orig','rot','corrupt']){
    test(`${f.name}#${kind}: 救出とまるごと復元の main はボックス 31 個がすべて開き、しるしもそろっている`,async()=>{
      const bytes=H.variants(fs.readFileSync(f.path))[kind];
      const r=H.analyzeBytes(bytes);
      if(!r.l6)return;
      if(r.hits.length){
        const {data}=await buildRescueMain({game:r.l6.game,bag:null,money:null,selected:r.hits.slice(),input:r.input,l6:r.l6,includeEgg:null,dex:null,trainer:null,avatar:null,unknownBox:null,gift:null});
        checkBoxes(data,`${f.name}#${kind} 救出`);
      }
      setPages(r);
      try{const {data}=await buildFullRestore({});checkBoxes(data,`${f.name}#${kind} まるごと復元`)}
      finally{boxState.pages=null}
    });
  }
}
