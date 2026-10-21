// ===========================================================================
// NER Pokémon Recovery — export.js
// 出力(救出した main・boxdata.bin・まるごと復元)を作る処理。core.js / parse.js の後に読み込む。
// ===========================================================================
// 空のセーブ(サイト運営者が用意したもの)。ボックスが空の Checkpoint の main。
const ITEM_TEMPLATE={XY:'templates/main_xy',ORAS:'templates/main_oras'};
// 空のセーブを読み込んで検査する
async function loadTemplate(game){
  const path=ITEM_TEMPLATE[game];
  const noTemplate=m=>Object.assign(new Error(m),{noTemplate:true});   // v28: この場合は boxdata.bin に切り替える
  if(!path)throw noTemplate('このゲーム用の空のセーブが設定されていません。');
  let res;
  try{res=await fetch(path,{cache:'no-store'})}catch(e){throw new Error('空のセーブを読み込めませんでした(通信エラー)。')}
  if(!res.ok)throw noTemplate('このゲーム用の空のセーブがまだ設置されていません。');
  const t=new Uint8Array(await res.arrayBuffer());
  if(t.length!==SAVE[game])throw new Error('空のセーブのサイズが想定と違います。');
  const tl=findGen6Layout(t);
  if(!tl||tl.game!==game||((tl.shift%tl.saveSize)+tl.saveSize)%tl.saveSize!==0)throw new Error('空のセーブの構造が想定と違います。');
  return {t,tl};
}
// 空のセーブに、選んだポケモン・道具・お金を書き込んだ main を作る(v25。v19〜v24 の buildItemsSave を拡張)。
// opts: {game, bag, money, selected(一覧で選んだ個体), input(読み込んだセーブ), l6(そのブロック表)}
async function buildRescueMain(opts){
  const {game,bag,money,selected=[],input,l6}=opts;   // opts.includeEgg: 育て屋ごとにタマゴを引き継ぐか(v29)
  const {t,tl}=await loadTemplate(game);
  const out=t.slice(),changed=new Set(),report={pc:0,party:0,battle:0,daycare:0,partyToBox:0,skipped:0};
  const blk=id=>{const b=tl.blocks[id];if(!b)throw new Error('空のセーブのブロック表が想定と違います。');return b};
  const put32=(o,v)=>{out[o]=v&255;out[o+1]=(v>>>8)&255;out[o+2]=(v>>>16)&255;out[o+3]=(v>>>24)&255};
  // --- お金(v24)
  if(money){
    const mb=blk(BLK.MISC);
    if(mb.len!==MISC_LEN[game])throw new Error('空のセーブのお金の位置が想定と違います。');
    put32(mb.orig+8,Math.min(money.money,MONEY_MAX)>>>0);changed.add(BLK.MISC);
  }
  // --- トレーナー情報(v31): 名前・TID(・読めていれば SID)を書く
  if(opts.trainer){
    const sb=blk(17),t=opts.trainer;
    if(sb.len!==STATUS_LEN)throw new Error('空のセーブのトレーナー情報の位置が想定と違います。');
    out[sb.orig]=t.tid&255;out[sb.orig+1]=(t.tid>>8)&255;
    if(Number.isInteger(t.sid)){out[sb.orig+2]=t.sid&255;out[sb.orig+3]=(t.sid>>8)&255}
    const no=sb.orig+TRAINER_NAME_OFF;out.fill(0,no,no+(TRAINER_NAME_MAX+1)*2);
    for(let i=0;i<Math.min(t.name.length,TRAINER_NAME_MAX);i++){const c=t.name.charCodeAt(i);out[no+i*2]=c&255;out[no+i*2+1]=c>>8}
    changed.add(17);
  }
  // --- アバター(v33): 見た目の性別・通信で使うアバター・着せ替え(X・Y)、持っている服(X・Y、読めたときだけ)
  if(opts.avatar){
    const sb=blk(17),a=opts.avatar;
    out[sb.orig+5]=a.gender;
    if(a.sprite){out[sb.orig+6]=a.sprite[0];out[sb.orig+7]=a.sprite[1]}
    if(a.fashion&&game==='XY')a.fashion.forEach((v,i)=>{out[sb.orig+0x30+i]=v});
    changed.add(17);
    if(a.owned&&game==='XY'){const fb=blk(7);if(fb.len===a.owned.length){out.set(a.owned,fb.orig);changed.add(7)}}
  }
  // --- 図鑑(v30): ブロックごと写す
  if(opts.dex){
    const db=blk(20);
    if(db.len!==opts.dex.bytes.length)throw new Error('空のセーブの図鑑の位置が想定と違います。');
    out.set(opts.dex.bytes,db.orig);changed.add(20);
  }
  // --- ふしぎなおくりもの(v69): 無事ならブロックごと、壊れていれば読み取れたカードを順に入れ、そのカード番号の「受け取った」しるしを立てる
  if(opts.gift){
    const gb=blk(GIFT_BLOCK_ID),g=opts.gift;
    if(gb.len!==GIFT_LEN)throw new Error('空のセーブのふしぎなおくりものの位置が想定と違います。');
    if(g.ok&&g.bytes&&g.bytes.length===GIFT_LEN)out.set(g.bytes,gb.orig);
    else g.cards.slice(0,GIFT_SLOTS).forEach((c,i)=>{out.set(c.raw,gb.orig+GIFT_FLAG_BYTES+i*GIFT_CARD);if(c.id<2048)out[gb.orig+(c.id>>3)]|=1<<(c.id&7)});
    changed.add(GIFT_BLOCK_ID);
  }
  // --- 道具(v19)。大切なものは空のセーブのまま
  if(bag){
    const layout=BAG_LAYOUT[game],bb=blk(BLK.BAG);
    if(bb.len!==layout.len)throw new Error('空のセーブのバッグの位置が想定と違います。');
    for(const pc of layout.pouches){
      if(!pc.restore)continue;
      const base=bb.orig+pc.off,list=bag.pouches[pc.key]||[];
      out.fill(0,base,base+pc.size);
      list.slice(0,Math.floor(pc.size/4)).forEach(([id,cnt],i)=>{const o=base+i*4;out[o]=id&255;out[o+1]=id>>8;out[o+2]=cnt&255;out[o+3]=cnt>>8});
    }
    changed.add(BLK.BAG);
  }
  if(selected.length){
    const pcb=tl.blocks.find(b=>b.len===0x34AD0);
    if(!pcb)throw new Error('空のセーブのボックスの位置が想定と違います。');
    const used=new Set();let maxBox=0;
    const party=[],partyToBox=[];
    // --- PC ボックス: 元のボックス・番号へ
    const unknownSel=[];
    for(const q of selected){
      const sp=getSpecialLocation(q);
      if(sp){q.__sp=sp;continue}
      if(opts.unknownBox!=null&&isUnknownHit(q)){unknownSel.push(q);continue}   // v61: 場所不明は、あとで選んだボックスへ
      const loc=getLocation(q,window.__game,6);
      if(loc.box===null||!loc.aligned){report.skipped++;continue}
      const slot=(loc.box-1)*30+(loc.slot-1);
      if(used.has(slot)){report.skipped++;continue}
      out.set(encryptPK(q.data),pcb.orig+slot*232);used.add(slot);report.pc++;maxBox=Math.max(maxBox,loc.box);
    }
    // --- 手持ち: 元の順番で詰める。戦闘用の値が壊れていれば手持ちには入れず、空いているボックスへ
    for(const q of selected.filter(q=>q.__sp&&q.__sp.kind==='party').sort((a,b)=>a.__sp.index-b.__sp.index)){
      const raw=readRaw(input,q.offset,PARTY_SIZE);
      if(partyStatsValid(raw,q))party.push(raw);else partyToBox.push(q);
    }
    if(party.length){
      const pb=blk(BLK.PARTY);
      const empty=out.slice(pb.orig+5*PARTY_SIZE,pb.orig+6*PARTY_SIZE);   // 空のセーブの 6 番目(空き)の形
      for(let i=0;i<6;i++)out.set(i<party.length?party[i]:empty,pb.orig+i*PARTY_SIZE);
      out[pb.orig+PARTY_COUNT_OFF]=party.length;changed.add(BLK.PARTY);report.party=party.length;
    }
    // --- バトルボックス: 元の番号へ
    const bt=selected.filter(q=>q.__sp&&q.__sp.kind==='battle');
    if(bt.length){
      const b=blk(BLK.BATTLE);
      for(const q of bt){out.set(encryptPK(q.data),b.orig+q.__sp.index*232);report.battle++}
      changed.add(BLK.BATTLE);
    }
    // --- 育て屋: 元の枠に「預け中」として。預けてから得た経験値・タマゴ・乱数は、元の育て屋のブロックが無事なときだけ引き継ぐ
    const dc=selected.filter(q=>q.__sp&&q.__sp.kind==='daycare');
    if(dc.length){
      const b=blk(BLK.DAYCARE),src=l6&&l6.blocks[BLK.DAYCARE],srcOk=!!(src&&src.status==='ok'&&src.len===b.len);
      const srcBytes=srcOk?readBlockBytes(input,l6,src):null;
      for(const q of dc){
        const c=q.__sp.couple,base=b.orig+c*DAYCARE_COUPLE+q.__sp.index*DAYCARE_SLOT;
        if(c*DAYCARE_COUPLE+DAYCARE_SLOT*2>b.len){report.skipped++;continue}
        put32(base,1);
        put32(base+4,srcBytes?u32(srcBytes,c*DAYCARE_COUPLE+q.__sp.index*DAYCARE_SLOT+4):0);
        out.set(encryptPK(q.data),base+8);report.daycare++;
      }
      if(srcBytes){
        for(let c=0;c*DAYCARE_COUPLE<b.len;c++){
          // その育て屋で預け中だった個体がすべて書き込めたときだけ、タマゴと乱数も引き継ぐ
          const occ=[0,1].filter(s=>srcBytes[c*DAYCARE_COUPLE+s*DAYCARE_SLOT]===1);
          const done=occ.every(s=>dc.some(q=>q.__sp.couple===c&&q.__sp.index===s));
          if(!occ.length||!done)continue;
          const cb=b.orig+c*DAYCARE_COUPLE;
          // v29: タマゴは「手持ち等」タブで外せる(外したらタマゴなし)
          out[cb+0x1E0]=(opts.includeEgg&&opts.includeEgg[c]===false)?0:srcBytes[c*DAYCARE_COUPLE+0x1E0];
          out.set(srcBytes.subarray(c*DAYCARE_COUPLE+0x1E8,c*DAYCARE_COUPLE+0x1F0),cb+0x1E8);
        }
      }
      changed.add(BLK.DAYCARE);
    }
    // --- 戦闘用の値が壊れていた手持ちは、空いているボックスの先頭から
    for(const q of partyToBox){
      let slot=-1;
      for(let i=0;i<31*30;i++)if(!used.has(i)&&isEmptySlot(out.subarray(pcb.orig+i*232,pcb.orig+i*232+232))){slot=i;break}
      if(slot<0){report.skipped++;continue}
      out.set(encryptPK(q.data),pcb.orig+slot*232);used.add(slot);report.partyToBox++;maxBox=Math.max(maxBox,Math.floor(slot/30)+1);
    }
    // --- v61: 場所不明のポケモンは、選んだボックスの空いているマスから(足りなければ次のボックスへ)
    for(const q of unknownSel){
      let slot=-1;
      for(let k=0;k<31*30;k++){const i=(opts.unknownBox*30+k)%(31*30);if(!used.has(i)&&isEmptySlot(out.subarray(pcb.orig+i*232,pcb.orig+i*232+232))){slot=i;break}}
      if(slot<0){report.skipped++;continue}
      out.set(encryptPK(q.data),pcb.orig+slot*232);used.add(slot);report.unknown=(report.unknown||0)+1;maxBox=Math.max(maxBox,Math.floor(slot/30)+1);
    }
    for(const q of selected)delete q.__sp;
    if(used.size)changed.add(pcb.id);
    // --- ボックス名・壁紙: 元のブロックが無事なら丸ごと、名前だけ読めたなら名前だけ。
    // 空のセーブは使えるボックスが 7 個なので、書き込んだボックスまで使えるようにする(+0x43E)。
    const lb=tl.blocks.find(b=>b.len===0x440),src=l6&&l6.blocks.find(b=>b.len===0x440);
    if(lb){
      if(src&&src.status==='ok'){const sb=readBlockBytes(input,l6,src);if(sb)out.set(sb,lb.orig)}
      else{
        if(window.__boxNames){
          window.__boxNames.forEach((name,i)=>{const o=lb.orig+i*0x22;out.fill(0,o,o+0x22);for(let k=0;k<Math.min(name.length,16);k++){const c=name.charCodeAt(k);out[o+k*2]=c&255;out[o+k*2+1]=c>>8}});
        }
        // v29: 壁紙(+0x41E から 31 バイト)。ブロックが壊れていても、31 個すべてが壁紙番号(0〜23)として妥当なら写す
        const sb=src?readBlockBytes(input,l6,src):null;
        if(sb){const w=sb.subarray(0x41E,0x41E+31);if(w.every(v=>v<=WALLPAPER_MAX))out.set(w,lb.orig+0x41E)}
        // 使えるボックスの数(+0x43E)も、1〜31 なら元のセーブに合わせる
        if(sb&&sb[0x43E]>=1&&sb[0x43E]<=31&&out[lb.orig+0x43E]<sb[0x43E])out[lb.orig+0x43E]=sb[0x43E];
      }
      if(out[lb.orig+0x43E]<maxBox)out[lb.orig+0x43E]=maxBox;
      changed.add(lb.id);
    }
  }
  // v42: フッターの先頭 16 バイト(最後に保存した日時 = セキュアバリュー / その前の日時)は、読み込んだセーブのものにする。
  // 空のセーブの値のままだと、ダウンロード版では本体に記録された値と合わず「レポートがこわれています」になりうるため。
  if(l6&&l6.lin&&l6.game===game){const F=l6.footerOrig;out.set(l6.lin.subarray(F,F+16),tl.footerFile)}
  // 書き換えたブロックの CRC16 をフッターのブロック表に書く(マジックの 4 バイト後から 8 バイトずつ: 長さ u32, ID u16, CRC u16)
  for(const id of changed){
    const b=tl.blocks[id],crc=crc16ccitt(i=>out[b.orig+i],b.len),e=tl.footerFile+0x10+4+id*8;
    out[e+6]=crc&255;out[e+7]=crc>>8;
  }
  return {data:out,report};
}
function makePCBinary(selected,game,gen){
  const layout=getStorageLayout(game,gen);
  if(!layout)throw new Error('この世代のPCボックス配置には未対応です。');
  const total=layout.slots*layout.size,out=new Uint8Array(total);
  let placed=0,unknown=0,conflicts=0;const used=new Set();
  for(const q of selected){
    const loc=getLocation(q,game,gen);
    if(loc.box!==null&&loc.aligned){   // v38: マスにぴったり合う個体だけ(ずれた個体を隣のマスに入れないため)
      const slot=(loc.box-1)*30+(loc.slot-1);
      if(used.has(slot)){conflicts++;continue}
      out.set(encryptPK(q.data),slot*232);used.add(slot);placed++;
    }else unknown++;
  }
  return {data:out,placed,unknown,conflicts,layout};
}

