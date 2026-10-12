/*
 * 単元：波の性質
 * 横波・縦波、振幅・波長・周期・振動数、v ＝ fλ、y-x グラフと y-t グラフの読み分け、
 * 重ね合わせ、反射（自由端・固定端）、定常波。
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
const v = I("v"), f = I("f"), L = I("λ"), T = I("T"), A = I("A"), x = I("x"), y = I("y"), t = I("t");
const SI = s => `<tspan font-style="italic" font-family="Times New Roman,Times,serif">${s}</tspan>`;

/* 正弦波の折れ線（px） */
function sine(x0, x1, cx, cy, amp, period, phase){
  let p = [];
  for(let i = 0; i <= 120; i++){
    const X = x0 + (x1 - x0) * i / 120;
    p.push(`${X.toFixed(1)},${(cy - amp * Math.sin(2 * Math.PI * (X - cx) / period + phase)).toFixed(1)}`);
  }
  return p.join(" ");
}
/* y-x グラフ：λ ＝ 0.40 m、A ＝ 0.10 m、+x 向きに進む。横 0〜0.60 m を 40〜300 px に */
const WAVE = (() => {
  const k = 260 / 0.60, X = m => 40 + m * k;
  let ticks = "";
  for(let i = 1; i <= 6; i++){
    ticks += `<line x1="${X(i/10)}" y1="78" x2="${X(i/10)}" y2="84" stroke="currentColor"/>`
          +  `<text x="${X(i/10) - 9}" y="${i % 2 ? 98 : 98}" font-size="10" fill="currentColor">${(i/10).toFixed(1)}</text>`;
  }
  return `<svg class="graph" viewBox="0 0 320 160" role="img" aria-label="ある時刻の波形（y-xグラフ）。波長0.40 m、振幅0.10 mの正弦波で、x軸の正の向きに進む。点Pはx＝0.20 m、点Qはx＝0.10 mの山。">
<line x1="40" y1="81" x2="306" y2="81" stroke="currentColor" stroke-width="1.2"/>
<line x1="40" y1="150" x2="40" y2="12" stroke="currentColor" stroke-width="1.2"/>
<line x1="36" y1="38" x2="44" y2="38" stroke="currentColor"/><line x1="36" y1="124" x2="44" y2="124" stroke="currentColor"/>
<text x="4" y="42" font-size="10" fill="currentColor">0.10</text><text x="0" y="128" font-size="10" fill="currentColor">−0.10</text>
${ticks}
<polyline points="${sine(40, 300, 40, 81, 43, 0.40 * k, 0)}" fill="none" stroke="var(--blue)" stroke-width="2.6"/>
<circle cx="${X(0.20)}" cy="81" r="4.5" fill="var(--red)"/><text x="${X(0.20) + 4}" y="74" font-size="13" fill="var(--red)">P</text>
<circle cx="${X(0.10)}" cy="38" r="4.5" fill="var(--red)"/><text x="${X(0.10) - 4}" y="30" font-size="13" fill="var(--red)">Q</text>
<text x="18" y="16" font-size="12" fill="currentColor">${SI("y")}〔m〕</text><text x="270" y="122" font-size="12" fill="currentColor">${SI("x")}〔m〕</text>
<line x1="228" y1="146" x2="290" y2="146" stroke="currentColor" stroke-width="1.6"/><polygon points="290,141 300,146 290,151" fill="currentColor"/>
<text x="200" y="140" font-size="11" fill="currentColor">波の進む向き</text>
</svg>`;
})();
/* y-t グラフ：ある1点の振動。T ＝ 0.50 s。横 0〜1.0 s を 40〜300 px に */
const OSC = (() => {
  const k = 260 / 1.0, X = s => 40 + s * k;
  let ticks = "";
  [0.25, 0.50, 0.75, 1.0].forEach(s => {
    ticks += `<line x1="${X(s)}" y1="78" x2="${X(s)}" y2="84" stroke="currentColor"/><text x="${X(s) - 11}" y="98" font-size="10" fill="currentColor">${s.toFixed(2)}</text>`;
  });
  return `<svg class="graph" viewBox="0 0 320 150" role="img" aria-label="媒質のある1点の変位と時間のグラフ（y-tグラフ）。周期0.50 s、振幅0.10 mで、時刻0から上向きに振動し始める。">
<line x1="40" y1="81" x2="306" y2="81" stroke="currentColor" stroke-width="1.2"/>
<line x1="40" y1="140" x2="40" y2="12" stroke="currentColor" stroke-width="1.2"/>
<line x1="36" y1="38" x2="44" y2="38" stroke="currentColor"/><line x1="36" y1="124" x2="44" y2="124" stroke="currentColor"/>
<text x="4" y="42" font-size="10" fill="currentColor">0.10</text><text x="0" y="128" font-size="10" fill="currentColor">−0.10</text>
${ticks}
<polyline points="${sine(40, 300, 40, 81, 43, 0.50 * k, 0)}" fill="none" stroke="var(--blue)" stroke-width="2.6"/>
<text x="18" y="16" font-size="12" fill="currentColor">${SI("y")}〔m〕</text><text x="272" y="122" font-size="12" fill="currentColor">${SI("t")}〔s〕</text>
</svg>`;
})();

