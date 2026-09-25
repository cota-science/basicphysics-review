/*
 * 単元：速度・加速度（運動の表し方）
 * このファイルは units/index.js の file に "units/kinematics.js" と書くと読み込まれます。
 * 書き方は units/TEMPLATE.js を参照してください。
 */
(function(){
const FORMULAS = `<p class="formula">v ＝ v₀ ＋ at　（x を含まない）</p><p class="formula">x ＝ v₀t ＋ ½at²　（v を含まない）</p><p class="formula">v² − v₀² ＝ 2ax　（t を含まない）</p>`;
const DEF_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>定義</th><th>単位</th><th>向き</th></tr>
<tr><td>位置 x</td><td>原点から測った、ある時刻に物体がいる場所</td><td>m</td><td>あり</td></tr>
<tr><td>変位 Δx</td><td>位置の変化。後の位置 − 前の位置</td><td>m</td><td>あり</td></tr>
<tr><td>速さ</td><td>単位時間あたりに進む道のり</td><td>m/s</td><td>なし</td></tr>
<tr><td>速度 v</td><td>単位時間あたりの変位。速さに向きを加えた量</td><td>m/s</td><td>あり</td></tr>
<tr><td>平均の速度</td><td>変位 ÷ かかった時間</td><td>m/s</td><td>あり</td></tr>
<tr><td>加速度 a</td><td>単位時間あたりの<b>速度</b>の変化</td><td>m/s²</td><td>あり</td></tr>
</table></div>
<p class="formula">平均の速度 ＝ Δx ÷ Δt　　加速度 a ＝ Δv ÷ Δt</p>${FORMULAS}`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th><th>次元</th></tr>
<tr><td>変位 x</td><td>m</td><td>〔L〕</td></tr>
<tr><td>時間 t</td><td>s</td><td>〔T〕</td></tr>
<tr><td>速度 v</td><td>m/s</td><td>〔L〕/〔T〕</td></tr>
<tr><td>加速度 a</td><td>m/s²</td><td>〔L〕/〔T〕²</td></tr></table></div>`;
const VT_GRAPH = `<svg class="graph" viewBox="0 0 320 170" role="img" aria-label="右下がりの直線のv-tグラフ。t軸と交わった後、t軸の下に入る。">
<line x1="30" y1="90" x2="305" y2="90" stroke="currentColor" stroke-width="1.5"/>
<line x1="30" y1="160" x2="30" y2="10" stroke="currentColor" stroke-width="1.5"/>
<polygon points="30,90 30,30 180,90" fill="var(--blue)" opacity=".15"/>
<polygon points="180,90 270,126 270,90" fill="var(--red)" opacity=".15"/>
<line x1="30" y1="30" x2="270" y2="126" stroke="var(--blue)" stroke-width="3"/>
<text x="300" y="108" font-size="14" fill="currentColor">t</text>
<text x="10" y="20" font-size="14" fill="currentColor">v</text>
<text x="18" y="96" font-size="12" fill="currentColor">0</text>
<text x="170" y="110" font-size="12" fill="currentColor">交点</text>
</svg>`;
const DIR = ["大きくなる","小さくなる"];
const TF = ["正しい","誤り"];
const UNITQ = ["m/s（速度）","m（変位）","s（時間）","m/s²（加速度）"];

const SECTIONS = [
{ id:"def", advice:"変位・速度・加速度の定義を、定義カードで言葉と単位ごと覚え直そう。", tab:"①定義", title:"① 定義カード", back:"① 定義カード",
  intro:"定義を正確に言えるかを確かめます。迷ったら定義カードを開いて確認してから答えましょう。",
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"blanks",text:"変位とは、{0}の変化であり、後の位置 − {1}で求める。単位は{2}。",
     options:[["道のり","位置","速度"],["原点","前の位置","後の位置"],["m","m/s","m/s²"]],answer:[1,1,0],
     explain:"変位は「位置の変化」。後の位置から前の位置を引きます。道のりとは違い、往復すると 0 になります。"},
    {id:"d2",type:"blanks",text:"速度とは、単位時間あたりの{0}であり、速さに{1}を加えた量である。",
     options:[["道のり","変位","加速度"],["時間","距離","向き"]],answer:[1,2],
     explain:"速度は単位時間あたりの変位です。向きをもつので「速さ＋向き」といえます。"},
    {id:"d3",type:"blanks",text:"加速度とは、単位時間あたりの{0}の変化であり、単位は{1}である。",
     options:[["位置","速度","道のり"],["m/s","m","m/s²"]],answer:[1,2],
     explain:"加速度は速度の変化の割合です。単位は (m/s)/s ＝ m/s²。"},
    {id:"d4",type:"blanks",text:"加速度の単位 m/s² は、「{0}あたり、速度が何{1}変化するか」を表している。",
     options:[["1 m","1 s","1 m/s"],["m/s","m","m/s²"]],answer:[1,0],
     explain:"m/s² ＝ (m/s)/s。「1 s あたり速度が何 m/s 変わるか」と読みます。"},
    {id:"d5",type:"choice",prompt:"速度が負で加速度も負のとき、物体の速さはどうなっていくか。",
     options:["大きくなる","小さくなる","変わらない"],answer:0,
     explain:"v と a が同じ符号なら、速さは大きくなります。負どうしでも同じです（−2 → −4 → −6 m/s）。"},
    {id:"d6",type:"choice",prompt:"等加速度直線運動の3式のうち、時間 t を含まない式はどれか。",
     options:["v ＝ v₀ ＋ at","x ＝ v₀t ＋ ½at²","v² − v₀² ＝ 2ax"],answer:2,
     explain:"v² − v₀² ＝ 2ax には t がありません。3式は「使わない量」で選びます。"}
  ]}]
},
{ id:"read", advice:"「静止」「止まる」などを数値にすること、正の向きを先に決めることを練習しよう。", tab:"②読解", title:"② 読解ドリル", back:"② 読解ドリル",
  intro:"電卓は使いません。問題文の言葉を、量・符号・図に置き換える練習です。",
  groups:[
  { title:"A. 隠れた情報を数値にする", lead:"次の言い回しは、どの量が何であることを表しているか。", qs:[
    {id:"ra1",type:"choice",prompt:"「静止していた自動車が動き出した。」",options:["v ＝ 0（最後の速度）","v₀ ＝ 0","a ＝ 0"],answer:1,
     explain:"「静止していた」ははじめの状態なので、はじめの速度 v₀ ＝ 0 です。"},
    {id:"ra2",type:"choice",prompt:"「一定の割合で速さを増しながら進んだ。」",options:["a ＝ 0","v が一定","a が一定（速度と同じ向き）"],answer:2,
     explain:"速さが一定の割合で増える → 加速度が一定。速さが増えるので、a は速度と同じ向きです。"},
    {id:"ra3",type:"choice",prompt:"「ブレーキをかけて、やがて止まった。」",options:["最後の速度 v ＝ 0","a ＝ 0","v₀ ＝ 0"],answer:0,
     explain:"「止まった」は最後の状態なので、最後の速度 v ＝ 0 です。"},
    {id:"ra4",type:"choice",prompt:"「真上に投げたボールが最高点に達した。」",options:["v ＝ 0 かつ a ＝ 0","v ＝ 0 だが a は 0 ではない","a ＝ 0 だが v は 0 ではない"],answer:1,
     explain:"最高点では一瞬速度が 0 になりますが、重力による加速度ははたらき続けています。"},
    {id:"ra5",type:"choice",prompt:"「等速で走っている。」",options:["a ＝ 0","v ＝ 0","a が一定で 0 でない"],answer:0,
     explain:"等速 → 速度が変わらない → 加速度 a ＝ 0 です。"}
  ]},
  { title:"B. 符号を言葉にする・言葉を符号にする", lead:"東向きを正とする。", qs:[
    {id:"rb1",type:"choice",prompt:"「速度 −4 m/s」を言い換えたものとして正しいのはどれか。",
     options:["東向きに進みながら、4 m/s ずつ遅くなっている","西向きに速さ 4 m/s で動いている","東向きに速さ 4 m/s で動いている"],answer:1,
     explain:"負の符号は「西向き」を表します。速さ（大きさ）は 4 m/s です。"},
    {id:"rb2",type:"num",prompt:"「西向きに 3 m/s² の加速度」を符号つきの数値で表せ。",answer:-3,tol:0.001,unit:"m/s²",
     traps:{"3":"大きさは合っています。西向きは正・負のどちらでしょう。"},
     explain:"西向きは負なので −3 m/s² です。"},
    {id:"rb3",type:"blanks",prompt:"次の物体の速さは、大きくなるか、小さくなるか。",
     text:"(a) v ＞ 0, a ＞ 0 → {0}<br>(b) v ＞ 0, a ＜ 0 → {1}<br>(c) v ＜ 0, a ＜ 0 → {2}<br>(d) v ＜ 0, a ＞ 0 → {3}",
     options:[DIR,DIR,DIR,DIR],answer:[0,1,0,1],
     explain:"v と a が同符号なら速さは大きく、異符号なら小さくなります。(c) は負の向きにどんどん速くなる運動です。"},
    {id:"rb4",type:"self",prompt:"上の結果から、「加速度が負なら減速している」という言い方が正しくない理由を説明せよ。",
     model:"速さが小さくなるのは v と a の符号が逆のときで、a の符号だけでは決まらない。(c) のように v も a も負なら、速さは大きくなる。"}
  ]},
  { title:"C. 正しいか、誤りか", lead:"正誤を答え、解説で正しい言い方を確かめよう。", qs:[
    {id:"rc1",type:"choice",prompt:"物体が一往復してもとの位置に戻ったとき、変位は往復した道のりの2倍である。",options:TF,answer:1,
     explain:"誤り。もとの位置に戻ったので変位は 0 です。道のりは片道の2倍です。"},
    {id:"rc2",type:"choice",prompt:"加速度が 0 の物体は静止している。",options:TF,answer:1,
     explain:"誤り。a ＝ 0 は「速度が変わらない」という意味で、等速で動いている場合もあります。"},
    {id:"rc6",type:"choice",prompt:"速度が −5 m/s のまま変わらない物体の加速度は 0 である。",options:TF,answer:0,
     explain:"正しい。速度が負でも、変化していなければ加速度は 0 です。"},
    {id:"rc3",type:"choice",prompt:"速度が 0 の瞬間は、加速度も必ず 0 である。",options:TF,answer:1,
     explain:"誤り。投げ上げの最高点では v ＝ 0 ですが、加速度は 0 ではありません。"},
    {id:"rc4",type:"choice",prompt:"速度が大きい物体ほど、加速度も大きい。",options:TF,answer:1,
     explain:"誤り。高速でも等速なら a ＝ 0 です。加速度は速度の「変化」の割合です。"},
    {id:"rc5",type:"choice",prompt:"平均の速度は、最初の速度と最後の速度を足して2で割れば必ず求まる。",options:TF,answer:1,
     explain:"誤り。それが成り立つのは等加速度直線運動のときだけです。一般には「変位 ÷ 時間」で求めます。"}
  ]},
  { title:"D. 問題文を表に置き換える", lead:"次の問題文を読み、表を完成させよ。解かなくてよい。",
    quote:"東向きに 15 m/s で走っていた自動車が、ブレーキをかけて一定の加速度で減速し、40 m 進んで停止した。このときの加速度を求めよ。", qs:[
    {id:"rd1",type:"blanks",text:"正の向き：{0}<br>v₀ ＝ {1}<br>v ＝ {2}<br>x ＝ {3}<br>t ＝ {4}",
     options:[["西","東"],["0","＋15 m/s","−15 m/s"],["＋15 m/s","わからない","0"],["＋40 m","わからない","−40 m"],["0","40 s","わからない"]],answer:[1,1,2,0,2],
     explain:"進む向き（東）を正にすると、v₀ ＝ ＋15 m/s、「停止した」から v ＝ 0、x ＝ ＋40 m。時間は書かれていません。"},
    {id:"rd2",type:"choice",prompt:"この問題で使う式はどれか。",
     options:["t がわからず求めもしないので、v² − v₀² ＝ 2ax","x がわからないので、v ＝ v₀ ＋ at","a を求めるので、x ＝ v₀t ＋ ½at²"],answer:0,
     explain:"わからず、求めもしない量は t。t を含まない v² − v₀² ＝ 2ax を使います。"}
  ]},
  { title:"E. グラフを言葉で読む", lead:"次の v-t グラフについて答えよ。", figure:VT_GRAPH, qs:[
    {id:"re1",type:"blanks",text:"グラフの傾きは{0}を表し、単位は (m/s) ÷ (s) ＝ {1}である。",
     options:[["速度","変位","加速度"],["m","m/s²","m/s"]],answer:[2,1],
     explain:"傾き ＝ 速度の変化 ÷ 時間 ＝ 加速度。単位は m/s²。"},
    {id:"re2",type:"blanks",text:"グラフと t 軸で囲まれた面積は{0}を表し、単位は (m/s) × (s) ＝ {1}である。",
     options:[["加速度","変位","時間"],["m","m/s²","s"]],answer:[1,0],
     explain:"面積 ＝ 速度 × 時間 ＝ 変位。単位は m。"},
    {id:"re3",type:"choice",prompt:"グラフが t 軸より下にある区間（赤い部分）では、物体はどちらの向きに進んでいるか。",options:["正の向き","負の向き"],answer:1,
     explain:"v ＜ 0 なので、負の向きに進んでいます。"},
    {id:"re4",type:"choice",prompt:"直線が t 軸と交わる時刻に、物体はどうなっているか。",
     options:["加速度が 0 になる","出発点に戻る","一瞬静止し、向きが変わる"],answer:2,
     explain:"v ＝ 0 なので一瞬静止し、そこから向きが変わります。加速度（傾き）は変わっていません。"}
  ]}]
},
{ id:"dim", advice:"式を書いたら、両辺の単位がそろっているか確かめる習慣をつけよう。", tab:"③次元", title:"③ 次元チェック", back:"③ 次元チェック",
  intro:"式の両辺は、必ず同じ種類の量（同じ次元）でなければなりません。長さを〔L〕、時間を〔T〕と書きます。",
  ref:{label:"次元の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", lead:"次の組み合わせの単位と、それが何の量かを選べ。", qs:[
    {id:"da1",type:"choice",prompt:"加速度 × 時間",options:UNITQ,answer:0,explain:"(m/s²) × s ＝ m/s。速度（の変化）です。",two:true},
    {id:"da2",type:"choice",prompt:"速度 × 時間",options:UNITQ,answer:1,explain:"(m/s) × s ＝ m。変位です。",two:true},
    {id:"da3",type:"choice",prompt:"速度 ÷ 加速度",options:UNITQ,answer:2,explain:"(m/s) ÷ (m/s²) ＝ s。時間です。",two:true},
    {id:"da4",type:"choice",prompt:"加速度 × 時間²",options:UNITQ,answer:1,explain:"(m/s²) × s² ＝ m。変位です。",two:true},
    {id:"da5",type:"choice",prompt:"速度² ÷ 加速度",options:UNITQ,answer:1,explain:"(m/s)² ÷ (m/s²) ＝ m。変位です。",two:true}
  ]},
  { title:"B. 式の次元を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、次元が合わないものをすべて選べ。",
     options:["v ＝ at²","x ＝ v₀t ＋ at","v² − v₀² ＝ 2ax","t ＝ v ÷ a","x ＝ v²t"],answer:[0,1,4],
     explain:"v ＝ at² は右辺が〔L〕、x ＝ v₀t ＋ at は at が〔L〕/〔T〕、x ＝ v²t は右辺が〔L〕²/〔T〕で合いません。"}
  ]},
  { title:"C. 次元チェックの限界", lead:"静止から等加速度で速度 v になるまでの変位を「x ＝ v² ÷ a」と書いた。次元は合っている。", qs:[
    {id:"dc1",type:"choice",prompt:"この式の誤りは何か。",options:["次元が合っていない","係数 1/2 が抜けている","符号が逆になっている"],answer:1,
     explain:"正しくは x ＝ v² ÷ 2a。係数 1/2 には次元がないので、次元チェックでは見つかりません。"},
    {id:"dc2",type:"choice",prompt:"次元チェックでは見つけられない誤りはどれか。",options:["at を変位だと思って使った","v と v² を取り違えた","係数を ½ と 2 で取り違えた"],answer:2,
     explain:"係数や符号には次元がないため、次元チェックでは見つかりません。量の取り違えは見つけられます。"}
  ]},
  { title:"D. 答案の誤りを見つける", lead:"問「静止していた物体が一定の加速度 2.0 m/s² で 5.0 s 間運動した。この間の変位を求めよ。」",
    quote:"答案：x ＝ at ＝ 2.0 × 5.0 ＝ 10 m", qs:[
    {id:"dd1",type:"choice",prompt:"単位だけを手がかりにすると、この答案の誤りは何か。",
     options:["数値の掛け算を間違えている","at の単位は m/s で、変位ではなく速度になっている","有効数字の桁数が違う"],answer:1,
     explain:"(m/s²) × s ＝ m/s。at は速度であって変位ではありません。"},
    {id:"dd2",type:"num",prompt:"正しい変位を求めよ。",answer:25,tol:0.3,unit:"m",
     traps:{"10":"それは at（速度）の値です。変位は x ＝ ½at² で求めます。","50":"½ が抜けていませんか。x ＝ ½at² です。"},
     explain:"x ＝ ½at² ＝ ½ × 2.0 × 5.0² ＝ 25 m。"}
  ]},
  { title:"E. 単位を換算する", lead:"1 km ＝ 1000 m、1 h ＝ 3600 s。単位も数値と同じように掛け算・割り算できる。", qs:[
    {id:"de1",type:"num",prompt:"72 km/h を m/s で表せ。",answer:20,tol:0.05,unit:"m/s",
     explain:"72 × 1000 m ÷ 3600 s ＝ 20 m/s。"},
    {id:"de2",type:"num",prompt:"36 km/h を m/s で表せ。",answer:10,tol:0.05,unit:"m/s",explain:"36 × 1000 ÷ 3600 ＝ 10 m/s。"},
    {id:"de3",type:"num",prompt:"90 km/h を m/s で表せ。",answer:25,tol:0.05,unit:"m/s",explain:"90 × 1000 ÷ 3600 ＝ 25 m/s。"}
  ]}]
},
{ id:"step", advice:"式を選ぶ理由を書いてから代入しよう。7ステップを飛ばさないこと。", tab:"④手順", title:"④ 手順固定の演習", back:"④ 手順固定の演習",
  intro:"7つのステップで解きます。①正の向き → ②既知・未知 → ③式を選ぶ → ④文字式 → ⑤次元 → ⑥数値 → ⑦妥当性。問題1はすべてのステップ、問題2は一部、問題3は答えだけを入力します。",
  ref:{label:"3式を見る", html:FORMULAS},
  groups:[
  { title:"問題1（すべてのステップ）",
    quote:"東向きに 15 m/s で走っていた自動車が、ブレーキをかけて一定の加速度で減速し、40 m 進んで停止した。このときの加速度を求めよ。", qs:[
    {id:"s11",type:"choice",prompt:"ステップ1　正の向きをどちらにとるか（ここでは進む向きにとる）。",options:["西向き","東向き"],answer:1,
     explain:"進む向き（東）を正にすると、v₀ が正になり考えやすくなります。"},
    {id:"s12",type:"blanks",prompt:"ステップ2　既知・未知を整理する。",text:"v₀ ＝ {0}　v ＝ {1}　x ＝ {2}　t ＝ {3}",
     options:[["＋15 m/s","0","−15 m/s"],["＋15 m/s","わからない","0"],["−40 m","＋40 m","わからない"],["わからない","0","40 s"]],answer:[0,2,1,0],
     explain:"「停止した」から v ＝ 0。t は問題文にありません。"},
    {id:"s13",type:"choice",prompt:"ステップ3　使う式とその理由。",
     options:["a を求めたいので v ＝ v₀ ＋ at","t がわからず求めもしないので v² − v₀² ＝ 2ax","x がわかっているので x ＝ v₀t ＋ ½at²"],answer:1,
     explain:"不要な量 t を含まない式を選びます。"},
    {id:"s14",type:"choice",prompt:"ステップ4　a を文字式で表す。",options:["a ＝ (v − v₀) ÷ x","a ＝ 2x ÷ (v² − v₀²)","a ＝ (v² − v₀²) ÷ 2x"],answer:2,
     explain:"v² − v₀² ＝ 2ax の両辺を 2x で割ります。"},
    {id:"s15",type:"choice",prompt:"ステップ5　右辺の単位を確かめる。",options:["(m/s)² ÷ m ＝ m/s²","(m/s) ÷ m ＝ 1/s","m ÷ (m/s)² ＝ s²/m"],answer:0,
     explain:"(m²/s²) ÷ m ＝ m/s²。加速度の単位になっているので式は正しいと確かめられます。"},
    {id:"s16",type:"num",prompt:"ステップ6　数値を代入して a を求めよ（有効数字2桁、符号もつける）。",answer:-2.8,tol:0.02,unit:"m/s²",
     traps:{"2.8":"大きさは合っています。減速しているとき、a の符号は？","-5.6":"2x で割っていますか。","-0.375":"v² を使っていますか。(v − v₀) ではなく v² − v₀² です。"},
     explain:"a ＝ (0 − 15²) ÷ (2 × 40) ＝ −225 ÷ 80 ≒ −2.8 m/s²。"},
    {id:"s17",type:"choice",prompt:"ステップ7　答えの符号は妥当か。",
     options:["負なので、自動車は西向きに進んでいる","負で、東向きに進みながら減速していることと合っている","加速度は大きさなので、正でなければおかしい"],answer:1,
     explain:"v₀ ＞ 0、a ＜ 0 で異符号なので、速さが小さくなる。「減速」と合っています。"}
  ]},
  { title:"問題2（ステップ1〜3だけ誘導）",
    quote:"静止していた自転車が一定の加速度で動き出し、4.0 s 後に速さが 6.0 m/s になった。(1) 加速度の大きさ、(2) この 4.0 s 間に進んだ距離を求めよ。", qs:[
    {id:"s21",type:"blanks",prompt:"ステップ2　進む向きを正として、既知・未知を整理する。",text:"v₀ ＝ {0}　v ＝ {1}　t ＝ {2}　x ＝ {3}",
     options:[["6.0 m/s","0","わからない"],["0","6.0 m/s","わからない"],["4.0 s","わからない","0"],["わからない","6.0 m","24 m"]],answer:[1,1,0,0],
     explain:"「静止していた」から v₀ ＝ 0。x は (2) で求める量です。"},
    {id:"s22",type:"choice",prompt:"ステップ3　(1) で使う式。",options:["x がわからず求めもしないので v ＝ v₀ ＋ at","t がわかっているので x ＝ v₀t ＋ ½at²","v² − v₀² ＝ 2ax"],answer:0,
     explain:"(1) では x は不要なので、x を含まない式を使います。"},
    {id:"s23",type:"num",prompt:"(1) 加速度の大きさ",answer:1.5,tol:0.02,unit:"m/s²",
     traps:{"24":"掛けていませんか。a ＝ (v − v₀) ÷ t です。"},explain:"a ＝ (6.0 − 0) ÷ 4.0 ＝ 1.5 m/s²。"},
    {id:"s24",type:"num",prompt:"(2) 進んだ距離",answer:12,tol:0.1,unit:"m",
     traps:{"24":"½ が抜けていませんか。","6":"t² になっていますか。"},explain:"x ＝ ½at² ＝ ½ × 1.5 × 4.0² ＝ 12 m。（平均の速度 3.0 m/s × 4.0 s でも求まります）"}
  ]},
  { title:"問題3（答えだけ入力・符号に注意）", lead:"紙に7ステップを書いて解き、答えを入力せよ。東向きを正とする。",
    quote:"東向きに 10 m/s で動いている物体に、西向きに 2.0 m/s² の一定の加速度が生じている。", qs:[
    {id:"s31",type:"num",prompt:"(1) 物体が一瞬止まるのは何秒後か。",answer:5,tol:0.05,unit:"s",explain:"0 ＝ 10 − 2.0t より t ＝ 5.0 s。"},
    {id:"s32",type:"num",prompt:"(2) それまでに進む距離（向きは東）",answer:25,tol:0.2,unit:"m",
     traps:{"50":"½at² の項を忘れていませんか。","75":"a の符号は負です。"},explain:"x ＝ 10 × 5.0 − ½ × 2.0 × 5.0² ＝ 25 m（東向き）。"},
    {id:"s33",type:"num",prompt:"(3) 8.0 s 後の速度（符号つき）",answer:-6,tol:0.05,unit:"m/s",
     traps:{"6":"大きさは合っています。このとき物体はどちら向きに動いていますか。","26":"a の符号は負です。"},explain:"v ＝ 10 − 2.0 × 8.0 ＝ −6.0 m/s（西向きに 6.0 m/s）。"},
    {id:"s34",type:"num",prompt:"(3) 8.0 s 後の、出発点からの位置（符号つき）",answer:16,tol:0.2,unit:"m",
     traps:{"34":"34 m は道のり（25 m ＋ 9 m）です。問われているのは出発点からの位置です。","144":"a の符号は負です。","-16":"出発点より東にいるか西にいるか、図で確かめましょう。"},
     explain:"x ＝ 10 × 8.0 − ½ × 2.0 × 8.0² ＝ 16 m（出発点から東へ 16 m）。"},
    {id:"s35",type:"checklist",prompt:"解き終えたら、自分の答案を点検しよう（採点には入りません）。",
     items:["正の向きを最初に書いた","既知・未知を表にした（「止まる」→ v ＝ 0 を読み取った）","式を選んだ理由を書いた","数値の前に文字式で答えを出した","単位を確認した","答えの符号を「向き」の言葉に直した"]}
  ]}]
},
{ id:"sum", advice:"「わからず、求めもしない量」を見つけてから式を選ぼう。", tab:"まとめ", title:"単元のまとめ", back:"まとめ",
  intro:"計算はしません。「どの式を、なぜ使うか」だけを答えます。",
  ref:{label:"3式を見る", html:FORMULAS},
  groups:[{ title:"式を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"初速度・加速度・時間がわかっていて、そのときの速度を求めたい。",
     options:["v ＝ v₀ ＋ at","x ＝ v₀t ＋ ½at²","v² − v₀² ＝ 2ax"],answer:0,explain:"x がわからず求めもしないので、x を含まない式。"},
    {id:"m2",type:"choice",prompt:"初速度・加速度・時間がわかっていて、その間の変位を求めたい。",
     options:["v ＝ v₀ ＋ at","x ＝ v₀t ＋ ½at²","v² − v₀² ＝ 2ax"],answer:1,explain:"v が不要なので、v を含まない式。"},
    {id:"m3",type:"choice",prompt:"初速度・最後の速度・加速度がわかっていて、進んだ距離を求めたい。",
     options:["v ＝ v₀ ＋ at","x ＝ v₀t ＋ ½at²","v² − v₀² ＝ 2ax"],answer:2,explain:"t が不要なので、t を含まない式。"},
    {id:"m4",type:"choice",prompt:"初速度・最後の速度・進んだ距離がわかっていて、かかった時間を求めたい。",
     options:["v ＝ v₀ ＋ at だけで t が求まる","v² − v₀² ＝ 2ax で a を求め、次に v ＝ v₀ ＋ at で t を求める","この条件では解けない"],answer:1,
     explain:"不要な量は a ですが、a を含まない式は3式にありません。2段階で解きます（平均の速度 (v₀ ＋ v)/2 × t ＝ x でも可）。"},
    {id:"m5",type:"choice",prompt:"自動車が 10 s 間等速で走り、その後ブレーキをかけて一定の加速度で止まった。全体で進んだ距離の求め方は？",
     options:["全体を1つの等加速度運動として3式に代入する","等速の区間と減速の区間に分けて考える","最初と最後の速度の平均 × 全時間"],answer:1,
     explain:"全体は等加速度運動ではありません。区間ごとに運動の種類を見分けます。"},
    {id:"m6",type:"self",prompt:"次の文を自分の言葉で完成させよ。「運動の問題を解くとき、私が最初にすることは（　　）である。」",scored:false,
     model:"例：正の向きを決めて図をかき、わかっている量とわからない量を表にすること。"}
  ]}]
}
];

registerUnit({
  id: "kinematics",                 // units/index.js の id と同じにする
  title: "速度・加速度（運動の表し方）",
  sections: SECTIONS
});
})();

