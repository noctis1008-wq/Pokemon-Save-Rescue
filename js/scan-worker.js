// ===========================================================================
// NER Pokémon Recovery — scan-worker.js(v73)
// セーブ全体を 1 バイト刻みで調べる走査(core.js の scan)を、画面を止めずに行う Web Worker。
// 受け取る: {input: Uint8Array, gen, maxSpecies}
// 返す:     {type:'progress', p: 0〜1} … 途中経過 / {type:'done', hits} … 結果(scan() の戻り値そのまま)
//           {type:'error', message} … 失敗(画面側は画面内の走査に切り替える)
// ===========================================================================
importScripts('core.js'+self.location.search);
self.onmessage=e=>{
  try{
    const {input,gen,maxSpecies}=e.data;
    let last=-1;
    const hits=scan(input,gen,maxSpecies,p=>{const pct=Math.floor(p*100);if(pct!==last){last=pct;self.postMessage({type:'progress',p})}});
    self.postMessage({type:'done',hits});
  }catch(err){self.postMessage({type:'error',message:String(err&&err.message||err)})}
};
