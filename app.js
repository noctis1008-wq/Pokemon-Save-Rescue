// ===========================================================================
// NER Pokémon Recovery
//
// バージョンは連番。更新のたびに 1 つ増やす。
// 旧 ZIP の v1 … v5 の続きとして v6 から開始している。
// この値・配布 ZIP のファイル名・CHANGELOG.md、そして index.html / privacy.html の
// 各タグ末尾にある ?v= の 5 つを必ず一致させること。
// ?v= を上げ忘れると、ブラウザが古い JS / CSS を使い続けて更新が反映されない。
// ===========================================================================
const APP_VERSION = "16";
const APP_VERSION_DATE = "2026-10-14";

const fileInput=document.getElementById('file');const drop=document.getElementById('drop');const statusEl=document.getElementById('status');const result=document.getElementById('result');const gameEl=document.getElementById('game');const sizeEl=document.getElementById('size');const countEl=document.getElementById('count');const listEl=document.getElementById('list');const download=document.getElementById('download');
const SAVE={XY:0x65600,ORAS:0x76000,SM:0x6BE00,USUM:0x6CC00};
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
function detectGame(len){if(len===SAVE.XY)return ['XY / X・Y',6,721];if(len===SAVE.ORAS)return ['ORAS / オメガルビー・アルファサファイア',6,721];if(len===SAVE.SM)return ['SM / サン・ムーン',7,802];if(len===SAVE.USUM)return ['USUM / ウルトラサン・ウルトラムーン',7,807];if(len===0x100000)return ['3DSセーブ（1 MiB）: ゲーム特定不能',null,809];return ['サイズから特定できないセーブ',null,809]}
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
function msg(t,err=false){statusEl.textContent=t;statusEl.className='status'+(err?' error':'')}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function getStorageLayout(game,gen){
  if(gen===6){const l6=window.__layout6;const base=l6?l6.pcBase:(game.startsWith('XY')?0x22600:0x33000);return {base,boxes:31,slots:31*30,size:232,exact:true};}
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
  // 最大クラスタの最小オフセットを「ボックス1の1番」とみなす。
  // Gen7 の PC ブロックの絶対位置はセーブのブロックテーブルで決まるため、
  // ここで求まるのはあくまで相対的な並びであり、ボックス番号そのものは
  // 保証されない(ボックス1が空なら全体がずれる)。UI 側で「推定」と明示すること。
  return {base:aligned[0].offset,confidence:aligned.length>=2?'estimated':'weak'};
}
function getLocation(q,game,gen){
  const layout=getStorageLayout(game,gen);
  if(!layout)return {box:null,slot:null,label:'位置不明'};
  const base=layout.exact?layout.base:(window.__gen7Base??null);
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
  listEl.innerHTML=`
    <div class="recovery-controls">
      <div class="selection-title"><strong>復元する個体を選択</strong><span>チェックした個体だけが boxdata.bin に含まれます。</span></div>
      <div class="selection-actions">
        <button type="button" class="small-button" data-action="all">すべて選択</button>
        <button type="button" class="small-button" data-action="none">すべて解除</button>
      </div>
    </div>
    <div class="view-tabs" role="tablist">
      <button type="button" class="view-tab active" role="tab" aria-selected="true" data-view="list">一覧表示</button>
      <button type="button" class="view-tab" role="tab" aria-selected="false" data-view="box">ボックス表示</button>
    </div>
    <div class="view-panel active" data-view="list">
      <div class="candidate-list${BALL_IMAGE_DIR?' ball-images':''}">${renderHeader()}${hits.map(p=>renderCandidate(p)).join('')}</div>
      <div class="list-resizer" role="separator" aria-orientation="horizontal" aria-label="一覧の縦幅を変更(ドラッグ、または上下キー)" tabindex="0"><span></span></div>
    </div>
    <div class="view-panel" data-view="box"><div class="box-viewer"></div></div>`;
  setupListResizer(listEl.querySelector('.candidate-list'),listEl.querySelector('.list-resizer'));
  listEl.querySelectorAll('.candidate-check').forEach(cb=>cb.addEventListener('change',()=>{updateSelectionSummary();refreshBoxSelection()}));
  listEl.querySelectorAll('.small-button').forEach(btn=>btn.addEventListener('click',()=>{
    const action=btn.dataset.action;
    listEl.querySelectorAll('.candidate-check').forEach(cb=>{cb.checked=action==='all'});
    updateSelectionSummary();refreshBoxSelection();
  }));
  listEl.querySelectorAll('.view-tab').forEach(tab=>tab.addEventListener('click',()=>showView(tab.dataset.view)));
  boxState.slots=buildSlotMap(hits);
  boxState.current=firstBoxWithPokemon(boxState.slots);
  renderBoxViewer();
  updateSelectionSummary();
}
function showView(view){
  listEl.querySelectorAll('.view-tab').forEach(t=>{const on=t.dataset.view===view;t.classList.toggle('active',on);t.setAttribute('aria-selected',on?'true':'false')});
  listEl.querySelectorAll('.view-panel').forEach(p=>p.classList.toggle('active',p.dataset.view===view));
  if(view==='box')refreshBoxSelection();
}

