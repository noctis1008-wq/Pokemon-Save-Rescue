// ===========================================================================
// NER Pokémon Recovery — ui.js
// 画面(読み込み・一覧・各タブ・ダイアログ・ダウンロード・サンプル提供・修復依頼)。最後に読み込む。
// ===========================================================================
// v67: ブラウザ(とくに iPhone の Brave)が古いページを覚えたままになることがあるので、
// 開くたびに最新の版番号(version.json)を確かめ、古ければ自動で新しいページを読み込み直す
(function(){if(location.protocol==='file:')return;
  fetch('version.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{
    if(!j||!j.version||String(j.version)===APP_VERSION)return;
    let key='nerReloadedFor'+j.version;try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'1')}catch(e){return}
    const u=new URL(location.href);u.searchParams.set('_v',j.version);location.replace(u.toString());
  }).catch(()=>{})})();
const fileInput=document.getElementById('file');const drop=document.getElementById('drop');const statusEl=document.getElementById('status');const result=document.getElementById('result');const gameEl=document.getElementById('game');const sizeEl=document.getElementById('size');const countEl=document.getElementById('count');const listEl=document.getElementById('list');const download=document.getElementById('download');
function giftIncluded(){const g=window.__gift;return window.__includeGift!==false&&!!g&&(g.cards.length>0||(g.ok&&g.flags>0))}
function renderGiftViewer(viewer){
  if(!viewer)return;
  const g=window.__gift;
  if(!g){viewer.innerHTML='<p class="photo-note">このセーブからは、ふしぎなおくりものを読み取れませんでした。</p>';return}
  if(!g.cards.length&&!(g.ok&&g.flags>0)){viewer.innerHTML=`<p class="photo-note">ふしぎなおくりもののカードは見つかりませんでした${g.ok?'(カードアルバムは空でした)':''}。</p>`;return}
  const kind=t=>t===0?'ポケモン':t===1?'道具':'パワー';
  const rows=g.cards.map(c=>{
    let what='';
    if(c.type===0)what=c.egg?`${escapeHtml(SPECIES[c.species]||('No.'+c.species))} のタマゴ`:`${escapeHtml(SPECIES[c.species]||('No.'+c.species))} Lv.${c.level}`;
    else if(c.type===1)what=`${escapeHtml(PK_ITEM_NAME[c.item]||('道具('+c.item+')'))}${c.qty>1?' ×'+c.qty:''}`;
    else what='パワー';
    const st=c.type===2?'':c.used?'<span class="gift-state used">受け取り済み</span>':'<span class="gift-state new">まだ受け取っていない</span>';
    return `<li class="gift-card"><div class="gift-top"><span class="gift-kind k${c.type}">${kind(c.type)}</span><b class="gift-title">${escapeHtml(c.title)}</b></div><div class="gift-meta"><span>${what}</span>${st}<span class="gift-date">${giftDate(c)}</span></div></li>`}).join('');
  const unused=g.cards.filter(c=>c.type!==2&&!c.used).length;
  viewer.innerHTML=`<label class="items-toggle"><input type="checkbox" class="include-gift"${window.__includeGift!==false?' checked':''}><span>ふしぎなおくりものを復元する</span></label>
    <div class="dex-summary"><div><span>カード</span><strong>${g.cards.length}枚</strong></div><div><span>未受け取り</span><strong>${unused}枚</strong></div></div>
    ${g.cards.length?`<ul class="gift-list">${rows}</ul>`:''}
    <p class="photo-note">${g.ok?'カードアルバムと「受け取ったおくりもの」の記録をそのまま戻します。':'セーブのこの部分は壊れていたため、読み取れたカードだけを戻します。'}${unused?'「まだ受け取っていない」おくりものは、ゲームでポケモンセンターの配達員から受け取れます。':''}</p>`;
  const cb=viewer.querySelector('.include-gift');
  cb.addEventListener('change',()=>{window.__includeGift=cb.checked;updateItemsButton()});
}
function clearMsg(){statusEl.textContent='';statusEl.className='status hidden';statusEl.removeAttribute('aria-busy')}
function msg(t,err=false){statusEl.textContent=t;statusEl.className='status'+(err?' error':'');statusEl.removeAttribute('aria-busy')}
// v73: 走査の進み具合(文字と進捗バー)。読み上げが多くなりすぎないよう、文字は 10% ごとに更新する
function msgProgress(t,ratio){
  const pct=Math.max(0,Math.min(100,Math.floor(ratio*100)));
  let text=statusEl.querySelector('.status-text'),bar=statusEl.querySelector('.status-progress');
  if(!text||!bar){
    statusEl.textContent='';
    text=document.createElement('span');text.className='status-text';
    bar=document.createElement('progress');bar.className='status-progress';bar.max=100;bar.setAttribute('aria-label','解析の進み具合');
    statusEl.append(text,bar);
  }
  statusEl.className='status';statusEl.setAttribute('aria-busy','true');
  bar.value=pct;
  const shown=`${t} ${Math.floor(pct/10)*10}%`;if(text.textContent!==shown)text.textContent=shown;
}
// v73: 個体の走査は Web Worker で行い、画面を止めない。Worker を作れない・途中で失敗したときは画面側で少しずつ走査する(結果は同じ)
function scanInBackground(input,gen,maxSpecies,onProgress){
  return new Promise((resolve,reject)=>{
    let w=null,settled=false;
    const fallback=()=>{if(settled)return;settled=true;if(w)try{w.terminate()}catch(e){}scanChunked(input,gen,maxSpecies,onProgress).then(resolve,reject)};
    if(typeof Worker==='undefined'||location.protocol==='file:'){fallback();return}
    try{w=new Worker('js/scan-worker.js?v='+APP_VERSION)}catch(e){fallback();return}
    w.onmessage=e=>{
      const m=e.data||{};
      if(m.type==='progress'){if(!settled&&onProgress)onProgress(m.p)}
      else if(m.type==='done'){if(settled)return;settled=true;w.terminate();resolve(m.hits)}
      else fallback();
    };
    w.onerror=e=>{if(e&&e.preventDefault)e.preventDefault();fallback()};
    try{w.postMessage({input,gen,maxSpecies})}catch(e){fallback()}
  });
}
let analyzeSeq=0;   // v73: 走査中に別のファイルを読み込んだら、古いほうの結果は使わない
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function confidenceLabel(c){return c==='complete'?'完全復元':c==='partial'?'一部破損':'低信頼候補'}
function confidenceClass(c){return c==='complete'?'complete':c==='partial'?'partial':'low'}
// ---------------------------------------------------------------------------
// 一覧の縦幅(v14〜)。初期値は 700px(v15 で v14 の 2080px の約 1/3 に変更)、ただし中身より高くはしない。
// 一覧の下のつまみをドラッグ(マウス・タッチ共通の Pointer Events)するか、
// つまみにフォーカスして上下キーで変更できる。CSS の resize はタッチ端末で使えないため自前で実装。
// ---------------------------------------------------------------------------
const LIST_DEFAULT_HEIGHT=700,LIST_MIN_HEIGHT=160,LIST_KEY_STEP=80;
function setupListResizer(list,handle){
  if(!list||!handle)return;
  // 中身より高くならないよう CSS で max-height: max-content を指定している。
  // 描画直後は結果欄が非表示で scrollHeight が 0 のことがあるため、上限は表示中にだけ JS でも当てる。
  const maxH=()=>list.scrollHeight>0?Math.max(LIST_MIN_HEIGHT,list.scrollHeight):Infinity;
  const setH=h=>{list.style.height=Math.round(Math.min(maxH(),Math.max(LIST_MIN_HEIGHT,h)))+'px'};
  setH(LIST_DEFAULT_HEIGHT);
  let startY=0,startH=0,dragging=false;
  handle.addEventListener('pointerdown',e=>{dragging=true;startY=e.clientY;startH=list.getBoundingClientRect().height;try{handle.setPointerCapture(e.pointerId)}catch(_){}handle.classList.add('dragging');e.preventDefault()});
  handle.addEventListener('pointermove',e=>{if(dragging)setH(startH+e.clientY-startY)});
  const end=e=>{if(!dragging)return;dragging=false;handle.classList.remove('dragging');try{handle.releasePointerCapture(e.pointerId)}catch(_){}}
  handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);
  handle.addEventListener('keydown',e=>{
    const h=list.getBoundingClientRect().height;
    if(e.key==='ArrowDown'){setH(h+LIST_KEY_STEP);e.preventDefault()}
    else if(e.key==='ArrowUp'){setH(h-LIST_KEY_STEP);e.preventDefault()}
  });
}
function renderList(hits){
  // v32: タブは ポケモン / バッグ / 図鑑 / トレーナー。ポケモンタブの中で 一覧 / 手持ち等 / ボックス を切り替える。写真はトレーナータブの中。
  const ra0=restoreAnalysis();
  listEl.innerHTML=`
    <div class="method-switch" role="tablist" aria-label="復元の方法">
      <button type="button" class="method-card" role="tab" data-method="rescue"><span class="method-icon" aria-hidden="true">🎒</span><b>ポケモンを救出</b><span class="method-desc">ポケモンや道具などを選んで、正常なセーブデータに連れていきます</span></button>
      <button type="button" class="method-card" role="tab" data-method="full"${ra0?'':' disabled'}><span class="method-icon" aria-hidden="true">💾</span><b>まるごと復元</b><span class="method-desc">${ra0?'残っている全ての情報を保持したまま、元のセーブを作り直します':'このセーブではできません'}</span>${ra0?'<em class="method-score"></em>':''}</button>
    </div>
    <p class="method-caption">救出に入れるものを、タブごとに選んでください</p>
    <div class="view-tabs" role="tablist">
      <button type="button" class="view-tab" role="tab" aria-selected="false" data-view="pokemon">ポケモン</button>
      <button type="button" class="view-tab" role="tab" aria-selected="false" data-view="items">バッグ</button>
      <button type="button" class="view-tab" role="tab" aria-selected="false" data-view="trainer">トレーナー</button>
      <button type="button" class="view-tab" role="tab" aria-selected="false" data-view="dex">図鑑</button>
      <button type="button" class="view-tab" role="tab" aria-selected="false" data-view="gift" title="ふしぎなおくりもの">おくりもの</button>
    </div>
    <div class="view-panel" data-view="pokemon">
      <div class="recovery-controls">
        <div class="selection-title"><strong>復元する個体を選択してください</strong></div>
        <div class="selection-actions">
          <button type="button" class="small-button" data-action="all">すべて選択</button>
          <button type="button" class="small-button" data-action="none">すべて解除</button>
          <div class="tap-mode" role="group" aria-label="タップしたとき"><button type="button" class="tap-mode-btn" data-tap="select">選択</button><button type="button" class="tap-mode-btn" data-tap="detail">詳細</button></div>
        </div>
        <div class="selection-count-row"><span id="selectionSummary" class="selection-count">選択中 0 匹</span></div>
      </div>
      <div class="sub-tabs" role="tablist">
        <button type="button" class="sub-tab" role="tab" aria-selected="false" data-sub="list">一覧</button>
        <button type="button" class="sub-tab" role="tab" aria-selected="false" data-sub="party">手持ち等</button>
        <button type="button" class="sub-tab" role="tab" aria-selected="false" data-sub="box">ボックス</button>
      </div>
      <div class="sub-panel" data-sub="list">
        <div class="candidate-list${BALL_IMAGE_DIR?' ball-images':''}">${renderHeader()}${hits.map(p=>renderCandidate(p)).join('')}</div>
        <div class="list-resizer" role="separator" aria-orientation="horizontal" aria-label="一覧の縦幅を変更(ドラッグ、または上下キー)" tabindex="0"><span></span></div>
      </div>
      <div class="sub-panel" data-sub="party"><div class="party-viewer"></div></div>
      <div class="sub-panel" data-sub="box"><div class="box-viewer"></div></div>
    </div>
    <div class="view-panel" data-view="items"><div class="items-viewer"></div></div>
    <div class="view-panel" data-view="trainer"><div class="trainer-viewer"></div><h3 class="photo-heading trainer-photo-heading">写真</h3><div class="photo-viewer"></div></div>
    <div class="view-panel" data-view="dex"><div class="dex-viewer"></div></div>
    <div class="view-panel" data-view="gift"><div class="gift-viewer"></div></div>
    <div class="view-panel" data-view="restore"><div class="restore-viewer"></div></div>`;
  setupListResizer(listEl.querySelector('.candidate-list'),listEl.querySelector('.list-resizer'));
  listEl.querySelectorAll('.candidate-check').forEach(cb=>cb.addEventListener('change',()=>{updateSelectionSummary();refreshBoxSelection()}));
  listEl.querySelectorAll('label.candidate').forEach(row=>{const cb=row.querySelector('.candidate-check');if(cb)bindLongPress(row,Number(cb.dataset.offset))});   // v61: 一覧でも長押しで詳細
  listEl.querySelectorAll('.small-button').forEach(btn=>btn.addEventListener('click',()=>{
    const action=btn.dataset.action;
    listEl.querySelectorAll('.candidate-check').forEach(cb=>{cb.checked=action==='all'});
    updateSelectionSummary();refreshBoxSelection();
  }));
  listEl.querySelectorAll('.view-tab').forEach(tab=>tab.addEventListener('click',()=>showView(tab.dataset.view)));
  // v63: タップしたときの動き(選択 / 詳細)。長押しはどちらでも詳細
  const setTap=m=>{tapMode=m;try{localStorage.setItem('nerTapMode',m)}catch(e){}listEl.querySelectorAll('.tap-mode-btn').forEach(b=>{const on=b.dataset.tap===m;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on)})};
  listEl.querySelectorAll('.tap-mode-btn').forEach(b=>b.addEventListener('click',()=>setTap(b.dataset.tap)));
  setTap(tapMode);
  listEl.querySelectorAll('.method-card').forEach(c=>c.addEventListener('click',()=>showView(c.dataset.method==='full'?'restore':(window.__lastRescueView||'pokemon'))));
  listEl.querySelectorAll('.sub-tab').forEach(tab=>tab.addEventListener('click',()=>showSub(tab.dataset.sub)));
  boxState.pages=buildBoxPages(hits);boxState.__shown=null;
  boxState.unknown=boxState.pages?unknownPages():[];
  window.__favHits=null;   // v50: 大切なポケモンの判定をやり直す
  boxState.current=firstBoxWithPokemon(boxState.pages)+(boxState.unknown?boxState.unknown.length:0);   // v62: 場所不明のページが先頭に入るぶんずらす
  renderBoxViewer();
  renderPartyViewer();
  renderItemsViewer(listEl.querySelector('.items-viewer'));
  renderDexViewer(listEl.querySelector('.dex-viewer'));
  renderGiftViewer(listEl.querySelector('.gift-viewer'));   // v69
  renderTrainerViewer(listEl.querySelector('.trainer-viewer'));
  renderRestoreViewer();
  {const a=restoreAnalysis(),em=listEl.querySelector('.method-score');if(a&&em){em.textContent=`信頼度 ${a.score}%`;em.classList.add(a.score>=RESTORE_TAB_MIN_SCORE?'high':a.score>=RESTORE_LOW_SCORE?'mid':'low')}}
  renderPhotoViewer(listEl.querySelector('.photo-viewer'));
  markDuplicates();
  // v61: 場所不明のポケモンは、すでに逃がしたり交換したりした古いデータのこともあるので、最初は選ばない
  if(boxState.pages)(window.__hits||[]).forEach(h=>{if(isUnknownHit(h)){const cb=listEl.querySelector(`.candidate-check[data-offset="${h.offset}"]`);if(cb)cb.checked=false}});
  updateSelectionSummary();
  showView(preferRestoreTab()?'restore':'pokemon');showSub('box');   // v32: 読み込み直後はポケモンタブのボックス(ポケモンがいる一番若いボックス)。v45: まるごと復元できそうならそのタブ
  showPurposeSurvey();   // v46: 目的のアンケート(スキップ可)
}

