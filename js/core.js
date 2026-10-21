// ===========================================================================
// NER Pokémon Recovery — core.js
// 第6世代セーブのバイナリ処理(読み書きの基本、PK6 の暗号化・復号、ブロック表、
// チェックサム、位置合わせ、個体スキャン)。DOM を使わないので、Web Worker
// (scan-worker.js)と node のテスト(tests/)からも読み込める。
// ===========================================================================
const SAVE={XY:0x65600,ORAS:0x76000};
// The map above is intentionally partial; the numeric ID remains authoritative for all species.
function u16(a,p){return a[p]|(a[p+1]<<8)}
function u32(a,p){return (a[p]|(a[p+1]<<8)|(a[p+2]<<16)|(a[p+3]<<24))>>>0}
function crypt(a,start,end,seed){let x=seed>>>0;for(let p=start;p<end;p+=2){x=Math.imul(x,0x41C64E6D)+0x6073;x>>>=0;const k=x>>>16;const v=a[p]|(a[p+1]<<8);const y=v^k;a[p]=y&255;a[p+1]=y>>>8}return a}
const POS=[0,1,2,3,0,1,3,2,0,2,1,3,0,3,1,2,0,2,3,1,0,3,2,1,1,0,2,3,1,0,3,2,2,0,1,3,3,0,1,2,2,0,3,1,3,0,2,1,1,2,0,3,1,3,0,2,2,1,0,3,3,1,0,2,2,3,0,1,3,2,0,1,1,2,3,0,1,3,2,0,2,1,3,0,3,1,2,0,2,3,1,0,3,2,1,0,0,1,2,3,0,1,3,2,0,2,1,3,0,3,1,2,0,2,3,1,0,3,2,1,1,0,2,3,1,0,3,2];
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
  // 構造的な裏付けを最低1つ要求する。種族IDだけだとランダムデータでも
  // 1.2%程度が通ってしまい、1セーブあたり2000件以上の誤検出が出るため。
  const structurallyPlausible = checksumValid || nicknameTerm || otTerm;
  if(!speciesValid || !structurallyPlausible || score<45)return null;
  let confidence=score>=90&&checksumValid?'complete':score>=65?'partial':'low';
  return {data:b,species,ec,sv,shiny:shiny(b),checksumValid,nicknameTerm,otTerm,languageValid,score,confidence};
}
function shiny(b){const pid=u32(b,0x18),tid=u16(b,0x0C),sid=u16(b,0x0E);return ((tid^sid^(pid>>>16)^(pid&0xffff))<16)}
function detectGame(len){if(len===SAVE.XY)return ['XY / X・Y',6,721];if(len===SAVE.ORAS)return ['ORAS / オメガルビー・アルファサファイア',6,721];return ['サイズから特定できないセーブ',null,721]}
// ---------------------------------------------------------------------------
// 第6世代のブロック表(セーブ末尾のフッター)からゲームとずれを判定する。v8 で追加。
//
// フッターは 0x200 境界 + 0x10 にマジック 0x42454546("FEEB")があり、その後に
// (長さ u32, ID u16, CRC16 u16) が 8 バイトずつ並ぶ。各ブロックの位置は
// 長さを 0x200 単位に切り上げて累積したもの。
// PC ボックスは長さ 0x34AD0 のブロックで、その位置で X・Y(0x22600)と
// ORAS(0x33000)を区別できる。ファイルサイズに頼らずに判定できる。
//
// 破損セーブの中には、セーブ全体がぐるりと回転して(先頭が別の位置から始まって)
// 保存されているものがある(実例: X・Y で 0x50000 ずれ)。フッターの実際の位置と
// 本来の位置の差から、このずれを求めて補正する。
// ---------------------------------------------------------------------------
const GEN6_FOOTER_MAGIC=0x42454546;
const GEN6_BLOCK_LABEL={0x34AD0:'PCボックス',0xE058:'写真(PSS)',0x61C:'手持ち',0x574:'バトルボックス',0x440:'ボックス名・壁紙'};
function crc16ccitt(read,len){let c=0xFFFF;for(let i=0;i<len;i++){c^=read(i)<<8;for(let k=0;k<8;k++)c=(c&0x8000)?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c}
function parseGen6Footer(input,magicPos){
  const blocks=[];let off=0,p=magicPos+4;
  while(p+8<=input.length&&blocks.length<80){
    const len=u32(input,p),id=u16(input,p+4),chk=u16(input,p+6);p+=8;
    if(len===0&&id===0&&blocks.length)break;
    if(len>0x80000||id!==blocks.length)return null;   // 表として不自然なら候補から外す
    blocks.push({id,orig:off,len,chk});off+=(len+0x1FF)&~0x1FF;
  }
  const pc=blocks.find(b=>b.len===0x34AD0);
  if(!pc)return null;
  let game=null;
  if(pc.orig===0x22600)game='XY';else if(pc.orig===0x33000)game='ORAS';else return null;
  const footerOrig=off,saveSize=footerOrig+0x200;            // XY: 0x65400 / 0x65600, ORAS: 0x75E00 / 0x76000
  const footerFile=magicPos-0x10;
  return {game,blocks,pcBase:pc.orig,footerOrig,footerFile,saveSize};
}
// ---------------------------------------------------------------------------
// ブロックの位置合わせ(v38)。ブロック表の CRC と一致する位置を探し、ずれていても中身が無事なブロックを見つける。
// 実例: ORAS の破損セーブで 58 ブロック中 45 ブロックが -0x1F ずれたまま無事だった(お金・図鑑・トレーナーと同じずれ)。
// 見つかったブロックは status を 'ok' にし、at(本来の座標での実際の開始位置)と moved(ずれ)を付ける。
// 元の状態は rawStatus に残す。全部 0 の範囲は一致しても採らない。PC ボックスより大きいブロックは全探索しない。
// まず他のブロックで見つかったずれを試し、だめなら ±0x200 を 1 バイト刻みで探す。
// ---------------------------------------------------------------------------
const RELOCATE_RANGE=0x200;
let CRC16_TABLE=null;
function crc16fast(a,start,len){
  if(!CRC16_TABLE){CRC16_TABLE=new Uint16Array(256);for(let i=0;i<256;i++){let c=i<<8;for(let k=0;k<8;k++)c=(c&0x8000)?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF;CRC16_TABLE[i]=c}}
  let c=0xFFFF;for(let i=start,e=start+len;i<e;i++)c=((c<<8)&0xFFFF)^CRC16_TABLE[((c>>8)^a[i])&0xFF];
  return c;
}
function relocateBlocks(input,l6){
  // 本来の座標で並べ直したコピー(回転していても 1 本の配列で扱える)
  const size=l6.saveSize,lin=new Uint8Array(size),n=input.length;
  for(let o=0;o<size;o++){const f=l6.toFile(o);if(f>=0&&f<n)lin[o]=input[f]}
  const nz=new Uint32Array(size+1);for(let i=0;i<size;i++)nz[i+1]=nz[i]+(lin[i]!==0?1:0);   // 0 以外の数の累積
  l6.lin=lin;
  const tried=new Map();   // ずれ → 見つかった数
  for(const b of l6.blocks){
    b.rawStatus=b.status;
    if(b.status==='ok'){b.at=b.orig;b.moved=0;continue}
    const fits=s=>{const o=b.orig+s;return o>=0&&o+b.len<=size&&nz[o+b.len]-nz[o]>0&&crc16fast(lin,o,b.len)===b.chk};
    let found=null;
    for(const s of [...tried.entries()].sort((x,y)=>y[1]-x[1]).map(e=>e[0]))if(s!==0&&fits(s)){found=s;break}
    if(found===null&&b.len<=0x20000){for(let s=-RELOCATE_RANGE;s<=RELOCATE_RANGE;s++){if(s!==0&&fits(s)){found=s;break}}}
    if(found!==null){b.status='ok';b.at=b.orig+found;b.moved=found;tried.set(found,(tried.get(found)||0)+1)}
  }
  l6.okCount=l6.blocks.filter(b=>b.status==='ok').length;
  l6.movedCount=l6.blocks.filter(b=>b.moved).length;
  return l6;
}
function findGen6Layout(input){
  let best=null;
  for(let p=0x10;p+4<=input.length;p+=0x200){
    if(u32(input,p)!==GEN6_FOOTER_MAGIC)continue;
    const t=parseGen6Footer(input,p);if(!t)continue;
    const rotated=input.length===t.saveSize;
    const shift=t.footerOrig-t.footerFile;                   // 本来の位置 = ファイル上の位置 + shift
    const toOrig=f=>{const o=f+shift;return rotated?((o%t.saveSize)+t.saveSize)%t.saveSize:o};
    const toFile=o=>{const f=o-shift;return rotated?((f%t.saveSize)+t.saveSize)%t.saveSize:f};
    let okCount=0;
    for(const b of t.blocks){
      const start=toFile(b.orig);
      if(!rotated&&(start<0||start+b.len>input.length)){b.status='missing';continue}
      const n=input.length;
      b.status=crc16ccitt(i=>input[(start+i)%n],b.len)===b.chk?'ok':'ng';
      b.label=GEN6_BLOCK_LABEL[b.len]||null;
      if(b.status==='ok')okCount++;
    }
    const cand={...t,shift,rotated,toOrig,toFile,okCount};
    if(!best||cand.okCount>best.okCount)best=cand;
  }
  return best;
}
function hex(n,w=5){return '0x'+(n>>>0).toString(16).toUpperCase().padStart(w,'0')}
function blockAt(layout,orig){return layout?layout.blocks.find(b=>orig>=b.orig&&orig<b.orig+b.len):null}

function classifyHits(hits){
  // v6 までは EC(暗号化定数)をキーに重複を除去していたが、これは誤りだった。
  // 配布・交換・複製で生まれた「同じ EC/PID を持つ別個体」(いわゆるクローン)が
  // 別のボックスにいると、最初の 1 匹以外が黙って消えてしまう。
  // スキャンは 1 オフセットにつき 1 件しか結果を出さないので、
  // オフセットが違えば別のスロット = 別の個体として扱う。
  const byOffset=new Map();
  for(const h of hits){const old=byOffset.get(h.offset);if(!old||h.score>old.score)byOffset.set(h.offset,h)}
  const list=[...byOffset.values()].sort((a,b)=>a.offset-b.offset);
  // 同じ EC を持つ個体の数を数えておき、UI で「同一個体のコピー」と明示する。
  const ecCount=new Map();
  for(const h of list)ecCount.set(h.ec>>>0,(ecCount.get(h.ec>>>0)||0)+1);
  for(const h of list)h.sameEcCount=ecCount.get(h.ec>>>0);
  return list;
}
// v73: 走査は Web Worker(scan-worker.js)でも画面側でも同じ関数で行う。onProgress には 0〜1 の進み具合を渡す。
const SCAN_STEP=0x4000;   // 進み具合を知らせる間隔(オフセット数)
function scanCount(input){return Math.max(0,input.length-232+1)}
function scanRange(input,gen,maxSpecies,from,to,out){
  // v38: 1 バイト刻み(v37 までは 2 バイト刻み)。奇数バイトずれた範囲(実例 ORAS -0x1F)の個体を見落としていたため
  for(let i=from;i<to;i++){
    const p=decryptPK(input.subarray(i,i+232));
    if(!p||p.species>maxSpecies)continue;
    out.push({offset:i,...p,gen});
  }
  return out;
}
function scan(input,gen,maxSpecies,onProgress){
  const out=[],n=scanCount(input);
  for(let i=0;i<n;i+=SCAN_STEP){const e=Math.min(n,i+SCAN_STEP);scanRange(input,gen,maxSpecies,i,e,out);if(onProgress)onProgress(e/n)}
  return classifyHits(out);
}
// 画面側で少しずつ走査する(Worker を作れないとき。file:// で開いたときなど)。結果は scan() と同じ
async function scanChunked(input,gen,maxSpecies,onProgress){
  const out=[],n=scanCount(input);
  for(let i=0;i<n;i+=SCAN_STEP){const e=Math.min(n,i+SCAN_STEP);scanRange(input,gen,maxSpecies,i,e,out);if(onProgress)onProgress(e/n);await new Promise(r=>setTimeout(r,0))}
  return classifyHits(out);
}
function shuffleForEncrypt(buf,sv){if(sv===0)return;const order=POS.slice(sv*4,sv*4+4),src=buf.slice(0,224);for(let i=0;i<4;i++)buf.set(src.slice(i*56,i*56+56),order[i]*56)}
function encryptPK(decrypted){const b=new Uint8Array(decrypted),ec=u32(b,0),sv=(ec>>>13)&31;shuffleForEncrypt(b.subarray(8,232),sv);crypt(b,8,232,ec);return b}
