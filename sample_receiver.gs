/**
 * NER Pokémon Recovery — 破損データのサンプル受け取り用(Google Apps Script)
 *
 * サイトの「提供する」→「はい」で送られたセーブを、あなたの Google ドライブの
 * 「NER Recovery サンプル」フォルダに保存します。見るときは Google ドライブを開くだけです。
 *
 * 受け付けるのは X・Y(415,232 バイト)と ORAS(483,328 バイト)のセーブだけです。
 * 同じ中身のセーブは 2 回保存しません。いたずら対策として、1 時間に保存する数に上限があります。
 */

const FOLDER_NAME = 'NER Recovery サンプル';
const ALLOWED_SIZES = { 0x65600: 'XY', 0x76000: 'ORAS' };
const MAX_PER_HOUR = 30;

function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents);
    const bytes = Utilities.base64Decode(req.data || '');
    const game = ALLOWED_SIZES[bytes.length];
    if (!game) return reply('rejected: size');

    // 1 時間あたりの上限
    const props = PropertiesService.getScriptProperties();
    const hourKey = 'count_' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMddHH');
    const count = Number(props.getProperty(hourKey) || 0);
    if (count >= MAX_PER_HOUR) return reply('rejected: busy');

    // 同じ中身は保存しない(SHA-256 の先頭 12 文字で判定)
    const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, bytes)
      .map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('').slice(0, 12);
    const folder = getFolder();
    if (folder.searchFiles('title contains "' + hash + '"').hasNext()) return reply('ok: duplicate');

    const stamp = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMdd-HHmmss');
    const fileName = stamp + '_' + game + '_' + hash;
    const file = folder.createFile(Utilities.newBlob(bytes, 'application/octet-stream', fileName));
    const original = String(req.name || '').slice(0, 100);
    file.setDescription('元のファイル名: ' + original + ' / 推定ソフト: ' + String(req.game || '') +
      ' / ツールの版: v' + String(req.version || '') + ' / 大きさ: ' + bytes.length);

    props.setProperty(hourKey, String(count + 1));
    return reply('ok');
  } catch (err) {
    return reply('error');
  }
}

// ブラウザでこのアドレスを開いたときの表示(動いているかの確認用)
function doGet() {
  return reply('NER Recovery sample receiver is running.');
}

function getFolder() {
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

function reply(text) {
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}

// 最初に 1 回だけ実行してください(フォルダを作り、ドライブを使う許可を出すため)
function setup() {
  const folder = getFolder();
  Logger.log('フォルダ: ' + folder.getName() + ' (' + folder.getUrl() + ')');
}
