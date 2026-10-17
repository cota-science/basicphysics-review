/*
 * 単元：音
 * 音速と気温、音の3要素、うなり、弦の固有振動、気柱（閉管・開管）、共振（共鳴）。
 * 「端の条件（節か腹か）→ 長さと波長の関係 → v ＝ fλ」の手順を固定する。
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
const V = I("V"), v = I("v"), f = I("f"), L = I("λ"), l = I("L"), t = I("t"), n = I("n");
const f1 = Sb("f","1"), f2 = Sb("f","2");

/* 気柱の基本振動：定在波（定常波）の振幅の包絡線 */
const TUBES = (() => {
  const env = (x0, len, cy, a, fn) => {
    let up = [], dn = [];
    for(let i = 0; i <= 60; i++){ const X = x0 + len * i / 60, Y = a * fn(i / 60); up.push(`${X.toFixed(1)},${(cy - Y).toFixed(1)}`); dn.push(`${X.toFixed(1)},${(cy + Y).toFixed(1)}`); }
    return `<polyline points="${up.join(" ")}" fill="none" stroke="var(--blue)" stroke-width="2"/><polyline points="${dn.join(" ")}" fill="none" stroke="var(--blue)" stroke-width="2"/>`;
  };
  return `<svg class="graph" viewBox="0 0 320 170" role="img" aria-label="上は閉管の基本振動で、閉じた左端が節、開いた右端が腹。下は開管の基本振動で、両端が腹、中央が節。">
<text x="4" y="22" font-size="12" fill="currentColor">閉管</text>
<line x1="60" y1="30" x2="280" y2="30" stroke="currentColor" stroke-width="1.6"/><line x1="60" y1="70" x2="280" y2="70" stroke="currentColor" stroke-width="1.6"/>
<line x1="60" y1="28" x2="60" y2="72" stroke="currentColor" stroke-width="5"/>
${env(60, 220, 50, 16, u => Math.sin(Math.PI * u / 2))}
<text x="48" y="90" font-size="11" fill="var(--red)">節</text><text x="270" y="90" font-size="11" fill="var(--red)">腹</text>
<text x="4" y="112" font-size="12" fill="currentColor">開管</text>
<line x1="60" y1="118" x2="280" y2="118" stroke="currentColor" stroke-width="1.6"/><line x1="60" y1="158" x2="280" y2="158" stroke="currentColor" stroke-width="1.6"/>
${env(60, 220, 138, 16, u => Math.cos(Math.PI * u))}
<text x="50" y="114" font-size="11" fill="var(--red)">腹</text><text x="164" y="114" font-size="11" fill="var(--red)">節</text><text x="272" y="114" font-size="11" fill="var(--red)">腹</text>
</svg>`;
})();

