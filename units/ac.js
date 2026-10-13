/*
 * 単元：電流と磁場・交流
 * 磁場の向き、右ねじの法則、電流が磁場から受ける力（モーター）、電磁誘導とレンツの法則、
 * 交流と実効値、変圧器、送電、電磁波。
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
const V = I("V"), It = I("I"), R = I("R"), P = I("P"), f = I("f"), L = I("λ"), c = I("c"), T = I("T");
const V1 = Sb("V","1"), V2 = Sb("V","2"), N1 = Sb("N","1"), N2 = Sb("N","2"), I1 = Sb("I","1"), I2 = Sb("I","2"), Ve = Sb("V","e"), V0 = Sb("V","0");

/* 棒磁石の N 極をコイルに近づける図 */
const LENZ = (() => {
  let coil = "";
  for(let i = 0; i < 7; i++){ const x = 196 + i * 14; coil += `<ellipse cx="${x}" cy="80" rx="7" ry="30" fill="none" stroke="currentColor" stroke-width="1.6"/>`; }
  return `<svg class="graph" viewBox="0 0 320 150" role="img" aria-label="左に棒磁石があり、N極を右側のコイルに向けて近づけている図。コイルの左端をA、右端をBとする。">
<rect x="30" y="64" width="56" height="32" fill="var(--blue)" opacity=".35" stroke="currentColor"/>
<rect x="86" y="64" width="56" height="32" fill="var(--red)" opacity=".45" stroke="currentColor"/>
<text x="52" y="85" font-size="14" fill="currentColor">S</text><text x="108" y="85" font-size="14" fill="currentColor">N</text>
<line x1="70" y1="44" x2="130" y2="44" stroke="currentColor" stroke-width="1.8"/><polygon points="130,38 142,44 130,50" fill="currentColor"/>
<text x="62" y="34" font-size="11" fill="currentColor">近づける</text>
${coil}
<text x="180" y="128" font-size="13" fill="var(--red)">A</text><text x="290" y="128" font-size="13" fill="var(--red)">B</text>
<text x="222" y="40" font-size="11" fill="currentColor">コイル</text>
</svg>`;
})();

