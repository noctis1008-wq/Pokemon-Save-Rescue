// ===========================================================================
// NER Pokémon Recovery
//
// バージョンは連番。更新のたびに 1 つ増やす。
// 旧 ZIP の v1 … v5 の続きとして v6 から開始している。
// この値・配布 ZIP のファイル名・CHANGELOG.md、そして index.html / privacy.html の
// 各タグ末尾にある ?v= の 5 つを必ず一致させること。
// ?v= を上げ忘れると、ブラウザが古い JS / CSS を使い続けて更新が反映されない。
// ===========================================================================
const APP_VERSION = "34";
const APP_VERSION_DATE = "2026-10-16";

const fileInput=document.getElementById('file');const drop=document.getElementById('drop');const statusEl=document.getElementById('status');const result=document.getElementById('result');const gameEl=document.getElementById('game');const sizeEl=document.getElementById('size');const countEl=document.getElementById('count');const listEl=document.getElementById('list');const download=document.getElementById('download');
const SAVE={XY:0x65600,ORAS:0x76000};   // v19: 第7世代は対象外にした
const SPECIES={"1":"フシギダネ","2":"フシギソウ","3":"フシギバナ","4":"ヒトカゲ","5":"リザード","6":"リザードン","7":"ゼニガメ","8":"カメール","9":"カメックス","10":"キャタピー","11":"トランセル","12":"バタフリー","13":"ビードル","14":"コクーン","15":"スピアー","16":"ポッポ","17":"ピジョン","18":"ピジョット","19":"コラッタ","20":"ラッタ","21":"オニスズメ","22":"オニドリル","23":"アーボ","24":"アーボック","25":"ピカチュウ","26":"ライチュウ","27":"サンド","28":"サンドパン","29":"ニドラン♀","30":"ニドリーナ","31":"ニドクイン","32":"ニドラン♂","33":"ニドリーノ","34":"ニドキング","35":"ピッピ","36":"ピクシー","37":"ロコン","38":"キュウコン","39":"プリン","40":"プクリン","41":"ズバット","42":"ゴルバット","43":"ナゾノクサ","44":"クサイハナ","45":"ラフレシア","46":"パラス","47":"パラセクト","48":"コンパン","49":"モルフォン","50":"ディグダ","51":"ダグトリオ","52":"ニャース","53":"ペルシアン","54":"コダック","55":"ゴルダック","56":"マンキー","57":"オコリザル","58":"ガーディ","59":"ウインディ","60":"ニョロモ","61":"ニョロゾ","62":"ニョロボン","63":"ケーシィ","64":"ユンゲラー","65":"フーディン","66":"ワンリキー","67":"ゴーリキー","68":"カイリキー","69":"マダツボミ","70":"ウツドン","71":"ウツボット","72":"メノクラゲ","73":"ドククラゲ","74":"イシツブテ","75":"ゴローン","76":"ゴローニャ","77":"ポニータ","78":"ギャロップ","79":"ヤドン","80":"ヤドラン","81":"コイル","82":"レアコイル","83":"カモネギ","84":"ドードー","85":"ドードリオ","86":"パウワウ","87":"ジュゴン","88":"ベトベター","89":"ベトベトン","90":"シェルダー","91":"パルシェン","92":"ゴース","93":"ゴースト","94":"ゲンガー","95":"イワーク","96":"スリープ","97":"スリーパー","98":"クラブ","99":"キングラー","100":"ビリリダマ","101":"マルマイン","102":"タマタマ","103":"ナッシー","104":"カラカラ","105":"ガラガラ","106":"サワムラー","107":"エビワラー","108":"ベロリンガ","109":"ドガース","110":"マタドガス","111":"サイホーン","112":"サイドン","113":"ラッキー","114":"モンジャラ","115":"ガルーラ","116":"タッツー","117":"シードラ","118":"トサキント","119":"アズマオウ","120":"ヒトデマン","121":"スターミー","122":"バリヤード","123":"ストライク","124":"ルージュラ","125":"エレブー","126":"ブーバー","127":"カイロス","128":"ケンタロス","129":"コイキング","130":"ギャラドス","131":"ラプラス","132":"メタモン","133":"イーブイ","134":"シャワーズ","135":"サンダース","136":"ブースター","137":"ポリゴン","138":"オムナイト","139":"オムスター","140":"カブト","141":"カブトプス","142":"プテラ","143":"カビゴン","144":"フリーザー","145":"サンダー","146":"ファイヤー","147":"ミニリュウ","148":"ハクリュー","149":"カイリュー","150":"ミュウツー","151":"ミュウ","152":"チコリータ","153":"ベイリーフ","154":"メガニウム","155":"ヒノアラシ","156":"マグマラシ","157":"バクフーン","158":"ワニノコ","159":"アリゲイツ","160":"オーダイル","161":"オタチ","162":"オオタチ","163":"ホーホー","164":"ヨルノズク","165":"レディバ","166":"レディアン","167":"イトマル","168":"アリアドス","169":"クロバット","170":"チョンチー","171":"ランターン","172":"ピチュー","173":"ピィ","174":"ププリン","175":"トゲピー","176":"トゲチック","177":"ネイティ","178":"ネイティオ","179":"メリープ","180":"モココ","181":"デンリュウ","182":"キレイハナ","183":"マリル","184":"マリルリ","185":"ウソッキー","186":"ニョロトノ","187":"ハネッコ","188":"ポポッコ","189":"ワタッコ","190":"エイパム","191":"ヒマナッツ","192":"キマワリ","193":"ヤンヤンマ","194":"ウパー","195":"ヌオー","196":"エーフィ","197":"ブラッキー","198":"ヤミカラス","199":"ヤドキング","200":"ムウマ","201":"アンノーン","202":"ソーナンス","203":"キリンリキ","204":"クヌギダマ","205":"フォレトス","206":"ノコッチ","207":"グライガー","208":"ハガネール","209":"ブルー","210":"グランブル","211":"ハリーセン","212":"ハッサム","213":"ツボツボ","214":"ヘラクロス","215":"ニューラ","216":"ヒメグマ","217":"リングマ","218":"マグマッグ","219":"マグカルゴ","220":"ウリムー","221":"イノムー","222":"サニーゴ","223":"テッポウオ","224":"オクタン","225":"デリバード","226":"マンタイン","227":"エアームド","228":"デルビル","229":"ヘルガー","230":"キングドラ","231":"ゴマゾウ","232":"ドンファン","233":"ポリゴン２","234":"オドシシ","235":"ドーブル","236":"バルキー","237":"カポエラー","238":"ムチュール","239":"エレキッド","240":"ブビィ","241":"ミルタンク","242":"ハピナス","243":"ライコウ","244":"エンテイ","245":"スイクン","246":"ヨーギラス","247":"サナギラス","248":"バンギラス","249":"ルギア","250":"ホウオウ","251":"セレビィ","252":"キモリ","253":"ジュプトル","254":"ジュカイン","255":"アチャモ","256":"ワカシャモ","257":"バシャーモ","258":"ミズゴロウ","259":"ヌマクロー","260":"ラグラージ","261":"ポチエナ","262":"グラエナ","263":"ジグザグマ","264":"マッスグマ","265":"ケムッソ","266":"カラサリス","267":"アゲハント","268":"マユルド","269":"ドクケイル","270":"ハスボー","271":"ハスブレロ","272":"ルンパッパ","273":"タネボー","274":"コノハナ","275":"ダーテング","276":"スバメ","277":"オオスバメ","278":"キャモメ","279":"ペリッパー","280":"ラルトス","281":"キルリア","282":"サーナイト","283":"アメタマ","284":"アメモース","285":"キノココ","286":"キノガッサ","287":"ナマケロ","288":"ヤルキモノ","289":"ケッキング","290":"ツチニン","291":"テッカニン","292":"ヌケニン","293":"ゴニョニョ","294":"ドゴーム","295":"バクオング","296":"マクノシタ","297":"ハリテヤマ","298":"ルリリ","299":"ノズパス","300":"エネコ","301":"エネコロロ","302":"ヤミラミ","303":"クチート","304":"ココドラ","305":"コドラ","306":"ボスゴドラ","307":"アサナン","308":"チャーレム","309":"ラクライ","310":"ライボルト","311":"プラスル","312":"マイナン","313":"バルビート","314":"イルミーゼ","315":"ロゼリア","316":"ゴクリン","317":"マルノーム","318":"キバニア","319":"サメハダー","320":"ホエルコ","321":"ホエルオー","322":"ドンメル","323":"バクーダ","324":"コータス","325":"バネブー","326":"ブーピッグ","327":"パッチール","328":"ナックラー","329":"ビブラーバ","330":"フライゴン","331":"サボネア","332":"ノクタス","333":"チルット","334":"チルタリス","335":"ザングース","336":"ハブネーク","337":"ルナトーン","338":"ソルロック","339":"ドジョッチ","340":"ナマズン","341":"ヘイガニ","342":"シザリガー","343":"ヤジロン","344":"ネンドール","345":"リリーラ","346":"ユレイドル","347":"アノプス","348":"アーマルド","349":"ヒンバス","350":"ミロカロス","351":"ポワルン","352":"カクレオン","353":"カゲボウズ","354":"ジュペッタ","355":"ヨマワル","356":"サマヨール","357":"トロピウス","358":"チリーン","359":"アブソル","360":"ソーナノ","361":"ユキワラシ","362":"オニゴーリ","363":"タマザラシ","364":"トドグラー","365":"トドゼルガ","366":"パールル","367":"ハンテール","368":"サクラビス","369":"ジーランス","370":"ラブカス","371":"タツベイ","372":"コモルー","373":"ボーマンダ","374":"ダンバル","375":"メタング","376":"メタグロス","377":"レジロック","378":"レジアイス","379":"レジスチル","380":"ラティアス","381":"ラティオス","382":"カイオーガ","383":"グラードン","384":"レックウザ","385":"ジラーチ","386":"デオキシス","387":"ナエトル","388":"ハヤシガメ","389":"ドダイトス","390":"ヒコザル","391":"モウカザル","392":"ゴウカザル","393":"ポッチャマ","394":"ポッタイシ","395":"エンペルト","396":"ムックル","397":"ムクバード","398":"ムクホーク","399":"ビッパ","400":"ビーダル","401":"コロボーシ","402":"コロトック","403":"コリンク","404":"ルクシオ","405":"レントラー","406":"スボミー","407":"ロズレイド","408":"ズガイドス","409":"ラムパルド","410":"タテトプス","411":"トリデプス","412":"ミノムッチ","413":"ミノマダム","414":"ガーメイル","415":"ミツハニー","416":"ビークイン","417":"パチリス","418":"ブイゼル","419":"フローゼル","420":"チェリンボ","421":"チェリム","422":"カラナクシ","423":"トリトドン","424":"エテボース","425":"フワンテ","426":"フワライド","427":"ミミロル","428":"ミミロップ","429":"ムウマージ","430":"ドンカラス","431":"ニャルマー","432":"ブニャット","433":"リーシャン","434":"スカンプー","435":"スカタンク","436":"ドーミラー","437":"ドータクン","438":"ウソハチ","439":"マネネ","440":"ピンプク","441":"ペラップ","442":"ミカルゲ","443":"フカマル","444":"ガバイト","445":"ガブリアス","446":"ゴンベ","447":"リオル","448":"ルカリオ","449":"ヒポポタス","450":"カバルドン","451":"スコルピ","452":"ドラピオン","453":"グレッグル","454":"ドクロッグ","455":"マスキッパ","456":"ケイコウオ","457":"ネオラント","458":"タマンタ","459":"ユキカブリ","460":"ユキノオー","461":"マニューラ","462":"ジバコイル","463":"ベロベルト","464":"ドサイドン","465":"モジャンボ","466":"エレキブル","467":"ブーバーン","468":"トゲキッス","469":"メガヤンマ","470":"リーフィア","471":"グレイシア","472":"グライオン","473":"マンムー","474":"ポリゴンＺ","475":"エルレイド","476":"ダイノーズ","477":"ヨノワール","478":"ユキメノコ","479":"ロトム","480":"ユクシー","481":"エムリット","482":"アグノム","483":"ディアルガ","484":"パルキア","485":"ヒードラン","486":"レジギガス","487":"ギラティナ","488":"クレセリア","489":"フィオネ","490":"マナフィ","491":"ダークライ","492":"シェイミ","493":"アルセウス","494":"ビクティニ","495":"ツタージャ","496":"ジャノビー","497":"ジャローダ","498":"ポカブ","499":"チャオブー","500":"エンブオー","501":"ミジュマル","502":"フタチマル","503":"ダイケンキ","504":"ミネズミ","505":"ミルホッグ","506":"ヨーテリー","507":"ハーデリア","508":"ムーランド","509":"チョロネコ","510":"レパルダス","511":"ヤナップ","512":"ヤナッキー","513":"バオップ","514":"バオッキー","515":"ヒヤップ","516":"ヒヤッキー","517":"ムンナ","518":"ムシャーナ","519":"マメパト","520":"ハトーボー","521":"ケンホロウ","522":"シママ","523":"ゼブライカ","524":"ダンゴロ","525":"ガントル","526":"ギガイアス","527":"コロモリ","528":"ココロモリ","529":"モグリュー","530":"ドリュウズ","531":"タブンネ","532":"ドッコラー","533":"ドテッコツ","534":"ローブシン","535":"オタマロ","536":"ガマガル","537":"ガマゲロゲ","538":"ナゲキ","539":"ダゲキ","540":"クルミル","541":"クルマユ","542":"ハハコモリ","543":"フシデ","544":"ホイーガ","545":"ペンドラー","546":"モンメン","547":"エルフーン","548":"チュリネ","549":"ドレディア","550":"バスラオ","551":"メグロコ","552":"ワルビル","553":"ワルビアル","554":"ダルマッカ","555":"ヒヒダルマ","556":"マラカッチ","557":"イシズマイ","558":"イワパレス","559":"ズルッグ","560":"ズルズキン","561":"シンボラー","562":"デスマス","563":"デスカーン","564":"プロトーガ","565":"アバゴーラ","566":"アーケン","567":"アーケオス","568":"ヤブクロン","569":"ダストダス","570":"ゾロア","571":"ゾロアーク","572":"チラーミィ","573":"チラチーノ","574":"ゴチム","575":"ゴチミル","576":"ゴチルゼル","577":"ユニラン","578":"ダブラン","579":"ランクルス","580":"コアルヒー","581":"スワンナ","582":"バニプッチ","583":"バニリッチ","584":"バイバニラ","585":"シキジカ","586":"メブキジカ","587":"エモンガ","588":"カブルモ","589":"シュバルゴ","590":"タマゲタケ","591":"モロバレル","592":"プルリル","593":"ブルンゲル","594":"ママンボウ","595":"バチュル","596":"デンチュラ","597":"テッシード","598":"ナットレイ","599":"ギアル","600":"ギギアル","601":"ギギギアル","602":"シビシラス","603":"シビビール","604":"シビルドン","605":"リグレー","606":"オーベム","607":"ヒトモシ","608":"ランプラー","609":"シャンデラ","610":"キバゴ","611":"オノンド","612":"オノノクス","613":"クマシュン","614":"ツンベアー","615":"フリージオ","616":"チョボマキ","617":"アギルダー","618":"マッギョ","619":"コジョフー","620":"コジョンド","621":"クリムガン","622":"ゴビット","623":"ゴルーグ","624":"コマタナ","625":"キリキザン","626":"バッフロン","627":"ワシボン","628":"ウォーグル","629":"バルチャイ","630":"バルジーナ","631":"クイタラン","632":"アイアント","633":"モノズ","634":"ジヘッド","635":"サザンドラ","636":"メラルバ","637":"ウルガモス","638":"コバルオン","639":"テラキオン","640":"ビリジオン","641":"トルネロス","642":"ボルトロス","643":"レシラム","644":"ゼクロム","645":"ランドロス","646":"キュレム","647":"ケルディオ","648":"メロエッタ","649":"ゲノセクト","650":"ハリマロン","651":"ハリボーグ","652":"ブリガロン","653":"フォッコ","654":"テールナー","655":"マフォクシー","656":"ケロマツ","657":"ゲコガシラ","658":"ゲッコウガ","659":"ホルビー","660":"ホルード","661":"ヤヤコマ","662":"ヒノヤコマ","663":"ファイアロー","664":"コフキムシ","665":"コフーライ","666":"ビビヨン","667":"シシコ","668":"カエンジシ","669":"フラベベ","670":"フラエッテ","671":"フラージェス","672":"メェークル","673":"ゴーゴート","674":"ヤンチャム","675":"ゴロンダ","676":"トリミアン","677":"ニャスパー","678":"ニャオニクス","679":"ヒトツキ","680":"ニダンギル","681":"ギルガルド","682":"シュシュプ","683":"フレフワン","684":"ペロッパフ","685":"ペロリーム","686":"マーイーカ","687":"カラマネロ","688":"カメテテ","689":"ガメノデス","690":"クズモー","691":"ドラミドロ","692":"ウデッポウ","693":"ブロスター","694":"エリキテル","695":"エレザード","696":"チゴラス","697":"ガチゴラス","698":"アマルス","699":"アマルルガ","700":"ニンフィア","701":"ルチャブル","702":"デデンネ","703":"メレシー","704":"ヌメラ","705":"ヌメイル","706":"ヌメルゴン","707":"クレッフィ","708":"ボクレー","709":"オーロット","710":"バケッチャ","711":"パンプジン","712":"カチコール","713":"クレベース","714":"オンバット","715":"オンバーン","716":"ゼルネアス","717":"イベルタル","718":"ジガルデ","719":"ディアンシー","720":"フーパ","721":"ボルケニオン","722":"モクロー","723":"フクスロー","724":"ジュナイパー","725":"ニャビー","726":"ニャヒート","727":"ガオガエン","728":"アシマリ","729":"オシャマリ","730":"アシレーヌ","731":"ツツケラ","732":"ケララッパ","733":"ドデカバシ","734":"ヤングース","735":"デカグース","736":"アゴジムシ","737":"デンヂムシ","738":"クワガノン","739":"マケンカニ","740":"ケケンカニ","741":"オドリドリ","742":"アブリー","743":"アブリボン","744":"イワンコ","745":"ルガルガン","746":"ヨワシ","747":"ヒドイデ","748":"ドヒドイデ","749":"ドロバンコ","750":"バンバドロ","751":"シズクモ","752":"オニシズクモ","753":"カリキリ","754":"ラランテス","755":"ネマシュ","756":"マシェード","757":"ヤトウモリ","758":"エンニュート","759":"ヌイコグマ","760":"キテルグマ","761":"アマカジ","762":"アママイコ","763":"アマージョ","764":"キュワワー","765":"ヤレユータン","766":"ナゲツケサル","767":"コソクムシ","768":"グソクムシャ","769":"スナバァ","770":"シロデスナ","771":"ナマコブシ","772":"タイプ：ヌル","773":"シルヴァディ","774":"メテノ","775":"ネッコアラ","776":"バクガメス","777":"トゲデマル","778":"ミミッキュ","779":"ハギギシリ","780":"ジジーロン","781":"ダダリン","782":"ジャラコ","783":"ジャランゴ","784":"ジャラランガ","785":"カプ・コケコ","786":"カプ・テテフ","787":"カプ・ブルル","788":"カプ・レヒレ","789":"コスモッグ","790":"コスモウム","791":"ソルガレオ","792":"ルナアーラ","793":"ウツロイド","794":"マッシブーン","795":"フェローチェ","796":"デンジュモク","797":"テッカグヤ","798":"カミツルギ","799":"アクジキング","800":"ネクロズマ","801":"マギアナ","802":"マーシャドー","803":"ベベノム","804":"アーゴヨン","805":"ツンデツンデ","806":"ズガドーン","807":"ゼラオラ","808":"メルタン","809":"メルメタル","810":"サルノリ","811":"バチンキー","812":"ゴリランダー","813":"ヒバニー","814":"ラビフット","815":"エースバーン","816":"メッソン","817":"ジメレオン","818":"インテレオン","819":"ホシガリス","820":"ヨクバリス","821":"ココガラ","822":"アオガラス","823":"アーマーガア","824":"サッチムシ","825":"レドームシ","826":"イオルブ","827":"クスネ","828":"フォクスライ","829":"ヒメンカ","830":"ワタシラガ","831":"ウールー","832":"バイウールー","833":"カムカメ","834":"カジリガメ","835":"ワンパチ","836":"パルスワン","837":"タンドン","838":"トロッゴン","839":"セキタンザン","840":"カジッチュ","841":"アップリュー","842":"タルップル","843":"スナヘビ","844":"サダイジャ","845":"ウッウ","846":"サシカマス","847":"カマスジョー","848":"エレズン","849":"ストリンダー","850":"ヤクデ","851":"マルヤクデ","852":"タタッコ","853":"オトスパス","854":"ヤバチャ","855":"ポットデス","856":"ミブリム","857":"テブリム","858":"ブリムオン","859":"ベロバー","860":"ギモー","861":"オーロンゲ","862":"タチフサグマ","863":"ニャイキング","864":"サニゴーン","865":"ネギガナイト","866":"バリコオル","867":"デスバーン","868":"マホミル","869":"マホイップ","870":"タイレーツ","871":"バチンウニ","872":"ユキハミ","873":"モスノウ","874":"イシヘンジン","875":"コオリッポ","876":"イエッサン","877":"モルペコ","878":"ゾウドウ","879":"ダイオウドウ","880":"パッチラゴン","881":"パッチルドン","882":"ウオノラゴン","883":"ウオチルドン","884":"ジュラルドン","885":"ドラメシヤ","886":"ドロンチ","887":"ドラパルト","888":"ザシアン","889":"ザマゼンタ","890":"ムゲンダイナ","891":"ダクマ","892":"ウーラオス","893":"ザルード","894":"レジエレキ","895":"レジドラゴ","896":"ブリザポス","897":"レイスポス","898":"バドレックス","899":"アヤシシ","900":"バサギリ","901":"ガチグマ","902":"イダイトウ","903":"オオニューラ","904":"ハリーマン","905":"ラブトロス","906":"ニャオハ","907":"ニャローテ","908":"マスカーニャ","909":"ホゲータ","910":"アチゲータ","911":"ラウドボーン","912":"クワッス","913":"ウェルカモ","914":"ウェーニバル","915":"グルトン","916":"パフュートン","917":"タマンチュラ","918":"ワナイダー","919":"マメバッタ","920":"エクスレッグ","921":"パモ","922":"パモット","923":"パーモット","924":"ワッカネズミ","925":"イッカネズミ","926":"パピモッチ","927":"バウッツェル","928":"ミニーブ","929":"オリーニョ","930":"オリーヴァ","931":"イキリンコ","932":"コジオ","933":"ジオヅム","934":"キョジオーン","935":"カルボウ","936":"グレンアルマ","937":"ソウブレイズ","938":"ズピカ","939":"ハラバリー","940":"カイデン","941":"タイカイデン","942":"オラチフ","943":"マフィティフ","944":"シルシュルー","945":"タギングル","946":"アノクサ","947":"アノホラグサ","948":"ノノクラゲ","949":"リククラゲ","950":"ガケガニ","951":"カプサイジ","952":"スコヴィラン","953":"シガロコ","954":"ベラカス","955":"ヒラヒナ","956":"クエスパトラ","957":"カヌチャン","958":"ナカヌチャン","959":"デカヌチャン","960":"ウミディグダ","961":"ウミトリオ","962":"オトシドリ","963":"ナミイルカ","964":"イルカマン","965":"ブロロン","966":"ブロロローム","967":"モトトカゲ","968":"ミミズズ","969":"キラーメ","970":"キラフロル","971":"ボチ","972":"ハカドッグ","973":"カラミンゴ","974":"アルクジラ","975":"ハルクジラ","976":"ミガルーサ","977":"ヘイラッシャ","978":"シャリタツ","979":"コノヨザル","980":"ドオー","981":"リキキリン","982":"ノココッチ","983":"ドドゲザン","984":"イダイナキバ","985":"サケブシッポ","986":"アラブルタケ","987":"ハバタクカミ","988":"チヲハウハネ","989":"スナノケガワ","990":"テツノワダチ","991":"テツノツツミ","992":"テツノカイナ","993":"テツノコウベ","994":"テツノドクガ","995":"テツノイバラ","996":"セビエ","997":"セゴール","998":"セグレイブ","999":"コレクレー","1000":"サーフゴー","1001":"チオンジェン","1002":"パオジアン","1003":"ディンルー","1004":"イーユイ","1005":"トドロクツキ","1006":"テツノブジン","1007":"コライドン","1008":"ミライドン","1009":"ウネルミナモ","1010":"テツノイサハ","1011":"カミッチュ","1012":"チャデス","1013":"ヤバソチャ","1014":"イイネイヌ","1015":"マシマシラ","1016":"キチキギス","1017":"オーガポン","1018":"ブリジュラス","1019":"カミツオロチ","1020":"ウガツホムラ","1021":"タケルライコ","1022":"テツノイワオ","1023":"テツノカシラ","1024":"テラパゴス","1025":"モモワロウ"};
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