// ---------------------------------------------------------------------------
// ボックス表示(v16)。PKHeX のように 1 ボックス = 6 列 × 5 段で表示する。
// 各スロットを「個体(完全復元)」「空き」「破損(読めないデータ)」に分ける。
//   空き = 232 バイトがすべて 0、または EC=0 の空データを暗号化したもの(ゲームが書く空きスロット)
// 位置は一覧と同じ getLocation() の考え方(第6世代はブロック表のずれ補正、第7世代は推定)。
// マスをクリックすると、一覧のチェックと連動して救出に含める/外すを切り替える。
// ポケモンのアイコン画像は同梱していない(ゲームのキャラクター画像は権利者の著作物のため)。
// POKEMON_ICON_DIR に権利上問題のない画像を置いたディレクトリを指定すると <dir><全国図鑑番号>.png を表示し、
// null(既定)または読めない場合はポケモン名を表示する。
// ---------------------------------------------------------------------------
const POKEMON_ICON_DIR=null;
const boxState={slots:null,current:0};
let BLANK_SLOT=null;
function blankSlotBytes(){
  if(BLANK_SLOT)return BLANK_SLOT;
  const b=new Uint8Array(232);crypt(b,8,232,0);BLANK_SLOT=b;return b;
}
function isEmptySlot(raw){
  if(raw.every(v=>v===0))return true;
  const blank=blankSlotBytes();
  for(let i=0;i<232;i++)if(raw[i]!==blank[i])return false;
  return true;
}
function slotFileOffset(index){
  const gen=window.__gen,layout=getStorageLayout(window.__game,gen);
  if(!layout)return null;
  if(gen===6){
    const l6=window.__layout6,orig=layout.base+index*232;
    return l6?l6.toFile(orig):orig;
  }
  const base=window.__gen7Base;
  return base==null?null:base+index*232;
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
function firstBoxWithPokemon(slots){
  if(!slots)return 0;
  const i=slots.findIndex(s=>s.status==='pokemon');
  return i<0?0:Math.floor(i/30);
}
function boxCounts(slots,box){
  const c={pokemon:0,empty:0,damaged:0,missing:0};
  for(let i=box*30;i<box*30+30;i++)c[slots[i].status]++;
  return c;
}
function isHitChecked(hit){
  const cb=listEl.querySelector(`.candidate-check[data-offset="${hit.offset}"]`);
  return cb?cb.checked:false;
}
function renderBoxViewer(){
  const viewer=listEl.querySelector('.box-viewer');
  if(!viewer)return;
  const slots=boxState.slots;
  if(!slots){viewer.innerHTML='<p class="box-empty-note">このセーブではボックスの位置を特定できないため、ボックス表示はできません。</p>';return}
  const boxes=slots.length/30,b=boxState.current;
  const opts=[];
  for(let i=0;i<boxes;i++){const c=boxCounts(slots,i);opts.push(`<option value="${i}"${i===b?' selected':''}>ボックス${i+1}${c.pokemon?`(${c.pokemon}匹)`:''}</option>`)}
  const cells=[];
  for(let i=b*30;i<b*30+30;i++){
    const s=slots[i],slotNo=i-b*30+1;
    if(s.status==='pokemon'){
      const sm=pkSummary(s.hit);
      const tip=`${sm.name}${sm.gender?' '+sm.gender:''} ${sm.isEgg?'タマゴ':sm.level!==null?'Lv.'+sm.level:''} / 親名: ${sm.ot} / ${sm.ability} / ${sm.ball}`;
      const icon=POKEMON_ICON_DIR?`<img class="box-icon" src="${POKEMON_ICON_DIR}${s.hit.species}.png" alt="${escapeHtml(sm.name)}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'box-name',textContent:this.alt}))">`:`<span class="box-name">${escapeHtml(sm.name)}</span>`;
      const shinyIcon=sm.shiny?`<img class="box-shiny" src="${SHINY_ICON}" alt="色違い">`:'';
      const ballIcon=BALL_IMAGE_DIR&&sm.ballId>0?`<img class="box-ball" src="${BALL_IMAGE_DIR}${sm.ballId}.png" alt="">`:'';
      cells.push(`<button type="button" class="box-cell is-pokemon${isHitChecked(s.hit)?' selected':''}" data-offset="${s.hit.offset}" title="${escapeHtml(tip)}" aria-pressed="${isHitChecked(s.hit)}" aria-label="${slotNo}番 ${escapeHtml(tip)}">${shinyIcon}${icon}${ballIcon}<span class="box-check" aria-hidden="true">✓</span></button>`);
    }else{
      const label={empty:'空き',damaged:'破損',missing:'データなし'}[s.status];
      cells.push(`<div class="box-cell is-${s.status}" title="${slotNo}番: ${label}" aria-label="${slotNo}番 ${label}">${s.status==='damaged'?'<span class="box-damaged">破損</span>':''}</div>`);
    }
  }
  const c=boxCounts(slots,b);
  const outside=(window.__hits||[]).length-slots.filter(s=>s.status==='pokemon').length;
  viewer.innerHTML=`
    <div class="box-nav">
      <button type="button" class="box-prev small-button" aria-label="前のボックス">◀</button>
      <select class="box-select" aria-label="ボックスを選ぶ">${opts.join('')}</select>
      <button type="button" class="box-next small-button" aria-label="次のボックス">▶</button>
    </div>
    <div class="box-grid${POKEMON_ICON_DIR?' with-icons':''}">${cells.join('')}</div>
    <div class="box-legend"><span><i class="lg is-pokemon"></i>救出できる個体 ${c.pokemon}</span><span><i class="lg is-empty"></i>空き ${c.empty}</span><span><i class="lg is-damaged"></i>破損 ${c.damaged}</span>${c.missing?`<span><i class="lg is-missing"></i>データなし ${c.missing}</span>`:''}</div>
    <p class="box-help">マスをクリックすると、救出に含める/外すを切り替えられます(チェックの付いたマスが救出対象)。${outside>0?` PC ボックス外で見つかった ${outside} 匹は一覧表示にだけ表示されます。`:''}${window.__gen===7?' 第7世代のボックス番号は推定です。':''}</p>`;
  const go=d=>{boxState.current=(b+d+boxes)%boxes;renderBoxViewer()};
  viewer.querySelector('.box-prev').addEventListener('click',()=>go(-1));
  viewer.querySelector('.box-next').addEventListener('click',()=>go(1));
  viewer.querySelector('.box-select').addEventListener('change',e=>{boxState.current=Number(e.target.value);renderBoxViewer()});
  viewer.querySelectorAll('.box-cell.is-pokemon').forEach(cell=>cell.addEventListener('click',()=>{
    const cb=listEl.querySelector(`.candidate-check[data-offset="${cell.dataset.offset}"]`);
    if(!cb)return;
    cb.checked=!cb.checked;
    updateSelectionSummary();refreshBoxSelection();
  }));
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
    gender:gender===0?'♂':gender===1?'♀':'',
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
    `<span class="pk-gender ${genderCls}">${s.gender}</span>`+
    `<span class="pk-level">${s.isEgg?'タマゴ':s.level!==null?'Lv.'+s.level:''}</span>`+
    `<span class="pk-ot" title="${escapeHtml(s.ot)}">${escapeHtml(s.ot)}</span>`+
    `<span class="pk-ability">${escapeHtml(s.ability)}</span></label>`;
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
// 第7世代は PC ボックスの絶対位置がセーブのブロックテーブルで決まるため、
// 検出結果からの推定になる。ボックス1が空だと全体がずれるので必ず明示する。
function showPositionNotice(gen){
  const old=document.getElementById('positionNotice');
  if(old)old.remove();
  if(gen!==7)return;
  const box=document.createElement('div');
  box.id='positionNotice';
  box.className='position-notice';
  box.innerHTML='<strong>第7世代のボックス位置は推定値です。</strong>'+
    'サン・ムーン系はPCボックスの位置がセーブ内のブロック表で決まるため、'+
    '検出された個体の並びから逆算しています。ボックス1の先頭が空だったり壊れていたりすると、'+
    'ボックス番号が全体的にずれます。PKHeXで取り込んだあと、配置を必ず確認してください。';
  const list=document.getElementById('list');
  list.parentNode.insertBefore(box,list);
}
// セーブ構造の診断。ブロック表が見つかれば、ゲーム・ずれ・ブロックごとの生存状況を出す。
function showStructureReport(l6,size,hits){
  const old=document.getElementById('structureReport');if(old)old.remove();
  const box=document.createElement('div');box.id='structureReport';box.className='structure-report';
  if(!l6){
    box.innerHTML='<strong>セーブ構造の診断</strong>第6世代のブロック表(セーブ末尾の管理情報)は見つかりませんでした。'+
      'ゲームの判定はファイルサイズによる推定です。';
  }else{
    const gameName=l6.game==='XY'?'X・Y':'オメガルビー・アルファサファイア';
    const lines=[];
    lines.push(`ブロック表から <b>${gameName}</b> のセーブと判定しました。`);
    if(size!==l6.saveSize)lines.push(`ファイルサイズ(${hex(size)})が ${gameName} の本来のサイズ(${hex(l6.saveSize)})と一致しません。`);
    if(l6.shift!==0)lines.push(`セーブ全体が本来の位置から <b>${hex(((l6.shift%l6.saveSize)+l6.saveSize)%l6.saveSize)}</b> バイトずれて保存されています。ボックス位置はこのずれを補正して判定しています。`);
    lines.push(`チェックサムが一致したブロック: <b>${l6.okCount} / ${l6.blocks.length}</b>`);
    const key=l6.blocks.filter(b=>b.label).map(b=>`<li>${b.label}: ${b.status==='ok'?'正常':b.status==='missing'?'ファイル外(欠落)':'破損'}</li>`).join('');
    const pcHits=hits.filter(h=>{const r=l6.toOrig(h.offset)-l6.pcBase;return r>=0&&r<31*30*232&&r%232===0}).length;
    let tail='';
    if(!hits.length)tail='<p>どのブロックにもポケモンの個体データは残っていません。このファイルからの救出はできません。'+
      'セーブを保存していた SD カードなどに書き込まずに全体を吸い出し、そのイメージを読み込ませると、元のデータが見つかる可能性があります。</p>';
    else tail=`<p>検出 ${hits.length} 匹のうち、PCボックス内の位置に一致したのは ${pcHits} 匹です。</p>`;
    box.innerHTML=`<strong>セーブ構造の診断</strong><p>${lines.join('<br>')}</p><ul>${key}</ul>${tail}`;
  }
  const list=document.getElementById('list');list.parentNode.insertBefore(box,list);
}
async function analyze(file){
  result.classList.add('hidden');listEl.innerHTML='';msg('セーブデータを解析しています…');
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
  if(!hits.length&&gen===null){const h6=scan(input,6,721),h7=scan(input,7,807);hits=h7.length>h6.length?h7:h6;scanGen=hits.length?hits[0].gen:6}
  if(scanGen===7){const inf=inferGen7Base(visibleHits(hits));window.__gen7Base=inf?inf.base:null}
  gameEl.textContent=game+(l6?'(ブロック表から判定)':gen===null&&hits.length?'(内部構造から推定)':'');
  sizeEl.textContent=input.length.toLocaleString()+' bytes';
  // 表示・出力の対象は完全復元のみ(振り分け結果は window.__allHits に残す)
  window.__allHits=hits;
  hits=visibleHits(hits);
  showStructureReport(l6,input.length,hits);
  if(!hits.length){countEl.textContent='0 匹';listEl.innerHTML='';result.classList.remove('hidden');msg('完全な状態で残っているポケモンは見つかりませんでした。下の「セーブ構造の診断」を参照してください。',true);document.getElementById('download').disabled=true;return}
  window.__hits=hits;window.__inputName=file.name;window.__inputSize=input.length;window.__game=game;window.__gen=scanGen;window.__input=input;
  document.getElementById('selectionSummary').textContent=`選択中 ${hits.length} 匹`;
  renderList(hits);
  showPositionNotice(scanGen);
  msg(`${hits.length} 匹のポケモンが完全な状態で見つかりました。救出する個体をチェックボックスで選択してください。`);
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
download.addEventListener('click',()=>{
  const checks=[...listEl.querySelectorAll('.candidate-check')],selected=[];
  for(const cb of checks)if(cb.checked){const q=(window.__hits||[]).find(h=>h.offset===Number(cb.dataset.offset)&&String(h.ec)===cb.dataset.ec);if(q)selected.push(q)}
  if(!selected.length)return;
  try{
    const {data,placed,unknown,conflicts}=makePCBinary(selected,window.__game,window.__gen);
    // 1 匹も配置できなかった bin は中身がすべて 0 になる。PKHeX は全 0 / 全 FF のファイルを
    // 「データなし」とみなして「サポートされていないファイルの種類/サイズ」エラーを出すため、出力しない。
    if(placed===0){msg(`ボックス位置に配置できる個体が 0 匹のため、boxdata.bin を作成しませんでした(選択 ${selected.length} 匹はすべて PC ボックス外、または位置不明です)。空の bin は PKHeX で読み込めません。`,true);return}
    const blob=new Blob([data],{type:'application/octet-stream'});
    if(window.NERCounter)window.NERCounter.countRescue();
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='boxdata.bin';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    msg(`boxdata.bin をダウンロードしました。選択 ${selected.length} 匹中 ${placed} 匹を元のボックス位置に配置しました${unknown?`。位置を特定できない ${unknown} 匹は安全のため未配置`:''}${conflicts?`。重複位置 ${conflicts} 匹は未配置`:''}。`);
  }catch(e){msg('boxdata.bin の作成に失敗しました: '+e.message,true)}
});

// フッターにバージョンを表示する。公開中のサイトがどの版か確認できるようにするため。
(function showVersion(){
  const footer=document.querySelector("footer");
  if(!footer)return;
  const span=document.createElement("span");
  span.className="app-version";
  span.textContent=" · v"+APP_VERSION+" ("+APP_VERSION_DATE+")";
  footer.appendChild(span);
})();
