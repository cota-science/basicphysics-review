/*
 * 単元：力とつり合い
 * どの力も「〇〇が△△に及ぼす力」と言えることがねらい。g ＝ 9.8 m/s²。
 * 摩擦力は次単元「運動の法則」で扱う。
 */
(function(){

const DEF_TABLE = `<div class="tbl"><table>
<tr><th>用語</th><th>定義（何が何に）</th><th>式・単位</th></tr>
<tr><td>力</td><td>物体の運動の状態を変えたり、変形させたりするはたらき。大きさ・向き・作用点をもつ</td><td>N</td></tr>
<tr><td>重力</td><td>地球が物体に及ぼす引力。鉛直下向き</td><td>W ＝ mg</td></tr>
<tr><td>垂直抗力</td><td>面が、接している物体に及ぼす、面に垂直な力</td><td>N</td></tr>
<tr><td>張力</td><td>糸が、つながれた物体に及ぼす、糸に沿って引く力</td><td>T</td></tr>
<tr><td>弾性力</td><td>変形したばねが物体に及ぼす、もとに戻ろうとする力。x は自然の長さからの伸び</td><td>F ＝ kx、k〔N/m〕</td></tr>
<tr><td>力のつり合い</td><td>1つの物体が受けるすべての力の合力が 0</td><td>合力 ＝ 0</td></tr>
<tr><td>作用・反作用</td><td>A が B に力を及ぼすと、B も A に同じ大きさ・逆向きの力を及ぼす</td><td>―</td></tr>
</table></div>
<div class="tbl"><table>
<tr><th></th><th>つり合いの2力</th><th>作用・反作用の2力</th></tr>
<tr><td>受ける物体</td><td>同じ1つの物体</td><td>別々の2つの物体</td></tr>
<tr><td>成り立つとき</td><td>静止・等速のときだけ</td><td>いつでも</td></tr>
</table></div>`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th></tr>
<tr><td>質量 m</td><td>kg</td></tr>
<tr><td>力 F, W, N, T</td><td>N ＝ kg·m/s²</td></tr>
<tr><td>ばね定数 k</td><td>N/m</td></tr>
<tr><td>伸び x</td><td>m</td></tr></table></div>`;
const STEPS = `<p>1 着目物体を決める → 2 受ける力をすべて挙げる（重力＋触れている物体の数） → 3 図と軸 → 4 軸ごとにつり合いの式 → 5 文字式で解き次元を確認 → 6 数値 → 7 妥当性</p>`;
const SCENE = `<svg class="graph" viewBox="0 0 320 150" role="img" aria-label="水平な机の上に本があり、その上にりんごがのっている図">
<rect x="40" y="110" width="240" height="10" fill="currentColor" opacity=".55"/>
<rect x="60" y="120" width="10" height="28" fill="currentColor" opacity=".55"/><rect x="250" y="120" width="10" height="28" fill="currentColor" opacity=".55"/>
<rect x="110" y="84" width="100" height="26" fill="var(--blue)" opacity=".35" stroke="var(--blue)"/>
<text x="148" y="102" font-size="13" fill="currentColor">本</text>
<circle cx="160" cy="64" r="20" fill="var(--red)" opacity=".35" stroke="var(--red)"/>
<text x="148" y="69" font-size="13" fill="currentColor">りんご</text>
<text x="226" y="132" font-size="13" fill="currentColor">机</text>
</svg>`;
const STRING30 = `<svg class="graph" viewBox="0 0 320 190" role="img" aria-label="天井から糸でつるしたおもりを水平に引き、糸が鉛直と30度をなして静止している図">
<line x1="60" y1="20" x2="260" y2="20" stroke="currentColor" stroke-width="3"/>
<line x1="120" y1="20" x2="120" y2="170" stroke="currentColor" stroke-dasharray="4 4" opacity=".5"/>
<line x1="120" y1="20" x2="190" y2="141" stroke="currentColor" stroke-width="2"/>
<path d="M120 60 A40 40 0 0 0 140 55" fill="none" stroke="var(--blue)" stroke-width="1.5"/>
<text x="124" y="80" font-size="13" fill="var(--blue)">30°</text>
<circle cx="190" cy="141" r="12" fill="currentColor" opacity=".7"/>
<line x1="204" y1="141" x2="270" y2="141" stroke="var(--red)" stroke-width="3"/>
<polygon points="270,135 282,141 270,147" fill="var(--red)"/>
<text x="258" y="130" font-size="14" fill="var(--red)">F</text>
<text x="180" y="176" font-size="13" fill="currentColor">1.0 kg</text>
</svg>`;
const TF = ["正しい","誤り"];
const PAIR = ["つり合いの2力","作用・反作用の2力","どちらでもない"];
const UNITQ = ["N（力）","m（伸び）","N/m（ばね定数）","kg（質量）"];

const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:"どの力も、定義の文に「何が」「何に」を入れて覚えます。",
  advice:"力の定義を「〇〇が△△に及ぼす力」の形で言えるように覚え直そう。",
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"blanks",text:"力の単位は{0}で、力は大きさ・{1}・作用点の3つで表す。",
     options:[["kg","N","N/m"],["質量","速さ","向き"]],answer:[1,2],
     explain:"力の単位はニュートン（N）。大きさ・向き・作用点をもつ量です。"},
    {id:"d2",type:"blanks",text:"重力とは、{0}が物体に及ぼす引力で、大きさは{1}である。",
     options:[["地球","物体","床"],["m","mg","g"]],answer:[0,1],
     explain:"重力は「地球が物体に及ぼす力」。大きさ W ＝ mg〔N〕です。"},
    {id:"d3",type:"blanks",text:"垂直抗力とは、{0}が物体に及ぼす、面に{1}な力である。",
     options:[["物体","地球","面"],["平行","垂直","斜め"]],answer:[2,1],
     explain:"垂直抗力は「面が物体に及ぼす力」。物体が面を押す力ではありません。"},
    {id:"d4",type:"blanks",text:"フックの法則 F ＝ kx の x は、ばねの{0}であり、k の単位は{1}である。",
     options:[["長さ","自然の長さからの伸び","質量"],["N","N/m","N·m"]],answer:[1,1],
     explain:"x はばねの長さそのものではなく、自然の長さからの伸び（縮み）です。"},
    {id:"d5",type:"blanks",text:"つり合いの2力は{0}物体にはたらき、作用・反作用の2力は{1}物体にはたらく。",
     options:[["同じ","別々の"],["同じ","別々の"]],answer:[0,1],
     explain:"どちらも「同じ大きさ・逆向き」。違いは、力を受ける物体が同じか別々かです。"},
    {id:"d6",type:"choice",prompt:"重力以外の力は、着目物体にどのような物体から受けるか。",
     options:["近くにあるすべての物体","触れている物体","着目物体より重い物体"],answer:1,
     explain:"重力以外の力は、触れている物体からしか受けません。触れているものを数えれば、描き漏れを防げます。"}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル",
  intro:"この単元の中心です。力を「誰が・誰に」で読み書きする練習を繰り返します。",
  advice:"着目物体を1つ決め、「〇〇が着目物体に及ぼす力」だけを挙げる練習をしよう。",
  groups:[
  { title:"A. 「及ぼす」「受ける」を読む", qs:[
    {id:"ra1",type:"blanks",prompt:"「床が箱に及ぼす垂直抗力」について答えよ。",text:"力を及ぼしている物体：{0}<br>力を受けている物体：{1}",
     options:[["箱","床","地球"],["箱","床","地球"]],answer:[1,0],
     explain:"「A が B に及ぼす力」では、A が及ぼす側、B が受ける側です。"},
    {id:"ra2",type:"choice",prompt:"「箱は床から垂直抗力を受ける」と同じ意味の文はどれか。",
     options:["箱が床に及ぼす垂直抗力","床が箱に及ぼす垂直抗力","箱が床を押す力"],answer:1,
     explain:"「B は A から受ける」＝「A が B に及ぼす」。"},
    {id:"ra3",type:"blanks",prompt:"次の力は、それぞれどの物体が受ける力か。",text:"「人が糸を引く力」を受けるのは{0}<br>「糸が人を引く力」を受けるのは{1}",
     options:[["人","糸"],["人","糸"]],answer:[1,0],
     explain:"「〜を引く」「〜を押す」の「〜」が、力を受ける物体です。"}
  ]},
  { title:"B. 受ける力をすべて挙げる", lead:"水平な机の上に本を置き、その上にりんごを置いた。すべて静止している。本に着目する。", figure:SCENE, qs:[
    {id:"rb1",type:"multi",prompt:"本が触れている物体をすべて選べ。",options:["机","りんご","地球","床"],answer:[0,1],
     explain:"本が直接触れているのは机とりんご。地球は触れていませんが、重力だけは離れていてもはたらきます。"},
    {id:"rb2",type:"multi",prompt:"本が受ける力をすべて選べ。",
     options:["地球が本に及ぼす重力","地球がりんごに及ぼす重力","机が本に及ぼす垂直抗力","りんごが本を押す力","本が机を押す力"],answer:[0,2,3],
     explain:"本が受けるのは、重力と、触れている机・りんごからの力の3つ。「りんごの重力」はりんごが受ける力、「本が机を押す力」は机が受ける力です。"}
  ]},
  { title:"C. つり合いか、作用・反作用か", lead:"同じ場面（机・本・りんご）で考える。", figure:SCENE, qs:[
    {id:"rc1",type:"choice",prompt:"地球が本に及ぼす重力と、本が地球に及ぼす引力",options:PAIR,answer:1,
     explain:"「A が B に」と「B が A に」の組なので、作用・反作用です。"},
    {id:"rc2",type:"choice",prompt:"本がりんごに及ぼす垂直抗力と、りんごが本を押す力",options:PAIR,answer:1,
     explain:"本とりんごが互いに及ぼし合う力なので、作用・反作用です。"},
    {id:"rc3",type:"choice",prompt:"地球がりんごに及ぼす重力と、本がりんごに及ぼす垂直抗力",options:PAIR,answer:0,
     explain:"どちらもりんごが受ける力で、りんごが受ける力はこの2つだけ。静止しているのでつり合っています。"},
    {id:"rc4",type:"choice",prompt:"地球が本に及ぼす重力と、机が本に及ぼす垂直抗力",options:PAIR,answer:2,
     explain:"どちらも本が受ける逆向きの力ですが、本はりんごからも押されています。垂直抗力は本とりんごの重さの和に等しく、重力と大きさが違います。この2力だけではつり合いません。"}
  ]},
  { title:"D. 正しいか、誤りか", qs:[
    {id:"rd1",type:"choice",prompt:"垂直抗力の大きさは、いつも物体の重力の大きさに等しい。",options:TF,answer:1,
     explain:"誤り。上から押したり、斜面に置いたりすると mg とは異なります。つり合いの式から求めます。"},
    {id:"rd2",type:"choice",prompt:"作用・反作用の2力は同じ大きさで逆向きなので、つり合っている。",options:TF,answer:1,
     explain:"誤り。作用・反作用は別々の物体にはたらくので、1つの物体のつり合いを考えるときには並べられません。"},
    {id:"rd4",type:"choice",prompt:"落下しているりんごが地球から引かれるとき、りんごも地球を同じ大きさの力で引いている。",options:TF,answer:0,
     explain:"正しい。作用・反作用の法則は、物体が動いていても成り立ちます。"},
    {id:"rd3",type:"choice",prompt:"静止している物体は、力を受けていない。",options:TF,answer:1,
     explain:"誤り。力は受けていますが、その合力が 0 なので静止しています。"},
    {id:"rd5",type:"choice",prompt:"糸の張力は、糸に沿って物体を引く向きにはたらく。",options:TF,answer:0,
     explain:"正しい。糸は引くことはできても、押すことはできません。"},
    {id:"rd6",type:"choice",prompt:"質量 2.0 kg の物体の重さは 2.0 kg である。",options:TF,answer:1,
     explain:"誤り。重さ（重力の大きさ）は mg ＝ 19.6 N。kg は質量の単位です。"}
  ]},
  { title:"E. 問題文を「力の表」に置き換える", lead:"解かなくてよい。",
    quote:"質量 3.0 kg の箱が水平な床に置かれている。この箱を、上から手で 10 N の力で押した。箱は静止したままである。床が箱に及ぼす垂直抗力の大きさを求めよ。", qs:[
    {id:"re1",type:"blanks",prompt:"箱が受ける力を整理する。",
     text:"{0}が箱に及ぼす重力：{1}向き<br>{2}が箱を押す力：下向き 10 N<br>床が箱に及ぼす垂直抗力：{3}向き",
     options:[["床","地球","手"],["上","下"],["床","地球","手"],["上","下"]],answer:[1,1,2,0],
     explain:"箱が受ける力は、地球からの重力、手からの力、床からの垂直抗力の3つです。"},
    {id:"re2",type:"choice",prompt:"この問題で「N ＝ mg ＝ 29.4 N」と答えた生徒は、何を見落としているか。",
     options:["手が箱を押す力","箱が床を押す力","床が箱に及ぼす摩擦力"],answer:0,
     explain:"箱が受ける下向きの力は重力と手の力の2つ。N ＝ 29.4 ＋ 10 ＝ 39.4 N になります。"}
  ]}]
},
{ id:"dim", tab:"③次元", title:"③ 次元チェック",
  intro:"この単元の要は、質量〔kg〕と力〔N〕の区別です。1 N ＝ 1 kg·m/s²。",
  advice:"kg と N を区別し、式を書いたら右辺の単位を確かめよう。",
  ref:{label:"単位の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", qs:[
    {id:"da1",type:"choice",prompt:"m × g",options:UNITQ,answer:0,two:true,explain:"kg × m/s² ＝ N。重力です。"},
    {id:"da2",type:"choice",prompt:"k × x",options:UNITQ,answer:0,two:true,explain:"(N/m) × m ＝ N。弾性力です。"},
    {id:"da3",type:"choice",prompt:"F ÷ k",options:UNITQ,answer:1,two:true,explain:"N ÷ (N/m) ＝ m。ばねの伸びです。"},
    {id:"da4",type:"choice",prompt:"mg ÷ x",options:UNITQ,answer:2,two:true,explain:"N ÷ m ＝ N/m。ばね定数です。"},
    {id:"da5",type:"choice",prompt:"F ÷ g",options:UNITQ,answer:3,two:true,explain:"N ÷ (m/s²) ＝ kg。質量です。"}
  ]},
  { title:"B. 式の次元を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、次元が合わないものをすべて選べ（W は重力、F は力、x は伸び）。",
     options:["W ＝ mg","W ＝ m ÷ g","F ＝ kx","x ＝ k ÷ mg","x ＝ mg ÷ k"],answer:[1,3],
     explain:"m ÷ g の単位は kg·s²/m、k ÷ mg の単位は 1/m で、どちらも左辺と合いません。"}
  ]},
  { title:"C. 次元チェックの限界", lead:"ばねでつるした質量 m のおもりが静止している。ばねの伸びを「x ＝ 2mg ÷ k」と書いた。", qs:[
    {id:"dc1",type:"choice",prompt:"この式について正しいものはどれか。",
     options:["次元が合わないので誤り","次元は合うが、正しくは x ＝ mg ÷ k","正しい"],answer:1,
     explain:"係数 2 には次元がないので、次元チェックでは見つかりません。"},
    {id:"dc2",type:"choice",prompt:"このような誤りに気づくには、次元のほかに何を確かめればよいか。",
     options:["つり合いの式（kx ＝ mg）に戻って確かめる","有効数字をそろえる","g を 10 m/s² にして計算し直す"],answer:0,
     explain:"式を立てた根拠（つり合い）に戻るのが確実です。"}
  ]},
  { title:"D. 答案の誤りを見つける", lead:"問「ばね定数 49 N/m のばねに、質量 2.0 kg のおもりをつるした。ばねの伸びを求めよ。」",
    quote:"答案：x ＝ m ÷ k ＝ 2.0 ÷ 49 ≒ 0.041 m", qs:[
    {id:"dd1",type:"choice",prompt:"単位だけを手がかりにすると、この答案の誤りは何か。",
     options:["m ÷ k の単位は長さにならない（質量と力を混同している）","k の単位が違う","有効数字が違う"],answer:0,
     explain:"kg ÷ (N/m) は m になりません。ばねを引くのは質量ではなく重力 mg です。"},
    {id:"dd2",type:"num",prompt:"正しい伸びを求めよ。",answer:0.40,tol:0.005,unit:"m",
     traps:{"0.041":"質量ではなく重力 mg で考えます。","40":"単位は m です。cm で答えていませんか。"},
     explain:"x ＝ mg ÷ k ＝ 2.0 × 9.8 ÷ 49 ＝ 0.40 m。"}
  ]},
  { title:"E. 単位をそろえる", qs:[
    {id:"de1",type:"num",prompt:"ばね定数 50 N/m のばねを 4.0 cm 伸ばすのに必要な力は何 N か。",answer:2.0,tol:0.02,unit:"N",
     traps:{"200":"cm を m に直していますか。4.0 cm ＝ 0.040 m です。"},explain:"F ＝ kx ＝ 50 × 0.040 ＝ 2.0 N。"},
    {id:"de2",type:"choice",prompt:"「体重 60 kg」を、物理の言葉で正確に言い直したものはどれか。",
     options:["重さ 60 kg","質量 60 kg","重力 60 kg"],answer:1,
     explain:"kg は質量の単位。重さ（重力の大きさ）は N で表します。"},
    {id:"de3",type:"num",prompt:"質量 60 kg の人が受ける重力の大きさは何 N か。",answer:588,tol:3,unit:"N",
     traps:{"60":"それは質量です。重力は mg です。","6.1":"掛け算です。W ＝ mg。"},explain:"W ＝ 60 × 9.8 ＝ 588 N（約 5.9 × 10² N）。"}
  ]}]
},
{ id:"step", tab:"④手順", title:"④ 手順固定の演習",
  intro:"つり合いの問題は7ステップで解きます。g ＝ 9.8 m/s²。",
  advice:"着目物体と受ける力を書き出してから、軸ごとにつり合いの式を立てよう。",
  ref:{label:"7ステップを見る", html:STEPS},
  groups:[
  { title:"問題1（すべてのステップ）",
    quote:"ばね定数 49 N/m の軽いばねの上端を天井に固定し、下端に質量 2.0 kg のおもりをつるした。おもりは静止している。ばねの伸びを求めよ。", qs:[
    {id:"s11",type:"choice",prompt:"ステップ1　着目物体はどれか。",options:["ばね","おもり","天井"],answer:1,
     explain:"伸びを決めているのはおもりが受ける力のつり合いです。"},
    {id:"s12",type:"multi",prompt:"ステップ2　おもりが受ける力をすべて選べ。",
     options:["地球がおもりに及ぼす重力（下向き）","ばねがおもりに及ぼす弾性力（上向き）","おもりがばねを引く力（下向き）","天井がばねを引く力（上向き）"],answer:[0,1],
     explain:"おもりが触れているのはばねだけ。重力と弾性力の2つです。ほかの2つは、ばねが受ける力です。"},
    {id:"s13",type:"choice",prompt:"ステップ3・4　上向きを正として、つり合いの式を立てよ。",options:["kx − mg ＝ 0","kx ＋ mg ＝ 0","kx ＝ m"],answer:0,
     explain:"上向きの力 kx と下向きの力 mg の合力が 0。"},
    {id:"s14",type:"choice",prompt:"ステップ5　x を文字式で表し、単位を確かめる。",
     options:["x ＝ mg ÷ k、単位は N ÷ (N/m) ＝ m","x ＝ k ÷ mg、単位は (N/m) ÷ N ＝ 1/m","x ＝ m ÷ k、単位は kg ÷ (N/m)"],answer:0,
     explain:"kx ＝ mg より x ＝ mg ÷ k。長さの単位になっています。"},
    {id:"s15",type:"num",prompt:"ステップ6　ばねの伸び",answer:0.40,tol:0.005,unit:"m",
     traps:{"0.041":"質量ではなく重力 mg を使います。","2.5":"k ÷ mg になっていませんか。"},explain:"x ＝ 2.0 × 9.8 ÷ 49 ＝ 0.40 m。"},
    {id:"s16",type:"choice",prompt:"ステップ7　質量を 2 倍にすると、伸びはどうなるはずか。",options:["2 倍","½ 倍","変わらない"],answer:0,
     explain:"x ＝ mg ÷ k なので伸びは質量に比例。重いほど伸びるという感覚と合っています。"}
  ]},
  { title:"問題2（ステップ1〜2だけ誘導）",
    quote:"質量 3.0 kg の箱が水平な床に置かれている。この箱を上から手で 10 N の力で押したが、箱は静止したままだった。(1) 床が箱に及ぼす垂直抗力の大きさを求めよ。(2) (1) の力の反作用は、何が何に及ぼす力か。", qs:[
    {id:"s21",type:"multi",prompt:"ステップ1・2　箱に着目する。箱が受ける力をすべて選べ。",
     options:["地球が箱に及ぼす重力","手が箱を押す力","床が箱に及ぼす垂直抗力","箱が床を押す力"],answer:[0,1,2],
     explain:"箱が触れているのは手と床。重力を加えて3つです。「箱が床を押す力」は床が受ける力です。"},
    {id:"s22",type:"num",prompt:"(1) 垂直抗力の大きさ",answer:39.4,tol:0.2,unit:"N",
     traps:{"29.4":"手が押す力を忘れていませんか。","19.4":"手の力は下向きです。重力と同じ向きに加えます。","13":"質量ではなく重力 mg を使います。"},
     explain:"上向き N ＝ 下向き（29.4 ＋ 10）より N ＝ 39.4 N。垂直抗力は mg と等しいとは限りません。"},
    {id:"s23",type:"choice",prompt:"(2) (1) の力の反作用はどれか。",
     options:["地球が箱に及ぼす重力","箱が床を押す力（下向き 39.4 N）","手が箱を押す力"],answer:1,
     explain:"「床が箱に」の反作用は「箱が床に」。同じ大きさで逆向きです。"}
  ]},
  { title:"問題3（答えだけ入力・力の分解）", lead:"紙に7ステップを書いて解き、答えを入力せよ。cos 30° ≒ 0.866、tan 30° ≒ 0.577。",
    quote:"質量 1.0 kg のおもりを糸でつるし、おもりに水平方向の力 F を加えたところ、糸が鉛直方向と 30° の角をなして静止した。", figure:STRING30, qs:[
    {id:"s31",type:"num",prompt:"(1) 糸の張力の大きさ T（有効数字2桁）",answer:11,tol:0.35,unit:"N",
     traps:{"9.8":"張力のうち重力とつり合うのは鉛直成分だけです。T cos 30° ＝ mg。","19.6":"sin 30° で割っていませんか。鉛直成分は T cos 30° です。","8.5":"cos 30° を掛けていませんか。T ＝ mg ÷ cos 30° です。"},
     explain:"鉛直方向：T cos 30° ＝ mg より T ＝ 9.8 ÷ 0.866 ≒ 11 N（11.3 N）。"},
    {id:"s32",type:"num",prompt:"(2) 力 F の大きさ（有効数字2桁）",answer:5.7,tol:0.1,unit:"N",
     traps:{"4.9":"mg sin 30° ではありません。水平方向のつり合い T sin 30° ＝ F を使います。","17":"tan 30° で割っていませんか。F ＝ mg tan 30° です。"},
     explain:"水平方向：F ＝ T sin 30° ＝ mg tan 30° ≒ 9.8 × 0.577 ≒ 5.7 N。"},
    {id:"s33",type:"checklist",prompt:"解き終えたら点検しよう（採点には入りません）。",
     items:["着目物体を1つに決めた","受ける力を、重力と触れている物体の数だけ挙げた","斜めの力を、軸の方向に分解した","軸ごとにつり合いの式を立てた","文字式で解いてから数値を入れた"]},
    {id:"s34",type:"self",prompt:"(1) の答えが mg（9.8 N）より大きくなる理由を説明せよ。",
     model:"重力とつり合うのは張力の鉛直成分 T cos 30° だけである。cos 30° は 1 より小さいので、T cos 30° ＝ mg となるには T が mg より大きくなければならない。"}
  ]}]
},
{ id:"sum", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。力を「誰が・誰に」で特定し、つり合いと作用・反作用を見分けます。場面：天井から糸でおもりをつるし、静止している。",
  advice:"2力を比べるときは、「その力を受けている物体はどれか」をまず確かめよう。",
  groups:[{ title:"力を特定する", qs:[
    {id:"m1",type:"choice",prompt:"おもりが受ける重力とつり合っている力はどれか。",
     options:["おもりが糸を引く力","糸がおもりに及ぼす張力","おもりが地球を引く力"],answer:1,
     explain:"おもりが受ける力は重力と張力の2つ。この2つがつり合っています。"},
    {id:"m2",type:"choice",prompt:"おもりが受ける重力（地球がおもりに及ぼす力）の反作用はどれか。",
     options:["糸がおもりに及ぼす張力","おもりが地球に及ぼす引力","天井が糸を引く力"],answer:1,
     explain:"「地球がおもりに」の反作用は「おもりが地球に」です。張力はつり合いの相手であって、反作用ではありません。"},
    {id:"m3",type:"choice",prompt:"糸がおもりを引く力の反作用はどれか。",
     options:["おもりが糸を引く力","地球がおもりに及ぼす重力","天井が糸を引く力"],answer:0,
     explain:"「糸がおもりに」の反作用は「おもりが糸に」。"},
    {id:"m4",type:"choice",prompt:"糸を切ると、おもりは落下する。落下中も、地球がおもりを引く力の反作用は存在するか。",
     options:["存在しない。つり合っていないから","存在する。おもりが地球を引いている","糸がないので存在しない"],answer:1,
     explain:"作用・反作用は、つり合っていなくても、動いていても成り立ちます。"},
    {id:"m5",type:"choice",prompt:"「つり合いの2力」と「作用・反作用の2力」を見分けるには、何を確かめればよいか。",
     options:["2力の大きさが等しいか","2力の向きが逆か","2力を受けている物体が同じか別々か"],answer:2,
     explain:"大きさと向きはどちらも同じ条件。見分ける手がかりは、力を受ける物体です。"},
    {id:"m6",type:"blanks",prompt:"次の文を完成させよ。",text:"力を見つけるときは、まず{0}を決め、{1}と、{2}から受ける力を書く。",
     options:[["正の向き","着目物体","原点"],["重力","張力","垂直抗力"],["近くにある物体","触れている物体","重い物体"]],answer:[1,0,1],
     explain:"この手順は、次の単元「運動の法則」でもそのまま使います。"}
  ]}]
}
];

registerUnit({
  id: "force",
  title: "力とつり合い",
  sections: SECTIONS
});
})();
