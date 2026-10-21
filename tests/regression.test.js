// 回帰テスト: node --test tests/
// 解析(ブロック表・チェックサム・位置合わせ・PK6 の復号・走査)と出力(main・boxdata.bin)の結果が
// tests/expected.json(個数とハッシュだけを記録)から変わっていないことを確かめる。
// 意図して結果を変えたときは node tests/update-expected.js で作り直す。
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const H=require('./harness');
const expected=JSON.parse(fs.readFileSync(path.join(__dirname,'expected.json'),'utf8'));
const files=H.saveFiles();

test('テスト対象のセーブがある(templates/ の空のセーブ)',()=>{
  assert.ok(files.some(f=>f.name.startsWith('templates/')),'templates/main_xy などが見つかりません');
});

for(const f of files){
  const vars=H.variants(fs.readFileSync(f.path));
  for(const [kind,bytes] of Object.entries(vars)){
    const key=f.name+'#'+kind;
    test(`${key}: 解析と出力の結果が変わっていない`,async()=>{
      assert.ok(expected[key],`${key} の期待値がありません(node tests/update-expected.js で作成)`);
      const {summary,result}=await H.summarize(bytes);
      assert.deepEqual(summary,expected[key]);
      // 復号した個体を暗号化し直すと、セーブ上のバイト列と一致する
      for(const h of result.rawHits.filter(h=>h.checksumValid)){
        const raw=result.scanInput.subarray(h.offset,h.offset+232);
        assert.deepEqual(encryptPK(h.data),new Uint8Array(raw),`offset ${h.offset} の再暗号化`);
      }
      // 無事なセーブ(元のまま・回転)は、すべてのブロックのチェックサムが一致する
      if(f.name.startsWith('templates/')&&(kind==='orig'||kind==='rot'))assert.equal(result.l6.okCount,result.l6.blocks.length);
    });
  }
}

test('画面側で少しずつ走査した結果(scanChunked)は scan() と同じ',async()=>{
  H.load();
  for(const f of files.slice(0,2)){
    const input=new Uint8Array(fs.readFileSync(f.path));
    let calls=0;const a=scan(input,6,721),b=await scanChunked(input,6,721,()=>calls++);
    assert.equal(H.digest(a),H.digest(b));
    assert.ok(calls>1,'進み具合が知らされていない');
  }
});

test('PK6 の暗号化と復号は逆の関係',()=>{
  H.load();
  for(let sv=0;sv<32;sv++){
    const d=new Uint8Array(232);for(let i=0;i<232;i++)d[i]=(i*37+sv)&255;
    const ec=(sv<<13)|0x1234;d[0]=ec&255;d[1]=(ec>>>8)&255;d[2]=(ec>>>16)&255;d[3]=(ec>>>24)&255;
    const enc=encryptPK(d),dec=new Uint8Array(enc);crypt(dec,8,232,ec);inverseShuffle(dec.subarray(8,232),(ec>>>13)&31);
    assert.deepEqual(dec,d,`sv=${sv}`);
  }
});
