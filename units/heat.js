/*
 * 単元：熱とエネルギー
 * 温度・熱量・比熱・熱平衡（熱量の保存）・状態変化・内部エネルギー・熱力学第一法則・熱効率。
 * 第一法則では「気体がする仕事／される仕事」の読み分けを重視する。
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
const T = I("T"), t = I("t"), Q = I("Q"), C = I("C"), c = I("c"), m = I("m"), U = I("U"), W = I("W"), e = I("e");
const Q1 = Sb("Q","1"), Q2 = Sb("Q","2");

const DEF_TABLE = `<div class="tbl"><table>
<colgroup><col style="width:6.6em"><col></colgroup>
<tr><th>用語</th><th>定義（記号・式・単位）</th></tr>
<tr><th colspan='2' style='text-align:left;background:var(--blue-soft)'>温度と熱運動</th></tr>
<tr><td>熱運動</td><td>物質をつくる粒子（原子・分子）の不規則な運動。温度が高いほど激しい</td></tr>
<tr><td>ブラウン運動</td><td>水に浮かんだ微粒子（花粉から出た粒子など）が、不規則に動き回る現象。周りの水分子が熱運動して、不規則にぶつかるために起こる</td></tr>
<tr><td>セルシウス温度（セ氏温度）</td><td>1気圧で水が凍る温度を 0&nbsp;℃、沸騰する温度を 100&nbsp;℃ とし、その間を 100 等分して決めた温度<br><span style='color:var(--blue);font-weight:700'>${t}〔℃〕</span></td></tr>
<tr><td>絶対温度</td><td>−273&nbsp;℃（絶対零度）を 0 とする温度。目盛りの間隔はセルシウス温度と同じ<br><span style='color:var(--blue);font-weight:700'>${T} ＝ ${t} ＋ 273〔K〕</span></td></tr>
<tr><td>絶対温度の単位（ケルビン）</td><td>絶対温度の単位。温度差 1&nbsp;K は、温度差 1&nbsp;℃ と同じ大きさ<br><span style='color:var(--blue);font-weight:700'>K</span></td></tr>
<tr><td>熱平衡</td><td>温度の異なる物体を接触させたとき、熱が移動して、やがて両方の温度が等しくなった状態</td></tr>
<tr><td>熱膨張</td><td>温度が上がると、物体の長さや体積が大きくなる現象。粒子の熱運動が激しくなり、粒子の間隔が広がるために起こる</td></tr>
<tr><th colspan='2' style='text-align:left;background:var(--blue-soft)'>熱量</th></tr>
<tr><td>熱（熱量）</td><td>温度の高い物体から低い物体へ移動するエネルギー<br><span style='color:var(--blue);font-weight:700'>${Q}〔J〕</span></td></tr>
<tr><td>熱容量</td><td>物体全体の温度を 1&nbsp;K 上げるのに必要な熱量<br><span style='color:var(--blue);font-weight:700'>${Q} ＝ ${C}Δ${T}、${C}〔J/K〕</span></td></tr>
<tr><td>比熱（比熱容量）</td><td>物質 1&nbsp;g の温度を 1&nbsp;K 上げるのに必要な熱量。物質によって決まる<br><span style='color:var(--blue);font-weight:700'>${Q} ＝ ${m}${c}Δ${T}、${c}〔J/(g·K)〕</span></td></tr>
<tr><td>熱量の保存</td><td>熱が外に逃げないとき、高温の物体が失った熱量 ＝ 低温の物体が得た熱量</td></tr>
<tr><th colspan='2' style='text-align:left;background:var(--blue-soft)'>物質の状態変化</th></tr>
<tr><td>物質の三態</td><td>物質の3つの状態（固体・液体・気体）。温度や圧力によって状態が変わる（状態変化）</td></tr>
<tr><td>融解</td><td>固体が液体になる変化。融解が起こる温度が融点（逆向きの変化は凝固）</td></tr>
<tr><td>蒸発</td><td>液体の表面で、液体が気体になる変化。沸点より低い温度でも起こる</td></tr>
<tr><td>沸騰</td><td>液体の内部からも気体（気泡）が生じる変化。沸騰が起こる温度が沸点（1気圧の水では 100&nbsp;℃）</td></tr>
<tr><td>潜熱</td><td>状態変化に使われる熱（融解熱・蒸発熱）。状態変化の間は温度が一定</td></tr>
<tr><td>融解熱</td><td>融点で、固体 1&nbsp;g を同じ温度の液体にするのに必要な熱量（氷では約 3.3×10² J/g）<br><span style='color:var(--blue);font-weight:700'>〔J/g〕</span></td></tr>
<tr><td>蒸発熱</td><td>沸点で、液体 1&nbsp;g を同じ温度の気体にするのに必要な熱量（水では約 2.3×10³ J/g）<br><span style='color:var(--blue);font-weight:700'>〔J/g〕</span></td></tr>
<tr><th colspan='2' style='text-align:left;background:var(--blue-soft)'>内部エネルギーと熱機関</th></tr>
<tr><td>内部エネルギー</td><td>物体内の粒子の熱運動のエネルギーなどの総和<br><span style='color:var(--blue);font-weight:700'>${U}〔J〕</span></td></tr>
<tr><td>熱力学第一法則</td><td>内部エネルギーの変化 ＝ 気体が吸収した熱量 ＋ 気体が外部から<b>された</b>仕事<br><span style='color:var(--blue);font-weight:700'>Δ${U} ＝ ${Q} ＋ ${W}</span></td></tr>
<tr><td>熱機関</td><td>熱を受け取り、その一部を仕事に変えるしくみ（蒸気機関、ガソリンエンジンなど）</td></tr>
<tr><td>熱効率</td><td>熱機関が高温の熱源から吸収した熱量のうち、外部にした仕事の割合。必ず 1 より小さい<br><span style='color:var(--blue);font-weight:700'>${e} ＝ ${W}′ ÷ ${Q1}</span></td></tr>
<tr><td>可逆変化</td><td>外部に何の変化も残さずに、もとの状態に戻すことができる変化（摩擦や空気抵抗のない振り子の運動など）</td></tr>
<tr><td>不可逆変化</td><td>外部に何らかの変化を残さないと、もとの状態に戻すことができない変化。熱が高温の物体から低温の物体へ移る変化や、摩擦によって熱が発生する変化など。自然に起こる熱の現象は不可逆変化</td></tr>
</table></div><p>水の比熱は 4.2&nbsp;J/(g·K)。温度差は ℃ でも K でも同じ数値になる。</p>`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th></tr>
<tr><td>熱量 ${Q}、内部エネルギー ${U}、仕事 ${W}</td><td>J</td></tr>
<tr><td>熱容量 ${C}</td><td>J/K</td></tr>
<tr><td>比熱 ${c}</td><td>J/(g·K)</td></tr>
<tr><td>絶対温度 ${T}・温度差 Δ${T}</td><td>K</td></tr></table></div>`;
const STEPS = `<p>1 着目する物体と、始め・終わりの温度 → 2 熱を失う物体と得る物体を分ける → 3 「失った熱量 ＝ 得た熱量」を、各項を正の量にして書く → 4 文字式で解く → 5 単位をそろえて代入 → 6 有効数字 → 7 妥当性（終わりの温度は2つの温度の間か）</p>`;
/* 氷を一定の割合で加熱したときの温度変化（模式図） */
const CURVE = `<svg class="graph" viewBox="0 0 320 175" role="img" aria-label="一定の割合で加熱した氷の温度と時間のグラフ。Aで急に上がり、0度で水平なB、ゆるやかに上がるC、100度で水平なDが続く。">
<line x1="40" y1="160" x2="312" y2="160" stroke="currentColor" stroke-width="1.2"/>
<line x1="40" y1="166" x2="40" y2="12" stroke="currentColor" stroke-width="1.2"/>
<line x1="40" y1="130" x2="312" y2="130" stroke="currentColor" stroke-dasharray="3 3" opacity=".45"/>
<line x1="40" y1="30" x2="312" y2="30" stroke="currentColor" stroke-dasharray="3 3" opacity=".45"/>
<polyline points="40,150 52,130 121,130 211,30 305,30" fill="none" stroke="var(--blue)" stroke-width="3"/>
<text x="20" y="134" font-size="11" fill="currentColor">0</text><text x="12" y="34" font-size="11" fill="currentColor">100</text>
<text x="8" y="18" font-size="11" fill="currentColor">温度〔℃〕</text><text x="262" y="174" font-size="11" fill="currentColor">時間</text>
<text x="54" y="152" font-size="13" fill="var(--red)">A</text><text x="82" y="124" font-size="13" fill="var(--red)">B</text>
<text x="170" y="92" font-size="13" fill="var(--red)">C</text><text x="252" y="24" font-size="13" fill="var(--red)">D</text>
</svg>`;
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;
const TF = ["正しい","誤り"];
const UNITQ = ["J（熱量）","J/K（熱容量）","J/(g·K)（比熱）","K（温度差）"];

