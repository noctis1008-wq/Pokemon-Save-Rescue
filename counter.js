// ===========================================================================
// 来訪者数・救出回数のカウンター(v9)、いいねボタン(v15)
//
// NER Converter の counter.js と同じ CountAPI(countapi.mileshilliard.com)を使う。
// 送るのはキー名だけで、セーブデータやその内容は一切送らない。
//
// - 来訪者数: ブラウザごとに初回だけ hit(加算)、2 回目以降は get(読み取りのみ)。
//             localStorage のフラグは正常な応答を受けてから立てる。
// - 救出回数: 救出ボタンで boxdata.bin を出力できたときに hit。
//             (配置 0 匹などで bin を出さなかった場合は数えない)
// - いいね:   ボタンを押すと hit。ブラウザごとに 1 回だけ(localStorage のフラグ)。
//             押した後は「いいね済み」にしてボタンを無効化する。
// - /get は未作成のキーに 404 を返すので、その場合は 0 と表示する。
// - 通信に失敗した場合は表示しないだけで、ツールの動作には影響させない。
// キーは公開・削除不可。名前を変えると 0 から数え直しになるので変更しないこと。
// ===========================================================================
(function(){
  const API="https://countapi.mileshilliard.com/api/v1";
  const KEY_VISITS="ner_pokemon_recovery_noctis1008_visits";
  const KEY_RESCUES="ner_pokemon_recovery_noctis1008_rescues";
  const KEY_LIKES="ner_pokemon_recovery_noctis1008_likes";
  const STORAGE_KEY="ner_pokemon_recovery_visited";
  const LIKED_KEY="ner_pokemon_recovery_liked";
  const values={visits:null,rescues:null,likes:null};
  let likeBox=null,likeBusy=false;
  let box=null;

  function storageGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function storageSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  async function call(action,key){
    try{
      const res=await fetch(`${API}/${action}/${encodeURIComponent(key)}`,{cache:"no-store"});
      if(action==="get"&&res.status===404)return 0;
      if(!res.ok)return null;
      const json=await res.json();
      const v=Number(json&&json.value);
      return Number.isFinite(v)&&v>=0?v:null;
    }catch(e){return null}
  }
  function render(){
    const footer=document.querySelector("footer");
    if(!footer)return;
    const parts=[];
    if(values.visits!==null)parts.push(`これまでの訪問者数 ${values.visits.toLocaleString("ja-JP")}`);
    if(values.rescues!==null)parts.push(`救出回数 ${values.rescues.toLocaleString("ja-JP")}`);
    if(!parts.length)return;
    if(!box){box=document.createElement("div");box.className="visitor-counter";footer.appendChild(box)}
    box.textContent=parts.join(" · ");
  }
  // いいねボタン。フッターの直前に置く。数が取れなかった(通信失敗)場合は出さない
  function renderLike(){
    if(values.likes===null)return;
    const footer=document.querySelector("footer");
    if(!footer)return;
    if(!likeBox){
      likeBox=document.createElement("div");likeBox.className="like-box";
      likeBox.innerHTML='<button type="button" class="like-button"><span class="like-heart" aria-hidden="true">♥</span><span class="like-label"></span><span class="like-count"></span></button><p class="like-note">このツールが役に立ったら押してください</p>';
      footer.parentNode.insertBefore(likeBox,footer);
      likeBox.querySelector("button").addEventListener("click",like);
    }
    const liked=storageGet(LIKED_KEY)==="1";
    const btn=likeBox.querySelector("button");
    btn.disabled=liked||likeBusy;
    btn.classList.toggle("liked",liked);
    btn.setAttribute("aria-pressed",liked?"true":"false");
    likeBox.querySelector(".like-label").textContent=liked?"いいね済み":"いいね";
    likeBox.querySelector(".like-count").textContent=values.likes.toLocaleString("ja-JP");
  }
  async function like(){
    if(likeBusy||storageGet(LIKED_KEY)==="1")return;
    likeBusy=true;renderLike();
    const n=await call("hit",KEY_LIKES);
    likeBusy=false;
    if(n!==null){values.likes=n;storageSet(LIKED_KEY,"1")}
    renderLike();
  }
  async function init(){
    const visited=storageGet(STORAGE_KEY)==="1";
    const [v,r,l]=await Promise.all([call(visited?"get":"hit",KEY_VISITS),call("get",KEY_RESCUES),call("get",KEY_LIKES)]);
    if(v!==null){values.visits=v;if(!visited)storageSet(STORAGE_KEY,"1")}
    if(r!==null)values.rescues=r;
    if(l!==null)values.likes=l;
    render();renderLike();
  }
  window.NERCounter={
    countRescue:async function(){
      const r=await call("hit",KEY_RESCUES);
      if(r!==null){values.rescues=r;render()}
    }
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
