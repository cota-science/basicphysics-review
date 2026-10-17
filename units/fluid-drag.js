/*
 * 単元：圧力・浮力・空気抵抗
 * このファイルは js/index.js の file に "units/fluid-drag.js" と書くと読み込まれます。
 * 書き方は units/TEMPLATE.js を参照してください。
 * パスカルの原理は「発展」として扱う。
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

const Q = s => `<i class='qv'>${s}</i>`;
const p0 = `${Q("p")}₀`, rho = Q("ρ"), vf = `${Q("v")}<sub>f</sub>`;
const ADV = `<span style='display:inline-block;font-size:12px;font-weight:700;color:var(--blue);border:1px solid var(--blue);border-radius:4px;padding:0 5px;margin-left:4px;vertical-align:1px'>発展</span>`;
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;
const GLOS = (id, groups) => groups.map((g, i) => `<details name='glos-${id}' ${i ? "" : "open"} style='margin:6px 0;border:1px solid var(--line);border-radius:6px;padding:2px 10px'>
<summary style='cursor:pointer;font-weight:700;padding:6px 0'>${g.title}<span style='font-weight:400;color:var(--muted);font-size:13px'>（${g.rows.length}語）</span></summary>
<div class="tbl"><table><colgroup><col style="width:7.2em"><col></colgroup>
<tr><th>用語</th><th>定義（記号・式・単位）</th></tr>
${g.rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}${r[2] ? `<br><span style='color:var(--blue);font-weight:700'>${r[2]}</span>` : ""}</td></tr>`).join("\n")}
</table></div></details>`).join("\n");

const DEF_TABLE = `<p style='margin:4px 0;font-size:14px;color:var(--muted)'>小単元をタップすると開きます。</p>` + GLOS("fluid", [
{ title:"1 圧力と水圧", rows:[
  ["圧力","面を垂直に押す力の、単位面積（1 m²）あたりの大きさ",`${Q("p")} ＝ ${Q("F")}/${Q("S")}　単位 Pa（パスカル）`],
  ["パスカル（Pa）","圧力の単位。1 m² あたり 1 N の力で押すときの圧力","1 Pa ＝ 1 N/m²"],
  ["密度","物質の単位体積（1 m³）あたりの質量",`${rho} ＝ ${Q("m")}/${Q("V")}　単位 kg/m³（水は 1.0×10³ kg/m³）`],
  ["大気圧","大気（空気）による圧力。地上ではおよそ 1 気圧","1 気圧 ＝ 1.013×10⁵ Pa"],
  ["水圧","水中の物体が水から受ける圧力。深さ h では、大気圧に、その上にある水の柱の重さによる圧力が加わる",`${Q("p")} ＝ ${p0} ＋ ${rho}${Q("g")}${Q("h")}`],
  ["圧力の向き","液体中の同じ深さの点では、圧力はあらゆる向きに同じ大きさで、面に垂直にはたらく。容器の形にもよらない"],
  ["パスカルの原理" + ADV,"密閉した液体の一部に加えた圧力の増加は、液体のどの部分にも同じ大きさで伝わる。油圧ジャッキ・ブレーキに利用",`${Q("F")}₁/${Q("S")}₁ ＝ ${Q("F")}₂/${Q("S")}₂`]
]},
{ title:"2 浮力", rows:[
  ["浮力","流体（液体や気体）の中の物体が、流体から受ける鉛直上向きの力。下面が受ける圧力のほうが上面より大きいために生じる","向きは鉛直上向き"],
  ["アルキメデスの原理","浮力の大きさは、物体が押しのけた流体の重さに等しい",`${Q("F")} ＝ ${rho}${Q("V")}${Q("g")}（${rho}：流体の密度、${Q("V")}：流体中にある部分の体積）`]
]},
{ title:"3 空気抵抗", rows:[
  ["空気抵抗","空気中を動く物体が、空気から受ける力。運動を妨げる向き（速度と逆向き）にはたらき、速いほど大きい",`速さがあまり大きくないとき ${Q("k")}${Q("v")}（${Q("k")}：比例定数、単位 kg/s）`],
  ["終端速度","空気抵抗を受けて落下する物体で、重力と空気抵抗がつりあい、一定になった速度",`${Q("mg")} ＝ ${Q("k")}${vf} より ${vf} ＝ ${Q("mg")}/${Q("k")}`]
]}]);

const FORMULAS = `<p class="formula">圧力：${Q("p")} ＝ ${Q("F")}/${Q("S")}　　水圧：${Q("p")} ＝ ${p0} ＋ ${rho}${Q("g")}${Q("h")}　　浮力：${Q("F")} ＝ ${rho}${Q("V")}${Q("g")}</p>
<p class="formula">空気抵抗を受ける落下（下向き正）：${Q("ma")} ＝ ${Q("mg")} − ${Q("k")}${Q("v")}　　終端速度：${vf} ＝ ${Q("mg")}/${Q("k")}</p>
<p class="formula">1 Pa ＝ 1 N/m²　　1 気圧 ＝ 1.013×10⁵ Pa　　1 cm² ＝ 1×10⁻⁴ m²</p>`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th><th>基本単位で</th></tr>
<tr><td>力 ${Q("F")}</td><td>N</td><td>kg·m/s²</td></tr>
<tr><td>面積 ${Q("S")}</td><td>m²</td><td>m²</td></tr>
<tr><td>圧力 ${Q("p")}</td><td>Pa ＝ N/m²</td><td>kg/(m·s²)</td></tr>
<tr><td>密度 ${rho}</td><td>kg/m³</td><td>kg/m³</td></tr>
<tr><td>体積 ${Q("V")}</td><td>m³</td><td>m³</td></tr>
<tr><td>比例定数 ${Q("k")}（空気抵抗 ${Q("k")}${Q("v")}）</td><td>kg/s</td><td>N·s/m ＝ kg/s</td></tr></table></div>`;

/* 空気抵抗を受けて落下する物体の v-t グラフ */
const VT_DRAG = `<svg class="graph" viewBox="0 0 320 180" role="img" aria-label="v-t グラフ。原点から立ち上がり、しだいに傾きが小さくなって水平な破線（終端速度）に近づく曲線と、原点を通る直線（空気抵抗なし）。">
<line x1="34" y1="155" x2="305" y2="155" stroke="currentColor" stroke-width="1.5"/>
<line x1="34" y1="165" x2="34" y2="12" stroke="currentColor" stroke-width="1.5"/>
<line x1="34" y1="155" x2="140" y2="20" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="112" y="44" font-size="12" fill="var(--muted)">空気抵抗なし</text>
<line x1="34" y1="62" x2="300" y2="62" stroke="var(--red)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="232" y="56" font-size="12" fill="var(--red)">終端速度</text>
<path d="M34,155 C70,108 100,82 140,72 S230,63 300,62.5" fill="none" stroke="var(--blue)" stroke-width="3"/>
<text x="298" y="172" font-size="14" fill="currentColor"><tspan font-style="italic" font-family="Times New Roman,Times,serif">t</tspan></text>
<text x="14" y="20" font-size="14" fill="currentColor"><tspan font-style="italic" font-family="Times New Roman,Times,serif">v</tspan></text>
<text x="22" y="168" font-size="12" fill="currentColor">0</text>
</svg>`;