// ---------------------------------------------------------------------------
// v46: 読み込み後の目的アンケート。答えに応じておすすめの操作を出し、「この設定にする」で反映する。
// 「次から表示しない」はこの端末のブラウザに覚える(localStorage の nerSurveyOff)。
// ---------------------------------------------------------------------------
function surveyOff(){try{return localStorage.getItem('nerSurveyOff')==='1'}catch(e){return false}}
function setSurveyOff(v){try{v?localStorage.setItem('nerSurveyOff','1'):localStorage.removeItem('nerSurveyOff')}catch(e){}}
// v46: 信頼度がこの値未満を「低い」とする(まるごと復元タブの表示と同じ区切り)
const RESTORE_LOW_SCORE=70;
// まるごと復元では戻らないポケモンの数。手持ち・バトルボックス・育て屋の部分が壊れていると、
// まるごと復元ではその部分が空のセーブの内容になるが、救出ならそこで見つかった個体を入れられる。
function fullRestoreMissing(){
  const l6=window.__layout6;if(!l6)return 0;
  const blk={party:BLK.PARTY,battle:BLK.BATTLE,daycare:BLK.DAYCARE};
  return (window.__hits||[]).filter(h=>{const sp=getSpecialLocation(h);if(!sp||!blk[sp.kind])return false;const b=l6.blocks[blk[sp.kind]];return !b||b.status!=='ok'}).length;
}
function missingNote(){const n=fullRestoreMissing();return n?`${n}体のポケモンが戻ってきません。「ポケモンの救出」をおすすめします。`:''}
function goRescueAll(){listEl.querySelectorAll('.candidate-check').forEach(cb=>{cb.checked=true});updateSelectionSummary();refreshBoxSelection();showView('pokemon');showSub('box')}
// 共通の小さな確認画面(アンケートと同じ見た目)。buttons: [{label, primary, onClick}]
function surveyDialog(){
  let d=document.getElementById('purposeSurvey');
  if(!d){d=document.createElement('div');d.id='purposeSurvey';d.className='sample-dialog survey-dialog';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby','surveyTitle');document.body.appendChild(d)}
  d.onclick=e=>{if(e.target===d)d.classList.add('hidden')};
  return d;
}
function lowScoreText(sc){return `復元信頼度が${sc}%しかありません。ポケモンだけの救出をおすすめします。このまま続けますか？`}
// まるごと復元のボタンを押したときも、信頼度が低ければ確かめる
function confirmLowRestore(onContinue){
  const a=restoreAnalysis();
  if(!a||a.score>=RESTORE_LOW_SCORE){onContinue();return}
  const d=surveyDialog(),note=missingNote();
  d.innerHTML=`<div class="sample-dialog-box survey-box"><h3 id="surveyTitle">まるごと復元の確認</h3>
    <p class="survey-warn">${escapeHtml(lowScoreText(a.score))}</p>${note?`<p class="survey-text">${escapeHtml(note)}</p>`:''}
    <div class="sample-dialog-actions"><button type="button" class="button survey-go">続ける</button><button type="button" class="button button-secondary survey-rescue">救出だけにする</button></div></div>`;
  d.querySelector('.survey-go').addEventListener('click',()=>{d.classList.add('hidden');onContinue()});
  d.querySelector('.survey-rescue').addEventListener('click',()=>{d.classList.add('hidden');goRescueAll()});
  d.classList.remove('hidden');
}
function showPurposeSurvey(){
  if(surveyOff()||!listEl.querySelector('.view-tabs'))return;
  const d=surveyDialog();
  const close=()=>d.classList.add('hidden');
  const offBox=`<label class="survey-off"><input type="checkbox" class="survey-off-check"${surveyOff()?' checked':''}> 次から表示しない</label>`;
  const bindOff=()=>{const c=d.querySelector('.survey-off-check');if(c)c.addEventListener('change',()=>setSurveyOff(c.checked))};
  const show=html=>{d.innerHTML=`<div class="sample-dialog-box survey-box">${html}${offBox}</div>`;bindOff();d.classList.remove('hidden')};
  const done=(fn)=>{fn();close();const t=listEl.querySelector('.view-tabs');if(t)t.scrollIntoView({behavior:'smooth',block:'start'})};
  const a=restoreAnalysis(),note=missingNote();
  const ask=()=>{
    show(`<h3 id="surveyTitle">何を取り戻したいですか？</h3>
      <p class="survey-lead">ご希望に合わせて、おすすめの使い方をご案内します（スキップ可）。</p>
      <button type="button" class="survey-choice" data-c="rescue"><b>ポケモンだけ救出したい</b><span>救出したポケモンを、正常なセーブデータに連れていきます。道具等も復元できることがあります。</span></button>
      <button type="button" class="survey-choice" data-c="full"><b>できる限りすべてのデータを復元したい</b><span>ポケモンや道具等に加え、トレーナーの詳細情報や殿堂入りなど、残っている全ての情報を保持したまま復元を試みます。</span></button>
      <div class="sample-dialog-actions"><button type="button" class="button button-secondary survey-skip">スキップ</button></div>`);
    d.querySelector('.survey-skip').addEventListener('click',close);
    d.querySelectorAll('.survey-choice').forEach(btn=>btn.addEventListener('click',()=>btn.dataset.c==='rescue'?rescue():full()));
  };
  const result=(title,paras,applyLabel,apply,extra='')=>{
    show(`<h3 id="surveyTitle">おすすめ: ${escapeHtml(title)}</h3>${extra}${paras.filter(Boolean).map(t=>`<p class="survey-text">${escapeHtml(t)}</p>`).join('')}
      <div class="sample-dialog-actions"><button type="button" class="button survey-apply">この設定にする</button><button type="button" class="button button-secondary survey-back">戻る</button></div>
      <p class="survey-apply-note">「この設定にする」で${escapeHtml(applyLabel)}</p>`);
    d.querySelector('.survey-apply').addEventListener('click',()=>done(apply));
    d.querySelector('.survey-back').addEventListener('click',ask);
  };
  const rescue=()=>result('ポケモンを救出する',['ポケモンタブで選んで「ポケモンを救出する」を押すと、そのままゲームで遊べるセーブデータをダウンロードできます。'],'「ポケモンを救出」に切り替えて、ポケモンをすべて選ぶ',goRescueAll);
  const full=()=>{
    if(!a){result('ポケモンを救出する',['このセーブはまるごとの復元ができません(セーブの部品の一覧が見つからないため)。','ポケモンは救出で取り出せます。'],'「ポケモンを救出」に切り替えて、ポケモンをすべて選ぶ',goRescueAll);return}
    if(a.score<RESTORE_LOW_SCORE){
      show(`<h3 id="surveyTitle">まるごと復元の確認</h3><p class="survey-warn">${escapeHtml(lowScoreText(a.score))}</p>${note?`<p class="survey-text">${escapeHtml(note)}</p>`:''}
        <div class="sample-dialog-actions"><button type="button" class="button survey-go">続ける</button><button type="button" class="button button-secondary survey-rescue">救出だけにする</button></div>
        <div class="sample-dialog-actions survey-sub"><button type="button" class="small-button survey-back">戻る</button></div>`);
      d.querySelector('.survey-go').addEventListener('click',()=>done(()=>showView('restore')));
      d.querySelector('.survey-rescue').addEventListener('click',()=>done(goRescueAll));
      d.querySelector('.survey-back').addEventListener('click',ask);
      return;
    }
    result('まるごと復元',[`復元信頼度は ${a.score}% です。${a.score>=RESTORE_TAB_MIN_SCORE?'ほとんどの部分が残っています。':'一部の部分は空のセーブ(始めたばかりの状態)の内容で補われます。'}`,note,'ゲームに戻す前に、必ず元のセーブのバックアップを取ってください。'],'「まるごと復元」に切り替える',()=>showView('restore'));
  };
  ask();
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const d=document.getElementById('purposeSurvey');if(d)d.classList.add('hidden')}});
function showView(view){
  // v48: 「ポケモンを救出」と「まるごと復元」を上の 2 枚のカードで切り替える。救出のときだけ、入れるもののタブ(ポケモン・バッグ・トレーナー・図鑑)を出す
  const full=view==='restore';
  if(!full)window.__lastRescueView=view;
  listEl.querySelectorAll('.method-card').forEach(c=>{const on=(c.dataset.method==='full')===full;c.classList.toggle('active',on);c.setAttribute('aria-selected',on?'true':'false')});
  listEl.querySelectorAll('.view-tabs,.method-caption').forEach(e=>{e.style.display=full?'none':''});
  listEl.querySelectorAll('.view-tab').forEach(t=>{const on=t.dataset.view===view;t.classList.toggle('active',on);t.setAttribute('aria-selected',on?'true':'false')});
  listEl.querySelectorAll('.view-panel').forEach(p=>p.classList.toggle('active',p.dataset.view===view));
  {const dl=document.getElementById('download');if(dl)dl.closest('.action-buttons').style.display=view==='restore'?'none':''}   // v48: まるごと復元の画面では「ポケモンを救出する」を出さない
  if(view==='pokemon')refreshBoxSelection();
}
function showSub(sub){
  listEl.querySelectorAll('.sub-tab').forEach(t=>{const on=t.dataset.sub===sub;t.classList.toggle('active',on);t.setAttribute('aria-selected',on?'true':'false')});
  listEl.querySelectorAll('.sub-panel').forEach(p=>p.classList.toggle('active',p.dataset.sub===sub));
  refreshBoxSelection();
}

