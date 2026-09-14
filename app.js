const fileInput=document.getElementById('file');const drop=document.getElementById('drop');const statusEl=document.getElementById('status');const result=document.getElementById('result');const gameEl=document.getElementById('game');const sizeEl=document.getElementById('size');const countEl=document.getElementById('count');const listEl=document.getElementById('list');const download=document.getElementById('download');
const SAVE={XY:0x65600,ORAS:0x76000,SM:0x6BE00,USUM:0x6CC00};
const SPECIES={1:'フシギダネ',2:'フシギソウ',3:'フシギバナ',4:'ヒトカゲ',5:'リザード',6:'リザードン',7:'ゼニガメ',8:'カメール',9:'カメックス',10:'キャタピー',11:'トランセル',12:'バタフリー',13:'ビードル',14:'コクーン',15:'スピアー',16:'ポッポ',17:'ピジョン',18:'ピジョット',19:'コラッタ',20:'ラッタ',21:'オニスズメ',22:'オニドリル',23:'アーボ',24:'アーボック',25:'ピカチュウ',26:'ライチュウ',27:'サンド',28:'サンドパン',29:'ニドラン♀',30:'ニドリーナ',31:'ニドクイン',32:'ニドラン♂',33:'ニドリーノ',34:'ニドキング',35:'ピッピ',36:'ピクシー',37:'ロコン',38:'キュウコン',39:'プリン',40:'プクリン',41:'ズバット',42:'ゴルバット',43:'ナゾノクサ',44:'クサイハナ',45:'ラフレシア',46:'パラス',47:'パラセクト',48:'コンパン',49:'モルフォン',50:'ディグダ',51:'ダグトリオ',52:'ニャース',53:'ペルシアン',54:'コダック',55:'ゴルダック',56:'マンキー',57:'オコリザル',58:'ガーディ',59:'ウインディ',60:'ニョロモ',61:'ニョロゾ',62:'ニョロボン',63:'ケーシィ',64:'ユンゲラー',65:'フーディン',66:'ワンリキー',67:'ゴーリキー',68:'カイリキー',69:'マダツボミ',70:'ウツドン',71:'ウツボット',72:'メノクラゲ',73:'ドククラゲ',74:'イシツブテ',75:'ゴローン',76:'ゴローニャ',77:'ポニータ',78:'ギャロップ',79:'ヤドン',80:'ヤドラン',81:'コイル',82:'レアコイル',83:'カモネギ',84:'ドードー',85:'ドードリオ',86:'パウワウ',87:'ジュゴン',88:'ベトベター',89:'ベトベトン',90:'シェルダー',91:'パルシェン',92:'ゴース',93:'ゴースト',94:'ゲンガー',95:'イワーク',96:'スリープ',97:'スリーパー',98:'クラブ',99:'キングラー',100:'ビリリダマ',101:'マルマイン',102:'タマタマ',103:'ナッシー',104:'カラカラ',105:'ガラガラ',106:'サワムラー',107:'エビワラー',108:'ベロリンガ',109:'ドガース',110:'マタドガス',111:'サイホーン',112:'サイドン',113:'ラッキー',114:'モンジャラ',115:'ガルーラ',116:'タッツー',117:'シードラ',118:'トサキント',119:'アズマオウ',120:'ヒトデマン',121:'スターミー',122:'バリヤード',123:'ストライク',124:'ルージュラ',125:'エレブー',126:'ブーバー',127:'カイロス',128:'ケンタロス',129:'コイキング',130:'ギャラドス',131:'ラプラス',132:'メタモン',133:'イーブイ',134:'シャワーズ',135:'サンダース',136:'ブースター',137:'ポリゴン',138:'オムナイト',139:'オムスター',140:'カブト',141:'カブトプス',142:'プテラ',143:'カビゴン',144:'フリーザー',145:'サンダー',146:'ファイヤー',147:'ミニリュウ',148:'ハクリュー',149:'カイリュー',150:'ミュウツー',151:'ミュウ',152:'チコリータ',153:'ベイリーフ',154:'メガニウム',155:'ヒノアラシ',156:'マグマラシ',157:'バクフーン',158:'ワニノコ',159:'アリゲイツ',160:'オーダイル',161:'オタチ',162:'オオタチ',163:'ホーホー',164:'ヨルノズク',165:'レディバ',166:'レディアン',167:'イトマル',168:'アリアドス',169:'クロバット',170:'チョンチー',171:'ランターン',172:'ピチュー',173:'ピィ',174:'ププリン',175:'トゲピー',176:'トゲチック',177:'ネイティ',178:'ネイティオ',179:'メリープ',180:'モココ',181:'デンリュウ',182:'キレイハナ',183:'マリル',184:'マリルリ',185:'ウソッキー',186:'ニョロトノ',187:'ハネッコ',188:'ポポッコ',189:'ワタッコ',190:'エイパム',191:'ヒマナッツ',192:'キマワリ',193:'ヤンヤンマ',194:'ウパー',195:'ヌオー',196:'エーフィ',197:'ブラッキー',198:'ヤミカラス',199:'ヤドキング',200:'ムウマ',201:'アンノーン',202:'ソーナンス',203:'キリンリキ',204:'クヌギダマ',205:'フォレトス',206:'ノコッチ',207:'グライガー',208:'ハガネール',209:'ブルー',210:'グランブル',211:'ハリーセン',212:'ハッサム',213:'ツボツボ',214:'ヘラクロス',215:'ニューラ',216:'ヒメグマ',217:'リングマ',218:'マグマッグ',219:'マグカルゴ',220:'ウリムー',221:'イノムー',222:'サニーゴ',223:'テッポウオ',224:'オクタン',225:'デリバード',226:'マンタイン',227:'エアームド',228:'デルビル',229:'ヘルガー',230:'キングドラ',231:'ゴマゾウ',232:'ドンファン',233:'ポリゴン2',234:'オドシシ',235:'ドーブル',236:'バルキー',237:'カポエラー',238:'ムチュール',239:'エレキッド',240:'ブビィ',241:'ミルタンク',242:'ハピナス',243:'ライコウ',244:'エンテイ',245:'スイクン',246:'ヨーギラス',247:'サナギラス',248:'バンギラス',249:'ルギア',250:'ホウオウ',251:'セレビィ'};
// The map above is intentionally partial; the numeric ID remains authoritative for all species.
function u16(a,p){return a[p]|(a[p+1]<<8)}
function u32(a,p){return (a[p]|(a[p+1]<<8)|(a[p+2]<<16)|(a[p+3]<<24))>>>0}
function crypt(a,start,end,seed){let x=seed>>>0;for(let p=start;p<end;p+=2){x=Math.imul(x,0x41C64E6D)+0x6073;x>>>=0;const k=x>>>16;const v=a[p]|(a[p+1]<<8);const y=v^k;a[p]=y&255;a[p+1]=y>>>8}return a}
const POS=[0,1,2,3,0,1,3,2,0,2,1,3,0,3,1,2,0,2,3,1,0,3,2,1,1,0,2,3,1,0,3,2,2,0,1,3,3,0,1,2,2,0,3,1,3,0,2,1,1,2,0,3,1,3,0,2,2,1,0,3,3,1,0,2,2,3,0,1,3,2,0,1,1,2,3,0,1,3,2,0,2,1,3,0,3,1,2,0,2,3,1,0,3,2,1,0,0,1,2,3,0,1,3,2];
function inverseShuffle(buf,sv){if(sv===0)return;const order=POS.slice(sv*4,sv*4+4);const src=buf.slice(0,224);for(let i=0;i<4;i++)buf.set(src.slice(order[i]*56,order[i]*56+56),i*56)}
function decryptPK(raw){
  const b=new Uint8Array(raw);const ec=u32(b,0);if(ec===0)return null;
  crypt(b,8,232,ec);const sv=(ec>>>13)&31;inverseShuffle(b.subarray(8,232),sv);
  const species=u16(b,8),chk=u16(b,6);let sum=0;for(let p=8;p<232;p+=2)sum=(sum+u16(b,p))&0xffff;
  const checksumValid=sum===chk;
  const nicknameTerm=u16(b,0x58)===0;
  const otTerm=u16(b,0xC8)===0;
  const lang=b[0xE3];
  const languageValid=lang>=1&&lang<=8;
  const speciesValid=species>=1&&species<=809;
  const pid=u32(b,0x18);
  let score=0;
  if(ec!==0)score+=10;
  if(speciesValid)score+=30;
  if(nicknameTerm)score+=15;
  if(otTerm)score+=15;
  if(languageValid)score+=10;
  if(pid!==0)score+=5;
  if(checksumValid)score+=15;
  if(!speciesValid || score<45)return null;
  let confidence=score>=90&&checksumValid?'complete':score>=65?'partial':'low';
  return {data:b,species,ec,sv,shiny:shiny(b),checksumValid,nicknameTerm,otTerm,languageValid,score,confidence};
}
function shiny(b){const pid=u32(b,0x18),tid=u16(b,0x0C),sid=u16(b,0x0E);return ((tid^sid^(pid>>>16)^(pid&0xffff))<16)}
function detectGame(len){if(len===SAVE.XY)return ['XY / X・Y',6,721];if(len===SAVE.ORAS)return ['ORAS / オメガルビー・アルファサファイア',6,721];if(len===SAVE.SM)return ['SM / サン・ムーン',7,802];if(len===SAVE.USUM)return ['USUM / ウルトラサン・ウルトラムーン',7,807];if(len===0x100000)return ['3DSセーブ（1 MiB）: ゲーム特定不能',null,809];return ['サイズから特定できないセーブ',null,809]}
function classifyHits(hits){
  // Prefer the strongest interpretation when the same EC is encountered multiple times.
  const best=new Map();
  for(const h of hits){const old=best.get(h.ec>>>0);if(!old||h.score>old.score)best.set(h.ec>>>0,h)}
  return [...best.values()].sort((a,b)=>a.offset-b.offset);
}
function scan(input,gen,maxSpecies){
  const out=[];
  for(let i=0;i+232<=input.length;i+=2){
    const p=decryptPK(input.subarray(i,i+232));
    if(!p||p.species>maxSpecies)continue;
    out.push({offset:i,...p,gen});
  }
  return classifyHits(out);
}
function msg(t,err=false){statusEl.textContent=t;statusEl.className='status'+(err?' error':'')}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function getStorageLayout(game,gen){
  if(gen===6){const base=game.startsWith('XY')?0x22600:0x33000;return {base,boxes:31,slots:31*30,size:232,exact:true};}
  if(gen===7)return {base:null,boxes:32,slots:32*30,size:232,exact:false};
  return null;
}
function inferGen7Base(hits){
  if(!hits.length)return null;
  // Gen7 storage is 32 x 30 x 232 bytes. The absolute block offset is
  // determined by the save's block table, so infer the most plausible PC
  // cluster from the candidate offsets while preserving the 232-byte stride.
  const groups=new Map();
  for(const h of hits){const rem=h.offset%232;const arr=groups.get(rem)||[];arr.push(h.offset);groups.set(rem,arr)}
  let best=null;
  for(const [rem,arr] of groups){if(!best||arr.length>best.length)best={rem,length:arr.length};}
  if(!best)return null;
  const aligned=hits.filter(h=>h.offset%232===best.rem).sort((a,b)=>a.offset-b.offset);
  if(!aligned.length)return null;
  // Anchor the first candidate to a slot boundary; the exact box number is
  // reliable only when the surrounding PC cluster is large enough.
  const first=aligned[0].offset;
  const base=first-(Math.floor(first/232)*232);
  return {base:base+Math.floor(first/232)*232,confidence:aligned.length>=2?'estimated':'weak'};
}
function getLocation(q,game,gen){
  const layout=getStorageLayout(game,gen);
  if(!layout)return {box:null,slot:null,label:'位置不明'};
  const base=layout.exact?layout.base:(window.__gen7Base??null);
  if(base===null)return {box:null,slot:null,label:'位置不明'};
  const rel=q.offset-base;
  const total=layout.slots*layout.size;
  if(rel<0||rel>=total)return {box:null,slot:null,label:'位置不明'};
  const index=Math.floor(rel/layout.size);
  const box=Math.floor(index/30)+1,slot=(index%30)+1;
  const aligned=rel%layout.size===0;
  return {box,slot,aligned,label:`ボックス${box}・${slot}番${aligned?'':'（位置ずれ候補）'}`};
}
function confidenceLabel(c){return c==='complete'?'完全復元':c==='partial'?'一部破損':'低信頼候補'}
function confidenceClass(c){return c==='complete'?'complete':c==='partial'?'partial':'low'}
function renderTabs(hits){
  const groups={complete:[],partial:[],low:[]};
  hits.forEach(h=>groups[h.confidence].push(h));
  listEl.innerHTML=`
    <div class="recovery-controls">
      <div class="selection-title"><strong>復元する個体を選択</strong><span>チェックした個体だけが boxdata.bin に含まれます。</span></div>
      <div class="selection-actions">
        <button type="button" class="small-button" data-action="all">すべて選択</button>
        <button type="button" class="small-button" data-action="none">すべて解除</button>
        <button type="button" class="small-button" data-action="safe">完全復元のみ</button>
      </div>
    </div>
    <div class="tabs" role="tablist">
      ${['complete','partial','low'].map((g,i)=>`<button type="button" class="tab ${i===0?'active':''}" data-tab="${g}" role="tab"><span>${confidenceLabel(g)}</span><b>${groups[g].length}</b></button>`).join('')}
    </div>
    <div class="tab-panels">
      ${['complete','partial','low'].map((g,i)=>`<div class="tab-panel ${i===0?'active':''}" data-panel="${g}">${groups[g].length?groups[g].map((p,n)=>renderCandidate(p,g,n)).join(''):`<div class="empty">この分類の候補はありません。</div>`}</div>`).join('')}
    </div>`;
  listEl.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{
    listEl.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===btn));
    listEl.querySelectorAll('[data-panel]').forEach(x=>x.classList.toggle('active',x.dataset.panel===btn.dataset.tab));
  }));
  listEl.querySelectorAll('.candidate-check').forEach(cb=>cb.addEventListener('change',updateSelectionSummary));
  listEl.querySelectorAll('.small-button').forEach(btn=>btn.addEventListener('click',()=>{
    const action=btn.dataset.action;
    listEl.querySelectorAll('.candidate-check').forEach(cb=>{cb.checked=action==='all'||(action==='safe'&&cb.dataset.confidence==='complete')});
    updateSelectionSummary();
  }));
  updateSelectionSummary();
}
function renderCandidate(p,g,n){
  const loc=getLocation(p,window.__game,window.__gen);
  const speciesName=SPECIES[p.species]||('No.'+p.species);
  const offset=`0x${p.offset.toString(16).toUpperCase().padStart(6,'0')}`;
  const reason=g==='complete'?'チェックサム一致・主要構造一致':g==='partial'?'チェックサム不一致または一部構造破損':'構造の一部のみ一致。誤検出の可能性があります';
  return `<label class="candidate ${confidenceClass(g)}"><input class="candidate-check" type="checkbox" data-offset="${p.offset}" data-ec="${p.ec}" data-confidence="${g}" checked><span class="candidate-main"><span class="candidate-top"><strong>${escapeHtml(speciesName)}</strong><span class="badge ${confidenceClass(g)}">${confidenceLabel(g)}${p.shiny?' ★':''}</span></span><span class="candidate-meta">全国図鑑No.${p.species} · ${loc.label} · offset ${offset}</span><span class="candidate-reason">${reason} · 信頼度スコア ${p.score}/100</span></span></label>`;
}
function updateSelectionSummary(){
  const checks=[...listEl.querySelectorAll('.candidate-check')];
  const selected=checks.filter(x=>x.checked).length;
  countEl.textContent=`${selected} / ${checks.length} 匹`;
  const button=document.getElementById('download');
  if(button)button.disabled=selected===0;
  const summary=document.getElementById('selectionSummary');
  if(summary)summary.textContent=`選択中 ${selected} 匹`;
}
async function analyze(file){
  result.classList.add('hidden');listEl.innerHTML='';msg('セーブデータを解析しています…');
  const input=new Uint8Array(await file.arrayBuffer());
  const [game,gen,maxSpecies]=detectGame(input.length);let scanGen=gen||6;
  let hits=scan(input,scanGen,maxSpecies);
  if(!hits.length&&gen===null){const h6=scan(input,6,721),h7=scan(input,7,807);hits=h7.length>h6.length?h7:h6;scanGen=hits.length?hits[0].gen:6}
  if(scanGen===7){const inf=inferGen7Base(hits);window.__gen7Base=inf?inf.base:null}
  gameEl.textContent=hits.length?game+(gen===null?'（内部構造から推定）':''):game;
  sizeEl.textContent=input.length.toLocaleString()+' bytes';
  if(!hits.length){countEl.textContent='0 匹';msg('ポケモン個体データを検出できませんでした。破損が大きいか、暗号化形式・別世代の可能性があります。',true);return}
  window.__hits=hits;window.__inputName=file.name;window.__inputSize=input.length;window.__game=game;window.__gen=scanGen;window.__input=input;
  const complete=hits.filter(h=>h.confidence==='complete').length,partial=hits.filter(h=>h.confidence==='partial').length,low=hits.filter(h=>h.confidence==='low').length;
  document.getElementById('selectionSummary').textContent=`選択中 ${hits.length} 匹`;
  renderTabs(hits);
  msg(`${hits.length} 匹の候補を検出しました。復元範囲をチェックボックスで選択してください。`);
  result.classList.remove('hidden');
}
fileInput.addEventListener('change',()=>{if(fileInput.files[0])analyze(fileInput.files[0]).catch(e=>msg('解析中にエラーが発生しました: '+e.message,true))});
['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('drag')}));
['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('drag')}));
drop.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f)analyze(f).catch(err=>msg('解析中にエラーが発生しました: '+err.message,true))});
function crc32(data){let c=0xffffffff;for(const x of data){c^=x;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0}
function zipStore(files){const enc=new TextEncoder(),chunks=[],central=[];let offset=0;for(const f of files){const name=enc.encode(f.name),data=f.data,crc=crc32(data);const h=new Uint8Array(30+name.length);const dv=new DataView(h.buffer);dv.setUint32(0,0x04034b50,true);dv.setUint16(4,20,true);dv.setUint16(8,0,true);dv.setUint32(14,crc,true);dv.setUint32(18,data.length,true);dv.setUint32(22,data.length,true);dv.setUint16(26,name.length,true);h.set(name,30);chunks.push(h,data);const c=new Uint8Array(46+name.length),cv=new DataView(c.buffer);cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,name.length,true);cv.setUint32(42,offset,true);c.set(name,46);central.push(c);offset+=h.length+data.length}const centralSize=central.reduce((s,x)=>s+x.length,0),end=new Uint8Array(22),ev=new DataView(end.buffer);ev.setUint32(0,0x06054b50,true);ev.setUint16(8,files.length,true);ev.setUint16(10,files.length,true);ev.setUint32(12,centralSize,true);ev.setUint32(16,offset,true);return new Blob([...chunks,...central,end],{type:'application/zip'})}
function shuffleForEncrypt(buf,sv){if(sv===0)return;const order=POS.slice(sv*4,sv*4+4),src=buf.slice(0,224);for(let i=0;i<4;i++)buf.set(src.slice(i*56,i*56+56),order[i]*56)}
function encryptPK(decrypted){const b=new Uint8Array(decrypted),ec=u32(b,0),sv=(ec>>>13)&31;shuffleForEncrypt(b.subarray(8,232),sv);crypt(b,8,232,ec);return b}
function makePCBinary(selected,game,gen){
  const layout=getStorageLayout(game,gen);
  if(!layout)throw new Error('この世代のPCボックス配置には未対応です。');
  const total=layout.slots*layout.size,out=new Uint8Array(total);
  let placed=0,unknown=0,conflicts=0;const used=new Set();
  for(const q of selected){
    const loc=getLocation(q,game,gen);
    if(loc.box!==null){
      const slot=(loc.box-1)*30+(loc.slot-1);
      if(used.has(slot)){conflicts++;continue}
      out.set(encryptPK(q.data),slot*232);used.add(slot);placed++;
    }else unknown++;
  }
  return {data:out,placed,unknown,conflicts,layout};
}
download.addEventListener('click',()=>{
  const checks=[...listEl.querySelectorAll('.candidate-check')],selected=[];
  for(const cb of checks)if(cb.checked){const q=(window.__hits||[]).find(h=>h.offset===Number(cb.dataset.offset)&&String(h.ec)===cb.dataset.ec);if(q)selected.push(q)}
  if(!selected.length)return;
  try{
    const {data,placed,unknown,conflicts}=makePCBinary(selected,window.__game,window.__gen);
    const blob=zipStore([{name:'boxdata.bin',data}]);
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='boxdata_selected.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    msg(`boxdata.bin を作成しました。選択 ${selected.length} 匹中 ${placed} 匹を元のボックス位置に配置しました${unknown?`。位置を特定できない ${unknown} 匹は安全のため未配置`:''}${conflicts?`。重複位置 ${conflicts} 匹は未配置`:''}。`);
  }catch(e){msg('boxdata.bin の作成に失敗しました: '+e.message,true)}
});
