/*
 * 単元：電流と電気抵抗
 * 電荷・電流・電圧、オームの法則、抵抗率、直列・並列（共通な量の見分け）、電力・電力量・ジュール熱。
 * 「電流が流れる」「電圧がかかる」の言い分けと、電流の向きと電子の移動の向きの区別を重視する。
 */
(function(){

/* 物理量（斜体）の表示用スタイル */
if(typeof document !== "undefined" && !document.getElementById("notation-style")){
  const st = document.createElement("style");
  st.id = "notation-style";
  st.textContent = '.qv{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:italic;font-size:1.1em;padding:0 .04em}'
                 + '.qu{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:normal;font-size:1.1em}';
  document.head.appendChild(st);
}
const I = s => `<i class='qv'>${s}</i>`;
const Sb = (s, sub) => `${I(s)}<sub>${sub}</sub>`;
const q = I("q"), It = I("I"), t = I("t"), V = I("V"), R = I("R"), rho = I("ρ"), L = I("L"), S = I("S"), P = I("P"), W = I("W"), Q = I("Q"), e = I("e");
const R1 = Sb("R","1"), R2 = Sb("R","2"), I1 = Sb("I","1"), I2 = Sb("I","2");
const SI = s => `<tspan font-style="italic" font-family="Times New Roman,Times,serif">${s}</tspan>`;

/* 並列回路：電池 6.0 V、R₁ ＝ 10 Ω、R₂ ＝ 15 Ω */
const PARA = `<svg class="graph" viewBox="0 0 320 170" role="img" aria-label="電圧6.0 Vの電池に、10 Ωの抵抗R1と15 Ωの抵抗R2が並列につながれた回路図。">
<polyline points="60,70 60,30 280,30 280,62" fill="none" stroke="currentColor" stroke-width="1.6"/>
<polyline points="60,100 60,145 280,145 280,110" fill="none" stroke="currentColor" stroke-width="1.6"/>
<line x1="170" y1="30" x2="170" y2="62" stroke="currentColor" stroke-width="1.6"/><line x1="170" y1="110" x2="170" y2="145" stroke="currentColor" stroke-width="1.6"/>
<rect x="162" y="62" width="16" height="48" fill="var(--sheet)" stroke="currentColor" stroke-width="1.6"/>
<rect x="272" y="62" width="16" height="48" fill="var(--sheet)" stroke="currentColor" stroke-width="1.6"/>
<line x1="44" y1="70" x2="76" y2="70" stroke="currentColor" stroke-width="1.6"/><line x1="52" y1="80" x2="68" y2="80" stroke="currentColor" stroke-width="4"/>
<line x1="60" y1="80" x2="60" y2="100" stroke="currentColor" stroke-width="1.6"/>
<text x="6" y="80" font-size="12" fill="currentColor">6.0 V</text>
<text x="128" y="84" font-size="12" fill="currentColor">${SI("R")}₁</text><text x="124" y="100" font-size="11" fill="currentColor">10 Ω</text>
<text x="236" y="84" font-size="12" fill="currentColor">${SI("R")}₂</text><text x="232" y="100" font-size="11" fill="currentColor">15 Ω</text>
</svg>`;

/* 用語集（定義カード）：小単元ごとに折りたたみ。同じ name の details は1つだけ開く */
const GLOS = (id, groups) => groups.map((g, i) => `<details name='glos-${id}' ${i ? "" : "open"} style='margin:6px 0;border:1px solid var(--line);border-radius:6px;padding:2px 10px'>
<summary style='cursor:pointer;font-weight:700;padding:6px 0'>${g.title}<span style='font-weight:400;color:var(--muted);font-size:13px'>（${g.rows.length}語）</span></summary>
<div class="tbl"><table><colgroup><col style="width:7.2em"><col></colgroup>
<tr><th>用語</th><th>定義（記号・式・単位）</th></tr>
${g.rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}${r[2] ? `<br><span style='color:var(--blue);font-weight:700'>${r[2]}</span>` : ""}</td></tr>`).join("\n")}
</table></div></details>`).join("\n");
const DEF_TABLE = `<p style='margin:4px 0;font-size:14px;color:var(--muted)'>小単元をタップすると開きます。</p>` + GLOS("current", [
{ title:"1 静電気と電荷", rows:[
  ["帯電","物体が電気を帯びること。異なる物体どうしをこすり合わせると、一方から他方へ電子が移動して、両方の物体が帯電する"],
  ["静電気","物体に帯電して、その場にたまったまま移動しない電気"],
  ["静電気力","帯電した物体どうしの間にはたらく力。同種の電気（正と正、負と負）は退け合い、異種の電気（正と負）は引き合う"],
  ["原子核","原子の中心にある、正の電気をもつ粒。陽子と中性子からできている"],
  ["陽子","原子核をつくる粒子。正の電気をもつ",`電気量 ＋${e}`],
  ["中性子","原子核をつくる粒子。電気をもたない",`電気量 0`],
  ["電子","原子核のまわりにある粒子。負の電気をもつ。質量は陽子の約 1/1840",`電気量 −${e}`],
  ["電荷","電気を帯びた粒子や物体。また、物体がもつ電気のこと。正の電荷と負の電荷がある"],
  ["電気量","電荷がもつ電気の量。物体の間で電荷が移動しても、全体の電気量は変わらない（電気量保存の法則）",`${q}〔C〕（クーロン）`],
  ["電気素量","電子1個がもつ電気量の大きさ。どんな電気量も電気素量の整数倍",`${e} ＝ 1.6 × 10⁻¹⁹&nbsp;C`]
]},
{ title:"2 電流と電圧", rows:[
  ["自由電子","金属の中を自由に動き回ることができる電子。金属に電流が流れるのは、自由電子が移動するから"],
  ["導体","電気を通しやすい物質（金属など）。自由電子を多くもつ"],
  ["不導体（絶縁体）","電気をほとんど通さない物質（ガラス、ゴム、プラスチックなど）。自由電子がほとんどない"],
  ["半導体","電気の通しやすさが導体と不導体の中間の物質（ケイ素、ゲルマニウムなど）。温度や混ぜる物質によって性質が大きく変わる"],
  ["電流","電荷の流れ。導線の断面を 1&nbsp;s 間に通過する電気量で表す。向きは正の電荷が移動する向き（電子が移動する向きと逆）",`${It} ＝ ${q}/${t}〔A〕（アンペア）、1&nbsp;A ＝ 1&nbsp;C/s`],
  ["回路（電気回路）","電池などと、導線・抵抗などをつないでできる、電流の通り道。ひとまわり閉じていないと電流は流れない"],
  ["電圧（電位差）","2点間の電気的な高さ（電位）の差。電流を流そうとするはたらき。電圧は2点の「間にかかる」",`${V}〔V〕（ボルト）`]
]},
{ title:"3 電気抵抗", rows:[
  ["電気抵抗（抵抗）","電流の流れにくさ。導体の両端にかかる電圧と、流れる電流の比",`${R} ＝ ${V}/${It}〔Ω〕（オーム）、1&nbsp;Ω ＝ 1&nbsp;V/A`],
  ["オームの法則","抵抗を流れる電流は、両端にかかる電圧に比例する",`${V} ＝ ${R}${It}`],
  ["電気抵抗率（抵抗率）","物質の種類と温度で決まる、電流の流れにくさを表す量。導体の抵抗は長さに比例し、断面積に反比例する",`${R} ＝ ${rho}${L}/${S}、${rho}〔Ω·m〕`],
  ["合成抵抗","いくつかの抵抗をまとめて、同じはたらきをする1つの抵抗におきかえたもの"],
  ["直列接続","各抵抗を流れる電流が等しい。合成抵抗は「流れにくさ（抵抗）の和」",`${R} ＝ ${R1} ＋ ${R2}`],
  ["並列接続","各抵抗にかかる電圧が等しい。合成抵抗は「流れやすさ（抵抗の逆数）の和」から求める",`1/${R} ＝ 1/${R1} ＋ 1/${R2}`]
]},
{ title:"4 電気エネルギーと電力", rows:[
  ["電気エネルギー",`電流がもつ、仕事をする能力。電流が流れると、熱・光・運動などのエネルギーに変わる。電荷 ${q} が電圧 ${V} の区間を通ると、電気エネルギーが ${q}${V} だけ変わる`,`〔J〕`],
  ["消費電力（電力）","1&nbsp;s 間に消費される電気エネルギー",`${P} ＝ ${V}${It} ＝ ${R}${It}² ＝ ${V}²/${R}〔W〕（ワット）、1&nbsp;W ＝ 1&nbsp;J/s`],
  ["電力量","ある時間に消費された電気エネルギー",`${W} ＝ ${P}${t} ＝ ${V}${It}${t}〔J〕、1&nbsp;Wh ＝ 3600&nbsp;J、1&nbsp;kWh ＝ 3.6 × 10⁶&nbsp;J`],
  ["ジュール熱","抵抗に電流が流れたときに発生する熱"],
  ["ジュールの法則",`抵抗で発生するジュール熱 ${Q} は、電流の2乗、抵抗、時間に比例する（消費された電力量に等しい）`,`${Q} ＝ ${R}${It}²${t} ＝ ${V}${It}${t}〔J〕`]
]}
]);
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th></tr>
<tr><td>電気量 ${q}</td><td>C ＝ A·s</td></tr>
<tr><td>電流 ${It}</td><td>A ＝ C/s</td></tr>
<tr><td>電圧 ${V}</td><td>V</td></tr>
<tr><td>抵抗 ${R}</td><td>Ω ＝ V/A</td></tr>
<tr><td>抵抗率 ${rho}</td><td>Ω·m</td></tr>
<tr><td>電力 ${P}</td><td>W ＝ V·A ＝ J/s</td></tr></table></div>`;
const STEPS = `<p>1 回路図を見て、直列か並列かを見分ける → 2 共通な量（直列は電流、並列は電圧）を確かめる → 3 合成抵抗を求める → 4 オームの法則で回路全体の電流を求める → 5 各抵抗の電流・電圧を求める → 6 単位をそろえて代入 → 7 妥当性（電圧の和・電流の和が合うか）</p>`;
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;
const TF = ["正しい","誤り"];
const UNITQ = ["A（電流）","Ω（抵抗）","W（電力）","J（電力量・熱量）"];

const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:`電流は「流れる」もの、電圧は2点の間に「かかる」もの。言い方まで含めて正確に覚えます。<br>アニメーションで確かめよう：<br>${ANIM("anim/ohm.html#idef","電流の定義")}${ANIM("anim/ohm.html#one","オームの法則と電力")}${ANIM("anim/ohm.html#series","直列")}${ANIM("anim/ohm.html#parallel","並列")}${ANIM("anim/ohm.html#rho","抵抗と抵抗率")}${ANIM("anim/circuit.html","回路シミュレーター")}${ANIM("anim/joule.html","電熱線で水を温める（ジュール熱）")}`,
  advice:"電流の向きの定義、オームの法則、直列と並列で共通な量を覚え直そう。",
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"blanks",text:"電流の向きは{0}の電荷が移動する向きで、電子が移動する向きと{1}である。",
     options:[["正","負"],["逆向き","同じ向き"]],answer:[0,0],explain:"導線の中で実際に動いているのは電子（負の電荷）なので、電子は電流と逆向きに移動します。"},
    {id:"d2",type:"choice",prompt:`時間 ${t} の間に電気量 ${q} が導線の断面を通過したときの電流 ${It} は？`,
     options:[`${It} ＝ ${q}/${t}`,`${It} ＝ ${q}${t}`,`${It} ＝ ${t}/${q}`],answer:0,explain:"1 A ＝ 1 C/s。1 s 間に 1 C 通過する電流が 1 A です。"},
    {id:"d3",type:"blanks",text:`オームの法則は ${V} ＝ {0} で、抵抗の単位は{1}である。`,
     options:[["<i class='qv'>RI</i>","<i class='qv'>R</i>/<i class='qv'>I</i>","<i class='qv'>I</i>/<i class='qv'>R</i>"],["Ω","V","A"]],answer:[0,0],explain:`${V} ＝ ${R}${It}。Ω ＝ V/A。`},
    {id:"d4",type:"choice",prompt:"同じ物質でできた導線の抵抗について、正しいものはどれか。",
     options:["長さに比例し、断面積に反比例する","長さに反比例し、断面積に比例する","長さにも断面積にもよらない"],answer:0,
     explain:`${R} ＝ ${rho}${L}/${S}。長いほど、細いほど電流が流れにくくなります。`},
    {id:"d5",type:"blanks",text:"直列につないだ抵抗では、各抵抗を流れる{0}が等しい。並列につないだ抵抗では、各抵抗にかかる{1}が等しい。",
     options:[["電流","電圧"],["電流","電圧"]],answer:[0,1],explain:"回路の問題では、まず「共通な量」を見つけます。"},
    {id:"d6",type:"choice",prompt:`抵抗 ${R1}, ${R2} を並列につないだときの合成抵抗 ${R} はどれか。`,
     options:[`1/${R} ＝ 1/${R1} ＋ 1/${R2}`,`${R} ＝ ${R1} ＋ ${R2}`,`${R} ＝ ${R1}${R2}`],answer:0,explain:`${R} ＝ ${R1} ＋ ${R2} は直列の場合です。`},
    {id:"d7",type:"blanks",text:`電力は ${P} ＝ {0} で、単位は{1}である。`,options:[["<i class='qv'>VI</i>","<i class='qv'>V</i>/<i class='qv'>I</i>","<i class='qv'>VIt</i>"],["W","J","Wh"]],answer:[0,0],
     explain:`${V}${It}${t} は電力量（J）です。`},
    {id:"d8",type:"choice",prompt:"1 kWh は何 J か。",options:["3.6 × 10⁶ J","1.0 × 10³ J","3.6 × 10³ J"],answer:0,explain:"1000 W × 3600 s ＝ 3.6 × 10⁶ J。"},
    {id:"d9",type:"choice",prompt:"電気素量（電子1個の電気量の大きさ）はどれか。",options:["1.6 × 10⁻¹⁹ C","1.6 × 10¹⁹ C","9.1 × 10⁻³¹ C"],answer:0,
     explain:"9.1 × 10⁻³¹ は電子の質量（kg）の値です。"}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル",
  intro:"「流れる」「かかる」の使い分けと、回路図から共通な量を読み取る練習です。",
  advice:"電流は「流れる」、電圧は「かかる」。回路図では直列か並列かを最初に見分けよう。",
  groups:[
  { title:"A. 言い回しと向きを読む", qs:[
    {id:"ra1",type:"choice",prompt:"正しい言い方はどれか。",
     options:["抵抗の両端に電圧がかかり、抵抗に電流が流れる","抵抗に電圧が流れ、抵抗の両端に電流がかかる","抵抗に電圧と電流が流れる"],answer:0,
     explain:"電圧は2点間の差なので「かかる（加わる）」、電流は導線を「流れる」です。"},
    {id:"ra2",type:"choice",prompt:"導線の中を、電子が点 A から点 B へ移動している。電流の向きは？",options:["B から A","A から B","電流は流れていない"],answer:0,
     explain:"電流の向きは、電子の移動の向きと逆です。"},
    {id:"ra3",type:"blanks",prompt:"測定器のつなぎ方",text:"電流計は測りたい部分に{0}に、電圧計は測りたい部分に{1}につなぐ。",
     options:[["直列","並列"],["直列","並列"]],answer:[0,1],
     explain:"電流計には同じ電流を通し（直列）、電圧計は2点間の差を測る（並列）からです。"}
  ]},
  { title:"B. 回路図を読む", lead:`電池（6.0 V）に、抵抗 <i class='qv'>R</i>₁（10 Ω）と <i class='qv'>R</i>₂（15 Ω）を並列につないだ回路。${ANIM("anim/ohm.html#parallel","並列回路のアニメーション（<i class='qv'>R</i>₂ を 15 Ω にして確かめる）")}`, figure:PARA, qs:[
    {id:"rb1",type:"choice",prompt:`${R1} と ${R2} で等しい量はどれか。`,options:["かかる電圧","流れる電流","消費電力"],answer:0,
     explain:"並列では、どちらの抵抗の両端も電池の両端とつながっているので、電圧が等しくなります。"},
    {id:"rb2",type:"choice",prompt:"大きい電流が流れるのはどちらの抵抗か。",options:[R1,R2,"同じ"],answer:0,
     explain:`電圧が同じなので、抵抗が小さい ${R1} のほうが電流は大きくなります（${It} ＝ ${V}/${R}）。`},
    {id:"rb3",type:"choice",prompt:`この回路の合成抵抗は、${R1}（10 Ω）と比べてどうか。`,options:["10 Ω より小さい","10 Ω より大きい","10 Ω に等しい"],answer:0,
     explain:"並列につなぐと電流の通り道が増えるので、合成抵抗はどの抵抗よりも小さくなります。"}
  ]},
  { title:"C. 正しいか、誤りか", qs:[
    {id:"rc1",type:"choice",prompt:"電流は、電池から出て回路を回るうちに少しずつ減っていく。",options:TF,answer:1,
     explain:"誤り。電荷は保存されるので、枝分かれのない回路ではどこでも電流は同じです。減るのは電気エネルギーです。"},
    {id:"rc2",type:"choice",prompt:"同じ物質の導線なら、太いほど抵抗は小さい。",options:TF,answer:0,explain:"正しい。抵抗は断面積に反比例します。"},
    {id:"rc3",type:"choice",prompt:"消費電力が大きい電気器具ほど、1 s 間に多くの電気エネルギーを使う。",options:TF,answer:0,explain:"正しい。電力は 1 s 間あたりの電気エネルギーです。"},
    {id:"rc4",type:"choice",prompt:"kWh は電力の単位である。",options:TF,answer:1,explain:"誤り。kWh は電力量（エネルギー）の単位です。電力の単位は W。"},
    {id:"rc5",type:"choice",prompt:"電子は電池の正極から出て、回路を通って負極へ向かう。",options:TF,answer:1,
     explain:"誤り。電子は負極から出て正極へ向かいます。電流はその逆に、正極から負極へ流れます。"},
    {id:"rc6",type:"choice",prompt:"抵抗を直列につなぐほど、回路全体の抵抗は大きくなる。",options:TF,answer:0,explain:"正しい。直列の合成抵抗は各抵抗の和です。"}
  ]}]
},
{ id:"dim", tab:"③次元", title:"③ 次元チェック",
  intro:"A ＝ C/s、Ω ＝ V/A、W ＝ V·A ＝ J/s。電気の単位は互いにこの関係で結ばれています。",
  advice:"Ω ＝ V/A、W ＝ V·A を使って式の単位を確かめ、面積は m² にそろえよう。",
  ref:{label:"単位の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", qs:[
    {id:"da1",type:"choice",prompt:`${q} ÷ ${t}`,options:UNITQ,answer:0,two:true,explain:"C ÷ s ＝ A。電流です。"},
    {id:"da2",type:"choice",prompt:`${V} ÷ ${It}`,options:UNITQ,answer:1,two:true,explain:"V ÷ A ＝ Ω。抵抗です。"},
    {id:"da3",type:"choice",prompt:`${V} × ${It}`,options:UNITQ,answer:2,two:true,explain:"V × A ＝ W。電力です。"},
    {id:"da4",type:"choice",prompt:`${P} × ${t}`,options:UNITQ,answer:3,two:true,explain:"W × s ＝ J。電力量です。"},
    {id:"da5",type:"choice",prompt:`${rho}${L} ÷ ${S}`,options:UNITQ,answer:1,two:true,explain:"Ω·m × m ÷ m² ＝ Ω。抵抗です。"}
  ]},
  { title:"B. 式の単位を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、単位が合わないものをすべて選べ。",
     options:[`${It} ＝ ${q}/${t}`,`${It} ＝ ${q}${t}`,`${R} ＝ ${rho}${L}/${S}`,`${R} ＝ ${rho}${S}/${L}`,`${P} ＝ ${V}${It}`,`${P} ＝ ${V}/${It}`],answer:[1,3,5],
     explain:`${q}${t} は C·s、${rho}${S}/${L} は Ω·m²、${V}/${It} は Ω で、どれも左辺と合いません。`}
  ]},
  { title:"C. 単位を換算する", qs:[
    {id:"dc1",type:"choice",prompt:"消費電力 1.0 kW の電気器具を 2.0 時間使ったときの電力量はどれか。",
     options:["2.0 kWh ＝ 7.2 × 10⁶ J","2.0 kWh ＝ 7.2 × 10³ J","2.0 kW ＝ 2.0 × 10³ J"],answer:0,explain:"1.0 kW × 2.0 h ＝ 2.0 kWh ＝ 2.0 × 3.6 × 10⁶ J。"}
  ]},
  { title:"D. 答案の誤りを見つける", lead:`問「抵抗率 1.7 × 10⁻⁸ Ω·m の銅線（長さ 2.0 m、断面積 1.0 mm²）の抵抗を求めよ。」${ANIM("anim/ohm.html#rho","抵抗と抵抗率のアニメーション（銅・2 m・1 mm² で確かめる）")}`,
    quote:`答案：${R} ＝ ${rho}${L}/${S} ＝ 1.7 × 10⁻⁸ × 2.0 ÷ 1.0 ＝ 3.4 × 10⁻⁸ Ω`, qs:[
    {id:"dd1",type:"choice",prompt:"この答案の誤りはどれか。",options:["断面積を mm² のまま代入している","式は <i class='qv'>R</i> ＝ <i class='qv'>ρS</i>/<i class='qv'>L</i> であるべき","長さを cm に直していない"],answer:0,
     explain:"抵抗率が Ω·m なので、断面積は m² にそろえます。1.0 mm² ＝ 1.0 × 10⁻⁶ m²。"},
    {id:"dd2",type:"choice",prompt:"正しい抵抗はどれか。",options:["3.4 × 10⁻² Ω","3.4 × 10⁻⁸ Ω","3.4 × 10⁻¹⁴ Ω"],answer:0,
     explain:"1.7 × 10⁻⁸ × 2.0 ÷ (1.0 × 10⁻⁶) ＝ 3.4 × 10⁻² Ω。1 mm² ＝ (10⁻³ m)² ＝ 10⁻⁶ m² に注意。"}
  ]}]
},
{ id:"step", tab:"④手順", title:"④ 手順固定の演習",
  intro:`回路の問題は「直列か並列か → 共通な量 → 合成抵抗 → 全体の電流 → 各部分」の順に解きます。<br>${ANIM("anim/circuit.html","回路シミュレーター（答えを確かめる）")}`,
  advice:"共通な量を確かめてから、合成抵抗と全体の電流を求めよう。",
  ref:{label:"7ステップを見る", html:STEPS},
  groups:[
  { title:"問題1（直列・すべてのステップ）", lead:ANIM("anim/ohm.html#series","直列回路のアニメーション"), quote:"10 Ω の抵抗 <i class='qv'>R</i>₁ と 20 Ω の抵抗 <i class='qv'>R</i>₂ を直列につなぎ、6.0 V の電池につないだ。", qs:[
    {id:"s11",type:"choice",prompt:"ステップ2　共通な量は？",options:["電流","電圧"],answer:0,explain:"直列では、どの抵抗にも同じ電流が流れます。"},
    {id:"s12",type:"num",prompt:"ステップ3　合成抵抗",answer:30,tol:0.1,unit:"Ω",traps:{"6.7":"直列は和です。並列の式を使っていませんか。"},explain:`${R} ＝ 10 ＋ 20 ＝ 30 Ω。`},
    {id:"s13",type:"num",prompt:"ステップ4　回路を流れる電流",answer:0.20,tol:0.002,unit:"A",traps:{"180":"<i class='qv'>I</i> ＝ <i class='qv'>V</i>/<i class='qv'>R</i> です。","5":"<i class='qv'>I</i> ＝ <i class='qv'>V</i>/<i class='qv'>R</i>（6.0 ÷ 30）です。"},explain:`${It} ＝ 6.0 ÷ 30 ＝ 0.20 A。`},
    {id:"s14",type:"blanks",prompt:"ステップ5　各抵抗にかかる電圧",text:`${R1} の電圧：{0}　${R2} の電圧：{1}`,
     options:[["2.0 V","4.0 V","6.0 V"],["2.0 V","4.0 V","6.0 V"]],answer:[0,1],explain:`${V} ＝ ${R}${It} より、10 × 0.20 ＝ 2.0 V、20 × 0.20 ＝ 4.0 V。`},
    {id:"s15",type:"choice",prompt:"ステップ7　妥当性の確認として正しいものはどれか。",
     options:["2つの電圧の和 2.0 V ＋ 4.0 V が電池の 6.0 V に等しい","2つの電圧が等しい","2つの電流の和が 0.20 A になる"],answer:0,
     explain:"直列では、各抵抗の電圧の和が全体の電圧になります。"}
  ]},
  { title:"問題2（並列）", lead:`②読解ドリル B の並列回路（6.0 V、<i class='qv'>R</i>₁ ＝ 10 Ω、<i class='qv'>R</i>₂ ＝ 15 Ω）。${ANIM("anim/ohm.html#parallel","並列回路のアニメーション")}`, figure:PARA, qs:[
    {id:"s21",type:"num",prompt:"合成抵抗",answer:6.0,tol:0.05,unit:"Ω",traps:{"25":"並列の合成抵抗は 1/R ＝ 1/R₁ ＋ 1/R₂ です。","0.17":"1/R を求めた後、逆数をとります。"},
     explain:`1/${R} ＝ 1/10 ＋ 1/15 ＝ 1/6、${R} ＝ 6.0 Ω。`},
    {id:"s22",type:"num",prompt:"電池から流れ出る電流",answer:1.0,tol:0.01,unit:"A",explain:`${It} ＝ 6.0 ÷ 6.0 ＝ 1.0 A。`},
    {id:"s23",type:"blanks",prompt:"各抵抗を流れる電流",text:`${I1}：{0}　${I2}：{1}`,options:[["0.60 A","0.40 A","1.0 A"],["0.60 A","0.40 A","1.0 A"]],answer:[0,1],
     explain:"どちらにも 6.0 V がかかるので、6.0 ÷ 10 ＝ 0.60 A、6.0 ÷ 15 ＝ 0.40 A。和は 1.0 A で、全体の電流と一致します。"}
  ]},
  { title:"問題3（電力と電力量）", lead:ANIM("anim/joule.html","電熱線で水を温めるシミュレーター（電力量 ＝ ジュール熱）"), quote:"100 V で使うと消費電力が 1000 W になる電気ヒーターがある。", qs:[
    {id:"s31",type:"num",prompt:"流れる電流",answer:10,tol:0.05,unit:"A",traps:{"100000":"<i class='qv'>P</i> ＝ <i class='qv'>VI</i> から <i class='qv'>I</i> ＝ <i class='qv'>P</i>/<i class='qv'>V</i> です。","0.1":"<i class='qv'>I</i> ＝ <i class='qv'>P</i>/<i class='qv'>V</i>（1000 ÷ 100）です。"},explain:`${It} ＝ ${P}/${V} ＝ 1000 ÷ 100 ＝ 10 A。`},
    {id:"s32",type:"num",prompt:"ヒーターの抵抗",answer:10,tol:0.05,unit:"Ω",explain:`${R} ＝ ${V}/${It} ＝ 100 ÷ 10 ＝ 10 Ω。`},
    {id:"s33",type:"choice",prompt:"30 分間使ったときの電力量はどれか。",options:["0.50 kWh ＝ 1.8 × 10⁶ J","500 kWh","3.0 × 10⁴ J"],answer:0,
     explain:"1.0 kW × 0.50 h ＝ 0.50 kWh ＝ 1000 W × 1800 s ＝ 1.8 × 10⁶ J。分を秒に直すのを忘れないこと。"},
    {id:"s34",type:"choice",prompt:"導線に 1.6 A の電流が流れているとき、断面を 1 s 間に通過する電子の数はどれか。",
     options:["1.0 × 10¹⁹ 個","1.6 × 10¹⁹ 個","2.6 × 10⁻¹⁹ 個"],answer:0,explain:`1 s 間に 1.6 C が通過するので、1.6 ÷ (1.6 × 10⁻¹⁹) ＝ 1.0 × 10¹⁹ 個。`},
    {id:"s35",type:"self",prompt:"抵抗を並列につなぐと、合成抵抗がもとのどの抵抗よりも小さくなる理由を説明せよ。",
     model:"並列につなぐと電流の通り道が増え、同じ電圧でも全体としてより多くの電流が流れるようになるから。導線を太くした（断面積を大きくした）のと同じ効果である。"},
    {id:"s36",type:"checklist",prompt:"解き終えたら点検しよう（採点には入りません）。",
     items:["直列か並列かを見分けた","共通な量（電流か電圧か）を確かめた","並列の合成抵抗は逆数をとった","電圧の和・電流の和で答えを確かめた","時間を秒に、面積を m² に直した"]}
  ]}]
},
{ id:"sum", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。場面に合う関係を選びます。",
  advice:"直列は電流、並列は電圧が共通。この見分けから始めよう。",
  groups:[{ title:"関係を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"直列回路で、すべての抵抗に共通な量は？",options:["電流","電圧","抵抗"],answer:0,explain:"直列は電流が共通です。"},
    {id:"m2",type:"choice",prompt:"並列回路で、すべての抵抗に共通な量は？",options:["電流","電圧","抵抗"],answer:1,explain:"並列は電圧が共通です。"},
    {id:"m3",type:"choice",prompt:"電気器具が一定時間に使った電気エネルギーを求めたい。",options:[`${W} ＝ ${P}${t}`,`${P} ＝ ${V}${It}`,`${V} ＝ ${R}${It}`],answer:0,explain:"電力 × 時間 ＝ 電力量です。"},
    {id:"m4",type:"choice",prompt:"導線の長さと太さから抵抗を求めたい。",options:[`${R} ＝ ${rho}${L}/${S}`,`${R} ＝ ${V}/${It}`,`${R} ＝ ${R1} ＋ ${R2}`],answer:0,explain:"抵抗率の式を使います。"},
    {id:"m5",type:"blanks",prompt:"次の文を完成させよ。",text:"電流は導線を{0}もので、電圧は2点の間に{1}ものである。電子は電流と{2}に移動する。",
     options:[["流れる","かかる"],["流れる","かかる"],["逆向き","同じ向き"]],answer:[0,1,0],explain:"言い方を正しく使い分けると、何を求めればよいかがはっきりします。"}
  ]}]
}
];

registerUnit({ id:"current", title:"電流と電気抵抗", sections: SECTIONS });
})();