const DEF_TABLE = `<div class="tbl"><table>
<colgroup><col style="width:6.6em"><col></colgroup>
<tr><th>用語</th><th>定義（記号・式・単位）</th></tr>
<tr><th colspan='2' style='text-align:left;background:var(--blue-soft)'>音の性質</th></tr>
<tr><td>音源</td><td>振動して音を出すもの（発音体）</td></tr>
<tr><td>音</td><td>空気などの媒質を伝わる縦波。真空中は伝わらない</td></tr>
<tr><td>音速</td><td>空気中の音の速さ。気温 ${t}〔℃〕が高いほど大きい<br><span style='color:var(--blue);font-weight:700'>${V} ＝ 331.5 ＋ 0.6${t}〔m/s〕</span></td></tr>
<tr><td>音の3要素</td><td>高さ ← 振動数、大きさ ← 振幅、音色 ← 波形</td></tr>
<tr><td>可聴音</td><td>人が聞くことのできる音。振動数はおよそ 20&nbsp;Hz〜20000&nbsp;Hz</td></tr>
<tr><td>超音波</td><td>振動数がおよそ 20000&nbsp;Hz より大きく、人の耳には聞こえない音</td></tr>
<tr><td>うなり</td><td>振動数がわずかに異なる2つの音が重なり、大きさが周期的に変わる現象<br><span style='color:var(--blue);font-weight:700'>1 s 間の回数 ＝ |${f1} − ${f2}|</span></td></tr>
<tr><th colspan='2' style='text-align:left;background:var(--blue-soft)'>固有振動</th></tr>
<tr><td>固有振動</td><td>弦や気柱などが、長さや端の条件で決まる特定の振動数で振動すること。このとき定在波（定常波）ができる</td></tr>
<tr><td>固有振動数</td><td>固有振動の振動数<br><span style='color:var(--blue);font-weight:700'>〔Hz〕</span></td></tr>
<tr><td>基本振動</td><td>固有振動のうち、振動数が最も小さい（腹の数が最も少ない）振動。その振動数が基本振動数<br><span style='color:var(--blue);font-weight:700'>${f}<sub>1</sub>〔Hz〕</span></td></tr>
<tr><td>倍振動</td><td>基本振動数の ${n} 倍の振動数をもつ固有振動（${n} 倍振動）。閉管では奇数倍だけが生じる<br><span style='color:var(--blue);font-weight:700'>${f}<sub>${n}</sub> ＝ ${n}${f}<sub>1</sub></span></td></tr>
<tr><td>共振（共鳴）</td><td>物体の固有振動数と同じ振動数で振動を与えると、大きく振動する現象</td></tr>
<tr><th colspan='2' style='text-align:left;background:var(--blue-soft)'>弦と気柱</th></tr>
<tr><td>弦の固有振動</td><td>両端が節の定在波（定常波）。長さ ${l} に半波長が ${n} 個入る<br><span style='color:var(--blue);font-weight:700'>${L} ＝ 2${l}/${n}、${f} ＝ ${n}${v}/(2${l})</span></td></tr>
<tr><td>気柱</td><td>管の中の空気の柱。閉じた端は変位の節、開いた端は変位の腹になる</td></tr>
<tr><td>閉管</td><td>一方の端が閉じた管。閉じた端が節、開いた端が腹。基本振動数の奇数倍の音だけが生じる<br><span style='color:var(--blue);font-weight:700'>基本振動：${l} ＝ ${L}/4</span></td></tr>
<tr><td>開管</td><td>両端が開いた管。両端が腹。基本振動数の整数倍の音が生じる<br><span style='color:var(--blue);font-weight:700'>基本振動：${l} ＝ ${L}/2</span></td></tr>
<tr><td>開口端補正</td><td>気柱の定在波（定常波）の腹が、管口より少し外側にできること。そのずれの長さ<br><span style='color:var(--blue);font-weight:700'>Δ${l}〔m〕</span></td></tr>
</table></div><p>この単元の問題では、とくに断りがなければ開口端補正を無視する。</p>`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th></tr>
<tr><td>音速 ${V}、弦を伝わる波の速さ ${v}</td><td>m/s</td></tr>
<tr><td>波長 ${L}、長さ ${l}</td><td>m</td></tr>
<tr><td>振動数 ${f}</td><td>Hz ＝ 1/s</td></tr>
<tr><td>気温 ${t}</td><td>℃</td></tr></table></div>`;
const STEPS = `<p>1 何が振動しているか（弦か気柱か） → 2 両端の条件（節か腹か）を決める → 3 定在波（定常波）を描き、長さと波長の関係を書く → 4 ${v} ＝ ${f}${L} を使う → 5 文字式で解く → 6 単位をそろえて代入 → 7 妥当性（音の高さの感覚と合うか）</p>`;
const TF = ["正しい","誤り"];
const UNITQ = ["m/s（速さ）","m（長さ・波長）","Hz（振動数）","s（時間）"];
const LAM = ["2<i class='qv'>L</i>","4<i class='qv'>L</i>","<i class='qv'>L</i>","<i class='qv'>L</i>/2"];

/* アニメーションへのボタン型リンク */
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;
const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:`音は空気を伝わる縦波です。「高い・大きい・音色」がそれぞれどの量に対応するかを正確に覚えます。<br>アニメーションで確かめよう：<br>${ANIM("anim/longitudinal.html","縦波（疎密波）")}${ANIM("anim/string.html","弦の固有振動")}${ANIM("anim/air-column.html","気柱の固有振動")}${ANIM("anim/beats.html","うなり")}${ANIM("anim/timbre.html#add","音色と波形（倍音を重ねる）")}${ANIM("anim/timbre.html#mic","声の波形を見る（マイク）")}${ANIM("anim/timbre.html#vowel","母音を合成する")}${ANIM("anim/hearing.html","可聴域を調べる")}`,
  advice:"音の3要素の対応と、弦・閉管・開管の端の条件（節か腹か）を覚え直そう。",
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"blanks",text:"音は{0}で、真空中を{1}。",options:[["縦波","横波"],["伝わらない","伝わる"]],answer:[0,0],
     explain:"音は媒質の疎密が伝わる縦波なので、媒質のない真空中は伝わりません。"},
    {id:"d2",type:"choice",prompt:`音速の式 ${V} ＝ 331.5 ＋ 0.6${t} の ${t} は何か。`,options:["気温〔℃〕","時間〔s〕","絶対温度〔K〕"],answer:0,
     explain:"気温（セルシウス温度）です。時間の <i class='qv'>t</i> と取り違えないこと。"},
    {id:"d3",type:"blanks",text:"音の高さは{0}で、大きさは{1}で、音色は{2}で決まる。",
     options:[["振動数","振幅","波形"],["振動数","振幅","波形"],["振動数","振幅","波形"]],answer:[0,1,2],explain:"音の3要素です。"},
    {id:"d4",type:"choice",prompt:"人が聞くことのできる音の振動数の範囲は、およそどれか。",
     options:["20 Hz〜20000 Hz","2 Hz〜2000 Hz","200 Hz〜200000 Hz"],answer:0,explain:"20000 Hz より高い音を超音波といいます。"},
    {id:"d5",type:"choice",prompt:`振動数 ${f1}, ${f2} の2つの音によるうなりの、1 s 間の回数は？`,
     options:[`|${f1} − ${f2}|`,`${f1} ＋ ${f2}`,`(${f1} ＋ ${f2})/2`],answer:0,explain:"振動数の差が小さいほど、うなりはゆっくりになります。"},
    {id:"d6",type:"blanks",text:"両端を固定した弦では、両端が{0}になる。閉管では閉じた端が{1}、開いた端が{2}になる。",
     options:[["節","腹"],["節","腹"],["節","腹"]],answer:[0,0,1],explain:"固定された端・閉じた端は動けないので節、開いた端は自由に動けるので腹です。"},
    {id:"d7",type:"choice",prompt:"閉管で生じる音の振動数はどれか。",options:["基本振動数の奇数倍だけ","基本振動数の整数倍","基本振動数の偶数倍だけ"],answer:0,
     explain:`閉管には ${L}/4 の奇数倍の長さの定在波（定常波）しかできません。`},
    {id:"d8",type:"choice",prompt:"共振（共鳴）とは何か。",
     options:["固有振動数と同じ振動数で振動を与えると、大きく振動する現象","2つの音が重なって大きさが変わる現象","音が壁で反射して戻ってくる現象"],answer:0,
     explain:"2つ目はうなり、3つ目は反射（こだま）です。"}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル",
  intro:"日常の言葉で表される音の性質を、物理量に置き換えます。気柱の図で、長さと波長の関係を読みます。",
  advice:"「高い・大きい・音色」を物理量に直すこと、端が節か腹かを図で確かめることを練習しよう。",
  groups:[
  { title:"A. 日常の言葉を物理量にする", lead:`答えたら確かめよう：${ANIM("anim/timbre.html#add","倍音を重ねて音色をつくる")}${ANIM("anim/hearing.html","可聴域を調べる")}`, qs:[
    {id:"ra1",type:"choice",prompt:"「音が高い」とは、どの量が大きいことか。",options:["振動数","振幅","速さ"],answer:0,explain:"高さは振動数で決まります。"},
    {id:"ra2",type:"choice",prompt:"「音が大きい」とは、どの量が大きいことか。",options:["振動数","振幅","波長"],answer:1,explain:"大きさは振幅で決まります。"},
    {id:"ra3",type:"choice",prompt:"ピアノとギターで同じ高さの音を出しても聞き分けられるのは、何が違うからか。",options:["波形","振動数","速さ"],answer:0,
     explain:"同じ高さ（同じ振動数）でも、波形が違うと音色が違います。"}
  ]},
  { title:"B. 正しいか、誤りか", qs:[
    {id:"rb1",type:"choice",prompt:"気温が高いほど、音は速く伝わる。",options:TF,answer:0,explain:"正しい。1 ℃ 上がるごとに約 0.6 m/s 速くなります。"},
    {id:"rb2",type:"choice",prompt:"高い音ほど速く伝わる。",options:TF,answer:1,explain:"誤り。音速は振動数によりません（媒質と気温で決まります）。"},
    {id:"rb3",type:"choice",prompt:"2つの音の振動数の差が大きいほど、1 s 間のうなりの回数は多い。",options:TF,answer:0,explain:"正しい。回数は振動数の差に等しくなります。"},
    {id:"rb4",type:"choice",prompt:"同じ弦を短くして弾くと、音は高くなる。",options:TF,answer:0,
     explain:"正しい。波長が短くなり、弦を伝わる波の速さは同じなので、振動数が大きくなります。"},
    {id:"rb5",type:"choice",prompt:"長さが同じなら、閉管と開管の基本振動数は等しい。",options:TF,answer:1,
     explain:"誤り。閉管の基本振動の波長は 4<i class='qv'>L</i>、開管は 2<i class='qv'>L</i> なので、閉管の基本振動数は開管の半分です。"},
    {id:"rb6",type:"choice",prompt:"音は水中でも伝わる。",options:TF,answer:0,explain:"正しい。水中では空気中より速く伝わります。"}
  ]},
  { title:"C. 気柱の定在波（定常波）の図を読む", lead:"長さ <i class='qv'>L</i> の閉管と開管の基本振動を表した図。空気の粒子の動きは <a href='anim/air-column.html' style='color:var(--blue);font-weight:700'>気柱の固有振動のアニメーション</a> で確かめられる。", figure:TUBES, qs:[
    {id:"rc1",type:"choice",prompt:"閉管の基本振動で、管の長さ <i class='qv'>L</i> は波長の何倍か。",options:["1/4 倍","1/2 倍","1 倍"],answer:0,
     explain:"節から隣の腹までの間隔は <i class='qv'>λ</i>/4。図の閉管にはちょうどその長さが入っています。"},
    {id:"rc2",type:"choice",prompt:"開管の基本振動で、管の長さ <i class='qv'>L</i> は波長の何倍か。",options:["1/4 倍","1/2 倍","1 倍"],answer:1,
     explain:"腹から腹までの間隔（節を1つ挟む）は <i class='qv'>λ</i>/2 です。"},
    {id:"rc3",type:"choice",prompt:"同じ長さの閉管と開管では、基本振動の音はどちらが高いか。",options:["開管","閉管","同じ"],answer:0,
     explain:"開管は波長が短い（2<i class='qv'>L</i>）ので振動数が大きく、音が高くなります。"},
    {id:"rc4",type:"choice",prompt:"実際の気柱では、開いた端の腹は管口より少し外側にできる（開口端補正）。これを考えると、閉管の基本振動数は、補正を無視して計算した値と比べてどうなるか。",
     options:["少し低くなる","少し高くなる","変わらない"],answer:0,
     explain:"腹が外にはみ出す分だけ、定在波（定常波）にとっての管の長さが長くなります（<i class='qv'>L</i> ＋ Δ<i class='qv'>L</i>）。波長 4(<i class='qv'>L</i> ＋ Δ<i class='qv'>L</i>) が長くなるので、振動数は少し低くなります。"},
    {id:"rc5",type:"self",prompt:"開いた端の腹が、管口ちょうどではなく、管口より少し外側にできるのはなぜか。管口のすぐ外の空気がどう動くかに注目して説明せよ。（ヒント：管口の外の空気は、まったく動かないだろうか。）",
     model:"管の中の空気が振動すると、管口のすぐ外の空気も押し出されたり引き戻されたりして、いっしょに振動する。管の外の空気が自由に広がって、圧力がまわりの大気圧と等しくなる（空気が最も自由に動ける）のは、管口から少し外へ出た所である。そのため、変位の腹は管口より少し外側にでき、定在波（定常波）は管が少し長くなったかのようにふるまう。いっしょに動く外の空気は管が太いほど多いので、はみ出す長さ（開口端補正）は管の半径が大きいほど大きい（およそ半径の 0.6 倍）。"}
  ]},
  { title:"D. こだまを読む", lead:"崖に向かって音を出したら、2.0 s 後にこだまが聞こえた。音速を <i class='qv'>V</i> とする。", qs:[
    {id:"rd1",type:"choice",prompt:"崖までの距離を表す式はどれか。",options:[`${V} × 2.0 ÷ 2`,`${V} × 2.0`,`${V} ÷ 2.0`],answer:0,
     explain:"音は崖までを往復しているので、片道の距離は全体の半分です。"}
  ]}]
},
{ id:"dim", tab:"③次元", title:"③ 次元チェック",
  intro:"振動数・波長・長さ・速さの単位を組み合わせて、弦や気柱の式を確かめます。",
  advice:"長さの単位を m にそろえてから代入し、<i class='qv'>f</i> ＝ <i class='qv'>v</i>/<i class='qv'>λ</i> の単位が Hz になるか確かめよう。",
  ref:{label:"単位の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", qs:[
    {id:"da1",type:"choice",prompt:`${V} × ${I("t")}（${I("t")} は時間〔s〕）`,options:UNITQ,answer:1,two:true,explain:"(m/s) × s ＝ m。音が進む距離です。"},
    {id:"da2",type:"choice",prompt:`${v} ÷ (2${l})`,options:UNITQ,answer:2,two:true,explain:"(m/s) ÷ m ＝ 1/s ＝ Hz。弦の基本振動数です。"},
    {id:"da3",type:"choice",prompt:`1 ÷ (${f1} − ${f2})`,options:UNITQ,answer:3,two:true,explain:"1 ÷ Hz ＝ s。うなりが1回起きる時間（うなりの周期）です。"},
    {id:"da4",type:"choice",prompt:`4${l}`,options:UNITQ,answer:1,two:true,explain:"閉管の基本振動の波長です。"}
  ]},
  { title:"B. 式の単位を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、単位が合わないものをすべて選べ。",
     options:[`${f} ＝ ${v}/(2${l})`,`${f} ＝ 2${l}/${v}`,`${L} ＝ 4${l}`,`${f} ＝ 2${l}${v}`,`${f} ＝ ${f1} − ${f2}`],answer:[1,3],
     explain:`2${l}/${v} の単位は s、2${l}${v} の単位は m²/s で、どちらも振動数になりません。`},
    {id:"db2",type:"choice",prompt:`音速の式 ${V} ＝ 331.5 ＋ 0.6${t} の 0.6 の単位はどれか。`,options:["m/(s·℃)","m/s","単位はない"],answer:0,
     explain:`0.6${t} が m/s になるには、0.6 の単位は m/(s·℃) でなければなりません。足し算できるのは同じ単位どうしです。`}
  ]},
  { title:"C. 答案の誤りを見つける", lead:"問「長さ 50 cm の弦を伝わる波の速さが 200 m/s のとき、基本振動数を求めよ。」",
    quote:`答案：${f} ＝ ${v}/(2${l}) ＝ 200 ÷ (2 × 50) ＝ 2.0 Hz`, qs:[
    {id:"dc1",type:"choice",prompt:"この答案の誤りはどれか。",options:["長さを cm のまま代入している","式は <i class='qv'>f</i> ＝ 2<i class='qv'>L</i>/<i class='qv'>v</i> であるべき","2 で割る必要はない"],answer:0,
     explain:"速さが m/s なので、長さも m（0.50 m）にそろえます。"},
    {id:"dc2",type:"num",prompt:"正しい基本振動数を求めよ。",answer:200,tol:1,unit:"Hz",
     traps:{"2":"長さを 0.50 m に直して代入します。","400":"基本振動では 2<i class='qv'>L</i> で割ります。"},explain:`${f} ＝ 200 ÷ (2 × 0.50) ＝ 200 Hz。`}
  ]}]
},
{ id:"step", tab:"④手順", title:"④ 手順固定の演習",
  intro:"弦や気柱の問題は、端の条件から定在波（定常波）を描けば、長さと波長の関係が決まります。",
  advice:"端が節か腹かを先に決め、図を描いてから長さと波長の関係を書こう。",
  ref:{label:"7ステップを見る", html:STEPS},
  groups:[
  { title:"問題1（弦・すべてのステップ）", lead:"張力・線密度・長さを変えたときの振動は <a href='anim/string.html' style='color:var(--blue);font-weight:700'>弦の固有振動のアニメーション</a> で確かめられる。", quote:"長さ 0.50 m の弦の両端を固定してはじいた。弦を伝わる波の速さは 200 m/s である。", qs:[
    {id:"s11",type:"blanks",prompt:"ステップ2　両端の条件",text:"弦の両端は{0}になる。",options:[["節","腹"]],answer:[0],explain:"固定された端は振動できません。"},
    {id:"s12",type:"choice",prompt:"ステップ3　基本振動で、弦の長さと波長の関係は？",options:[`${l} ＝ ${L}/2`,`${l} ＝ ${L}/4`,`${l} ＝ ${L}`],answer:0,
     explain:"両端が節で、間に腹が1つ。節と節の間隔は半波長です。"},
    {id:"s13",type:"num",prompt:"ステップ4〜6　基本振動の波長",answer:1.0,tol:0.01,unit:"m",traps:{"0.25":"<i class='qv'>L</i> ＝ <i class='qv'>λ</i>/2 です。","0.5":"弦の長さは半波長です。"},
     explain:`${L} ＝ 2${l} ＝ 1.0 m。`},
    {id:"s14",type:"num",prompt:"基本振動数",answer:200,tol:1,unit:"Hz",traps:{"100":"<i class='qv'>f</i> ＝ <i class='qv'>v</i>/<i class='qv'>λ</i> ＝ 200 ÷ 1.0 です。"},explain:`${f} ＝ ${v}/${L} ＝ 200 ÷ 1.0 ＝ 200 Hz。`},
    {id:"s15",type:"num",prompt:"ステップ7　腹が2つの振動（2倍振動）の振動数",answer:400,tol:1,unit:"Hz",
     traps:{"100":"腹が増えると波長は短く、振動数は大きくなります。"},explain:`${L} ＝ ${l} ＝ 0.50 m、${f} ＝ 200 ÷ 0.50 ＝ 400 Hz。基本振動数の2倍です。`}
  ]},
  { title:"問題2（気柱）", lead:"閉管・開管、気温、開口端補正の影響は <a href='anim/air-column.html' style='color:var(--blue);font-weight:700'>気柱の固有振動のアニメーション</a> で確かめられる。", quote:"長さ 0.17 m の管がある。音速を 340 m/s とし、開口端補正は無視する。", qs:[
    {id:"s21",type:"num",prompt:"一端を閉じた閉管としたとき、基本振動数を求めよ。",answer:500,tol:2,unit:"Hz",
     traps:{"1000":"閉管の基本振動の波長は 4<i class='qv'>L</i> です。","2000":"<i class='qv'>λ</i> ＝ 4<i class='qv'>L</i> ＝ 0.68 m を使います。"},
     explain:`${L} ＝ 4 × 0.17 ＝ 0.68 m、${f} ＝ 340 ÷ 0.68 ＝ 500 Hz。`},
    {id:"s22",type:"num",prompt:"同じ閉管で、基本振動の次に高い固有振動数を求めよ。",answer:1500,tol:5,unit:"Hz",
     traps:{"1000":"閉管には偶数倍の振動は生じません。"},explain:"閉管は奇数倍だけなので、次は3倍振動の 1500 Hz。"},
    {id:"s23",type:"num",prompt:"両端を開いた開管としたとき、基本振動数を求めよ。",answer:1000,tol:3,unit:"Hz",
     traps:{"500":"開管の基本振動の波長は 2<i class='qv'>L</i> です。"},explain:`${L} ＝ 2 × 0.17 ＝ 0.34 m、${f} ＝ 340 ÷ 0.34 ＝ 1000 Hz。`},
    {id:"s24",type:"self",prompt:"閉管で、基本振動数の偶数倍の音が生じない理由を説明せよ。",
     model:"閉管では閉じた端が節、開いた端が腹でなければならない。管の長さには <i class='qv'>λ</i>/4 の奇数倍しか入らないので、振動数は基本振動数の奇数倍だけになる。"}
  ]},
  { title:"問題3（音速・こだま・うなり）", lead:"うなりは <a href='anim/beats.html' style='color:var(--blue);font-weight:700'>うなりのアプリ</a> で、2つの音を実際に鳴らして確かめられる。", qs:[
    {id:"s31",type:"num",prompt:"気温 15 ℃ のときの音速を、小数第1位まで求めよ。",answer:340.5,tol:0.05,unit:"m/s",
     traps:{"331.5":"0.6<i class='qv'>t</i> の項を加えます。","340":"小数第1位まで求めよう。"},explain:`${V} ＝ 331.5 ＋ 0.6 × 15 ＝ 340.5 m/s。`},
    {id:"s32",type:"num",prompt:"この気温で崖に向かって音を出したら、2.0 s 後にこだまが聞こえた。崖までの距離はおよそ何 m か（有効数字2桁）。",answer:340,tol:2,unit:"m",
     traps:{"681":"音は往復しています。片道の距離を求めます。","680":"音は往復しています。片道の距離を求めます。"},
     explain:"340.5 × 2.0 ÷ 2 ＝ 340.5 ≒ 3.4 × 10² m。"},
    {id:"s33",type:"num",prompt:"440 Hz と 442 Hz のおんさを同時に鳴らしたとき、1 s 間に聞こえるうなりの回数は？",answer:2,tol:0.01,unit:"回",
     traps:{"882":"うなりの回数は振動数の差です。"},explain:"|442 − 440| ＝ 2 回。楽器の調律では、うなりが消えるように合わせます。"},
    {id:"s34",type:"checklist",prompt:"解き終えたら点検しよう（採点には入りません）。",
     items:["何が振動しているか（弦か気柱か）を確かめた","端が節か腹かを決めて図を描いた","長さと波長の関係を式にした","長さの単位を m にそろえた","こだまでは往復を考えた"]}
  ]}]
},
{ id:"sum", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。端の条件から、長さと波長の関係を選びます（長さを <i class='qv'>L</i> とする）。",
  advice:"弦・閉管・開管それぞれの基本振動の波長を、図を描いて確かめよう。",
  groups:[{ title:"関係を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"両端を固定した弦の基本振動の波長は？",options:LAM,answer:0,explain:"両端が節で、半波長が1つ入ります。"},
    {id:"m2",type:"choice",prompt:"閉管の基本振動の波長は？",options:LAM,answer:1,explain:"節から腹までの <i class='qv'>λ</i>/4 が1つ入ります。"},
    {id:"m3",type:"choice",prompt:"開管の基本振動の波長は？",options:LAM,answer:0,explain:"両端が腹で、半波長が1つ入ります。"},
    {id:"m4",type:"choice",prompt:"気温が上がると、同じ気柱の共鳴振動数はどうなるか。",options:["高くなる","低くなる","変わらない"],answer:0,
     explain:"波長は管の長さで決まり変わりませんが、音速が大きくなるので振動数は大きくなります。"},
    {id:"m5",type:"blanks",prompt:"次の文を完成させよ。",text:"音の高さは{0}、大きさは{1}で決まり、音速は{2}によって変わる。",
     options:[["振動数","振幅","気温"],["振動数","振幅","気温"],["振動数","振幅","気温"]],answer:[0,1,2],explain:"音速は振動数や振幅にはよりません。"}
  ]}]
}
];

registerUnit({ id:"sound", title:"音", sections: SECTIONS });
})();