// ---------------------------------------------------------------------------
// セーブデータ復元(v38)。位置合わせ(relocateBlocks)で無事だったブロックを本来の位置に戻し、
// 失われたブロックは空のセーブ(ないゲームは 0)で補って、セーブをまるごと作り直す。
// PC ボックスのブロックが壊れていれば、救出できた個体を元のマスに入れ、ほかのマスは空きにする。
// フッター(ブロック表)は CRC を付け直し、先頭 16 バイト(セキュアバリュー・日時)は元のセーブのものを使う。
// 復元信頼度: ブロックごとの重み(遊ぶうえでの大事さ)で、戻せた割合を出す。PC ボックスは読めたマスの割合。
// ---------------------------------------------------------------------------
const BLOCK_NAME={0:'ポフレ',1:'バッグ',2:'Yボタンに登録した道具',3:'ゲーム内の時刻',4:'現在地',5:'乱数の種',6:'プレイ時間',7:'持っている服',8:'ポケパルレのミニゲーム記録',9:'一時的な状態',
  10:'マップ上の人や物の位置',11:'お金・バッジ・BP',12:'ボックス名・壁紙',13:'バトルボックス',14:'PSS(1)',15:'PSS(2)',16:'PSS(3)',17:'トレーナー情報',18:'手持ち',19:'ストーリーの進み具合(イベント)',
  20:'図鑑',21:'ホロキャスターの記録',22:'合体中のポケモン',23:'設定',24:'ポケパルレのかざり',25:'Oパワー',26:'かいりきの岩の位置',27:'トレーナーPRビデオ',28:'GTS',29:'メニューの状態',
  30:'PSSのプロフィール',31:'むしよけスプレーなどの状態',32:'ふしぎなおくりものの受信履歴',33:'すれちがい通信の履歴',34:'ライブ大会・バトルスポット',35:'通信の記録',36:'殿堂入り',37:'バトルハウス',38:'育て屋',39:'トライアルハウス',
  40:'きのみ畑',41:'ふしぎなおくりもの',42:'イベントの記録',43:'ポケモンの日記',44:'レコード',45:'フレンドサファリ',46:'スーパートレーニング',47:'(未使用)',48:'ポケモンリンク',49:'PSSの利用状況',
  50:'ゲームシンク',51:'PSSのアイコン',52:'通信用の検証データ'};
