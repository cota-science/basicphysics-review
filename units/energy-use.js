/*
 * 単元：エネルギーとその利用
 * エネルギーの変換と保存、変換効率、発電、原子と原子核、放射線（α・β・γ）、
 * 崩壊、半減期、放射線の単位（Bq・Gy・Sv）、核分裂、エネルギー資源（化石燃料・原子力・再生可能エネルギー）。
 * 質量とエネルギーの等価性（E ＝ mc²）は物理の範囲なので「発展」として扱う。
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
const E = I("E"), m = I("m"), c = I("c"), N = I("N"), t = I("t"), Z = I("Z"), A = I("A");
const N0 = Sb("N","0"), Th = Sb("T","½");
const SI = s => `<tspan font-style="italic" font-family="Times New Roman,Times,serif">${s}</tspan>`;

/* 半減期 8.0 日の放射性原子核の数の変化 */
const DECAY = (() => {
  const X = d => 40 + d * 8, Y = r => 150 - 120 * r;
  let pts = [];
  for(let d = 0; d <= 32; d += 0.5) pts.push(`${X(d).toFixed(1)},${Y(Math.pow(0.5, d / 8)).toFixed(1)}`);
  let grid = "";
  [8, 16, 24, 32].forEach(d => grid += `<line x1="${X(d)}" y1="150" x2="${X(d)}" y2="${Y(Math.pow(0.5, d/8))}" stroke="currentColor" stroke-dasharray="3 3" opacity=".5"/><text x="${X(d) - 6}" y="164" font-size="10" fill="currentColor">${d}</text>`);
  [[1,"1"],[0.5,"1/2"],[0.25,"1/4"],[0.125,"1/8"]].forEach(([r,lab]) => grid += `<line x1="40" y1="${Y(r)}" x2="${X(Math.log2(1/r) * 8)}" y2="${Y(r)}" stroke="currentColor" stroke-dasharray="3 3" opacity=".5"/><text x="12" y="${Y(r) + 4}" font-size="10" fill="currentColor">${lab}</text>`);
  return `<svg class="graph" viewBox="0 0 320 175" role="img" aria-label="放射性原子核の数の割合と経過時間のグラフ。8日ごとに半分になり、32日後には16分の1になる。">
<line x1="40" y1="150" x2="306" y2="150" stroke="currentColor" stroke-width="1.2"/>
<line x1="40" y1="156" x2="40" y2="14" stroke="currentColor" stroke-width="1.2"/>
${grid}
<polyline points="${pts.join(" ")}" fill="none" stroke="var(--blue)" stroke-width="2.6"/>
<text x="46" y="14" font-size="11" fill="currentColor">${SI("N")}/${SI("N")}₀</text><text x="262" y="174" font-size="11" fill="currentColor">経過日数</text>
</svg>`;
})();