const TF = ["正しい", "誤り"];
const UNITQ = ["Pa（N/m²）", "N", "m/s", "kg/s"];

const SECTIONS = [
{ id:"def", advice:"圧力 ＝ 力 ÷ 面積、浮力の ρ は流体の密度、空気抵抗は速度と逆向き。定義カードで確かめよう。", tab:"①定義", title:"① 定義カード", back:"① 定義カード",
  intro:`目に見えない「流体（液体・気体）から受ける力」を、言葉と式で正確に言えるようにします。<br>アニメーションで確かめよう：<br>${ANIM("anim/fluid.html#pressure","水圧（液体の圧力）")}${ANIM("anim/fluid.html#buoy","浮力（アルキメデスの原理）")}${ANIM("anim/fluid.html#pascal","パスカルの原理（発展）")}${ANIM("anim/drag.html","空気抵抗と落下")}`,
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[
  { title:"A. 圧力と水圧", qs:[
    {id:"d1",type:"blanks",text:`圧力とは、面を{0}押す力の、{1}あたりの大きさであり、${Q("p")} ＝ {2} で表す。`,
     options:[["垂直に","平行に","斜めに"],["単位面積（1 m²）","単位体積（1 m³）","単位時間（1 s）"],["F/S","FS","S/F"]],answer:[0,0,0],
     explain:"圧力 ＝ 力 ÷ 面積。同じ力でも、面積が小さいほど圧力は大きくなります（くつより、とがったくぎの先のほうが刺さる）。"},
    {id:"d2",type:"blanks",text:"圧力の単位 1 Pa は{0}であり、1 気圧はおよそ{1}である。",
     options:[["1 N/m²","1 N·m²","1 N/m"],["1.013×10⁵ Pa","1.013×10³ Pa","1.013 Pa"]],answer:[0,0],
     explain:"1 Pa ＝ 1 N/m²。1 気圧 ＝ 1.013×10⁵ Pa ＝ 1013 hPa（天気予報のヘクトパスカル）。"},
    {id:"d3",type:"blanks",text:`大気圧 ${p0} の下で、密度 ${rho} の液体の深さ ${Q("h")} の点の圧力は ${Q("p")} ＝ {0} である。`,
     options:[["p₀ ＋ ρgh","ρgh","p₀ − ρgh"]],answer:[0],
     explain:`深さ ${Q("h")} の点より上には、空気（大気圧 ${p0}）と、高さ ${Q("h")} の液体の柱がのっています。液体の柱の重さによる圧力が ${rho}${Q("g")}${Q("h")} です。${ANIM("anim/fluid.html#pressure","液柱で考える")}`},
    {id:"d4",type:"choice",prompt:"液体中の同じ深さの点で、圧力の向きと大きさについて正しいものはどれか。",
     options:["あらゆる向きに同じ大きさではたらき、容器の形にもよらない","上から下向きにだけはたらく","容器が細いほど大きくなる"],answer:0,
     explain:"圧力は深さだけで決まり、面の向き・容器の形によりません。力は面に垂直な向きにはたらきます。"}
  ]},
  { title:"B. 浮力", qs:[
    {id:"d5",type:"blanks",text:`アルキメデスの原理：浮力の大きさは、物体が{0}の重さに等しい。式 ${Q("F")} ＝ ${rho}${Q("V")}${Q("g")} の ${rho} は{1}、${Q("V")} は{2}である。`,
     options:[["押しのけた流体","物体そのもの","物体の上にある流体"],["流体の密度","物体の密度","流体と物体の密度の差"],["流体中にある部分の体積","物体全体の体積（いつも）","容器の体積"]],answer:[0,0,0],
     explain:`浮力は「流体」の密度と、物体のうち「流体中にある部分」の体積で決まります。水に浮いている物体なら、水面より下の部分の体積です。${ANIM("anim/fluid.html#buoy","浮力（アルキメデスの原理）")}`},
    {id:"d6",type:"choice",prompt:"浮力が生じる理由として正しいものはどれか。",
     options:["物体の下面のほうが上面より深く、下から押す力のほうが大きいから","物体が水より軽いから","水が物体を引きつけるから"],answer:0,
     explain:`下面の圧力 ${p0} ＋ ${rho}${Q("g")}${Q("h")}₂ が上面の圧力 ${p0} ＋ ${rho}${Q("g")}${Q("h")}₁ より大きく、その差が浮力です。側面の力は左右で打ち消し合います。物体が重くても（沈んでいても）浮力ははたらきます。`}
  ]},
  { title:"C. 空気抵抗", qs:[
    {id:"d7",type:"blanks",text:"空気抵抗は、物体の{0}と逆向きにはたらき、速さが{1}ほど大きい。",
     options:[["速度","加速度","重力"],["大きい","小さい"]],answer:[0,0],
     explain:"空気抵抗は運動を妨げる向きの力です。落下する物体なら上向き、投げ上げた物体の上昇中なら下向きです。"},
    {id:"d8",type:"blanks",text:"終端速度に達した物体では、重力と空気抵抗が{0}、加速度は{1}である。",
     options:[["つりあい","打ち消されずに残り"],["0","g","g より大きい"]],answer:[0,0],
     explain:`${Q("mg")} − ${Q("k")}${vf} ＝ 0 なので加速度 0。物体は一定の速さで落ちていきます（力がはたらいていないのではありません）。${ANIM("anim/drag.html","空気抵抗と落下")}`}
  ]}]
},
{ id:"read", advice:"「どの面が・どの向きに押されるか」「浮力の ρ はだれの密度か」「力がつりあっているか」を図で確かめよう。", tab:"②読解", title:"② 読解ドリル", back:"② 読解ドリル",
  intro:"電卓はほとんど使いません。言葉やグラフから、圧力・浮力・空気抵抗がどうなるかを読み取ります。g ＝ 9.8 m/s²。",
  groups:[
  { title:"A. 圧力を読む", qs:[
    {id:"ra1",type:"choice",prompt:"同じ大きさの力で押すとき、押す面積を半分にすると圧力はどうなるか。",options:["2倍になる","半分になる","変わらない"],answer:0,
     explain:`${Q("p")} ＝ ${Q("F")}/${Q("S")} の分母が半分になるので2倍です。`},
    {id:"ra2",type:"choice",prompt:"水深 10 m の点の圧力（大気圧を含む）は、大気圧のおよそ何倍か。",options:["約2倍","約10倍","約1.1倍"],answer:0,
     explain:`${rho}${Q("g")}${Q("h")} ＝ 1.0×10³ × 9.8 × 10 ≒ 1.0×10⁵ Pa で、ほぼ1気圧分。大気圧と合わせて約2気圧です。水は約 10 m ごとに1気圧ずつ増えます。`},
    {id:"ra3",type:"choice",prompt:"「水中の物体は、水から上から下向きにだけ押されている。」",options:TF,answer:1,
     explain:"誤り。圧力は面に垂直にはたらくので、物体の上面は下向き、下面は上向き、側面は横向きに押されます。"},
    {id:"ra4",type:"choice",prompt:"同じ深さ 2.0 m の点の圧力を、水と水銀（密度 13.6×10³ kg/m³）で比べる。液体による分（ρgh）はどうなるか。",
     options:["水銀のほうが 13.6 倍大きい","水のほうが大きい","深さが同じなので等しい"],answer:0,
     explain:`${rho}${Q("g")}${Q("h")} は密度に比例します。深さが同じでも、密度の大きい液体ほど圧力の増え方が大きくなります。`},
    {id:"ra5",type:"num",prompt:`（発展：パスカルの原理）油圧ジャッキで、小さいピストン（断面積 5.0 cm²）を 40 N の力で押す。大きいピストン（断面積 500 cm²）が受ける力を求めよ。${ANIM("anim/fluid.html#pascal","油圧ジャッキ")}`,answer:4000,tol:10,unit:"N",
     traps:{"0.4":"断面積の比が逆です。大きいピストンのほうが大きな力を受けます。","40":"圧力が同じでも、面積が大きければ力は大きくなります。"},
     explain:"圧力の増加 40 ÷ (5.0×10⁻⁴) ＝ 8.0×10⁴ Pa が、大きいピストンにも伝わる。8.0×10⁴ × (500×10⁻⁴) ＝ 4.0×10³ N（面積の比 100 倍）。ただし大きいピストンを 1 cm 上げるには、小さいピストンを 100 cm 押す必要があり、仕事は得をしません。"}
  ]},
  { title:"B. 浮力を読む", qs:[
    {id:"rb1",type:"choice",prompt:"同じ体積の鉄の球と木片を、どちらも水中に完全に沈めた。浮力が大きいのはどちらか。",options:["等しい","鉄の球","木片"],answer:0,
     explain:"浮力 ρVg は、流体（水）の密度と、押しのけた体積で決まります。物体の密度（鉄か木か）にはよりません。鉄が沈むのは、重力が浮力より大きいからです。"},
    {id:"rb2",type:"choice",prompt:"完全に沈んだ物体を、さらに深いところまで沈めた。浮力はどうなるか。",options:["変わらない","大きくなる","小さくなる"],answer:0,
     explain:`深くなると上面・下面の圧力はどちらも同じだけ増えるので、差（浮力）は変わりません。全部沈むまでは、沈んだ体積が増えるので浮力も増えます。${ANIM("anim/fluid.html#buoy","浮力と深さのグラフ")}`},
    {id:"rb3",type:"choice",prompt:"水に浮かんで静止している木片で、浮力と重力の関係はどうなっているか。",options:["等しい（つりあっている）","浮力のほうが大きい","重力のほうが大きい"],answer:0,
     explain:"静止しているので、木片が受ける力はつりあっています。浮いている物体では「浮力 ＝ 重力」から、水中に沈んでいる部分の体積がわかります。"},
    {id:"rb4",type:"choice",prompt:"ばねばかりにつるした物体を水中に沈めると、ばねばかりの値が小さくなった。その理由は？",
     options:["物体が浮力を受け、ばねばかりが支える力がその分だけ小さくなったから","物体の質量が小さくなったから","重力が小さくなったから"],answer:0,
     explain:"物体のつりあい：ばねばかりの力 ＋ 浮力 ＝ 重力。重力（mg）は変わりません。"},
    {id:"rb5",type:"choice",prompt:`「浮力の式 ${Q("F")} ＝ ${rho}${Q("V")}${Q("g")} の ${rho} は、物体の密度である。」`,options:TF,answer:1,
     explain:`誤り。${rho} は流体（水など）の密度です。物体の密度を使うと、${rho}${Q("V")}${Q("g")} は物体の重さになってしまいます。`}
  ]},
  { title:"C. 空気抵抗を受ける落下のグラフを読む", lead:`空気抵抗（速さに比例）を受けて、静かに落下を始めた物体の ${Q("v")}-${Q("t")} グラフ。鉛直下向きを正とする。${ANIM("anim/drag.html","空気抵抗と落下")}`, figure:VT_DRAG, qs:[
    {id:"rc1",type:"choice",prompt:"落とした瞬間（t ＝ 0）のグラフの傾き（加速度）はいくらか。",options:["g（9.8 m/s²）","0","g より大きい"],answer:0,
     explain:"落とした瞬間は速さ 0 で空気抵抗も 0 なので、自由落下と同じ加速度 g です。グラフは「空気抵抗なし」の直線に接しています。"},
    {id:"rc2",type:"choice",prompt:"時間がたつと、グラフの傾き（加速度）はどうなっていくか。",options:["しだいに小さくなり、0 に近づく","一定のまま","しだいに大きくなる"],answer:0,
     explain:`速くなるほど空気抵抗 ${Q("k")}${Q("v")} が大きくなり、合力 ${Q("mg")} − ${Q("k")}${Q("v")} が小さくなるからです。`},
    {id:"rc3",type:"choice",prompt:"終端速度に達したあと、物体が受ける力について正しいものはどれか。",
     options:["重力と空気抵抗がつりあい、合力が 0","力を何も受けていない","重力だけを受けている"],answer:0,
     explain:"重力も空気抵抗もはたらいていますが、つりあっているので速度が変わりません（慣性の法則）。"},
    {id:"rc4",type:"choice",prompt:`同じ形・大きさ（${Q("k")} が同じ）で質量が2倍の物体を落とすと、終端速度はどうなるか。`,options:["2倍になる","変わらない","½倍になる"],answer:0,
     explain:`${vf} ＝ ${Q("mg")}/${Q("k")} は ${Q("m")} に比例します。大きな雨粒ほど速く落ちてくるのはこのためです（空気抵抗がなければ、質量によらず同じように落ちます）。`},
    {id:"rc5",type:"choice",prompt:"「空気抵抗を考えても、重い物体も軽い物体も同じように落ちる。」",options:TF,answer:1,
     explain:"誤り。同じように落ちるのは空気抵抗がないとき（真空中）です。空気抵抗があると、終端速度が質量によって変わります。"}
  ]}]
},
{ id:"dim", advice:"圧力の Pa ＝ N/m² と、空気抵抗の比例定数 k の単位 kg/s を確かめよう。", tab:"③次元", title:"③ 次元チェック", back:"③ 次元チェック",
  intro:"1 Pa ＝ 1 N/m²、1 N ＝ 1 kg·m/s²。圧力や浮力の式は、基本単位（kg・m・s）に直すと確かめられます。",
  ref:{label:"単位の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", lead:`${Q("F")}〔N〕、${Q("S")}〔m²〕、${rho}〔kg/m³〕、${Q("g")}〔m/s²〕、${Q("h")}〔m〕、${Q("V")}〔m³〕、${Q("m")}〔kg〕とする。`, qs:[
    {id:"da1",type:"choice",prompt:`${Q("F")} ÷ ${Q("S")}`,options:UNITQ,answer:0,explain:"N/m² ＝ Pa（圧力）。",two:true},
    {id:"da2",type:"choice",prompt:`${rho}${Q("g")}${Q("h")}`,options:UNITQ,answer:0,explain:"(kg/m³)(m/s²)(m) ＝ kg/(m·s²) ＝ (kg·m/s²)/m² ＝ N/m² ＝ Pa（圧力）。",two:true},
    {id:"da3",type:"choice",prompt:`${rho}${Q("V")}${Q("g")}`,options:UNITQ,answer:1,explain:"(kg/m³)(m³)(m/s²) ＝ kg·m/s² ＝ N（浮力）。ρV は押しのけた流体の質量です。",two:true},
    {id:"da4",type:"choice",prompt:`空気抵抗 ${Q("k")}${Q("v")} が力〔N〕になるときの ${Q("k")}`,options:UNITQ,answer:3,explain:"N ÷ (m/s) ＝ (kg·m/s²)·(s/m) ＝ kg/s。",two:true},
    {id:"da5",type:"choice",prompt:`${Q("mg")} ÷ ${Q("k")}`,options:UNITQ,answer:2,explain:"N ÷ (kg/s) ＝ (kg·m/s²)·(s/kg) ＝ m/s（終端速度）。",two:true}
  ]},
  { title:"B. 式の次元を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、次元が合わないものをすべて選べ（左辺：p は圧力、F は力、v_f は速度）。",
     options:[`${Q("p")} ＝ ${rho}${Q("g")}${Q("h")}`,`${Q("F")} ＝ ${rho}${Q("g")}${Q("h")}`,`${Q("F")} ＝ ${rho}${Q("V")}${Q("g")}`,`${vf} ＝ ${Q("mg")}/${Q("k")}`,`${vf} ＝ ${Q("k")}/${Q("mg")}`],answer:[1,4],
     explain:`${rho}${Q("g")}${Q("h")} は圧力（Pa）で、力（N）ではありません（面積 ${Q("S")} を掛けると力）。${Q("k")}/${Q("mg")} は s/m で、速度の逆数の単位です。`}
  ]},
  { title:"C. 単位を換算する", lead:"1 cm ＝ 1×10⁻² m なので、1 cm² ＝ 1×10⁻⁴ m²、1 cm³ ＝ 1×10⁻⁶ m³。", qs:[
    {id:"dc1",type:"num",prompt:"500 cm² を m² で表せ。",answer:0.05,tol:0.0001,unit:"m²",
     traps:{"5":"1 cm² は 1×10⁻² m² ではなく 1×10⁻⁴ m² です（1 cm × 1 cm）。","0.5":"1 cm² ＝ 1×10⁻⁴ m² です。"},
     explain:"500 × 10⁻⁴ ＝ 5.0×10⁻² ＝ 0.050 m²。"},
    {id:"dc2",type:"choice",prompt:"1 気圧（1.013×10⁵ Pa）の大気が、面積 1.0 m² の面を押す力はおよそいくらか。",options:["1.0×10⁵ N","1.0×10³ N","1.0 N"],answer:0,
     explain:`${Q("F")} ＝ ${Q("p")}${Q("S")} ＝ 1.013×10⁵ × 1.0 ≒ 1.0×10⁵ N（約 10 トンの物体の重さ）。ふだん気にならないのは、面の両側から同じように押されているからです。`}
  ]}]
},
{ id:"step", advice:"物体が受ける力（重力・浮力・糸やばねばかりの力・空気抵抗）をすべて図にかいてから、つりあいの式や運動方程式を立てよう。", tab:"④手順", title:"④ 手順固定の演習", back:"④ 手順固定の演習",
  intro:"7ステップで解きます。①正の向き → ②既知・未知（受ける力をすべてかく）→ ③式を選ぶ → ④文字式 → ⑤次元 → ⑥数値 → ⑦妥当性。g ＝ 9.8 m/s²、水の密度 1.0×10³ kg/m³。",
  ref:{label:"式を見る", html:FORMULAS},
  groups:[
  { title:"問題1（水圧・すべてのステップ）", lead:ANIM("anim/fluid.html#pressure","水圧（深さを 5.0 m にして確かめる）"),
    quote:"大気圧を 1.0×10⁵ Pa とする。水面から深さ 5.0 m の点について、(1) 水による圧力 ρgh、(2) その点の圧力、(3) その深さに水平に置いた面積 0.020 m² の板の上面が水から受ける力を求めよ。", qs:[
    {id:"s11",type:"choice",prompt:"ステップ3　その点の圧力を表す式とその理由。",
     options:[`${Q("p")} ＝ ${p0} ＋ ${rho}${Q("g")}${Q("h")}：上に大気と深さ ${Q("h")} の水の柱がのっているから`,`${Q("p")} ＝ ${rho}${Q("g")}${Q("h")}：水の中だけを考えればよいから`,`${Q("p")} ＝ ${p0} − ${rho}${Q("g")}${Q("h")}：深いほど圧力が小さくなるから`],answer:0,
     explain:"深さ h の点の上には、空気（大気圧）と水の柱があり、その両方の重さで押されています。"},
    {id:"s12",type:"choice",prompt:`ステップ5　${rho}${Q("g")}${Q("h")} の単位を確かめる。`,options:["kg/(m·s²) ＝ N/m² ＝ Pa","kg·m/s² ＝ N","kg/m³"],answer:0,
     explain:"(kg/m³)(m/s²)(m) ＝ kg/(m·s²)。N ＝ kg·m/s² なので、N/m² ＝ Pa になります。"},
    {id:"s13",type:"num",prompt:"(1) 水による圧力 ρgh を、10⁴ Pa を単位として答えよ（例：3.0×10⁴ Pa なら 3.0）。",answer:4.9,tol:0.03,unit:"×10⁴ Pa",
     traps:{"5":"g ＝ 9.8 m/s² を使っていますか。","49":"単位を 10⁴ Pa にそろえます。4.9×10⁴ Pa です。"},
     explain:"1.0×10³ × 9.8 × 5.0 ＝ 4.9×10⁴ Pa。"},
    {id:"s14",type:"num",prompt:"(2) その点の圧力を、10⁵ Pa を単位として答えよ（有効数字2桁）。",answer:1.5,tol:0.02,unit:"×10⁵ Pa",
     traps:{"0.49":"大気圧 1.0×10⁵ Pa を足し忘れていませんか。","5.9":"単位をそろえて足します。4.9×10⁴ Pa ＝ 0.49×10⁵ Pa です。"},
     explain:"1.0×10⁵ ＋ 0.49×10⁵ ＝ 1.49×10⁵ ≒ 1.5×10⁵ Pa。"},
    {id:"s15",type:"num",prompt:"(3) 板の上面が水から受ける力を、10³ N を単位として答えよ（有効数字2桁）。",answer:3,tol:0.05,unit:"×10³ N",
     traps:{"0.98":"大気圧も含めた圧力 1.49×10⁵ Pa を使います（ρgh だけでは水の柱の分だけ）。","7.5":"F ＝ pS です（割るのではなく掛けます）。"},
     explain:`${Q("F")} ＝ ${Q("p")}${Q("S")} ＝ 1.49×10⁵ × 0.020 ≒ 3.0×10³ N。板の下面も同じ深さなら、ほぼ同じ大きさの力で上向きに押されます。`},
    {id:"s16",type:"choice",prompt:"ステップ7　(2) の答えは妥当か。",options:["水深 10 m で約1気圧増えるので、5 m で約 1.5 気圧は妥当","水中なので大気圧より小さくなるはず","深さに関係なく 1 気圧のはず"],answer:0,
     explain:"「約 10 m で1気圧分」という目安と比べると、答えの大きさを確かめられます。"}
  ]},
  { title:"問題2（浮力とばねばかり・ステップ1〜3を誘導）", lead:ANIM("anim/fluid.html#buoy","浮力とばねばかり"),
    quote:"体積 2.0×10⁻⁴ m³、質量 0.54 kg のアルミニウムの物体をばねばかりにつるし、水中に完全に沈めて静止させた。(1) 物体が受ける浮力の大きさ、(2) ばねばかりの値を求めよ。", qs:[
    {id:"s21",type:"multi",prompt:"ステップ2　物体が受ける力をすべて選べ。",options:["重力（下向き）","浮力（上向き）","ばねばかりが引く力（上向き）","水圧による下向きの力（浮力とは別に）","物体が水を押す力"],answer:[0,1,2],
     explain:"水から受ける力は、上面・下面・側面の圧力による力をまとめて「浮力」として1つにかきます。「物体が水を押す力」は水が受ける力なので、物体にはかきません。"},
    {id:"s22",type:"choice",prompt:"ステップ3　ばねばかりの力を T、浮力を F、重力を W として、つりあいの式はどれか。",options:["T ＋ F ＝ W","T ＝ W ＋ F","T ＋ W ＝ F"],answer:0,
     explain:"上向きの力（T と F）の和 ＝ 下向きの力（W）。"},
    {id:"s23",type:"num",prompt:"(1) 浮力の大きさ（有効数字2桁）",answer:1.96,tol:0.05,unit:"N",
     traps:{"5.29":"それは重力（mg）です。浮力は ρVg で、ρ は水の密度です。","5.3":"それは重力（mg）です。","0.2":"g を掛け忘れていませんか。ρV は押しのけた水の質量です。","5.292":"それは重力です。"},
     explain:"F ＝ ρVg ＝ 1.0×10³ × 2.0×10⁻⁴ × 9.8 ≒ 2.0 N。押しのけた水 0.20 kg の重さです。"},
    {id:"s24",type:"num",prompt:"(2) ばねばかりの値（有効数字2桁）",answer:3.3,tol:0.06,unit:"N",
     traps:{"5.3":"浮力を考えていません。水中では浮力の分だけばねばかりの値が小さくなります。","7.3":"浮力は上向きなので、重力から引きます。","7.25":"浮力は上向きなので、重力から引きます。"},
     explain:"W ＝ 0.54 × 9.8 ≒ 5.29 N。T ＝ W − F ＝ 5.29 − 1.96 ≒ 3.3 N。"}
  ]},
  { title:"問題3（空気抵抗と終端速度・答えだけ入力）", lead:`紙に7ステップを書いて解き、答えを入力せよ。鉛直下向きを正とする。解き終えたら確かめよう：${ANIM("anim/drag.html","空気抵抗と落下（質量と比例定数を問題の値にする）")}`,
    quote:"質量 0.10 kg の物体を静かに落とした。物体は速さ v に比例する空気抵抗 kv（k ＝ 0.49 kg/s）を受ける。", qs:[
    {id:"s31",type:"choice",prompt:"ステップ3　物体の運動方程式はどれか（a は加速度）。",options:["ma ＝ mg − kv","ma ＝ mg ＋ kv","ma ＝ kv − mg"],answer:0,
     explain:"下向きを正とすると、重力 mg は ＋、空気抵抗は運動（下向き）と逆向きなので −kv です。"},
    {id:"s32",type:"num",prompt:"(1) 落とした直後の加速度の大きさ",answer:9.8,tol:0.05,unit:"m/s²",
     traps:{"0":"落とした直後は速さ 0 なので、空気抵抗も 0 です。"},
     explain:"v ＝ 0 なので空気抵抗 0、a ＝ g ＝ 9.8 m/s²。"},
    {id:"s33",type:"num",prompt:"(2) 速さが 1.0 m/s のときの加速度の大きさ",answer:4.9,tol:0.05,unit:"m/s²",
     traps:{"9.31":"空気抵抗 kv（力）を質量で割っていません。a ＝ (mg − kv)/m です。","14.7":"空気抵抗は運動と逆向きなので引きます。"},
     explain:"a ＝ (0.98 − 0.49 × 1.0)/0.10 ＝ 4.9 m/s²。"},
    {id:"s34",type:"num",prompt:"(3) 終端速度の大きさ",answer:2,tol:0.02,unit:"m/s",
     traps:{"0.5":"k/(mg) になっていませんか。v_f ＝ mg/k です。","0.2":"mg を計算するとき g を掛けていますか。"},
     explain:"a ＝ 0 とおいて 0 ＝ mg − kv_f、v_f ＝ mg/k ＝ 0.98 ÷ 0.49 ＝ 2.0 m/s。"},
    {id:"s35",type:"checklist",prompt:"解き終えたら、自分の答案を点検しよう（採点には入りません）。",
     items:["物体が受ける力をすべて図にかいた（浮力・空気抵抗を忘れていない）","浮力の ρ に流体の密度を使った","圧力に面積を掛けて力にした（または割って圧力にした）","cm² を m² に直した","空気抵抗の向きを速度と逆向きにした","終端速度は a ＝ 0 とおいて求めた"]}
  ]}]
},
{ id:"sum", advice:"圧力は「面積あたり」、浮力は「押しのけた流体の重さ」、終端速度は「a ＝ 0」。", tab:"まとめ", title:"単元のまとめ", back:"まとめ",
  intro:"計算はしません。どの式・考え方を使うかを答えます。",
  ref:{label:"式を見る", html:FORMULAS},
  groups:[{ title:"式・考え方を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"雪の上で、スキー板をはくと沈みにくい理由を説明したい。",
     options:["p ＝ F/S（面積が大きいと圧力が小さい）","p ＝ p₀ ＋ ρgh","F ＝ ρVg"],answer:0,explain:"同じ体重（力）でも、面積が大きいほど雪を押す圧力が小さくなります。"},
    {id:"m2",type:"choice",prompt:"潜水すると耳が痛くなる理由を説明したい。",
     options:["p ＝ p₀ ＋ ρgh（深いほど水圧が大きい）","F ＝ ρVg","ma ＝ mg − kv"],answer:0,explain:"深さに比例して水圧が大きくなるためです。"},
    {id:"m3",type:"choice",prompt:"鉄でできた船が水に浮く理由を説明したい。",
     options:["F ＝ ρVg（船体が大量の水を押しのけ、浮力が重力とつりあう）","p ＝ F/S","鉄の密度が水より小さいから"],answer:0,
     explain:"船は中が空洞なので、水面下の体積 V が大きく、押しのけた水の重さ（浮力）が船の重さとつりあいます。"},
    {id:"m4",type:"choice",prompt:"雨粒が地面に届くときの速さを考えたい。",
     options:["ma ＝ mg − kv で a ＝ 0 とおく（終端速度）","自由落下の式 v² ＝ 2gh で計算する","F ＝ ρVg"],answer:0,
     explain:"雲の高さから自由落下すると速さは 100 m/s をこえますが、実際は空気抵抗で終端速度（数 m/s）になっています。"},
    {id:"m5",type:"self",prompt:"次の文を自分の言葉で完成させよ。「流体から受ける力の問題を解くとき、私が最初にすることは（　　）である。」",scored:false,
     model:"例：物体が受ける力をすべて図にかき、浮力・空気抵抗の向きを確かめること。圧力なら面積の単位を m² に直すこと。"}
  ]}]
}
];

registerUnit({
  id: "fluid-drag",                 // js/index.js の id と同じにする
  title: "圧力・浮力・空気抵抗",
  sections: SECTIONS
});
})();
