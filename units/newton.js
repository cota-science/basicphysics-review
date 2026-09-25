/*
 * 単元：運動の法則
 * 「力とつり合い」で見つけた力の合力 F と、「速度・加速度」の a をつなぐ ma ＝ F。
 * 摩擦力（静止摩擦・最大摩擦・動摩擦）もこの単元で扱う。g ＝ 9.8 m/s²。
 */
(function(){

const DEF_TABLE = `<div class="tbl"><table>
<tr><th>用語</th><th>定義</th><th>式・単位</th></tr>
<tr><td>慣性の法則</td><td>合力が 0 なら、静止している物体は静止を続け、動いている物体は等速直線運動を続ける</td><td>―</td></tr>
<tr><td>運動の法則</td><td>加速度は合力に比例し、質量に反比例する。加速度の向きは合力の向き</td><td>a ＝ F ÷ m</td></tr>
<tr><td>運動方程式</td><td>着目物体について、質量 × 加速度 ＝ 受ける力の合力</td><td>ma ＝ F</td></tr>
<tr><td>1 N</td><td>質量 1 kg の物体に 1 m/s² の加速度を生じさせる力</td><td>1 N ＝ 1 kg·m/s²</td></tr>
<tr><td>静止摩擦力</td><td>静止している物体に面が及ぼす、すべり出しを妨げる力。外力に応じて変わる</td><td>つり合いの式で求める</td></tr>
<tr><td>最大摩擦力</td><td>静止摩擦力の最大値。超えるとすべり出す</td><td>F₀ ＝ μN</td></tr>
<tr><td>動摩擦力</td><td>すべっている物体に面が及ぼす、すべる向きと逆向きの力。速さによらない</td><td>F′ ＝ μ′N</td></tr>
</table></div><p>ma は力ではないので、力の図には描かない。μ, μ′ は単位のない数。</p>`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th></tr>
<tr><td>質量 m</td><td>kg</td></tr>
<tr><td>加速度 a, g</td><td>m/s²</td></tr>
<tr><td>力 F, N, T, F′</td><td>N ＝ kg·m/s²</td></tr>
<tr><td>摩擦係数 μ, μ′</td><td>なし</td></tr></table></div>`;
const STEPS = `<p>1 着目物体 → 2 受ける力をすべて挙げる → 3 軸と正の向き（加速度の向きを正に） → 4 加速度の方向は ma ＝ F、それ以外はつり合い → 5 文字式・次元 → 6 数値 → 7 妥当性</p>`;
const PULLEY = `<svg class="graph" viewBox="0 0 320 180" role="img" aria-label="水平な台の上の物体Aが糸で台の端の滑車につながり、滑車の先に物体Bがつるされている図">
<rect x="20" y="80" width="230" height="10" fill="currentColor" opacity=".55"/>
<rect x="30" y="90" width="10" height="80" fill="currentColor" opacity=".45"/>
<rect x="80" y="48" width="60" height="32" fill="var(--blue)" opacity=".3" stroke="var(--blue)"/>
<text x="104" y="69" font-size="14" fill="currentColor">A</text>
<circle cx="260" cy="76" r="12" fill="none" stroke="currentColor" stroke-width="2"/>
<line x1="248" y1="86" x2="252" y2="84" stroke="currentColor" stroke-width="2"/>
<line x1="140" y1="64" x2="260" y2="64" stroke="currentColor" stroke-width="1.5"/>
<line x1="272" y1="76" x2="272" y2="128" stroke="currentColor" stroke-width="1.5"/>
<rect x="256" y="128" width="32" height="32" fill="var(--red)" opacity=".3" stroke="var(--red)"/>
<text x="266" y="149" font-size="14" fill="currentColor">B</text>
<text x="70" y="40" font-size="12" fill="currentColor">2.0 kg</text>
<text x="210" y="148" font-size="12" fill="currentColor">1.0 kg</text>
</svg>`;
const TF = ["正しい","誤り"];
const UNITQ = ["N（力）","m/s²（加速度）","kg（質量）","単位なし"];

const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:"法則は3つ、摩擦力は3種類。摩擦力は「どの面がどの物体に及ぼすか」まで言えるようにします。",
  advice:"運動方程式の F は「合力」であること、静止摩擦力と動摩擦力の違いを覚え直そう。",
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"choice",prompt:"物体が受ける力の合力が 0 のとき、動いている物体はどうなるか。",
     options:["しだいに遅くなって止まる","等速直線運動を続ける","すぐに止まる"],answer:1,
     explain:"慣性の法則。動き続けるのに力は要りません。止まるのは、摩擦などの力を受けるからです。"},
    {id:"d2",type:"blanks",text:"運動方程式は ma ＝ F で、F は着目物体が受ける力の{0}である。ma は{1}。",
     options:[["うち最大のもの","合力","うち運動の向きのもの"],["力の一種なので力の図に描く","力ではないので力の図に描かない"]],answer:[1,1],
     explain:"F は受けるすべての力の合力。ma は「質量 × 加速度」であって、力ではありません。"},
    {id:"d3",type:"blanks",text:"1 N は、質量{0}の物体に{1}の加速度を生じさせる力である。",
     options:[["1 g","1 kg","9.8 kg"],["1 m/s²","9.8 m/s²","1 m/s"]],answer:[1,0],
     explain:"1 N ＝ 1 kg × 1 m/s² ＝ 1 kg·m/s²。"},
    {id:"d4",type:"blanks",text:"静止摩擦力の大きさは{0}。その最大値を最大摩擦力といい、{1}で表す。",
     options:[["いつも μN である","外力に応じて変わる"],["μN","μ′N","μmg ÷ N"]],answer:[1,0],
     explain:"静止摩擦力はつり合いの式で求めます。μN はその上限です。"},
    {id:"d5",type:"blanks",text:"動摩擦力の大きさは{0}で表され、物体の速さに{1}。",
     options:[["μN","μ′N","μ′m"],["比例する","よらない"]],answer:[1,1],
     explain:"動摩擦力 F′ ＝ μ′N は、速さによらず一定です。"},
    {id:"d6",type:"choice",prompt:"摩擦係数 μ の単位はどれか。",options:["N","N/kg","単位はない"],answer:2,
     explain:"F ＝ μN で、F も N も力の単位（N）なので、μ は単位のない数です。"}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル",
  intro:"「運動の向きの力」を描く癖を、「重力以外の力は触れている物体からしか受けない」という原則で直します。",
  advice:"力を描くたびに「その力を及ぼしているのは何か」と自分に問い、答えられない力は消そう。",
  groups:[
  { title:"A. 慣性を読む", qs:[
    {id:"ra1",type:"choice",prompt:"なめらかな氷の上を、物体が等速ですべっている。物体が受ける力の合力は？",
     options:["運動の向きに一定の大きさ","0","運動と逆向き"],answer:1,
     explain:"等速直線運動 → 加速度 0 → 合力 0。動いていても合力は 0 です。"},
    {id:"ra2",type:"multi",prompt:"真上に投げたボールが上昇している。手を離れた後、ボールが受ける力をすべて選べ（空気抵抗は無視）。",
     options:["地球がボールに及ぼす重力","手がボールを押し上げる力","ボールが上に進むための上向きの力"],answer:[0],
     explain:"手を離れた後、ボールに触れている物体はありません。受ける力は重力だけです。"},
    {id:"ra3",type:"choice",prompt:"走っているバスが急ブレーキをかけると、立っている乗客は前に倒れそうになる。その理由は？",
     options:["乗客が前向きの力を受けたから","乗客は慣性で等速運動を続けようとし、減速するバスに対して前に動くから","空気が乗客を前に押すから"],answer:1,
     explain:"「前向きの力」を及ぼしている物体はありません。慣性で説明します。"}
  ]},
  { title:"B. 受ける力を挙げる（ma は描かない）", lead:"粗い水平面の上を、物体が右向きにすべっている（手は離している）。", qs:[
    {id:"rb1",type:"multi",prompt:"物体が受ける力をすべて選べ。",
     options:["地球が物体に及ぼす重力","面が物体に及ぼす垂直抗力","面が物体に及ぼす左向きの動摩擦力","物体が右に進むための右向きの力","大きさ ma の力"],answer:[0,1,2],
     explain:"「右向きの力」を及ぼしている物体はありません。ma は力ではありません。物体は動摩擦力で減速していきます。"}
  ]},
  { title:"C. 静止摩擦力を読む", lead:"水平な床の上の箱を水平に押す。箱と床の間の最大摩擦力は 19.6 N。", qs:[
    {id:"rc1",type:"num",prompt:"10 N で押したが、箱は動かなかった。静止摩擦力の大きさは？",answer:10,tol:0.05,unit:"N",
     traps:{"19.6":"19.6 N は最大値です。動いていないので、押す力とつり合っています。"},
     explain:"静止しているので、静止摩擦力は押す力とつり合って 10 N。"},
    {id:"rc2",type:"num",prompt:"押す力を 15 N にしても、箱は動かなかった。静止摩擦力の大きさは？",answer:15,tol:0.05,unit:"N",
     traps:{"10":"静止摩擦力は、押す力に応じて変わります。","19.6":"19.6 N は最大値です。"},
     explain:"押す力とつり合うので 15 N。静止摩擦力は外力に応じて変わります。"},
    {id:"rc3",type:"choice",prompt:"押す力を 25 N にすると、箱はすべり出した。すべっている間の摩擦力は？",
     options:["静止摩擦力 μN","動摩擦力 μ′N","最大摩擦力 19.6 N のまま"],answer:1,
     explain:"すべっている物体が受けるのは動摩擦力 F′ ＝ μ′N です。"}
  ]},
  { title:"D. 正しいか、誤りか", qs:[
    {id:"rd1",type:"choice",prompt:"同じ力を加えるとき、質量が大きい物体ほど加速しにくい。",options:TF,answer:0,
     explain:"正しい。a ＝ F ÷ m。質量は「加速のしにくさ（慣性の大きさ）」を表します。"},
    {id:"rd2",type:"choice",prompt:"速度が 0 の瞬間、物体が受ける合力も 0 である。",options:TF,answer:1,
     explain:"誤り。投げ上げの最高点では v ＝ 0 でも、合力は重力 mg です。"},
    {id:"rd3",type:"choice",prompt:"等速直線運動をしている物体が受ける力の合力は 0 である。",options:TF,answer:0,
     explain:"正しい。加速度が 0 なので、合力も 0。"},
    {id:"rd4",type:"choice",prompt:"動摩擦力の大きさは、物体の速さが大きいほど大きい。",options:TF,answer:1,
     explain:"誤り。動摩擦力 μ′N は速さによりません。"},
    {id:"rd5",type:"choice",prompt:"加速度の向きは、いつも速度の向きと同じである。",options:TF,answer:1,
     explain:"誤り。加速度の向きは合力の向き。減速しているときは速度と逆向きです。"},
    {id:"rd6",type:"choice",prompt:"静止摩擦力の大きさは、いつも μN である。",options:TF,answer:1,
     explain:"誤り。μN は最大値。静止摩擦力の大きさはつり合いの式で決まります。"}
  ]},
  { title:"E. 物体ごとに力を整理する",
    quote:"なめらかな水平な台の上に物体 A（質量 2.0 kg）を置き、軽い糸で台の端の滑車を通して物体 B（質量 1.0 kg）をつるした。静かに手を離すと、A と B は動き出した。", figure:PULLEY, qs:[
    {id:"re1",type:"multi",prompt:"A が受ける力をすべて選べ。",
     options:["地球が A に及ぼす重力","台が A に及ぼす垂直抗力","糸が A を引く力（滑車の向き）","地球が B に及ぼす重力"],answer:[0,1,2],
     explain:"A が触れているのは台と糸。B の重力は B が受ける力で、A を直接引くのは糸です。"},
    {id:"re2",type:"multi",prompt:"B が受ける力をすべて選べ。",
     options:["地球が B に及ぼす重力","糸が B を引く力（上向き）","A が B を引く力"],answer:[0,1],
     explain:"B が触れているのは糸だけ。A と B は直接触れていません。"},
    {id:"re3",type:"choice",prompt:"A と B をまとめて1つの物体とみて運動方程式を立てた。この方法で求められないものは？",
     options:["加速度","糸の張力"],answer:1,
     explain:"まとめると (mA ＋ mB)a ＝ mB g で加速度は求まりますが、張力は2物体の間の力なので式に現れません。張力には物体ごとの式が必要です。"}
  ]}]
},
{ id:"dim", tab:"③次元", title:"③ 次元チェック",
  intro:"運動方程式は N ＝ kg·m/s² そのもの。摩擦係数に単位がないことも、式の確認に使えます。",
  advice:"μmg と μm、F ÷ m と F × m を区別し、右辺の単位を確かめよう。",
  ref:{label:"単位の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", qs:[
    {id:"da1",type:"choice",prompt:"F ÷ m",options:UNITQ,answer:1,two:true,explain:"N ÷ kg ＝ (kg·m/s²) ÷ kg ＝ m/s²。加速度です。"},
    {id:"da2",type:"choice",prompt:"μ′mg",options:UNITQ,answer:0,two:true,explain:"μ′ は単位なし。kg × m/s² ＝ N。動摩擦力です。"},
    {id:"da3",type:"choice",prompt:"μ′g",options:UNITQ,answer:1,two:true,explain:"単位なし × m/s² ＝ m/s²。摩擦だけで減速するときの加速度の大きさです。"},
    {id:"da4",type:"choice",prompt:"F ÷ a",options:UNITQ,answer:2,two:true,explain:"N ÷ (m/s²) ＝ kg。質量です。"},
    {id:"da5",type:"choice",prompt:"F′ ÷ N（動摩擦力 ÷ 垂直抗力）",options:UNITQ,answer:3,two:true,explain:"N ÷ N で単位なし。動摩擦係数 μ′ です。"}
  ]},
  { title:"B. 式の次元を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次のうち、次元が合わない式をすべて選べ（a は加速度、F と T は力）。",
     options:["a ＝ F ÷ m","a ＝ F × m","a ＝ μ′g","a ＝ μ′ ÷ g","T ＝ m₁m₂g ÷ (m₁ ＋ m₂)","a ＝ m₂g ÷ (m₁ ＋ m₂)"],answer:[1,3],
     explain:"F × m の単位は kg·N、μ′ ÷ g の単位は s²/m で、どちらも加速度になりません。"}
  ]},
  { title:"C. 次元チェックの限界", lead:"糸でつながれた2物体（④問題3の形）の加速度を「a ＝ m₂g ÷ m₁」と書いた。次元は合っている。", qs:[
    {id:"dc1",type:"choice",prompt:"この式の誤りに気づくには、どんな極端な場合を考えるとよいか。",
     options:["m₁ → 0（台の上の物体が非常に軽い）とすると、a → g になるはずなのに a → ∞ になる","m₂ → 0 とすると a → 0 で、正しいように見える","g → 0 とすると a → 0 になる"],answer:0,
     explain:"台の上の物体がなければ、つるした物体は自由落下（a ＝ g）になるはず。正しくは a ＝ m₂g ÷ (m₁ ＋ m₂)。"}
  ]},
  { title:"D. 答案の誤りを見つける", lead:"問「質量 5.0 kg の物体が、動摩擦係数 0.20 の水平面上をすべっている。動摩擦力の大きさを求めよ。」",
    quote:"答案：F′ ＝ μ′m ＝ 0.20 × 5.0 ＝ 1.0 N", qs:[
    {id:"dd1",type:"choice",prompt:"単位だけを手がかりにすると、この答案の誤りは何か。",
     options:["μ′m の単位は kg で、力にならない（垂直抗力 N ＝ mg を使っていない）","μ′ の値が違う","有効数字が違う"],answer:0,
     explain:"動摩擦力は μ′ × 垂直抗力。垂直抗力は mg です。"},
    {id:"dd2",type:"num",prompt:"正しい動摩擦力の大きさを求めよ。",answer:9.8,tol:0.05,unit:"N",
     traps:{"1":"μ′m は質量の単位（kg）です。垂直抗力 mg を使います。","49":"それは垂直抗力です。μ′ を掛けます。"},
     explain:"N ＝ mg ＝ 49 N、F′ ＝ μ′N ＝ 0.20 × 49 ＝ 9.8 N。"}
  ]},
  { title:"E. 数値の感覚をもつ", qs:[
    {id:"de1",type:"num",prompt:"質量 60 kg の人に 1.0 m/s² の加速度を生じさせる力は何 N か。",answer:60,tol:0.5,unit:"N",
     explain:"F ＝ ma ＝ 60 × 1.0 ＝ 60 N。"},
    {id:"de2",type:"num",prompt:"質量 0.10 kg のりんごが受ける重力は約何 N か。",answer:0.98,tol:0.03,unit:"N",
     traps:{"0.1":"それは質量です。重力は mg。","98":"0.10 kg を 100 g のまま計算していませんか。"},
     explain:"0.10 × 9.8 ＝ 0.98 N。「1 N はりんご1個分の重さ」の目安と合います。"}
  ]}]
},
{ id:"step", tab:"④手順", title:"④ 手順固定の演習",
  intro:"ステップ4で、加速度がある方向には運動方程式を、ない方向にはつり合いの式を立てます。g ＝ 9.8 m/s²。",
  advice:"物体ごとに受ける力を挙げ、加速度の向きを正にして運動方程式を立てよう。",
  ref:{label:"7ステップを見る", html:STEPS},
  groups:[
  { title:"問題1（すべてのステップ）",
    quote:"なめらかな水平面上に静止している質量 2.0 kg の物体に、水平方向に 6.0 N の力を加え続けた。(1) 物体の加速度の大きさ、(2) 力を加え始めてから 4.0 s 後の速さを求めよ。", qs:[
    {id:"s11",type:"multi",prompt:"ステップ2　物体が受ける力をすべて選べ。",
     options:["地球が物体に及ぼす重力","面が物体に及ぼす垂直抗力","加えた 6.0 N の力","面が物体に及ぼす摩擦力","大きさ ma の力"],answer:[0,1,2],
     explain:"なめらかな面なので摩擦力はありません。ma は力ではありません。"},
    {id:"s12",type:"blanks",prompt:"ステップ3・4　加えた力の向きを正として、式を立てる。",text:"水平方向：{0}<br>鉛直方向：{1}",
     options:[["2.0a ＝ 6.0","2.0a ＝ 6.0 − 19.6","6.0 ＝ 0"],["N − 2.0 × 9.8 ＝ 0","2.0a ＝ N","N ＝ 6.0"]],answer:[0,0],
     explain:"加速度がある水平方向は運動方程式、加速度がない鉛直方向はつり合いの式です。"},
    {id:"s13",type:"choice",prompt:"ステップ5　a を文字式で表し、単位を確かめる。",
     options:["a ＝ F ÷ m、N ÷ kg ＝ m/s²","a ＝ F × m、N × kg","a ＝ m ÷ F、kg ÷ N"],answer:0,
     explain:"ma ＝ F より a ＝ F ÷ m。単位も加速度になっています。"},
    {id:"s14",type:"num",prompt:"ステップ6　(1) 加速度の大きさ",answer:3.0,tol:0.02,unit:"m/s²",
     traps:{"12":"掛けていませんか。a ＝ F ÷ m です。","0.33":"m ÷ F になっていませんか。"},explain:"a ＝ 6.0 ÷ 2.0 ＝ 3.0 m/s²。"},
    {id:"s15",type:"num",prompt:"ステップ6　(2) 4.0 s 後の速さ（「速度・加速度」の単元の式を使う）",answer:12,tol:0.1,unit:"m/s",
     traps:{"24":"それは x ＝ ½at² の値です。速さは v ＝ v₀ ＋ at。","6":"(1) の加速度を使っていますか。"},
     explain:"v ＝ v₀ ＋ at ＝ 0 ＋ 3.0 × 4.0 ＝ 12 m/s。運動方程式で a を求め、3式につなげます。"},
    {id:"s16",type:"choice",prompt:"ステップ7　物体の質量を 2 倍にすると、加速度はどうなるはずか。",options:["2 倍","½ 倍","変わらない"],answer:1,
     explain:"a ＝ F ÷ m なので ½ 倍。重いほど加速しにくいという感覚と合っています。"}
  ]},
  { title:"問題2（前半だけ誘導）",
    quote:"質量 5.0 kg の物体が、動摩擦係数 0.20 の粗い水平面上にある。物体に水平方向に 20 N の力を加え続けると、物体はすべり続けた。物体の加速度の大きさを有効数字2桁で求めよ。", qs:[
    {id:"s21",type:"multi",prompt:"ステップ2　物体が受ける力をすべて選べ。",
     options:["地球が物体に及ぼす重力","面が物体に及ぼす垂直抗力","引く力 20 N","面が物体に及ぼす動摩擦力","物体が進むための力"],answer:[0,1,2,3],
     explain:"受ける力は4つ。動摩擦力は運動と逆向きです。"},
    {id:"s22",type:"num",prompt:"ステップ4　鉛直方向のつり合いから、垂直抗力 N",answer:49,tol:0.2,unit:"N",
     traps:{"5":"質量ではなく重力 mg とつり合います。"},explain:"N ＝ mg ＝ 5.0 × 9.8 ＝ 49 N。"},
    {id:"s23",type:"num",prompt:"ステップ4　動摩擦力 F′",answer:9.8,tol:0.05,unit:"N",
     traps:{"1":"μ′m ではなく μ′N（N ＝ mg）です。","4":"引く力ではなく、垂直抗力に μ′ を掛けます。"},explain:"F′ ＝ μ′N ＝ 0.20 × 49 ＝ 9.8 N。"},
    {id:"s24",type:"num",prompt:"加速度の大きさ",answer:2.0,tol:0.05,unit:"m/s²",
     traps:{"4":"動摩擦力を忘れていませんか。","6":"動摩擦力は引く力と逆向きです。"},
     explain:"5.0a ＝ 20 − 9.8 より a ＝ 2.04 ≒ 2.0 m/s²。"}
  ]},
  { title:"問題3（答えだけ入力・2物体）", lead:"紙に7ステップを書いて解き、答えを入力せよ。A と B それぞれについて運動方程式を立てること。",
    quote:"なめらかな水平な台の上に物体 A（質量 2.0 kg）を置き、軽い糸で台の端の滑車を通して物体 B（質量 1.0 kg）をつるした。静かに手を離すと、A と B は動き出した。", figure:PULLEY, qs:[
    {id:"s31",type:"num",prompt:"(1) 加速度の大きさ（有効数字2桁）",answer:3.3,tol:0.05,unit:"m/s²",
     traps:{"9.8":"B だけでなく、A も一緒に動かす必要があります。","4.9":"B の質量で割っていませんか。全体の質量は 3.0 kg です。"},
     explain:"A：2.0a ＝ T、B：1.0a ＝ 9.8 − T。足して 3.0a ＝ 9.8、a ≒ 3.3 m/s²。"},
    {id:"s32",type:"num",prompt:"(2) 糸の張力の大きさ（有効数字2桁）",answer:6.5,tol:0.1,unit:"N",
     traps:{"9.8":"張力が B の重力と等しいと、B は加速できません。","3.3":"張力は T ＝ mA a です（質量 2.0 kg を掛ける）。"},
     explain:"T ＝ 2.0 × 3.27 ≒ 6.5 N。"},
    {id:"s33",type:"checklist",prompt:"解き終えたら点検しよう（採点には入りません）。",
     items:["A と B について、別々に受ける力を挙げた","力の図に「運動の向きの力」や ma を描いていない","物体ごとに、加速度の向きを正にした","物体ごとに運動方程式を立て、連立させた"]},
    {id:"s34",type:"self",prompt:"(2) の張力が、B の重力（9.8 N）より小さくなる理由を説明せよ。",
     model:"B は下向きに加速しているので、B が受ける合力は下向きでなければならない。そのためには、上向きの張力は下向きの重力より小さい必要がある。"}
  ]}]
},
{ id:"sum", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。「加速度があるか」「すべっているか」で、使う式を選びます。",
  advice:"加速度があるか、すべっているかを最初に判断してから式を選ぼう。",
  groups:[{ title:"式を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"エレベーターが一定の速さで上昇している。床が人に及ぼす垂直抗力を求めたい。",
     options:["運動方程式（上向きに加速している）","つり合いの式（等速なので加速度 0）"],answer:1,
     explain:"等速 → 加速度 0 → 合力 0。つり合いの式で N ＝ mg。"},
    {id:"m2",type:"choice",prompt:"床に置いた箱を押したが動かなかった。箱が受ける摩擦力を求めたい。",
     options:["μN を計算する","つり合いの式を立てる"],answer:1,
     explain:"静止しているので静止摩擦力。押す力とのつり合いで決まります。"},
    {id:"m3",type:"choice",prompt:"粗い面上を物体がすべっている。物体が受ける摩擦力を求めたい。",
     options:["つり合いの式","μN","μ′N"],answer:2,
     explain:"すべっているので動摩擦力 μ′N。"},
    {id:"m4",type:"choice",prompt:"物体に一定の力を加え続けたときの、5.0 s 後の速さを求めたい。",
     options:["運動方程式で a を求め、v ＝ v₀ ＋ at で速さを求める","運動方程式だけで速さが求まる","つり合いの式で速さを求める"],answer:0,
     explain:"運動方程式が与えるのは加速度。速さや距離は「速度・加速度」の3式で求めます。"},
    {id:"m5",type:"choice",prompt:"物体をすべらせずに押せる最大の力を求めたい。",
     options:["動摩擦力 μ′N とつり合わせる","最大摩擦力 μN とつり合わせる","運動方程式を立てる"],answer:1,
     explain:"すべり出す直前、静止摩擦力は最大値 μN に達しています。"},
    {id:"m6",type:"blanks",prompt:"次の文を完成させよ。",text:"加速度がある方向には{0}を、加速度がない方向には{1}を立てる。",
     options:[["運動方程式","つり合いの式"],["運動方程式","つり合いの式"]],answer:[0,1],
     explain:"つり合いの式は、運動方程式で a ＝ 0 とした特別な場合ともいえます。"}
  ]}]
}
];

registerUnit({
  id: "newton",
  title: "運動の法則",
  sections: SECTIONS
});
})();
