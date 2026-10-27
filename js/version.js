// ===========================================================================
// NER Pokémon Recovery
//
// バージョンは連番。更新のたびに 1 つ増やす。
// 旧 ZIP の v1 … v5 の続きとして v6 から開始している。
// v73 から、版番号の元は version.json。この値と index.html / privacy.html / style.css の ?v= は
// node tools/set-version.js <番号> でまとめて書き換える(手で直さない)。配布 ZIP のファイル名と CHANGELOG.md の見出しも同じ値に。
// ?v= を上げ忘れると、ブラウザが古い JS / CSS を使い続けて更新が反映されない(node --test tests/ で確かめられる)。
// ===========================================================================
const APP_VERSION = "83";
const APP_VERSION_DATE = "2026-10-27";