const DEF_TABLE = `<div class="tbl"><table>
<tr><th>用語</th><th>定義</th><th>式・単位</th></tr>
<tr><td>エネルギー保存の法則</td><td>エネルギーは形を変えても、全体の量は変わらない</td><td>―</td></tr>
<tr><td>変換効率</td><td>投入したエネルギーのうち、目的のエネルギーに変換された割合。必ず 1（100%）より小さい</td><td>効率 ＝ 目的のエネルギー ÷ 投入したエネルギー</td></tr>
<tr><td>一次エネルギー</td><td>自然界にあるままの形のエネルギー資源（化石燃料、ウラン、水力、太陽光、風力など）。電気は二次エネルギー</td><td>―</td></tr>
<tr><td>化石燃料</td><td>石炭・石油・天然ガス。大昔の生物の遺骸からできた。量に限りがあり、燃やすと二酸化炭素を出す</td><td>―</td></tr>
<tr><td>再生可能エネルギー</td><td>太陽光・風力・水力・地熱・バイオマスなど、自然の中でくり返し補われ、使ってもなくならないエネルギー</td><td>―</td></tr>
<tr><td>原子力発電</td><td>ウランの核分裂で発生する熱で水蒸気をつくり、タービンを回して発電する。発電時に二酸化炭素をほとんど出さないが、放射性廃棄物の処理と安全管理が課題</td><td>―</td></tr>
<tr><td>原子核</td><td>陽子と中性子（まとめて核子）からできている</td><td>―</td></tr>
<tr><td>原子番号・質量数</td><td>原子番号は陽子の数、質量数は陽子の数と中性子の数の和</td><td>${Z}、${A}</td></tr>
<tr><td>同位体</td><td>陽子の数（原子番号）が同じで、中性子の数（質量数）が異なる原子</td><td>―</td></tr>
<tr><td>放射線</td><td>α線（ヘリウム原子核の流れ）、β線（電子の流れ）、γ線（波長の短い電磁波）など。物質を電離するはたらきがある</td><td>透過力：γ ＞ β ＞ α</td></tr>
<tr><td>放射能</td><td>原子核が放射線を出す性質。放射線そのものとは区別する</td><td>―</td></tr>
<tr><td>崩壊</td><td>原子核が放射線を出して別の原子核に変わること。α崩壊では質量数が 4、原子番号が 2 減る。β崩壊では原子番号が 1 増える</td><td>―</td></tr>
<tr><td>半減期</td><td>放射性原子核の数が、もとの半分になるまでの時間</td><td>${N} ＝ ${N0}(1/2)^(${t}/${Th})</td></tr>
<tr><td>放射線の単位</td><td>Bq：1 s 間に崩壊する原子核の数（放射能の強さ）。Gy：物質 1 kg が吸収したエネルギー（吸収線量）。Sv：人体への影響を考えた線量</td><td>Gy ＝ J/kg</td></tr>
<tr><td>核分裂</td><td>ウランなどの重い原子核が分裂する現象。1回の分裂で、化学反応よりはるかに大きなエネルギーが放出される。<span style='color:var(--muted)'>（発展：反応後の質量がわずかに減り、その分がエネルギーになる。${E} ＝ ${m}${c}²）</span></td><td>―</td></tr>
</table></div>`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th></tr>
<tr><td>エネルギー ${E}</td><td>J</td></tr>
<tr><td>電力（仕事率）</td><td>W ＝ J/s</td></tr>
<tr><td>放射能の強さ</td><td>Bq（1 s 間あたりの崩壊数）</td></tr>
<tr><td>吸収線量</td><td>Gy ＝ J/kg</td></tr>
<tr><td>変換効率</td><td>単位なし（% で表すことが多い）</td></tr></table></div>`;
const STEPS = `<p>1 エネルギーの流れ（投入 → 目的のエネルギー ＋ 失われるエネルギー）を図にする → 2 目的のエネルギーを決める → 3 効率 ＝ 目的 ÷ 投入 → 4 半減期では「経過時間 ÷ 半減期 ＝ 半分になった回数」 → 5 残る割合 ＝ (1/2)^回数 → 6 単位をそろえて代入 → 7 妥当性（効率は 1 より小さいか）</p>`;
const TF = ["正しい","誤り"];
const ADV = `<span style='display:inline-block;font-size:12px;font-weight:700;color:var(--blue);border:1px solid var(--blue);border-radius:4px;padding:0 5px;margin-left:4px;vertical-align:1px'>発展</span>`;
const UNITQ = ["W（電力）","J（エネルギー）","Gy（吸収線量）","Bq（放射能の強さ）"];
const RAYS = ["α線","β線","γ線"];
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;

const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:`エネルギーの変換と、原子核・放射線の用語を正確に覚えます。似た用語（放射線と放射能、Gy と Sv）の違いに注意します。<br>アニメーションで確かめよう：<br>${ANIM("anim/nuclear.html#rays","放射線の種類と性質")}${ANIM("anim/nuclear.html#rays-mag","磁場の中の放射線")}${ANIM("anim/nuclear.html#decay","崩壊と半減期")}${ANIM("anim/nuclear.html#fission","核分裂と連鎖反応")}${ANIM("anim/nuclear.html#fusion","核融合")}`,
  advice:"変換効率の定義、原子番号と質量数、放射線の種類と単位の違いを覚え直そう。",
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"choice",prompt:"エネルギーが別の形に変換されるとき、全体の量はどうなるか。",options:["変わらない","少しずつ減る","少しずつ増える"],answer:0,
     explain:"エネルギー保存の法則。失われたように見えるエネルギーも、熱などの形で存在しています。"},
    {id:"d2",type:"choice",prompt:"変換効率の定義はどれか。",options:["目的のエネルギー ÷ 投入したエネルギー","投入したエネルギー ÷ 目的のエネルギー","失われたエネルギー ÷ 投入したエネルギー"],answer:0,
     explain:"効率は必ず 1（100%）より小さくなります。"},
    {id:"d3",type:"blanks",text:"原子核は{0}と{1}からできている。",options:[["陽子","中性子","電子"],["陽子","中性子","電子"]],answer:[0,1],
     explain:"電子は原子核のまわりにあり、原子核には含まれません。"},
    {id:"d4",type:"blanks",text:"原子番号は{0}の数で、質量数は{1}である。",
     options:[["陽子","中性子","電子"],["陽子と中性子の数の和","陽子と電子の数の和","中性子の数"]],answer:[0,0],explain:"質量数は核子（陽子と中性子）の数です。"},
    {id:"d5",type:"choice",prompt:"同位体とは何か。",options:["陽子の数が同じで、中性子の数が異なる原子","中性子の数が同じで、陽子の数が異なる原子","質量数が同じで、原子番号が異なる原子"],answer:0,
     explain:"陽子の数が同じなので、化学的な性質はほぼ同じです。"},
    {id:"d6",type:"blanks",text:"α線の正体は{0}、β線の正体は{1}、γ線の正体は{2}である。",
     options:[["ヘリウム原子核","電子","電磁波"],["ヘリウム原子核","電子","電磁波"],["ヘリウム原子核","電子","電磁波"]],answer:[0,1,2],
     explain:"α線とβ線は粒子の流れ、γ線は波長の短い電磁波です。"},
    {id:"d7",type:"choice",prompt:"物質を通り抜ける能力（透過力）の大きい順に並べたものはどれか。",options:["γ線 ＞ β線 ＞ α線","α線 ＞ β線 ＞ γ線","β線 ＞ γ線 ＞ α線"],answer:0,
     explain:"α線は紙1枚で、β線は薄い金属板で止まりますが、γ線を止めるには厚い鉛やコンクリートが必要です。電離作用は逆に α線が最も強い。"},
    {id:"d8",type:"choice",prompt:"半減期とは何か。",options:["放射性原子核の数が半分になるまでの時間","放射線がすべて出つくすまでの時間の半分","放射線の強さが 0 になるまでの時間"],answer:0,
     explain:"半減期ごとに半分、半分と減っていき、0 にはなりません。"},
    {id:"d9",type:"blanks",text:"放射能の強さの単位は{0}、物質が吸収したエネルギー（吸収線量）の単位は{1}、人体への影響を表す線量の単位は{2}である。",
     options:[["Bq","Gy","Sv"],["Bq","Gy","Sv"],["Bq","Gy","Sv"]],answer:[0,1,2],explain:"Bq は放射線を出す側、Gy と Sv は受ける側についての単位です。"}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル",
  intro:"日常で耳にする言葉を、物理の定義に照らして正しく読みます。",
  advice:"「放射線」と「放射能」、「Gy」と「Sv」の違いを定義に戻って確かめよう。",
  groups:[
  { title:"A. 正しいか、誤りか", qs:[
    {id:"ra1",type:"choice",prompt:"エネルギーは、変換されるたびに一部が消えてなくなる。",options:TF,answer:1,
     explain:"誤り。全体の量は保存されます。一部が熱などの利用しにくい形で周囲に散らばるだけです。"},
    {id:"ra2",type:"choice",prompt:"「放射線」と「放射能」は同じ意味である。",options:TF,answer:1,
     explain:"誤り。放射線は放出される粒子や電磁波、放射能は放射線を出す性質（能力）です。"},
    {id:"ra3",type:"choice",prompt:"半減期の2倍の時間がたつと、放射性原子核はすべてなくなる。",options:TF,answer:1,explain:"誤り。半分の半分で、1/4 が残ります。"},
    {id:"ra4",type:"choice",prompt:"γ線は電荷をもたない。",options:TF,answer:0,explain:"正しい。γ線は電磁波なので電荷をもちません。"},
    {id:"ra5",type:"choice",prompt:"自然界にも放射線は存在する。",options:TF,answer:0,explain:"正しい。宇宙や大地、食物などから、自然放射線を受けています。"},
    {id:"ra6",type:"choice",prompt:"同じ吸収線量（Gy）なら、放射線の種類によらず人体への影響（Sv）は同じである。",options:TF,answer:1,
     explain:"誤り。同じエネルギーを吸収しても、放射線の種類によって影響が異なるので、Sv で表します。"}
  ]},
  { title:"B. 半減期のグラフを読む", lead:`ある放射性原子核の数 <i class='qv'>N</i> の、はじめの数 <i class='qv'>N</i>₀ に対する割合と経過日数の関係。${ANIM("anim/nuclear.html#decay-i131","半減期 8.0 日（ヨウ素 131）のシミュレーション")}`, figure:DECAY, qs:[
    {id:"rb1",type:"num",prompt:"この原子核の半減期を読め。",answer:8,tol:0.1,unit:"日",traps:{"16":"割合が 1/2 になるまでの時間を読みます。"},explain:"割合が 1/2 になるのは 8 日後です。"},
    {id:"rb2",type:"choice",prompt:"24 日後に残っている割合はどれか。",options:["1/8","1/3","1/6"],answer:0,
     explain:"24 ÷ 8 ＝ 3 回半分になるので、(1/2)³ ＝ 1/8。"},
    {id:"rb3",type:"choice",prompt:"0 日から 8 日の間と、8 日から 16 日の間で、減った原子核の数を比べるとどうか。",options:["0〜8 日のほうが多い","同じ","8〜16 日のほうが多い"],answer:0,
     explain:"減る割合はどちらも半分ですが、もとの数が違うので、減る数は前半のほうが多くなります。"}
  ]},
  { title:"C. 崩壊を読む", lead:`${ANIM("anim/nuclear.html#decay-ra226","α崩壊（ラジウム 226）")}${ANIM("anim/nuclear.html#decay-c14","β崩壊（炭素 14）")}`, qs:[
    {id:"rc1",type:"blanks",prompt:"α崩壊（ヘリウム原子核を放出）",text:"質量数は{0}減り、原子番号は{1}減る。",options:[["4","2","1"],["4","2","1"]],answer:[0,1],
     explain:"ヘリウム原子核は陽子2個と中性子2個からできています。"},
    {id:"rc2",type:"choice",prompt:"β崩壊（原子核内の中性子が陽子に変わり、電子を放出）では、どうなるか。",options:["原子番号が 1 増え、質量数は変わらない","原子番号が 1 減り、質量数も 1 減る","原子番号も質量数も変わらない"],answer:0,
     explain:"陽子が1個増えるので原子番号が1増えます。核子の数は変わらないので、質量数は同じです。"}
  ]},
  { title:"D. エネルギーの流れを読む", lead:"火力発電所では、燃料を燃やして水蒸気をつくり、タービンを回して発電する。", qs:[
    {id:"rd1",type:"blanks",prompt:"エネルギーの変換の順",text:"{0} → {1} → {2} → 電気エネルギー",
     options:[["化学エネルギー","熱エネルギー","運動エネルギー"],["化学エネルギー","熱エネルギー","運動エネルギー"],["化学エネルギー","熱エネルギー","運動エネルギー"]],answer:[0,1,2],
     explain:"燃料の化学エネルギーが燃焼で熱に、水蒸気がタービンを回して運動エネルギーに、発電機で電気エネルギーに変わります。"}
  ]},
  { title:"E. エネルギー資源を比べる", lead:"発電に使うエネルギー資源には、それぞれ長所と課題がある。", qs:[
    {id:"re1",type:"multi",prompt:"再生可能エネルギーをすべて選べ。",options:["太陽光","風力","水力","地熱","バイオマス","石油","天然ガス","ウラン（原子力）"],answer:[0,1,2,3,4],
     explain:"太陽光・風力・水力・地熱・バイオマスは自然の中でくり返し補われます。石油・天然ガス（化石燃料）とウランは、量に限りがある資源です。"},
    {id:"re2",type:"choice",prompt:"火力発電（化石燃料）の課題として、最も適切なものはどれか。",
     options:["二酸化炭素を多く出し、資源の量にも限りがある","天候によって発電量が大きく変わる","発電に放射性物質を使う"],answer:0,
     explain:"化石燃料は燃やすと二酸化炭素を出し、地球温暖化の原因になります。また、量に限りがあります。"},
    {id:"re3",type:"choice",prompt:"原子力発電の特徴として、最も適切なものはどれか。",
     options:["発電時に二酸化炭素をほとんど出さないが、放射性廃棄物の処理が課題","燃料を燃やすので二酸化炭素を多く出す","天候によって発電量が大きく変わる"],answer:0,
     explain:"核分裂の熱で水蒸気をつくります。燃焼ではないので二酸化炭素はほとんど出しませんが、放射性廃棄物の長期の管理や、事故への備えが課題です。"},
    {id:"re4",type:"choice",prompt:"太陽光発電や風力発電の課題として、最も適切なものはどれか。",
     options:["天候や時間帯によって発電量が変わり、広い場所も必要","発電時に二酸化炭素を多く出す","資源がすぐに使い尽くされる"],answer:0,
     explain:"自然条件で出力が変動するため、蓄電や他の発電との組み合わせが必要です。エネルギーが薄く広がっているので、広い面積も必要になります。"},
    {id:"re5",type:"choice",prompt:"次のうち、タービンを回さずに発電するものはどれか。",
     options:["太陽光発電","火力発電","原子力発電","風力発電"],answer:0,
     explain:"太陽電池は光のエネルギーを直接電気エネルギーに変えます。火力・原子力は水蒸気で、風力は風でタービン（風車）を回し、発電機で電気をつくります。"},
    {id:"re6",type:"choice",prompt:"水力発電は、ダムにためた水の位置エネルギーを電気エネルギーに変えている。",options:TF,answer:0,
     explain:"正しい。水が落ちるときの運動エネルギーで水車を回します。水を高いところへ運んでいるのは、太陽の熱による水の循環です。"},
    {id:"re7",type:"choice",prompt:"化石燃料のエネルギーも、もとをたどれば太陽のエネルギーである。",options:TF,answer:0,
     explain:"正しい。大昔の植物が光合成でたくわえた太陽のエネルギーが、化学エネルギーとして残っています。地熱と原子力以外の多くのエネルギー資源は、もとをたどると太陽に行き着きます。"}
  ]}]
},
{ id:"dim", tab:"③次元", title:"③ 次元チェック",
  intro:"Gy ＝ J/kg、W ＝ J/s、Bq は 1 s 間あたりの数。単位を見れば、何を何で割った量かが分かります。",
  advice:"効率は単位のない比であること、Gy ＝ J/kg、W ＝ J/s のように単位から量の意味が読めることを確かめよう。",
  ref:{label:"単位の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", qs:[
    {id:"da1",type:"choice",prompt:"エネルギー〔J〕 ÷ 時間〔s〕",options:UNITQ,answer:0,two:true,explain:"J/s ＝ W。"},
    {id:"da2",type:"choice",prompt:"吸収したエネルギー〔J〕 ÷ 物質の質量〔kg〕",options:UNITQ,answer:2,two:true,explain:"J/kg ＝ Gy。"},
    {id:"da3",type:"choice",prompt:"崩壊した原子核の数 ÷ 時間〔s〕",options:UNITQ,answer:3,two:true,explain:"1 s 間あたりの崩壊数が Bq です。"},
    {id:"da4",type:"choice",prompt:"電力〔W〕 × 時間〔s〕",options:UNITQ,answer:1,two:true,explain:"W × s ＝ J。"}
  ]},
  { title:`B. 式の単位を判定する${ADV}`, lead:"質量とエネルギーの関係は、物理（2年次以降）で詳しく学ぶ。", qs:[
    {id:"db1",type:"choice",prompt:"質量とエネルギーの関係として、単位が正しいものはどれか。",options:[`${E} ＝ ${m}${c}²`,`${E} ＝ ${m}${c}`,`${E} ＝ ${m}²${c}`],answer:0,
     explain:`kg × (m/s)² ＝ kg·m²/s² ＝ J。${m}${c} は kg·m/s、${m}²${c} は kg²·m/s で、エネルギーになりません。`},
    {id:"db2",type:"choice",prompt:"1.0 g の質量がすべてエネルギーに変わったとすると、何 J か（<i class='qv'>c</i> ＝ 3.0 × 10⁸ m/s）。",options:["9.0 × 10¹³ J","9.0 × 10¹⁶ J","3.0 × 10⁵ J"],answer:0,
     explain:"1.0 g ＝ 1.0 × 10⁻³ kg。1.0 × 10⁻³ × (3.0 × 10⁸)² ＝ 9.0 × 10¹³ J。g のまま代入すると 10³ 倍の誤りになります。"}
  ]},
  { title:"C. 答案の誤りを見つける", lead:"問「ある装置に 2.0 × 10³ J のエネルギーを投入したところ、目的のエネルギーが 5.0 × 10² J 得られた。変換効率を求めよ。」",
    quote:"答案：効率 ＝ 2000 ÷ 500 ＝ 4.0", qs:[
    {id:"dc1",type:"choice",prompt:"この答案の誤りはどれか。",options:["割り算が逆。効率が 1 を超えることはない","単位 J をつけ忘れている","有効数字が違う"],answer:0,
     explain:"効率 ＝ 目的 ÷ 投入。答えが 1 を超えたら、どこかが誤っています。"},
    {id:"dc2",type:"num",prompt:"正しい変換効率は何 % か。",answer:25,tol:0.1,unit:"%",traps:{"0.25":"% で答えます（100 を掛ける）。","400":"目的 ÷ 投入です。"},explain:"500 ÷ 2000 ＝ 0.25 ＝ 25%。"}
  ]}]
},
{ id:"step", tab:"④手順", title:"④ 手順固定の演習",
  intro:"効率は「流れの図 → 目的のエネルギー → 割り算」、半減期は「回数 → (1/2)^回数」の順に解きます。",
  advice:"エネルギーの流れを図にしてから効率を求め、半減期は回数を数えてから割合を求めよう。",
  ref:{label:"7ステップを見る", html:STEPS},
  groups:[
  { title:"問題1（発電の効率）", quote:"ある火力発電所では、燃料から 1.0 × 10⁹ J の熱が得られるごとに、4.0 × 10⁸ J の電気エネルギーがつくられる。", qs:[
    {id:"s11",type:"choice",prompt:"ステップ2　目的のエネルギーはどれか。",options:["電気エネルギー","燃料から得られる熱","捨てられる熱"],answer:0,explain:"発電所の目的は電気をつくることです。"},
    {id:"s12",type:"num",prompt:"ステップ3　変換効率は何 % か。",answer:40,tol:0.1,unit:"%",traps:{"0.4":"% で答えます。","250":"目的 ÷ 投入です。"},explain:"4.0 × 10⁸ ÷ (1.0 × 10⁹) ＝ 0.40 ＝ 40%。"},
    {id:"s13",type:"num",prompt:"利用されずに周囲へ捨てられたエネルギーは何 × 10⁸ J か。",answer:6.0,tol:0.05,unit:"× 10⁸ J",
     traps:{"4":"それは電気エネルギーです。","14":"投入したエネルギーから電気エネルギーを引きます。"},explain:"エネルギー保存より、1.0 × 10⁹ − 4.0 × 10⁸ ＝ 6.0 × 10⁸ J。"}
  ]},
  { title:"問題2（モーターの効率）", quote:"電動機（モーター）に 200 J の電気エネルギーを与えたところ、質量 2.0 kg の物体を 6.0 m 持ち上げた。<i class='qv'>g</i> ＝ 9.8 m/s² とする。", qs:[
    {id:"s21",type:"num",prompt:"物体が得た重力による位置エネルギー",answer:117.6,tol:0.6,unit:"J",traps:{"12":"<i class='qv'>mgh</i> には <i class='qv'>g</i> ＝ 9.8 m/s² を掛けます。"},
     explain:`${m}${I("gh")} ＝ 2.0 × 9.8 × 6.0 ＝ 117.6 ≒ 1.2 × 10² J。`},
    {id:"s22",type:"num",prompt:"この電動機の変換効率は何 % か（有効数字2桁）。",answer:59,tol:0.6,unit:"%",traps:{"170":"目的 ÷ 投入です。","0.59":"% で答えます。"},
     explain:"117.6 ÷ 200 ＝ 0.588 ≒ 59%。残りは熱や音として周囲に散らばります。"}
  ]},
  { title:"問題3（半減期）", lead:ANIM("anim/nuclear.html#decay-i131","半減期 8.0 日のシミュレーション（解き終えたら確かめよう）"), quote:"半減期 8.0 日の放射性物質がある。はじめの放射能の強さは 1.6 × 10⁴ Bq であった。", qs:[
    {id:"s31",type:"num",prompt:"32 日後までに、半分になる回数は何回か。",answer:4,tol:0.01,unit:"回",traps:{"256":"回数は 32 ÷ 8 です。"},explain:"32 ÷ 8.0 ＝ 4 回。"},
    {id:"s32",type:"choice",prompt:"32 日後に残っている放射性原子核の割合はどれか。",options:["1/16","1/4","1/8","1/32"],answer:0,explain:"(1/2)⁴ ＝ 1/16。"},
    {id:"s33",type:"num",prompt:"32 日後の放射能の強さは何 Bq か。",answer:1000,tol:5,unit:"Bq",traps:{"4000":"4 で割るのではなく、16 で割ります。"},
     explain:"放射能の強さは原子核の数に比例するので、1.6 × 10⁴ ÷ 16 ＝ 1.0 × 10³ Bq。"},
    {id:"s34",type:"self",prompt:"エネルギーは保存されるのに、「エネルギーを節約しよう」と言われるのはなぜか。",
     model:"エネルギーの全体の量は変わらないが、変換のたびに一部が熱として周囲に散らばり、再び利用しにくい形になる（不可逆変化）。利用しやすい形のエネルギーは減っていくので、節約が必要になる。"},
    {id:"s35",type:"checklist",prompt:"解き終えたら点検しよう（採点には入りません）。",
     items:["エネルギーの流れを図にした","目的のエネルギーと失われるエネルギーを分けた","効率が 1 より小さいことを確かめた","半減期では経過時間を半減期で割って回数を求めた"]}
  ]}]
},
{ id:"sum", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。用語と関係を選びます。",
  advice:"似た用語の違い（放射線と放射能、Bq・Gy・Sv、透過力と電離作用）を定義で確かめよう。",
  groups:[{ title:"用語と関係を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"変換効率について正しいものはどれか。",options:["必ず 1（100%）より小さい","工夫すれば 1 を超えられる","エネルギーの種類によらず一定である"],answer:0,explain:"一部は必ず熱などとして散らばります。"},
    {id:"m2",type:"choice",prompt:"紙1枚で止めることができる放射線はどれか。",options:RAYS,answer:0,explain:"α線は透過力が最も小さく、電離作用が最も強い放射線です。"},
    {id:"m3",type:"choice",prompt:"止めるのに厚い鉛やコンクリートが必要な放射線はどれか。",options:RAYS,answer:2,explain:"γ線は電荷をもたない電磁波で、透過力が大きい。"},
    {id:"m4",type:"choice",prompt:"「1 s 間に崩壊する原子核の数」を表す単位はどれか。",options:["Bq","Gy","Sv"],answer:0,explain:"放射性物質の側の量です。"},
    {id:"m5",type:"blanks",prompt:"次の文を完成させよ。",text:"エネルギーは変換されても全体の量は{0}が、変換のたびに一部が{1}として周囲に散らばる。",
     options:[["変わらない","減る"],["熱","電気"]],answer:[0,0],explain:"エネルギー保存と、変換効率が 1 より小さい理由です。"}
  ]}]
}
];

registerUnit({ id:"energy-use", title:"エネルギーとその利用", sections: SECTIONS });
})();