const DEF_TABLE = `<div class="tbl"><table>
<tr><th>用語</th><th>定義</th><th>記号・単位</th></tr>
<tr><td>波（波動）</td><td>ある点の振動が、次々と周りに伝わっていく現象。媒質そのものは移動しない</td><td>―</td></tr>
<tr><td>横波・縦波</td><td>媒質の振動方向が、波の進む向きに垂直なのが横波、平行なのが縦波（疎密波）</td><td>―</td></tr>
<tr><td>振幅</td><td>媒質の振動の中心からの最大の変位</td><td>${A}〔m〕</td></tr>
<tr><td>波長</td><td>隣り合う山と山（谷と谷）の間隔。1回の振動の間に波が進む距離</td><td>${L}〔m〕</td></tr>
<tr><td>周期</td><td>媒質の1点が1回振動するのにかかる時間</td><td>${T}〔s〕</td></tr>
<tr><td>振動数</td><td>媒質の1点が1 s 間に振動する回数</td><td>${f} ＝ 1/${T}〔Hz〕</td></tr>
<tr><td>波の速さ</td><td>波形が1 s 間に進む距離。媒質によって決まる</td><td>${v} ＝ ${f}${L} ＝ ${L}/${T}〔m/s〕</td></tr>
<tr><td>重ね合わせの原理</td><td>2つの波が重なった点の変位は、それぞれの変位の和</td><td>${y} ＝ ${Sb("y","1")} ＋ ${Sb("y","2")}</td></tr>
<tr><td>反射</td><td>自由端では山は山として、固定端では山は谷として（位相が逆になって）反射する</td><td>―</td></tr>
<tr><td>定常波</td><td>逆向きに進む同じ波が重なってできる、どちらにも進まない波。振動しない点が節、最も大きく振動する点が腹</td><td>節の間隔 ＝ ${L}/2</td></tr>
</table></div>
<p>${y}-${x} グラフはある時刻の波形（山と山の間隔が波長）。${y}-${t} グラフは媒質の1点の振動（山と山の間隔が周期）。</p>`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th></tr>
<tr><td>波長 ${L}、振幅 ${A}</td><td>m</td></tr>
<tr><td>周期 ${T}</td><td>s</td></tr>
<tr><td>振動数 ${f}</td><td>Hz ＝ 1/s</td></tr>
<tr><td>波の速さ ${v}</td><td>m/s</td></tr></table></div>`;
const STEPS = `<p>1 グラフの種類（${y}-${x} か ${y}-${t} か）を確かめる → 2 目盛りから ${L}・${T}・${A} を読む → 3 既知・未知を整理 → 4 式（${v} ＝ ${f}${L}、${f} ＝ 1/${T}）を選ぶ → 5 文字式で解く → 6 単位をそろえて代入 → 7 妥当性</p>`;
const TF = ["正しい","誤り"];
const UNITQ = ["m/s（速さ）","m（波長）","Hz（振動数）","s（周期）"];
const UPDN = ["上（<i class='qv'>y</i> の正の向き）","下（<i class='qv'>y</i> の負の向き）","動かない"];

const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:"波で動いているのは「振動の状態」で、媒質そのものではありません。用語と記号を正確に覚えます。",
  advice:"波長と周期の定義（何と何の間隔か）と、<i class='qv'>v</i> ＝ <i class='qv'>fλ</i> を覚え直そう。",
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"blanks",text:"横波は、媒質の振動方向が波の進む向きに{0}波、縦波は{1}波である。",
     options:[["垂直な","平行な"],["垂直な","平行な"]],answer:[0,1],explain:"音は縦波（疎密波）です。"},
    {id:"d2",type:"choice",prompt:"波が伝わるとき、媒質はどうなっているか。",
     options:["その場で振動しているだけで、波と一緒には移動しない","波と同じ速さで移動している","波が通り過ぎると、もとの位置から少しずれる"],answer:0,
     explain:"伝わっていくのは振動の状態（エネルギー）で、媒質は移動しません。"},
    {id:"d3",type:"blanks",text:`振動数 ${f} と周期 ${T} の関係は ${f} ＝ {0} で、${f} の単位は{1}である。`,
     options:[["1/<i class='qv'>T</i>","<i class='qv'>T</i>","2<i class='qv'>T</i>"],["Hz","s","m/s"]],answer:[0,0],explain:`1回の振動に ${T} 秒かかるので、1 s 間には 1/${T} 回振動します。Hz ＝ 1/s。`},
    {id:"d4",type:"choice",prompt:`波の速さ ${v}、振動数 ${f}、波長 ${L} の関係はどれか。`,
     options:[`${v} ＝ ${f}${L}`,`${v} ＝ ${f} ÷ ${L}`,`${v} ＝ ${L} ÷ ${f}`],answer:0,
     explain:`1 s 間に ${f} 回振動し、1回ごとに ${L} 進むので、${v} ＝ ${f}${L}。`},
    {id:"d5",type:"choice",prompt:"波長とは何か。",
     options:["隣り合う山と山の間隔","山の高さ","山と隣の谷の間隔"],answer:0,explain:"山と隣の谷の間隔は半波長です。"},
    {id:"d6",type:"blanks",text:"定常波で、まったく振動しない点を{0}、最も大きく振動する点を{1}という。隣り合う節の間隔は{2}である。",
     options:[["節","腹"],["節","腹"],["<i class='qv'>λ</i>/2","<i class='qv'>λ</i>","<i class='qv'>λ</i>/4"]],answer:[0,1,0],explain:`隣り合う節と節の間隔は半波長 ${L}/2 です。`},
    {id:"d7",type:"choice",prompt:"固定端で反射するとき、入射した山はどのように反射するか。",
     options:["山として反射する","谷として反射する","反射しない"],answer:1,explain:"固定端では位相が逆になります。自由端ではそのまま山として反射します。"},
    {id:"d8",type:"choice",prompt:"2つの波が重なった点の変位はどうなるか（重ね合わせの原理）。",
     options:[`それぞれの変位の和 ${Sb("y","1")} ＋ ${Sb("y","2")}`,"大きいほうの波の変位","それぞれの変位の積"],answer:0,
     explain:"重なり合った後、それぞれの波はもとの形のまま進んでいきます（独立性）。"}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル",
  intro:"波の問題でいちばん多い誤りは、グラフの種類の取り違えです。横軸が <i class='qv'>x</i> か <i class='qv'>t</i> かを、必ず最初に確かめます。",
  advice:"グラフを見たら、まず横軸が <i class='qv'>x</i> か <i class='qv'>t</i> かを確かめよう。山と山の間隔が波長か周期かが変わります。",
  groups:[
  { title:"A. <i class='qv'>y</i>-<i class='qv'>x</i> グラフ（ある時刻の波形）を読む", figure:WAVE, qs:[
    {id:"ra1",type:"num",prompt:`この波の波長 ${L} を読め。`,answer:0.40,tol:0.005,unit:"m",
     traps:{"0.2":"それは山と谷の間隔（半波長）です。","0.1":"それは振幅です。"},explain:"山と山の間隔は 0.40 m。"},
    {id:"ra2",type:"num",prompt:`この波の振幅 ${A} を読め。`,answer:0.10,tol:0.002,unit:"m",
     traps:{"0.2":"振幅は、振動の中心から山までの高さです（山から谷までではありません）。"},explain:"振動の中心（<i class='qv'>y</i> ＝ 0）から山までの 0.10 m。"},
    {id:"ra3",type:"choice",prompt:"波は <i class='qv'>x</i> の正の向きに進んでいる。点 P は、この直後どちらに動くか。",options:UPDN,answer:0,
     explain:"波形を進む向きに少しずらして描くと、P の位置には左側の山が近づいてきます。だから P は上に動きます。"},
    {id:"ra4",type:"choice",prompt:"この瞬間、山の位置にある点 Q の速さはどうなっているか。",
     options:["0（振動の端で、向きが変わる瞬間）","最大","波の速さと同じ"],answer:0,
     explain:"山や谷の位置は振動の端なので、媒質の速さは 0 です。振動の中心を通るとき、速さは最大になります。"}
  ]},
  { title:"B. <i class='qv'>y</i>-<i class='qv'>t</i> グラフ（1点の振動）を読む", lead:"同じ波が伝わる媒質の、ある1点の変位と時間の関係。", figure:OSC, qs:[
    {id:"rb1",type:"num",prompt:`周期 ${T} を読め。`,answer:0.50,tol:0.005,unit:"s",
     traps:{"0.25":"それは半周期です。山と山の間隔を読みます。","1":"グラフ全体には2回分の振動が描かれています。"},explain:"山と山の間隔は 0.50 s。"},
    {id:"rb2",type:"num",prompt:`振動数 ${f} を求めよ。`,answer:2.0,tol:0.02,unit:"Hz",
     traps:{"0.5":"<i class='qv'>f</i> ＝ 1/<i class='qv'>T</i> です。"},explain:`${f} ＝ 1/${T} ＝ 1/0.50 ＝ 2.0 Hz。`},
    {id:"rb3",type:"choice",prompt:"この <i class='qv'>y</i>-<i class='qv'>t</i> グラフの山と山の間隔は何を表すか。",options:["周期","波長","振幅"],answer:0,
     explain:"横軸が時間なので、山と山の間隔は時間（周期）です。<i class='qv'>y</i>-<i class='qv'>x</i> グラフなら波長になります。"}
  ]},
  { title:"C. 正しいか、誤りか", qs:[
    {id:"rc1",type:"choice",prompt:"波が伝わると、媒質も波と一緒に移動する。",options:TF,answer:1,explain:"誤り。媒質はその場で振動するだけです。"},
    {id:"rc2",type:"choice",prompt:"同じ媒質を伝わる波では、振動数を大きくすると波の速さも大きくなる。",options:TF,answer:1,
     explain:"誤り。波の速さは媒質で決まります。振動数を大きくすると、波長が短くなります。"},
    {id:"rc3",type:"choice",prompt:"音は縦波である。",options:TF,answer:0,explain:"正しい。空気の密な部分と疎な部分が伝わります。"},
    {id:"rc4",type:"choice",prompt:"自由端で反射するとき、山は山として反射する。",options:TF,answer:0,explain:"正しい。固定端では谷として反射します。"},
    {id:"rc5",type:"choice",prompt:"定常波は、波形が左右どちらにも進まない。",options:TF,answer:0,explain:"正しい。節の位置は動かず、腹の位置でその場の振動をくり返します。"},
    {id:"rc6",type:"choice",prompt:"振幅が大きい波ほど、速く伝わる。",options:TF,answer:1,explain:"誤り。振幅は波の速さに関係しません。"}
  ]}]
},
{ id:"dim", tab:"③次元", title:"③ 次元チェック",
  intro:"Hz ＝ 1/s。振動数・周期・波長・速さの単位を組み合わせると、式の形が確かめられます。",
  advice:"Hz が 1/s であることを使って、<i class='qv'>v</i> ＝ <i class='qv'>fλ</i> の両辺の単位がそろうか確かめよう。",
  ref:{label:"単位の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", qs:[
    {id:"da1",type:"choice",prompt:`${f} × ${L}`,options:UNITQ,answer:0,two:true,explain:"(1/s) × m ＝ m/s。波の速さです。"},
    {id:"da2",type:"choice",prompt:`${L} ÷ ${T}`,options:UNITQ,answer:0,two:true,explain:"m ÷ s ＝ m/s。"},
    {id:"da3",type:"choice",prompt:`1 ÷ ${T}`,options:UNITQ,answer:2,two:true,explain:"1/s ＝ Hz。振動数です。"},
    {id:"da4",type:"choice",prompt:`${v} ÷ ${f}`,options:UNITQ,answer:1,two:true,explain:"(m/s) ÷ (1/s) ＝ m。波長です。"},
    {id:"da5",type:"choice",prompt:`${L} ÷ ${v}`,options:UNITQ,answer:3,two:true,explain:"m ÷ (m/s) ＝ s。周期です。"}
  ]},
  { title:"B. 式の単位を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、単位が合わないものをすべて選べ。",
     options:[`${v} ＝ ${f}${L}`,`${v} ＝ ${f} ÷ ${L}`,`${v} ＝ ${L} ÷ ${T}`,`${v} ＝ ${L}${T}`,`${T} ＝ ${L} ÷ ${v}`,`${f} ＝ ${L} ÷ ${v}`],answer:[1,3,5],
     explain:`${f} ÷ ${L} は 1/(m·s)、${L}${T} は m·s、${L} ÷ ${v} は s で、どれも左辺と合いません。`}
  ]},
  { title:"C. 単位を換算する", qs:[
    {id:"dc1",type:"choice",prompt:"2.0 kHz を Hz で表したものはどれか。",options:["2.0 × 10³ Hz","2.0 × 10⁻³ Hz","2.0 × 10⁶ Hz"],answer:0,explain:"k ＝ 10³。"},
    {id:"dc2",type:"num",prompt:"振動数 50 Hz の振動の周期は何 s か。",answer:0.020,tol:0.0002,unit:"s",
     traps:{"50":"周期は振動数の逆数です。","0.2":"1 ÷ 50 を計算し直そう。"},explain:`${T} ＝ 1/${f} ＝ 1/50 ＝ 0.020 s。`}
  ]},
  { title:"D. 答案の誤りを見つける", lead:"問「振動数 5.0 Hz、波長 40 cm の波の速さを求めよ。」",
    quote:`答案：${v} ＝ ${f}${L} ＝ 5.0 × 40 ＝ 200 m/s`, qs:[
    {id:"dd1",type:"choice",prompt:"この答案の誤りはどれか。",
     options:["波長を cm のまま代入して、m/s をつけている","式が <i class='qv'>v</i> ＝ <i class='qv'>f</i> ÷ <i class='qv'>λ</i> であるべき","振動数を周期に直していない"],answer:0,
     explain:"5.0 × 40 の単位は cm/s です。m/s で答えるなら、40 cm ＝ 0.40 m に直してから代入します。"},
    {id:"dd2",type:"num",prompt:"正しい速さを m/s で求めよ。",answer:2.0,tol:0.02,unit:"m/s",
     traps:{"200":"それは cm/s での値です。","12.5":"<i class='qv'>v</i> ＝ <i class='qv'>fλ</i> です（割り算ではありません）。"},explain:`${v} ＝ 5.0 × 0.40 ＝ 2.0 m/s。`}
  ]}]
},
{ id:"step", tab:"④手順", title:"④ 手順固定の演習",
  intro:"波の計算は、グラフから正しい量を読むところで決まります。7ステップで進めます。",
  advice:"グラフの横軸を確かめてから、<i class='qv'>λ</i>・<i class='qv'>T</i> を読み、<i class='qv'>v</i> ＝ <i class='qv'>fλ</i> を使おう。",
  ref:{label:"7ステップを見る", html:STEPS},
  groups:[
  { title:"問題1（2つのグラフから速さを求める）", lead:"②読解ドリルの <i class='qv'>y</i>-<i class='qv'>x</i> グラフと <i class='qv'>y</i>-<i class='qv'>t</i> グラフは、同じ波についてのものである。", qs:[
    {id:"s11",type:"blanks",prompt:"ステップ1・2　それぞれのグラフから読める量",text:`${y}-${x} グラフからは{0}が、${y}-${t} グラフからは{1}が読める。`,
     options:[["波長","周期"],["波長","周期"]],answer:[0,1],explain:"横軸が距離なら波長、時間なら周期です。"},
    {id:"s12",type:"blanks",prompt:"ステップ3　既知・未知を整理する。",text:`${L} ＝ {0}　${T} ＝ {1}　${v} ＝ ？`,
     options:[["0.40 m","0.20 m","0.50 m"],["0.50 s","0.25 s","0.40 s"]],answer:[0,0],explain:"②の A・B で読んだ値です。"},
    {id:"s13",type:"choice",prompt:"ステップ4・5　速さを表す式はどれか。",options:[`${v} ＝ ${L} ÷ ${T}`,`${v} ＝ ${L}${T}`,`${v} ＝ ${T} ÷ ${L}`],answer:0,
     explain:`${v} ＝ ${f}${L} に ${f} ＝ 1/${T} を代入すると、${v} ＝ ${L}/${T}。`},
    {id:"s14",type:"num",prompt:"ステップ6　波の速さ",answer:0.80,tol:0.01,unit:"m/s",
     traps:{"0.2":"<i class='qv'>λ</i> × <i class='qv'>T</i> になっていませんか。","1.25":"<i class='qv'>T</i> ÷ <i class='qv'>λ</i> になっていませんか。","0.4":"<i class='qv'>λ</i> を 0.20 m（半波長）で読んでいませんか。"},
     explain:`${v} ＝ 0.40 ÷ 0.50 ＝ 0.80 m/s。`},
    {id:"s15",type:"choice",prompt:"ステップ7　確認：この波は 1 周期の間に何 m 進むか。",options:["0.40 m（1波長）","0.80 m","0.20 m"],answer:0,
     explain:"1周期の間に、波はちょうど1波長進みます。0.80 m/s × 0.50 s ＝ 0.40 m で一致します。"}
  ]},
  { title:"問題2（定常波）", quote:"長さ 1.2 m の弦の両端を固定して振動させたところ、腹が3つの定常波ができた。弦を伝わる波の速さは 40 m/s である。", qs:[
    {id:"s21",type:"num",prompt:"定常波の波長を求めよ。",answer:0.80,tol:0.01,unit:"m",
     traps:{"0.4":"腹1つ分（節と節の間）が半波長です。","1.2":"弦全体に半波長が3つ入っています。","3.6":"1.2 m ＝ 3 × (<i class='qv'>λ</i>/2) から <i class='qv'>λ</i> を求めます。"},
     explain:`腹が3つ ＝ 半波長が3つなので、1.2 ＝ 3 × ${L}/2、${L} ＝ 0.80 m。`},
    {id:"s22",type:"num",prompt:"弦の振動数を求めよ。",answer:50,tol:0.5,unit:"Hz",
     traps:{"32":"<i class='qv'>v</i> ＝ <i class='qv'>fλ</i> から <i class='qv'>f</i> ＝ <i class='qv'>v</i>/<i class='qv'>λ</i> です。"},explain:`${f} ＝ ${v}/${L} ＝ 40 ÷ 0.80 ＝ 50 Hz。`}
  ]},
  { title:"問題3（速さは媒質で決まる）", quote:"空気中を伝わる音の速さを 340 m/s とする。", qs:[
    {id:"s31",type:"num",prompt:"振動数 680 Hz の音の波長を求めよ。",answer:0.50,tol:0.005,unit:"m",
     traps:{"2":"<i class='qv'>λ</i> ＝ <i class='qv'>v</i>/<i class='qv'>f</i> です（<i class='qv'>f</i>/<i class='qv'>v</i> ではありません）。"},explain:`${L} ＝ ${v}/${f} ＝ 340 ÷ 680 ＝ 0.50 m。`},
    {id:"s32",type:"self",prompt:"同じ空気中で振動数を 2 倍にすると、波の速さと波長はそれぞれどうなるか。理由とともに答えよ。",
     model:"速さは媒質（空気）で決まるので変わらない。<i class='qv'>v</i> ＝ <i class='qv'>fλ</i> で <i class='qv'>v</i> が一定なので、振動数が2倍になると波長は半分になる。"},
    {id:"s33",type:"checklist",prompt:"解き終えたら点検しよう（採点には入りません）。",
     items:["グラフの横軸が <i class='qv'>x</i> か <i class='qv'>t</i> かを確かめた","山と山の間隔を読んだ（山と谷ではない）","振幅を中心から読んだ","長さの単位を m にそろえた","速さが媒質で決まることを使った"]}
  ]}]
},
{ id:"sum", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。グラフの種類と、使う関係を選びます。",
  advice:"グラフの種類の確認と、<i class='qv'>v</i> ＝ <i class='qv'>fλ</i>・<i class='qv'>f</i> ＝ 1/<i class='qv'>T</i> の使い分けを練習しよう。",
  groups:[{ title:"読み取りと関係を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"波長を読み取れるのはどちらのグラフか。",options:[`${y}-${x} グラフ`,`${y}-${t} グラフ`],answer:0,explain:"横軸が位置のグラフです。"},
    {id:"m2",type:"choice",prompt:"周期を読み取れるのはどちらのグラフか。",options:[`${y}-${x} グラフ`,`${y}-${t} グラフ`],answer:1,explain:"横軸が時間のグラフです。"},
    {id:"m3",type:"choice",prompt:"波の速さを決めているのは何か。",options:["媒質の種類や状態","振動数","振幅"],answer:0,
     explain:"振動数を変えると、速さではなく波長が変わります。"},
    {id:"m4",type:"choice",prompt:"定常波の、隣り合う節と節の間隔は？",options:[`${L}/2`,`${L}`,`${L}/4`],answer:0,explain:"腹1つ分が半波長です。"},
    {id:"m5",type:"blanks",prompt:"次の文を完成させよ。",text:"波が伝わるとき、移動するのは{0}であり、媒質は{1}。",
     options:[["振動の状態（エネルギー）","媒質"],["その場で振動するだけである","波と一緒に移動する"]],answer:[0,0],
     explain:"この見方が、横波・縦波・反射・定常波すべての土台です。"}
  ]}]
}
];

registerUnit({ id:"waves", title:"波の性質", sections: SECTIONS });
})();
