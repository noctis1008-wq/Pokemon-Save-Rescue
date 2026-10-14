// ===========================================================================
// 来訪者数・救出回数のカウンター(v9)
//
// NER Converter の counter.js と同じ CountAPI(countapi.mileshilliard.com)を使う。
// 送るのはキー名だけで、セーブデータやその内容は一切送らない。
//
// - 来訪者数: ブラウザごとに初回だけ hit(加算)、2 回目以降は get(読み取りのみ)。
//             localStorage のフラグは正常な応答を受けてから立てる。
// - 救出回数: 救出ボタンで boxdata.bin を出力できたときに hit。
//             (配置 0 匹などで bin を出さなかった場合は数えない)
// - /get は未作成のキーに 404 を返すので、その場合は 0 と表示する。
// - 通信に失敗した場合は表示しないだけで、ツールの動作には影響させない。
// キーは公開・削除不可。名前を変えると 0 から数え直しになるので変更しないこと。
// ===========================================================================
(function(){
  const API="https://countapi.mileshilliard.com/api/v1";
  const KEY_VISITS="ner_pokemon_recovery_noctis1008_visits";
  const KEY_RESCUES="ner_pokemon_recovery_noctis1008_rescues";
  const STORAGE_KEY="ner_pokemon_recovery_visited";
  const values={visits:null,rescues:null};
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
  async function init(){
    const visited=storageGet(STORAGE_KEY)==="1";
    const [v,r]=await Promise.all([call(visited?"get":"hit",KEY_VISITS),call("get",KEY_RESCUES)]);
    if(v!==null){values.visits=v;if(!visited)storageSet(STORAGE_KEY,"1")}
    if(r!==null)values.rescues=r;
    render();
  }
  window.NERCounter={
    countRescue:async function(){
      const r=await call("hit",KEY_RESCUES);
      if(r!==null){values.rescues=r;render()}
    }
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