/* 用語集（定義カード）：小単元ごとに折りたたみ。同じ name の details は1つだけ開く */
const GLOS = (id, groups) => groups.map((g, i) => `<details name='glos-${id}' ${i ? "" : "open"} style='margin:6px 0;border:1px solid var(--line);border-radius:6px;padding:2px 10px'>
<summary style='cursor:pointer;font-weight:700;padding:6px 0'>${g.title}<span style='font-weight:400;color:var(--muted);font-size:13px'>（${g.rows.length}語）</span></summary>
<div class="tbl"><table><colgroup><col style="width:7.2em"><col></colgroup>
<tr><th>用語</th><th>定義（記号・式・単位）</th></tr>
${g.rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}${r[2] ? `<br><span style='color:var(--blue);font-weight:700'>${r[2]}</span>` : ""}</td></tr>`).join("\n")}
</table></div></details>`).join("\n");
const DEF_TABLE = `<p style='margin:4px 0;font-size:14px;color:var(--muted)'>小単元をタップすると開きます。</p>` + GLOS("ac", [
{ title:"1 磁場", rows:[
  ["磁力（磁気力）","磁石と磁石、磁石と鉄などの間にはたらく力。同じ極どうしは退け合い、異なる極どうしは引き合う"],
  ["磁場（磁界）","磁力がはたらく空間。磁石や電流のまわりにできる"],
  ["磁場の向き","その点に置いた方位磁針の N 極がさす向き"],
  ["磁力線","各点の磁場の向きをつないでかいた線。N 極から出て S 極に入る。間隔がせまいところほど磁場が強い"],
  ["右ねじの法則","電流の向きに右ねじを進めるとき、ねじを回す向きが電流のまわりの磁場の向き"],
  ["ソレノイド","導線を円筒状に密に巻いたコイル。電流を流すと、内部に軸に平行な、ほぼ一様な磁場ができる"],
  ["電磁石","ソレノイドの中に鉄心を入れたもの。電流を流している間だけ磁石になり、電流を大きくするほど強くなる"],
  ["電流が磁場から受ける力","磁場の中の導線に電流を流すと、電流と磁場の両方に垂直な向きに力を受ける"],
  ["モーター","電流が磁場から受ける力を利用して、電気エネルギーを回転の運動エネルギーに変える装置"]
]},
{ title:"2 電磁誘導と発電", rows:[
  ["起電力","電流を流そうとするはたらき。電池や発電機が回路に電流を流すために生じさせる電圧",`〔V〕`],
  ["電磁誘導","コイルを貫く磁場が変化すると、コイルに電圧が生じて電流が流れる現象"],
  ["誘導起電力","電磁誘導によってコイルに生じる電圧。磁場の変化が速いほど、コイルの巻数が多いほど大きい",`〔V〕`],
  ["誘導電流","電磁誘導によって流れる電流"],
  ["レンツの法則","誘導電流は、コイルを貫く磁場の変化を妨げる向きに流れる"],
  ["発電機","電磁誘導を利用して、回転の運動エネルギーを電気エネルギーに変える装置"],
  ["タービン","水・蒸気・ガス・風などの流れを受けて回転する羽根車。発電所では、タービンが発電機を回す"]
]},
{ title:"3 交流と送電", rows:[
  ["直流","向きが変わらない電流・電圧（電池から流れる電流など）"],
  ["交流","向きと大きさが周期的に変わる電流・電圧（家庭のコンセントなど）。発電機のコイルが回転すると生じる"],
  ["周波数","交流で、1&nbsp;s 間にくり返す変化の回数。東日本 50&nbsp;Hz、西日本 60&nbsp;Hz",`${f} ＝ 1/${T}〔Hz〕（ヘルツ）、1&nbsp;Hz ＝ 1/s`],
  ["実効値","同じ抵抗で同じ電力になる直流の値。家庭の 100&nbsp;V は実効値",`${Ve} ＝ ${V0}/√2`],
  ["変圧器","電磁誘導を利用して交流の電圧を変える装置。電圧の比は巻数の比に等しい",`${V1} : ${V2} ＝ ${N1} : ${N2}`],
  ["理想的な変圧器","電力の損失がない変圧器。1次側と2次側の電力が等しい",`${V1}${I1} ＝ ${V2}${I2}`],
  ["送電",`同じ電力を高い電圧で送ると電流が小さくなり、送電線で発生するジュール熱 ${R}${It}² が小さくなる`]
]},
{ title:"4 電磁波", rows:[
  ["電磁波","電場と磁場の振動が伝わる横波。真空中も伝わる。波長の長い順に、電波・赤外線・可視光線・紫外線・X線・γ線",`${c} ＝ ${f}${L}、${c} ＝ 3.0 × 10⁸&nbsp;m/s`],
  ["電波","電磁波のうち、波長が長いもの（波長 0.1&nbsp;mm 程度以上）。通信・放送・電子レンジなどに使われる"]
]}
]);
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th></tr>
<tr><td>電圧 ${V}、電流 ${It}、抵抗 ${R}</td><td>V、A、Ω</td></tr>
<tr><td>電力 ${P}</td><td>W ＝ V·A</td></tr>
<tr><td>周波数 ${f}</td><td>Hz ＝ 1/s</td></tr>
<tr><td>巻数 ${I("N")}</td><td>単位なし（回）</td></tr>
<tr><td>電磁波の速さ ${c}、波長 ${L}</td><td>m/s、m</td></tr></table></div>`;
const STEPS = `<p>1 与えられた量（巻数・電圧・電力・抵抗）を整理する → 2 変圧器では「電圧の比 ＝ 巻数の比」 → 3 理想的なら1次側と2次側の電力が等しい → 4 電流 ＝ 電力 ÷ 電圧 → 5 送電線の損失 ＝ ${R}${It}² → 6 単位をそろえて代入 → 7 妥当性（電圧を上げると電流は下がるか）</p>`;
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;
const TF = ["正しい","誤り"];
const UNITQ = ["m（波長）","W（電力）","s（周期）","V（電圧）"];

