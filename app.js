const fileInput=document.getElementById('file');const drop=document.getElementById('drop');const statusEl=document.getElementById('status');const result=document.getElementById('result');const gameEl=document.getElementById('game');const sizeEl=document.getElementById('size');const countEl=document.getElementById('count');const listEl=document.getElementById('list');const download=document.getElementById('download');
const SAVE={XY:0x65600,ORAS:0x76000,SM:0x6BE00,USUM:0x6CC00};
const SPECIES={"1":"フシギダネ","2":"フシギソウ","3":"フシギバナ","4":"ヒトカゲ","5":"リザード","6":"リザードン","7":"ゼニガメ","8":"カメール","9":"カメックス","10":"キャタピー","11":"トランセル","12":"バタフリー","13":"ビードル","14":"コクーン","15":"スピアー","16":"ポッポ","17":"ピジョン","18":"ピジョット","19":"コラッタ","20":"ラッタ","21":"オニスズメ","22":"オニドリル","23":"アーボ","24":"アーボック","25":"ピカチュウ","26":"ライチュウ","27":"サンド","28":"サンドパン","29":"ニドラン♀","30":"ニドリーナ","31":"ニドクイン","32":"ニドラン♂","33":"ニドリーノ","34":"ニドキング","35":"ピッピ","36":"ピクシー","37":"ロコン","38":"キュウコン","39":"プリン","40":"プクリン","41":"ズバット","42":"ゴルバット","43":"ナゾノクサ","44":"クサイハナ","45":"ラフレシア","46":"パラス","47":"パラセクト","48":"コンパン","49":"モルフォン","50":"ディグダ","51":"ダグトリオ","52":"ニャース","53":"ペルシアン","54":"コダック","55":"ゴルダック","56":"マンキー","57":"オコリザル","58":"ガーディ","59":"ウインディ","60":"ニョロモ","61":"ニョロゾ","62":"ニョロボン","63":"ケーシィ","64":"ユンゲラー","65":"フーディン","66":"ワンリキー","67":"ゴーリキー","68":"カイリキー","69":"マダツボミ","70":"ウツドン","71":"ウツボット","72":"メノクラゲ","73":"ドククラゲ","74":"イシツブテ","75":"ゴローン","76":"ゴローニャ","77":"ポニータ","78":"ギャロップ","79":"ヤドン","80":"ヤドラン","81":"コイル","82":"レアコイル","83":"カモネギ","84":"ドードー","85":"ドードリオ","86":"パウワウ","87":"ジュゴン","88":"ベトベター","89":"ベトベトン","90":"シェルダー","91":"パルシェン","92":"ゴース","93":"ゴースト","94":"ゲンガー","95":"イワーク","96":"スリープ","97":"スリーパー","98":"クラブ","99":"キングラー","100":"ビリリダマ","101":"マルマイン","102":"タマタマ","103":"ナッシー","104":"カラカラ","105":"ガラガラ","106":"サワムラー","107":"エビワラー","108":"ベロリンガ","109":"ドガース","110":"マタドガス","111":"サイホーン","112":"サイドン","113":"ラッキー","114":"モンジャラ","115":"ガルーラ","116":"タッツー","117":"シードラ","118":"トサキント","119":"アズマオウ","120":"ヒトデマン","121":"スターミー","122":"バリヤード","123":"ストライク","124":"ルージュラ","125":"エレブー","126":"ブーバー","127":"カイロス","128":"ケンタロス","129":"コイキング","130":"ギャラドス","131":"ラプラス","132":"メタモン","133":"イーブイ","134":"シャワーズ","135":"サンダース","136":"ブースター","137":"ポリゴン","138":"オムナイト","139":"オムスター","140":"カブト","141":"カブトプス","142":"プテラ","143":"カビゴン","144":"フリーザー","145":"サンダー","146":"ファイヤー","147":"ミニリュウ","148":"ハクリュー","149":"カイリュー","150":"ミュウツー","151":"ミュウ","152":"チコリータ","153":"ベイリーフ","154":"メガニウム","155":"ヒノアラシ","156":"マグマラシ","157":"バクフーン","158":"ワニノコ","159":"アリゲイツ","160":"オーダイル","161":"オタチ","162":"オオタチ","163":"ホーホー","164":"ヨルノズク","165":"レディバ","166":"レディアン","167":"イトマル","168":"アリアドス","169":"クロバット","170":"チョンチー","171":"ランターン","172":"ピチュー","173":"ピィ","174":"ププリン","175":"トゲピー","176":"トゲチック","177":"ネイティ","178":"ネイティオ","179":"メリープ","180":"モココ","181":"デンリュウ","182":"キレイハナ","183":"マリル","184":"マリルリ","185":"ウソッキー","186":"ニョロトノ","187":"ハネッコ","188":"ポポッコ","189":"ワタッコ","190":"エイパム","191":"ヒマナッツ","192":"キマワリ","193":"ヤンヤンマ","194":"ウパー","195":"ヌオー","196":"エーフィ","197":"ブラッキー","198":"ヤミカラス","199":"ヤドキング","200":"ムウマ","201":"アンノーン","202":"ソーナンス","203":"キリンリキ","204":"クヌギダマ","205":"フォレトス","206":"ノコッチ","207":"グライガー","208":"ハガネール","209":"ブルー","210":"グランブル","211":"ハリーセン","212":"ハッサム","213":"ツボツボ","214":"ヘラクロス","215":"ニューラ","216":"ヒメグマ","217":"リングマ","218":"マグマッグ","219":"マグカルゴ","220":"ウリムー","221":"イノムー","222":"サニーゴ","223":"テッポウオ","224":"オクタン","225":"デリバード","226":"マンタイン","227":"エアームド","228":"デルビル","229":"ヘルガー","230":"キングドラ","231":"ゴマゾウ","232":"ドンファン","233":"ポリゴン２","234":"オドシシ","235":"ドーブル","236":"バルキー","237":"カポエラー","238":"ムチュール","239":"エレキッド","240":"ブビィ","241":"ミルタンク","242":"ハピナス","243":"ライコウ","244":"エンテイ","245":"スイクン","246":"ヨーギラス","247":"サナギラス","248":"バンギラス","249":"ルギア","250":"ホウオウ","251":"セレビィ","252":"キモリ","253":"ジュプトル","254":"ジュカイン","255":"アチャモ","256":"ワカシャモ","257":"バシャーモ","258":"ミズゴロウ","259":"ヌマクロー","260":"ラグラージ","261":"ポチエナ","262":"グラエナ","263":"ジグザグマ","264":"マッスグマ","265":"ケムッソ","266":"カラサリス","267":"アゲハント","268":"マユルド","269":"ドクケイル","270":"ハスボー","271":"ハスブレロ","272":"ルンパッパ","273":"タネボー","274":"コノハナ","275":"ダーテング","276":"スバメ","277":"オオスバメ","278":"キャモメ","279":"ペリッパー","280":"ラルトス","281":"キルリア","282":"サーナイト","283":"アメタマ","284":"アメモース","285":"キノココ","286":"キノガッサ","287":"ナマケロ","288":"ヤルキモノ","289":"ケッキング","290":"ツチニン","291":"テッカニン","292":"ヌケニン","293":"ゴニョニョ","294":"ドゴーム","295":"バクオング","296":"マクノシタ","297":"ハリテヤマ","298":"ルリリ","299":"ノズパス","300":"エネコ","301":"エネコロロ","302":"ヤミラミ","303":"クチート","304":"ココドラ","305":"コドラ","306":"ボスゴドラ","307":"アサナン","308":"チャーレム","309":"ラクライ","310":"ライボルト","311":"プラスル","312":"マイナン","313":"バルビート","314":"イルミーゼ","315":"ロゼリア","316":"ゴクリン","317":"マルノーム","318":"キバニア","319":"サメハダー","320":"ホエルコ","321":"ホエルオー","322":"ドンメル","323":"バクーダ","324":"コータス","325":"バネブー","326":"ブーピッグ","327":"パッチール","328":"ナックラー","329":"ビブラーバ","330":"フライゴン","331":"サボネア","332":"ノクタス","333":"チルット","334":"チルタリス","335":"ザングース","336":"ハブネーク","337":"ルナトーン","338":"ソルロック","339":"ドジョッチ","340":"ナマズン","341":"ヘイガニ","342":"シザリガー","343":"ヤジロン","344":"ネンドール","345":"リリーラ","346":"ユレイドル","347":"アノプス","348":"アーマルド","349":"ヒンバス","350":"ミロカロス","351":"ポワルン","352":"カクレオン","353":"カゲボウズ","354":"ジュペッタ","355":"ヨマワル","356":"サマヨール","357":"トロピウス","358":"チリーン","359":"アブソル","360":"ソーナノ","361":"ユキワラシ","362":"オニゴーリ","363":"タマザラシ","364":"トドグラー","365":"トドゼルガ","366":"パールル","367":"ハンテール","368":"サクラビス","369":"ジーランス","370":"ラブカス","371":"タツベイ","372":"コモルー","373":"ボーマンダ","374":"ダンバル","375":"メタング","376":"メタグロス","377":"レジロック","378":"レジアイス","379":"レジスチル","380":"ラティアス","381":"ラティオス","382":"カイオーガ","383":"グラードン","384":"レックウザ","385":"ジラーチ","386":"デオキシス","387":"ナエトル","388":"ハヤシガメ","389":"ドダイトス","390":"ヒコザル","391":"モウカザル","392":"ゴウカザル","393":"ポッチャマ","394":"ポッタイシ","395":"エンペルト","396":"ムックル","397":"ムクバード","398":"ムクホーク","399":"ビッパ","400":"ビーダル","401":"コロボーシ","402":"コロトック","403":"コリンク","404":"ルクシオ","405":"レントラー","406":"スボミー","407":"ロズレイド","408":"ズガイドス","409":"ラムパルド","410":"タテトプス","411":"トリデプス","412":"ミノムッチ","413":"ミノマダム","414":"ガーメイル","415":"ミツハニー","416":"ビークイン","417":"パチリス","418":"ブイゼル","419":"フローゼル","420":"チェリンボ","421":"チェリム","422":"カラナクシ","423":"トリトドン","424":"エテボース","425":"フワンテ","426":"フワライド","427":"ミミロル","428":"ミミロップ","429":"ムウマージ","430":"ドンカラス","431":"ニャルマー","432":"ブニャット","433":"リーシャン","434":"スカンプー","435":"スカタンク","436":"ドーミラー","437":"ドータクン","438":"ウソハチ","439":"マネネ","440":"ピンプク","441":"ペラップ","442":"ミカルゲ","443":"フカマル","444":"ガバイト","445":"ガブリアス","446":"ゴンベ","447":"リオル","448":"ルカリオ","449":"ヒポポタス","450":"カバルドン","451":"スコルピ","452":"ドラピオン","453":"グレッグル","454":"ドクロッグ","455":"マスキッパ","456":"ケイコウオ","457":"ネオラント","458":"タマンタ","459":"ユキカブリ","460":"ユキノオー","461":"マニューラ","462":"ジバコイル","463":"ベロベルト","464":"ドサイドン","465":"モジャンボ","466":"エレキブル","467":"ブーバーン","468":"トゲキッス","469":"メガヤンマ","470":"リーフィア","471":"グレイシア","472":"グライオン","473":"マンムー","474":"ポリゴンＺ","475":"エルレイド","476":"ダイノーズ","477":"ヨノワール","478":"ユキメノコ","479":"ロトム","480":"ユクシー","481":"エムリット","482":"アグノム","483":"ディアルガ","484":"パルキア","485":"ヒードラン","486":"レジギガス","487":"ギラティナ","488":"クレセリア","489":"フィオネ","490":"マナフィ","491":"ダークライ","492":"シェイミ","493":"アルセウス","494":"ビクティニ","495":"ツタージャ","496":"ジャノビー","497":"ジャローダ","498":"ポカブ","499":"チャオブー","500":"エンブオー","501":"ミジュマル","502":"フタチマル","503":"ダイケンキ","504":"ミネズミ","505":"ミルホッグ","506":"ヨーテリー","507":"ハーデリア","508":"ムーランド","509":"チョロネコ","510":"レパルダス","511":"ヤナップ","512":"ヤナッキー","513":"バオップ","514":"バオッキー","515":"ヒヤップ","516":"ヒヤッキー","517":"ムンナ","518":"ムシャーナ","519":"マメパト","520":"ハトーボー","521":"ケンホロウ","522":"シママ","523":"ゼブライカ","524":"ダンゴロ","525":"ガントル","526":"ギガイアス","527":"コロモリ","528":"ココロモリ","529":"モグリュー","530":"ドリュウズ","531":"タブンネ","532":"ドッコラー","533":"ドテッコツ","534":"ローブシン","535":"オタマロ","536":"ガマガル","537":"ガマゲロゲ","538":"ナゲキ","539":"ダゲキ","540":"クルミル","541":"クルマユ","542":"ハハコモリ","543":"フシデ","544":"ホイーガ","545":"ペンドラー","546":"モンメン","547":"エルフーン","548":"チュリネ","549":"ドレディア","550":"バスラオ","551":"メグロコ","552":"ワルビル","553":"ワルビアル","554":"ダルマッカ","555":"ヒヒダルマ","556":"マラカッチ","557":"イシズマイ","558":"イワパレス","559":"ズルッグ","560":"ズルズキン","561":"シンボラー","562":"デスマス","563":"デスカーン","564":"プロトーガ","565":"アバゴーラ","566":"アーケン","567":"アーケオス","568":"ヤブクロン","569":"ダストダス","570":"ゾロア","571":"ゾロアーク","572":"チラーミィ","573":"チラチーノ","574":"ゴチム","575":"ゴチミル","576":"ゴチルゼル","577":"ユニラン","578":"ダブラン","579":"ランクルス","580":"コアルヒー","581":"スワンナ","582":"バニプッチ","583":"バニリッチ","584":"バイバニラ","585":"シキジカ","586":"メブキジカ","587":"エモンガ","588":"カブルモ","589":"シュバルゴ","590":"タマゲタケ","591":"モロバレル","592":"プルリル","593":"ブルンゲル","594":"ママンボウ","595":"バチュル","596":"デンチュラ","597":"テッシード","598":"ナットレイ","599":"ギアル","600":"ギギアル","601":"ギギギアル","602":"シビシラス","603":"シビビール","604":"シビルドン","605":"リグレー","606":"オーベム","607":"ヒトモシ","608":"ランプラー","609":"シャンデラ","610":"キバゴ","611":"オノンド","612":"オノノクス","613":"クマシュン","614":"ツンベアー","615":"フリージオ","616":"チョボマキ","617":"アギルダー","618":"マッギョ","619":"コジョフー","620":"コジョンド","621":"クリムガン","622":"ゴビット","623":"ゴルーグ","624":"コマタナ","625":"キリキザン","626":"バッフロン","627":"ワシボン","628":"ウォーグル","629":"バルチャイ","630":"バルジーナ","631":"クイタラン","632":"アイアント","633":"モノズ","634":"ジヘッド","635":"サザンドラ","636":"メラルバ","637":"ウルガモス","638":"コバルオン","639":"テラキオン","640":"ビリジオン","641":"トルネロス","642":"ボルトロス","643":"レシラム","644":"ゼクロム","645":"ランドロス","646":"キュレム","647":"ケルディオ","648":"メロエッタ","649":"ゲノセクト","650":"ハリマロン","651":"ハリボーグ","652":"ブリガロン","653":"フォッコ","654":"テールナー","655":"マフォクシー","656":"ケロマツ","657":"ゲコガシラ","658":"ゲッコウガ","659":"ホルビー","660":"ホルード","661":"ヤヤコマ","662":"ヒノヤコマ","663":"ファイアロー","664":"コフキムシ","665":"コフーライ","666":"ビビヨン","667":"シシコ","668":"カエンジシ","669":"フラベベ","670":"フラエッテ","671":"フラージェス","672":"メェークル","673":"ゴーゴート","674":"ヤンチャム","675":"ゴロンダ","676":"トリミアン","677":"ニャスパー","678":"ニャオニクス","679":"ヒトツキ","680":"ニダンギル","681":"ギルガルド","682":"シュシュプ","683":"フレフワン","684":"ペロッパフ","685":"ペロリーム","686":"マーイーカ","687":"カラマネロ","688":"カメテテ","689":"ガメノデス","690":"クズモー","691":"ドラミドロ","692":"ウデッポウ","693":"ブロスター","694":"エリキテル","695":"エレザード","696":"チゴラス","697":"ガチゴラス","698":"アマルス","699":"アマルルガ","700":"ニンフィア","701":"ルチャブル","702":"デデンネ","703":"メレシー","704":"ヌメラ","705":"ヌメイル","706":"ヌメルゴン","707":"クレッフィ","708":"ボクレー","709":"オーロット","710":"バケッチャ","711":"パンプジン","712":"カチコール","713":"クレベース","714":"オンバット","715":"オンバーン","716":"ゼルネアス","717":"イベルタル","718":"ジガルデ","719":"ディアンシー","720":"フーパ","721":"ボルケニオン","722":"モクロー","723":"フクスロー","724":"ジュナイパー","725":"ニャビー","726":"ニャヒート","727":"ガオガエン","728":"アシマリ","729":"オシャマリ","730":"アシレーヌ","731":"ツツケラ","732":"ケララッパ","733":"ドデカバシ","734":"ヤングース","735":"デカグース","736":"アゴジムシ","737":"デンヂムシ","738":"クワガノン","739":"マケンカニ","740":"ケケンカニ","741":"オドリドリ","742":"アブリー","743":"アブリボン","744":"イワンコ","745":"ルガルガン","746":"ヨワシ","747":"ヒドイデ","748":"ドヒドイデ","749":"ドロバンコ","750":"バンバドロ","751":"シズクモ","752":"オニシズクモ","753":"カリキリ","754":"ラランテス","755":"ネマシュ","756":"マシェード","757":"ヤトウモリ","758":"エンニュート","759":"ヌイコグマ","760":"キテルグマ","761":"アマカジ","762":"アママイコ","763":"アマージョ","764":"キュワワー","765":"ヤレユータン","766":"ナゲツケサル","767":"コソクムシ","768":"グソクムシャ","769":"スナバァ","770":"シロデスナ","771":"ナマコブシ","772":"タイプ：ヌル","773":"シルヴァディ","774":"メテノ","775":"ネッコアラ","776":"バクガメス","777":"トゲデマル","778":"ミミッキュ","779":"ハギギシリ","780":"ジジーロン","781":"ダダリン","782":"ジャラコ","783":"ジャランゴ","784":"ジャラランガ","785":"カプ・コケコ","786":"カプ・テテフ","787":"カプ・ブルル","788":"カプ・レヒレ","789":"コスモッグ","790":"コスモウム","791":"ソルガレオ","792":"ルナアーラ","793":"ウツロイド","794":"マッシブーン","795":"フェローチェ","796":"デンジュモク","797":"テッカグヤ","798":"カミツルギ","799":"アクジキング","800":"ネクロズマ","801":"マギアナ","802":"マーシャドー","803":"ベベノム","804":"アーゴヨン","805":"ツンデツンデ","806":"ズガドーン","807":"ゼラオラ","808":"メルタン","809":"メルメタル","810":"サルノリ","811":"バチンキー","812":"ゴリランダー","813":"ヒバニー","814":"ラビフット","815":"エースバーン","816":"メッソン","817":"ジメレオン","818":"インテレオン","819":"ホシガリス","820":"ヨクバリス","821":"ココガラ","822":"アオガラス","823":"アーマーガア","824":"サッチムシ","825":"レドームシ","826":"イオルブ","827":"クスネ","828":"フォクスライ","829":"ヒメンカ","830":"ワタシラガ","831":"ウールー","832":"バイウールー","833":"カムカメ","834":"カジリガメ","835":"ワンパチ","836":"パルスワン","837":"タンドン","838":"トロッゴン","839":"セキタンザン","840":"カジッチュ","841":"アップリュー","842":"タルップル","843":"スナヘビ","844":"サダイジャ","845":"ウッウ","846":"サシカマス","847":"カマスジョー","848":"エレズン","849":"ストリンダー","850":"ヤクデ","851":"マルヤクデ","852":"タタッコ","853":"オトスパス","854":"ヤバチャ","855":"ポットデス","856":"ミブリム","857":"テブリム","858":"ブリムオン","859":"ベロバー","860":"ギモー","861":"オーロンゲ","862":"タチフサグマ","863":"ニャイキング","864":"サニゴーン","865":"ネギガナイト","866":"バリコオル","867":"デスバーン","868":"マホミル","869":"マホイップ","870":"タイレーツ","871":"バチンウニ","872":"ユキハミ","873":"モスノウ","874":"イシヘンジン","875":"コオリッポ","876":"イエッサン","877":"モルペコ","878":"ゾウドウ","879":"ダイオウドウ","880":"パッチラゴン","881":"パッチルドン","882":"ウオノラゴン","883":"ウオチルドン","884":"ジュラルドン","885":"ドラメシヤ","886":"ドロンチ","887":"ドラパルト","888":"ザシアン","889":"ザマゼンタ","890":"ムゲンダイナ","891":"ダクマ","892":"ウーラオス","893":"ザルード","894":"レジエレキ","895":"レジドラゴ","896":"ブリザポス","897":"レイスポス","898":"バドレックス","899":"アヤシシ","900":"バサギリ","901":"ガチグマ","902":"イダイトウ","903":"オオニューラ","904":"ハリーマン","905":"ラブトロス","906":"ニャオハ","907":"ニャローテ","908":"マスカーニャ","909":"ホゲータ","910":"アチゲータ","911":"ラウドボーン","912":"クワッス","913":"ウェルカモ","914":"ウェーニバル","915":"グルトン","916":"パフュートン","917":"タマンチュラ","918":"ワナイダー","919":"マメバッタ","920":"エクスレッグ","921":"パモ","922":"パモット","923":"パーモット","924":"ワッカネズミ","925":"イッカネズミ","926":"パピモッチ","927":"バウッツェル","928":"ミニーブ","929":"オリーニョ","930":"オリーヴァ","931":"イキリンコ","932":"コジオ","933":"ジオヅム","934":"キョジオーン","935":"カルボウ","936":"グレンアルマ","937":"ソウブレイズ","938":"ズピカ","939":"ハラバリー","940":"カイデン","941":"タイカイデン","942":"オラチフ","943":"マフィティフ","944":"シルシュルー","945":"タギングル","946":"アノクサ","947":"アノホラグサ","948":"ノノクラゲ","949":"リククラゲ","950":"ガケガニ","951":"カプサイジ","952":"スコヴィラン","953":"シガロコ","954":"ベラカス","955":"ヒラヒナ","956":"クエスパトラ","957":"カヌチャン","958":"ナカヌチャン","959":"デカヌチャン","960":"ウミディグダ","961":"ウミトリオ","962":"オトシドリ","963":"ナミイルカ","964":"イルカマン","965":"ブロロン","966":"ブロロローム","967":"モトトカゲ","968":"ミミズズ","969":"キラーメ","970":"キラフロル","971":"ボチ","972":"ハカドッグ","973":"カラミンゴ","974":"アルクジラ","975":"ハルクジラ","976":"ミガルーサ","977":"ヘイラッシャ","978":"シャリタツ","979":"コノヨザル","980":"ドオー","981":"リキキリン","982":"ノココッチ","983":"ドドゲザン","984":"イダイナキバ","985":"サケブシッポ","986":"アラブルタケ","987":"ハバタクカミ","988":"チヲハウハネ","989":"スナノケガワ","990":"テツノワダチ","991":"テツノツツミ","992":"テツノカイナ","993":"テツノコウベ","994":"テツノドクガ","995":"テツノイバラ","996":"セビエ","997":"セゴール","998":"セグレイブ","999":"コレクレー","1000":"サーフゴー","1001":"チオンジェン","1002":"パオジアン","1003":"ディンルー","1004":"イーユイ","1005":"トドロクツキ","1006":"テツノブジン","1007":"コライドン","1008":"ミライドン","1009":"ウネルミナモ","1010":"テツノイサハ","1011":"カミッチュ","1012":"チャデス","1013":"ヤバソチャ","1014":"イイネイヌ","1015":"マシマシラ","1016":"キチキギス","1017":"オーガポン","1018":"ブリジュラス","1019":"カミツオロチ","1020":"ウガツホムラ","1021":"タケルライコ","1022":"テツノイワオ","1023":"テツノカシラ","1024":"テラパゴス","1025":"モモワロウ"};
// The map above is intentionally partial; the numeric ID remains authoritative for all species.
function u16(a,p){return a[p]|(a[p+1]<<8)}
function u32(a,p){return (a[p]|(a[p+1]<<8)|(a[p+2]<<16)|(a[p+3]<<24))>>>0}
function crypt(a,start,end,seed){let x=seed>>>0;for(let p=start;p<end;p+=2){x=Math.imul(x,0x41C64E6D)+0x6073;x>>>=0;const k=x>>>16;const v=a[p]|(a[p+1]<<8);const y=v^k;a[p]=y&255;a[p+1]=y>>>8}return a}
const POS=[0,1,2,3,0,1,3,2,0,2,1,3,0,3,1,2,0,2,3,1,0,3,2,1,1,0,2,3,1,0,3,2,2,0,1,3,3,0,1,2,2,0,3,1,3,0,2,1,1,2,0,3,1,3,0,2,2,1,0,3,3,1,0,2,2,3,0,1,3,2,0,1,1,2,3,0,1,3,2,0,2,1,3,0,3,1,2,0,2,3,1,0,3,2,1,0,0,1,2,3,0,1,3,2];
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
  if(!speciesValid || score<45)return null;
  let confidence=score>=90&&checksumValid?'complete':score>=65?'partial':'low';
  return {data:b,species,ec,sv,shiny:shiny(b),checksumValid,nicknameTerm,otTerm,languageValid,score,confidence};
}
function shiny(b){const pid=u32(b,0x18),tid=u16(b,0x0C),sid=u16(b,0x0E);return ((tid^sid^(pid>>>16)^(pid&0xffff))<16)}
function detectGame(len){if(len===SAVE.XY)return ['XY / X・Y',6,721];if(len===SAVE.ORAS)return ['ORAS / オメガルビー・アルファサファイア',6,721];if(len===SAVE.SM)return ['SM / サン・ムーン',7,802];if(len===SAVE.USUM)return ['USUM / ウルトラサン・ウルトラムーン',7,807];if(len===0x100000)return ['3DSセーブ（1 MiB）: ゲーム特定不能',null,809];return ['サイズから特定できないセーブ',null,809]}
function classifyHits(hits){
  // Prefer the strongest interpretation when the same EC is encountered multiple times.
  const best=new Map();
  for(const h of hits){const old=best.get(h.ec>>>0);if(!old||h.score>old.score)best.set(h.ec>>>0,h)}
  return [...best.values()].sort((a,b)=>a.offset-b.offset);
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
  if(gen===6){const base=game.startsWith('XY')?0x22600:0x33000;return {base,boxes:31,slots:31*30,size:232,exact:true};}
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
  // Anchor the first candidate to a slot boundary; the exact box number is
  // reliable only when the surrounding PC cluster is large enough.
  const first=aligned[0].offset;
  const base=first-(Math.floor(first/232)*232);
  return {base:base+Math.floor(first/232)*232,confidence:aligned.length>=2?'estimated':'weak'};
}
function getLocation(q,game,gen){
  const layout=getStorageLayout(game,gen);
  if(!layout)return {box:null,slot:null,label:'位置不明'};
  const base=layout.exact?layout.base:(window.__gen7Base??null);
  if(base===null)return {box:null,slot:null,label:'位置不明'};
  const rel=q.offset-base;
  const total=layout.slots*layout.size;
  if(rel<0||rel>=total)return {box:null,slot:null,label:'位置不明'};
  const index=Math.floor(rel/layout.size);
  const box=Math.floor(index/30)+1,slot=(index%30)+1;
  const aligned=rel%layout.size===0;
  return {box,slot,aligned,label:`ボックス${box}・${slot}番${aligned?'':'（位置ずれ候補）'}`};
}
function confidenceLabel(c){return c==='complete'?'完全復元':c==='partial'?'一部破損':'低信頼候補'}
function confidenceClass(c){return c==='complete'?'complete':c==='partial'?'partial':'low'}
function renderTabs(hits){
  const groups={complete:[],partial:[],low:[]};
  hits.forEach(h=>groups[h.confidence].push(h));
  listEl.innerHTML=`
    <div class="recovery-controls">
      <div class="selection-title"><strong>復元する個体を選択</strong><span>チェックした個体だけが boxdata.bin に含まれます。</span></div>
      <div class="selection-actions">
        <button type="button" class="small-button" data-action="all">すべて選択</button>
        <button type="button" class="small-button" data-action="none">すべて解除</button>
        <button type="button" class="small-button" data-action="safe">完全復元のみ</button>
      </div>
    </div>
    <div class="tabs" role="tablist">
      ${['complete','partial','low'].map((g,i)=>`<button type="button" class="tab ${i===0?'active':''}" data-tab="${g}" role="tab"><span>${confidenceLabel(g)}</span><b>${groups[g].length}</b></button>`).join('')}
    </div>
    <div class="tab-panels">
      ${['complete','partial','low'].map((g,i)=>`<div class="tab-panel ${i===0?'active':''}" data-panel="${g}">${groups[g].length?groups[g].map((p,n)=>renderCandidate(p,g,n)).join(''):`<div class="empty">この分類の候補はありません。</div>`}</div>`).join('')}
    </div>`;
  listEl.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{
    listEl.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===btn));
    listEl.querySelectorAll('[data-panel]').forEach(x=>x.classList.toggle('active',x.dataset.panel===btn.dataset.tab));
  }));
  listEl.querySelectorAll('.candidate-check').forEach(cb=>cb.addEventListener('change',updateSelectionSummary));
  listEl.querySelectorAll('.small-button').forEach(btn=>btn.addEventListener('click',()=>{
    const action=btn.dataset.action;
    listEl.querySelectorAll('.candidate-check').forEach(cb=>{cb.checked=action==='all'||(action==='safe'&&cb.dataset.confidence==='complete')});
    updateSelectionSummary();
  }));
  updateSelectionSummary();
}
function renderCandidate(p,g,n){
  const loc=getLocation(p,window.__game,window.__gen);
  const speciesName=SPECIES[p.species]||('No.'+p.species);
  const offset=`0x${p.offset.toString(16).toUpperCase().padStart(6,'0')}`;
  const reason=g==='complete'?'チェックサム一致・主要構造一致':g==='partial'?'チェックサム不一致または一部構造破損':'構造の一部のみ一致。誤検出の可能性があります';
  return `<label class="candidate ${confidenceClass(g)}"><input class="candidate-check" type="checkbox" data-offset="${p.offset}" data-ec="${p.ec}" data-confidence="${g}" checked><span class="candidate-main"><span class="candidate-top"><strong>${escapeHtml(speciesName)}</strong><span class="badge ${confidenceClass(g)}">${confidenceLabel(g)}${p.shiny?' ★':''}</span></span><span class="candidate-meta">全国図鑑No.${p.species} · ${loc.label} · offset ${offset}</span><span class="candidate-reason">${reason} · 信頼度スコア ${p.score}/100</span></span></label>`;
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
async function analyze(file){
  result.classList.add('hidden');listEl.innerHTML='';msg('セーブデータを解析しています…');
  const input=new Uint8Array(await file.arrayBuffer());
  const [game,gen,maxSpecies]=detectGame(input.length);let scanGen=gen||6;
  let hits=scan(input,scanGen,maxSpecies);
  if(!hits.length&&gen===null){const h6=scan(input,6,721),h7=scan(input,7,807);hits=h7.length>h6.length?h7:h6;scanGen=hits.length?hits[0].gen:6}
  if(scanGen===7){const inf=inferGen7Base(hits);window.__gen7Base=inf?inf.base:null}
  gameEl.textContent=hits.length?game+(gen===null?'（内部構造から推定）':''):game;
  sizeEl.textContent=input.length.toLocaleString()+' bytes';
  if(!hits.length){countEl.textContent='0 匹';msg('ポケモン個体データを検出できませんでした。破損が大きいか、暗号化形式・別世代の可能性があります。',true);return}
  window.__hits=hits;window.__inputName=file.name;window.__inputSize=input.length;window.__game=game;window.__gen=scanGen;window.__input=input;
  const complete=hits.filter(h=>h.confidence==='complete').length,partial=hits.filter(h=>h.confidence==='partial').length,low=hits.filter(h=>h.confidence==='low').length;
  document.getElementById('selectionSummary').textContent=`選択中 ${hits.length} 匹`;
  renderTabs(hits);
  msg(`${hits.length} 匹の候補を検出しました。復元範囲をチェックボックスで選択してください。`);
  result.classList.remove('hidden');
}
fileInput.addEventListener('change',()=>{if(fileInput.files[0])analyze(fileInput.files[0]).catch(e=>msg('解析中にエラーが発生しました: '+e.message,true))});
['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('drag')}));
['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('drag')}));
drop.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f)analyze(f).catch(err=>msg('解析中にエラーが発生しました: '+err.message,true))});
function crc32(data){let c=0xffffffff;for(const x of data){c^=x;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0}
function zipStore(files){const enc=new TextEncoder(),chunks=[],central=[];let offset=0;for(const f of files){const name=enc.encode(f.name),data=f.data,crc=crc32(data);const h=new Uint8Array(30+name.length);const dv=new DataView(h.buffer);dv.setUint32(0,0x04034b50,true);dv.setUint16(4,20,true);dv.setUint16(8,0,true);dv.setUint32(14,crc,true);dv.setUint32(18,data.length,true);dv.setUint32(22,data.length,true);dv.setUint16(26,name.length,true);h.set(name,30);chunks.push(h,data);const c=new Uint8Array(46+name.length),cv=new DataView(c.buffer);cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,name.length,true);cv.setUint32(42,offset,true);c.set(name,46);central.push(c);offset+=h.length+data.length}const centralSize=central.reduce((s,x)=>s+x.length,0),end=new Uint8Array(22),ev=new DataView(end.buffer);ev.setUint32(0,0x06054b50,true);ev.setUint16(8,files.length,true);ev.setUint16(10,files.length,true);ev.setUint32(12,centralSize,true);ev.setUint32(16,offset,true);return new Blob([...chunks,...central,end],{type:'application/zip'})}
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
    const blob=zipStore([{name:'boxdata.bin',data}]);
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='boxdata_selected.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    msg(`boxdata.bin を作成しました。選択 ${selected.length} 匹中 ${placed} 匹を元のボックス位置に配置しました${unknown?`。位置を特定できない ${unknown} 匹は安全のため未配置`:''}${conflicts?`。重複位置 ${conflicts} 匹は未配置`:''}。`);
  }catch(e){msg('boxdata.bin の作成に失敗しました: '+e.message,true)}
});
