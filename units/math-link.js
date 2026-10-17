/*
 * 付録単元：数学で読む力学（微分・積分・ベクトル）
 * 数学Ⅱ（極限・微分・積分）・数学C（ベクトル）と、物理基礎の力学をつなぐ。
 * このファイルは js/index.js の file に "units/math-link.js" と書くと読み込まれます。
 * 書き方は units/TEMPLATE.js を参照してください。
 */
(function(){

/* 物理量（斜体）とベクトル（矢印つき）の表示用スタイル */
if(typeof document !== "undefined"){
  if(!document.getElementById("notation-style")){
    const st = document.createElement("style");
    st.id = "notation-style";
    st.textContent = '.qv{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:italic;font-size:1.1em;padding:0 .04em}'
                   + '.qu{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:normal;font-size:1.1em}';
    document.head.appendChild(st);
  }
  if(!document.getElementById("vec-style")){
    const st = document.createElement("style");
    st.id = "vec-style";
    st.textContent = '.vec{position:relative;display:inline-block;font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:italic;font-size:1.1em;line-height:1.2;margin-right:.12em}'
      + '.vec::after{content:"";position:absolute;left:.06em;right:-.08em;top:-.06em;border-top:1.3px solid currentColor}'
      + '.vec::before{content:"";position:absolute;right:-.16em;top:calc(-.23em + .6px);border-left:.32em solid currentColor;border-top:.17em solid transparent;border-bottom:.17em solid transparent}';
    document.head.appendChild(st);
  }
}

const Q = s => `<i class='qv'>${s}</i>`;
const V = s => `<span class='vec'>${s}</span>`;
const D = (a, b) => `d${Q(a)}/d${Q(b)}`;                 // dx/dt
const INT = (f, a, b) => `∫${a !== undefined ? `<sub>${a}</sub><sup>${b}</sup>` : ""} ${f} d${Q("t")}`;
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;
const TF = ["正しい", "誤り"];
const UNITQ = ["m", "m/s", "m/s²", "J（N·m）"];
const TOOLS = ["微分する（接線の傾き）", "積分する（面積）", "ベクトルの和", "ベクトルの差", "内積"];

const MAP_TABLE = `<div class="tbl"><table>
<tr><th>数学</th><th>物理基礎（力学）</th><th>グラフ・図では</th></tr>
<tr><td>平均変化率</td><td>平均の速度 Δ${Q("x")}/Δ${Q("t")}、平均の加速度 Δ${Q("v")}/Δ${Q("t")}</td><td>2点を結ぶ直線の傾き</td></tr>
<tr><td>微分係数・導関数</td><td>瞬間の速度 ${Q("v")} ＝ ${D("x","t")}、加速度 ${Q("a")} ＝ ${D("v","t")}</td><td>接線の傾き</td></tr>
<tr><td>極大・極小（増減表）</td><td>折り返し（${Q("v")} ＝ 0 で符号が変わる）</td><td>${Q("x")}-${Q("t")} 図の山・谷</td></tr>
<tr><td>定積分</td><td>変位 ${INT(Q("v"))}、速度の変化 ${INT(Q("a"))}</td><td>グラフと ${Q("t")} 軸の間の面積（下側は負）</td></tr>
<tr><td>積分定数 ${Q("C")}</td><td>はじめの位置 ${Q("x")}<sub>0</sub>・はじめの速度 ${Q("v")}<sub>0</sub>（初期条件）</td><td>グラフの上下の平行移動</td></tr>
<tr><td>ベクトルの和</td><td>合成速度、合力、変位の和</td><td>矢印をつなぐ・平行四辺形</td></tr>
<tr><td>ベクトルの差</td><td>相対速度 ${V("v")}<sub>AB</sub> ＝ ${V("v")}<sub>B</sub> − ${V("v")}<sub>A</sub>、速度の変化 Δ${V("v")}</td><td>始点をそろえ、引く方の先から引かれる方の先へ</td></tr>
<tr><td>成分・大きさ</td><td>力の分解、投射運動の水平・鉛直成分</td><td>軸への正射影、|${V("a")}| ＝ √(${Q("a")}<sub>1</sub>² ＋ ${Q("a")}<sub>2</sub>²)</td></tr>
<tr><td>内積</td><td>仕事 ${Q("W")} ＝ ${V("F")}・${V("s")} ＝ ${Q("Fs")} cos ${Q("θ")}</td><td>力の「変位の向きの成分」× 変位の大きさ</td></tr>
</table></div>
<p class="formula">${Q("x")} →（微分）→ ${Q("v")} →（微分）→ ${Q("a")}　　${Q("a")} →（積分＋${Q("v")}<sub>0</sub>）→ ${Q("v")} →（積分＋${Q("x")}<sub>0</sub>）→ ${Q("x")}</p>
<p class="formula">数学Ⅱ：(${Q("t")}<sup>${Q("n")}</sup>)′ ＝ ${Q("n")}${Q("t")}<sup>${Q("n")}−1</sup>　　∫${Q("t")}<sup>${Q("n")}</sup> d${Q("t")} ＝ ${Q("t")}<sup>${Q("n")}＋1</sup>/(${Q("n")}＋1) ＋ ${Q("C")}</p>`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>操作</th><th>単位では</th><th>例</th></tr>
<tr><td>${Q("t")} で微分する（d/d${Q("t")}）</td><td>÷ s</td><td>${Q("x")}〔m〕→ ${Q("v")}〔m/s〕→ ${Q("a")}〔m/s²〕</td></tr>
<tr><td>${Q("t")} で積分する（∫ … d${Q("t")}）</td><td>× s</td><td>${Q("a")}〔m/s²〕→ ${Q("v")}〔m/s〕→ ${Q("x")}〔m〕</td></tr>
<tr><td>${Q("x")} で積分する（∫ … d${Q("x")}）</td><td>× m</td><td>${Q("F")}〔N〕→ 仕事〔N·m ＝ J〕</td></tr>
<tr><td>ベクトルの成分・大きさ</td><td>もとの量と同じ</td><td>速度の成分〔m/s〕</td></tr>
<tr><td>内積 ${V("F")}・${V("s")}</td><td>N × m ＝ J</td><td>仕事（スカラー）</td></tr></table></div>`;

const SECTIONS = [
{ id:"def", advice:"「数学の言葉 ↔ 物理の言葉」の対応表を開いて、傾き・面積・和・差・内積がそれぞれ何を表すかを確かめよう。", tab:"①定義", title:"① 定義カード（数学と物理の対応）", back:"① 定義カード",
  intro:`物理基礎で学んだ「傾き」「面積」「矢印の足し算」は、数学Ⅱの微分・積分、数学Cのベクトルそのものです。対応表で確かめてから答えよう。<br>Web教材で確かめよう：<br>${ANIM("anim/calculus.html#lim","極限：平均変化率 → 瞬間の速度")}${ANIM("anim/calculus.html#diff","微分：x → v → a と増減表")}${ANIM("anim/calculus.html#int","積分：面積 ＝ 変位")}${ANIM("anim/calculus.html#derive","3式を微分・積分で導く")}${ANIM("anim/vector.html#ops","ベクトルの和・差・成分")}${ANIM("anim/vector.html#motion","位置・速度・加速度ベクトル")}${ANIM("anim/vector.html#force","力のつりあい")}${ANIM("anim/vector.html#work","仕事と内積")}`,
  ref:{label:"対応表を見る", html:MAP_TABLE},
  groups:[{ title:"A. 微分・積分", qs:[
    {id:"d1",type:"blanks",text:`平均の速度 Δ${Q("x")}/Δ${Q("t")} は、数学Ⅱでいう{0}にあたり、${Q("x")}-${Q("t")} 図では{1}を表す。`,
     options:[["平均変化率","微分係数","定積分"],["2点を結ぶ直線の傾き","接線の傾き","グラフと t 軸の間の面積"]],answer:[0,0],
     explain:`平均変化率 {${Q("f")}(${Q("a")}＋${Q("h")}) − ${Q("f")}(${Q("a")})}/${Q("h")} の ${Q("f")} を位置 ${Q("x")}、${Q("h")} を時間 Δ${Q("t")} と読みかえると、平均の速度になります。`},
    {id:"d2",type:"blanks",text:`瞬間の速度は、Δ${Q("t")} を{0}ときの平均の速度の極限で、${Q("v")} ＝ {1} と書く。${Q("x")}-${Q("t")} 図では{2}を表す。`,
     options:[["限りなく大きくした","限りなく 0 に近づけた","1 s にした"],["dx/dt","dv/dt","∫v dt"],["接線の傾き","2点を結ぶ直線の傾き","面積"]],answer:[1,0,0],
     explain:`${Q("v")} ＝ lim<sub>Δ${Q("t")}→0</sub> Δ${Q("x")}/Δ${Q("t")} ＝ ${D("x","t")}。数学Ⅱの微分係数そのもので、${Q("x")}-${Q("t")} 図の接線の傾きです。`},
    {id:"d3",type:"blanks",text:`加速度は ${Q("a")} ＝ {0} で、位置 ${Q("x")} を時刻 ${Q("t")} で{1}微分したものである。`,
     options:[["dv/dt","dx/dt","∫v dt"],["1回","2回","3回"]],answer:[0,1],
     explain:`${Q("x")} を微分すると ${Q("v")}、${Q("v")} を微分すると ${Q("a")}。${Q("a")} は ${Q("x")} を2回微分したものです。`},
    {id:"d4",type:"blanks",text:`${Q("v")}-${Q("t")} 図のグラフと ${Q("t")} 軸の間の面積（${Q("t")} 軸より下は負）は{0}を表し、数学では{1}で計算する。`,
     options:[["変位","道のり","加速度"],["定積分 ∫v dt","微分 dv/dt","v × t（どんな運動でも）"]],answer:[0,0],
     explain:`変位 ＝ ${INT(Q("v"), Q("t") + "<sub>1</sub>", Q("t") + "<sub>2</sub>")}。「速度 × 時間」が使えるのは速度が一定のときだけで、一般には積分します。${ANIM("anim/calculus.html#int","短冊の和が定積分に近づくようす")}`},
    {id:"d5",type:"choice",prompt:`${Q("v")} ＝ ∫${Q("a")} d${Q("t")} ＝ ${Q("at")} ＋ ${Q("C")}（${Q("a")} は一定）の積分定数 ${Q("C")} は、物理では何を表すか。`,
     options:[`時刻 0 の速度（初速度 ${Q("v")}<sub>0</sub>）`,"加速度","時刻 0 の位置"],answer:0,
     explain:`${Q("t")} ＝ 0 を代入すると ${Q("v")} ＝ ${Q("C")}。積分定数は「はじめの値（初期条件）」で、問題文の「静止していた」「〜m/s で投げた」などで決まります。`}
  ]},
  { title:"B. ベクトル", qs:[
    {id:"d6",type:"multi",prompt:"向きと大きさをもつ量（ベクトル）をすべて選べ。",
     options:["変位","速さ","速度","加速度","力","質量","仕事","時間"],answer:[0,2,3,4],
     explain:"変位・速度・加速度・力はベクトル。速さ・質量・仕事・時間は大きさだけの量（スカラー）です。仕事は力と変位の内積で、スカラーになります。"},
    {id:"d7",type:"blanks",text:`平面上の運動で、速度 ${V("v")} の ${Q("x")} 成分は ${Q("v")}<sub>x</sub> ＝ {0}、速さ（${V("v")} の大きさ）は {1} である。`,
     options:[["dx/dt","dy/dt","x/t"],["√(vₓ² ＋ v_y²)","vₓ ＋ v_y","vₓ × v_y"]],answer:[0,0],
     explain:`位置 (${Q("x")}, ${Q("y")}) を成分ごとに微分すると速度 (${D("x","t")}, ${D("y","t")})。大きさは三平方の定理で求めます。${ANIM("anim/vector.html#motion","位置・速度・加速度ベクトル")}`},
    {id:"d8",type:"blanks",text:`A から見た B の相対速度は {0}、2力 ${V("F")}<sub>1</sub>、${V("F")}<sub>2</sub> の合力は {1}、物体が受ける力がつりあう条件は {2} である。`,
     options:[["v_B − v_A","v_A − v_B","v_A ＋ v_B"],["F₁ ＋ F₂（ベクトルの和）","|F₁| ＋ |F₂|（大きさの和）","F₁ − F₂"],["力のベクトルの和が 0","力の大きさがすべて等しい","力がすべて同じ向き"]],answer:[0,0,0],
     explain:`相対速度はベクトルの差 ${V("v")}<sub>B</sub> − ${V("v")}<sub>A</sub>、合力はベクトルの和。つりあいは「合力 ＝ ${V("0")}」で、成分で書くと ${Q("x")} 成分の和も ${Q("y")} 成分の和も 0 です。`},
    {id:"d9",type:"blanks",text:`一定の力 ${V("F")} を受けて変位 ${V("s")} だけ動いたとき、力がする仕事は ${Q("W")} ＝ {0} ＝ ${Q("Fs")} cos ${Q("θ")} で、仕事は{1}である。`,
     options:[["F・s（内積）","F ＋ s（和）","|F| ＋ |s|"],["スカラー","ベクトル"]],answer:[0,0],
     explain:`数学Cの内積 ${V("a")}・${V("b")} ＝ |${V("a")}||${V("b")}| cos ${Q("θ")} です。内積は数なので、仕事もエネルギーも向きをもちません。${ANIM("anim/vector.html#work","仕事と内積")}`}
  ]}]
},
{ id:"read", advice:"「接線の傾き」「面積」「極大・極小」などの数学の言葉を、運動の言葉（速度・変位・折り返し）に言いかえる練習をしよう。", tab:"②読解", title:"② 読解ドリル", back:"② 読解ドリル",
  intro:"数学の言葉と物理の言葉を行き来します。式やグラフが「運動の何を言っているか」を読み取ろう。",
  ref:{label:"対応表を見る", html:MAP_TABLE},
  groups:[
  { title:"A. 言いかえる", lead:"直線上の運動とする。次の言い方と同じ意味のものを選べ。", qs:[
    {id:"ra1",type:"choice",prompt:`「${Q("x")}-${Q("t")} 図の接線の傾きが負である。」`,options:["負の向きに進んでいる","減速している","位置が負である"],answer:0,
     explain:`接線の傾き ＝ ${Q("v")}。${Q("v")} ＜ 0 は「負の向きに進んでいる」です。位置が正か負か、減速かどうかとは別のことです。`},
    {id:"ra2",type:"choice",prompt:`「${Q("v")}-${Q("t")} 図の接線が水平である。」`,options:["その瞬間の加速度が 0","その瞬間の速度が 0","物体が止まっている"],answer:0,
     explain:`${Q("v")}-${Q("t")} 図の接線の傾き ＝ ${Q("a")}。水平なら ${Q("a")} ＝ 0 です。速度は 0 とは限りません。`},
    {id:"ra3",type:"choice",prompt:"「物体が折り返した（運動の向きが変わった）」を数学の言葉で言うと？",
     options:[`${Q("x")} が極大または極小になり、${Q("v")} ＝ ${D("x","t")} の符号が変わる`,`${Q("a")} ＝ 0 になる`,`${Q("x")} ＝ 0 になる`],answer:0,
     explain:`増減表で ${Q("x")}′ ＝ ${Q("v")} の符号が ＋ → − に変わる点が極大（正の向きから負の向きへ折り返す）です。${ANIM("anim/calculus.html#diff","増減表で運動を読む")}`},
    {id:"ra4",type:"choice",prompt:`「${D("v","t")} ＞ 0 かつ ${Q("v")} ＜ 0 である。」`,options:["速さが小さくなっている","速さが大きくなっている","正の向きに進んでいる"],answer:0,
     explain:`${Q("a")} ＞ 0、${Q("v")} ＜ 0 で符号が逆なので、負の向きに進みながら速さが小さくなっています。`},
    {id:"ra5",type:"choice",prompt:`（平面の運動）「速さが一定の運動では、加速度は ${V("0")} である。」`,options:TF,answer:1,
     explain:`誤り。加速度は速度ベクトルの変化の割合です。等速円運動のように向きが変われば、速さが一定でも加速度は ${V("0")} ではありません。${ANIM("anim/vector.html#motion","等速円運動の Δv")}`}
  ]},
  { title:"B. 増減表で運動を読む", lead:`直線上を動く物体の位置が ${Q("x")} ＝ ${Q("t")}³ − 9${Q("t")}² ＋ 24${Q("t")}〔m〕（${Q("t")} は時刻〔s〕、${Q("t")} ≧ 0）で表される。`, qs:[
    {id:"rb1",type:"blanks",text:`${Q("v")} ＝ ${D("x","t")} ＝ {0}、${Q("a")} ＝ ${D("v","t")} ＝ {1}`,
     options:[["3t² − 18t ＋ 24","t² − 9t ＋ 24","3t² − 9t"],["6t − 18","3t − 9","6t"]],answer:[0,0],
     explain:`(${Q("t")}³)′ ＝ 3${Q("t")}²、(${Q("t")}²)′ ＝ 2${Q("t")}、(${Q("t")})′ ＝ 1 を使います。${Q("v")} ＝ 3(${Q("t")} − 2)(${Q("t")} − 4) と因数分解できます。`},
    {id:"rb2",type:"multi",prompt:"物体が一瞬止まる時刻をすべて選べ。",options:["1 s","2 s","3 s","4 s","6 s"],answer:[1,3],
     explain:`${Q("v")} ＝ 3(${Q("t")} − 2)(${Q("t")} − 4) ＝ 0 より ${Q("t")} ＝ 2 s、4 s。どちらも ${Q("v")} の符号が変わるので、折り返しています。`},
    {id:"rb3",type:"choice",prompt:"2 s から 4 s の間、物体はどう動いているか。",options:["負の向きに進んでいる","正の向きに進んでいる","止まっている"],answer:0,
     explain:`この間 ${Q("v")} ＜ 0 で、増減表では ${Q("x")} が減少（↘）。${Q("t")} ＝ 2 s で極大（20 m）、4 s で極小（16 m）です。`},
    {id:"rb4",type:"num",prompt:`${Q("t")} ＝ 3 s の加速度を求めよ。`,answer:0,tol:0.01,unit:"m/s²",
     traps:{"-3":"それは速度 v(3) の値です。加速度は a ＝ 6t − 18 に代入します。"},
     explain:`${Q("a")} ＝ 6 × 3 − 18 ＝ 0 m/s²。このとき速度は −3 m/s で、負の向きの速さがいちばん大きい瞬間です。速度が 0 でなくても加速度は 0 になれます。`},
    {id:"rb5",type:"num",prompt:"0 s から 4 s までの道のりを求めよ。",answer:24,tol:0.1,unit:"m",
     traps:{"16":"16 m は変位（4 s の位置 − 0 s の位置）です。2 s で折り返しているので、区間に分けて考えよう。"},
     explain:`${Q("x")}(0) ＝ 0、${Q("x")}(2) ＝ 20 m、${Q("x")}(4) ＝ 16 m。0〜2 s に 20 m 進み、2〜4 s に 4 m 戻るので、道のりは 24 m（変位は 16 m）。`}
  ]},
  { title:"C. ベクトルを成分で読む", lead:`東向きに ${Q("x")} 軸、北向きに ${Q("y")} 軸をとる。`, qs:[
    {id:"rc1",type:"num",prompt:"静水に対して北向きに 4.0 m/s で進む船が、東向きに 3.0 m/s で流れる川を渡る。岸から見た船の速さを求めよ。",answer:5,tol:0.05,unit:"m/s",
     traps:{"7":"速さ 3.0 と 4.0 をそのまま足していませんか。向きの違うベクトルは成分で足します。","1":"引くのではなく、ベクトルとして足します。"},
     explain:`(3.0, 0) ＋ (0, 4.0) ＝ (3.0, 4.0) m/s。大きさ √(3.0² ＋ 4.0²) ＝ 5.0 m/s。${ANIM("anim/vector.html#ops","ベクトルの和（速度）")}`},
    {id:"rc2",type:"blanks",prompt:"自動車 A が東向きに 20 m/s、自動車 B が北向きに 15 m/s で走っている。",text:`A から見た B の速度 ${V("v")}<sub>AB</sub> ＝ ({0}, {1}) m/s、その大きさは {2}`,
     options:[["−20","20","0"],["15","−15","0"],["25 m/s","35 m/s","5 m/s"]],answer:[0,0,0],
     explain:`${V("v")}<sub>AB</sub> ＝ ${V("v")}<sub>B</sub> − ${V("v")}<sub>A</sub> ＝ (0, 15) − (20, 0) ＝ (−20, 15)。大きさ √(20² ＋ 15²) ＝ 25 m/s。A からは、B が北西の向きに進むように見えます。`},
    {id:"rc3",type:"num",prompt:`質量 2.0 kg の物体が、なめらかな水平面上で ${V("F")}<sub>1</sub> ＝ (3.0, 4.0) N と ${V("F")}<sub>2</sub> ＝ (1.0, −1.0) N の2力を受けている（ほかの力はつりあっている）。合力の大きさを求めよ。`,answer:5,tol:0.05,unit:"N",
     traps:{"6.4":"|F₁| ＋ |F₂| を計算していませんか。合力は成分どうしを足してから大きさを求めます。"},
     explain:`合力 ＝ (3.0 ＋ 1.0, 4.0 − 1.0) ＝ (4.0, 3.0) N、大きさ √(4.0² ＋ 3.0²) ＝ 5.0 N。`},
    {id:"rc4",type:"num",prompt:"このとき物体の加速度の大きさを求めよ。",answer:2.5,tol:0.03,unit:"m/s²",
     traps:{"10":"掛けていませんか。a ＝ F/m です。"},
     explain:`運動方程式 ${Q("m")}${V("a")} ＝ Σ${V("F")} より ${V("a")} ＝ (2.0, 1.5) m/s²、大きさ 5.0/2.0 ＝ 2.5 m/s²。加速度の向きは合力の向きです。`}
  ]},
  { title:"D. 正しいか、誤りか", lead:"正誤を答え、解説で正しい言い方を確かめよう。", qs:[
    {id:"rd1",type:"choice",prompt:`定積分 ${INT(Q("v"), "0", Q("t"))} は、いつも 0〜${Q("t")} の道のりを表す。`,options:TF,answer:1,
     explain:`誤り。定積分は「符号つきの面積」で、変位を表します。折り返すと ${Q("t")} 軸より下の面積が負になるので、道のりは ∫|${Q("v")}| d${Q("t")} で求めます。`},
    {id:"rd2",type:"choice",prompt:"力の向きが物体の変位と垂直なら、その力がする仕事は 0 である。",options:TF,answer:0,
     explain:`正しい。cos 90° ＝ 0 なので内積 ${V("F")}・${V("s")} ＝ 0。床の上をすべる物体が受ける垂直抗力の仕事などです。`},
    {id:"rd3",type:"choice",prompt:`物体が受ける力の合力が ${V("0")} なら、物体は必ず静止している。`,options:TF,answer:1,
     explain:`誤り。合力が ${V("0")} なら加速度が ${V("0")}、つまり速度が変わらないだけです。等速直線運動をしている場合もあります（慣性の法則）。`},
    {id:"rd4",type:"choice",prompt:`${Q("x")}-${Q("t")} 図で ${Q("x")} ＝ 0 になる時刻には、速度も 0 である。`,options:TF,answer:1,
     explain:`誤り。${Q("x")} ＝ 0 は「原点にいる」こと。速度は接線の傾きで、${Q("x")} の値そのものとは関係ありません。`},
    {id:"rd5",type:"choice",prompt:"斜面上の物体が受ける重力を、斜面に平行・垂直な成分に分解しても、重力そのものの大きさと向きは変わらない。",options:TF,answer:0,
     explain:`正しい。変わるのは「どの軸で見るか」による成分の値だけです。成分の2乗の和の平方根は、もとの大きさ ${Q("mg")} に等しくなります。${ANIM("anim/vector.html#force","軸を切りかえて比べる")}`}
  ]}]
},
{ id:"dim", advice:"微分は「÷ s」、積分は「× s」（∫ … dx なら × m）。式を書いたら単位で確かめよう。", tab:"③次元", title:"③ 次元チェック", back:"③ 次元チェック",
  intro:`d${Q("x")}/d${Q("t")} は分数ではありませんが、単位は「${Q("x")} の単位 ÷ ${Q("t")} の単位」になります。積分は面積なので「縦 × 横」の単位です。`,
  ref:{label:"微分・積分と単位の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", lead:`${Q("x")}〔m〕、${Q("t")}〔s〕、${Q("v")}〔m/s〕、${Q("a")}〔m/s²〕、${Q("F")}〔N〕とする。次の量の単位を選べ。`, qs:[
    {id:"da1",type:"choice",prompt:D("x","t"),options:UNITQ,answer:1,explain:"m ÷ s ＝ m/s（速度）。",two:true},
    {id:"da2",type:"choice",prompt:D("v","t"),options:UNITQ,answer:2,explain:"(m/s) ÷ s ＝ m/s²（加速度）。",two:true},
    {id:"da3",type:"choice",prompt:`∫${Q("a")} d${Q("t")}`,options:UNITQ,answer:1,explain:"(m/s²) × s ＝ m/s（速度の変化）。",two:true},
    {id:"da4",type:"choice",prompt:`∫${Q("v")} d${Q("t")}`,options:UNITQ,answer:0,explain:"(m/s) × s ＝ m（変位）。",two:true},
    {id:"da5",type:"choice",prompt:`∫${Q("F")} d${Q("x")}`,options:UNITQ,answer:3,explain:"N × m ＝ J（仕事）。F-x 図の面積です。",two:true}
  ]},
  { title:"B. 係数の単位", lead:`位置が ${Q("x")} ＝ 2${Q("t")}³〔m〕（${Q("t")} は s）で表される運動。`, qs:[
    {id:"db1",type:"choice",prompt:"係数 2 の単位はどれか。",options:["m/s³","m","m/s²","s³/m"],answer:0,
     explain:`2 × s³ が m になるので、2 の単位は m/s³。係数にも単位があります。`},
    {id:"db2",type:"choice",prompt:`${Q("v")} ＝ ${D("x","t")} ＝ 6${Q("t")}² の係数 6 の単位はどれか。`,options:["m/s³","m/s²","m/s"],answer:0,
     explain:`6${Q("t")}² が m/s になるので、6 の単位は (m/s) ÷ s² ＝ m/s³。微分しても係数の単位は変わらず、${Q("t")} の次数が1つ下がる分だけ全体が「÷ s」になります。`}
  ]},
  { title:"C. ベクトルと単位", qs:[
    {id:"dc1",type:"choice",prompt:"速度ベクトル (3.0, 4.0) m/s の大きさ √(3.0² ＋ 4.0²) の単位は？",options:["m/s","m²/s²","単位はない"],answer:0,
     explain:"√{(m/s)² ＋ (m/s)²} ＝ m/s。ベクトルの成分も大きさも、もとの量と同じ単位です。"},
    {id:"dc2",type:"choice",prompt:`内積 ${V("F")}・${V("s")}（${V("F")}〔N〕、${V("s")}〔m〕）の単位と種類は？`,options:["J、スカラー","J、ベクトル","N、ベクトル"],answer:0,
     explain:"N × m ＝ J。内積の値は数（スカラー）です。"},
    {id:"dc3",type:"multi",prompt:"次の式のうち、単位（次元）が合わないものをすべて選べ。",
     options:[`${Q("v")} ＝ ${D("x","t")}`,`${Q("x")} ＝ ∫${Q("a")} d${Q("t")}`,`${Q("a")} ＝ ${D("v","t")}`,`${Q("v")} ＝ ∫${Q("a")} d${Q("t")}`,`${Q("W")} ＝ ∫${Q("F")} d${Q("t")}`],answer:[1,4],
     explain:`∫${Q("a")} d${Q("t")} は m/s で速度（の変化）、${Q("x")}〔m〕ではありません。∫${Q("F")} d${Q("t")} は N·s で、仕事〔J ＝ N·m〕ではありません（仕事は ∫${Q("F")} d${Q("x")}）。`}
  ]}]
},
{ id:"step", advice:"微分か積分か、和か差か内積かを先に決めてから計算しよう。初期条件と向きの確認を忘れずに。", tab:"④手順", title:"④ 手順固定の演習", back:"④ 手順固定の演習",
  intro:"6つのステップで解きます。①何が何の関数か確かめる → ②使う数学を決める（微分・積分／和・差・内積）→ ③計算する → ④単位を確かめる → ⑤初期条件・向きを確かめる → ⑥結果を運動の言葉で言う。",
  ref:{label:"対応表を見る", html:MAP_TABLE},
  groups:[
  { title:"問題1（微分）", lead:ANIM("anim/calculus.html#diff","「減速して戻る」で確かめる（x ＝ 6t − t²）"),
    quote:`${Q("x")} 軸上を動く物体の位置が、${Q("x")} ＝ 6${Q("t")} − ${Q("t")}²〔m〕（${Q("t")} は時刻〔s〕）で表される。`, qs:[
    {id:"s11",type:"blanks",prompt:"ステップ2・3　速度と加速度を求める。",text:`${Q("v")} ＝ {0}〔m/s〕、${Q("a")} ＝ {1}〔m/s²〕`,
     options:[["6 − 2t","6t − 2","6 − t"],["−2","2","−2t"]],answer:[0,0],
     explain:`位置の式を微分すると速度、速度の式を微分すると加速度。${Q("a")} が一定なので、これは等加速度直線運動（初速度 6 m/s、加速度 −2 m/s²）です。`},
    {id:"s12",type:"num",prompt:"(1) 物体が折り返す時刻を求めよ。",answer:3,tol:0.01,unit:"s",
     explain:`${Q("v")} ＝ 6 − 2${Q("t")} ＝ 0 より ${Q("t")} ＝ 3.0 s。${Q("v")} が ＋ から − に変わるので、ここで ${Q("x")} は極大です。`},
    {id:"s13",type:"num",prompt:"(2) 折り返す位置を求めよ。",answer:9,tol:0.05,unit:"m",
     traps:{"18":"6t だけを計算していませんか。−t² の項も代入します。"},
     explain:`${Q("x")}(3) ＝ 18 − 9 ＝ 9.0 m。`},
    {id:"s14",type:"num",prompt:"(3) 0 s から 5 s までの変位を求めよ。",answer:5,tol:0.05,unit:"m",
     traps:{"13":"13 m は道のりです。変位は「後の位置 − 前の位置」です。"},
     explain:`${Q("x")}(5) − ${Q("x")}(0) ＝ (30 − 25) − 0 ＝ 5.0 m。`},
    {id:"s15",type:"num",prompt:"(4) 0 s から 5 s までの道のりを求めよ。",answer:13,tol:0.05,unit:"m",
     traps:{"5":"5 m は変位です。3 s で折り返しているので、0〜3 s と 3〜5 s に分けて考えよう。"},
     explain:`0〜3 s に 9 m 進み、3〜5 s に 9 − 5 ＝ 4 m 戻るので、9 ＋ 4 ＝ 13 m。`},
    {id:"s16",type:"choice",prompt:"ステップ6　この運動を言葉で表すと？",
     options:["正の向きに 6 m/s で出発し、一定の割合で減速して 3 s 後に折り返し、負の向きに速くなっていく","正の向きに一定の速さで進み続ける","3 s 後に止まり、そのまま静止している"],answer:0,
     explain:"鉛直投げ上げ（上向き正）と同じ形の運動です。3 s で一瞬止まりますが、加速度は −2 m/s² のままなので、そこから負の向きに動き出します。"}
  ]},
  { title:"問題2（積分）", lead:ANIM("anim/calculus.html#int","積分のページで確かめる"),
    quote:`${Q("x")} 軸上を動く物体の速度が ${Q("v")} ＝ ${Q("t")}² − 4${Q("t")} ＋ 3〔m/s〕で表され、${Q("t")} ＝ 0 で原点（${Q("x")} ＝ 0）にあった。`, qs:[
    {id:"s21",type:"choice",prompt:`ステップ2・3　位置 ${Q("x")} を ${Q("t")} の式で表したものはどれか。`,
     options:[`${Q("x")} ＝ (1/3)${Q("t")}³ − 2${Q("t")}² ＋ 3${Q("t")}`,`${Q("x")} ＝ 2${Q("t")} − 4`,`${Q("x")} ＝ ${Q("t")}³ − 4${Q("t")}² ＋ 3${Q("t")}`],answer:0,
     explain:`${Q("x")} ＝ ∫(${Q("t")}² − 4${Q("t")} ＋ 3) d${Q("t")} ＝ (1/3)${Q("t")}³ − 2${Q("t")}² ＋ 3${Q("t")} ＋ ${Q("C")}。2${Q("t")} − 4 は微分した式（加速度）です。微分して ${Q("v")} に戻るか確かめよう。`},
    {id:"s22",type:"choice",prompt:`ステップ5　積分定数 ${Q("C")} が 0 になる理由は？`,
     options:[`${Q("t")} ＝ 0 で ${Q("x")} ＝ 0 だから`,`${Q("t")} ＝ 0 で ${Q("v")} ＝ 0 だから`,"積分定数はいつも 0 だから"],answer:0,
     explain:`${Q("t")} ＝ 0 を代入すると ${Q("x")} ＝ ${Q("C")}。問題文の「原点にあった」から ${Q("C")} ＝ 0 です（${Q("t")} ＝ 0 の ${Q("v")} は 3 m/s で 0 ではありません）。`},
    {id:"s23",type:"num",prompt:"(1) 0 s から 3 s までの変位を求めよ。",answer:0,tol:0.02,unit:"m",
     explain:`${Q("x")}(3) ＝ 9 − 18 ＋ 9 ＝ 0。3 s 後には原点に戻っています。${Q("v")}-${Q("t")} 図では、${Q("t")} 軸より上の面積と下の面積が等しくなっています。`},
    {id:"s24",type:"num",prompt:"(2) 0 s から 3 s までの道のりを求めよ（小数第2位まで）。",answer:2.67,tol:0.02,unit:"m",
     traps:{"0":"0 m は変位です。v ＝ (t − 1)(t − 3) なので、1 s で折り返しています。","1.33":"0〜1 s の分だけです。1〜3 s に戻る距離も足します。"},
     explain:`${Q("v")} ＝ (${Q("t")} − 1)(${Q("t")} − 3) より 1 s で折り返す。${Q("x")}(1) ＝ 1/3 − 2 ＋ 3 ＝ 4/3 m。0〜1 s に 4/3 m 進み、1〜3 s に 4/3 m 戻るので、道のりは 8/3 ≒ 2.67 m。`},
    {id:"s25",type:"num",prompt:`(3) ${Q("t")} ＝ 3 s の加速度を求めよ。`,answer:2,tol:0.01,unit:"m/s²",
     traps:{"0":"それは速度 v(3) の値です。加速度は速度を微分した a ＝ 2t − 4 に代入します。"},
     explain:`${Q("a")} ＝ ${D("v","t")} ＝ 2${Q("t")} − 4 ＝ 2 m/s²。加速度が時刻とともに変わるので、この運動に等加速度直線運動の3式は使えません。`}
  ]},
  { title:"問題3（ベクトル：力のつりあい）", lead:ANIM("anim/vector.html#force","「糸2本でつるす」で θ₁ ＝ 60°、θ₂ ＝ 30° にして確かめる"),
    quote:"重さ 20 N のおもりを2本の糸でつるした。糸1は鉛直から左へ 60°、糸2は鉛直から右へ 30° 傾いていて、おもりは静止している。糸1・糸2の張力の大きさを T₁、T₂ とする。", qs:[
    {id:"s31",type:"blanks",prompt:"ステップ2・3　水平・鉛直の成分ごとに、つりあいの式を立てる。",text:"水平：{0}<br>鉛直：{1}",
     options:[["T₁ sin 60° ＝ T₂ sin 30°","T₁ cos 60° ＝ T₂ cos 30°","T₁ ＝ T₂"],["T₁ cos 60° ＋ T₂ cos 30° ＝ 20","T₁ sin 60° ＋ T₂ sin 30° ＝ 20","T₁ ＋ T₂ ＝ 20"]],answer:[0,0],
     explain:"角度を鉛直からはかっているので、鉛直成分が cos、水平成分が sin です。ベクトルの式 W＋T₁＋T₂＝0 を成分に分けると、この連立方程式になります。"},
    {id:"s32",type:"num",prompt:"T₁ を求めよ。",answer:10,tol:0.1,unit:"N",
     traps:{"17.3":"T₁ と T₂ を逆にしていませんか。鉛直に近い糸（30°）のほうが大きな張力になります。","17":"T₁ と T₂ を逆にしていませんか。"},
     explain:"水平の式から T₂ ＝ √3 T₁。鉛直の式に代入して T₁/2 ＋ (3/2)T₁ ＝ 20、2T₁ ＝ 20、T₁ ＝ 10 N。"},
    {id:"s33",type:"num",prompt:"T₂ を求めよ（有効数字3桁）。",answer:17.3,tol:0.1,unit:"N",
     traps:{"10":"T₁ と T₂ を逆にしていませんか。"},
     explain:"T₂ ＝ √3 × 10 ≒ 17.3 N。2本の糸が直角をなすので、力の三角形は直角三角形で、T₁ ＝ 20 sin 30°、T₂ ＝ 20 cos 30° とも求まります。"}
  ]},
  { title:"問題4（ベクトル：仕事と内積）", lead:ANIM("anim/vector.html#work","仕事と内積で確かめる"),
    quote:`なめらかな水平面上の物体に一定の力 ${V("F")} ＝ (3.0, 4.0) N（${Q("x")} 軸は水平、${Q("y")} 軸は鉛直上向き）を加え続け、物体を ${Q("x")} 軸の正の向きに 2.0 m 動かした。`, qs:[
    {id:"s41",type:"num",prompt:`(1) 力 ${V("F")} がした仕事を求めよ。`,answer:6,tol:0.05,unit:"J",
     traps:{"10":"|F| × |s| ＝ 5.0 × 2.0 を計算していませんか。力の変位の向きの成分だけが仕事をします。","14":"y 成分まで掛けていませんか。s の y 成分は 0 です。"},
     explain:`${V("s")} ＝ (2.0, 0) m なので、${Q("W")} ＝ ${V("F")}・${V("s")} ＝ 3.0 × 2.0 ＋ 4.0 × 0 ＝ 6.0 J。`},
    {id:"s42",type:"num",prompt:`(2) ${V("F")} と ${V("s")} のなす角を ${Q("θ")} とする。cos ${Q("θ")} を求めよ。`,answer:0.6,tol:0.01,unit:"",
     explain:`|${V("F")}| ＝ 5.0 N、|${V("s")}| ＝ 2.0 m。cos ${Q("θ")} ＝ 6.0/(5.0 × 2.0) ＝ 0.60。${Q("W")} ＝ ${Q("Fs")} cos ${Q("θ")} ＝ 5.0 × 2.0 × 0.60 ＝ 6.0 J と同じ結果になります。`},
    {id:"s43",type:"choice",prompt:"(3) この間に、重力と垂直抗力がした仕事は？",options:["どちらも 0（変位に垂直）","重力は負、垂直抗力は正","どちらも正"],answer:0,
     explain:"どちらの力も鉛直方向で、水平な変位に垂直なので、内積は 0 です。"},
    {id:"s44",type:"num",prompt:`(4) 同じ力のまま、変位が ${V("s")} ＝ (2.0, −1.0) m だったとする（斜面を下る場合など）。${V("F")} がした仕事を求めよ。`,answer:2,tol:0.05,unit:"J",
     traps:{"10":"y 成分の積は 4.0 × (−1.0) ＝ −4.0 で、負になります。"},
     explain:`${Q("W")} ＝ 3.0 × 2.0 ＋ 4.0 × (−1.0) ＝ 6.0 − 4.0 ＝ 2.0 J。上向きの成分は、下向きの変位に対して負の仕事をします。`},
    {id:"s45",type:"checklist",prompt:"解き終えたら、自分の答案を点検しよう（採点には入りません）。",
     items:["何が何の関数か（位置・速度・時刻）を最初に確かめた","微分・積分（和・差・内積）のどれを使うかを書いてから計算した","積分定数を初期条件で決めた","折り返しがあるか（v の符号が変わるか）を確かめた","成分の符号（向き）を確かめた","答えの単位を確かめた"]}
  ]}]
},
{ id:"sum", advice:"「傾き → 微分」「面積 → 積分」「合成 → 和」「〜から見た → 差」「仕事 → 内積」をセットで覚えよう。", tab:"まとめ", title:"単元のまとめ", back:"まとめ",
  intro:"計算はしません。どの数学を使うかだけを答えます。",
  ref:{label:"対応表を見る", html:MAP_TABLE},
  groups:[{ title:"使う数学を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:`${Q("x")}-${Q("t")} 図（または ${Q("x")} の式）から、ある時刻の速度を求めたい。`,options:TOOLS,answer:0,explain:`速度は ${Q("x")} を微分したもの（接線の傾き）。`},
    {id:"m2",type:"choice",prompt:`${Q("v")}-${Q("t")} 図（または ${Q("v")} の式）から、ある時間の変位を求めたい。`,options:TOOLS,answer:1,explain:`変位は ${Q("v")} を積分したもの（面積）。`},
    {id:"m3",type:"choice",prompt:"走っている電車 A から見た、別の電車 B の速度を求めたい。",options:TOOLS,answer:3,explain:`相対速度 ${V("v")}<sub>AB</sub> ＝ ${V("v")}<sub>B</sub> − ${V("v")}<sub>A</sub>（ベクトルの差）。`},
    {id:"m4",type:"choice",prompt:"物体が受ける2つの力を、1つの力に置きかえたい。",options:TOOLS,answer:2,explain:"合力はベクトルの和。"},
    {id:"m5",type:"choice",prompt:"斜めに引く力が、水平に動く物体にした仕事を求めたい。",options:TOOLS,answer:4,explain:`仕事は力と変位の内積 ${V("F")}・${V("s")}。`},
    {id:"m6",type:"choice",prompt:"加速度が時刻とともに変わる運動で、ある時間の変位を求めたい。",
     options:["等加速度直線運動の3式に代入する","加速度を積分して速度、速度を積分して変位を求める","この条件では求められない"],answer:1,
     explain:"3式は加速度が一定のときだけ使えます。微分・積分はどんな運動にも使えます（積分定数は初期条件で決める）。"},
    {id:"m7",type:"self",prompt:"物理基礎で学んだ内容のうち、数学とつながっていると一番感じたものを1つ選び、何と何がつながっているかを書け。",scored:false,
     model:"例：v-t グラフの面積が変位になることは、数学Ⅱの定積分と同じ。等加速度直線運動の x ＝ v₀t ＋ ½at² は、v ＝ v₀ ＋ at を積分すると出てくる。"}
  ]}]
}
];

registerUnit({
  id: "math-link",                  // js/index.js の id と同じにする
  title: "付録：数学で読む力学（微分・積分・ベクトル）",
  sections: SECTIONS
});
})();