// ---------------------------------------------------------------------------
// ボックス表示(v16)。PKHeX のように 1 ボックス = 6 列 × 5 段で表示する。
// 各スロットを「個体(完全復元)」「空き」「破損(読めないデータ)」に分ける。
//   空き = 232 バイトがすべて 0、または EC=0 の空データを暗号化したもの(ゲームが書く空きスロット)
// 位置は一覧と同じ getLocation() の考え方(ブロック表のずれ補正)。
// マスをクリックすると、一覧のチェックと連動して救出に含める/外すを切り替える。
// ポケモンのアイコン画像は同梱していない(ゲームのキャラクター画像は権利者の著作物のため)。
// POKEMON_ICON_DIR に権利上問題のない画像を置いたディレクトリを指定すると <dir><全国図鑑番号>.png を表示し、
// null(既定)または読めない場合はポケモン名を表示する。
// ---------------------------------------------------------------------------
const POKEMON_ICON_DIR='img/pokemon/';   // v42: PokeSprite のアイコン(pk_icons.js と img/pokemon/)
// アイコンのファイル名。タマゴ・フォルム・メスの姿に対応し、分からないときはふつうの姿にする
function pkIconPath(hit){return pkIconPath0(hit)+'?v='+APP_VERSION}
// v59: アイコンは 1 枚の画像(atlas.png)から切り出して表示する(読み込みが 1 回ですむ)。
// コンテナクエリに対応していない古いブラウザでは、これまでどおり 1 匹ずつの画像を使う。
const USE_ATLAS=typeof PK_ATLAS!=='undefined'&&window.CSS&&CSS.supports&&CSS.supports('container-type:size');
if(USE_ATLAS){document.documentElement.style.setProperty('--atlas-w',PK_ATLAS_SIZE[0]);document.documentElement.style.setProperty('--atlas-url',`url("${POKEMON_ICON_DIR}atlas.png?v=${APP_VERSION}")`)}
function pkIconHtml(hit,alt){
  const key=pkIconPath0(hit).slice(POKEMON_ICON_DIR.length).replace(/\.png$/,'');
  const r=USE_ATLAS&&(PK_ATLAS[key]||PK_ATLAS[key.replace(/^female\//,'')]);
  if(r)return `<span class="spr-box" role="img" aria-label="${escapeHtml(alt)}"><span class="spr" style="--x:${r[0]};--y:${r[1]};--w:${r[2]};--h:${r[3]}"></span></span>`;
  return `<img class="box-icon" src="${pkIconPath(hit)}" loading="lazy" alt="${escapeHtml(alt)}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'box-name',textContent:this.alt}))">`;
}
function pkIconPath0(hit){
  const b=hit.data,sp=hit.species;
  if(((u32(b,0x74)>>>30)&1)===1)return POKEMON_ICON_DIR+(sp===490?'egg-manaphy':'egg')+'.png';
  const slug=(typeof PK_ICON_BASE!=='undefined'&&PK_ICON_BASE[sp])||null;
  if(!slug)return POKEMON_ICON_DIR+'unknown.png';
  const form=b[0x1D]>>>3,forms=PK_ICON_FORMS[sp];
  if(forms&&forms[form])return POKEMON_ICON_DIR+forms[form]+'.png';
  const female=((b[0x1D]>>>1)&3)===1;
  if(form===0&&((female&&PK_ICON_FEMALE.has(sp))))return POKEMON_ICON_DIR+'female/'+slug+'.png';
  if(sp===678&&form===1)return POKEMON_ICON_DIR+'female/meowstic.png';
  return POKEMON_ICON_DIR+slug+'.png';
}
function boxName(i){
  const names=window.__boxNames;
  return names&&names[i]?names[i]:`ボックス${i+1}`;
}
// ---------------------------------------------------------------------------
// 道具タブ(v20)。復元したバッグを、ポケット(道具/技マシン/薬/木の実)ごとのタブで表示する。
// 表示するのは「main を作る」で main に書き込む内容と同じ(大切なものは含めない)。
// ---------------------------------------------------------------------------
function renderItemsViewer(viewer){
  if(!viewer)return;
  const bag=window.__bag,money=window.__money;
  const moneyHtml=`<p class="money-row"><span>お金</span><strong>${money?'¥'+money.money.toLocaleString('ja-JP'):'読み取れませんでした'}</strong></p>`;
  // v30: 「お金を取り出す」「道具を取り出す」を別々に(道具ごとの選択はしない)
  const tg=(cls,on,label)=>`<label class="items-toggle"><input type="checkbox" class="${cls}"${on?' checked':''}><span>${label}</span></label>`;
  const moneyToggle=money?tg('include-money',window.__includeMoney!==false,'お金を取り出す'):'',itemsToggle=bag?tg('include-items',window.__includeItems!==false,'道具を取り出す'):'';
  const bindToggle=()=>{
    const ci=viewer.querySelector('.include-items');if(ci)ci.addEventListener('change',()=>{window.__includeItems=ci.checked;updateItemsButton()});
    const cm=viewer.querySelector('.include-money');if(cm)cm.addEventListener('change',()=>{window.__includeMoney=cm.checked;updateItemsButton()});
  };
  if(!bag){viewer.innerHTML=`<div class="bag-toggles">${moneyToggle}</div>`+moneyHtml+'<p class="photo-note">このセーブからは道具を復元できませんでした。</p>';bindToggle();return}
  const pouches=BAG_LAYOUT[bag.game].pouches.filter(p=>p.restore);
  const first=pouches.find(p=>(bag.pouches[p.key]||[]).length)||pouches[0];
  const tabs=pouches.map(p=>{const n=(bag.pouches[p.key]||[]).length;return `<button type="button" class="item-tab${p===first?' active':''}" role="tab" aria-selected="${p===first}" data-pouch="${p.key}">${p.name}<b>(${n})</b></button>`}).join('');
  const panels=pouches.map(p=>{
    const list=bag.pouches[p.key]||[];
    const rows=list.length?list.map(([id,cnt])=>`<li class="item-row"><span class="item-name">${escapeHtml(PK_ITEM_NAME[id]||('アイテム'+id))}</span><span class="item-count">×${cnt}</span></li>`).join(''):'<li class="item-empty">このポケットに復元できた道具はありません。</li>';
    return `<ul class="item-panel${p===first?' active':''}" role="tabpanel" data-pouch="${p.key}">${rows}</ul>`;
  }).join('');
  viewer.innerHTML=`<div class="bag-toggles">${moneyToggle}${itemsToggle}</div>`+moneyHtml+`<div class="item-tabs" role="tablist">${tabs}</div><div class="item-panels">${panels}</div>
    <p class="photo-note">大切なものは復元の対象外です。チェックがオンのものが、「ポケモンを救出する」で作る main に入ります。</p>`;
  bindToggle();
  viewer.querySelectorAll('.item-tab').forEach(t=>t.addEventListener('click',()=>{
    viewer.querySelectorAll('.item-tab').forEach(x=>{const on=x===t;x.classList.toggle('active',on);x.setAttribute('aria-selected',on?'true':'false')});
    viewer.querySelectorAll('.item-panel').forEach(x=>x.classList.toggle('active',x.dataset.pouch===t.dataset.pouch));
  }));
}
function renderDexViewer(viewer){
  if(!viewer)return;
  const dex=window.__dex;
  if(!dex){viewer.innerHTML='<p class="photo-note">このセーブからは図鑑を読み取れませんでした。救出した main の図鑑は、空のセーブのままになります。</p>';return}
  const st=dexStatus(dex.bytes);
  const rows=st.list.map(e=>`<li class="dex-row${e.caught?' is-caught':''}"><span class="dex-no">${String(e.no).padStart(3,'0')}</span><span class="dex-name">${escapeHtml(SPECIES[e.no]||('No.'+e.no))}</span><span class="dex-mark" title="${e.caught?'捕まえた':'見た'}" aria-label="${e.caught?'捕まえた':'見た'}">${e.caught?'●':'○'}</span></li>`).join('');
  viewer.innerHTML=`<label class="items-toggle"><input type="checkbox" class="include-dex"${window.__includeDex!==false?' checked':''}><span>図鑑を復元する</span></label>
    <div class="dex-summary"><div><span>見た</span><strong>${st.seen}</strong></div><div><span>捕まえた</span><strong>${st.caught}</strong></div></div>
    <ul class="dex-list">${rows}</ul>
    <p class="photo-note"><span class="dex-legend-caught">●</span> 捕まえた <span class="dex-legend-seen">○</span> 見た。登録されている種だけを表示しています(全国図鑑番号順)。</p>`;
  const cb=viewer.querySelector('.include-dex');
  cb.addEventListener('change',()=>{window.__includeDex=cb.checked;updateItemsButton()});
}
// ---------------------------------------------------------------------------
// トレーナータブ(v31)。読み取れたトレーナー名と ID を初期値として入力欄に入れる。
// 読み取れなければ空のセーブ(試験データ)の値を入れる。「トレーナー情報を復元する」がオンなら、入力欄の値を main に書く。
// SID(裏 ID)は表示しない。読み取れていれば一緒に書き、なければ空のセーブのまま。
// ---------------------------------------------------------------------------
async function templateTrainer(game){
  try{
    const {t,tl}=await loadTemplate(game);
    const b=tl.blocks[17];if(!b)return null;
    return readTrainerAt(i=>t[b.orig+i]);
  }catch(e){return null}
}
// X・Y の着ている服(v34)。+0x30 の 16 バイトを 4 つの u32 にし、PK_FASHION(pk_fashion.js)のビット位置で読む。「なし」は出さない。
function fashionItems(bytes,gender){
  if(!bytes||!(gender===0||gender===1)||typeof PK_FASHION==='undefined')return null;
  const w=[0,1,2,3].map(i=>(bytes[i*4]|(bytes[i*4+1]<<8)|(bytes[i*4+2]<<16)|(bytes[i*4+3]<<24))>>>0);
  const out=[];
  for(const p of PK_FASHION[gender===0?'male':'female']){
    const v=(w[p.w]>>>p.pos)&((1<<p.bits)-1),name=p.names[v];
    if(name==='なし')continue;
    out.push([p.label,name===undefined||name===null?`不明な番号(${v})`:name]);
  }
  return out;
}
// v34: トレーナー情報は「トレーナーの情報を復元する」「自分で入力する」のどちらか(両方オフなら空のセーブ=試験データのまま)。
//   復元する: 読み取った値を表示(入力不可) / 自分で入力する: 入力欄を書き換えられる(初めは表示中の値から) / どちらもオフ: 空のセーブの値(入力不可)
// window.__trainerMode = 'restore' | 'manual' | 'none'
function renderTrainerViewer(viewer){
  if(!viewer)return;
  const tr=window.__trainer,av=window.__avatar,game=window.__itemsGame;
  const genderText=g=>g===0?'男の子':g===1?'女の子':'—';
  const id5=n=>String(n).padStart(5,'0');
  const draw=tpl=>{
    const cands=otCandidates();
    if(!window.__trainerMode)window.__trainerMode=tr?'restore':cands.length?'pick':'none';   // v61: 読み取れなければ、一番多い親を選んでおく
    const mode=window.__trainerMode;
    const base=tr||tpl||{name:'',tid:0,sid:0};
    if(!window.__trainerInput)window.__trainerInput={name:base.name,tid:base.tid,sid:base.sid};
    const pick=cands[window.__trainerPick||0];
    const v=mode==='restore'?tr:mode==='manual'?window.__trainerInput:mode==='pick'&&pick?pick:(tpl||{name:'',tid:0,sid:0});
    const ro=mode==='manual'?'':' readonly';
    const aon=!!av&&window.__includeAvatar!==false;
    const src=aon?av:tpl;   // 表示する元(復元するなら読み取った値、しないなら空のセーブ)
    const row=(label,val)=>`<div class="avatar-row"><span>${label}</span><strong>${escapeHtml(val)}</strong></div>`;
    let avRows=row('性別',src?genderText(src.gender):'—');
    if(game==='XY'){
      const items=src?fashionItems(src.fashion,src.gender):null;
      avRows+=`<div class="avatar-sub">着ている服</div>`+(items?(items.length?items.map(([k,n])=>row(k,n)).join(''):row('服','なし')):row('服','—'));
      avRows+=row('持っている服・アクセサリー',aon?(av.owned?'元のセーブのもの':'読み取れませんでした(空のセーブのまま)'):'空のセーブのもの');
    }
    const note=mode==='restore'?'セーブから読み取った値です。':mode==='manual'?'入力した値が main に入ります。':mode==='pick'?'選んだ親と同じトレーナーになります。この親のポケモンは、ゲームで言うことを聞きます。':(tr?'救出用の空のセーブ(試験データ)の値です。':tpl?'セーブから読み取れなかったため、救出用の空のセーブ(試験データ)の値を表示しています。':'セーブから読み取れませんでした。');
    viewer.innerHTML=`<div class="trainer-modes">
        <label class="items-toggle${tr?'':' is-disabled'}"><input type="checkbox" class="trainer-mode" data-mode="restore"${mode==='restore'?' checked':''}${tr?'':' disabled'}><span>トレーナーの情報を復元する</span></label>
        <label class="items-toggle"><input type="checkbox" class="trainer-mode" data-mode="manual"${mode==='manual'?' checked':''}><span>自分で入力する</span></label>
        <label class="items-toggle${cands.length?'':' is-disabled'}"><input type="checkbox" class="trainer-mode" data-mode="pick"${mode==='pick'?' checked':''}${cands.length?'':' disabled'}><span>ポケモンの親から選ぶ</span></label>
      </div>
      ${mode==='pick'&&cands.length?`<select class="trainer-pick" aria-label="親を選ぶ">${cands.map((c,i)=>`<option value="${i}"${i===(window.__trainerPick||0)?' selected':''}>${escapeHtml(c.name)}(ID ${id5(c.tid)} / 裏ID ${id5(c.sid)}・${c.gender?'女の子':'男の子'})— ${c.count}匹</option>`).join('')}</select>`:''}
      <div class="trainer-form${mode==='manual'?'':' is-template'}">
        <label><span>トレーナー名</span><input type="text" class="trainer-name" maxlength="${TRAINER_NAME_MAX}" value="${escapeHtml(v.name)}"${ro}></label>
        <div class="trainer-ids">
          <label><span>ID</span><input type="text" class="trainer-tid" inputmode="numeric" maxlength="5" value="${id5(v.tid)}"${ro}></label>
          <label><span>裏ID</span><input type="text" class="trainer-sid" inputmode="numeric" maxlength="5" value="${id5(v.sid)}"${ro}></label>
        </div>
      </div>
      <p class="photo-note">${note}</p>${mode==='pick'&&pick&&src&&src.gender!==pick.gender?`<p class="photo-note" style="color:#b54708">選んだ親は${pick.gender?'女の子':'男の子'}ですが、アバターは${src.gender?'女の子':'男の子'}です。性別が違うと言うことを聞かないことがあるので、親と同じ性別のアバターにしてください。</p>`:''}
      <h3 class="photo-heading trainer-photo-heading">アバター</h3>
      <label class="items-toggle${av?'':' is-disabled'}"><input type="checkbox" class="include-avatar"${aon?' checked':''}${av?'':' disabled'}><span>アバター情報を復元する</span></label>
      <div class="avatar-info${aon?'':' is-template'}">${avRows}</div>
      <p class="photo-note">${av?(aon?'セーブから読み取ったアバターです。':'救出用の空のセーブ(試験データ)のアバターです。'):'セーブからアバターを読み取れませんでした(トレーナー情報が読み取れたときだけ復元できます)。'}${game==='XY'?' 服の名前は目安です(ゲーム内の正式名と違うことがあります)。':''}</p>`;
    viewer.querySelectorAll('.trainer-mode').forEach(cb=>cb.addEventListener('change',()=>{
      if(cb.checked){
        // 自分で入力に切り替えたら、そのとき表示していた値から書き換えを始める
        if(cb.dataset.mode==='manual'&&window.__trainerMode!=='manual'){const cur=window.__trainerMode==='restore'?tr:window.__trainerMode==='pick'&&pick?pick:(tpl||base);window.__trainerInput={name:cur.name,tid:cur.tid,sid:cur.sid}}
        window.__trainerMode=cb.dataset.mode;
      }else window.__trainerMode='none';
      updateItemsButton();draw(tpl);
    }));
    const tp=viewer.querySelector('.trainer-pick');
    if(tp)tp.addEventListener('change',()=>{window.__trainerPick=Number(tp.value);updateItemsButton();draw(tpl)});
    const ca=viewer.querySelector('.include-avatar');
    ca.addEventListener('change',()=>{window.__includeAvatar=ca.checked;updateItemsButton();draw(tpl)});
    if(mode!=='manual')return;
    const st=window.__trainerInput,nm=viewer.querySelector('.trainer-name');
    nm.addEventListener('input',()=>{st.name=nm.value;updateItemsButton()});
    for(const [cls,key] of [['.trainer-tid','tid'],['.trainer-sid','sid']]){
      const el=viewer.querySelector(cls);
      el.addEventListener('input',()=>{el.value=el.value.replace(/\D/g,'').slice(0,5);st[key]=Math.min(65535,Number(el.value||0))});
      el.addEventListener('change',()=>{el.value=id5(st[key])});
    }
  };
  viewer.innerHTML='<p class="photo-note">読み込み中…</p>';
  if(!game){draw(null);return}
  templateTrainer(game).then(t=>draw(t));
}
let photoUrl=null;
function renderPhotoViewer(viewer){
  if(!viewer)return;
  if(photoUrl){URL.revokeObjectURL(photoUrl);photoUrl=null}
  const jpg=window.__photo;
  if(!jpg){viewer.innerHTML='<p class="photo-note">このセーブからは写真を復元できませんでした。</p>';return}
  photoUrl=URL.createObjectURL(new Blob([jpg],{type:'image/jpeg'}));
  viewer.innerHTML=`<figure class="photo-figure"><img class="photo-img" alt="セーブに保存されていた写真" src="${photoUrl}"><figcaption class="photo-note">セーブに保存されていた写真(PSS の写真)</figcaption></figure>
    <div class="photo-actions"><a class="small-button" href="${photoUrl}" download="photo.jpg">写真を保存</a></div>`;
  const img=viewer.querySelector('img');
  img.addEventListener('error',()=>{viewer.innerHTML='<p class="photo-note">写真のデータは見つかりましたが、画像として読み込めませんでした(破損している可能性があります)。</p>'});
}
const boxState={pages:null,current:0};
// 位置合わせで見つかったずれの一覧(多い順)。PC ボックスの個体の当てはめに使う
function slotFileOffset(index){
  const gen=window.__gen,layout=getStorageLayout(window.__game,gen);
  if(!layout)return null;
  const l6=window.__layout6,orig=layout.base+index*232;
  return l6?l6.toFile(orig):orig;
}
function buildSlotMap(hits){
  const layout=getStorageLayout(window.__game,window.__gen);
  if(!layout)return null;
  const input=window.__input,l6=window.__layout6,slots=new Array(layout.slots).fill(null);
  // v38: 個体はずれも考えてマスに当てはめる(getLocation)。同じマスに 2 匹なら先に見つかった方
  for(const h of hits){
    const loc=getLocation(h,window.__game,window.__gen);
    if(loc.box===null||!loc.aligned)continue;
    const idx=(loc.box-1)*30+(loc.slot-1);
    if(!slots[idx])slots[idx]={status:'pokemon',hit:h};
  }
  const rawAt=orig=>{
    if(l6&&l6.lin)return orig>=0&&orig+232<=l6.lin.length?l6.lin.subarray(orig,orig+232):null;
    return orig>=0&&orig+232<=input.length?input.subarray(orig,orig+232):null;
  };
  for(let i=0;i<layout.slots;i++){
    if(slots[i])continue;
    const o=layout.base+i*232;
    let empty=false,any=false;
    for(const sh of [0,...pcShifts()]){const raw=rawAt(o+sh);if(!raw)continue;any=true;if(isEmptySlot(raw)){empty=true;break}}
    slots[i]={status:!any?'missing':empty?'empty':'damaged'};
  }
  return slots;
}
// ---------------------------------------------------------------------------
// ボックス表示のページ(v28)。v29 で手持ち・バトルボックス・育て屋は「手持ち等」タブ(renderPartyViewer)へ移した。
// 各ページ = {name, slots}。slots の要素は buildSlotMap と同じ {status, hit}。
// 手持ち・バトルボックス・育て屋の枠の位置は getSpecialLocation と同じ(ブロック ID 18 / 13 / 38)。
// ---------------------------------------------------------------------------
function buildBoxPages(hits){
  const slots=buildSlotMap(hits);
  if(!slots)return null;
  const pages=[];
  for(let i=0;i<slots.length/30;i++)pages.push({name:boxName(i),kind:'box',slots:slots.slice(i*30,i*30+30)});
  return pages;
}
// ---------------------------------------------------------------------------
// 「手持ち等」タブ(v29)。左に手持ち(横 2 × 縦 3)、中央にバトルボックス(同じ並び)、右に育て屋(縦、一番下にタマゴ)。
// マスのクリックで救出に含めるか切り替える(ボックスと同じ)。タマゴは「育て屋でタマゴが見つかった状態」を
// 引き継ぐかどうか(元の育て屋のブロックが無事で、タマゴありのときだけ表示)。ORAS は育て屋 2 か所を縦に並べる。
// ---------------------------------------------------------------------------
function readDaycareInfo(){
  const l6=window.__layout6,input=window.__input;
  const dc=l6&&l6.blocks[BLK.DAYCARE];
  if(!dc)return [];
  const ok=dc.status==='ok',b=ok?readBlockBytes(input,l6,dc):null;
  const n=Math.floor(dc.len/DAYCARE_COUPLE),out=[];
  for(let c=0;c<n;c++)out.push({egg:!!(b&&b[c*DAYCARE_COUPLE+0x1E0]===1)});
  return out;
}
function renderPartyViewer(){
  const viewer=listEl.querySelector('.party-viewer');
  const l6=window.__layout6;
  if(!viewer)return;
  if(!l6){viewer.innerHTML='<p class="box-empty-note">このセーブでは手持ち・バトルボックス・育て屋の位置を特定できません。</p>';return}
  const byOffset=new Map((window.__hits||[]).map(h=>[h.offset,h])),B=l6.blocks;
  const slot=o=>{const h=byOffset.get(l6.toFile(o));return h?{status:'pokemon',hit:h}:{status:'empty'}};
  const grid=(cls,origs)=>`<div class="party-grid ${cls}">${origs.map((o,i)=>renderSlotCell(slot(o),i+1)).join('')}</div>`;
  const six=(blk,size)=>blk?[0,1,2,3,4,5].map(i=>(blk.at??blk.orig)+i*size):[];
  const eggs=readDaycareInfo();
  if(!window.__includeEgg||window.__includeEgg.length!==eggs.length)window.__includeEgg=eggs.map(()=>true);
  const dc=B[BLK.DAYCARE],couples=dc?Math.floor(dc.len/DAYCARE_COUPLE):0;
  const dcNames=couples>1?['117番道路','バトル<wbr>リゾート']:[''];   // v35: 狭い画面では「バトル/リゾート」で折り返す
  let daycare='';
  for(let c=0;c<couples;c++){
    const cells=[0,1].map(s=>{
      const base=(dc.at??dc.orig)+c*DAYCARE_COUPLE+s*DAYCARE_SLOT;
      const occupied=!(l6.lin&&dc.status==='ok')||l6.lin[base]===1;   // v41: 預け中の枠だけ
      return renderSlotCell(occupied?slot(base+8):{status:'empty'},s+1);
    }).join('');
    const egg=eggs[c]&&eggs[c].egg
      ?`<button type="button" class="box-cell is-egg${window.__includeEgg[c]?' selected':''}" data-couple="${c}" aria-pressed="${window.__includeEgg[c]}" title="育て屋で見つかったタマゴ(受け取り前)">${POKEMON_ICON_DIR?`<img class="box-icon" src="${POKEMON_ICON_DIR}egg.png?v=${APP_VERSION}" alt="タマゴ">`:'<span class="box-name">タマゴ</span>'}<span class="box-check" aria-hidden="true">✓</span></button>`
      :`<div class="box-cell is-empty" aria-label="タマゴなし"></div>`;
    daycare+=`${dcNames[c]?`<div class="party-sub">${dcNames[c]}</div>`:''}<div class="party-grid daycare">${cells}${egg}</div>`;
  }
  viewer.innerHTML=`<div class="party-layout">
      <section class="party-col"><h4>手持ち</h4>${grid('two',six(B[BLK.PARTY],PARTY_SIZE))}</section>
      <section class="party-col"><h4>バトルボックス</h4>${grid('two',six(B[BLK.BATTLE],232))}</section>
      <section class="party-col"><h4>育て屋</h4>${daycare}</section>
    </div>
    <div class="box-legend"><span><i class="lg lg-on"><b>✓</b></i>復元する</span><span><i class="lg lg-off"></i>復元しない</span><span class="lg-hint">長押しで詳細</span></div>
    <p class="box-help">マスをクリックすると、救出に含めるか切り替えられます。タマゴは、育て屋に「タマゴが見つかった」状態を引き継ぐかどうかです(預けている 2 匹も救出するときだけ引き継がれます)。</p>`;
  bindPokemonCells(viewer);
  viewer.querySelectorAll('.box-cell.is-egg').forEach(cell=>cell.addEventListener('click',()=>{
    const c=Number(cell.dataset.couple);window.__includeEgg[c]=!window.__includeEgg[c];
    cell.classList.toggle('selected',window.__includeEgg[c]);cell.setAttribute('aria-pressed',String(window.__includeEgg[c]));
  }));
}
function firstBoxWithPokemon(pages){
  if(!pages)return 0;
  {const f=pages.findIndex(p=>p.slots.some(s=>s.status==='pokemon'&&favoriteRank(s.hit)));if(f>=0)return f}   // v51: 跳ねるポケモンがいる一番若いボックス
  const i=pages.findIndex(p=>p.slots.some(s=>s.status==='pokemon'));
  return i<0?0:i;
}
function boxCounts(page){
  const c={pokemon:0,empty:0,damaged:0,missing:0};
  for(const s of page.slots)c[s.status]++;
  return c;
}
function isHitChecked(hit){
  const cb=listEl.querySelector(`.candidate-check[data-offset="${hit.offset}"]`);
  return cb?cb.checked:false;
}
// ---------------------------------------------------------------------------
// v50: 大切にされていたポケモンを推定して、ボックスで跳ねさせる(最大 5 体)。
// 手がかり: レベル・努力値の合計(最大 510)・リボンの数・ニックネーム。タマゴは対象外。
// どれも低いポケモンばかりのときは選ばない(点数が FAVORITE_MIN_SCORE 未満は除く)。
// ---------------------------------------------------------------------------
const FAVORITE_MAX=5,FAVORITE_MIN_SCORE=4,FAVORITE_PERIOD_MS=500;   // 跳ねる間隔(0.5 秒ごとに着地。全員そろって跳ねる。描き直しても拍がずれないよう、今の時刻に合わせて途中から始める)
function favoriteScore(hit){
  const b=hit.data;if(!b)return 0;
  const iv32=u32(b,0x74);
  if(((iv32>>>30)&1)===1)return 0;                       // タマゴ
  const lv=pkLevel(hit.species,u32(b,0x10))||0;
  let ev=0;for(let i=0x1E;i<0x24;i++)ev+=b[i];
  if(ev>510)ev=0;                                        // ありえない値は数えない
  let rib=0;for(let i=0x30;i<0x37;i++)rib+=popcount8(b[i]);
  rib+=Math.min(b[0x38],40)/8+Math.min(b[0x39],8)/4;     // コンテスト・バトルの思い出リボン
  const nick=((iv32>>>31)&1)===1;
  // v53: どのソフトから連れてきたか(0xDF)。古い世代から何本ものソフトを渡ってきたポケモンほど大切にされていると考える
  const ver=b[0xDF];
  const origin=[1,2,3,4,5,15].includes(ver)?2.5          // 第3世代(ルビー・サファイア・エメラルド・ファイアレッド・リーフグリーン・コロシアム/XD)
    :[7,8,10,11,12].includes(ver)?2                       // 第4世代(ダイヤモンド・パール・プラチナ・ハートゴールド・ソウルシルバー)
    :[20,21,22,23].includes(ver)?1.5                      // 第5世代(ブラック・ホワイト・ブラック2・ホワイト2)
    :0;                                                   // 第6世代(X・Y・オメガルビー・アルファサファイア)
  return lv/100*3 + ev/510*3 + Math.min(rib,20)/20*3 + (nick?1.5:0) + origin;
}
// v59: 同じポケモンのデータが 2 か所以上に残っていたら(暗号を解いた 232 バイトが完全に同じ)、
// 二重に救出されないよう最初の 1 匹以外の選択を外す。交換や配布で生まれた「似ているが別の個体」は中身が違うので外れない。
function markDuplicates(){
  const shown=new Set();(boxState.pages||[]).forEach(p=>p.slots.forEach(x=>{if(x.status==='pokemon')shown.add(x.hit.offset)}));
  const seen=new Map();let n=0;
  for(const h of (window.__hits||[])){
    if(!shown.has(h.offset)&&!getSpecialLocation(h))continue;
    const key=Array.prototype.join.call(h.data.subarray(0,232),',');
    if(seen.has(key)){const cb=listEl.querySelector(`.candidate-check[data-offset="${h.offset}"]`);if(cb){cb.checked=false;n++}}
    else seen.set(key,h.offset);
  }
  window.__dupCount=n;
  const box=listEl.querySelector('.recovery-controls');
  if(box&&n){const p=document.createElement('p');p.className='dup-note';p.textContent=`同じポケモンのデータが重複していた ${n}匹は、二重にならないよう選択を外しました。`;box.appendChild(p)}
}
// v59: 跳ねている理由(詳細画面に出す)
function favoriteReasons(hit){
  const b=hit.data,iv32=u32(b,0x74),out=[];
  const lv=pkLevel(hit.species,u32(b,0x10));if(lv)out.push(`Lv.${lv}`);
  let ev=0;for(let i=0x1E;i<0x24;i++)ev+=b[i];if(ev>0&&ev<=510)out.push(`努力値 ${ev}`);
  let rib=0;for(let i=0x30;i<0x37;i++)rib+=popcount8(b[i]);if(rib)out.push(`リボン ${rib}個`);
  if(((iv32>>>31)&1)===1)out.push('ニックネーム付き');
  const v=b[0xDF];if(v&&v<24&&typeof PK_VERSION_NAME!=='undefined'&&PK_VERSION_NAME[v])out.push(`${PK_VERSION_NAME[v]}生まれ`);
  return out;
}
function favoriteRank(hit){
  const hits=window.__hits||[];
  if(window.__favHits!==hits){
    window.__favHits=hits;
    // ボックス・手持ち・バトルボックス・育て屋に表示されるポケモンだけから選ぶ
    const shown=new Set();(boxState.pages||[]).forEach(p=>p.slots.forEach(x=>{if(x.status==='pokemon')shown.add(x.hit.offset)}));
    window.__favMap=new Map(hits.filter(h=>shown.has(h.offset)||getSpecialLocation(h)).map(h=>[h,favoriteScore(h)]).filter(([,sc])=>sc>=FAVORITE_MIN_SCORE).sort((a,b)=>b[1]-a[1]).slice(0,FAVORITE_MAX).map(([h],i)=>[h.offset,i+1]));
  }
  return window.__favMap.get(hit.offset)||0;
}
// 1 マス分の HTML(v29: ボックスと「手持ち等」タブで共通)
// v45: ボックスの表示を「アイコン」と「ポケモン名」で切り替える(この端末のブラウザに覚えておく)
let boxLabelMode='icon';   // v51: 切り替えスイッチは削除し、常にアイコン
function setBoxLabelMode(m){boxLabelMode=m;try{localStorage.setItem('nerBoxLabel',m)}catch(e){}renderBoxViewer();renderPartyViewer()}
function renderSlotCell(s,slotNo){
  if(s.status==='pokemon'){
    const sm=pkSummary(s.hit);
    const useIcon=POKEMON_ICON_DIR&&boxLabelMode==='icon';
    const tip=`${sm.name}${sm.gender?' '+sm.gender:''} ${sm.isEgg?'タマゴ':sm.level!==null?'Lv.'+sm.level:''} / 親名: ${sm.ot} / ${sm.ability} / ${sm.ball}`;
    const icon=useIcon?pkIconHtml(s.hit,sm.name):`<span class="box-name">${escapeHtml(sm.name)}</span>`;
    const shinyIcon=sm.shiny?`<img class="box-shiny" src="${SHINY_ICON}" alt="色違い">`:'';
    const ballIcon=BALL_IMAGE_DIR&&sm.ballId>0?`<img class="box-ball" src="${BALL_IMAGE_DIR}${sm.ballId}.png" alt="">`:'';
    const fav=favoriteRank(s.hit);
    const uo=boxState.pages&&isUnknownHit(s.hit)?unknownOrigin(s.hit):null;
    return `<button type="button" class="box-cell is-pokemon${isHitChecked(s.hit)?' selected':''}${fav?' is-favorite':''}"${fav?` style="--fav-delay:-${(performance.now()%FAVORITE_PERIOD_MS)/1000}s"`:''} data-offset="${s.hit.offset}" title="${escapeHtml(tip)}" aria-pressed="${isHitChecked(s.hit)}" aria-label="${slotNo}番 ${escapeHtml(tip)}">${shinyIcon}${fav?`<span class="fav-wrap">${icon}</span>`:icon}${ballIcon}${uo&&uo.short?`<span class="box-origin">${uo.short}</span>`:''}<span class="box-check" aria-hidden="true">✓</span></button>`;
  }
  // v18: 破損・データなしのマスは利用者には見せず、空きと同じ表示にする(一覧表示と同じ方針)。判定(s.status)は buildSlotMap() に残している。
  return `<div class="box-cell is-empty" data-status="${s.status}" title="${slotNo}番" aria-label="${slotNo}番 空き"></div>`;
}
let tapMode=(()=>{try{return localStorage.getItem('nerTapMode')==='select'?'select':'detail'}catch(e){return 'detail'}})();   // v68: 最初は「詳細」
// v59/v61: 長押し(または右クリック)で詳細を開く。開いたあとのクリック(タップ)は無視する
function bindLongPress(el,offset){
  let timer=null,sx=0,sy=0;el.__longPressed=false;
  const cancel=()=>{clearTimeout(timer);timer=null};
  const open=()=>{el.__longPressed=true;showPokemonDetail(offset);try{window.getSelection().removeAllRanges()}catch(e){}};
  el.addEventListener('pointerdown',e=>{el.__longPressed=false;sx=e.clientX;sy=e.clientY;cancel();timer=setTimeout(open,450)});
  el.addEventListener('pointermove',e=>{if(timer&&Math.hypot(e.clientX-sx,e.clientY-sy)>8)cancel()});
  ['pointerup','pointerleave','pointercancel'].forEach(t=>el.addEventListener(t,cancel));
  el.addEventListener('contextmenu',e=>{e.preventDefault();cancel();open()});
  el.addEventListener('click',e=>{
    if(el.__longPressed){el.__longPressed=false;e.preventDefault();e.stopImmediatePropagation();return}
    // v63: 「詳細」モードなら、タップで詳細を開く(選択は変えない)
    if(tapMode==='detail'){e.preventDefault();e.stopImmediatePropagation();showPokemonDetail(offset)}
  },true);
}
function bindPokemonCells(root){
  root.querySelectorAll('.box-cell.is-pokemon').forEach(cell=>{
    bindLongPress(cell,Number(cell.dataset.offset));
    cell.addEventListener('click',e=>{
      const cb=listEl.querySelector(`.candidate-check[data-offset="${cell.dataset.offset}"]`);
      if(!cb)return;
      cb.checked=!cb.checked;
      updateSelectionSummary();refreshBoxSelection();
    });
  });
}
// v59: ポケモンの詳細(長押しで開く)
const STAT_LABELS=['HP','こうげき','ぼうぎょ','とくこう','とくぼう','すばやさ'];
function pkStats(b){
  const iv32=u32(b,0x74),ivRaw=[0,5,10,15,20,25].map(sh=>(iv32>>>sh)&31);   // データの順: HP・攻撃・防御・素早さ・特攻・特防
  const evRaw=[...b.subarray(0x1E,0x24)];
  const order=[0,1,2,4,5,3];   // 表示の順: HP・攻撃・防御・特攻・特防・素早さ
  return {iv:order.map(i=>ivRaw[i]),ev:order.map(i=>evRaw[i])};
}
function showPokemonDetail(offset){
  const hit=(window.__hits||[]).find(h=>h.offset===offset);if(!hit)return;
  const b=hit.data,sm=pkSummary(hit);
  const d=surveyDialog();
  const nick=pkNickname(b),moves=[0,1,2,3].map(i=>u16(b,0x5A+i*2)).filter(m=>m);
  const nature=typeof PK_NATURE!=='undefined'?PK_NATURE[b[0x1C]]:'';
  const item=u16(b,0x0A),itemName=item?(PK_ITEM_NAME[item]||`道具(${item})`):'なし';
  const ver=b[0xDF],verName=typeof PK_VERSION_NAME!=='undefined'?(PK_VERSION_NAME[ver]||''):'';
  const {iv,ev}=pkStats(b);
  let rib=0;for(let i=0x30;i<0x37;i++)rib+=popcount8(b[i]);
  const fav=favoriteRank(hit);
  const row=(k,v)=>`<tr><th>${k}</th><td>${v}</td></tr>`;
  d.innerHTML=`<div class="sample-dialog-box survey-box pk-detail">
    <div class="pk-detail-head">${pkIconHtml(hit,sm.name).replace('class="spr-box"','class="spr-box pk-detail-icon"').replace('class="box-icon"','class="box-icon pk-detail-icon"')}
      <div><h3 id="surveyTitle">${escapeHtml(nick||sm.name)}${sm.gender?` <span class="pk-g">${sm.gender}\uFE0E</span>`:''}${sm.shiny?' <span title="色違い">✨</span>':''}</h3>
      <p class="pk-detail-sub">${escapeHtml(sm.name)} / ${sm.isEgg?'タマゴ':sm.level!==null?'Lv.'+sm.level:''}</p></div></div>
    ${fav?`<p class="pk-fav-reason">⭐ 大切にされていたポケモン: ${escapeHtml(favoriteReasons(hit).join('・'))}</p>`:''}
    <table class="pk-detail-table">
      ${row('せいかく',escapeHtml(nature||'-'))}${row('とくせい',escapeHtml(sm.ability))}${row('もちもの',escapeHtml(itemName))}
      ${row('わざ',moves.length?moves.map(m=>escapeHtml((typeof PK_MOVE!=='undefined'&&PK_MOVE[m])||('わざ'+m))).join('<br>'):'-')}
      ${row('おや',`${escapeHtml(sm.ot)}(ID ${String(u16(b,0x0C)).padStart(5,'0')})`)}
      ${boxState.pages&&isUnknownHit(hit)&&unknownOrigin(hit)?row('見つかった場所',escapeHtml(unknownOrigin(hit).text)):''}${row('ボール',escapeHtml(sm.ball))}${row('うまれ',escapeHtml(verName||'-'))}${row('リボン',rib?rib+'個':'なし')}
    </table>
    <table class="pk-stat-table"><tr><th></th>${STAT_LABELS.map(l=>`<th>${l}</th>`).join('')}</tr>
      <tr><th>個体値</th>${iv.map(v=>`<td>${v}</td>`).join('')}</tr>
      <tr><th>努力値</th>${ev.map(v=>`<td>${v}</td>`).join('')}</tr></table>
    <div class="sample-dialog-actions"><button type="button" class="button button-secondary pk-detail-close">閉じる</button></div></div>`;
  d.querySelector('.pk-detail-close').addEventListener('click',()=>d.classList.add('hidden'));
  d.classList.remove('hidden');
}
// v61: ボックス・手持ち・バトルボックス・育て屋のどこにも当てはまらない場所で見つかったポケモン(場所不明)
function isUnknownHit(h){
  if(getSpecialLocation(h))return false;
  if(!boxState.__shown){boxState.__shown=new Set();(boxState.pages||[]).forEach(p=>p.slots.forEach(x=>{if(x.status==='pokemon')boxState.__shown.add(x.hit.offset)}))}
  return !boxState.__shown.has(h.offset);
}
// v62: 場所不明のポケモンが、セーブのどの部分で見つかったか(GTS に預けていたポケモンなど)
function unknownOrigin(h){
  const l6=window.__layout6;if(!l6)return null;
  const o=l6.toOrig(h.offset),bl=l6.blocks.find(b=>o>=(b.at??b.orig)&&o<(b.at??b.orig)+b.len);
  if(!bl)return {short:'',text:'セーブの使われていない部分(古いデータの残り)'};
  if(bl.id===28){
    // GTS の部分: 先頭がポケモン、+0xE8 に預けたときのメッセージ(最大 16 文字)、+0x128 に欲しいポケモン(推定)
    const at=bl.at??bl.orig;let m='';
    for(let i=0;i<16;i++){const c=u16(l6.lin,at+0xE8+i*2);if(!c)break;m+=String.fromCharCode(c)}
    const want=u16(l6.lin,at+0x128),wantName=want>=1&&want<=721?SPECIES[want]:'';
    const extra=[m?`メッセージ「${m}」`:'',wantName?`欲しいポケモン: ${wantName}`:''].filter(Boolean).join('・');
    return {short:'GTS',text:(m||wantName?'GTS に預けていたポケモン':'GTS(預けていたポケモンの可能性があります)')+(extra?`(${extra})`:'')};
  }
  if(bl.id===BLK.DAYCARE)return {short:'',text:'育て屋(引き取ったあとの古いデータ)'};
  return {short:'',text:`${blockName(l6.game,bl.id)}(古いデータの残り)`};
}
function unknownPages(){
  const list=(window.__hits||[]).filter(isUnknownHit),pages=[];
  for(let i=0;i<list.length;i+=30){
    const slots=list.slice(i,i+30).map(hit=>({status:'pokemon',hit}));
    while(slots.length<30)slots.push({status:'empty'});
    pages.push({name:list.length>30?`場所不明 ${pages.length+1}`:'場所不明',slots,unknown:true});
  }
  return pages;
}
function renderBoxViewer(){
  const viewer=listEl.querySelector('.box-viewer');
  if(!viewer)return;
  const pages=boxState.pages?(boxState.unknown||[]).concat(boxState.pages):null;   // v62: 「場所不明」はボックス１の上
  if(!pages){viewer.innerHTML='<p class="box-empty-note">このセーブではボックスの位置を特定できないため、ボックス表示はできません。</p>';return}
  const boxes=pages.length,b=boxState.current,pg=pages[b];
  const opts=[];
  const favBox=i=>pages[i].slots.some(x=>x.status==='pokemon'&&favoriteRank(x.hit));   // v51: 跳ねるポケモンがいるボックスに ⭐
  for(let i=0;i<boxes;i++){const c=boxCounts(pages[i]);opts.push(`<option value="${i}"${i===b?' selected':''}>${escapeHtml(pages[i].name)}${c.pokemon?`(${c.pokemon}匹)`:''}${favBox(i)?' ⭐':''}</option>`)}
  const cells=pg.slots.map((s,i)=>renderSlotCell(s,i+1));
  const c=boxCounts(pg);
  const inBox=new Set();pages.forEach(p=>p.slots.forEach(s=>{if(s.status==='pokemon')inBox.add(s.hit.offset)}));
  const outside=(window.__hits||[]).filter(h=>!inBox.has(h.offset)&&!getSpecialLocation(h)).length;
  viewer.innerHTML=`
    <div class="box-nav">
      <button type="button" class="box-prev small-button" aria-label="前のボックス">◀</button>
      <select class="box-select" aria-label="ボックスを選ぶ">${opts.join('')}</select>
      <button type="button" class="box-next small-button" aria-label="次のボックス">▶</button>
    </div>
    <div class="box-grid${POKEMON_ICON_DIR&&boxLabelMode==='icon'?' with-icons':''}">${cells.join('')}</div>
    <div class="box-actions">
      <button type="button" class="small-button" data-box-action="on"${c.pokemon?'':' disabled'}>このボックスを選択</button>
      <button type="button" class="small-button" data-box-action="off"${c.pokemon?'':' disabled'}>このボックスを選択解除</button>
    </div>
    <div class="box-legend"><span><i class="lg lg-on"><b>✓</b></i>復元する</span><span><i class="lg lg-off"></i>復元しない</span><span class="lg-hint">長押しで詳細</span></div>
`;
  const go=d=>{boxState.current=(b+d+boxes)%boxes;renderBoxViewer()};
  viewer.querySelector('.box-prev').addEventListener('click',()=>go(-1));
  viewer.querySelector('.box-next').addEventListener('click',()=>go(1));
  viewer.querySelector('.box-select').addEventListener('change',e=>{boxState.current=Number(e.target.value);renderBoxViewer()});
  // このボックスの個体をまとめて選択/選択解除(v23)
  viewer.querySelectorAll('[data-box-action]').forEach(btn=>btn.addEventListener('click',()=>{
    const on=btn.dataset.boxAction==='on';
    viewer.querySelectorAll('.box-cell.is-pokemon').forEach(cell=>{
      const cb=listEl.querySelector(`.candidate-check[data-offset="${cell.dataset.offset}"]`);
      if(cb)cb.checked=on;
    });
    updateSelectionSummary();refreshBoxSelection();
  }));
  bindPokemonCells(viewer);
}
function refreshBoxSelection(){
  listEl.querySelectorAll('.box-cell.is-pokemon').forEach(cell=>{
    const cb=listEl.querySelector(`.candidate-check[data-offset="${cell.dataset.offset}"]`);
    const on=!!(cb&&cb.checked);
    cell.classList.toggle('selected',on);cell.setAttribute('aria-pressed',on?'true':'false');
  });
  // ボックス選択欄の匹数表示は変わらない(救出可能数)ので再描画不要
}
// ボール画像(v12〜)。img/ball/<ボール番号>.png(1〜26)を表示し、読めない番号はボール名に戻る。
// 画像はサイト運営者が用意したもの(アイテム番号→ボール番号に付け替え済み。対応表は CHANGELOG v12)。
// null にすると画像を使わずボール名を表示する。
const BALL_IMAGE_DIR='img/ball/';
const SHINY_ICON='img/shiny.png';
function pkSummary(p){
  const b=p.data;
  const iv32=u32(b,0x74);
  const isEgg=((iv32>>>30)&1)===1;
  const gender=(b[0x1D]>>>1)&3;
  const ballId=b[0xDC],abilityId=b[0x14];
  return {
    ballId,
    ball:PK_BALL[ballId]||`ボール(${ballId})`,
    // v11: ニックネームは表示しない。種族名のみ
    name:SPECIES[p.species]||('No.'+p.species),
    nickname:pkNickname(b),            // 表示はしないが、今後のために取得は残す
    ot:pkOTName(b),
    shiny:p.shiny,
    gender:gender===0?'♂':gender===1?'♀':'',   // 表示時に U+FE0E を付けて絵文字ではなく文字として描く(v21)
    level:pkLevel(p.species,u32(b,0x10)),
    ability:PK_ABILITY[abilityId]||`特性(${abilityId})`,
    isEgg
  };
}
function renderBall(s){
  const label=escapeHtml(s.ball);
  if(BALL_IMAGE_DIR&&s.ballId>0)
    return `<span class="pk-ball has-img" title="${label}"><img src="${BALL_IMAGE_DIR}${s.ballId}.png" alt="${label}" width="28" height="28" loading="lazy" onerror="this.parentNode.classList.remove('has-img');this.replaceWith(document.createTextNode(this.alt))"></span>`;
  // スマホ幅では末尾の「ボール」を省く(CSS で .ball-suffix を非表示)
  const text=s.ball.endsWith('ボール')?`${escapeHtml(s.ball.slice(0,-3))}<span class="ball-suffix">ボール</span>`:label;
  return `<span class="pk-ball" title="${label}">${text}</span>`;
}
// 見出し行(v13)。一覧の先頭に固定表示(CSS の position:sticky)。列の定義は個体の行と共通。
function renderHeader(){
  return `<div class="pk-row pk-head" aria-hidden="true"><span class="pk-h-chk"></span><span class="pk-ball">ボール</span>`+
    `<span class="pk-name"><span class="pk-shiny"></span><span class="pk-name-text">ポケモン名</span></span>`+
    `<span class="pk-gender">性別</span><span class="pk-level">Lv.</span><span class="pk-ot">親名</span><span class="pk-ability">特性</span></div>`;
}
// 1 行 = [チェック][ボール][名前][♂♀][Lv.][親名][特性]。各列の幅を固定して、
// 情報の種類ごとに開始位置がそろうようにしている(CSS の .pk-row の grid)。
function renderCandidate(p){
  const s=pkSummary(p);
  // 色違いアイコンの枠は全行に置く(色違いでなければ空)。名前の開始位置がずれないようにするため
  const shinyMark=`<span class="pk-shiny">${s.shiny?`<img src="${SHINY_ICON}" alt="色違い" title="色違い" width="16" height="16">`:''}</span>`;
  const genderCls=s.gender==='♂'?'male':s.gender==='♀'?'female':'';
  return `<label class="candidate pk-row"><input class="candidate-check" type="checkbox" data-offset="${p.offset}" data-ec="${p.ec}" checked>`+
    renderBall(s)+
    `<span class="pk-name">${shinyMark}<span class="pk-name-text">${escapeHtml(s.name)}</span></span>`+
    `<span class="pk-gender ${genderCls}">${s.gender?s.gender+'\uFE0E':''}</span>`+
    `<span class="pk-level">${s.isEgg?'タマゴ':s.level!==null?'Lv.'+s.level:''}</span>`+
    `<span class="pk-sub"><span class="pk-ot" title="${escapeHtml(s.ot)}"><span class="pk-lbl">親名：</span>${escapeHtml(s.ot)}</span>`+
    `<span class="pk-ability"><span class="pk-lbl">特性：</span>${escapeHtml(s.ability)}</span></span></label>`;
}
function updateSelectionSummary(){
  const checks=[...listEl.querySelectorAll('.candidate-check')];
  const selected=checks.filter(x=>x.checked).length;
  if(countEl)countEl.textContent=`${selected} / ${checks.length} 匹`;   // v22: 画面からは削除(要素がなければ何もしない)
  const summary=document.getElementById('selectionSummary');
  if(summary)summary.textContent=`選択中 ${selected} 匹`;
  updateItemsButton();
}
// セーブ構造の診断。ブロック表が見つかれば、ゲーム・ずれ・ブロックごとの生存状況を出す。
function showStructureReport(l6,size,hits){
  // v22: 診断は「項目 | 状態」の表で表示する
  const old=document.getElementById('structureReport');if(old)old.remove();
  const box=document.createElement('div');box.id='structureReport';box.className='structure-report';
  const badge=(t,kind)=>`<span class="diag-badge ${kind}">${t}</span>`;
  const rows=[];
  if(!l6){
    rows.push(['ブロック表',badge('見つかりません','ng')+'<span class="diag-sub">ゲームはファイルサイズから推定しています</span>']);
  }else{
    const gameName=l6.game==='XY'?'X・Y':'オメガルビー・アルファサファイア';
    if(size!==l6.saveSize)rows.push(['ファイルサイズ',badge('不一致','ng')+`<span class="diag-sub">${size.toLocaleString()} バイト(${gameName} は ${l6.saveSize.toLocaleString()} バイト)</span>`]);
    const sh=((l6.shift%l6.saveSize)+l6.saveSize)%l6.saveSize;
    rows.push(['データの位置',sh?badge('ずれあり','warn')+`<span class="diag-sub">${hex(sh)} バイト(補正して読み取り)</span>`:badge('正常','ok')]);
    rows.push(['チェックサム一致',`<b>${l6.okCount}</b> / ${l6.blocks.length} ブロック`+(l6.movedCount?`<span class="diag-sub">うち ${l6.movedCount} ブロックは位置のずれを補正</span>`:'')]);
    for(const b of l6.blocks.filter(b=>b.label)){
      rows.push([b.label,b.status==='ok'?(b.moved?badge('正常(位置を補正)','ok'):badge('正常','ok')):b.rawStatus==='missing'?badge('欠落','ng'):badge('破損','ng')]);
    }
  }
  let tail='';
  if(!hits.length)tail='<p class="diag-note">どのブロックにもポケモンの個体データは残っていません。このファイルからの救出はできません。'+
    'セーブを保存していた SD カードなどに書き込まずに全体を吸い出し、そのイメージを読み込ませると、元のデータが見つかる可能性があります。</p>';
  // v34: 最初は折りたたみ。「セーブデータの診断結果を表示」をクリックで開く
  box.innerHTML=`<details class="diag-details"><summary>セーブデータの診断結果を表示</summary><table class="diag-table"><tbody>${rows.map(([k,v])=>`<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>${tail}</details>`;
  const list=document.getElementById('list');list.parentNode.insertBefore(box,list);
}
async function analyze(file){
  const seq=++analyzeSeq;
  result.classList.add('hidden');listEl.innerHTML='';msg('セーブデータを解析しています…');
  {const g=document.getElementById('returnGuide');if(g)g.classList.add('hidden')}   // v40: 別のファイルを読み込んだら手順を閉じる
  devBarSet(null);   // v35: 読み込むたびに開発用のチェックを外す(試験用セーブなら読み込み後に付け直す)
  const input=new Uint8Array(await file.arrayBuffer());
  if(seq!==analyzeSeq)return;
  let [game,gen,maxSpecies]=detectGame(input.length);
  // サイズより先にブロック表で判定する(サイズが合っていても中身が別ゲーム・回転していることがある)
  const l6=findGen6Layout(input);window.__layout6=l6;
  if(l6)relocateBlocks(input,l6);   // v38
  if(l6){game=l6.game==='XY'?'XY / X・Y':'ORAS / オメガルビー・アルファサファイア';gen=6;maxSpecies=721}
  let scanGen=gen||6;
  // セーブ全体が回転して保存されている場合、ファイル末尾と先頭にまたがる 1 スロットがある。
  // 先頭 232 バイトを末尾に足した配列でスキャンし、その位置も調べる(v16)。
  // 足した部分から始まる候補(offset >= 元の長さ)は先頭の重複なので捨てる。
  const wrapScan=!!(l6&&l6.rotated&&((l6.shift%l6.saveSize)+l6.saveSize)%l6.saveSize!==0);
  const scanInput=wrapScan?(()=>{const a=new Uint8Array(input.length+232);a.set(input);a.set(input.subarray(0,232),input.length);return a})():input;
  let hits=(await scanInBackground(scanInput,scanGen,maxSpecies,p=>{if(seq===analyzeSeq)msgProgress('セーブデータを解析しています…',p)})).filter(h=>h.offset<input.length);
  if(seq!==analyzeSeq)return;   // v73: 走査中に別のファイルが読み込まれた
  hits=addSpecialHits(input,l6,hits);   // v38
  gameEl.textContent=game;   // v22: 「(ブロック表から判定)」と入力サイズの表示は削除
  window.__boxNames=readBoxNames(input,l6);
  window.__bag=readBag(input,l6);
  window.__money=readMoney(input,l6);
  window.__itemsGame=l6?l6.game:null;window.__includeItems=true;window.__includeMoney=true;window.__includeEgg=null;
  window.__input=input;window.__hits=[];window.__inputName=file.name;window.__sampleSent=false;
  window.__inputFile=file;window.__lastOutput=null;renderRepairHelp();   // v71: 修復依頼に渡す元のファイル(relocateBlocks で書き換える前のもの)
  updateItemsButton();
  window.__photo=readPhoto(input,l6);
  // 表示・出力の対象は完全復元のみ(振り分け結果は window.__allHits に残す)
  window.__allHits=hits;
  hits=visibleHits(hits);
  window.__dex=readDex(input,l6,hits);   // v30
  window.__gift=readGifts(input,l6);window.__includeGift=true;   // v69
  window.__trainer=readTrainer(input,l6,hits);   // v31
  window.__avatar=readAvatar(input,l6,window.__trainer);   // v33
  window.__includeDex=true;window.__trainerInput=null;window.__trainerMode=null;window.__includeAvatar=!!window.__avatar;
  showStructureReport(l6,input.length,hits);
  if(!hits.length){
    if(countEl)countEl.textContent='0 匹';
    // ポケモンがいなくても写真が残っていれば表示する
    // ポケモンがいなくても、道具や写真が残っていれば表示する
    listEl.innerHTML=((window.__bag||window.__money)?'<h3 class="photo-heading">道具</h3><div class="items-viewer"></div>':'')+(window.__photo?'<h3 class="photo-heading">写真</h3><div class="photo-viewer"></div>':'');
    renderItemsViewer(listEl.querySelector('.items-viewer'));
    renderPhotoViewer(listEl.querySelector('.photo-viewer'));
    updateItemsButton();
    result.classList.remove('hidden');{const dd=document.querySelector('#structureReport details');if(dd)dd.open=true}msg('完全な状態で残っているポケモンは見つかりませんでした。下の「セーブデータの診断結果」を参照してください。',true);return}   // v28: 道具・お金が残っていれば救出ボタンは使える
  window.__hits=hits;window.__inputName=file.name;window.__inputSize=input.length;window.__game=game;window.__gen=scanGen;window.__input=input;
  renderList(hits);
  clearMsg();   // v22: 正常終了時のメッセージは出さない
  result.classList.remove('hidden');
}
fileInput.addEventListener('change',()=>{if(fileInput.files[0])analyze(fileInput.files[0]).catch(e=>msg('解析中にエラーが発生しました: '+e.message,true))});
['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('drag')}));
['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('drag')}));
drop.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f)analyze(f).catch(err=>msg('解析中にエラーが発生しました: '+err.message,true))});
// ---------------------------------------------------------------------------
// 「ポケモンを救出する」ボタン(v28 でボタンを 1 つにまとめた)。
// 空のセーブに、選んだポケモン(ボックス・手持ち・バトルボックス・育て屋は元の場所)と、
// 道具タブの「道具とお金を取り出す」がオンなら道具・お金を書き込んだ main を出力する。
// そのゲーム用の空のセーブが置かれていないとき(現在は ORAS)は、従来の boxdata.bin(ボックスの個体だけ)を出力する。
// ---------------------------------------------------------------------------
function selectedHits(){
  const out=[];
  for(const cb of listEl.querySelectorAll('.candidate-check'))if(cb.checked){const q=(window.__hits||[]).find(h=>h.offset===Number(cb.dataset.offset)&&String(h.ec)===cb.dataset.ec);if(q)out.push(q)}
  return out;
}
function itemsIncluded(){return window.__includeItems!==false&&!!window.__bag}
function moneyIncluded(){return window.__includeMoney!==false&&!!window.__money}
function dexIncluded(){return window.__includeDex!==false&&!!window.__dex}
// v61: 救出したポケモンの「親(トレーナー名・ID・裏ID・性別)」の組み合わせを、多い順に並べる。
// 自分のポケモンと同じ親にしておくと、ゲームで言うことを聞く(よその人のポケモン扱いにならない)
function otCandidates(){
  const m=new Map();
  for(const h of (window.__hits||[])){
    const b=h.data;if(((u32(b,0x74)>>>30)&1)===1)continue;   // タマゴは除く
    const name=pkOTName(b);if(!name)continue;
    const tid=u16(b,0x0C),sid=u16(b,0x0E),gender=(b[0xDD]>>>7)&1;
    const k=`${name}\t${tid}\t${sid}\t${gender}`;
    const e=m.get(k)||{name,tid,sid,gender,count:0};e.count++;m.set(k,e);
  }
  return [...m.values()].sort((a,b)=>b.count-a.count);
}
function trainerValue(){   // v34: main に書くトレーナー情報(なければ null = 空のセーブのまま)
  const m=window.__trainerMode||(window.__trainer?'restore':(otCandidates().length?'pick':'none'));
  if(m==='pick'){const c=otCandidates()[window.__trainerPick||0];if(c)return {name:c.name.slice(0,TRAINER_NAME_MAX),tid:c.tid,sid:c.sid}}
  if(m==='restore'&&window.__trainer){const t=window.__trainer;return {name:t.name,tid:t.tid,sid:t.sid}}
  if(m==='manual'&&window.__trainerInput&&window.__trainerInput.name.length){const t=window.__trainerInput;return {name:t.name.slice(0,TRAINER_NAME_MAX),tid:t.tid,sid:t.sid}}
  return null;
}
function trainerIncluded(){return !!trainerValue()}
function avatarIncluded(){return window.__includeAvatar!==false&&!!window.__avatar}
function updateItemsButton(){   // 名前は v19 以来のまま。救出ボタンの有効・無効を更新する(v36: サンプル提供の欄も)
  showSampleOffer();
  const any=!!listEl.querySelector('.candidate-check:checked')||(!!window.__itemsGame&&(itemsIncluded()||moneyIncluded()||dexIncluded()||giftIncluded()||trainerIncluded()||avatarIncluded()));
  download.disabled=!any;
}
// ---------------------------------------------------------------------------
// ゲームに戻す方法(v40)。ダウンロードの直後に、出したファイルの種類に合わせた手順を表示する。
//   kind: 'rescue'(ポケモンを救出する → 空のセーブをもとにした main) / 'full'(まるごと復元 → 元のセーブを作り直した main) / 'bin'(boxdata.bin)
// ---------------------------------------------------------------------------
function showReturnGuide(kind){
  const box=document.getElementById('returnGuide');
  if(!box)return;
  const intro={
    rescue:'選んだポケモンや道具を入れたセーブデータです。そのままゲームで遊べます。',
    full:'壊れたセーブを作り直した <code>main</code> です。元のセーブと入れ替えて遊べます。',
    bin:'ボックスのポケモンだけのファイルです。PKHeX で同じゲームのセーブに読み込みます。'
  }[kind];
  const open=k=>kind==='bin'?k==='pkhex':k==='ds';
  const sec=(k,title,body)=>`<details class="guide-sec"${open(k)?' open':''}><summary>${title}</summary>${body}</details>`;
  const fileNote='<p class="guide-note">ファイル名は <code>main</code>(拡張子なし)にしてください。</p>';
  // v49: 短くした
  const ds=`<ol>
      <li>Checkpoint(または JKSM)で、今のセーブを<b>バックアップ</b>します。</li>
      <li>SD カードの <code>/3ds/Checkpoint/saves/</code> にできたバックアップのフォルダで、<code>main</code> をダウンロードしたものと置き換えます。</li>
      <li>Checkpoint でそのフォルダを <b>Restore</b> して、ゲームを起動します。</li>
    </ol>${fileNote}<p class="guide-note">ダウンロード版は、セーブを吸い出した本体に戻してください。</p>`;
  const emu=`<ol>
      <li>エミュレータのゲーム一覧でゲームを右クリックし、「セーブデータの場所を開く」を選びます。</li>
      <li>そこにある <code>main</code> を<b>バックアップ</b>し、ダウンロードした <code>main</code> で上書きします。</li>
    </ol>${fileNote}<p class="guide-note">正しいセーブなのに起動しないときは、ゲームを入れ直してから、もう一度 <code>main</code> を置いてみてください。</p>`;
  const pkhex=kind==='bin'?`<ol>
      <li>PKHeX で同じゲームのセーブを開き、<code>boxdata.bin</code> をドラッグ＆ドロップします。</li>
      <li><b>ボックス 31 個が置き換わる</b>ので、バックアップを取ったセーブで行ってください。</li>
    </ol>`:'';
  const bank=`<ol>
      <li>今のセーブをバックアップし、ダウンロードした <code>main</code> をゲームに戻します。</li>
      <li>預けたいポケモンをボックスに入れ、ポケモンバンクに預けます。</li>
      <li>バックアップから自分のセーブに戻し、バンクから引き出します。</li>
    </ol><p class="guide-note">ポケモンバンクは 3DS 本体でのみ使えます。</p>`;
  box.innerHTML=`<div class="guide-head"><strong>ゲームに戻す方法</strong><button type="button" class="guide-close" aria-label="閉じる">×</button></div>
    <p class="guide-intro">${intro}</p>
    ${sec('ds','3DS 本体に戻す(Checkpoint)',ds)}
    ${sec('emu','エミュレータに戻す',emu)}
    ${kind==='bin'?sec('pkhex','PKHeX で自分のセーブへ移す',pkhex):sec('bank','ポケモンバンクで移す',bank)}`;
  box.classList.remove('hidden');
  box.querySelector('.guide-close').addEventListener('click',()=>box.classList.add('hidden'));
  box.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function saveBlob(data,name){
  window.__lastOutput={name,data:new Uint8Array(data instanceof ArrayBuffer?data:(data.buffer?data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength):data)).slice()};renderRepairHelp();   // v71
  const url=URL.createObjectURL(new Blob([data],{type:'application/octet-stream'})),a=document.createElement('a');
  a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function downloadBoxdataBin(selected,reason){
  const {data,placed,unknown,conflicts}=makePCBinary(selected,window.__game,window.__gen);
  // 1 匹も配置できなかった bin は中身がすべて 0 になり、PKHeX で読み込めないため出力しない。
  if(placed===0){msg(`${reason}ボックスに入れられる個体が 0 匹のため、boxdata.bin も作成しませんでした。`,true);return}
  if(window.NERCounter)window.NERCounter.countRescue();
  saveBlob(data,'boxdata.bin');
  showReturnGuide('bin');
  msg(`${reason}代わりに boxdata.bin(ボックスのポケモン ${placed} 匹)をダウンロードしました${unknown?`。ボックスの外にいる ${unknown} 匹は boxdata.bin には入りません`:''}${conflicts?`。重複位置 ${conflicts} 匹は未配置`:''}。PKHeX で同じゲームのセーブを開いてから読み込んでください。`);
}
// v61: 場所不明のポケモンを選んでいたら、入れるボックスを選んでもらう
function askUnknownBox(unk,selected){
  return new Promise(resolve=>{
    const d=surveyDialog();
    const names=(boxState.pages||[]).map(p=>p.name);
    const usedIn=new Array(31).fill(0);
    for(const q of selected){if(getSpecialLocation(q)||isUnknownHit(q))continue;const loc=getLocation(q,window.__game,6);if(loc.box)usedIn[loc.box-1]++}
    let first=usedIn.findIndex(n=>30-n>=unk.length);if(first<0)first=usedIn.indexOf(Math.min(...usedIn));   // 全員入る一番若いボックス(なければ一番空いているボックス)
    d.innerHTML=`<div class="sample-dialog-box survey-box"><h3 id="surveyTitle">場所不明のポケモンを入れるボックスを選択してください</h3>
      <p class="survey-text">場所不明のポケモン ${unk.length}匹を、選んだボックスの空いているマスに入れます(入りきらなければ次のボックスへ)。</p>
      <select class="trainer-pick unknown-box">${names.map((n,i)=>`<option value="${i}"${i===(first<0?0:first)?' selected':''}>${escapeHtml(n)}(空き ${30-usedIn[i]})</option>`).join('')}</select>
      <div class="sample-dialog-actions"><button type="button" class="button ub-ok">このボックスに入れる</button><button type="button" class="button button-secondary ub-skip">入れない</button></div>
      <div class="sample-dialog-actions survey-sub"><button type="button" class="small-button ub-cancel">やめる</button></div></div>`;
    const done=v=>{d.classList.add('hidden');d.onclick=null;resolve(v)};
    d.querySelector('.ub-ok').addEventListener('click',()=>done(Number(d.querySelector('.unknown-box').value)));
    d.querySelector('.ub-skip').addEventListener('click',()=>done(null));
    d.querySelector('.ub-cancel').addEventListener('click',()=>done(undefined));
    d.onclick=e=>{if(e.target===d)done(undefined)};
    d.classList.remove('hidden');
  });
}
download.addEventListener('click',async()=>{
  const selected=selectedHits(),game=window.__itemsGame,withItems=itemsIncluded(),withMoney=moneyIncluded();
  let unknownBox=null;
  {const unk=boxState.pages?selected.filter(isUnknownHit):[];if(unk.length){unknownBox=await askUnknownBox(unk,selected);if(unknownBox===undefined)return}}
  const withDex=dexIncluded(),withTrainer=trainerIncluded(),withAvatar=avatarIncluded(),withGift=giftIncluded();
  if(!selected.length&&!withItems&&!withMoney&&!withDex&&!withGift&&!withTrainer&&!withAvatar)return;
  download.disabled=true;
  try{
    if(!game)throw Object.assign(new Error('このセーブはゲームを判定できないため、main を作れません。'),{noTemplate:true});
    const bag=withItems?window.__bag:null,money=withMoney?window.__money:null,dex=withDex?window.__dex:null;
    const trainer=withTrainer?trainerValue():null,avatar=withAvatar?window.__avatar:null;
    const {data,report:r}=await buildRescueMain({game,bag,money,selected,input:window.__input,l6:window.__layout6,includeEgg:window.__includeEgg,dex,trainer,avatar,unknownBox,gift:withGift?window.__gift:null});
    saveBlob(data,'main');
    showReturnGuide('rescue');
    const placed=r.pc+r.party+r.battle+r.daycare+r.partyToBox;
    if(placed&&window.NERCounter)window.NERCounter.countRescue();
    const parts=[];
    if(r.pc)parts.push(`ボックス ${r.pc}匹`);
    if(r.party)parts.push(`手持ち ${r.party}匹`);
    if(r.battle)parts.push(`バトルボックス ${r.battle}匹`);
    if(r.daycare)parts.push(`育て屋 ${r.daycare}匹`);
    if(bag)parts.push(`道具 ${bag.total}種`);
    if(money)parts.push('お金');
    if(dex)parts.push(`図鑑(捕まえた ${dex.caught}種)`);
    if(withGift)parts.push(`ふしぎなおくりもの ${window.__gift.cards.length}枚`);
    if(trainer)parts.push(`トレーナー ${trainer.name}(ID ${String(trainer.tid).padStart(5,'0')})`);
    if(avatar)parts.push('アバター');
    // v60: ダウンロード後の「main をダウンロードしました…」「✅ 確認…」の表示はやめた(戻し方の案内が出るため)。注意が必要なときだけ表示する
    const notes=[];
    if(r.partyToBox)notes.push(`手持ちのうち ${r.partyToBox}匹は戦闘用のデータが壊れていたため、空いているボックスに入れました。`);
    if(r.unknown)notes.push(`場所不明のポケモン ${r.unknown}匹を、選んだボックスに入れました。`);
    if(r.skipped)notes.push(`場所不明のポケモンなど ${r.skipped}匹は入れていません。`);
    {const v=verifyMain(new Uint8Array(data));if(!v||v.ok!==v.total)notes.push('作った main を読み直したところ、一部のチェックサムが一致しませんでした。');}
    if(notes.length)msg(notes.join(' '));else clearMsg();
  }catch(e){
    if(e.noTemplate&&selected.length){
      try{downloadBoxdataBin(selected,`${e.message} `)}catch(e2){msg('boxdata.bin の作成に失敗しました: '+e2.message,true)}
    }else msg('救出に失敗しました: '+e.message,true);
  }finally{updateItemsButton()}
});
// v45/v46: 読み込み直後に「まるごと復元」タブを開く条件。信頼度がこの値以上(100% = 壊れていないセーブは除く)。
// 手元のサンプルでは、大きく壊れたセーブは 26〜32%、ほぼ無事なセーブは 96% だった。
const RESTORE_TAB_MIN_SCORE=90;
function preferRestoreTab(){
  const a=restoreAnalysis();
  return !!a&&a.score>=RESTORE_TAB_MIN_SCORE&&a.score<100;
}
function renderRestoreViewer(){
  const viewer=listEl.querySelector('.restore-viewer');
  if(!viewer)return;
  const a=restoreAnalysis();
  if(!a){viewer.innerHTML='<p class="photo-note">このセーブはブロック表が見つからないため、まるごとの復元はできません。ポケモンタブから個体を救出してください。</p>';return}
  const g=a.score>=90?['高い','high']:a.score>=RESTORE_LOW_SCORE?['ふつう','mid']:['低い','low'];
  const lostNames=a.lost.map(b=>blockName(a.l6.game,b.id));
  const notes=[];
  if(a.story.length)notes.push(`<li><b>${a.story.map(id=>blockName(a.l6.game,id)).join('・')}</b> が失われているため、続きから遊ぶと話の流れや現在地が合わず、不具合が出る可能性があります。</li>`);
  if(!a.pcOk&&a.pcInfo)notes.push(`<li>ボックスのポケモン: 救出できた ${a.pcInfo.pokemon} 匹を元のマスに戻します${a.pcInfo.unreadable?`(読めないマス ${a.pcInfo.unreadable} 個は空きになります)`:''}。</li>`);
  {const n=fullRestoreMissing();if(n)notes.push(`<li><b>${n}体のポケモンが戻ってきません。「ポケモンの救出」をおすすめします。</b>(手持ち・バトルボックス・育て屋の部分が壊れているため)</li>`)}
  if(a.moved.length)notes.push(`<li>${a.moved.length} 個の部分は位置がずれていたので、本来の位置に戻します。</li>`);
  const recommend=a.score>=RESTORE_TAB_MIN_SCORE&&a.score<100?`<p class="restore-recommend"><span class="restore-recommend-icon" aria-hidden="true">🎉</span>復元信頼度が${RESTORE_TAB_MIN_SCORE}%を超えています。ほとんどの情報を復元可能です！</p>`:'';
  viewer.innerHTML=`${recommend}<div class="restore-score ${g[1]}">
      <div class="restore-score-head"><span>復元信頼度</span><strong>${a.score}<small>%</small></strong><em>${g[0]}</em></div>
      <div class="restore-bar"><i style="width:${a.score}%"></i></div>
      <p>セーブを作る ${a.total} 個の部分のうち、${a.ok} 個がそのまま残っています。</p>
    </div>
    ${notes.length?`<ul class="restore-notes">${notes.join('')}</ul>`:''}
    <div class="avatar-sub">失われている部分</div>
    <p class="restore-lost">${lostNames.length?lostNames.map(n=>`<span>${escapeHtml(n)}</span>`).join(''):'なし'}</p>
    <p class="photo-note">失われている部分は、救出用の空のセーブ(試験データ)の内容で補います。空のセーブがないゲームでは、空の状態になります。</p>
    <button type="button" class="button restore-button">セーブデータをまるごと復元する</button>
    <p class="photo-note">元のセーブとは別のファイル(main)として保存されます。ゲームに戻す前に、必ず元のセーブのバックアップを取ってください。</p>`;
  const btn=viewer.querySelector('.restore-button');
  btn.addEventListener('click',()=>confirmLowRestore(async()=>{
    btn.disabled=true;
    try{
      const {data,report:r}=await buildFullRestore();
      saveBlob(data,'main');
      showReturnGuide('full');
      if(window.NERCounter)window.NERCounter.countRescue();
      msg(`セーブデータをまるごと復元した main をダウンロードしました(残っていた部分 ${r.restored} 個${r.moved?`(うち ${r.moved} 個は位置を補正)`:''}${r.fromTemplate?`・空のセーブで補った部分 ${r.fromTemplate} 個`:''}${r.zero?`・空にした部分 ${r.zero} 個`:''}${r.pcPokemon?`・ボックスのポケモン ${r.pcPokemon} 匹`:''})。${r.allValid?'すべての部分のチェックサムが一致しています。':'一部のチェックサムが一致していません。'}`+verifyText(verifyMain(new Uint8Array(data))),!r.allValid);
    }catch(e){msg('まるごとの復元に失敗しました: '+e.message,true)}
    finally{btn.disabled=false}
  }));
}

// ---------------------------------------------------------------------------
// 破損データのサンプル提供(v36)。「提供する」→ 確認(はい / いいえ)→「はい」のときだけ、読み込んだセーブを送る。
// 送り先 SAMPLE_UPLOAD_URL は運営者の Google Apps Script(v37 から設定済み。受け取り側は sample_receiver.gs で、運営者の Google ドライブに保存)。
// 空にした場合は、開発用の自動読み込み(?dev の DEV_AUTOLOAD)のときだけ欄を出し、「はい」でも送らずに未設定と表示する。
// 送る内容: ファイル名・大きさ・推定ソフト・ツールの版・セーブ本体(base64)。同じファイルは 1 回だけ送る。
// ---------------------------------------------------------------------------
const SAMPLE_UPLOAD_URL='https://script.google.com/macros/s/AKfycbyaUk8UsW6ScHiWK_Vx4y8cTyXyuLipKPQlx2Cr9F-jVrqWk-1OuZLDQexib-w-VMcl/exec';   // v37: 管理者の Google Apps Script(受け取り側は sample_receiver.gs)
const sampleOffer=document.getElementById('sampleOffer'),sampleDialog=document.getElementById('sampleDialog'),sampleButton=document.getElementById('sampleButton');
function showSampleOffer(){
  if(!sampleOffer)return;
  const enabled=!!SAMPLE_UPLOAD_URL||!!DEV_AUTOLOAD;
  sampleOffer.classList.toggle('hidden',!enabled||!window.__input);
  if(sampleButton){sampleButton.disabled=!!window.__sampleSent;sampleButton.textContent=window.__sampleSent?'送信済み':'提供する'}
}
async function sendSample(){
  const input=window.__input;
  if(!input)return;
  if(!SAMPLE_UPLOAD_URL){msg('(開発中)サンプルの送り先がまだ設定されていないため、送信していません。');return}
  sampleButton.disabled=true;sampleButton.textContent='送信中…';
  try{
    const body=JSON.stringify({name:window.__inputName||'',size:input.length,game:window.__itemsGame||'',version:APP_VERSION,data:toBase64(input)});
    // Google Apps Script は応答を読めない(CORS)ため no-cors で送る。分かるのは通信が終わったかどうかだけで、
    // 受け取り側で保存できたか(サイズ違い・上限などで断られていないか)は分からない。v73 から表示もそれに合わせた
    await fetch(SAMPLE_UPLOAD_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body});
    window.__sampleSent=true;
    msg('破損データのサンプルを送信しました(受け取り側で保存できたかどうかは、このページからは確認できません)。ご協力ありがとうございました。');
  }catch(e){msg('サンプルを送信できませんでした。時間をおいて、もう一度お試しください。',true)}
  finally{showSampleOffer()}
}
if(sampleButton)sampleButton.addEventListener('click',()=>{if(window.__input&&!window.__sampleSent)sampleDialog.classList.remove('hidden')});
if(sampleDialog){
  sampleDialog.addEventListener('click',e=>{
    const b=e.target.closest('[data-sample]');
    if(!b&&e.target!==sampleDialog)return;
    sampleDialog.classList.add('hidden');
    if(b&&b.dataset.sample==='yes')sendSample();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')sampleDialog.classList.add('hidden')});
}
// i マーク: マウスを乗せる(CSS)か、タップで説明を出す
document.querySelectorAll('.sample-info').forEach(el=>el.addEventListener('click',e=>{e.stopPropagation();el.classList.toggle('open')}));
document.addEventListener('click',()=>document.querySelectorAll('.sample-info.open').forEach(el=>el.classList.remove('open')));

// ---------------------------------------------------------------------------
// 開発中の自動読み込み(v26)。DEV_AUTOLOAD にファイルの場所を書くと、ページを開いた時点でそのセーブを読み込む。
// 完成品として公開するときは null にし、test/ フォルダも削除すること(試験用セーブが誰でもダウンロードできてしまうため)。
// URL に ?noautoload を付けると、一時的に自動読み込みしない。
// ---------------------------------------------------------------------------
// v35: XY と ORAS の試験用セーブを切り替えられるように(開発用の帯のチェックボックス)。最初は XY を読み込む。
// v59: 公開版では動かさない。URL に ?dev を付けたときだけ、試験用セーブの帯と自動読み込みを出す。
const DEV_AUTOLOAD=/[?&]dev\b/.test(location.search)?{XY:'test/main',ORAS:'test/main_oras'}:null;
async function devLoad(key){
  const path=DEV_AUTOLOAD&&DEV_AUTOLOAD[key];
  if(!path)return;
  try{
    const res=await fetch(path,{cache:'no-store'});
    if(!res.ok){msg(`試験用セーブ(${path})を読み込めませんでした。`,true);return}
    await analyze(new File([await res.arrayBuffer()],path.split('/').pop()));
    devBarSet(key);
  }catch(e){console.warn('自動読み込みに失敗しました',e)}
}
function devBarSet(key){document.querySelectorAll('.dev-bar input').forEach(cb=>{cb.checked=cb.dataset.dev===key})}
(function devAutoload(){
  if(!DEV_AUTOLOAD)return;
  const bar=document.createElement('div');bar.className='dev-bar';
  bar.innerHTML=`<span>開発用: 試験用セーブ</span>${Object.keys(DEV_AUTOLOAD).map(k=>`<label><input type="checkbox" data-dev="${k}">${k==='XY'?'X・Y':'ORAS'}</label>`).join('')}`;
  statusEl.parentNode.insertBefore(bar,statusEl);
  bar.querySelectorAll('input').forEach(cb=>cb.addEventListener('change',()=>{
    if(!cb.checked){cb.checked=true;return}   // 片方は必ず選ばれている(自分のファイルを選んだときだけ両方外れる)
    devLoad(cb.dataset.dev);
  }));
  if(/[?&]noautoload\b/.test(location.search))return;
  devLoad('XY');
})();

// フッターにバージョンを表示する。公開中のサイトがどの版か確認できるようにするため。
(function showVersion(){
  const footer=document.querySelector("footer");
  if(!footer)return;
  const span=document.createElement("span");
  span.className="app-version";
  span.textContent=" · v"+APP_VERSION+" ("+APP_VERSION_DATE+")";
  footer.appendChild(span);
})();

// ---------------------------------------------------------------------------
// v71: 思うように救出できなかった方へ。
// 「修復をリクエストする」で、壊れたセーブ(読み込んだファイルそのまま)と最後に作ったデータ(main / boxdata.bin)を
// 同じサイト(noctis1008-wq.github.io)の IndexedDB「nerRepairHandoff」に置き、修復依頼ページを開く。
// 修復依頼ページは ?from=recovery のときにそこから 2 つのファイルを読み込み、送信が終わったら消す。
// ---------------------------------------------------------------------------
const REPAIR_PAGE_URL='../repair-request/?from=recovery';
function renderRepairHelp(){
  const b=document.getElementById('repairBroken'),r=document.getElementById('repairRescued'),btn=document.getElementById('repairButton'),note=document.getElementById('repairNote');
  if(!b||!btn)return;
  const f=window.__inputFile,o=window.__lastOutput;
  b.textContent=f?f.name:'—';b.classList.toggle('missing',!f);
  r.textContent=o?o.name:'まだありません';r.classList.toggle('missing',!o);
  btn.disabled=!(f&&o);
  note.className='repair-note';
  note.textContent=!f?'':!o?'先に「ポケモンを救出する」(または「まるごと復元」)で、救出したデータを作ってください。':'押すと修復依頼ページが開き、2 つのデータが添付された状態になります。';
}
function handoffPut(rec){
  return new Promise((ok,ng)=>{
    let req;try{req=indexedDB.open('nerRepairHandoff',1)}catch(e){ng(e);return}
    req.onupgradeneeded=()=>req.result.createObjectStore('files');
    req.onerror=()=>ng(req.error);
    req.onsuccess=()=>{const db=req.result,tx=db.transaction('files','readwrite');tx.objectStore('files').put(rec,'latest');tx.oncomplete=()=>{db.close();ok()};tx.onerror=tx.onabort=()=>{db.close();ng(tx.error)}};
  });
}
(function(){
  const btn=document.getElementById('repairButton');
  if(!btn)return;
  btn.addEventListener('click',async()=>{
    const f=window.__inputFile,o=window.__lastOutput,note=document.getElementById('repairNote');
    if(!f||!o)return;
    btn.disabled=true;
    try{
      await handoffPut({at:Date.now(),version:APP_VERSION,game:window.__itemsGame||'',
        broken:{name:f.name,data:await f.arrayBuffer()},
        rescued:{name:o.name,data:o.data.buffer.slice(0)}});
      location.href=REPAIR_PAGE_URL;
    }catch(e){
      note.className='repair-note error';
      note.innerHTML='データを渡せませんでした。<a href="../repair-request/">修復依頼ページ</a>を開いて、2 つのファイルを選んでください。';
      btn.disabled=false;
    }
  });
})();