// ===========================================================================
// 道具(バッグ)の取り出し(v19)
//
// バッグは第6世代のブロック ID 1(MyItem)。(アイテム番号 u16, 個数 u16)が並ぶ。
// ポケットの位置は PKHeX の PlayerBag6XY / PlayerBag6AO と同じ。
// 破損セーブではブロックの中身が本来の位置からずれていることがある(実例: ORAS で -0xC7。4 の倍数ではない)。
// 本来の位置 ±0x200 バイトを 1 バイト刻みで調べ、「各ポケットに入れられるアイテム番号 + 妥当な個数」の
// 記録がいちばん多い位置を採用する。妥当な記録が 9 割未満なら「道具は見つからない」とする。
// 大切なもの(key)は位置合わせの判定にだけ使い、復元しない(空のセーブ側の内容をそのまま残す)。
// ===========================================================================
const BAG_LAYOUT={
  XY:{len:0xB88,pouches:[
    {key:'general',name:'道具',off:0x000,size:0x640,max:999,restore:true},
    {key:'key',name:'大切なもの',off:0x640,size:0x180,max:1,restore:false},
    {key:'machine',name:'技マシン',off:0x7C0,size:0x1A8,max:1,restore:true},
    {key:'medicine',name:'薬',off:0x968,size:0x100,max:999,restore:true},
    {key:'berry',name:'木の実',off:0xA68,size:0x120,max:999,restore:true}]},
  ORAS:{len:0xB90,pouches:[
    {key:'general',name:'道具',off:0x000,size:0x640,max:999,restore:true},
    {key:'key',name:'大切なもの',off:0x640,size:0x180,max:1,restore:false},
    {key:'machine',name:'技マシン',off:0x7C0,size:0x1B0,max:1,restore:true},
    {key:'medicine',name:'薬',off:0x970,size:0x100,max:999,restore:true},
    {key:'berry',name:'木の実',off:0xA70,size:0x120,max:999,restore:true}]}
};
const BAG_SEARCH_RANGE=0x200,BAG_MIN_VALID_RATIO=0.9,BAG_MIN_ENTRIES=3;
// 空のセーブ(サイト運営者が用意したもの)。ボックスが空の Checkpoint の main。
const ITEM_TEMPLATE={XY:'templates/main_xy',ORAS:'templates/main_oras'};
let bagSets=null;
function getBagSets(){
  if(bagSets)return bagSets;
  bagSets={};
  for(const g of Object.keys(PK_BAG_ITEMS)){bagSets[g]={};for(const k of Object.keys(PK_BAG_ITEMS[g]))bagSets[g][k]=new Set(PK_BAG_ITEMS[g][k])}
  return bagSets;
}
function parseBag(bytes,layout,sets){
  let valid=0,used=0;const pouches={};
  for(const pc of layout.pouches){
    const list=[];
    for(let o=pc.off;o+4<=pc.off+pc.size;o+=4){
      const id=bytes[o]|(bytes[o+1]<<8),cnt=bytes[o+2]|(bytes[o+3]<<8);
      if(id===0&&cnt===0)continue;
      used++;
      if(sets[pc.key].has(id)&&cnt>=1&&cnt<=pc.max){valid++;list.push([id,cnt])}
    }
    pouches[pc.key]=list;
  }
  return {valid,used,pouches};
}
function readBag(input,l6){
  if(!l6)return null;
  const layout=BAG_LAYOUT[l6.game],blk=l6.blocks[1];
  if(!layout||!blk||blk.len!==layout.len)return null;
  const sets=getBagSets()[l6.game],n=input.length,buf=new Uint8Array(layout.len);
  let best=null;
  for(let shift=-BAG_SEARCH_RANGE;shift<=BAG_SEARCH_RANGE;shift++){
    const start=l6.toFile(blk.orig+shift);
    if(!l6.rotated&&(start<0||start+layout.len>n))continue;
    for(let i=0;i<layout.len;i++)buf[i]=input[((start+i)%n+n)%n];
    const r=parseBag(buf,layout,sets);
    // 同点なら本来の位置(ずれ 0)に近いほうを採る(v23。正常なセーブで端のずらし幅を選んでいたため)
    if(!best||r.valid>best.valid||(r.valid===best.valid&&Math.abs(shift)<Math.abs(best.shift)))best={...r,shift};
  }
  if(!best||best.valid<BAG_MIN_ENTRIES||best.valid/best.used<BAG_MIN_VALID_RATIO)return null;
  const restore={};let total=0;
  for(const pc of layout.pouches)if(pc.restore){restore[pc.key]=best.pouches[pc.key];total+=best.pouches[pc.key].length}
  if(!total)return null;
  return {game:l6.game,shift:best.shift,pouches:restore,total};
}
// ---------------------------------------------------------------------------
// お金(v24)。ブロック ID 11(Misc)の +0x08 に u32 で入っている(PKHeX Misc6XY / Misc6AO と同じ)。
// バッグと同じく、破損セーブでは中身がずれていることがある(実例: ORAS で -0x1F。バッグとは別のずれ幅)。
// 本来の位置 ±0x200 を 1 バイト刻みで調べ、次の形に合う位置を採る(同点なら本来の位置に近いほう):
//   +0x00 u32 が 0 以外 / +0x04〜+0x07 が 0 / +0x08 お金 ≦ 9,999,999 / +0x0D〜+0x0F が 0 /
//   +0x10 から UTF-16 のライバル名(1〜12 文字、0x20 以上の文字のあとは 0 で埋まる)
// ---------------------------------------------------------------------------
const MONEY_MAX=9999999,MISC_LEN={XY:0x140,ORAS:0x130};
function looksLikeMisc(get){
  if((get(0)|get(1)|get(2)|get(3))===0)return false;
  for(const i of [4,5,6,7,0xD,0xE,0xF])if(get(i)!==0)return false;
  const money=(get(8)|(get(9)<<8)|(get(10)<<16)|(get(11)<<24))>>>0;
  if(money>MONEY_MAX)return false;
  let n=0,ended=false;
  for(let i=0;i<13;i++){
    const c=get(0x10+i*2)|(get(0x11+i*2)<<8);
    if(c===0){ended=true;continue}
    if(ended||c<0x20)return false;
    n++;
  }
  return n>=1?money:false;
}
function readMoney(input,l6){
  if(!l6)return null;
  const blk=l6.blocks[11];
  if(!blk||blk.len!==MISC_LEN[l6.game])return null;
  const n=input.length;let best=null;
  for(let shift=-BAG_SEARCH_RANGE;shift<=BAG_SEARCH_RANGE;shift++){
    const start=l6.toFile(blk.orig+shift);
    if(!l6.rotated&&(start<0||start+0x30>n))continue;
    const m=looksLikeMisc(i=>input[((start+i)%n+n)%n]);
    if(m===false)continue;
    if(!best||Math.abs(shift)<Math.abs(best.shift))best={money:m,shift};
  }
  return best?{game:l6.game,money:best.money,shift:best.shift}:null;
}
// ---------------------------------------------------------------------------
// 図鑑(v30)。ブロック ID 20(XY 0x6A0 / ORAS 0x11CC、PKHeX Zukan6)。
//   +0x08 捕まえた(0x60 バイト = 768 ビット、全国図鑑番号 - 1 のビット)/ +0x68 から 見た × 4(性別・色違い別、各 0x60)/ 以降はフォルム・言語・パッチール
// ブロックの CRC が一致すればそのまま使う。壊れていれば本来の位置 ±0x200 を 1 バイト刻みで調べ、次をすべて満たす位置を採る
// (ORAS の実例ではお金と同じ -0x1F):
//   ・722 番以降のビットが「捕まえた」「見た」とも 0
//   ・「捕まえた」の種はすべて、いずれかの「見た」にも入っている
//   ・救出できたボックス等の個体(タマゴ以外)の種の 9 割以上が「捕まえた」(種が 5 種以上あるときだけ判定。足りなければ壊れた図鑑は使わない)
// ---------------------------------------------------------------------------
const DEX_LEN={XY:0x6A0,ORAS:0x11CC},DEX_MAX=721,DEX_BITS=0x60;
function dexBit(b,off,i){return (b[off+(i>>3)]>>(i&7))&1}
function dexCheck(b,species){
  let caught=0;
  for(let i=0;i<DEX_BITS*8;i++){
    const c=dexBit(b,8,i);let seen=0;
    for(let k=0;k<4;k++)seen|=dexBit(b,0x68+k*DEX_BITS,i);
    if(i>=DEX_MAX){if(c||seen)return null;continue}
    if(c&&!seen)return null;
    caught+=c;
  }
  if(!caught)return null;
  let hit=0;for(const sp of species)if(dexBit(b,8,sp-1))hit++;
  return {caught,ratio:species.size?hit/species.size:0};
}
function readDex(input,l6,hits){
  if(!l6)return null;
  const blk=l6.blocks[20],len=DEX_LEN[l6.game];
  if(!blk||blk.len!==len)return null;
  const species=new Set();
  for(const h of hits){if(h.species>=1&&h.species<=DEX_MAX&&!((u32(h.data,0x74)>>>30)&1))species.add(h.species)}
  if(blk.status==='ok'){const b=readBlockBytes(input,l6,blk);const r=b&&dexCheck(b,new Set());return b?{bytes:b,shift:0,caught:r?r.caught:0}:null}
  if(species.size<5)return null;
  const n=input.length;let best=null;
  for(let shift=-BAG_SEARCH_RANGE;shift<=BAG_SEARCH_RANGE;shift++){
    const start=l6.toFile(blk.orig+shift);
    if(!l6.rotated&&(start<0||start+len>n))continue;
    const b=readRaw(input,start,len),r=dexCheck(b,species);
    if(!r||r.ratio<0.9)continue;
    if(!best||r.ratio>best.ratio||(r.ratio===best.ratio&&Math.abs(shift)<Math.abs(best.shift)))best={bytes:b,shift,caught:r.caught,ratio:r.ratio};
  }
  return best;
}
// ---------------------------------------------------------------------------
// トレーナー情報(v31)。ブロック ID 17(MyStatus、長さ 0x170、PKHeX MyStatus6)。
//   +0x00 TID u16 / +0x02 SID u16 / +0x04 ゲーム / +0x05 性別 / +0x48 トレーナー名(UTF-16LE、0x1A バイト = 12 文字 + 終端)
// CRC が一致すればそのまま使う。壊れていれば ±0x200 を探し、(TID, SID, 名前)が救出できた個体の親(+0x0C TID / +0x0E SID / +0xB0 親名)と
// 一致する位置を採る(一致する個体がいちばん多い位置、同数なら本来の位置に近いほう)。ORAS 破損例は -0x1F(お金・図鑑と同じ)。
// 見つからなければ null(画面では空のセーブの値を表示する)。
// ---------------------------------------------------------------------------
const STATUS_LEN=0x170,TRAINER_NAME_OFF=0x48,TRAINER_NAME_MAX=12;
function readTrainerAt(get){
  const tid=get(0)|(get(1)<<8),sid=get(2)|(get(3)<<8);
  let name='';
  for(let i=0;i<=TRAINER_NAME_MAX;i++){const c=get(TRAINER_NAME_OFF+i*2)|(get(TRAINER_NAME_OFF+i*2+1)<<8);if(c===0)break;if(i===TRAINER_NAME_MAX)return null;name+=String.fromCharCode(c)}
  // v33: アバター(見た目の性別 +0x05 / 通信で使うアバター +0x06・+0x07 / X・Y の着せ替え +0x30 から 16 バイト)
  const fashion=[];for(let i=0;i<16;i++)fashion.push(get(0x30+i));
  return {tid,sid,name,gender:get(5),sprite:[get(6),get(7)],fashion};
}
function readTrainer(input,l6,hits){
  if(!l6)return null;
  const blk=l6.blocks[17];
  if(!blk||blk.len!==STATUS_LEN)return null;
  const n=input.length;
  if(blk.status==='ok'){
    const start=l6.toFile(blk.orig),t=readTrainerAt(i=>input[((start+i)%n+n)%n]);
    return t&&isPlausibleName(t.name)?{...t,shift:0}:null;
  }
  const owners=new Map();
  for(const h of hits){const k=`${u16(h.data,0x0C)}/${u16(h.data,0x0E)}/${pkOTName(h.data)}`;owners.set(k,(owners.get(k)||0)+1)}
  let best=null;
  for(let shift=-BAG_SEARCH_RANGE;shift<=BAG_SEARCH_RANGE;shift++){
    const start=l6.toFile(blk.orig+shift);
    if(!l6.rotated&&(start<0||start+STATUS_LEN>n))continue;
    const t=readTrainerAt(i=>input[((start+i)%n+n)%n]);
    if(!t||!isPlausibleName(t.name))continue;
    const cnt=owners.get(`${t.tid}/${t.sid}/${t.name}`)||0;
    if(!cnt)continue;
    if(!best||cnt>best.count||(cnt===best.count&&Math.abs(shift)<Math.abs(best.shift)))best={...t,shift,count:cnt};
  }
  return best;
}
// ---------------------------------------------------------------------------
// アバター(v33)。トレーナー情報と同じブロック(ID 17)の 見た目の性別・通信で使うアバター・着せ替え(X・Y)と、
// X・Y の「持っている服・アクセサリー」(ブロック ID 7、長さ 0x1C0、PKHeX Fashion6XY。CRC 一致のときだけ)。
// トレーナー情報が読み取れたときだけ使う(同じブロックなので、ずれも同じ)。
// ---------------------------------------------------------------------------
const FASHION_BLOCK_LEN=0x1C0;
function readAvatar(input,l6,tr){
  if(!tr||!(tr.gender===0||tr.gender===1))return null;
  const xy=l6.game==='XY';
  let owned=null;
  const fb=xy?l6.blocks[7]:null;
  if(fb&&fb.len===FASHION_BLOCK_LEN&&fb.status==='ok')owned=readBlockBytes(input,l6,fb);
  // 通信で使うアバターの番号は X・Y 0〜35 / ORAS 0〜73(PKHeX TrainerSprite6)。ORAS は 2 バイトとも同じ値。合わなければ使わない
  const sp=tr.sprite,max=xy?35:73;
  const spriteOk=sp[0]<=max&&sp[1]<=max&&(xy||sp[0]===sp[1]);
  return {gender:tr.gender,sprite:spriteOk?sp:null,fashion:xy?tr.fashion:null,owned};
}
function bagSummaryText(bag){
  if(!bag)return '取り出せる道具はありませんでした。';
  const parts=BAG_LAYOUT[bag.game].pouches.filter(p=>p.restore).map(p=>`${p.name} ${bag.pouches[p.key].length}種`);
  return `取り出せる道具: ${parts.join('・')}(大切なものは対象外)`;
}
// ---------------------------------------------------------------------------
// 手持ち・バトルボックス・育て屋(v25)。ブロック ID と形式は PKHeX SaveBlockAccessor6XY / 6AO と同じ。
//   手持ち(ID 18): 0x104 バイト × 6。先頭 232 バイトが PK6、続く 28 バイトが戦闘用の値(0xE8 から EC を種にもう一度暗号化)。匹数は +0x618
//   バトルボックス(ID 13): PK6 232 バイト × 6
//   育て屋(ID 38): 1 か所 0x1F0 = 枠 240 バイト × 2(預け中 u32 / 預けてから得た EXP u32 / PK6 232)+ 0x1E0 タマゴあり + 0x1E8 乱数 u64
//                  XY は 1 か所、ORAS は 2 か所(0x3E0)
// スキャンで見つかった個体の位置が、これらの枠の位置にぴったり合うものだけを対象にする(ずれの補正はしない)。
// ---------------------------------------------------------------------------
const WALLPAPER_MAX=23;   // 第6世代の壁紙は 0〜23(通常 16 + 追加 8)
const BLK={BAG:1,MISC:11,BOXLAYOUT:12,BATTLE:13,PARTY:18,DAYCARE:38};
const PARTY_SIZE=0x104,PARTY_COUNT_OFF=0x618,DAYCARE_SLOT=240,DAYCARE_COUPLE=0x1F0;
function getSpecialLocation(q){
  const l6=window.__layout6;
  if(!l6)return null;
  const orig=l6.toOrig(q.offset),B=l6.blocks;
  const rel=id=>B[id]?orig-B[id].orig:-1;
  let r=rel(BLK.PARTY);
  if(r>=0&&r<PARTY_SIZE*6&&r%PARTY_SIZE===0)return {kind:'party',index:r/PARTY_SIZE,label:'手持ち'};
  r=rel(BLK.BATTLE);
  if(r>=0&&r<232*6&&r%232===0)return {kind:'battle',index:r/232,label:'バトルボックス'};
  r=rel(BLK.DAYCARE);
  if(r>=0&&B[BLK.DAYCARE]&&r<B[BLK.DAYCARE].len){
    const couple=Math.floor(r/DAYCARE_COUPLE),rr=r%DAYCARE_COUPLE;
    if(rr<DAYCARE_SLOT*2&&rr%DAYCARE_SLOT===8)return {kind:'daycare',couple,index:(rr-8)/DAYCARE_SLOT,label:'育て屋'};
  }
  return null;
}
function readRaw(input,off,len){
  const n=input.length,out=new Uint8Array(len);
  for(let i=0;i<len;i++)out[i]=input[((off+i)%n+n)%n];
  return out;
}
// 手持ちの戦闘用の値が使えるか。レベルが経験値から求めたものと同じで、HP・能力値が妥当なら使う。
function partyStatsValid(raw,q){
  const b=new Uint8Array(raw);crypt(b,0xE8,PARTY_SIZE,q.ec);   // 戦闘用の値は 0xE8 から EC で暗号化し直されている(PKHeX PokeCrypto)
  const lv=pkLevel(q.species,u32(q.data,0x10));
  if(lv===null||b[0xEC]!==lv)return false;
  const cur=u16(b,0xF0),max=u16(b,0xF2);
  if(max<1||cur>max)return false;
  for(let o=0xF4;o<=0xFC;o+=2){const v=u16(b,o);if(v<1||v>999)return false}
  return true;
}
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
    for(const q of selected){
      const sp=getSpecialLocation(q);
      if(sp){q.__sp=sp;continue}
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
  // 書き換えたブロックの CRC16 をフッターのブロック表に書く(マジックの 4 バイト後から 8 バイトずつ: 長さ u32, ID u16, CRC u16)
  for(const id of changed){
    const b=tl.blocks[id],crc=crc16ccitt(i=>out[b.orig+i],b.len),e=tl.footerFile+0x10+4+id*8;
    out[e+6]=crc&255;out[e+7]=crc>>8;
  }
  return {data:out,report};
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
function scan(input,gen,maxSpecies){
  const out=[];
  for(let i=0;i+232<=input.length;i+=2){
    const p=decryptPK(input.subarray(i,i+232));
    if(!p||p.species>maxSpecies)continue;
    out.push({offset:i,...p,gen});
  }
  return classifyHits(out);
}
function clearMsg(){statusEl.textContent='';statusEl.className='status hidden'}
function msg(t,err=false){statusEl.textContent=t;statusEl.className='status'+(err?' error':'')}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function getStorageLayout(game,gen){
  if(gen===6){const l6=window.__layout6;const base=l6?l6.pcBase:(game.startsWith('XY')?0x22600:0x33000);return {base,boxes:31,slots:31*30,size:232,exact:true};}
  return null;
}
function getLocation(q,game,gen){
  const layout=getStorageLayout(game,gen);
  if(!layout)return {box:null,slot:null,label:'位置不明'};
  const base=layout.base;
  if(base===null)return {box:null,slot:null,label:'位置不明'};
  // ブロック表でずれを検出していれば、本来のセーブ上の位置に直してから判定する
  const l6=gen===6?window.__layout6:null;
  const orig=l6?l6.toOrig(q.offset):q.offset;
  const rel=orig-base;
  const total=layout.slots*layout.size;
  if(rel<0||rel>=total){
    const b=blockAt(l6,orig);
    return {box:null,slot:null,label:b&&b.label?`${b.label}(PC外・bin には含まれません)`:'位置不明'};
  }
  const index=Math.floor(rel/layout.size);
  const box=Math.floor(index/30)+1,slot=(index%30)+1;
  const aligned=rel%layout.size===0;
  const estimated = !layout.exact;
  const suffix = aligned ? '' : '（位置ずれ候補）';
  const prefix = estimated ? '推定 ' : '';
  return {box,slot,aligned,estimated,label:`${prefix}ボックス${box}・${slot}番${suffix}`};
}
// ---------------------------------------------------------------------------
// v9: 利用者には「完全復元」(confidence === 'complete')の個体だけを表示する。
//
// 「一部破損」「低信頼候補」への振り分け(decryptPK の confidence)は今後のために残しているが、
// 画面には出さず、bin にも含めない。実データ 467 匹はすべて complete で、
// ランダムデータの誤検出はすべて low に入ることを確認済み(2026-10-14)。
// partial はチェックサム不一致のまま書き込まれ、ゲーム内で「ダメタマゴ」になりうる。
// 再び表示する場合は VISIBLE_CONFIDENCE に追加し、初期チェックと注意書きを検討すること。
// ---------------------------------------------------------------------------
const VISIBLE_CONFIDENCE=['complete'];
function visibleHits(hits){return (hits||[]).filter(h=>VISIBLE_CONFIDENCE.includes(h.confidence))}
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
  listEl.innerHTML=`
    <div class="view-tabs" role="tablist">
      <button type="button" class="view-tab" role="tab" aria-selected="false" data-view="pokemon">ポケモン</button>
      <button type="button" class="view-tab" role="tab" aria-selected="false" data-view="items">バッグ</button>
      <button type="button" class="view-tab" role="tab" aria-selected="false" data-view="trainer">トレーナー</button>
      <button type="button" class="view-tab" role="tab" aria-selected="false" data-view="dex">図鑑</button>
    </div>
    <div class="view-panel" data-view="pokemon">
      <div class="recovery-controls">
        <div class="selection-title"><strong>復元する個体を選択してください</strong><span id="selectionSummary" class="selection-count">選択中 0 匹</span></div>
        <div class="selection-actions">
          <button type="button" class="small-button" data-action="all">すべて選択</button>
          <button type="button" class="small-button" data-action="none">すべて解除</button>
        </div>
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
    <div class="view-panel" data-view="dex"><div class="dex-viewer"></div></div>`;
  setupListResizer(listEl.querySelector('.candidate-list'),listEl.querySelector('.list-resizer'));
  listEl.querySelectorAll('.candidate-check').forEach(cb=>cb.addEventListener('change',()=>{updateSelectionSummary();refreshBoxSelection()}));
  listEl.querySelectorAll('.small-button').forEach(btn=>btn.addEventListener('click',()=>{
    const action=btn.dataset.action;
    listEl.querySelectorAll('.candidate-check').forEach(cb=>{cb.checked=action==='all'});
    updateSelectionSummary();refreshBoxSelection();
  }));
  listEl.querySelectorAll('.view-tab').forEach(tab=>tab.addEventListener('click',()=>showView(tab.dataset.view)));
  listEl.querySelectorAll('.sub-tab').forEach(tab=>tab.addEventListener('click',()=>showSub(tab.dataset.sub)));
  boxState.pages=buildBoxPages(hits);
  boxState.current=firstBoxWithPokemon(boxState.pages);
  renderBoxViewer();
  renderPartyViewer();
  renderItemsViewer(listEl.querySelector('.items-viewer'));
  renderDexViewer(listEl.querySelector('.dex-viewer'));
  renderTrainerViewer(listEl.querySelector('.trainer-viewer'));
  renderPhotoViewer(listEl.querySelector('.photo-viewer'));
  updateSelectionSummary();
  showView('pokemon');showSub('box');   // v32: 読み込み直後はポケモンタブのボックス(ポケモンがいる一番若いボックス)
}
function showView(view){
  listEl.querySelectorAll('.view-tab').forEach(t=>{const on=t.dataset.view===view;t.classList.toggle('active',on);t.setAttribute('aria-selected',on?'true':'false')});
  listEl.querySelectorAll('.view-panel').forEach(p=>p.classList.toggle('active',p.dataset.view===view));
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
const POKEMON_ICON_DIR=null;

// ---------------------------------------------------------------------------
// ボックス名(v17)。第6世代の「ボックス名・壁紙」ブロック(長さ 0x440)の先頭に
// 31 個 × 0x22 バイト(UTF-16LE 17 文字、0 終端)で並ぶ。
// ブロックのチェックサムが一致するか、31 個すべてが名前として妥当な場合だけ使う。
// 壊れた文字列を名前として出さないため。使えなければ「ボックスN」。
// ---------------------------------------------------------------------------
function readBlockBytes(input,l6,block){
  const start=l6.toFile(block.orig),n=input.length,out=new Uint8Array(block.len);
  if(!l6.rotated&&(start<0||start+block.len>n))return null;
  for(let i=0;i<block.len;i++)out[i]=input[(start+i)%n];
  return out;
}
function isPlausibleName(s){
  if(s.length<1||s.length>16)return false;
  for(const ch of s){const c=ch.charCodeAt(0);if(c<0x20||c===0xFFFD||(c>=0xD800&&c<=0xDFFF))return false}
  return true;
}
function readBoxNames(input,l6){
  if(!l6)return null;
  const blk=l6.blocks.find(b=>b.len===0x440);
  if(!blk)return null;
  const b=readBlockBytes(input,l6,blk);
  if(!b)return null;
  const names=[];
  for(let i=0;i<31;i++){
    let s='',terminated=false;
    for(let k=0;k<17;k++){const c=u16(b,i*0x22+k*2);if(c===0){terminated=true;break}s+=String.fromCharCode(c)}
    names.push({s,terminated});
  }
  const ok=blk.status==='ok'||names.every(n=>n.terminated&&isPlausibleName(n.s));
  return ok?names.map(n=>n.s):null;
}
function boxName(i){
  const names=window.__boxNames;
  return names&&names[i]?names[i]:`ボックス${i+1}`;
}

// ---------------------------------------------------------------------------
// 写真(v17)。第6世代の写真ブロック(長さ 0xE058)の +0x54 から JPEG(3DS カメラ形式、400×240)。
// 終わりはブロック内の最後の EOI(FF D9)。ブラウザで画像として読めた場合だけ表示する。
// ---------------------------------------------------------------------------
function readPhoto(input,l6){
  if(!l6)return null;
  const blk=l6.blocks.find(b=>b.len===0xE058);
  if(!blk)return null;
  const b=readBlockBytes(input,l6,blk);
  if(!b||b[0x54]!==0xFF||b[0x55]!==0xD8||b[0x56]!==0xFF)return null;
  let end=-1;
  for(let i=b.length-2;i>0x56;i--)if(b[i]===0xFF&&b[i+1]===0xD9){end=i+2;break}
  return end>0?b.slice(0x54,end):null;
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
// ---------------------------------------------------------------------------
// 図鑑タブ(v31)。読み取れた図鑑の「見た」「捕まえた」を表示し、「図鑑を復元する」で main に入れるか選ぶ。
// ---------------------------------------------------------------------------
function dexStatus(b){
  const list=[];let seen=0,caught=0;
  for(let i=0;i<DEX_MAX;i++){
    const c=dexBit(b,8,i);let sn=0;for(let k=0;k<4;k++)sn|=dexBit(b,0x68+k*DEX_BITS,i);
    if(c)caught++;if(c||sn)seen++;
    if(c||sn)list.push({no:i+1,caught:!!c});
  }
  return {list,seen,caught};
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
    if(!window.__trainerMode)window.__trainerMode=tr?'restore':'none';
    const mode=window.__trainerMode;
    const base=tr||tpl||{name:'',tid:0,sid:0};
    if(!window.__trainerInput)window.__trainerInput={name:base.name,tid:base.tid,sid:base.sid};
    const v=mode==='restore'?tr:mode==='manual'?window.__trainerInput:(tpl||{name:'',tid:0,sid:0});
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
    const note=mode==='restore'?'セーブから読み取った値です。':mode==='manual'?'入力した値が main に入ります。':(tr?'救出用の空のセーブ(試験データ)の値です。':tpl?'セーブから読み取れなかったため、救出用の空のセーブ(試験データ)の値を表示しています。':'セーブから読み取れませんでした。');
    viewer.innerHTML=`<div class="trainer-modes">
        <label class="items-toggle${tr?'':' is-disabled'}"><input type="checkbox" class="trainer-mode" data-mode="restore"${mode==='restore'?' checked':''}${tr?'':' disabled'}><span>トレーナーの情報を復元する</span></label>
        <label class="items-toggle"><input type="checkbox" class="trainer-mode" data-mode="manual"${mode==='manual'?' checked':''}><span>自分で入力する</span></label>
      </div>
      <div class="trainer-form${mode==='manual'?'':' is-template'}">
        <label><span>トレーナー名</span><input type="text" class="trainer-name" maxlength="${TRAINER_NAME_MAX}" value="${escapeHtml(v.name)}"${ro}></label>
        <div class="trainer-ids">
          <label><span>ID</span><input type="text" class="trainer-tid" inputmode="numeric" maxlength="5" value="${id5(v.tid)}"${ro}></label>
          <label><span>裏ID</span><input type="text" class="trainer-sid" inputmode="numeric" maxlength="5" value="${id5(v.sid)}"${ro}></label>
        </div>
      </div>
      <p class="photo-note">${note}</p>
      <h3 class="photo-heading trainer-photo-heading">アバター</h3>
      <label class="items-toggle${av?'':' is-disabled'}"><input type="checkbox" class="include-avatar"${aon?' checked':''}${av?'':' disabled'}><span>アバター情報を復元する</span></label>
      <div class="avatar-info${aon?'':' is-template'}">${avRows}</div>
      <p class="photo-note">${av?(aon?'セーブから読み取ったアバターです。':'救出用の空のセーブ(試験データ)のアバターです。'):'セーブからアバターを読み取れませんでした(トレーナー情報が読み取れたときだけ復元できます)。'}${game==='XY'?' 服の名前は目安です(ゲーム内の正式名と違うことがあります)。':''}</p>`;
    viewer.querySelectorAll('.trainer-mode').forEach(cb=>cb.addEventListener('change',()=>{
      if(cb.checked){
        // 自分で入力に切り替えたら、そのとき表示していた値から書き換えを始める
        if(cb.dataset.mode==='manual'&&window.__trainerMode!=='manual'){const cur=window.__trainerMode==='restore'?tr:(tpl||base);window.__trainerInput={name:cur.name,tid:cur.tid,sid:cur.sid}}
        window.__trainerMode=cb.dataset.mode;
      }else window.__trainerMode='none';
      updateItemsButton();draw(tpl);
    }));
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
let BLANK_SLOT=null;
function blankSlotBytes(){
  if(BLANK_SLOT)return BLANK_SLOT;
  const b=new Uint8Array(232);crypt(b,8,232,0);BLANK_SLOT=b;return b;
}
function isEmptySlot(raw){
  if(raw.every(v=>v===0))return true;
  // v25: ゲームの空きスロットは EC=0・種族 0 のデータ(ニックネーム欄に「タマゴ」などが入っていることがある)
  if(u32(raw,0)===0){const d=new Uint8Array(raw.subarray(0,232));crypt(d,8,232,0);if(u16(d,8)===0)return true}
  const blank=blankSlotBytes();
  for(let i=0;i<232;i++)if(raw[i]!==blank[i])return false;
  return true;
}
function slotFileOffset(index){
  const gen=window.__gen,layout=getStorageLayout(window.__game,gen);
  if(!layout)return null;
  const l6=window.__layout6,orig=layout.base+index*232;
  return l6?l6.toFile(orig):orig;
}
function buildSlotMap(hits){
  const layout=getStorageLayout(window.__game,window.__gen);
  if(!layout)return null;
  const byOffset=new Map(hits.map(h=>[h.offset,h]));
  const input=window.__input,slots=[];
  for(let i=0;i<layout.slots;i++){
    const off=slotFileOffset(i);
    if(off===null||off<0||off>=input.length){slots.push({status:'missing'});continue}
    const hit=byOffset.get(off);
    if(hit){slots.push({status:'pokemon',hit});continue}
    let raw;
    if(off+232<=input.length)raw=input.subarray(off,off+232);
    else if(window.__layout6&&window.__layout6.rotated){   // ファイル末尾と先頭にまたがるスロット
      raw=new Uint8Array(232);raw.set(input.subarray(off));raw.set(input.subarray(0,232-(input.length-off)),input.length-off);
    }else{slots.push({status:'missing'});continue}
    slots.push({status:isEmptySlot(raw)?'empty':'damaged'});
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
  const six=(blk,size)=>blk?[0,1,2,3,4,5].map(i=>blk.orig+i*size):[];
  const eggs=readDaycareInfo();
  if(!window.__includeEgg||window.__includeEgg.length!==eggs.length)window.__includeEgg=eggs.map(()=>true);
  const dc=B[BLK.DAYCARE],couples=dc?Math.floor(dc.len/DAYCARE_COUPLE):0;
  const dcNames=couples>1?['117番道路','バトルリゾート']:[''];
  let daycare='';
  for(let c=0;c<couples;c++){
    const cells=[0,1].map(s=>renderSlotCell(slot(dc.orig+c*DAYCARE_COUPLE+s*DAYCARE_SLOT+8),s+1)).join('');
    const egg=eggs[c]&&eggs[c].egg
      ?`<button type="button" class="box-cell is-egg${window.__includeEgg[c]?' selected':''}" data-couple="${c}" aria-pressed="${window.__includeEgg[c]}" title="育て屋で見つかったタマゴ(受け取り前)"><span class="box-name">タマゴ</span><span class="box-check" aria-hidden="true">✓</span></button>`
      :`<div class="box-cell is-empty" aria-label="タマゴなし"></div>`;
    daycare+=`${dcNames[c]?`<div class="party-sub">${dcNames[c]}</div>`:''}<div class="party-grid daycare">${cells}${egg}</div>`;
  }
  viewer.innerHTML=`<div class="party-layout">
      <section class="party-col"><h4>手持ち</h4>${grid('two',six(B[BLK.PARTY],PARTY_SIZE))}</section>
      <section class="party-col"><h4>バトルボックス</h4>${grid('two',six(B[BLK.BATTLE],232))}</section>
      <section class="party-col"><h4>育て屋</h4>${daycare}</section>
    </div>
    <div class="box-legend"><span><i class="lg lg-on"><b>✓</b></i>復元する</span><span><i class="lg lg-off"></i>復元しない</span></div>
    <p class="box-help">マスをクリックすると、救出に含めるか切り替えられます。タマゴは、育て屋に「タマゴが見つかった」状態を引き継ぐかどうかです(預けている 2 匹も救出するときだけ引き継がれます)。</p>`;
  bindPokemonCells(viewer);
  viewer.querySelectorAll('.box-cell.is-egg').forEach(cell=>cell.addEventListener('click',()=>{
    const c=Number(cell.dataset.couple);window.__includeEgg[c]=!window.__includeEgg[c];
    cell.classList.toggle('selected',window.__includeEgg[c]);cell.setAttribute('aria-pressed',String(window.__includeEgg[c]));
  }));
}
function firstBoxWithPokemon(pages){
  if(!pages)return 0;
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
// 1 マス分の HTML(v29: ボックスと「手持ち等」タブで共通)
function renderSlotCell(s,slotNo){
  if(s.status==='pokemon'){
    const sm=pkSummary(s.hit);
    const tip=`${sm.name}${sm.gender?' '+sm.gender:''} ${sm.isEgg?'タマゴ':sm.level!==null?'Lv.'+sm.level:''} / 親名: ${sm.ot} / ${sm.ability} / ${sm.ball}`;
    const icon=POKEMON_ICON_DIR?`<img class="box-icon" src="${POKEMON_ICON_DIR}${s.hit.species}.png" alt="${escapeHtml(sm.name)}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'box-name',textContent:this.alt}))">`:`<span class="box-name">${escapeHtml(sm.name)}</span>`;
    const shinyIcon=sm.shiny?`<img class="box-shiny" src="${SHINY_ICON}" alt="色違い">`:'';
    const ballIcon=BALL_IMAGE_DIR&&sm.ballId>0?`<img class="box-ball" src="${BALL_IMAGE_DIR}${sm.ballId}.png" alt="">`:'';
    return `<button type="button" class="box-cell is-pokemon${isHitChecked(s.hit)?' selected':''}" data-offset="${s.hit.offset}" title="${escapeHtml(tip)}" aria-pressed="${isHitChecked(s.hit)}" aria-label="${slotNo}番 ${escapeHtml(tip)}">${shinyIcon}${icon}${ballIcon}<span class="box-check" aria-hidden="true">✓</span></button>`;
  }
  // v18: 破損・データなしのマスは利用者には見せず、空きと同じ表示にする(一覧表示と同じ方針)。判定(s.status)は buildSlotMap() に残している。
  return `<div class="box-cell is-empty" data-status="${s.status}" title="${slotNo}番" aria-label="${slotNo}番 空き"></div>`;
}
function bindPokemonCells(root){
  root.querySelectorAll('.box-cell.is-pokemon').forEach(cell=>cell.addEventListener('click',()=>{
    const cb=listEl.querySelector(`.candidate-check[data-offset="${cell.dataset.offset}"]`);
    if(!cb)return;
    cb.checked=!cb.checked;
    updateSelectionSummary();refreshBoxSelection();
  }));
}
function renderBoxViewer(){
  const viewer=listEl.querySelector('.box-viewer');
  if(!viewer)return;
  const pages=boxState.pages;
  if(!pages){viewer.innerHTML='<p class="box-empty-note">このセーブではボックスの位置を特定できないため、ボックス表示はできません。</p>';return}
  const boxes=pages.length,b=boxState.current,pg=pages[b];
  const opts=[];
  for(let i=0;i<boxes;i++){const c=boxCounts(pages[i]);opts.push(`<option value="${i}"${i===b?' selected':''}>${escapeHtml(pages[i].name)}${c.pokemon?`(${c.pokemon}匹)`:''}</option>`)}
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
    <div class="box-grid${POKEMON_ICON_DIR?' with-icons':''}">${cells.join('')}</div>
    <div class="box-actions">
      <button type="button" class="small-button" data-box-action="on"${c.pokemon?'':' disabled'}>このボックスを選択</button>
      <button type="button" class="small-button" data-box-action="off"${c.pokemon?'':' disabled'}>このボックスを選択解除</button>
    </div>
    <div class="box-legend"><span><i class="lg lg-on"><b>✓</b></i>復元する</span><span><i class="lg lg-off"></i>復元しない</span></div>
    <p class="box-help">マスをクリックすると、救出に含めるか切り替えられます。${outside>0?` ボックスと手持ち等以外の場所で見つかった ${outside} 匹は一覧にだけ表示されます(救出しても main には入りません)。`:''}</p>`;
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
// ---------------------------------------------------------------------------
// 一覧の 1 行: ボール / 名前 / 性別 / Lv. / 特性(v10)
// オフセット(PK6/PK7 共通、復号・並べ替え後):
//   0x10 経験値 u32 / 0x14 特性 / 0x1D bit1-2 性別(0=♂ 1=♀ 2=なし)
//   0x40 ニックネーム(UTF-16LE 12 文字) / 0x74 bit31 ニックネーム有無・bit30 タマゴ / 0xDC ボール
// レベルは保存されていないので、種族の経験値タイプ(PK_GROWTH)と PK_EXP から求める。
// ---------------------------------------------------------------------------
function pkLevel(species,exp){
  const g=Number(PK_GROWTH[species]);
  if(!Number.isInteger(g)||!PK_EXP[g])return null;
  const t=PK_EXP[g];
  if(exp>=t[99])return 100;
  let lv=1;while(lv<100&&exp>=t[lv])lv++;
  return lv;
}
function pkString(b,off,len){
  let s='';
  for(let i=0;i<len;i++){const c=u16(b,off+i*2);if(c===0)break;s+=String.fromCharCode(c)}
  return s;
}
function pkNickname(b){return pkString(b,0x40,12)}
// 親名(OT 名)。0xB0 から UTF-16LE 12 文字
function pkOTName(b){return pkString(b,0xB0,12)}
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
    rows.push(['チェックサム一致',`<b>${l6.okCount}</b> / ${l6.blocks.length} ブロック`]);
    for(const b of l6.blocks.filter(b=>b.label)){
      rows.push([b.label,b.status==='ok'?badge('正常','ok'):b.status==='missing'?badge('欠落','ng'):badge('破損','ng')]);
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
  result.classList.add('hidden');listEl.innerHTML='';msg('セーブデータを解析しています…');
  const devNote=document.querySelector('.dev-note');if(devNote)devNote.remove();   // v26: 別のファイルを選んだら開発用の表示を消す
  const input=new Uint8Array(await file.arrayBuffer());
  let [game,gen,maxSpecies]=detectGame(input.length);
  // サイズより先にブロック表で判定する(サイズが合っていても中身が別ゲーム・回転していることがある)
  const l6=findGen6Layout(input);window.__layout6=l6;
  if(l6){game=l6.game==='XY'?'XY / X・Y':'ORAS / オメガルビー・アルファサファイア';gen=6;maxSpecies=721}
  let scanGen=gen||6;
  // セーブ全体が回転して保存されている場合、ファイル末尾と先頭にまたがる 1 スロットがある。
  // 先頭 232 バイトを末尾に足した配列でスキャンし、その位置も調べる(v16)。
  // 足した部分から始まる候補(offset >= 元の長さ)は先頭の重複なので捨てる。
  const wrapScan=!!(l6&&l6.rotated&&((l6.shift%l6.saveSize)+l6.saveSize)%l6.saveSize!==0);
  const scanInput=wrapScan?(()=>{const a=new Uint8Array(input.length+232);a.set(input);a.set(input.subarray(0,232),input.length);return a})():input;
  let hits=scan(scanInput,scanGen,maxSpecies).filter(h=>h.offset<input.length);
  gameEl.textContent=game;   // v22: 「(ブロック表から判定)」と入力サイズの表示は削除
  window.__boxNames=readBoxNames(input,l6);
  window.__bag=readBag(input,l6);
  window.__money=readMoney(input,l6);
  window.__itemsGame=l6?l6.game:null;window.__includeItems=true;window.__includeMoney=true;window.__includeEgg=null;
  window.__input=input;window.__hits=[];
  updateItemsButton();
  window.__photo=readPhoto(input,l6);
  // 表示・出力の対象は完全復元のみ(振り分け結果は window.__allHits に残す)
  window.__allHits=hits;
  hits=visibleHits(hits);
  window.__dex=readDex(input,l6,hits);   // v30
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
function trainerValue(){   // v34: main に書くトレーナー情報(なければ null = 空のセーブのまま)
  const m=window.__trainerMode||(window.__trainer?'restore':'none');
  if(m==='restore'&&window.__trainer){const t=window.__trainer;return {name:t.name,tid:t.tid,sid:t.sid}}
  if(m==='manual'&&window.__trainerInput&&window.__trainerInput.name.length){const t=window.__trainerInput;return {name:t.name.slice(0,TRAINER_NAME_MAX),tid:t.tid,sid:t.sid}}
  return null;
}
function trainerIncluded(){return !!trainerValue()}
function avatarIncluded(){return window.__includeAvatar!==false&&!!window.__avatar}
function updateItemsButton(){   // 名前は v19 以来のまま。救出ボタンの有効・無効を更新する
  const any=!!listEl.querySelector('.candidate-check:checked')||(!!window.__itemsGame&&(itemsIncluded()||moneyIncluded()||dexIncluded()||trainerIncluded()||avatarIncluded()));
  download.disabled=!any;
}
function saveBlob(data,name){
  const url=URL.createObjectURL(new Blob([data],{type:'application/octet-stream'})),a=document.createElement('a');
  a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function downloadBoxdataBin(selected,reason){
  const {data,placed,unknown,conflicts}=makePCBinary(selected,window.__game,window.__gen);
  // 1 匹も配置できなかった bin は中身がすべて 0 になり、PKHeX で読み込めないため出力しない。
  if(placed===0){msg(`${reason}ボックスに入れられる個体が 0 匹のため、boxdata.bin も作成しませんでした。`,true);return}
  if(window.NERCounter)window.NERCounter.countRescue();
  saveBlob(data,'boxdata.bin');
  msg(`${reason}代わりに boxdata.bin(ボックスのポケモン ${placed} 匹)をダウンロードしました${unknown?`。ボックスの外にいる ${unknown} 匹は boxdata.bin には入りません`:''}${conflicts?`。重複位置 ${conflicts} 匹は未配置`:''}。PKHeX で同じゲームのセーブを開いてから読み込んでください。`);
}
download.addEventListener('click',async()=>{
  const selected=selectedHits(),game=window.__itemsGame,withItems=itemsIncluded(),withMoney=moneyIncluded();
  const withDex=dexIncluded(),withTrainer=trainerIncluded(),withAvatar=avatarIncluded();
  if(!selected.length&&!withItems&&!withMoney&&!withDex&&!withTrainer&&!withAvatar)return;
  download.disabled=true;
  try{
    if(!game)throw Object.assign(new Error('このセーブはゲームを判定できないため、main を作れません。'),{noTemplate:true});
    const bag=withItems?window.__bag:null,money=withMoney?window.__money:null,dex=withDex?window.__dex:null;
    const trainer=withTrainer?trainerValue():null,avatar=withAvatar?window.__avatar:null;
    const {data,report:r}=await buildRescueMain({game,bag,money,selected,input:window.__input,l6:window.__layout6,includeEgg:window.__includeEgg,dex,trainer,avatar});
    saveBlob(data,'main');
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
    if(trainer)parts.push(`トレーナー ${trainer.name}(ID ${String(trainer.tid).padStart(5,'0')})`);
    if(avatar)parts.push('アバター');
    let t=`main をダウンロードしました(${parts.join('・')})。PKHeX でこの main を開くと確認できます。`;
    if(r.partyToBox)t+=` 手持ちのうち ${r.partyToBox}匹は戦闘用のデータが壊れていたため、空いているボックスに入れました。`;
    if(r.skipped)t+=` ボックス・手持ち・バトルボックス・育て屋以外の場所で見つかった(または位置が重なる) ${r.skipped}匹は入れていません。`;
    msg(t);
  }catch(e){
    if(e.noTemplate&&selected.length){
      try{downloadBoxdataBin(selected,`${e.message} `)}catch(e2){msg('boxdata.bin の作成に失敗しました: '+e2.message,true)}
    }else msg('救出に失敗しました: '+e.message,true);
  }finally{updateItemsButton()}
});

// ---------------------------------------------------------------------------
// 開発中の自動読み込み(v26)。DEV_AUTOLOAD にファイルの場所を書くと、ページを開いた時点でそのセーブを読み込む。
// 完成品として公開するときは null にし、test/ フォルダも削除すること(試験用セーブが誰でもダウンロードできてしまうため)。
// URL に ?noautoload を付けると、一時的に自動読み込みしない。
// ---------------------------------------------------------------------------
const DEV_AUTOLOAD='test/main';
(async function devAutoload(){
  if(!DEV_AUTOLOAD||/[?&]noautoload\b/.test(location.search))return;
  try{
    const res=await fetch(DEV_AUTOLOAD,{cache:'no-store'});
    if(!res.ok)return;
    const file=new File([await res.arrayBuffer()],DEV_AUTOLOAD.split('/').pop());
    await analyze(file);
    const note=document.createElement('div');note.className='dev-note';
    note.textContent='開発用: 試験用セーブ('+DEV_AUTOLOAD+')を自動で読み込んでいます。';
    result.prepend(note);
  }catch(e){console.warn('自動読み込みに失敗しました',e)}
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
