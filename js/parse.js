// ===========================================================================
// NER Pokémon Recovery — parse.js
// セーブの中身(道具・お金・図鑑・ふしぎなおくりもの・トレーナー・手持ち・写真など)の読み取り。
// core.js の後に読み込む。
// ===========================================================================
   // v19: 第7世代は対象外にした
const SPECIES={"1":"フシギダネ","2":"フシギソウ","3":"フシギバナ","4":"ヒトカゲ","5":"リザード","6":"リザードン","7":"ゼニガメ","8":"カメール","9":"カメックス","10":"キャタピー","11":"トランセル","12":"バタフリー","13":"ビードル","14":"コクーン","15":"スピアー","16":"ポッポ","17":"ピジョン","18":"ピジョット","19":"コラッタ","20":"ラッタ","21":"オニスズメ","22":"オニドリル","23":"アーボ","24":"アーボック","25":"ピカチュウ","26":"ライチュウ","27":"サンド","28":"サンドパン","29":"ニドラン♀","30":"ニドリーナ","31":"ニドクイン","32":"ニドラン♂","33":"ニドリーノ","34":"ニドキング","35":"ピッピ","36":"ピクシー","37":"ロコン","38":"キュウコン","39":"プリン","40":"プクリン","41":"ズバット","42":"ゴルバット","43":"ナゾノクサ","44":"クサイハナ","45":"ラフレシア","46":"パラス","47":"パラセクト","48":"コンパン","49":"モルフォン","50":"ディグダ","51":"ダグトリオ","52":"ニャース","53":"ペルシアン","54":"コダック","55":"ゴルダック","56":"マンキー","57":"オコリザル","58":"ガーディ","59":"ウインディ","60":"ニョロモ","61":"ニョロゾ","62":"ニョロボン","63":"ケーシィ","64":"ユンゲラー","65":"フーディン","66":"ワンリキー","67":"ゴーリキー","68":"カイリキー","69":"マダツボミ","70":"ウツドン","71":"ウツボット","72":"メノクラゲ","73":"ドククラゲ","74":"イシツブテ","75":"ゴローン","76":"ゴローニャ","77":"ポニータ","78":"ギャロップ","79":"ヤドン","80":"ヤドラン","81":"コイル","82":"レアコイル","83":"カモネギ","84":"ドードー","85":"ドードリオ","86":"パウワウ","87":"ジュゴン","88":"ベトベター","89":"ベトベトン","90":"シェルダー","91":"パルシェン","92":"ゴース","93":"ゴースト","94":"ゲンガー","95":"イワーク","96":"スリープ","97":"スリーパー","98":"クラブ","99":"キングラー","100":"ビリリダマ","101":"マルマイン","102":"タマタマ","103":"ナッシー","104":"カラカラ","105":"ガラガラ","106":"サワムラー","107":"エビワラー","108":"ベロリンガ","109":"ドガース","110":"マタドガス","111":"サイホーン","112":"サイドン","113":"ラッキー","114":"モンジャラ","115":"ガルーラ","116":"タッツー","117":"シードラ","118":"トサキント","119":"アズマオウ","120":"ヒトデマン","121":"スターミー","122":"バリヤード","123":"ストライク","124":"ルージュラ","125":"エレブー","126":"ブーバー","127":"カイロス","128":"ケンタロス","129":"コイキング","130":"ギャラドス","131":"ラプラス","132":"メタモン","133":"イーブイ","134":"シャワーズ","135":"サンダース","136":"ブースター","137":"ポリゴン","138":"オムナイト","139":"オムスター","140":"カブト","141":"カブトプス","142":"プテラ","143":"カビゴン","144":"フリーザー","145":"サンダー","146":"ファイヤー","147":"ミニリュウ","148":"ハクリュー","149":"カイリュー","150":"ミュウツー","151":"ミュウ","152":"チコリータ","153":"ベイリーフ","154":"メガニウム","155":"ヒノアラシ","156":"マグマラシ","157":"バクフーン","158":"ワニノコ","159":"アリゲイツ","160":"オーダイル","161":"オタチ","162":"オオタチ","163":"ホーホー","164":"ヨルノズク","165":"レディバ","166":"レディアン","167":"イトマル","168":"アリアドス","169":"クロバット","170":"チョンチー","171":"ランターン","172":"ピチュー","173":"ピィ","174":"ププリン","175":"トゲピー","176":"トゲチック","177":"ネイティ","178":"ネイティオ","179":"メリープ","180":"モココ","181":"デンリュウ","182":"キレイハナ","183":"マリル","184":"マリルリ","185":"ウソッキー","186":"ニョロトノ","187":"ハネッコ","188":"ポポッコ","189":"ワタッコ","190":"エイパム","191":"ヒマナッツ","192":"キマワリ","193":"ヤンヤンマ","194":"ウパー","195":"ヌオー","196":"エーフィ","197":"ブラッキー","198":"ヤミカラス","199":"ヤドキング","200":"ムウマ","201":"アンノーン","202":"ソーナンス","203":"キリンリキ","204":"クヌギダマ","205":"フォレトス","206":"ノコッチ","207":"グライガー","208":"ハガネール","209":"ブルー","210":"グランブル","211":"ハリーセン","212":"ハッサム","213":"ツボツボ","214":"ヘラクロス","215":"ニューラ","216":"ヒメグマ","217":"リングマ","218":"マグマッグ","219":"マグカルゴ","220":"ウリムー","221":"イノムー","222":"サニーゴ","223":"テッポウオ","224":"オクタン","225":"デリバード","226":"マンタイン","227":"エアームド","228":"デルビル","229":"ヘルガー","230":"キングドラ","231":"ゴマゾウ","232":"ドンファン","233":"ポリゴン２","234":"オドシシ","235":"ドーブル","236":"バルキー","237":"カポエラー","238":"ムチュール","239":"エレキッド","240":"ブビィ","241":"ミルタンク","242":"ハピナス","243":"ライコウ","244":"エンテイ","245":"スイクン","246":"ヨーギラス","247":"サナギラス","248":"バンギラス","249":"ルギア","250":"ホウオウ","251":"セレビィ","252":"キモリ","253":"ジュプトル","254":"ジュカイン","255":"アチャモ","256":"ワカシャモ","257":"バシャーモ","258":"ミズゴロウ","259":"ヌマクロー","260":"ラグラージ","261":"ポチエナ","262":"グラエナ","263":"ジグザグマ","264":"マッスグマ","265":"ケムッソ","266":"カラサリス","267":"アゲハント","268":"マユルド","269":"ドクケイル","270":"ハスボー","271":"ハスブレロ","272":"ルンパッパ","273":"タネボー","274":"コノハナ","275":"ダーテング","276":"スバメ","277":"オオスバメ","278":"キャモメ","279":"ペリッパー","280":"ラルトス","281":"キルリア","282":"サーナイト","283":"アメタマ","284":"アメモース","285":"キノココ","286":"キノガッサ","287":"ナマケロ","288":"ヤルキモノ","289":"ケッキング","290":"ツチニン","291":"テッカニン","292":"ヌケニン","293":"ゴニョニョ","294":"ドゴーム","295":"バクオング","296":"マクノシタ","297":"ハリテヤマ","298":"ルリリ","299":"ノズパス","300":"エネコ","301":"エネコロロ","302":"ヤミラミ","303":"クチート","304":"ココドラ","305":"コドラ","306":"ボスゴドラ","307":"アサナン","308":"チャーレム","309":"ラクライ","310":"ライボルト","311":"プラスル","312":"マイナン","313":"バルビート","314":"イルミーゼ","315":"ロゼリア","316":"ゴクリン","317":"マルノーム","318":"キバニア","319":"サメハダー","320":"ホエルコ","321":"ホエルオー","322":"ドンメル","323":"バクーダ","324":"コータス","325":"バネブー","326":"ブーピッグ","327":"パッチール","328":"ナックラー","329":"ビブラーバ","330":"フライゴン","331":"サボネア","332":"ノクタス","333":"チルット","334":"チルタリス","335":"ザングース","336":"ハブネーク","337":"ルナトーン","338":"ソルロック","339":"ドジョッチ","340":"ナマズン","341":"ヘイガニ","342":"シザリガー","343":"ヤジロン","344":"ネンドール","345":"リリーラ","346":"ユレイドル","347":"アノプス","348":"アーマルド","349":"ヒンバス","350":"ミロカロス","351":"ポワルン","352":"カクレオン","353":"カゲボウズ","354":"ジュペッタ","355":"ヨマワル","356":"サマヨール","357":"トロピウス","358":"チリーン","359":"アブソル","360":"ソーナノ","361":"ユキワラシ","362":"オニゴーリ","363":"タマザラシ","364":"トドグラー","365":"トドゼルガ","366":"パールル","367":"ハンテール","368":"サクラビス","369":"ジーランス","370":"ラブカス","371":"タツベイ","372":"コモルー","373":"ボーマンダ","374":"ダンバル","375":"メタング","376":"メタグロス","377":"レジロック","378":"レジアイス","379":"レジスチル","380":"ラティアス","381":"ラティオス","382":"カイオーガ","383":"グラードン","384":"レックウザ","385":"ジラーチ","386":"デオキシス","387":"ナエトル","388":"ハヤシガメ","389":"ドダイトス","390":"ヒコザル","391":"モウカザル","392":"ゴウカザル","393":"ポッチャマ","394":"ポッタイシ","395":"エンペルト","396":"ムックル","397":"ムクバード","398":"ムクホーク","399":"ビッパ","400":"ビーダル","401":"コロボーシ","402":"コロトック","403":"コリンク","404":"ルクシオ","405":"レントラー","406":"スボミー","407":"ロズレイド","408":"ズガイドス","409":"ラムパルド","410":"タテトプス","411":"トリデプス","412":"ミノムッチ","413":"ミノマダム","414":"ガーメイル","415":"ミツハニー","416":"ビークイン","417":"パチリス","418":"ブイゼル","419":"フローゼル","420":"チェリンボ","421":"チェリム","422":"カラナクシ","423":"トリトドン","424":"エテボース","425":"フワンテ","426":"フワライド","427":"ミミロル","428":"ミミロップ","429":"ムウマージ","430":"ドンカラス","431":"ニャルマー","432":"ブニャット","433":"リーシャン","434":"スカンプー","435":"スカタンク","436":"ドーミラー","437":"ドータクン","438":"ウソハチ","439":"マネネ","440":"ピンプク","441":"ペラップ","442":"ミカルゲ","443":"フカマル","444":"ガバイト","445":"ガブリアス","446":"ゴンベ","447":"リオル","448":"ルカリオ","449":"ヒポポタス","450":"カバルドン","451":"スコルピ","452":"ドラピオン","453":"グレッグル","454":"ドクロッグ","455":"マスキッパ","456":"ケイコウオ","457":"ネオラント","458":"タマンタ","459":"ユキカブリ","460":"ユキノオー","461":"マニューラ","462":"ジバコイル","463":"ベロベルト","464":"ドサイドン","465":"モジャンボ","466":"エレキブル","467":"ブーバーン","468":"トゲキッス","469":"メガヤンマ","470":"リーフィア","471":"グレイシア","472":"グライオン","473":"マンムー","474":"ポリゴンＺ","475":"エルレイド","476":"ダイノーズ","477":"ヨノワール","478":"ユキメノコ","479":"ロトム","480":"ユクシー","481":"エムリット","482":"アグノム","483":"ディアルガ","484":"パルキア","485":"ヒードラン","486":"レジギガス","487":"ギラティナ","488":"クレセリア","489":"フィオネ","490":"マナフィ","491":"ダークライ","492":"シェイミ","493":"アルセウス","494":"ビクティニ","495":"ツタージャ","496":"ジャノビー","497":"ジャローダ","498":"ポカブ","499":"チャオブー","500":"エンブオー","501":"ミジュマル","502":"フタチマル","503":"ダイケンキ","504":"ミネズミ","505":"ミルホッグ","506":"ヨーテリー","507":"ハーデリア","508":"ムーランド","509":"チョロネコ","510":"レパルダス","511":"ヤナップ","512":"ヤナッキー","513":"バオップ","514":"バオッキー","515":"ヒヤップ","516":"ヒヤッキー","517":"ムンナ","518":"ムシャーナ","519":"マメパト","520":"ハトーボー","521":"ケンホロウ","522":"シママ","523":"ゼブライカ","524":"ダンゴロ","525":"ガントル","526":"ギガイアス","527":"コロモリ","528":"ココロモリ","529":"モグリュー","530":"ドリュウズ","531":"タブンネ","532":"ドッコラー","533":"ドテッコツ","534":"ローブシン","535":"オタマロ","536":"ガマガル","537":"ガマゲロゲ","538":"ナゲキ","539":"ダゲキ","540":"クルミル","541":"クルマユ","542":"ハハコモリ","543":"フシデ","544":"ホイーガ","545":"ペンドラー","546":"モンメン","547":"エルフーン","548":"チュリネ","549":"ドレディア","550":"バスラオ","551":"メグロコ","552":"ワルビル","553":"ワルビアル","554":"ダルマッカ","555":"ヒヒダルマ","556":"マラカッチ","557":"イシズマイ","558":"イワパレス","559":"ズルッグ","560":"ズルズキン","561":"シンボラー","562":"デスマス","563":"デスカーン","564":"プロトーガ","565":"アバゴーラ","566":"アーケン","567":"アーケオス","568":"ヤブクロン","569":"ダストダス","570":"ゾロア","571":"ゾロアーク","572":"チラーミィ","573":"チラチーノ","574":"ゴチム","575":"ゴチミル","576":"ゴチルゼル","577":"ユニラン","578":"ダブラン","579":"ランクルス","580":"コアルヒー","581":"スワンナ","582":"バニプッチ","583":"バニリッチ","584":"バイバニラ","585":"シキジカ","586":"メブキジカ","587":"エモンガ","588":"カブルモ","589":"シュバルゴ","590":"タマゲタケ","591":"モロバレル","592":"プルリル","593":"ブルンゲル","594":"ママンボウ","595":"バチュル","596":"デンチュラ","597":"テッシード","598":"ナットレイ","599":"ギアル","600":"ギギアル","601":"ギギギアル","602":"シビシラス","603":"シビビール","604":"シビルドン","605":"リグレー","606":"オーベム","607":"ヒトモシ","608":"ランプラー","609":"シャンデラ","610":"キバゴ","611":"オノンド","612":"オノノクス","613":"クマシュン","614":"ツンベアー","615":"フリージオ","616":"チョボマキ","617":"アギルダー","618":"マッギョ","619":"コジョフー","620":"コジョンド","621":"クリムガン","622":"ゴビット","623":"ゴルーグ","624":"コマタナ","625":"キリキザン","626":"バッフロン","627":"ワシボン","628":"ウォーグル","629":"バルチャイ","630":"バルジーナ","631":"クイタラン","632":"アイアント","633":"モノズ","634":"ジヘッド","635":"サザンドラ","636":"メラルバ","637":"ウルガモス","638":"コバルオン","639":"テラキオン","640":"ビリジオン","641":"トルネロス","642":"ボルトロス","643":"レシラム","644":"ゼクロム","645":"ランドロス","646":"キュレム","647":"ケルディオ","648":"メロエッタ","649":"ゲノセクト","650":"ハリマロン","651":"ハリボーグ","652":"ブリガロン","653":"フォッコ","654":"テールナー","655":"マフォクシー","656":"ケロマツ","657":"ゲコガシラ","658":"ゲッコウガ","659":"ホルビー","660":"ホルード","661":"ヤヤコマ","662":"ヒノヤコマ","663":"ファイアロー","664":"コフキムシ","665":"コフーライ","666":"ビビヨン","667":"シシコ","668":"カエンジシ","669":"フラベベ","670":"フラエッテ","671":"フラージェス","672":"メェークル","673":"ゴーゴート","674":"ヤンチャム","675":"ゴロンダ","676":"トリミアン","677":"ニャスパー","678":"ニャオニクス","679":"ヒトツキ","680":"ニダンギル","681":"ギルガルド","682":"シュシュプ","683":"フレフワン","684":"ペロッパフ","685":"ペロリーム","686":"マーイーカ","687":"カラマネロ","688":"カメテテ","689":"ガメノデス","690":"クズモー","691":"ドラミドロ","692":"ウデッポウ","693":"ブロスター","694":"エリキテル","695":"エレザード","696":"チゴラス","697":"ガチゴラス","698":"アマルス","699":"アマルルガ","700":"ニンフィア","701":"ルチャブル","702":"デデンネ","703":"メレシー","704":"ヌメラ","705":"ヌメイル","706":"ヌメルゴン","707":"クレッフィ","708":"ボクレー","709":"オーロット","710":"バケッチャ","711":"パンプジン","712":"カチコール","713":"クレベース","714":"オンバット","715":"オンバーン","716":"ゼルネアス","717":"イベルタル","718":"ジガルデ","719":"ディアンシー","720":"フーパ","721":"ボルケニオン","722":"モクロー","723":"フクスロー","724":"ジュナイパー","725":"ニャビー","726":"ニャヒート","727":"ガオガエン","728":"アシマリ","729":"オシャマリ","730":"アシレーヌ","731":"ツツケラ","732":"ケララッパ","733":"ドデカバシ","734":"ヤングース","735":"デカグース","736":"アゴジムシ","737":"デンヂムシ","738":"クワガノン","739":"マケンカニ","740":"ケケンカニ","741":"オドリドリ","742":"アブリー","743":"アブリボン","744":"イワンコ","745":"ルガルガン","746":"ヨワシ","747":"ヒドイデ","748":"ドヒドイデ","749":"ドロバンコ","750":"バンバドロ","751":"シズクモ","752":"オニシズクモ","753":"カリキリ","754":"ラランテス","755":"ネマシュ","756":"マシェード","757":"ヤトウモリ","758":"エンニュート","759":"ヌイコグマ","760":"キテルグマ","761":"アマカジ","762":"アママイコ","763":"アマージョ","764":"キュワワー","765":"ヤレユータン","766":"ナゲツケサル","767":"コソクムシ","768":"グソクムシャ","769":"スナバァ","770":"シロデスナ","771":"ナマコブシ","772":"タイプ：ヌル","773":"シルヴァディ","774":"メテノ","775":"ネッコアラ","776":"バクガメス","777":"トゲデマル","778":"ミミッキュ","779":"ハギギシリ","780":"ジジーロン","781":"ダダリン","782":"ジャラコ","783":"ジャランゴ","784":"ジャラランガ","785":"カプ・コケコ","786":"カプ・テテフ","787":"カプ・ブルル","788":"カプ・レヒレ","789":"コスモッグ","790":"コスモウム","791":"ソルガレオ","792":"ルナアーラ","793":"ウツロイド","794":"マッシブーン","795":"フェローチェ","796":"デンジュモク","797":"テッカグヤ","798":"カミツルギ","799":"アクジキング","800":"ネクロズマ","801":"マギアナ","802":"マーシャドー","803":"ベベノム","804":"アーゴヨン","805":"ツンデツンデ","806":"ズガドーン","807":"ゼラオラ","808":"メルタン","809":"メルメタル","810":"サルノリ","811":"バチンキー","812":"ゴリランダー","813":"ヒバニー","814":"ラビフット","815":"エースバーン","816":"メッソン","817":"ジメレオン","818":"インテレオン","819":"ホシガリス","820":"ヨクバリス","821":"ココガラ","822":"アオガラス","823":"アーマーガア","824":"サッチムシ","825":"レドームシ","826":"イオルブ","827":"クスネ","828":"フォクスライ","829":"ヒメンカ","830":"ワタシラガ","831":"ウールー","832":"バイウールー","833":"カムカメ","834":"カジリガメ","835":"ワンパチ","836":"パルスワン","837":"タンドン","838":"トロッゴン","839":"セキタンザン","840":"カジッチュ","841":"アップリュー","842":"タルップル","843":"スナヘビ","844":"サダイジャ","845":"ウッウ","846":"サシカマス","847":"カマスジョー","848":"エレズン","849":"ストリンダー","850":"ヤクデ","851":"マルヤクデ","852":"タタッコ","853":"オトスパス","854":"ヤバチャ","855":"ポットデス","856":"ミブリム","857":"テブリム","858":"ブリムオン","859":"ベロバー","860":"ギモー","861":"オーロンゲ","862":"タチフサグマ","863":"ニャイキング","864":"サニゴーン","865":"ネギガナイト","866":"バリコオル","867":"デスバーン","868":"マホミル","869":"マホイップ","870":"タイレーツ","871":"バチンウニ","872":"ユキハミ","873":"モスノウ","874":"イシヘンジン","875":"コオリッポ","876":"イエッサン","877":"モルペコ","878":"ゾウドウ","879":"ダイオウドウ","880":"パッチラゴン","881":"パッチルドン","882":"ウオノラゴン","883":"ウオチルドン","884":"ジュラルドン","885":"ドラメシヤ","886":"ドロンチ","887":"ドラパルト","888":"ザシアン","889":"ザマゼンタ","890":"ムゲンダイナ","891":"ダクマ","892":"ウーラオス","893":"ザルード","894":"レジエレキ","895":"レジドラゴ","896":"ブリザポス","897":"レイスポス","898":"バドレックス","899":"アヤシシ","900":"バサギリ","901":"ガチグマ","902":"イダイトウ","903":"オオニューラ","904":"ハリーマン","905":"ラブトロス","906":"ニャオハ","907":"ニャローテ","908":"マスカーニャ","909":"ホゲータ","910":"アチゲータ","911":"ラウドボーン","912":"クワッス","913":"ウェルカモ","914":"ウェーニバル","915":"グルトン","916":"パフュートン","917":"タマンチュラ","918":"ワナイダー","919":"マメバッタ","920":"エクスレッグ","921":"パモ","922":"パモット","923":"パーモット","924":"ワッカネズミ","925":"イッカネズミ","926":"パピモッチ","927":"バウッツェル","928":"ミニーブ","929":"オリーニョ","930":"オリーヴァ","931":"イキリンコ","932":"コジオ","933":"ジオヅム","934":"キョジオーン","935":"カルボウ","936":"グレンアルマ","937":"ソウブレイズ","938":"ズピカ","939":"ハラバリー","940":"カイデン","941":"タイカイデン","942":"オラチフ","943":"マフィティフ","944":"シルシュルー","945":"タギングル","946":"アノクサ","947":"アノホラグサ","948":"ノノクラゲ","949":"リククラゲ","950":"ガケガニ","951":"カプサイジ","952":"スコヴィラン","953":"シガロコ","954":"ベラカス","955":"ヒラヒナ","956":"クエスパトラ","957":"カヌチャン","958":"ナカヌチャン","959":"デカヌチャン","960":"ウミディグダ","961":"ウミトリオ","962":"オトシドリ","963":"ナミイルカ","964":"イルカマン","965":"ブロロン","966":"ブロロローム","967":"モトトカゲ","968":"ミミズズ","969":"キラーメ","970":"キラフロル","971":"ボチ","972":"ハカドッグ","973":"カラミンゴ","974":"アルクジラ","975":"ハルクジラ","976":"ミガルーサ","977":"ヘイラッシャ","978":"シャリタツ","979":"コノヨザル","980":"ドオー","981":"リキキリン","982":"ノココッチ","983":"ドドゲザン","984":"イダイナキバ","985":"サケブシッポ","986":"アラブルタケ","987":"ハバタクカミ","988":"チヲハウハネ","989":"スナノケガワ","990":"テツノワダチ","991":"テツノツツミ","992":"テツノカイナ","993":"テツノコウベ","994":"テツノドクガ","995":"テツノイバラ","996":"セビエ","997":"セゴール","998":"セグレイブ","999":"コレクレー","1000":"サーフゴー","1001":"チオンジェン","1002":"パオジアン","1003":"ディンルー","1004":"イーユイ","1005":"トドロクツキ","1006":"テツノブジン","1007":"コライドン","1008":"ミライドン","1009":"ウネルミナモ","1010":"テツノイサハ","1011":"カミッチュ","1012":"チャデス","1013":"ヤバソチャ","1014":"イイネイヌ","1015":"マシマシラ","1016":"キチキギス","1017":"オーガポン","1018":"ブリジュラス","1019":"カミツオロチ","1020":"ウガツホムラ","1021":"タケルライコ","1022":"テツノイワオ","1023":"テツノカシラ","1024":"テラパゴス","1025":"モモワロウ"};
// v59: ダウンロードする main を読み直して、中身を確かめる
function verifyMain(out){
  try{
    const l6=findGen6Layout(out);if(!l6)return null;
    relocateBlocks(out,l6);
    const at=b=>b.at??b.orig,B=l6.blocks;
    const cnt=(base,n,step)=>{let c=0;for(let i=0;i<n;i++){const p=decryptPK(out.subarray(base+i*step,base+i*step+232));if(p&&p.checksumValid)c++}return c};
    const pc=B.find(b=>b.len===0x34AD0);
    const r={ok:l6.okCount,total:B.length,box:pc?cnt(at(pc),pc.len/232,232):0};
    if(B[BLK.PARTY])r.party=out[at(B[BLK.PARTY])+0x618]||0;
    if(B[BLK.BATTLE])r.battle=cnt(at(B[BLK.BATTLE]),6,232);
    const bag=readBag(out,l6);r.items=bag?bag.total:0;
    return r;
  }catch(e){console.warn('verify',e);return null}
}
function verifyText(v){
  if(!v)return ' 確認: 作った main を読み直せませんでした。';
  const parts=[`ボックス ${v.box}匹`];if(v.party)parts.push(`手持ち ${v.party}匹`);if(v.battle)parts.push(`バトルボックス ${v.battle}匹`);if(v.items)parts.push(`道具 ${v.items}種`);
  return ` ✅ 確認: 作った main を読み直しました(セーブの部分 ${v.ok}/${v.total} のチェックサムが一致・${parts.join('・')})。`;
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
  if(blk.status==='ok'){   // v38: CRC で確かめた位置があればそこを使う
    const r=parseBag(readBlockBytes(input,l6,blk),layout,sets);
    if(r.used===0||r.valid/r.used>=BAG_MIN_VALID_RATIO)best={...r,shift:blk.moved||0};
  }
  if(!best)
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
  // v35: ブロックの CRC が一致していれば、そのまま +0x08 を読む(ライバル名が空のセーブでも読めるように)
  if(blk.status==='ok'){
    const bb=readBlockBytes(input,l6,blk);
    const m=(bb[8]|(bb[9]<<8)|(bb[10]<<16)|(bb[11]<<24))>>>0;
    if(m<=MONEY_MAX)return {game:l6.game,money:m,shift:blk.moved||0};
  }
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
// ---------------------------------------------------------------------------
// v69: ふしぎなおくりもの(ブロック 41、長さ 0x1A90)。先頭 0x100 バイトが「受け取った」しるし(カード番号ごとに 1 ビット)、
// 0x100 から 0x108 バイトのカード(WC6)が 24 枚。カードの中身は PKHeX の WC6 と同じ並び:
//   +0 カード番号 / +2 タイトル(36 文字) / +0x4C 日付(年*10000+月*100+日) / +0x51 種類(0 ポケモン, 1 道具, 2 パワー)
//   +0x52 bit1 = 配達員から受け取り済み / 道具: +0x68 道具, +0x70 個数 / ポケモン: +0x82 種類, +0xD0 レベル, +0xD1 タマゴ, +0xB6 親の名前
// ブロックが無事ならブロックごと写す。壊れていれば、ファイル全体からカードらしいもの(番号・日付・タイトル・中身が妥当)を探す。
// ---------------------------------------------------------------------------
const GIFT_BLOCK_ID=41,GIFT_LEN=0x1A90,GIFT_CARD=0x108,GIFT_SLOTS=24,GIFT_FLAG_BYTES=0x100;
function parseGiftCard(c){
  const id=u16(c,0);if(id<1||id>2048)return null;
  const type=c[0x51];if(type>2)return null;
  const raw=u32(c,0x4C),y=Math.floor(raw/10000),m=Math.floor(raw%10000/100),d=raw%100;
  if(y<2013||y>2035||m<1||m>12||d<1||d>31)return null;
  let title='',term=false;
  for(let i=0;i<37;i++){const ch=u16(c,2+i*2);if(ch===0){term=true;break}if(ch<0x20||(ch>=0x7F&&ch<0xA0)||(ch>=0xD800&&ch<0xE000)||ch===0xFFFF)return null;title+=String.fromCharCode(ch)}
  if(!term||!title.trim())return null;
  const g={id,type,title,date:{y,m,d},used:(c[0x52]>>1)>0,raw:c.slice(0,GIFT_CARD)};
  if(type===0){
    g.species=u16(c,0x82);g.level=c[0xD0];g.egg=c[0xD1]===1;g.ot=pkString(c,0xB6,13);g.form=c[0x84];
    if(g.species<1||g.species>721||(!g.egg&&(g.level<1||g.level>100)))return null;
  }else if(type===1){
    g.item=u16(c,0x68);g.qty=u16(c,0x70);
    if(g.item<1||g.item>775||g.qty>999)return null;
  }
  return g;
}
function readGifts(input,l6){
  if(!l6)return null;
  const blk=l6.blocks[GIFT_BLOCK_ID];
  if(blk&&blk.len===GIFT_LEN&&blk.status==='ok'){
    const b=readBlockBytes(input,l6,blk);
    if(b){
      const cards=[];for(let i=0;i<GIFT_SLOTS;i++){const g=parseGiftCard(b.subarray(GIFT_FLAG_BYTES+i*GIFT_CARD,GIFT_FLAG_BYTES+(i+1)*GIFT_CARD));if(g)cards.push(g)}
      let flags=0;for(let i=0;i<GIFT_FLAG_BYTES;i++)flags+=popcount8(b[i]);
      return {ok:true,bytes:b,cards,flags};
    }
  }
  // 壊れているとき: ファイル全体からカードを探す(同じ中身は 1 枚に)
  const cards=[],seen=new Set(),n=input.length;
  for(let i=0;i+GIFT_CARD<=n;i++){
    const t=input[i+0x51];if(t>2)continue;
    const raw=input[i+0x4C]|(input[i+0x4D]<<8)|(input[i+0x4E]<<16)|(input[i+0x4F]<<24);if(raw<20130101||raw>20351231)continue;
    const g=parseGiftCard(input.subarray(i,i+GIFT_CARD));if(!g)continue;
    let k='';for(let j=0;j<GIFT_CARD;j++)k+=String.fromCharCode(g.raw[j]);
    if(seen.has(k))continue;seen.add(k);cards.push(g);i+=GIFT_CARD-1;
    if(cards.length>=GIFT_SLOTS)break;
  }
  return {ok:false,bytes:null,cards,flags:0};
}
function giftDate(g){return `${g.date.y}/${String(g.date.m).padStart(2,'0')}/${String(g.date.d).padStart(2,'0')}`}
function readDex(input,l6,hits){
  if(!l6)return null;
  const blk=l6.blocks[20],len=DEX_LEN[l6.game];
  if(!blk||blk.len!==len)return null;
  const species=new Set();
  for(const h of hits){if(h.species>=1&&h.species<=DEX_MAX&&!((u32(h.data,0x74)>>>30)&1))species.add(h.species)}
  if(blk.status==='ok'){const b=readBlockBytes(input,l6,blk);const r=b&&dexCheck(b,new Set());return b?{bytes:b,shift:blk.moved||0,caught:r?r.caught:0}:null}
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
    const bb=readBlockBytes(input,l6,blk),t=readTrainerAt(i=>bb[i]);
    return t&&isPlausibleName(t.name)?{...t,shift:blk.moved||0}:null;
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
  const rel=id=>B[id]?orig-(B[id].at??B[id].orig):-1;   // v38: 位置合わせ済みの開始位置
  let r=rel(BLK.PARTY);
  if(r>=0&&r<PARTY_SIZE*6&&r%PARTY_SIZE===0)return {kind:'party',index:r/PARTY_SIZE,label:'手持ち'};
  r=rel(BLK.BATTLE);
  if(r>=0&&r<232*6&&r%232===0)return {kind:'battle',index:r/232,label:'バトルボックス'};
  r=rel(BLK.DAYCARE);
  if(r>=0&&B[BLK.DAYCARE]&&r<B[BLK.DAYCARE].len){
    const couple=Math.floor(r/DAYCARE_COUPLE),rr=r%DAYCARE_COUPLE;
    if(rr<DAYCARE_SLOT*2&&rr%DAYCARE_SLOT===8){
      // v41: 預け中でない枠(引き取り済みの個体データが残っているだけ)は育て屋として扱わない
      const st=(B[BLK.DAYCARE].at??B[BLK.DAYCARE].orig)+couple*DAYCARE_COUPLE+(rr-8);
      if(l6.lin&&B[BLK.DAYCARE].status==='ok'&&l6.lin[st]!==1)return null;
      return {kind:'daycare',couple,index:(rr-8)/DAYCARE_SLOT,label:'育て屋'};
    }
  }
  return null;
}
// v38: 手持ち・バトルボックス・育て屋の枠を、位置合わせしたブロックから直接読んで個体に加える。
// 全体スキャンは 2 バイト刻みなので、奇数バイトずれたブロック(実例 -0x1F)の個体は見つからないため。
function addSpecialHits(input,l6,hits){
  if(!l6||!l6.lin)return hits;
  const have=new Set(hits.map(h=>h.offset)),B=l6.blocks,add=[];
  const tryAt=o=>{
    const f=l6.toFile(o);
    if(have.has(f))return;
    const p=decryptPK(l6.lin.subarray(o,o+232));
    if(!p||p.species>721||p.confidence!=='complete')return;
    add.push({offset:f,...p,gen:6});have.add(f);
  };
  const st=(id,cnt,size,base=0)=>{const b=B[id];if(!b||b.status!=='ok')return;for(let i=0;i<cnt;i++)tryAt(b.at+base+i*size)};
  st(BLK.PARTY,6,PARTY_SIZE);st(BLK.BATTLE,6,232);
  const dc=B[BLK.DAYCARE];
  // 育て屋は「預け中」(枠の先頭 u32 = 1)の枠だけ。引き取ったあとの個体データが枠に残っていることがあるため(v41)
  if(dc&&dc.status==='ok')for(let c=0;c*DAYCARE_COUPLE<dc.len;c++)for(let s=0;s<2;s++){const base=dc.at+c*DAYCARE_COUPLE+s*DAYCARE_SLOT;if(l6.lin[base]===1)tryAt(base+8)}
  if(!add.length)return hits;
  return classifyHits(hits.concat(add));
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
  // v38: 位置合わせで見つかったずれ(実例 -0x1F)の分だけずれて入っている個体も、元のマスに当てはめる
  let index=Math.floor(rel/layout.size),aligned=rel%layout.size===0;
  if(!aligned)for(const sh of pcShifts()){const r=rel-sh;if(r>=0&&r<total&&r%layout.size===0){index=r/layout.size;aligned=true;break}}
  const box=Math.floor(index/30)+1,slot=(index%30)+1;
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

// ---------------------------------------------------------------------------
// ボックス名(v17)。第6世代の「ボックス名・壁紙」ブロック(長さ 0x440)の先頭に
// 31 個 × 0x22 バイト(UTF-16LE 17 文字、0 終端)で並ぶ。
// ブロックのチェックサムが一致するか、31 個すべてが名前として妥当な場合だけ使う。
// 壊れた文字列を名前として出さないため。使えなければ「ボックスN」。
// ---------------------------------------------------------------------------
function readBlockBytes(input,l6,block){
  if(l6.lin&&block.at!==undefined)return l6.lin.slice(block.at,block.at+block.len);   // v38: 位置合わせ済み
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
// v73: 空きマスの判定・位置のずれ・ビット数(parse.js と export.js からも使うので ui.js から移動)
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
function pcShifts(){
  const l6=window.__layout6;if(!l6)return [];
  const c=new Map();for(const b of l6.blocks)if(b.moved)c.set(b.moved,(c.get(b.moved)||0)+1);
  return [...c.entries()].sort((a,b)=>b[1]-a[1]).map(e=>e[0]);
}
function popcount8(v){let n=0;while(v){n+=v&1;v>>=1}return n}
