/*
 * 単元：合成速度・相対速度・放物運動
 * このファイルは js/index.js の file に "units/plane-motion.js" と書くと読み込まれます。
 * 書き方は units/TEMPLATE.js を参照してください。
 * 平面上の相対速度、水平投射・斜方投射は「発展」として扱う。
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
const v0 = `${Q("v")}₀`, vAB = `${Q("v")}<sub>AB</sub>`, vA = `${Q("v")}<sub>A</sub>`, vB = `${Q("v")}<sub>B</sub>`;
const vx = `${Q("v")}<sub>x</sub>`, vy = `${Q("v")}<sub>y</sub>`;
const ADV = `<span style='display:inline-block;font-size:12px;font-weight:700;color:var(--blue);border:1px solid var(--blue);border-radius:4px;padding:0 5px;margin-left:4px;vertical-align:1px'>発展</span>`;
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;
const GLOS = (id, groups) => groups.map((g, i) => `<details name='glos-${id}' ${i ? "" : "open"} style='margin:6px 0;border:1px solid var(--line);border-radius:6px;padding:2px 10px'>
<summary style='cursor:pointer;font-weight:700;padding:6px 0'>${g.title}<span style='font-weight:400;color:var(--muted);font-size:13px'>（${g.rows.length}語）</span></summary>
<div class="tbl"><table><colgroup><col style="width:7.2em"><col></colgroup>
<tr><th>用語</th><th>定義（記号・式・単位）</th></tr>
${g.rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}${r[2] ? `<br><span style='color:var(--blue);font-weight:700'>${r[2]}</span>` : ""}</td></tr>`).join("\n")}
</table></div></details>`).join("\n");

const DEF_TABLE = `<p style='margin:4px 0;font-size:14px;color:var(--muted)'>小単元をタップすると開きます。</p>` + GLOS("plane", [
{ title:"1 合成速度と相対速度", rows:[
  ["合成速度","動いているもの（電車・流れる水など）の上を物体が動くとき、地面から見た物体の速度。運ぶものの速度と、それに対する物体の速度の和",`${Q("v")} ＝ ${Q("V")} ＋ ${Q("u")}（一直線上では符号つきの和）`],
  ["相対速度","動いている観測者 A から見た物体 B の速度。「A に対する B の相対速度」ともいう",`${vAB} ＝ ${vB} − ${vA}（見ている人の速度を引く）`],
  ["「〜に対する速度」","「〜」といっしょに動く人から見た速度。「水に対する船の速度」は、水といっしょに流れる人から見た船の速度（静水での速度）"],
  ["速度の合成・分解" + ADV,"平面上では、速度を矢印（ベクトル）として平行四辺形の規則で足し合わせる（合成）。1つの速度を2つの向きの速度に分けることもできる（分解）","大きさは三平方の定理で求める"]
]},
{ title:"2 放物運動" + ADV, rows:[
  ["放物運動","投げ出された物体が、重力だけを受けて行う運動。軌道は放物線になる",`加速度は鉛直下向きで大きさ ${Q("g")}、運動の途中で変わらない`],
  ["運動の独立性","水平方向の運動と鉛直方向の運動は互いに影響しないので、別々に考えられる","水平：等速直線運動　鉛直：落体の運動"],
  ["水平投射","水平方向に初速度を与えて投げ出した物体の運動",`水平 ${Q("x")} ＝ ${v0}${Q("t")}、鉛直（下向き正）${Q("y")} ＝ ½${Q("g")}${Q("t")}²`],
  ["斜方投射","水平と角 <i class='qv'>θ</i> をなす斜め上向きに投げ出した物体の運動",`${vx} ＝ ${v0} cos ${Q("θ")}、${vy} ＝ ${v0} sin ${Q("θ")} − ${Q("g")}${Q("t")}（上向き正）`],
  ["最高点","斜方投射で、速度の鉛直成分が 0 になる点。速度の水平成分は残っている",`${vy} ＝ 0、速さは ${v0} cos ${Q("θ")}`]
]}]);

const FORMULAS = `<p class="formula">相対速度：${vAB} ＝ ${vB} − ${vA}　　合成速度：${Q("v")} ＝ ${Q("V")} ＋ ${Q("u")}</p>
<p class="formula">水平投射（下向き正）：${Q("x")} ＝ ${v0}${Q("t")}、${Q("y")} ＝ ½${Q("g")}${Q("t")}²、${vy} ＝ ${Q("g")}${Q("t")}</p>
<p class="formula">斜方投射（上向き正）：${Q("x")} ＝ ${v0} cos ${Q("θ")}・${Q("t")}、${Q("y")} ＝ ${v0} sin ${Q("θ")}・${Q("t")} − ½${Q("g")}${Q("t")}²、${vy} ＝ ${v0} sin ${Q("θ")} − ${Q("g")}${Q("t")}</p>`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th><th>次元</th></tr>
<tr><td>位置 ${Q("x")}, ${Q("y")}・高さ ${Q("h")}</td><td>m</td><td>〔L〕</td></tr>
<tr><td>時間 ${Q("t")}</td><td>s</td><td>〔T〕</td></tr>
<tr><td>速度 ${Q("v")}・初速度 ${v0}</td><td>m/s</td><td>〔L〕/〔T〕</td></tr>
<tr><td>重力加速度 ${Q("g")}</td><td>m/s²</td><td>〔L〕/〔T〕²</td></tr>
<tr><td>sin ${Q("θ")}・cos ${Q("θ")}</td><td>なし</td><td>次元なし（比）</td></tr></table></div>`;

/* 雨と走る人：人から見た雨の速度の図 */
const RAIN = `<svg class="graph" viewBox="0 0 320 200" role="img" aria-label="雨の速度（下向き 4.0 m/s）と人の速度（右向き 3.0 m/s）の矢印の図">
<defs><marker id="pmArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
<text x="10" y="18" font-size="12" fill="currentColor">鉛直に降る雨の中を、人が水平に走る</text>
<line x1="250" y1="32" x2="250" y2="150" stroke="var(--blue)" stroke-width="3" marker-end="url(#pmArr)"/>
<text x="240" y="95" font-size="13" fill="var(--blue)" text-anchor="end">雨の速度 4.0 m/s（下向き）</text>
<line x1="40" y1="168" x2="130" y2="168" stroke="currentColor" stroke-width="3" marker-end="url(#pmArr)"/>
<text x="40" y="192" font-size="13" fill="currentColor">人の速度 3.0 m/s（右向き）</text>
</svg>`;