const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:`「熱」は物体がもっているものではなく、移動するエネルギーです。言葉と式を正確に覚えます。<br>アニメーションで確かめよう：<br>${ANIM("anim/heat-equilibrium.html","熱の移動と熱平衡")}${ANIM("anim/heat-motion.html","熱運動と状態変化")}${ANIM("anim/phase-equilibrium.html#lv","蒸発と凝縮（気液平衡）")}${ANIM("anim/phase-equilibrium.html#sl","融解と凝固（固液平衡）")}`,
  advice:`熱量・熱容量・比熱の違いと、熱力学第一法則の ${W} が「された仕事」であることを覚え直そう。`,
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"blanks",text:`絶対温度 ${T} とセルシウス温度 ${t} の関係は ${T} ＝ ${t} ＋ {0} で、${T} の単位は{1}である。`,
     options:[["273","100","0"],["K","℃","J"]],answer:[0,0],
     explain:`${T} ＝ ${t} ＋ 273。単位はケルビン（K）。`},
    {id:"d2",type:"choice",prompt:"絶対零度（0 K）は何 ℃ か。",options:["−273 ℃","0 ℃","273 ℃"],answer:0,
     explain:"0 K ＝ −273 ℃。これより低い温度はありません。"},
    {id:"d3",type:"blanks",text:"熱量の単位は{0}、熱容量の単位は{1}、比熱の単位は{2}である。",
     options:[["J","K","W"],["J/K","J/(g·K)","J·K"],["J/K","J/(g·K)","J/g"]],answer:[0,0,1],
     explain:"熱量は J。熱容量は「1 K あたり」なので J/K。比熱は「1 g、1 K あたり」なので J/(g·K)。"},
    {id:"d4",type:"choice",prompt:`質量 ${m}、比熱 ${c} の物体の温度を Δ${T} 上げるのに必要な熱量 ${Q} はどれか。`,
     options:[`${Q} ＝ ${m}${c}Δ${T}`,`${Q} ＝ ${c}Δ${T}`,`${Q} ＝ ${m}Δ${T} ÷ ${c}`],answer:0,
     explain:"比熱は 1 g・1 K あたりの熱量なので、質量と温度差を掛けます。"},
    {id:"d5",type:"choice",prompt:`熱容量 ${C} と、質量 ${m}・比熱 ${c} の関係はどれか。`,
     options:[`${C} ＝ ${m}${c}`,`${C} ＝ ${c} ÷ ${m}`,`${C} ＝ ${m} ÷ ${c}`],answer:0,
     explain:`物体全体を 1 K 上げる熱量なので、${C} ＝ ${m}${c}。`},
    {id:"d6",type:"choice",prompt:"温度の異なる2つの物体を接触させておくと、最後にはどうなるか。",
     options:["温度が等しくなる（熱平衡）","もっている熱量が等しくなる","比熱が等しくなる"],answer:0,
     explain:"熱は高温側から低温側へ移動し、温度が等しくなると移動が止まります。"},
    {id:"d7",type:"blanks",text:`熱力学第一法則 Δ${U} ＝ ${Q} ＋ ${W} の ${W} は、気体が外部から{0}仕事、${Q} は気体が{1}熱量である。`,
     options:[["された","した"],["吸収した","放出した"]],answer:[0,0],
     explain:`${W} は「された仕事」。気体が外部に仕事をしたときは ${W} が負になります。`},
    {id:"d8",type:"choice",prompt:`熱機関の熱効率 ${e} を表す式はどれか（${W}′ は外部にした仕事、${Q1} は高温の熱源から吸収した熱量）。`,
     options:[`${e} ＝ ${W}′ ÷ ${Q1}`,`${e} ＝ ${Q1} ÷ ${W}′`,`${e} ＝ ${W}′ × ${Q1}`],answer:0,
     explain:"吸収した熱量のうち、仕事に変えられた割合です。"},
    {id:"d9",type:"choice",prompt:"熱効率を 1（100%）にすることはできるか。",
     options:["できる。摩擦をなくせばよい","できない。吸収した熱の一部は必ず低温の熱源へ捨てられる"],answer:1,
     explain:`熱機関は ${Q2} を低温側へ捨てなければ動き続けられないので、${e} は必ず 1 より小さくなります。`}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル",
  intro:"「仕事をする・される」「熱を吸収する・放出する」を、符号つきの数値に置き換える練習です。",
  advice:`「気体が〜した」「気体が〜された」を読み分け、${Q} と ${W} の符号を先に決めよう。`,
  groups:[
  { title:"A. 「する」「される」を符号にする", lead:`Δ${U} ＝ ${Q} ＋ ${W}（${Q}：気体が吸収した熱量、${W}：気体が外部からされた仕事）で考える。`, qs:[
    {id:"ra1",type:"num",prompt:`「気体が外部に 50 J の仕事をした」とき、${W} はいくらか。`,answer:-50,tol:0.01,unit:"J",
     traps:{"50":`気体が仕事を「した」ので、「された」仕事 ${W} は負です。`},
     explain:`外部にした仕事が 50 J なら、外部からされた仕事は ${W} ＝ −50 J。`},
    {id:"ra2",type:"num",prompt:`「気体が外部から 80 J の仕事をされた」とき、${W} はいくらか。`,answer:80,tol:0.01,unit:"J",
     traps:{"-80":"「された」仕事はそのまま正です。"},explain:`${W} ＝ ＋80 J。`},
    {id:"ra3",type:"num",prompt:`「気体が 30 J の熱を放出した」とき、${Q} はいくらか。`,answer:-30,tol:0.01,unit:"J",
     traps:{"30":`放出したので、吸収した熱量 ${Q} は負です。`},explain:`吸収した熱量で表すので ${Q} ＝ −30 J。`},
    {id:"ra4",type:"blanks",prompt:"「気体を断熱圧縮した」（熱の出入りがないまま押し縮めた）。",text:`${Q} は{0}、${W} は{1}、内部エネルギーは{2}。`,
     options:[["0","正","負"],["正","負","0"],["増加する","減少する","変化しない"]],answer:[0,0,0],
     explain:`断熱なので ${Q} ＝ 0。押し縮める（仕事をされる）ので ${W} ＞ 0。Δ${U} ＝ ${W} ＞ 0 で、温度が上がります。`}
  ]},
  { title:"B. 正しいか、誤りか", qs:[
    {id:"rb1",type:"choice",prompt:"熱い物体は、たくさんの熱をもっている。",options:TF,answer:1,
     explain:"誤り。熱は移動するエネルギーの名前です。物体がもっているのは内部エネルギーです。"},
    {id:"rb2",type:"choice",prompt:"温度が同じなら、どの物体も内部エネルギーは等しい。",options:TF,answer:1,
     explain:"誤り。内部エネルギーは物質の種類や量によって違います。"},
    {id:"rb3",type:"choice",prompt:"比熱が大きい物質ほど、温まりにくく冷めにくい。",options:TF,answer:0,
     explain:"正しい。1 K 上げるのに多くの熱量が必要だからです。水は比熱が大きい物質です。"},
    {id:"rb4",type:"choice",prompt:"氷が融けている間は、熱を加え続けても温度は変わらない。",options:TF,answer:0,
     explain:"正しい。加えた熱は状態変化（融解）に使われます（融解熱）。"},
    {id:"rb5",type:"choice",prompt:"温度差 10 ℃ と温度差 10 K は同じ大きさである。",options:TF,answer:0,
     explain:"正しい。目盛りの間隔が同じなので、温度差の数値は等しくなります。"},
    {id:"rb6",type:"choice",prompt:"熱は、低温の物体から高温の物体へ自然に移ることがある。",options:TF,answer:1,
     explain:"誤り。熱が自然に移るのは高温から低温への向きだけです（不可逆変化）。"}
  ]},
  { title:"C. 熱量の保存の式を読む", lead:`80 ℃ の水 100 g と 20 ℃ の水 200 g を混ぜた。熱は外に逃げないものとし、混ぜた後の温度を ${t}〔℃〕とする。水の比熱は 4.2 J/(g·K)。`, qs:[
    {id:"rc1",type:"choice",prompt:"正しい式はどれか。",
     options:[`100 × 4.2 × (80 − ${t}) ＝ 200 × 4.2 × (${t} − 20)`,`100 × 4.2 × (${t} − 80) ＝ 200 × 4.2 × (${t} − 20)`,"100 × 80 ＝ 200 × 20"],answer:0,
     explain:"左辺は熱い水が失った熱量、右辺はぬるい水が得た熱量。どちらも正の量になるように温度差を書きます。"},
    {id:"rc2",type:"num",prompt:`混ぜた後の温度 ${t} を求めよ。`,answer:40,tol:0.05,unit:"℃",
     traps:{"50":"単純な平均ではありません。質量の大きい水の温度に近くなります。"},
     explain:`100(80 − ${t}) ＝ 200(${t} − 20) より ${t} ＝ 40 ℃。`}
  ]},
  { title:"D. 加熱のグラフを読む", lead:`−20 ℃ の氷を一定の割合で加熱したときの、温度と時間の関係（模式図）。${ANIM("anim/heat-motion.html","熱運動と状態変化のアニメーション")}`, figure:CURVE, qs:[
    {id:"rd1",type:"choice",prompt:"区間 B（0 ℃ で水平）で起きていることはどれか。",
     options:["氷が融けている（加えた熱は融解に使われる）","熱が加わっていない","水が沸騰している"],answer:0,
     explain:"状態変化の間は温度が一定です。D では沸騰（蒸発）が起きています。"},
    {id:"rd2",type:"choice",prompt:"区間 A（氷）の傾きが区間 C（水）より急なのはなぜか。",
     options:["氷の比熱が水の比熱より小さいから","氷の質量が水より小さいから","氷のほうが熱を通しやすいから"],answer:0,
     explain:"同じ熱量を加えたとき、比熱が小さいほど温度が大きく上がります（氷 約 2.1 J/(g·K)、水 4.2 J/(g·K)）。質量は融けても変わりません。"},
    {id:"rd3",type:"choice",prompt:"区間 D が区間 B より長いことから分かることはどれか。",
     options:["蒸発熱は融解熱より大きい","沸騰中は加熱が弱まる","水は氷より比熱が大きい"],answer:0,
     explain:"加熱の割合が一定なので、水平部分の長さは状態変化に必要な熱量に比例します。"}
  ]}]
},
{ id:"dim", tab:"③次元", title:"③ 次元チェック",
  intro:"比熱は J/(g·K)、熱容量は J/K。単位を見れば、何を掛けて何で割る量かが分かります。",
  advice:"比熱の単位に g が含まれることに注意し、質量の単位（g と kg）をそろえよう。",
  ref:{label:"単位の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", qs:[
    {id:"da1",type:"choice",prompt:`${m} × ${c}（g × J/(g·K)）`,options:UNITQ,answer:1,two:true,explain:"g × J/(g·K) ＝ J/K。熱容量です。"},
    {id:"da2",type:"choice",prompt:`${C} × Δ${T}`,options:UNITQ,answer:0,two:true,explain:"J/K × K ＝ J。熱量です。"},
    {id:"da3",type:"choice",prompt:`${Q} ÷ (${m}Δ${T})`,options:UNITQ,answer:2,two:true,explain:"J ÷ (g·K) ＝ J/(g·K)。比熱です。"},
    {id:"da4",type:"choice",prompt:`${Q} ÷ ${C}`,options:UNITQ,answer:3,two:true,explain:"J ÷ (J/K) ＝ K。温度の変化です。"}
  ]},
  { title:"B. 式の単位を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、単位が合わないものをすべて選べ。",
     options:[`${Q} ＝ ${m}${c}Δ${T}`,`${Q} ＝ ${m}${c}`,`${C} ＝ ${m}${c}`,`Δ${T} ＝ ${Q} ÷ (${m}${c})`,`${c} ＝ ${Q}${m}Δ${T}`],answer:[1,4],
     explain:`${m}${c} の単位は J/K で熱量（J）になりません。${Q}${m}Δ${T} の単位は J·g·K で比熱になりません。`}
  ]},
  { title:"C. 単位を換算する", qs:[
    {id:"dc1",type:"choice",prompt:"水の比熱 4.2 J/(g·K) を J/(kg·K) で表したものはどれか。",
     options:["4.2 × 10³ J/(kg·K)","4.2 × 10⁻³ J/(kg·K)","4.2 J/(kg·K)"],answer:0,
     explain:"1 kg ＝ 10³ g なので、1 kg あたりでは 10³ 倍の熱量が必要です。"}
  ]},
  { title:"D. 答案の誤りを見つける", lead:"問「200 g の水を 20 ℃ から 50 ℃ まで温めるのに必要な熱量を求めよ。水の比熱は 4.2 J/(g·K)。」",
    quote:`答案：${Q} ＝ 0.20 × 4.2 × 30 ≒ 25 J`, qs:[
    {id:"dd1",type:"choice",prompt:"この答案の誤りはどれか。",
     options:["質量を kg に直したが、比熱は g あたりの値なので単位がそろっていない","温度差は 50 で計算すべき","4.2 ではなく 4.2 × 10³ を使うべき"],answer:0,
     explain:"比熱が J/(g·K) なら、質量も g のまま代入します。"},
    {id:"dd2",type:"num",prompt:"正しい熱量を求めよ。",answer:25200,tol:300,unit:"J",
     traps:{"25":"質量を g のまま代入します。","42000":"温度差は 50 − 20 ＝ 30 K です。"},
     explain:`${Q} ＝ 200 × 4.2 × 30 ＝ 25200 ≒ 2.5 × 10⁴ J。`}
  ]}]
},
{ id:"step", tab:"④手順", title:"④ 手順固定の演習",
  intro:`熱量の保存は「失った熱量 ＝ 得た熱量」。各項を正の量で書くのが手順の要です。<br>${ANIM("anim/heat-equilibrium.html","熱の移動と熱平衡のアニメーション")}`,
  advice:"熱を失う物体と得る物体を先に分け、温度差を正の量で書いてから式を立てよう。",
  ref:{label:"7ステップを見る", html:STEPS},
  groups:[
  { title:"問題1（すべてのステップ）",
    quote:"100 ℃ に熱した質量 100 g の金属球を、20 ℃ の水 200 g に入れた。金属の比熱は 0.45 J/(g·K)、水の比熱は 4.2 J/(g·K) とし、熱は水と金属球の間だけで移動するものとする。", qs:[
    {id:"s11",type:"blanks",prompt:"ステップ2　熱を失う物体と得る物体",text:"熱を失うのは{0}、熱を得るのは{1}。",
     options:[["金属球","水"],["金属球","水"]],answer:[0,1],explain:"高温の金属球が熱を失い、低温の水が熱を得ます。"},
    {id:"s12",type:"choice",prompt:`ステップ3　終わりの温度を ${t}〔℃〕として、正しい式はどれか。`,
     options:[`100 × 0.45 × (100 − ${t}) ＝ 200 × 4.2 × (${t} − 20)`,`100 × 4.2 × (100 − ${t}) ＝ 200 × 0.45 × (${t} − 20)`,`100 × 0.45 × (${t} − 100) ＝ 200 × 4.2 × (${t} − 20)`],answer:0,
     explain:"金属球が失った熱量 ＝ 水が得た熱量。比熱をそれぞれの物質に正しく対応させます。"},
    {id:"s13",type:"num",prompt:`ステップ4〜6　${t} を求めよ（有効数字2桁）。`,answer:24,tol:0.6,unit:"℃",
     traps:{"60":"単純な平均ではありません。","76":"比熱の対応が逆になっていませんか。"},
     explain:`45(100 − ${t}) ＝ 840(${t} − 20) より 885${t} ＝ 21300、${t} ≒ 24 ℃。`},
    {id:"s14",type:"choice",prompt:"ステップ7　答えが 20 ℃ に近い理由はどれか。",
     options:["水の熱容量（840 J/K）が金属球の熱容量（45 J/K）よりずっと大きいから","金属は熱を通しやすいから","水の質量が金属球の2倍だから"],answer:0,
     explain:"温度の変わりにくさは熱容量（質量 × 比熱）で決まります。質量の比だけでは説明できません。"}
  ]},
  { title:"問題2（熱力学第一法則）", quote:"気体に 3.0 × 10² J の熱を加えたところ、気体は膨張して外部に 1.2 × 10² J の仕事をした。", qs:[
    {id:"s21",type:"blanks",prompt:`${Q} と ${W} を符号つきで書く。`,text:`${Q} ＝ {0}　${W} ＝ {1}`,
     options:[["＋3.0 × 10² J","−3.0 × 10² J"],["＋1.2 × 10² J","−1.2 × 10² J"]],answer:[0,1],
     explain:`熱を加えた（吸収した）ので ${Q} ＞ 0。外部に仕事を「した」ので ${W} ＜ 0。`},
    {id:"s22",type:"num",prompt:`内部エネルギーの変化 Δ${U} を求めよ。`,answer:180,tol:1,unit:"J",
     traps:{"420":`外部に仕事をしたので ${W} は負です。`,"-180":`${Q} は正（吸収）、${W} は負（外部にした）です。`},
     explain:`Δ${U} ＝ 300 ＋ (−120) ＝ 180 J ＝ 1.8 × 10² J。`}
  ]},
  { title:"問題3（熱効率）", quote:"ある熱機関は、1 回の動作で高温の熱源から 2.0 × 10³ J の熱を吸収し、外部に 5.0 × 10² J の仕事をした。", qs:[
    {id:"s31",type:"num",prompt:"熱効率は何 % か。",answer:25,tol:0.1,unit:"%",
     traps:{"0.25":"% で答えます（100 を掛ける）。","400":"仕事 ÷ 吸収した熱量です。"},explain:`${e} ＝ 500 ÷ 2000 ＝ 0.25 ＝ 25%。`},
    {id:"s32",type:"num",prompt:"低温の熱源に捨てた熱量は何 J か。",answer:1500,tol:5,unit:"J",
     traps:{"2500":"捨てた熱量は、吸収した熱量から仕事を引いたものです。"},explain:`${Q2} ＝ ${Q1} − ${W}′ ＝ 2000 − 500 ＝ 1.5 × 10³ J。`},
    {id:"s33",type:"self",prompt:"熱効率を 100% にできない理由を説明せよ。",
     model:"熱機関が動作をくり返すには、吸収した熱の一部を必ず低温の熱源に捨てなければならない。そのため、吸収した熱をすべて仕事に変えることはできない。"},
    {id:"s34",type:"checklist",prompt:"解き終えたら点検しよう（採点には入りません）。",
     items:["熱を失う物体と得る物体を分けた","温度差を正の量で書いた","比熱をそれぞれの物質に正しく対応させた",`${Q} と ${W} の符号を「する・される」で決めた`,"答えの温度が2つの温度の間にあるか確かめた"]}
  ]}]
},
{ id:"sum", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。場面に合う法則と符号を選びます。",
  advice:"「熱量の保存」と「熱力学第一法則」のどちらを使う場面かを、最初に判断しよう。",
  groups:[{ title:"法則と符号を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"湯と水を混ぜた後の温度を求めたい。",
     options:["熱量の保存（失った熱量 ＝ 得た熱量）","熱力学第一法則","熱効率の式"],answer:0,explain:"2つの物体の間で熱が移動する場面です。"},
    {id:"m2",type:"choice",prompt:"気体に熱を加えて膨張させたときの、内部エネルギーの変化を求めたい。",
     options:["熱量の保存",`熱力学第一法則（Δ${U} ＝ ${Q} ＋ ${W}）`,"比熱の式"],answer:1,explain:"熱と仕事の両方が出入りする場面です。"},
    {id:"m3",type:"choice",prompt:`気体が外部に仕事を「した」とき、${W} の符号は？`,options:["正","負","0"],answer:1,
     explain:`${W} は「された仕事」なので、仕事をしたときは負です。`},
    {id:"m4",type:"choice",prompt:"「この鍋全体の温度を 1 K 上げるのに必要な熱量」を表す量は？",options:["比熱","熱容量","熱量"],answer:1,
     explain:"物体全体についての量は熱容量。物質 1 g についての量が比熱です。"},
    {id:"m5",type:"blanks",prompt:"次の文を完成させよ。",text:`熱力学第一法則の ${W} は、気体が外部から{0}仕事である。気体が外部に仕事をすると ${W} は{1}になる。`,
     options:[["された","した"],["正","負"]],answer:[0,1],explain:"「する」と「される」を読み分けることが、符号を決める鍵です。"}
  ]}]
}
];

registerUnit({ id:"heat", title:"熱とエネルギー", sections: SECTIONS });
})();
