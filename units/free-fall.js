/*
 * 単元：落体の運動
 * 前単元の3式に a ＝ ±g を入れるだけで解く、という構成。g ＝ 9.8 m/s²。
 */
(function(){

const FORMULAS = `<div class="tbl"><table>
<tr><th>正の向き</th><th>a</th><th>3式</th></tr>
<tr><td>下向き</td><td>＋g</td><td>v ＝ v₀ ＋ gt<br>y ＝ v₀t ＋ ½gt²<br>v² − v₀² ＝ 2gy</td></tr>
<tr><td>上向き</td><td>−g</td><td>v ＝ v₀ − gt<br>y ＝ v₀t − ½gt²<br>v² − v₀² ＝ −2gy</td></tr>
</table></div><p class="formula">g ＝ 9.8 m/s²（鉛直下向き）</p>`;
const DEF_TABLE = `<div class="tbl"><table>
<tr><th>用語</th><th>定義</th><th>初速度</th><th>加速度</th></tr>
<tr><td>重力加速度 g</td><td>重力だけを受けて運動する物体の加速度。9.8 m/s²、鉛直下向き</td><td>―</td><td>―</td></tr>
<tr><td>自由落下</td><td>静止状態から、重力だけを受けて落ちる運動</td><td>0</td><td>下向きに g</td></tr>
<tr><td>鉛直投げ下ろし</td><td>鉛直下向きに初速度を与えて落とす運動</td><td>下向き v₀</td><td>下向きに g</td></tr>
<tr><td>鉛直投げ上げ</td><td>鉛直上向きに初速度を与えて投げる運動</td><td>上向き v₀</td><td>下向きに g</td></tr>
<tr><td>最高点</td><td>投げ上げた物体の速度が 0 になり、向きが変わる点</td><td>―</td><td>下向きに g</td></tr>
</table></div><p>加速度は、上昇中・最高点・下降中のどこでも<b>下向きに g で一定</b>。</p>${FORMULAS}`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th><th>次元</th></tr>
<tr><td>高さ・変位 h, y</td><td>m</td><td>〔L〕</td></tr>
<tr><td>時間 t</td><td>s</td><td>〔T〕</td></tr>
<tr><td>速度 v</td><td>m/s</td><td>〔L〕/〔T〕</td></tr>
<tr><td>重力加速度 g</td><td>m/s²</td><td>〔L〕/〔T〕²</td></tr></table></div>`;
const VT_GRAPH = `<svg class="graph" viewBox="0 0 320 180" role="img" aria-label="上向き正で投げ上げたときのv-tグラフ。切片v0の右下がりの直線で、途中でt軸と交わる。">
<line x1="30" y1="90" x2="305" y2="90" stroke="currentColor" stroke-width="1.5"/>
<line x1="30" y1="170" x2="30" y2="10" stroke="currentColor" stroke-width="1.5"/>
<polygon points="30,90 30,30 150,90" fill="var(--blue)" opacity=".15"/>
<polygon points="150,90 270,150 270,90" fill="var(--red)" opacity=".12"/>
<line x1="30" y1="30" x2="270" y2="150" stroke="var(--blue)" stroke-width="3"/>
<text x="300" y="108" font-size="14" fill="currentColor">t</text>
<text x="10" y="20" font-size="14" fill="currentColor">v</text>
<text x="6" y="35" font-size="12" fill="currentColor">v₀</text>
<text x="18" y="104" font-size="12" fill="currentColor">0</text>
<text x="138" y="108" font-size="12" fill="currentColor">t₁</text>
<text x="258" y="84" font-size="12" fill="currentColor">2t₁</text>
</svg>`;
const TF = ["正しい","誤り"];
const UNITQ = ["m/s（速度・速さ）","m（高さ・変位）","s（時間）","m/s²（加速度）"];
const SGN = ["正","負","0"];

const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:"覚える量は重力加速度 g ひとつだけ。あとは運動の名前と初速度の関係を覚えます。",
  advice:"g の大きさと向き、そして「加速度はどこでも下向きに g」を覚え直そう。",
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"blanks",text:"重力加速度の大きさは{0}で、向きは{1}である。",
     options:[["9.8 m/s","9.8 m/s²","9.8 m"],["鉛直上向き","運動の向き","鉛直下向き"]],answer:[1,2],
     explain:"g は加速度なので単位は m/s²。向きはいつも鉛直下向きです。"},
    {id:"d2",type:"blanks",text:"自由落下とは、初速度が{0}で、{1}だけを受けて落ちる運動である。",
     options:[["g","0","v₀"],["重力","空気抵抗","重力と空気抵抗"]],answer:[1,0],
     explain:"「静かにはなす」→ 初速度 0。空気抵抗は無視し、重力だけを考えます。"},
    {id:"d3",type:"blanks",text:"鉛直投げ上げの最高点では、速度は{0}で、加速度は{1}である。",
     options:[["0","v₀","g"],["0","上向きに g","下向きに g"]],answer:[0,2],
     explain:"最高点では一瞬止まりますが、重力ははたらき続けるので加速度は下向きに g のままです。"},
    {id:"d4",type:"choice",prompt:"上向きを正とすると、加速度 a はいくらか。",options:["＋g","−g","0"],answer:1,
     explain:"重力加速度は下向き。上向きを正にすれば a ＝ −g です。"},
    {id:"d5",type:"choice",prompt:"質量が2倍の物体を同じ高さから自由落下させると、落下にかかる時間はどうなるか（空気抵抗は無視）。",
     options:["½倍になる","2倍になる","変わらない"],answer:2,
     explain:"g は質量によらないので、同じ運動になります。"},
    {id:"d6",type:"choice",prompt:"落体の運動の式は、等加速度直線運動の3式をどう変えたものか。",
     options:["a を ±g に置き換えた","v₀ を g に置き換えた","x を h に置き換え、新しい法則を加えた"],answer:0,
     explain:"新しく覚える式はありません。正の向きを決めて a ＝ ＋g か −g を入れるだけです。"}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル",
  intro:"電卓は使いません。日常語で書かれた状態を、v₀・v・y・a の値に置き換える練習です。",
  advice:"「静かにはなす」「最高点」「地面に達する」を数値にすること、正の向きと g の符号をそろえることを練習しよう。",
  groups:[
  { title:"A. 隠れた情報を数値にする", lead:"次の言い回しは、どの量が何であることを表しているか。", qs:[
    {id:"ra1",type:"choice",prompt:"「小球を静かにはなした。」",options:["a ＝ 0","v₀ ＝ 0","v ＝ 0（最後）"],answer:1,
     explain:"「静かに」は「初速度を与えずに」という意味。v₀ ＝ 0 です。"},
    {id:"ra2",type:"choice",prompt:"「投げ上げた小球が最高点に達した。」",options:["v ＝ 0（a は −g のまま）","v ＝ 0 かつ a ＝ 0","y ＝ 0"],answer:0,
     explain:"最高点では速度が 0。加速度は変わりません。"},
    {id:"ra3",type:"choice",prompt:"「投げ上げた小球が、投げた点に戻ってきた。」",options:["v ＝ 0","t ＝ 0","y ＝ 0"],answer:2,
     explain:"出発点に戻ったので、変位 y ＝ 0 です。"},
    {id:"ra4",type:"choice",prompt:"「高さ h のビルの屋上から投げ上げた小球が、地面に達した。」（上向き正、屋上を原点）",
     options:["y ＝ ＋h","y ＝ −h","y ＝ 0"],answer:1,
     explain:"地面は原点（屋上）より h だけ下なので、y ＝ −h です。"},
    {id:"ra5",type:"choice",prompt:"「空気抵抗は無視できるものとする。」",options:["加速度が g で一定","速度が一定","物体の質量が 0"],answer:0,
     explain:"重力だけを受けるので、加速度は g で一定。等加速度直線運動の式が使えます。"}
  ]},
  { title:"B. 正の向きと符号", qs:[
    {id:"rb1",type:"blanks",prompt:"上向きを正として、20 m/s で真上に投げ上げた。",text:"v₀ ＝ {0}　a ＝ {1}",
     options:[["−20 m/s","＋20 m/s"],["＋9.8 m/s²","−9.8 m/s²"]],answer:[1,1],
     explain:"投げた向き（上）が正なので v₀ は正。重力加速度は下向きなので a は負です。"},
    {id:"rb2",type:"blanks",prompt:"下向きを正として、5 m/s で真下に投げ下ろした。",text:"v₀ ＝ {0}　a ＝ {1}",
     options:[["＋5 m/s","−5 m/s"],["−9.8 m/s²","＋9.8 m/s²"]],answer:[0,1],
     explain:"下向きが正なので、v₀ も a も正です。"},
    {id:"rb3",type:"blanks",prompt:"上向き正で投げ上げた小球が、最高点を過ぎて落ちてくる間の符号は？",text:"v の符号：{0}　a の符号：{1}",
     options:[SGN,SGN],answer:[1,1],
     explain:"下向きに動くので v は負。a は投げた直後からずっと −g で負です。"},
    {id:"rb4",type:"choice",prompt:"同じ投げ上げ（20 m/s）を「下向き正」で解いてもよいか。",
     options:["よくない。投げ上げは必ず上向き正","よい。v₀ ＝ −20 m/s、a ＝ ＋9.8 m/s² とする","よい。v₀ ＝ ＋20 m/s、a ＝ ＋9.8 m/s² とする"],answer:1,
     explain:"正の向きはどちらにとってもよい。とった向きに合わせて v₀ と a の符号を決めることが大切です。"}
  ]},
  { title:"C. 正しいか、誤りか", lead:"空気抵抗は無視する。", qs:[
    {id:"rc1",type:"choice",prompt:"重い物体ほど速く落ちる。",options:TF,answer:1,
     explain:"誤り。g は質量によらないので、同じ高さから同時に落とせば同時に着きます。"},
    {id:"rc2",type:"choice",prompt:"投げ上げた物体の加速度は、上昇中は上向き、下降中は下向きである。",options:TF,answer:1,
     explain:"誤り。加速度はずっと下向きに g。上昇中は、上向きの速度が減っていくだけです。"},
    {id:"rc4",type:"choice",prompt:"投げ上げた物体が同じ高さを通るとき、上りと下りで速さは等しい。",options:TF,answer:0,
     explain:"正しい。向きは逆ですが、速さは等しくなります（v² − v₀² ＝ −2gy で y が同じなら v² も同じ）。"},
    {id:"rc3",type:"choice",prompt:"最高点では、物体の加速度は 0 である。",options:TF,answer:1,
     explain:"誤り。速度は 0 ですが、加速度は下向きに g のままです。"},
    {id:"rc5",type:"choice",prompt:"自由落下では、1 s ごとに速さが 9.8 m/s ずつ増える。",options:TF,answer:0,
     explain:"正しい。g ＝ 9.8 m/s² は「1 s あたり速度が 9.8 m/s 変わる」という意味です。"},
    {id:"rc6",type:"choice",prompt:"自由落下では、どの 1 s 間にも同じ距離だけ落ちる。",options:TF,answer:1,
     explain:"誤り。最初の 1 s で 4.9 m、次の 1 s で 14.7 m、その次で 24.5 m と、しだいに長くなります。"}
  ]},
  { title:"D. 問題文を表に置き換える", lead:"次の問題文を読み、表を完成させよ。解かなくてよい。上向き正、屋上を原点とする。",
    quote:"高さ 24.5 m のビルの屋上から、小球を鉛直上向きに 19.6 m/s で投げ上げた。小球が地面に達するまでの時間を求めよ。", qs:[
    {id:"rd1",type:"blanks",text:"v₀ ＝ {0}<br>a ＝ {1}<br>y ＝ {2}<br>v ＝ {3}",
     options:[["−19.6 m/s","＋19.6 m/s","0"],["−9.8 m/s²","＋9.8 m/s²","0"],["＋24.5 m","0","−24.5 m"],["0","わからない","＋19.6 m/s"]],answer:[1,0,2,1],
     explain:"上向き正なので v₀ は正、a は負。地面は屋上より下なので y は負。地面に達する直前の速度は書かれていません。"},
    {id:"rd2",type:"choice",prompt:"y に「＋24.5 m」と書いた生徒がいる。何が誤りか。",
     options:["y は出発点からの変位で、地面は屋上より下にあるので負になる","単位が違う","24.5 m ではなく 19.6 m を入れるべき"],answer:0,
     explain:"y は「地面からの高さ」ではなく「原点からの変位」です。"}
  ]},
  { title:"E. 投げ上げの v-t グラフを読む", lead:"上向き正で投げ上げたときの v-t グラフ。t₁ でグラフが t 軸と交わる。", figure:VT_GRAPH, qs:[
    {id:"re1",type:"blanks",text:"グラフの傾きは{0}を表し、その値は{1}である。",
     options:[["速度","加速度","高さ"],["＋9.8 m/s²","0","−9.8 m/s²"]],answer:[1,2],
     explain:"傾き ＝ 加速度 ＝ −g。上昇中も下降中も同じ傾きの1本の直線です。"},
    {id:"re2",type:"choice",prompt:"時刻 t₁ に、物体はどこにあるか。",options:["投げた点","最高点","地面"],answer:1,
     explain:"v ＝ 0 になる時刻なので最高点です。"},
    {id:"re3",type:"choice",prompt:"t 軸より上の三角形（青い部分）の面積は何を表すか。",options:["最高点に達するまでの時間","最高点での加速度","投げた点から最高点までの高さ"],answer:2,
     explain:"v-t グラフの面積は変位。上昇した高さを表します。"},
    {id:"re4",type:"choice",prompt:"時刻 2t₁ に物体はどこにあるか。",options:["投げた点","最高点","最高点と投げた点の中間"],answer:0,
     explain:"青と赤の面積が等しくなり、変位の合計が 0。投げた点に戻っています。"}
  ]}]
},
{ id:"dim", tab:"③次元", title:"③ 次元チェック",
  intro:"この単元は √ や分数を含む式が多く、次元チェックが特に役立ちます。g の次元は〔L〕/〔T〕²。",
  advice:"√ や分数を含む式を書いたら、右辺の単位を計算して確かめよう。",
  ref:{label:"次元の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", lead:"h は高さ、v₀ は初速度。", qs:[
    {id:"da1",type:"choice",prompt:"g × t",options:UNITQ,answer:0,two:true,explain:"(m/s²) × s ＝ m/s。速度です。"},
    {id:"da2",type:"choice",prompt:"v₀ ÷ g",options:UNITQ,answer:2,two:true,explain:"(m/s) ÷ (m/s²) ＝ s。最高点に達するまでの時間です。"},
    {id:"da3",type:"choice",prompt:"v₀² ÷ 2g",options:UNITQ,answer:1,two:true,explain:"(m²/s²) ÷ (m/s²) ＝ m。最高点の高さです。"},
    {id:"da4",type:"choice",prompt:"√(2h ÷ g)",options:UNITQ,answer:2,two:true,explain:"√(m ÷ (m/s²)) ＝ √(s²) ＝ s。自由落下の時間です。"},
    {id:"da5",type:"choice",prompt:"√(2gh)",options:UNITQ,answer:0,two:true,explain:"√((m/s²) × m) ＝ √(m²/s²) ＝ m/s。落下直前の速さです。"}
  ]},
  { title:"B. 式の次元を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、次元が合わないものをすべて選べ。",
     options:["t ＝ √(2h ÷ g)","t ＝ 2h ÷ g","H ＝ v₀² ÷ 2g","v ＝ 2gh","v ＝ √(2gh)"],answer:[1,3],
     explain:"2h ÷ g の単位は s²、2gh の単位は m²/s² で、どちらも左辺と合いません。√ を忘れた形です。"}
  ]},
  { title:"C. 次元チェックの限界", qs:[
    {id:"dc1",type:"choice",prompt:"投げ上げの最高点の高さを「H ＝ v₀² ÷ g」と書いた。次元は合っている。何が誤りか。",
     options:["係数 ½ が抜けている","√ が抜けている","g の符号が逆"],answer:0,
     explain:"正しくは H ＝ v₀² ÷ 2g。係数には次元がないので、次元チェックでは見つかりません。"},
    {id:"dc2",type:"choice",prompt:"最高点に達する時間を「t ＝ v₀ ÷ 2g」と書いた場合はどうか。",
     options:["次元が合わないので誤り","次元は合うが、正しくは t ＝ v₀ ÷ g","正しい"],answer:1,
     explain:"0 ＝ v₀ − gt より t ＝ v₀ ÷ g。係数の誤りは次元チェックでは見つけられません。"}
  ]},
  { title:"D. 答案の誤りを見つける", lead:"問「高さ 19.6 m から小球を静かにはなした。地面に達する直前の速さを求めよ。」",
    quote:"答案：v ＝ gh ＝ 9.8 × 19.6 ≒ 192 m/s", qs:[
    {id:"dd1",type:"choice",prompt:"単位だけを手がかりにすると、この答案の誤りは何か。",
     options:["gh の単位は m²/s² で、速さの単位にならない","g の値が違う","有効数字が違う"],answer:0,
     explain:"(m/s²) × m ＝ m²/s²。速さにするには √ が必要です。"},
    {id:"dd2",type:"num",prompt:"正しい速さを求めよ。",answer:19.6,tol:0.1,unit:"m/s",
     traps:{"192":"gh の単位は m²/s² です。v² − v₀² ＝ 2gy から考えよう。","13.9":"2 を忘れていませんか。v ＝ √(2gh) です。","384":"√ をとり忘れていませんか。"},
     explain:"v ＝ √(2gh) ＝ √(2 × 9.8 × 19.6) ＝ √384.16 ＝ 19.6 m/s。"}
  ]},
  { title:"E. 数値の感覚をもつ", qs:[
    {id:"de1",type:"num",prompt:"g ＝ 9.8 m/s² は、「1 s ごとに速度が何 m/s ずつ下向きに変わる」ことを表すか。",answer:9.8,tol:0.01,unit:"m/s",
     explain:"m/s² ＝ (m/s)/s。1 s あたり 9.8 m/s ずつ変わります。"},
    {id:"de2",type:"num",prompt:"自由落下して 3.0 s 後の速さ 29.4 m/s は、約何 km/h か（整数で）。",answer:106,tol:1,unit:"km/h",
     traps:{"8":"3.6 で割っていませんか。m/s → km/h は × 3.6 です。"},
     explain:"29.4 × 3600 ÷ 1000 ＝ 29.4 × 3.6 ≒ 106 km/h。"}
  ]}]
},
{ id:"step", tab:"④手順", title:"④ 手順固定の演習",
  intro:"前単元と同じ7ステップで解きます。g ＝ 9.8 m/s²。新しい点は、ステップ1で a の符号も決まること、ステップ7で不要な解を捨てること（解の吟味）です。",
  advice:"正の向きを決めた時点で a の符号を書き、2次方程式の解は必ず吟味しよう。",
  ref:{label:"符号と3式を見る", html:FORMULAS},
  groups:[
  { title:"問題1（すべてのステップ）",
    quote:"高さ 44.1 m のビルの屋上から、小球を静かにはなした。(1) 地面に達するまでの時間、(2) 地面に達する直前の速さを求めよ。", qs:[
    {id:"s11",type:"choice",prompt:"ステップ1　正の向きと a（ここでは運動の向きを正にする）。",
     options:["上向き正、a ＝ −g","下向き正、a ＝ ＋g","下向き正、a ＝ −g"],answer:1,
     explain:"落ちる向き（下）を正にすると、y も v も正で扱えます。"},
    {id:"s12",type:"blanks",prompt:"ステップ2　既知・未知を整理する（原点は屋上）。",text:"v₀ ＝ {0}　a ＝ {1}　y ＝ {2}　v ＝ {3}　t ＝ {4}",
     options:[["0","44.1 m/s","わからない"],["−9.8 m/s²","＋9.8 m/s²","0"],["−44.1 m","わからない","＋44.1 m"],["0","わからない","9.8 m/s"],["わからない","44.1 s","0"]],answer:[0,1,2,1,0],
     explain:"「静かに」→ v₀ ＝ 0。下向き正なので a も y も正。v と t が求める量です。"},
    {id:"s13",type:"choice",prompt:"ステップ3　(1) で使う式とその理由。",
     options:["v がわからず求めもしないので y ＝ ½gt²","t を求めるので v ＝ gt","y がわかっているので v² ＝ 2gy"],answer:0,
     explain:"(1) では v は不要。v を含まない式を選びます。"},
    {id:"s14",type:"choice",prompt:"ステップ4　t を文字式で表す。",options:["t ＝ 2y ÷ g","t ＝ √(2y ÷ g)","t ＝ √(y ÷ 2g)"],answer:1,
     explain:"y ＝ ½gt² より t² ＝ 2y ÷ g。t ＞ 0 なので t ＝ √(2y ÷ g)。"},
    {id:"s15",type:"choice",prompt:"ステップ5　右辺の単位を確かめる。",options:["√(m ÷ (m/s²)) ＝ s","m ÷ (m/s²) ＝ s²","√(m × m/s²) ＝ m/s"],answer:0,
     explain:"√(s²) ＝ s。時間の単位になっています。"},
    {id:"s16",type:"num",prompt:"ステップ6　(1) 地面に達するまでの時間",answer:3.0,tol:0.05,unit:"s",
     traps:{"9":"√ をとり忘れていませんか。","4.5":"2y ÷ g の 2 を忘れ、√ もとっていないようです。","2.1":"2 が抜けていませんか。t ＝ √(2y ÷ g) です。"},
     explain:"t ＝ √(2 × 44.1 ÷ 9.8) ＝ √9.0 ＝ 3.0 s。"},
    {id:"s17",type:"num",prompt:"ステップ6　(2) 地面に達する直前の速さ",answer:29.4,tol:0.2,unit:"m/s",
     traps:{"432":"gh では速さになりません（単位は m²/s²）。","14.7":"v ＝ gt です。½ は付きません。"},
     explain:"v ＝ gt ＝ 9.8 × 3.0 ＝ 29.4 m/s（v ＝ √(2gy) でも同じ）。"},
    {id:"s18",type:"choice",prompt:"ステップ7　答えは妥当か。",
     options:["約 106 km/h。空気抵抗を無視しているので大きめだが、あり得る値","速すぎるので計算が誤っている","速さは質量によるので判断できない"],answer:0,
     explain:"44 m（ビル約 14 階）からの落下。空気抵抗を無視した理想的な値として妥当です。"}
  ]},
  { title:"問題2（ステップ1〜3だけ誘導）",
    quote:"小球を鉛直上向きに 19.6 m/s で投げ上げた。(1) 最高点に達するまでの時間、(2) 最高点の高さ、(3) 投げた点に戻るまでの時間を求めよ。", qs:[
    {id:"s21",type:"blanks",prompt:"ステップ1・2　上向き正、投げた点を原点として整理する（(1)(2) 用）。",text:"v₀ ＝ {0}　a ＝ {1}　最高点の v ＝ {2}",
     options:[["＋19.6 m/s","−19.6 m/s","0"],["＋9.8 m/s²","0","−9.8 m/s²"],["−19.6 m/s","0","わからない"]],answer:[0,2,1],
     explain:"上向き正で a ＝ −g。「最高点」→ v ＝ 0。"},
    {id:"s22",type:"blanks",prompt:"ステップ3　それぞれで使う式。",text:"(1) {0}<br>(2) {1}<br>(3) {2}",
     options:[["v ＝ v₀ − gt","y ＝ v₀t − ½gt²","v² − v₀² ＝ −2gy"],["v ＝ v₀ − gt","y ＝ v₀t − ½gt²","v² − v₀² ＝ −2gy"],["v ＝ v₀ − gt（v ＝ 0）","y ＝ v₀t − ½gt²（y ＝ 0）","v² − v₀² ＝ −2gy（v ＝ 0）"]],answer:[0,2,1],
     explain:"(1) y は不要 → y を含まない式。(2) t は不要 → t を含まない式。(3) 投げた点に戻る → y ＝ 0 を入れて t を求める。"},
    {id:"s23",type:"num",prompt:"(1) 最高点に達するまでの時間",answer:2.0,tol:0.05,unit:"s",
     traps:{"1":"0 ＝ v₀ − gt より t ＝ v₀ ÷ g です。2 で割っていませんか。"},explain:"0 ＝ 19.6 − 9.8t より t ＝ 2.0 s。"},
    {id:"s24",type:"num",prompt:"(2) 最高点の高さ",answer:19.6,tol:0.1,unit:"m",
     traps:{"39.2":"2g で割っていますか。y ＝ v₀² ÷ 2g です。","-19.6":"上向き正なら、最高点の y は正です。"},explain:"0 − 19.6² ＝ −2 × 9.8 × y より y ＝ 19.6 m。"},
    {id:"s25",type:"num",prompt:"(3) 投げた点に戻るまでの時間",answer:4.0,tol:0.05,unit:"s",
     traps:{"0":"t ＝ 0 は投げた瞬間です。もう1つの解を選びます。","2":"それは最高点までの時間です。"},
     explain:"0 ＝ 19.6t − 4.9t² より t ＝ 0, 4.0。t ＝ 0 は投げた瞬間なので 4.0 s。"}
  ]},
  { title:"問題3（答えだけ入力・解の吟味）", lead:"紙に7ステップを書いて解き、答えを入力せよ。上向き正、屋上を原点とする。",
    quote:"高さ 24.5 m のビルの屋上から、小球を鉛直上向きに 19.6 m/s で投げ上げた。", qs:[
    {id:"s31",type:"num",prompt:"(1) 小球が地面に達するのは何秒後か。",answer:5.0,tol:0.05,unit:"s",
     traps:{"-1":"負の解は投げる前の時刻です。捨てましょう。"},
     explain:"−24.5 ＝ 19.6t − 4.9t² より t² − 4t − 5 ＝ 0、t ＝ 5.0, −1.0。投げる前は考えないので 5.0 s。"},
    {id:"s32",type:"num",prompt:"(2) 地面に達する直前の速度（符号つき）",answer:-29.4,tol:0.2,unit:"m/s",
     traps:{"29.4":"大きさは合っています。このとき小球はどちら向きに動いていますか。","68.6":"g の符号を確かめよう（上向き正なら v ＝ v₀ − gt）。"},
     explain:"v ＝ 19.6 − 9.8 × 5.0 ＝ −29.4 m/s（下向きに 29.4 m/s）。"},
    {id:"s33",type:"num",prompt:"(3) 最高点の、地面からの高さ",answer:44.1,tol:0.2,unit:"m",
     traps:{"19.6":"それは投げた点（屋上）からの高さです。問われているのは地面からの高さです。"},
     explain:"屋上から 19.6 m 上なので、24.5 ＋ 19.6 ＝ 44.1 m。問題1と同じ高さです。"},
    {id:"s34",type:"checklist",prompt:"解き終えたら点検しよう（採点には入りません）。",
     items:["正の向きと原点を決め、a の符号を書いた","「地面に達する」を y の値（符号つき）に置き換えた","2次方程式の解のうち、不要なものを理由をつけて捨てた","答えの符号を向きの言葉に直した","「投げた点からの高さ」と「地面からの高さ」を区別した"]},
    {id:"s35",type:"self",prompt:"問題3の小球は、最高点から地面まで何秒かかるか。問題1と比べて気づいたことを書け。",
     model:"最高点（地面から 44.1 m）で一瞬止まるので、そこからは問題1の自由落下と同じ運動になり 3.0 s かかる。上昇 2.0 s ＋ 落下 3.0 s ＝ 5.0 s で、(1) の答えと一致する。"}
  ]}]
},
{ id:"sum", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。「正の向き・a の符号・使う式」を選びます。",
  advice:"問題を読んだら、まず正の向きと a の符号、次に「わからず求めもしない量」を決めよう。",
  ref:{label:"符号と3式を見る", html:FORMULAS},
  groups:[{ title:"式と符号を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"小球を静かにはなし、2.0 s 後までに落ちた距離を求めたい。",
     options:["上向き正、a ＝ −g、v ＝ −gt","下向き正、a ＝ ＋g、y ＝ ½gt²","下向き正、a ＝ ＋g、v² ＝ 2gy"],answer:1,
     explain:"v は不要なので、v を含まない y ＝ ½gt²。"},
    {id:"m2",type:"choice",prompt:"上向きに投げ上げた小球の最高点の高さを求めたい。時間はわからない。",
     options:["上向き正、a ＝ −g、v ＝ 0 として v² − v₀² ＝ −2gy","上向き正、a ＝ ＋g、y ＝ v₀t ＋ ½gt²","上向き正、a ＝ 0、y ＝ v₀t"],answer:0,
     explain:"t が不要なので t を含まない式。最高点で v ＝ 0。"},
    {id:"m3",type:"choice",prompt:"高さ h の屋上から投げ上げた小球が地面に達するまでの時間を求めたい（上向き正、屋上が原点）。",
     options:["y ＝ ＋h として v ＝ v₀ − gt","y ＝ −h として y ＝ v₀t − ½gt²、正の解をとる","y ＝ 0 として y ＝ v₀t − ½gt²"],answer:1,
     explain:"地面は原点より下なので y ＝ −h。t の2次方程式になるので、正の解をとります。"},
    {id:"m4",type:"choice",prompt:"質量が 2 倍の小球で問題1を解き直すと、答えはどうなるか。",
     options:["時間が ½ 倍になる","速さが 2 倍になる","変わらない"],answer:2,
     explain:"g は質量によらないので、答えは変わりません。"},
    {id:"m5",type:"choice",prompt:"空気抵抗が無視できない羽毛の落下を、この単元の式で扱えるか。",
     options:["扱える。g を小さくすればよい","扱えない。加速度が一定でないから","扱える。質量が小さいだけだから"],answer:1,
     explain:"空気抵抗があると加速度が変化するので、等加速度直線運動の式は使えません。"},
    {id:"m6",type:"blanks",prompt:"次の文を完成させよ。",text:"落体の運動の式は、前の単元の{0}の{1}を{2}に置き換えたものである。",
     options:[["運動方程式","等加速度直線運動の3式","平均の速度の式"],["速度 v","時間 t","加速度 a"],["±g","v₀","h"]],answer:[1,2,0],
     explain:"新しい式は覚えなくてよい。正の向きを決め、a ＝ ＋g か −g を入れるだけです。"}
  ]}]
}
];

registerUnit({
  id: "free-fall",
  title: "落体の運動",
  sections: SECTIONS
});
})();