const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:`電流と磁場は互いに関係し合います。法則の「向き」を言葉で正確に言えるようにします。<br>アニメーションで確かめよう：<br>${ANIM("anim/magnetic.html#field","磁場と磁力線")}${ANIM("anim/magnetic.html#line","直線電流")}${ANIM("anim/magnetic.html#loop","円形電流")}${ANIM("anim/magnetic.html#sol","ソレノイド")}`,
  advice:"右ねじの法則、レンツの法則、変圧器の関係、実効値の意味を覚え直そう。",
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"choice",prompt:"磁場の向きは、どのように決められているか。",options:["方位磁針の N 極がさす向き","方位磁針の S 極がさす向き","電流の向き"],answer:0,
     explain:"磁力線も N 極から出て S 極に入る向きに描きます。"},
    {id:"d2",type:"choice",prompt:"右ねじの法則で、電流のまわりの磁場の向きはどれか。",
     options:["電流の向きに右ねじを進めるとき、ねじを回す向き","ねじを回す向きに電流を流すとき、ねじが進む向き","電流と同じ向き"],answer:0,
     explain:"まっすぐな電流のまわりには、同心円状の磁場ができます。"},
    {id:"d3",type:"choice",prompt:"電磁誘導が起こるのはどんなときか。",options:["コイルを貫く磁場が変化するとき","コイルの近くに磁石が静止しているとき","コイルに直流電流を流し続けるとき"],answer:0,
     explain:"磁場があるだけでは誘導電流は流れません。変化が必要です。"},
    {id:"d4",type:"choice",prompt:"レンツの法則で、誘導電流はどの向きに流れるか。",options:["コイルを貫く磁場の変化を妨げる向き","磁場の変化を強める向き","いつも時計回り"],answer:0,
     explain:"磁石を近づければ遠ざけようとする向き、遠ざければ引き止めようとする向きです。"},
    {id:"d5",type:"blanks",text:"家庭に届く交流の周波数は、東日本で{0}、西日本で{1}である。",options:[["50 Hz","60 Hz"],["50 Hz","60 Hz"]],answer:[0,1],
     explain:"発電機の歴史的な経緯から、日本では2つの周波数が使われています。"},
    {id:"d6",type:"choice",prompt:`交流電圧の最大値 ${V0} と実効値 ${Ve} の関係はどれか。`,options:[`${Ve} ＝ ${V0}/√2`,`${Ve} ＝ √2${V0}`,`${Ve} ＝ ${V0}/2`],answer:0,
     explain:"家庭の 100 V は実効値で、最大値は約 141 V です。"},
    {id:"d7",type:"choice",prompt:`変圧器の1次コイル・2次コイルの電圧 ${V1}, ${V2} と巻数 ${N1}, ${N2} の関係はどれか。`,
     options:[`${V1} : ${V2} ＝ ${N1} : ${N2}`,`${V1} : ${V2} ＝ ${N2} : ${N1}`,`${V1}${N1} ＝ ${V2}${N2}`],answer:0,explain:"巻数が多いほうの電圧が高くなります。"},
    {id:"d8",type:"choice",prompt:"真空中の電磁波の速さはどれか。",options:["3.0 × 10⁸ m/s","3.4 × 10² m/s","3.0 × 10⁵ m/s"],answer:0,explain:"3.4 × 10² m/s は空気中の音速です。"},
    {id:"d9",type:"choice",prompt:"波長の長い順に正しく並べたものはどれか。",
     options:["電波 → 赤外線 → 可視光線 → 紫外線 → X線","X線 → 紫外線 → 可視光線 → 赤外線 → 電波","可視光線 → 電波 → 赤外線 → 紫外線 → X線"],answer:0,
     explain:"波長が短いほど振動数が大きくなります（<i class='qv'>c</i> ＝ <i class='qv'>fλ</i> で <i class='qv'>c</i> が一定）。"}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル",
  intro:"向きを言葉で読む練習と、電磁誘導がいつ・どの向きに起こるかを読む練習です。",
  advice:"電磁誘導は「変化」があるときだけ。向きは「変化を妨げる」で考えよう。",
  groups:[
  { title:"A. 右ねじの法則を読む", lead:ANIM("anim/magnetic.html#line","直線電流がつくる磁場のアニメーション（⊙・⊗ と回る向き）"), qs:[
    {id:"ra1",type:"choice",prompt:"紙面の裏から表へ（読んでいる人に向かって）流れる直線電流のまわりの磁場は、紙面上で見てどちら向きに回るか。",
     options:["反時計回り","時計回り","電流と同じ向き"],answer:0,explain:"右ねじを手前に進めるには、反時計回りに回します。"},
    {id:"ra2",type:"choice",prompt:"紙面上を下から上へ流れる直線電流がある。電流の右側の点での磁場の向きは？",
     options:["紙面の表から裏へ","紙面の裏から表へ","電流と同じ上向き"],answer:0,
     explain:"右ねじを上に進めると、右側ではねじの回る向きが紙面の奥へ向かいます。"}
  ]},
  { title:"B. 電磁誘導を読む", lead:"棒磁石の N 極を、コイルの端 A に近づける。", figure:LENZ, qs:[
    {id:"rb1",type:"choice",prompt:"コイルの端 A は何極になるように誘導電流が流れるか。",options:["N 極","S 極","極はできない"],answer:0,
     explain:"近づいてくる N 極を押し返す（変化を妨げる）ように、A が N 極になります。"},
    {id:"rb2",type:"choice",prompt:"N 極をコイルから遠ざけるとき、A は何極になるか。",options:["N 極","S 極","極はできない"],answer:1,
     explain:"遠ざかる N 極を引き止めるように、A が S 極になります。誘導電流の向きは近づけるときと逆です。"},
    {id:"rb3",type:"choice",prompt:"磁石をコイルの中に入れたまま静止させると、誘導電流はどうなるか。",options:["流れない","一定の大きさで流れ続ける","しだいに大きくなる"],answer:0,
     explain:"コイルを貫く磁場が変化していないので、誘導電流は流れません。"},
    {id:"rb4",type:"choice",prompt:"同じ磁石をより速く近づけると、誘導電流はどうなるか。",options:["大きくなる","小さくなる","変わらない"],answer:0,
     explain:"磁場の変化が速いほど、誘導起電力は大きくなります。"}
  ]},
  { title:"C. 正しいか、誤りか", qs:[
    {id:"rc1",type:"choice",prompt:"家庭のコンセントの 100 V は、交流電圧の最大値である。",options:TF,answer:1,explain:"誤り。実効値です。最大値は約 141 V。"},
    {id:"rc2",type:"choice",prompt:"変圧器を使えば、直流の電圧も変えられる。",options:TF,answer:1,
     explain:"誤り。変圧器は電磁誘導を利用しています。直流では磁場が変化しないので電圧は生じません。"},
    {id:"rc3",type:"choice",prompt:"同じ電力を送るとき、高い電圧で送るほど送電線での損失は小さい。",options:TF,answer:0,explain:"正しい。電流が小さくなり、ジュール熱 <i class='qv'>RI</i>² が減ります。"},
    {id:"rc4",type:"choice",prompt:"電磁波は真空中も伝わる。",options:TF,answer:0,explain:"正しい。媒質を必要としない点が音と違います。"},
    {id:"rc5",type:"choice",prompt:"可視光線は電磁波の一種である。",options:TF,answer:0,explain:"正しい。目に見える範囲の波長の電磁波です。"},
    {id:"rc6",type:"choice",prompt:"直線電流のまわりの磁場は、電流から遠いほど強い。",options:TF,answer:1,explain:"誤り。電流から離れるほど弱くなります。"}
  ]}]
},
{ id:"dim", tab:"③次元", title:"③ 次元チェック",
  intro:"巻数は単位のない数です。電力・周波数・電磁波の式の単位を確かめます。",
  advice:"W ＝ V·A、Hz ＝ 1/s を使い、接頭語（k、M、G）を 10 の累乗に直してから代入しよう。",
  ref:{label:"単位の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", qs:[
    {id:"da1",type:"choice",prompt:`${c} ÷ ${f}`,options:UNITQ,answer:0,two:true,explain:"(m/s) ÷ (1/s) ＝ m。波長です。"},
    {id:"da2",type:"choice",prompt:`${R}${It}²`,options:UNITQ,answer:1,two:true,explain:"Ω × A² ＝ (V/A) × A² ＝ V·A ＝ W。送電線で失われる電力です。"},
    {id:"da3",type:"choice",prompt:`1 ÷ ${f}`,options:UNITQ,answer:2,two:true,explain:"1 ÷ (1/s) ＝ s。周期です。"},
    {id:"da4",type:"choice",prompt:`(${N2}/${N1}) × ${V1}`,options:UNITQ,answer:3,two:true,explain:"巻数の比は単位なしなので、結果は電圧（2次側の電圧）です。"}
  ]},
  { title:"B. 式の単位を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、単位が合わないものをすべて選べ。",
     options:[`${P} ＝ ${R}${It}²`,`${P} ＝ ${R} ÷ ${It}²`,`${L} ＝ ${c} ÷ ${f}`,`${L} ＝ ${c} × ${f}`,`${T} ＝ 1 ÷ ${f}`],answer:[1,3],
     explain:`${R} ÷ ${It}² は Ω/A²、${c} × ${f} は m/s² で、どちらも左辺と合いません。`}
  ]},
  { title:"C. 単位を換算する", qs:[
    {id:"dc1",type:"num",prompt:"周波数 80 MHz の FM 放送の電波の波長を求めよ（有効数字2桁）。",answer:3.8,tol:0.06,unit:"m",
     traps:{"0.27":"<i class='qv'>λ</i> ＝ <i class='qv'>c</i>/<i class='qv'>f</i> です（<i class='qv'>f</i>/<i class='qv'>c</i> ではありません）。","3750000":"M（メガ）＝ 10⁶ に直して代入します。"},
     explain:`${L} ＝ ${c}/${f} ＝ 3.0 × 10⁸ ÷ (8.0 × 10⁷) ＝ 3.75 ≒ 3.8 m。`},
    {id:"dc2",type:"choice",prompt:"周波数 60 Hz の交流の周期はどれか。",options:["1.7 × 10⁻² s","60 s","6.0 × 10⁻² s"],answer:0,explain:"1 ÷ 60 ＝ 0.0167 ≒ 1.7 × 10⁻² s。"}
  ]},
  { title:"D. 答案の誤りを見つける", lead:"問「実効値 100 V の交流電圧の最大値を求めよ。」",
    quote:`答案：${V0} ＝ 100/√2 ≒ 71 V`, qs:[
    {id:"dd1",type:"choice",prompt:"この答案の誤りはどれか。",options:["実効値と最大値の関係を逆にしている","√2 ではなく 2 で割るべき","単位が違う"],answer:0,
     explain:`${Ve} ＝ ${V0}/√2 なので、最大値は ${V0} ＝ √2 ${Ve}。最大値が実効値より小さくなることはありません。`},
    {id:"dd2",type:"num",prompt:"正しい最大値を求めよ（有効数字3桁）。",answer:141,tol:1,unit:"V",traps:{"71":"最大値は実効値より大きくなります。"},
     explain:"√2 × 100 ≒ 141 V。"}
  ]}]
},
{ id:"step", tab:"④手順", title:"④ 手順固定の演習",
  intro:"変圧器と送電は「電圧の比 ＝ 巻数の比」「電力は保存」「損失は <i class='qv'>RI</i>²」の3つで解けます。",
  advice:"電圧の比と巻数の比を対応させ、電流は電力 ÷ 電圧で求めよう。",
  ref:{label:"7ステップを見る", html:STEPS},
  groups:[
  { title:"問題1（変圧器・すべてのステップ）", quote:"1次コイルの巻数 500 回、2次コイルの巻数 25 回の理想的な変圧器の1次側に、100 V の交流電圧をかけた。2次側には消費電力 10 W の電球をつないだ。", qs:[
    {id:"s11",type:"choice",prompt:"ステップ2　2次側の電圧を求める式はどれか。",options:[`${V2} ＝ ${V1} × ${N2}/${N1}`,`${V2} ＝ ${V1} × ${N1}/${N2}`,`${V2} ＝ ${V1}`],answer:0,
     explain:`${V1} : ${V2} ＝ ${N1} : ${N2} を ${V2} について解きます。`},
    {id:"s12",type:"num",prompt:"2次側の電圧",answer:5.0,tol:0.05,unit:"V",traps:{"2000":"巻数の比が逆になっています。巻数の少ない側は電圧が低くなります。"},
     explain:"100 × 25/500 ＝ 5.0 V。"},
    {id:"s13",type:"num",prompt:"ステップ4　2次側を流れる電流",answer:2.0,tol:0.02,unit:"A",traps:{"50":"<i class='qv'>I</i> ＝ <i class='qv'>P</i>/<i class='qv'>V</i>（10 ÷ 5.0）です。"},explain:`${I2} ＝ 10 ÷ 5.0 ＝ 2.0 A。`},
    {id:"s14",type:"num",prompt:"ステップ3・4　1次側を流れる電流",answer:0.10,tol:0.002,unit:"A",traps:{"2":"1次側の電力も 10 W ですが、電圧は 100 V です。","40":"電圧が高い側は電流が小さくなります。"},
     explain:`理想的なので1次側も 10 W。${I1} ＝ 10 ÷ 100 ＝ 0.10 A。`},
    {id:"s15",type:"choice",prompt:"ステップ7　妥当性の確認として正しいものはどれか。",options:["電圧が 1/20 になり、電流は 20 倍になっている","電圧も電流も 1/20 になっている","電圧と電流は変わっていない"],answer:0,
     explain:`${V1}${I1} ＝ ${V2}${I2}（100 × 0.10 ＝ 5.0 × 2.0）で、電力が等しくなっています。`}
  ]},
  { title:"問題2（送電）", quote:"発電所から 1.0 × 10⁴ W の電力を、抵抗 2.0 Ω の送電線で送る。", qs:[
    {id:"s21",type:"num",prompt:"1.0 × 10³ V で送るとき、送電線を流れる電流",answer:10,tol:0.05,unit:"A",explain:`${It} ＝ ${P}/${V} ＝ 10000 ÷ 1000 ＝ 10 A。`},
    {id:"s22",type:"num",prompt:"そのとき送電線で失われる電力",answer:200,tol:1,unit:"W",traps:{"20":"損失は <i class='qv'>RI</i>²（2.0 × 10²）です。","2000":"<i class='qv'>RI</i>² ＝ 2.0 × 10² です。"},explain:`${R}${It}² ＝ 2.0 × 10² ＝ 200 W。`},
    {id:"s23",type:"num",prompt:"1.0 × 10⁴ V で送るとき、送電線で失われる電力",answer:2.0,tol:0.02,unit:"W",traps:{"20":"電流が 1/10 なら、損失は 1/100 になります。"},
     explain:`${It} ＝ 1.0 A、${R}${It}² ＝ 2.0 × 1.0² ＝ 2.0 W。電圧を 10 倍にすると損失は 1/100 になります。`},
    {id:"s24",type:"self",prompt:"変圧器が直流には使えない理由を説明せよ。",
     model:"変圧器は、1次コイルの電流がつくる磁場の変化によって、2次コイルに電磁誘導で電圧を生じさせる装置である。直流では磁場が変化しないので、2次コイルに電圧が生じない。"}
  ]},
  { title:"問題3（電磁波）", qs:[
    {id:"s31",type:"num",prompt:"電子レンジで使われる周波数 2.5 × 10⁹ Hz の電磁波の波長を求めよ。",answer:0.12,tol:0.002,unit:"m",
     traps:{"8.3":"<i class='qv'>λ</i> ＝ <i class='qv'>c</i>/<i class='qv'>f</i> です。","120":"10⁹ と 10⁸ の割り算を確かめよう。"},explain:`${L} ＝ 3.0 × 10⁸ ÷ (2.5 × 10⁹) ＝ 0.12 m。`},
    {id:"s32",type:"checklist",prompt:"解き終えたら点検しよう（採点には入りません）。",
     items:["電圧の比と巻数の比を正しく対応させた","理想的な変圧器では電力が等しいことを使った","電流は電力 ÷ 電圧で求めた","送電の損失は <i class='qv'>RI</i>² で求めた","接頭語（k、M、G）を 10 の累乗に直した"]}
  ]}]
},
{ id:"sum", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。法則と、その理由を選びます。",
  advice:"電磁誘導は「変化」、変圧器は「巻数の比」、送電は「<i class='qv'>RI</i>²」。キーワードと理由を結びつけよう。",
  groups:[{ title:"法則と理由を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"コイルに誘導電流が流れる条件は？",options:["コイルを貫く磁場が変化すること","コイルの近くに磁石があること","コイルが電池につながっていること"],answer:0,explain:"変化がなければ流れません。"},
    {id:"m2",type:"choice",prompt:"送電で高い電圧を使う理由は？",options:["電流を小さくして、送電線のジュール熱を減らすため","電流を大きくして、速く送るため","電磁波として送るため"],answer:0,explain:"損失は電流の2乗に比例します。"},
    {id:"m3",type:"choice",prompt:"家庭の「100 V」は、交流のどの値を表しているか。",options:["実効値","最大値","平均値"],answer:0,explain:"同じ抵抗で同じ電力になる直流の電圧です。"},
    {id:"m4",type:"choice",prompt:"理想的な変圧器で、1次側と2次側で変わらない量は？",options:["電力","電圧","電流"],answer:0,explain:"電圧と電流は巻数の比に応じて変わりますが、積（電力）は等しくなります。"},
    {id:"m5",type:"blanks",prompt:"次の文を完成させよ。",text:"電磁波は{0}で、真空中を{1}の速さで伝わる。",options:[["横波","縦波"],["3.0 × 10⁸ m/s","3.4 × 10² m/s"]],answer:[0,0],
     explain:"音（縦波、媒質が必要）との違いを確かめよう。"}
  ]}]
}
];

registerUnit({ id:"ac", title:"電流と磁場・交流", sections: SECTIONS });
})();