const TF = ["正しい", "誤り"];
const UNITQ = ["m/s", "m", "s", "単位なし"];

const SECTIONS = [
{ id:"def", advice:"「〜に対する」「〜から見た」が、だれの立場の速度かを定義カードで確かめよう。", tab:"①定義", title:"① 定義カード", back:"① 定義カード",
  intro:`「だれから見た速度か」と、「水平・鉛直に分けて考える」ことを言葉で言えるようにします。<br>アニメーションで確かめよう：<br>${ANIM("anim/relative.html#line-sum","合成速度（電車の中を歩く人）")}${ANIM("anim/relative.html#line-rel","相対速度（2台の車）")}${ANIM("anim/relative.html#plane-sum","川を渡る船（発展）")}${ANIM("anim/relative.html#rain","雨と走る人（発展）")}${ANIM("anim/projectile.html#h","水平投射（発展）")}${ANIM("anim/projectile.html#o","斜方投射（発展）")}${ANIM("anim/monkey.html#basic","モンキーハンティング（発展）")}`,
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[
  { title:"A. 合成速度と相対速度", qs:[
    {id:"d1",type:"blanks",text:`観測者 A から見た物体 B の速度（A に対する B の相対速度）は、${vAB} ＝ {0} で求める。`,
     options:[["<i class='qv'>v</i><sub>B</sub> − <i class='qv'>v</i><sub>A</sub>","<i class='qv'>v</i><sub>A</sub> − <i class='qv'>v</i><sub>B</sub>","<i class='qv'>v</i><sub>A</sub> ＋ <i class='qv'>v</i><sub>B</sub>"]],answer:[0],
     explain:`「見られる物体の速度 − 見ている人の速度」です。見ている人 A の速度を引くことで、A が止まっているように見たときの B の速度になります。`},
    {id:"d2",type:"blanks",text:"流れる川で「水に対する船の速度」とは、{0}から見た船の速度である。",
     options:[["川岸に立っている人","水といっしょに流れていく人","船に乗っている人"]],answer:[1],
     explain:"「〜に対する速度」は「〜といっしょに動く人から見た速度」です。水に対する船の速度は、流れのない水（静水）での船の速度と同じです。"},
    {id:"d3",type:"choice",prompt:"東向きに 15 m/s で走る電車の中を、人が進行方向（東向き）に 1.0 m/s で歩いている。地面から見た人の速度はどれか。",
     options:["東向きに 16 m/s","東向きに 14 m/s","東向きに 1.0 m/s"],answer:0,
     explain:`合成速度 ${Q("v")} ＝ ${Q("V")} ＋ ${Q("u")} ＝ 15 ＋ 1.0 ＝ 16 m/s（東向き）。進行方向と逆向きに歩けば 15 − 1.0 ＝ 14 m/s です。${ANIM("anim/relative.html#line-sum","電車の中を歩く人")}`}
  ]},
  { title:"B. 放物運動（発展）", lead:"空気抵抗は無視する。", qs:[
    {id:"d4",type:"blanks",text:"投げ出された物体の加速度は、向きが{0}、大きさが{1}で、運動の途中で{2}。",
     options:[["鉛直下向き","速度の向き","水平方向"],["g","0","速さに比例する"],["変わらない","変わる"]],answer:[0,0,0],
     explain:`物体が受ける力は重力だけなので、加速度はいつも鉛直下向きに ${Q("g")}（9.8 m/s²）です。最高点でも変わりません。`},
    {id:"d5",type:"blanks",text:"水平投射では、水平方向は{0}、鉛直方向は{1}と同じ運動をする。",
     options:[["等速直線運動","等加速度直線運動","静止"],["自由落下","鉛直投げ上げ","等速直線運動"]],answer:[0,0],
     explain:"水平方向には力がはたらかないので速度が変わらず（等速）、鉛直方向は初速度 0 で重力を受けるので自由落下と同じです。"},
    {id:"d6",type:"choice",prompt:`水平と角 ${Q("θ")} をなす向きに、速さ ${v0} で投げ出した。初速度の水平成分と鉛直成分の組み合わせはどれか。`,
     options:[`水平 ${v0} cos ${Q("θ")}、鉛直 ${v0} sin ${Q("θ")}`,`水平 ${v0} sin ${Q("θ")}、鉛直 ${v0} cos ${Q("θ")}`,`水平 ${v0}、鉛直 ${v0}`],answer:0,
     explain:`角 ${Q("θ")} を水平からはかるとき、${Q("θ")} に「くっついている」水平方向が cos、向かい側の鉛直方向が sin です。角を鉛直からはかると入れかわるので、図で確かめよう。`},
    {id:"d7",type:"choice",prompt:"斜方投射の最高点での物体の速度について、正しいものはどれか。",
     options:[`速度の鉛直成分だけが 0 で、水平成分 ${v0} cos ${Q("θ")} は残っている`,"速度は 0 になっている","速度の水平成分だけが 0 になっている"],answer:0,
     explain:`最高点では ${vy} ＝ 0。水平方向は等速なので ${vx} ＝ ${v0} cos ${Q("θ")} のままで、物体は止まっていません。${ANIM("anim/projectile.html#o","斜方投射の最高点")}`}
  ]}]
},
{ id:"read", advice:"「だれから見たか」を先に決め、その人の速度を引くこと。放物運動は水平と鉛直に分けてから読もう。", tab:"②読解", title:"② 読解ドリル", back:"② 読解ドリル",
  intro:"電卓は使いません。「だれから見た速度か」「どちらの方向の運動か」を言葉から読み取る練習です。",
  groups:[
  { title:"A. 「〜から見た」を読む", lead:"一直線上の運動とし、東向きを正とする。", qs:[
    {id:"ra1",type:"num",prompt:"自動車 A が東向きに 20 m/s、自動車 B が東向きに 25 m/s で走っている。A から見た B の速度を求めよ。",answer:5,tol:0.01,unit:"m/s",
     traps:{"-5":"引く順が逆です。A から見た B は <i class='qv'>v</i><sub>B</sub> − <i class='qv'>v</i><sub>A</sub> です。","45":"同じ向きに走っているので、足すのではなく引きます。"},
     explain:`${vAB} ＝ ${vB} − ${vA} ＝ 25 − 20 ＝ ＋5 m/s。A からは、B が東向きに 5 m/s でゆっくり離れていくように見えます。${ANIM("anim/relative.html#line-rel","2台の車の相対速度")}`},
    {id:"ra2",type:"num",prompt:"電車 A が東向きに 20 m/s、電車 B が西向きに 15 m/s で走っている。A から見た B の速度を求めよ（符号つき）。",answer:-35,tol:0.01,unit:"m/s",
     traps:{"35":"大きさは合っています。B は A から見てどちら向きに動いて見えますか。","-5":"西向きの B の速度は −15 m/s です。<i class='qv'>v</i><sub>B</sub> − <i class='qv'>v</i><sub>A</sub> ＝ (−15) − (＋20)。","5":"西向きの B の速度は −15 m/s です。"},
     explain:`${vB} ＝ −15 m/s、${vA} ＝ ＋20 m/s。${vAB} ＝ −15 − 20 ＝ −35 m/s（西向きに 35 m/s）。すれちがう2台は、互いに速く近づいて見えます。`},
    {id:"ra3",type:"choice",prompt:"「相対速度は、速いほうの速度から遅いほうの速度を引けば必ず求まる。」",options:TF,answer:1,
     explain:"誤り。引くのは「見ている人の速度」です。遅い車から速い車を見ても、速い車から遅い車を見ても大きさは同じですが、向き（符号）が逆になります。"},
    {id:"ra4",type:"choice",prompt:"静水に対して 3.0 m/s で進む船が、川の流れ（2.0 m/s）と同じ向きに下っている。岸から見た船の速さはどれか。",
     options:["5.0 m/s","1.0 m/s","3.0 m/s"],answer:0,
     explain:"静水に対して 3.0 m/s ＝ 水に対する速度。岸から見ると流れの速度を足して 3.0 ＋ 2.0 ＝ 5.0 m/s。上るときは 3.0 − 2.0 ＝ 1.0 m/s です。"}
  ]},
  { title:"B. 速度を矢印で読む（発展）", lead:`雨が鉛直に速さ 4.0 m/s で降っている。人が水平に 3.0 m/s で走る。${ANIM("anim/relative.html#rain","雨と走る人")}`, figure:RAIN, qs:[
    {id:"rb1",type:"choice",prompt:"人から見た雨の速度（人に対する雨の相対速度）を求めるには、どうするか。",
     options:["雨の速度の矢印に、人の速度と逆向きの矢印（−人の速度）をつなぐ","雨の速度の矢印に、人の速度の矢印をそのままつなぐ","雨の速度だけを考えればよい"],answer:0,
     explain:`${Q("v")}<sub>人雨</sub> ＝ ${Q("v")}<sub>雨</sub> − ${Q("v")}<sub>人</sub> ＝ ${Q("v")}<sub>雨</sub> ＋ (−${Q("v")}<sub>人</sub>)。平面でも一直線上と同じく「見ている人の速度を引く」です。`},
    {id:"rb2",type:"num",prompt:"人から見た雨の速さを求めよ。",answer:5,tol:0.05,unit:"m/s",
     traps:{"7":"速さ 4.0 と 3.0 をそのまま足していませんか。向きが垂直なので、三平方の定理を使います。","1":"速さを引くのではなく、矢印をつないで大きさを求めます。"},
     explain:"下向き 4.0 m/s と左向き（後ろ向き）3.0 m/s の矢印をつなぐと、大きさは √(4.0² ＋ 3.0²) ＝ 5.0 m/s。"},
    {id:"rb3",type:"choice",prompt:"走っている人には、雨はどの向きから降ってくるように見えるか。",
     options:["前方の斜め上から","後方の斜め上から","真上から"],answer:0,
     explain:"人から見た雨の速度は「下向き＋後ろ向き」なので、雨は前の上から後ろの下へ向かって降ってくるように見えます。走るときは傘を前に傾けます。"}
  ]},
  { title:"C. 水平投射を分けて読む（発展）", lead:"空気抵抗は無視する。", qs:[
    {id:"rc1",type:"blanks",prompt:"高さ 19.6 m のがけの上から、小球を水平に 5.0 m/s で投げ出した。水平方向は投げた向き、鉛直方向は下向きを正とする。",
     text:"水平方向：初速度 {0}、加速度 {1}<br>鉛直方向：初速度 {2}、加速度 {3}",
     options:[["5.0 m/s","0","9.8 m/s²"],["5.0 m/s","0","9.8 m/s²"],["5.0 m/s","0","9.8 m/s²"],["5.0 m/s","0","9.8 m/s²"]],answer:[0,1,1,2],
     explain:"水平に投げたので、鉛直方向の初速度は 0。水平方向には力がはたらかないので加速度 0、鉛直方向は重力加速度 9.8 m/s² です。"},
    {id:"rc2",type:"choice",prompt:"同じ高さから同時に、小球 P は静かに落とし、小球 Q は水平に投げ出した。先に地面に着くのはどちらか。",
     options:["同時に着く","P が先に着く","Q が先に着く"],answer:0,
     explain:"鉛直方向の運動はどちらも初速度 0 の自由落下で同じです。水平方向の運動は鉛直方向の運動に影響しません（運動の独立性）。"},
    {id:"rc3",type:"blanks",text:"水平投射で、投げ出す速さを2倍にすると、着地までの時間は{0}、水平に進む距離は{1}。",
     options:[["変わらない","2倍になる","½倍になる"],["変わらない","2倍になる","4倍になる"]],answer:[0,1],
     explain:"着地までの時間は高さだけで決まります（½<i class='qv'>gt</i>² ＝ <i class='qv'>h</i>）。水平距離 ＝ 水平の速さ × 時間 なので2倍です。"}
  ]},
  { title:"D. 斜方投射を読む（発展）", lead:`空気抵抗は無視し、投げた点と同じ高さに落ちるとする。${ANIM("anim/projectile.html#o","斜方投射ラボ")}`, qs:[
    {id:"rd1",type:"multi",prompt:"投げてから落ちるまで、ずっと一定である量をすべて選べ。",
     options:["速度の水平成分","速度の鉛直成分","加速度","速さ","運動の向き"],answer:[0,2],
     explain:"水平成分は等速で一定、加速度は鉛直下向き g で一定。鉛直成分は減っていき（最高点で 0、そのあと負）、速さや向きも変わります。"},
    {id:"rd2",type:"choice",prompt:"同じ速さで、水平と 30° の向きと 60° の向きに投げた。投げた点と同じ高さに落ちるまでの水平距離を比べるとどうなるか。",
     options:["等しい","30° のほうが遠い","60° のほうが遠い"],answer:0,
     explain:`水平距離は ${v0}² sin 2${Q("θ")} / ${Q("g")} で、sin 60° ＝ sin 120° なので等しくなります。60° は高く上がって時間が長く、30° は水平の速さが大きいので、つり合います。最も遠くまで届くのは 45° です。`},
    {id:"rd3",type:"choice",prompt:"「最高点では速度が 0 なので、物体は一瞬止まっている。」",options:TF,answer:1,
     explain:`誤り。0 になるのは鉛直成分 ${vy} だけです。水平成分 ${v0} cos ${Q("θ")} は残っているので、物体は水平に動いています。`}
  ]}]
},
{ id:"dim", advice:"sin・cos には単位がないこと、√ の中の単位も確かめることを習慣にしよう。", tab:"③次元", title:"③ 次元チェック", back:"③ 次元チェック",
  intro:`sin ${Q("θ")}・cos ${Q("θ")} は長さの比なので単位（次元）がありません。放物運動の式は分数や √ を含むので、次元チェックが役立ちます。`,
  ref:{label:"次元の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", lead:`${v0}〔m/s〕、${Q("g")}〔m/s²〕、${Q("h")}〔m〕、${Q("t")}〔s〕とする。`, qs:[
    {id:"da1",type:"choice",prompt:`${v0} cos ${Q("θ")}`,options:UNITQ,answer:0,explain:`cos ${Q("θ")} には単位がないので m/s（速度の水平成分）。`,two:true},
    {id:"da2",type:"choice",prompt:`2${v0} sin ${Q("θ")} ÷ ${Q("g")}`,options:UNITQ,answer:2,explain:"(m/s) ÷ (m/s²) ＝ s。斜方投射で同じ高さに戻るまでの時間です。",two:true},
    {id:"da3",type:"choice",prompt:`${v0}² sin 2${Q("θ")} ÷ ${Q("g")}`,options:UNITQ,answer:1,explain:"(m/s)² ÷ (m/s²) ＝ m。水平到達距離です。",two:true},
    {id:"da4",type:"choice",prompt:`√(2${Q("h")} ÷ ${Q("g")})`,options:UNITQ,answer:2,explain:"√(m ÷ m/s²) ＝ √(s²) ＝ s。水平投射で落ちるまでの時間です。",two:true},
    {id:"da5",type:"choice",prompt:`${v0} × √(2${Q("h")} ÷ ${Q("g")})`,options:UNITQ,answer:1,explain:"(m/s) × s ＝ m。水平投射で水平に進む距離です。",two:true}
  ]},
  { title:"B. 式の次元を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、次元が合わないものをすべて選べ。",
     options:[`${Q("y")} ＝ ${v0}${Q("t")} − ½${Q("g")}${Q("t")}`,`${Q("x")} ＝ ${v0} cos ${Q("θ")}・${Q("t")}`,`${Q("H")} ＝ ${v0}² sin² ${Q("θ")} ÷ 2${Q("g")}`,`${Q("t")} ＝ √(2${Q("h")}${Q("g")})`,`${vAB} ＝ ${vB} − ${vA}`],answer:[0,3],
     explain:`½${Q("g")}${Q("t")} は m/s で長さではありません（正しくは ½${Q("g")}${Q("t")}²）。√(2${Q("h")}${Q("g")}) は √(m·m/s²) ＝ m/s で時間ではありません（正しくは √(2${Q("h")}/${Q("g")})）。`}
  ]},
  { title:"C. 次元チェックの限界", qs:[
    {id:"dc1",type:"choice",prompt:`水平と 30° の向きに投げたのに、水平成分を ${v0} sin 30° と書いた。この誤りは次元チェックで見つかるか。`,
     options:["見つからない（sin も cos も単位がない）","見つかる（sin と cos は単位が違う）"],answer:0,
     explain:"sin と cos の取り違えは、次元では見つかりません。図に角をかき込み、角に「くっついている」辺が cos と確かめます。<i class='qv'>θ</i> ＝ 0°（真横に投げる）なら水平成分 ＝ <i class='qv'>v</i>₀ になるか、という極端な場合で確かめるのも有効です。"},
    {id:"dc2",type:"choice",prompt:`相対速度を ${vA} − ${vB} と書いてしまった。この誤りは次元チェックで見つかるか。`,
     options:["見つからない（符号の誤り）","見つかる"],answer:0,
     explain:"符号（引く順）の誤りは次元では見つかりません。「見ている人が止まっていたら（<i class='qv'>v</i><sub>A</sub> ＝ 0）、B の速度そのものになるか」で確かめよう。"}
  ]}]
},
{ id:"step", advice:"放物運動では、時間を鉛直方向の運動から先に求めることが多い。軸の向きを最初に書こう。", tab:"④手順", title:"④ 手順固定の演習", back:"④ 手順固定の演習",
  intro:`7ステップで解きます。①正の向き → ②既知・未知 → ③式を選ぶ → ④文字式 → ⑤次元 → ⑥数値 → ⑦妥当性。放物運動では、ステップ1で水平・鉛直の2つの軸を決めます。${Q("g")} ＝ 9.8 m/s²、空気抵抗は無視する。`,
  ref:{label:"式を見る", html:FORMULAS},
  groups:[
  { title:"問題1（相対速度・すべてのステップ）", lead:ANIM("anim/relative.html#line-rel","2台の車（逆向き）で確かめる"),
    quote:"東向きに 15 m/s で走る自動車 A と、西向きに 20 m/s で走る自動車 B がある。(1) A から見た B の速度、(2) B から見た A の速度を求めよ。", qs:[
    {id:"s11",type:"choice",prompt:"ステップ1　正の向きを決める（ここでは東向きを正とする）。このとき B の速度はどう表されるか。",
     options:["−20 m/s","＋20 m/s","−35 m/s"],answer:0,
     explain:"西向きは負なので、B の速度は −20 m/s です。速さ（大きさ）と速度（符号つき）を区別します。"},
    {id:"s12",type:"choice",prompt:"ステップ3　(1) で使う式。",options:[`${vAB} ＝ ${vB} − ${vA}`,`${vAB} ＝ ${vA} − ${vB}`,`${vAB} ＝ ${vA} ＋ ${vB}`],answer:0,
     explain:"A から見るので、A の速度を引きます。"},
    {id:"s13",type:"num",prompt:"ステップ6　(1) A から見た B の速度（符号つき）",answer:-35,tol:0.01,unit:"m/s",
     traps:{"35":"大きさは合っています。B は A から見て東・西どちら向きに動いて見えますか。","-5":"B の速度は −20 m/s です。(−20) − (＋15) を計算します。","5":"B の速度は −20 m/s です。"},
     explain:`${vAB} ＝ (−20) − (＋15) ＝ −35 m/s。`},
    {id:"s14",type:"num",prompt:"(2) B から見た A の速度（符号つき）",answer:35,tol:0.01,unit:"m/s",
     traps:{"-35":"それは A から見た B の速度です。B から見るときは B の速度を引きます。"},
     explain:`${Q("v")}<sub>BA</sub> ＝ ${vA} − ${vB} ＝ 15 − (−20) ＝ ＋35 m/s。`},
    {id:"s15",type:"choice",prompt:"ステップ7　(1) と (2) の答えの関係は妥当か。",
     options:["大きさが等しく向きが逆なので妥当","同じ符号になるはずなので誤り","大きさが違うはずなので誤り"],answer:0,
     explain:`${Q("v")}<sub>BA</sub> ＝ −${vAB} がいつも成り立ちます。A から見て B が西へ近づくなら、B から見て A は東へ近づきます。`}
  ]},
  { title:"問題2（水平投射・ステップ1〜3を誘導）" + ADV, lead:ANIM("anim/projectile.html#h","水平投射ラボ（初速度と高さを問題の値にして確かめる）"),
    quote:"高さ 19.6 m のがけの上から、小球を水平に 7.0 m/s で投げ出した。(1) 地面に着くまでの時間、(2) その間に水平に進む距離、(3) 着地直前の速度の鉛直成分の大きさ、(4) 着地直前の速さを求めよ。", qs:[
    {id:"s21",type:"blanks",prompt:"ステップ1・2　軸を決め、既知・未知を整理する。",text:"水平方向（投げた向きが正）：初速度 {0}、加速度 {1}<br>鉛直方向（下向きが正）：初速度 {2}、加速度 {3}、落ちる距離 {4}",
     options:[["7.0 m/s","0"],["0","9.8 m/s²"],["7.0 m/s","0"],["0","9.8 m/s²"],["19.6 m","わからない"]],answer:[0,0,1,1,0],
     explain:"水平に投げたので鉛直方向の初速度は 0。鉛直下向きを正にすると加速度は ＋9.8 m/s² です。"},
    {id:"s22",type:"choice",prompt:"ステップ3　(1) の時間を求めるには、どちらの方向の運動を使うか。",
     options:["鉛直方向：19.6 ＝ ½ × 9.8 × <i class='qv'>t</i>²","水平方向：19.6 ＝ 7.0 × <i class='qv'>t</i>","水平と鉛直の両方の速さを足して考える"],answer:0,
     explain:"着地までの時間は「19.6 m 落ちるまでの時間」なので、鉛直方向（自由落下）の式で求めます。19.6 m は水平距離ではありません。"},
    {id:"s23",type:"num",prompt:"(1) 地面に着くまでの時間",answer:2,tol:0.02,unit:"s",
     traps:{"1.41":"½ が抜けていませんか。<i class='qv'>y</i> ＝ ½<i class='qv'>gt</i>² です。","2.8":"19.6 ÷ 7.0 は水平方向の式です。19.6 m は高さ（鉛直方向の距離）です。","4":"<i class='qv'>t</i>² ＝ 4.0 から <i class='qv'>t</i> を求めます。"},
     explain:`19.6 ＝ ½ × 9.8 × ${Q("t")}² より ${Q("t")}² ＝ 4.0、${Q("t")} ＝ 2.0 s（${Q("t")} ＞ 0）。`},
    {id:"s24",type:"num",prompt:"(2) 水平に進む距離",answer:14,tol:0.1,unit:"m",
     traps:{"19.6":"それは高さです。水平方向は等速なので <i class='qv'>x</i> ＝ <i class='qv'>v</i>₀<i class='qv'>t</i> です。","28":"<i class='qv'>t</i> ＝ 2.0 s を使っていますか。"},
     explain:`${Q("x")} ＝ 7.0 × 2.0 ＝ 14 m。`},
    {id:"s25",type:"num",prompt:"(3) 着地直前の速度の鉛直成分の大きさ",answer:19.6,tol:0.1,unit:"m/s",
     traps:{"7":"それは水平成分です。水平成分は投げたときのまま変わりません。","9.8":"<i class='qv'>t</i> ＝ 2.0 s での値です。<i class='qv'>v</i><sub>y</sub> ＝ <i class='qv'>gt</i> です。"},
     explain:`${vy} ＝ ${Q("g")}${Q("t")} ＝ 9.8 × 2.0 ＝ 19.6 m/s。`},
    {id:"s26",type:"num",prompt:"(4) 着地直前の速さ（有効数字2桁）",answer:21,tol:0.3,unit:"m/s",
     traps:{"26.6":"成分の大きさをそのまま足していませんか。水平成分と鉛直成分は垂直なので、三平方の定理を使います。","27":"成分の大きさをそのまま足していませんか。","19.6":"水平成分 7.0 m/s も合わせて考えます。"},
     explain:"√(7.0² ＋ 19.6²) ＝ √433 ≒ 20.8 ≒ 21 m/s。水平成分 7.0 m/s と鉛直成分 19.6 m/s の矢印でつくる直角三角形の斜辺です。"}
  ]},
  { title:"問題3（斜方投射・答えだけ入力）" + ADV, lead:`紙に7ステップを書いて解き、答えを入力せよ。水平方向は投げた向き、鉛直方向は上向きを正とする。sin 30° ＝ 0.50、cos 30° ＝ 0.87。解き終えたら確かめよう：${ANIM("anim/projectile.html#o","斜方投射ラボ（初速度・角度を問題の値にする）")}`,
    quote:"水平な地面から、水平と 30° の向きに速さ 19.6 m/s で小球を投げ上げた。", qs:[
    {id:"s31",type:"num",prompt:"(1) 最高点に達するまでの時間",answer:1,tol:0.02,unit:"s",
     traps:{"2":"それは地面に戻るまでの時間です。最高点は <i class='qv'>v</i><sub>y</sub> ＝ 0 のときです。","1.73":"初速度の鉛直成分は 19.6 sin 30° です（cos ではありません）。"},
     explain:`鉛直成分の初速度 19.6 × 0.50 ＝ 9.8 m/s。${vy} ＝ 9.8 − 9.8${Q("t")} ＝ 0 より ${Q("t")} ＝ 1.0 s。`},
    {id:"s32",type:"num",prompt:"(2) 最高点の地面からの高さ",answer:4.9,tol:0.05,unit:"m",
     traps:{"9.8":"½<i class='qv'>gt</i>² の項を忘れていませんか。<i class='qv'>y</i> ＝ 9.8 × 1.0 − ½ × 9.8 × 1.0²。","14.7":"−½<i class='qv'>gt</i>² の符号は負です。"},
     explain:`${Q("y")} ＝ 9.8 × 1.0 − ½ × 9.8 × 1.0² ＝ 4.9 m。`},
    {id:"s33",type:"num",prompt:"(3) 地面に落ちるまでの時間",answer:2,tol:0.02,unit:"s",
     explain:`${Q("y")} ＝ 9.8${Q("t")} − 4.9${Q("t")}² ＝ 0 より ${Q("t")} ＝ 2.0 s（${Q("t")} ＝ 0 は投げた瞬間なので捨てる）。最高点までの時間の2倍です。`},
    {id:"s34",type:"num",prompt:"(4) 投げた点から落ちた点までの水平距離（有効数字2桁）",answer:34,tol:0.6,unit:"m",
     traps:{"19.6":"水平成分は 19.6 cos 30° で、時間は 2.0 s です。","39.2":"水平成分は 19.6 cos 30° です。19.6 m/s のまま使っていませんか。","17":"それは最高点までの水平距離です。落ちるまでの時間は 2.0 s です。"},
     explain:"水平成分 19.6 × 0.87 ≒ 17.1 m/s。等速なので 17.1 × 2.0 ≒ 34 m。"},
    {id:"s35",type:"checklist",prompt:"解き終えたら、自分の答案を点検しよう（採点には入りません）。",
     items:["水平・鉛直の2つの軸と正の向きを最初に書いた","初速度を水平成分・鉛直成分に分けた（sin・cos を図で確かめた）","時間は鉛直方向の運動から求めた","水平方向は等速（加速度 0）として扱った","<i class='qv'>t</i> ＝ 0 などの不要な解を捨てた","答えの単位を確かめた"]}
  ]}]
},
{ id:"sum", advice:"「だれから見たか → 見ている人の速度を引く」「水平と鉛直に分ける」の2つを先に書こう。", tab:"まとめ", title:"単元のまとめ", back:"まとめ",
  intro:"計算はしません。どの考え方を使うかを答えます。",
  ref:{label:"式を見る", html:FORMULAS},
  groups:[{ title:"考え方を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"流れのある川を渡る船の、岸から見た速度を求めたい。",
     options:["水に対する船の速度と、水の流れの速度を足す（合成速度）","船の速度から水の流れの速度を引く（相対速度）","水の流れは関係ない"],answer:0,
     explain:"岸から見た速度 ＝ 水に対する速度 ＋ 水の速度。平面では矢印をつないで足します。"},
    {id:"m2",type:"choice",prompt:"走っているバスの中から見た、対向車の速度を求めたい。",
     options:["対向車の速度 − バスの速度","バスの速度 − 対向車の速度","対向車の速度 ＋ バスの速度"],answer:0,
     explain:"見ている人（バス）の速度を引きます。数値では、向きが逆なので大きさは足し算のようになります。"},
    {id:"m3",type:"choice",prompt:"（発展）水平投射で、着地までの時間を求めたい。",
     options:["鉛直方向の運動（自由落下）だけで求める","水平方向の運動だけで求める","投げる速さがわからないと求められない"],answer:0,
     explain:"時間は高さだけで決まり、水平に投げる速さによりません。"},
    {id:"m4",type:"choice",prompt:"（発展）斜方投射で、最高点に達する時刻を求めたい。",
     options:["速度の鉛直成分が 0 になる時刻を求める","速度が 0 になる時刻を求める","加速度が 0 になる時刻を求める"],answer:0,
     explain:`${vy} ＝ ${v0} sin ${Q("θ")} − ${Q("g")}${Q("t")} ＝ 0。速度（水平成分を含む）や加速度は 0 になりません。`},
    {id:"m5",type:"choice",prompt:"（発展）斜方投射で、水平に飛ぶ距離を求めたい。",
     options:["鉛直方向の運動から時間を求め、水平方向の速さ × 時間","初速度 × 時間","水平方向の運動だけで求める"],answer:0,
     explain:"水平方向の運動には時間が書かれていないことが多いので、まず鉛直方向から時間を求めます。2つの方向は「時間」でつながっています。"},
    {id:"m6",type:"self",prompt:"次の文を自分の言葉で完成させよ。「平面の運動の問題を解くとき、私が最初にすることは（　　）である。」",scored:false,
     model:"例：だれから見た速度かを決める。放物運動なら、水平・鉛直の軸を決めて初速度を成分に分ける。"}
  ]}]
}
];

registerUnit({
  id: "plane-motion",               // js/index.js の id と同じにする
  title: "合成速度・相対速度・放物運動",
  sections: SECTIONS
});
})();
