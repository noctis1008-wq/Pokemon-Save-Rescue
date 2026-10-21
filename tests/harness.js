// テスト用の読み込み口。ブラウザと同じ順でデータ(pk*.js)と js/core.js → parse.js → export.js を読み込み、
// 画面(ui.js)を使わずに解析・出力の結果を作る。依存パッケージなし(node 18 以上)。
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const ROOT=path.join(__dirname,'..');

let loaded=false;
function load(){
  if(loaded||globalThis.__NER_PRELOADED)return;loaded=true;   // __NER_PRELOADED: 別の版のコードを読み込み済みで比べるとき
  globalThis.window=globalThis;   // parse.js / export.js は window.__layout6 などを参照する
  // ui.js にある画面の状態。export.js が参照するので最小限を用意する
  globalThis.boxState={pages:null,current:0};
  globalThis.isUnknownHit=()=>false;
  // export.js の loadTemplate は fetch('templates/main_xy') を使う。リポジトリのファイルを返す
  globalThis.fetch=async p=>{const f=path.join(ROOT,String(p).split('?')[0]);if(!fs.existsSync(f))return {ok:false,status:404};const b=fs.readFileSync(f);return {ok:true,status:200,arrayBuffer:async()=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)}};
  // index.html と同じ順(データ → core → parse → export)
  for(const f of ['pkdata.js','pk_fashion.js','pk_icons.js','pk_atlas.js','pk_detail.js','js/core.js','js/parse.js','js/export.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,f),'utf8'),{filename:f});
}
const sha=b=>crypto.createHash('sha256').update(b).digest('hex').slice(0,24);
// Uint8Array は中身のハッシュに置き換え、関数は除く。キーの順は保つ(結果の並びの変化も検出する)
function digest(v){return sha(JSON.stringify(v,(k,x)=>x instanceof Uint8Array?'u8:'+x.length+':'+sha(x):typeof x==='function'?undefined:x))}

// 破損の型を再現した変形(テスト中に作る。ファイルには保存しない)
function variants(buf){
  const d=new Uint8Array(buf),n=d.length,out={orig:d};
  const r=0x50000%n;out.rot=new Uint8Array(n);out.rot.set(d.subarray(r));out.rot.set(d.subarray(0,r),n-r);   // 全体が回転
  out.shift=new Uint8Array(n);out.shift.set(d.subarray(0,0x1000));out.shift.set(d.subarray(0x1000+0x1F),0x1000);   // 0x1000 以降が -0x1F ずれる
  const c=d.slice(),base=n===0x65600?0x22600:0x33000;c.fill(0,base+0x100,base+0x3100);for(let i=0x30000;i<0x30400;i+=7)c[i]^=0x5A;out.corrupt=c;   // ボックスの一部が消え、別の部分が化ける
  out.trunc=d.slice(0,n-0x9000);   // 末尾が欠ける
  return out;
}

// ui.js の analyze() と同じ順で解析する
function analyzeBytes(bytes){
  load();
  const input=bytes.slice();
  let [game,gen,maxSpecies]=detectGame(input.length);
  const l6=findGen6Layout(input);window.__layout6=l6;
  if(l6)relocateBlocks(input,l6);
  if(l6){game=l6.game==='XY'?'XY / X・Y':'ORAS / オメガルビー・アルファサファイア';gen=6;maxSpecies=721}
  const scanGen=gen||6;
  const wrapScan=!!(l6&&l6.rotated&&((l6.shift%l6.saveSize)+l6.saveSize)%l6.saveSize!==0);
  const scanInput=wrapScan?(()=>{const a=new Uint8Array(input.length+232);a.set(input);a.set(input.subarray(0,232),input.length);return a})():input;
  const rawHits=scan(scanInput,scanGen,maxSpecies);
  let hits=rawHits.filter(h=>h.offset<input.length);
  hits=addSpecialHits(input,l6,hits);
  window.__game=game;window.__gen=scanGen;window.__input=input;window.__itemsGame=l6?l6.game:null;
  const r={game,gen,scanGen,maxSpecies,scanInput,rawHits,l6};
  r.boxNames=readBoxNames(input,l6);r.bag=readBag(input,l6);r.money=readMoney(input,l6);r.photo=readPhoto(input,l6);
  r.allHits=hits;const vis=visibleHits(hits);r.hits=vis;window.__hits=vis;
  r.dex=readDex(input,l6,vis);r.gift=readGifts(input,l6);r.trainer=readTrainer(input,l6,vis);r.avatar=readAvatar(input,l6,r.trainer);
  r.input=input;
  return r;
}

// 比べる値(個数とハッシュだけ。セーブの中身そのものは残さない)
async function summarize(bytes){
  const r=analyzeBytes(bytes);
  const s={
    size:bytes.length,game:r.game,
    layout:r.l6?{game:r.l6.game,blocks:r.l6.blocks.length,ok:r.l6.okCount,moved:r.l6.movedCount,shift:r.l6.shift,rotated:r.l6.rotated,saveSize:r.l6.saveSize,status:digest(r.l6.blocks.map(b=>[b.id,b.status,b.rawStatus,b.at,b.moved])),lin:digest(r.l6.lin)}:null,
    hits:r.allHits.length,complete:r.hits.length,
    hitsDigest:digest(r.allHits.map(h=>[h.offset,h.species,h.score,h.confidence,h.checksumValid,h.sameEcCount,h.data])),
    boxNames:digest(r.boxNames),bag:r.bag?r.bag.total:null,bagDigest:digest(r.bag),money:digest(r.money),photo:digest(r.photo),
    dex:digest(r.dex),gift:digest(r.gift),trainer:digest(r.trainer),avatar:digest(r.avatar),
  };
  if(r.l6&&r.hits.length){
    try{
      const {data,report}=await buildRescueMain({game:r.l6.game,bag:r.bag,money:r.money,selected:r.hits,input:r.input,l6:r.l6,includeEgg:null,dex:r.dex,trainer:r.trainer?{name:r.trainer.name,tid:r.trainer.tid,sid:r.trainer.sid}:null,avatar:null,unknownBox:null,gift:r.gift});
      s.main={hash:sha(new Uint8Array(data)),report,verify:verifyMain(new Uint8Array(data))};
    }catch(e){s.main={error:e.message}}
  }
  if(r.hits.length){const p=makePCBinary(r.hits,r.game,r.scanGen);s.bin={hash:sha(new Uint8Array(p.data)),placed:p.placed,unknown:p.unknown,conflicts:p.conflicts}}
  return {summary:s,result:r};
}

// 対象のセーブ: templates/(空のセーブ)と、あれば test/(試験用セーブ)。それぞれに変形を加える
function saveFiles(){
  const list=[];
  for(const dir of ['templates','test']){const d=path.join(ROOT,dir);if(!fs.existsSync(d))continue;
    for(const f of fs.readdirSync(d).sort()){const p=path.join(d,f);const st=fs.statSync(p);if(st.isFile()&&(st.size===0x65600||st.size===0x76000))list.push({name:dir+'/'+f,path:p})}}
  return list;
}
module.exports={ROOT,load,digest,sha,variants,analyzeBytes,summarize,saveFiles};