const BLOCK_NAME_ORAS={53:'コンテスト',54:'ひみつきち',55:'むげんのチケット',56:'ボックスのポケモン',57:'写真'},BLOCK_NAME_XY={53:'ボックスのポケモン',54:'写真'};
const BLOCK_WEIGHT={1:6,4:5,6:1,10:3,11:4,12:2,13:2,17:6,18:8,19:10,20:4,36:2,38:2,44:1,47:0};   // 書いていないブロックは 1、PC ボックスは 30
function blockName(game,id){return (game==='ORAS'?BLOCK_NAME_ORAS:BLOCK_NAME_XY)[id]||BLOCK_NAME[id]||`ブロック${id}`}
function pcBlockOf(l6){return l6.blocks.find(b=>b.len===0x34AD0)}
function restoreAnalysis(){
  const l6=window.__layout6;
  if(!l6)return null;
  const pc=pcBlockOf(l6),slots=boxState.pages?boxState.pages.flatMap(p=>p.slots):null;
  let wSum=0,wGot=0;const lost=[],moved=[];
  let pcInfo=null;
  for(const b of l6.blocks){
    const isPc=b===pc,w=isPc?30:(BLOCK_WEIGHT[b.id]??1);
    let got=b.status==='ok'?1:0;
    if(isPc&&!got&&slots){
      const good=slots.filter(x=>x.status==='pokemon'||x.status==='empty').length;
      got=good/slots.length;
      pcInfo={pokemon:slots.filter(x=>x.status==='pokemon').length,unreadable:slots.length-good};
    }
    wSum+=w;wGot+=w*got;
    if(b.status!=='ok'&&!isPc)lost.push(b);
    if(b.moved)moved.push(b);
  }
  const score=wSum?Math.round(wGot/wSum*100):0;
  const story=[19,4,10].filter(id=>l6.blocks[id]&&l6.blocks[id].status!=='ok');
  return {l6,score,lost,moved,pc,pcOk:pc&&pc.status==='ok',pcInfo,story,total:l6.blocks.length,ok:l6.okCount};
}
// ゲームが書く空きマス(EC=0・種族 0。ニックネーム欄に「タマゴ」、チェックサム 0x9552)を作る
function emptySlotStub(){
  const b=new Uint8Array(232);
  b[6]=0x52;b[7]=0x95;
  [0xBF,0x30,0xDE,0x30,0xB4,0x30].forEach((v,i)=>{b[0x40+i]=v});
  b[0xE0]=1;b[0xE1]=2;b[0xE3]=1;
  return crypt(b,8,232,0);
}
async function buildFullRestore(){
  const a=restoreAnalysis();
  if(!a)throw new Error('ブロック表が見つからないセーブは、まるごとの復元ができません。');
  const l6=a.l6,game=l6.game,size=l6.saveSize;
  let tpl=null;
  try{tpl=await loadTemplate(game)}catch(e){if(!e.noTemplate)throw e}
  const out=tpl?tpl.t.slice():new Uint8Array(size);
  const report={restored:0,moved:0,fromTemplate:0,zero:0,pcPokemon:0,pcEmpty:0};
  for(const b of l6.blocks){
    if(b.status==='ok'){out.set(l6.lin.subarray(b.at,b.at+b.len),b.orig);report.restored++;if(b.moved)report.moved++;continue}
    if(b===a.pc){
      // 壊れた PC ボックス: 救出できた個体は元の暗号化データのまま元のマスへ、ほかは空きマス
      const stub=emptySlotStub(),slots=boxState.pages?boxState.pages.flatMap(p=>p.slots):[];
      for(let i=0;i<b.len/232;i++){
        const o=b.orig+i*232,sl=slots[i];
        if(sl&&sl.status==='pokemon'){const src=l6.toOrig(sl.hit.offset);out.set(l6.lin.subarray(src,src+232),o);report.pcPokemon++}
        else{out.set(stub,o);report.pcEmpty++}
      }
      continue;
    }
    if(tpl)report.fromTemplate++;else{out.fill(0,b.orig,b.orig+b.len);report.zero++}
  }
  // フッター: ブロック表(長さ・ID)は元のセーブのもの、CRC は付け直す。先頭 16 バイトは元のセーブのもの
  const F=l6.footerOrig;
  out.set(l6.lin.subarray(F,F+0x200),F);
  for(const b of l6.blocks){
    const e=F+0x10+4+b.id*8,c=crc16fast(out,b.orig,b.len);
    out[e]=b.len&255;out[e+1]=(b.len>>8)&255;out[e+2]=(b.len>>16)&255;out[e+3]=(b.len>>>24)&255;
    out[e+4]=b.id&255;out[e+5]=b.id>>8;out[e+6]=c&255;out[e+7]=c>>8;
  }
  out[F+0x10]=0x46;out[F+0x11]=0x45;out[F+0x12]=0x45;out[F+0x13]=0x42;   // "FEEB"(0x42454546)
  const check=findGen6Layout(out);
  report.allValid=!!(check&&check.okCount===l6.blocks.length&&check.game===game);
  report.hasTemplate=!!tpl;
  return {data:out,report,analysis:a};
}
function toBase64(u8){let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)}
