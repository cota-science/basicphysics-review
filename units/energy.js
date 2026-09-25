/*
 * 単元：仕事と力学的エネルギー
 * 仕事は「どの力が・どの物体に」するものかを言う。保存が使えるかは
 * 「重力・弾性力以外の力が仕事をするか」で判定する。g ＝ 9.8 m/s²。
 */
(function(){

const DEF_TABLE = `<div class="tbl"><table>
<tr><th>用語</th><th>定義</th><th>式・単位</th></tr>
<tr><td>仕事</td><td>力 F が物体にする仕事。θ は力の向きと移動の向きのなす角</td><td>W ＝ Fx cos θ〔J〕</td></tr>
<tr><td>仕事の正負</td><td>θ ＜ 90° で正、θ ＝ 90° で 0、θ ＞ 90° で負</td><td>―</td></tr>
<tr><td>仕事率</td><td>単位時間あたりの仕事</td><td>P ＝ W ÷ t〔W〕</td></tr>
<tr><td>運動エネルギー</td><td>運動している物体がもつエネルギー</td><td>K ＝ ½mv²〔J〕</td></tr>
<tr><td>仕事と運動エネルギー</td><td>運動エネルギーの変化 ＝ された仕事の和</td><td>½mv² − ½mv₀² ＝ W</td></tr>
<tr><td>重力による位置エネルギー</td><td>基準面から高さ h にある物体がもつ</td><td>U ＝ mgh〔J〕</td></tr>
<tr><td>弾性力による位置エネルギー</td><td>x だけ変形したばねがもつ</td><td>U ＝ ½kx²〔J〕</td></tr>
<tr><td>力学的エネルギー保存</td><td>重力・弾性力以外の力が仕事をしないとき</td><td>K ＋ U ＝ 一定</td></tr>
</table></div><p>重力・弾性力以外の力が仕事をするときは、(K ＋ U)後 − (K ＋ U)前 ＝ その力がした仕事。</p>`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th></tr>
<tr><td>仕事 W、エネルギー K, U</td><td>J ＝ N·m ＝ kg·m²/s²</td></tr>
<tr><td>仕事率 P</td><td>W（ワット）＝ J/s</td></tr>
<tr><td>ばね定数 k</td><td>N/m</td></tr></table></div>`;
const STEPS = `<p>1 着目物体と「始め」「終わり」の状態 → 2 受ける力と、その仕事の正・負・0 → 3 保存が使えるか判定し、基準面を決める → 4 式を立てる → 5 文字式・次元 → 6 数値 → 7 妥当性</p>`;
const SPRING_SLOPE = `<svg class="graph" viewBox="0 0 320 150" role="img" aria-label="左の壁につけたばねを縮め、その先に物体を置いた図。右側になめらかな斜面がある。">
<rect x="10" y="40" width="10" height="90" fill="currentColor" opacity=".55"/>
<line x1="20" y1="130" x2="300" y2="130" stroke="currentColor" stroke-width="2"/>
<polyline points="20,112 28,102 36,122 44,102 52,122 60,102 68,122 76,112" fill="none" stroke="var(--blue)" stroke-width="2"/>
<rect x="76" y="96" width="34" height="34" fill="var(--red)" opacity=".3" stroke="var(--red)"/>
<text x="80" y="90" font-size="12" fill="currentColor">0.50 kg</text>
<polygon points="200,130 300,130 300,60" fill="currentColor" opacity=".15" stroke="currentColor"/>
<text x="30" y="92" font-size="12" fill="var(--blue)">k ＝ 200 N/m</text>
</svg>`;
const TF = ["正しい","誤り"];
const SGN = ["正","負","0"];
const UNITQ = ["J（仕事・エネルギー）","W（仕事率）","m/s（速さ）","N（力）"];
const YN = ["使える","使えない"];

const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:"仕事の定義には、必ず「どの力が」「どの物体に」を入れて覚えます。",
  advice:"仕事の定義（θ は力と移動のなす角）と、保存が成り立つ条件を覚え直そう。",
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"blanks",text:"仕事は W ＝ Fx cos θ で、θ は{0}の向きと{1}の向きのなす角である。単位は{2}。",
     options:[["力","速度","加速度"],["加速度","移動","重力"],["N","W","J"]],answer:[0,1,2],
     explain:"θ は「力の向き」と「移動の向き」の角。仕事の単位は J（ジュール）です。"},
    {id:"d2",type:"choice",prompt:"力の向きと移動の向きが垂直なとき、その力がする仕事は？",options:["力の大きさ × 距離","0","負"],answer:1,
     explain:"cos 90° ＝ 0。垂直抗力や糸の張力は、多くの場合仕事をしません。"},
    {id:"d3",type:"choice",prompt:"動摩擦力が、すべっている物体にする仕事は？",options:SGN,answer:1,
     explain:"動摩擦力は移動と逆向き（θ ＝ 180°）なので、負の仕事をします。"},
    {id:"d4",type:"choice",prompt:"仕事率の単位 W（ワット）は何に等しいか。",options:["J × s","J ÷ s","N × m"],answer:1,
     explain:"仕事率は単位時間あたりの仕事なので、J/s。"},
    {id:"d5",type:"num",prompt:"物体の速さが 2 倍になると、運動エネルギーは何倍になるか。",answer:4,tol:0.01,unit:"倍",
     traps:{"2":"K ＝ ½mv² なので、速さの 2 乗に比例します。"},explain:"K は v² に比例するので 2² ＝ 4 倍。"},
    {id:"d6",type:"blanks",text:"力学的エネルギー保存の法則は、{0}と{1}以外の力が仕事をしないときに成り立つ。",
     options:[["重力","摩擦力","垂直抗力"],["張力","弾性力","人の力"]],answer:[0,1],
     explain:"重力と弾性力以外の力（摩擦力、人の力など）が仕事をすると、その分だけ力学的エネルギーが変化します。"}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル",
  intro:"「仕事をする・される」を、どの力の仕事か・どの物体がされる仕事かに分けて読みます。",
  advice:"仕事を考えるときは「どの力の仕事か」を言い、力と移動の向きの角度で正・負・0 を判定しよう。",
  groups:[
  { title:"A. 「仕事をする」「仕事をされる」を読む", qs:[
    {id:"ra1",type:"choice",prompt:"「重力が物体にする仕事」と同じ意味の文は？",
     options:["物体が重力にする仕事","物体は重力から仕事をされる","物体は地球に仕事をする"],answer:1,
     explain:"「A が B に仕事をする」＝「B は A から仕事をされる」。"},
    {id:"ra2",type:"choice",prompt:"「人が荷物にした仕事」とは、正確には何がする仕事か。",
     options:["人が荷物に及ぼす力がする仕事","人の体全体のエネルギー","荷物が受ける重力がする仕事"],answer:0,
     explain:"物理の仕事は「力」がするもの。人が荷物に及ぼす力の仕事のことです。"},
    {id:"ra3",type:"num",prompt:"荷物を持ったまま、水平な廊下を一定の速さで 10 m 歩いた。人が荷物を支える力がした仕事は？",answer:0,tol:0.001,unit:"J",
     explain:"支える力は鉛直上向き、移動は水平で θ ＝ 90°。仕事は 0 です。"},
    {id:"ra4",type:"num",prompt:"重い荷物を持ち上げたまま、その場で 1 分間じっとしていた。人が荷物にした仕事は？",answer:0,tol:0.001,unit:"J",
     explain:"荷物は移動していないので仕事は 0。疲れるのは筋肉の中で起きていることです。"}
  ]},
  { title:"B. 仕事の符号を判定する", lead:"次の力が物体にする仕事は、正・負・0 のどれか。", qs:[
    {id:"rb1",type:"choice",prompt:"粗い水平面をすべっている物体に、動摩擦力がする仕事",options:SGN,answer:1,explain:"移動と逆向き（θ ＝ 180°）なので負。"},
    {id:"rb2",type:"choice",prompt:"水平面をすべっている物体に、垂直抗力がする仕事",options:SGN,answer:2,explain:"移動と垂直なので 0。"},
    {id:"rb3",type:"choice",prompt:"投げ上げたボールが上昇する間に、重力がボールにする仕事",options:SGN,answer:1,explain:"重力は下向き、移動は上向きなので負。ボールは減速します。"},
    {id:"rb4",type:"choice",prompt:"同じボールが落下する間に、重力がボールにする仕事",options:SGN,answer:0,explain:"重力と移動が同じ向きなので正。ボールは加速します。"},
    {id:"rb5",type:"choice",prompt:"振り子のおもりが振れている間に、糸の張力がおもりにする仕事",options:SGN,answer:2,explain:"張力はいつも移動の向き（円の接線）と垂直なので 0。"}
  ]},
  { title:"C. 基準面を読む", lead:"床からの高さ 0.80 m の机の上に、質量 1.0 kg の物体がある。", qs:[
    {id:"rc1",type:"choice",prompt:"床を基準面とすると、物体の重力による位置エネルギーは？",options:SGN,answer:0,explain:"基準面より上にあるので正（mgh ≒ 7.8 J）。"},
    {id:"rc2",type:"num",prompt:"机の面を基準面とすると、位置エネルギーはいくらか。",answer:0,tol:0.001,unit:"J",
     traps:{"7.84":"基準面が机の面なので、高さ h ＝ 0 です。"},explain:"基準面上にあるので h ＝ 0、U ＝ 0。"},
    {id:"rc3",type:"choice",prompt:"物体を机から床に落とすとき、位置エネルギーの減少量は基準面のとり方で変わるか。",
     options:["変わる","変わらない"],answer:1,explain:"位置エネルギーの値は基準面で変わりますが、差（減少量）は変わりません。"}
  ]},
  { title:"D. 正しいか、誤りか", qs:[
    {id:"rd1",type:"choice",prompt:"物体を支えて静止させているとき、支える力は仕事をしていない。",options:TF,answer:0,explain:"正しい。移動がないので仕事は 0。"},
    {id:"rd2",type:"choice",prompt:"速さが 2 倍になると、運動エネルギーも 2 倍になる。",options:TF,answer:1,explain:"誤り。v² に比例するので 4 倍。"},
    {id:"rd3",type:"choice",prompt:"位置エネルギーの値は、基準面のとり方によって変わる。",options:TF,answer:0,explain:"正しい。ただし、2点間の差は変わりません。"},
    {id:"rd4",type:"choice",prompt:"力学的エネルギー保存の法則は、摩擦があっても成り立つ。",options:TF,answer:1,explain:"誤り。摩擦力が負の仕事をするので、力学的エネルギーは減ります。"},
    {id:"rd5",type:"choice",prompt:"同じ高さから、なめらかな斜面をすべり下りても自由落下しても、床に着くときの速さは等しい。",options:TF,answer:0,
     explain:"正しい。どちらも仕事をするのは重力だけなので、mgh ＝ ½mv² で同じ速さになります（向きは違います）。"},
    {id:"rd6",type:"choice",prompt:"仕事率が大きいほど、した仕事も必ず大きい。",options:TF,answer:1,explain:"誤り。仕事 ＝ 仕事率 × 時間。時間が短ければ仕事は小さくなります。"}
  ]},
  { title:"E. 力学的エネルギー保存が使えるか", lead:"空気抵抗は無視する。", qs:[
    {id:"re1",type:"choice",prompt:"なめらかな曲面を物体がすべり下りる。",options:YN,answer:0,explain:"垂直抗力は仕事をしないので、仕事をするのは重力だけ。使えます。"},
    {id:"re2",type:"choice",prompt:"粗い水平面上を物体がすべって止まる。",options:YN,answer:1,explain:"動摩擦力が負の仕事をするので使えません。"},
    {id:"re3",type:"choice",prompt:"糸につるしたおもりが振り子運動をする。",options:YN,answer:0,explain:"張力は仕事をしないので使えます。"},
    {id:"re4",type:"choice",prompt:"人が荷物を一定の速さで持ち上げる。",options:YN,answer:1,explain:"人が荷物に及ぼす力が正の仕事をするので使えません（力学的エネルギーは増える）。"},
    {id:"re5",type:"choice",prompt:"なめらかな水平面上で、ばねに押し出された物体が動き出す。",options:YN,answer:0,explain:"仕事をするのは弾性力だけなので使えます。"}
  ]}]
},
{ id:"dim", tab:"③次元", title:"③ 次元チェック",
  intro:"仕事もエネルギーも単位は J ＝ N·m ＝ kg·m²/s²。式の各項がすべて J になっているかで確かめます。",
  advice:"½mv² と ½kx² の2乗を忘れていないか、各項の単位が J になっているかを確かめよう。",
  ref:{label:"単位の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", qs:[
    {id:"da1",type:"choice",prompt:"F × x",options:UNITQ,answer:0,two:true,explain:"N × m ＝ J。仕事です。"},
    {id:"da2",type:"choice",prompt:"W ÷ t（W は仕事）",options:UNITQ,answer:1,two:true,explain:"J ÷ s ＝ W。仕事率です。"},
    {id:"da3",type:"choice",prompt:"½mv²",options:UNITQ,answer:0,two:true,explain:"kg × (m/s)² ＝ kg·m²/s² ＝ J。"},
    {id:"da4",type:"choice",prompt:"mgh",options:UNITQ,answer:0,two:true,explain:"kg × m/s² × m ＝ J。"},
    {id:"da5",type:"choice",prompt:"√(2K ÷ m)（K は運動エネルギー）",options:UNITQ,answer:2,two:true,explain:"√(J ÷ kg) ＝ √(m²/s²) ＝ m/s。"}
  ]},
  { title:"B. 式の次元を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、次元が合わないものをすべて選べ（P は仕事率、W は仕事）。",
     options:["K ＝ ½mv","U ＝ mgh","U ＝ ½kx","v ＝ √(2gh)","P ＝ W × t","P ＝ Fv"],answer:[0,2,4],
     explain:"½mv は kg·m/s、½kx は N、W × t は J·s で、いずれも左辺と合いません。"}
  ]},
  { title:"C. 次元チェックの限界", lead:"高さ h からなめらかな斜面をすべり下りた物体の速さを「v ＝ √(gh)」と書いた。次元は合っている。", qs:[
    {id:"dc1",type:"choice",prompt:"正しい式と、誤りに気づく方法は？",
     options:["v ＝ √(2gh)。mgh ＝ ½mv² に戻るか、落体の v² ＝ 2gh と比べる","v ＝ √(gh) のままで正しい","v ＝ 2gh。次元を確かめ直す"],answer:0,
     explain:"係数の誤りは次元では見つかりません。式を立てた根拠に戻るか、既習の結果と比べます。"}
  ]},
  { title:"D. 答案の誤りを見つける", lead:"問「質量 2.0 kg の物体が速さ 3.0 m/s で動いている。運動エネルギーを求めよ。」",
    quote:"答案：K ＝ ½mv ＝ ½ × 2.0 × 3.0 ＝ 3.0 J", qs:[
    {id:"dd1",type:"choice",prompt:"単位だけを手がかりにすると、この答案の誤りは何か。",
     options:["½mv の単位は kg·m/s で、J にならない","½ が不要","質量の単位が違う"],answer:0,explain:"v を 2 乗しないと J になりません。"},
    {id:"dd2",type:"num",prompt:"正しい運動エネルギーを求めよ。",answer:9.0,tol:0.05,unit:"J",
     traps:{"3":"v を 2 乗していますか。","18":"½ を忘れていませんか。"},explain:"K ＝ ½ × 2.0 × 3.0² ＝ 9.0 J。"}
  ]},
  { title:"E. 数値の感覚をもつ", qs:[
    {id:"de1",type:"num",prompt:"電気料金で使う 1 kWh は、何 × 10⁶ J か。",answer:3.6,tol:0.01,unit:"× 10⁶ J",
     traps:{"1":"1 kWh ＝ 1000 W × 3600 s です。","0.0036":"k（1000）と h（3600 s）の両方を掛けます。"},
     explain:"1000 J/s × 3600 s ＝ 3.6 × 10⁶ J。"},
    {id:"de2",type:"num",prompt:"質量 50 kg の人が、高さ 3.0 m の階段を 6.0 s で上った。重力に逆らってした仕事の仕事率は何 W か（有効数字2桁）。",answer:245,tol:6,unit:"W",
     traps:{"1470":"それは仕事です。仕事率は仕事 ÷ 時間。","25":"質量ではなく重力 mg を使います。","8820":"時間で割ります。"},
     explain:"仕事 50 × 9.8 × 3.0 ＝ 1470 J、仕事率 1470 ÷ 6.0 ≒ 2.5 × 10² W。"}
  ]}]
},
{ id:"step", tab:"④手順", title:"④ 手順固定の演習",
  intro:"エネルギーの問題は、途中の運動を追わず、「始め」と「終わり」を比べて解きます。g ＝ 9.8 m/s²。",
  advice:"受ける力ごとに仕事の正・負・0 を判定し、保存が使えるかを確かめてから式を立てよう。",
  ref:{label:"7ステップを見る", html:STEPS},
  groups:[
  { title:"問題1（すべてのステップ）",
    quote:"質量 2.0 kg の物体を、床からの高さ 5.0 m の位置で静かにはなした。物体はなめらかな曲面をすべり下り、床の高さに達した。このときの速さを求めよ。", qs:[
    {id:"s11",type:"blanks",prompt:"ステップ1　始めと終わりの状態を整理する（床を基準面とする）。",text:"始め：高さ {0}、速さ {1}<br>終わり：高さ {2}、速さ v",
     options:[["0","5.0 m","2.0 m"],["0","5.0 m/s","わからない"],["5.0 m","0","わからない"]],answer:[1,0,1],
     explain:"「静かにはなした」→ 始めの速さ 0。終わりは床の高さなので h ＝ 0。"},
    {id:"s12",type:"blanks",prompt:"ステップ2　受ける力と、その仕事。",text:"重力がする仕事：{0}<br>垂直抗力がする仕事：{1}",
     options:[SGN,SGN],answer:[0,2],explain:"重力は移動の下向き成分と同じ向きで正。垂直抗力は曲面に垂直で 0。"},
    {id:"s13",type:"choice",prompt:"ステップ3・4　使う関係と式。",
     options:["保存が使える：mgh ＝ ½mv²","保存は使えない：mgh ＝ ½mv² − W","保存が使える：mgh ＝ mv"],answer:0,
     explain:"重力以外に仕事をする力がないので、力学的エネルギー保存。"},
    {id:"s14",type:"choice",prompt:"ステップ5　v を文字式で表す。",options:["v ＝ √(gh)","v ＝ √(2gh)","v ＝ 2gh"],answer:1,
     explain:"mgh ＝ ½mv² の両辺を m で割ると v² ＝ 2gh。単位は √(m/s² × m) ＝ m/s。"},
    {id:"s15",type:"num",prompt:"ステップ6　床に達したときの速さ（有効数字2桁）",answer:9.9,tol:0.05,unit:"m/s",
     traps:{"98":"√ をとり忘れていませんか。","7":"2 が抜けていませんか。v ＝ √(2gh)。","14":"質量 2.0 kg を掛けていませんか。m は約分で消えます。"},
     explain:"v ＝ √(2 × 9.8 × 5.0) ＝ √98 ≒ 9.9 m/s。"},
    {id:"s16",type:"choice",prompt:"ステップ7　質量を 2 倍にすると、速さはどうなるか。",options:["2 倍","√2 倍","変わらない"],answer:2,
     explain:"m が約分で消えるので、質量によりません。同じ高さからの自由落下と同じ速さです。"}
  ]},
  { title:"問題2（前半だけ誘導）",
    quote:"質量 2.0 kg の物体が、粗い水平面上を速さ 6.0 m/s ですべり出した。動摩擦係数を 0.30 とする。物体が止まるまでにすべる距離を、有効数字2桁で求めよ。", qs:[
    {id:"s21",type:"blanks",prompt:"ステップ2　受ける力と、その仕事。",text:"重力：{0}　垂直抗力：{1}　動摩擦力：{2}",
     options:[SGN,SGN,SGN],answer:[2,2,1],explain:"重力と垂直抗力は移動と垂直で 0。動摩擦力は移動と逆向きで負。"},
    {id:"s22",type:"choice",prompt:"ステップ3　力学的エネルギー保存は使えるか。",
     options:["使える","使えない。動摩擦力が負の仕事をする"],answer:1,
     explain:"重力・弾性力以外の力（動摩擦力）が仕事をするので、仕事と運動エネルギーの関係を使います。"},
    {id:"s23",type:"choice",prompt:"ステップ4　式を立てる（x はすべる距離）。",
     options:["0 − ½mv₀² ＝ −μ′mg × x","½mv₀² ＝ mgx","0 − ½mv₀² ＝ μ′mg × x"],answer:0,
     explain:"運動エネルギーの変化（負）＝ 動摩擦力がした仕事（負）。"},
    {id:"s24",type:"num",prompt:"すべる距離",answer:6.1,tol:0.05,unit:"m",
     traps:{"12.2":"½ を忘れていませんか。","60":"動摩擦力は μ′mg。g を掛けていますか。","1":"v₀ を 2 乗していますか。"},
     explain:"x ＝ v₀² ÷ (2μ′g) ＝ 36 ÷ 5.88 ≒ 6.1 m。"}
  ]},
  { title:"問題3（答えだけ入力・弾性力と重力）", lead:"紙に7ステップを書いて解き、答えを入力せよ。",
    quote:"なめらかな水平面上で、ばね定数 200 N/m のばねを 0.10 m 押し縮め、その先に質量 0.50 kg の物体を置いて静かにはなした。物体はばねから離れた後、なめらかな斜面を上った。", figure:SPRING_SLOPE, qs:[
    {id:"s31",type:"num",prompt:"(1) ばねから離れたときの物体の速さ（有効数字2桁）",answer:2.0,tol:0.02,unit:"m/s",
     traps:{"6.3":"弾性力による位置エネルギーは ½kx² です（½kx ではありません）。","4":"√ をとり忘れていませんか。","2.8":"½kx² の ½ を忘れていませんか。"},
     explain:"½kx² ＝ ½mv² より v ＝ x√(k ÷ m) ＝ 0.10 × √400 ＝ 2.0 m/s。"},
    {id:"s32",type:"num",prompt:"(2) 物体が斜面を上る最高の高さ（水平面から、有効数字2桁）",answer:0.20,tol:0.006,unit:"m",
     traps:{"0.41":"½mv² ＝ mgh の ½ を確かめよう。","2":"½kx² ＝ mgh です。g を使っていますか。"},
     explain:"½mv² ＝ mgh より h ＝ v² ÷ 2g ＝ 4.0 ÷ 19.6 ≒ 0.20 m（½kx² ＝ mgh から直接求めてもよい）。"},
    {id:"s33",type:"checklist",prompt:"解き終えたら点検しよう（採点には入りません）。",
     items:["「始め」と「終わり」の状態を、高さ・速さ・ばねの縮みで書いた","受ける力ごとに、仕事が正・負・0 のどれかを判定した","保存が使えるか判定してから式を立てた","弾性力による位置エネルギーを ½kx² で書いた"]},
    {id:"s34",type:"self",prompt:"(2) の高さは、斜面の傾きの角度によるか。理由とともに答えよ。",
     model:"よらない。なめらかな斜面では垂直抗力は仕事をせず、ばねのエネルギー ½kx² がすべて mgh に変わるので、h は傾きに関係なく決まる。"}
  ]}]
},
{ id:"sum", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。「重力・弾性力以外の力が仕事をするか」で、使う関係を選びます。",
  advice:"式を立てる前に、重力・弾性力以外で仕事をする力があるかを必ず確かめよう。",
  groups:[{ title:"使う関係を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"なめらかな斜面を下りた物体の、下端での速さを求めたい。",
     options:["力学的エネルギー保存","仕事と運動エネルギーの関係（摩擦の仕事を入れる）"],answer:0,explain:"仕事をするのは重力だけ。"},
    {id:"m2",type:"choice",prompt:"粗い面をすべって止まるまでの距離を求めたい。",
     options:["力学的エネルギー保存","仕事と運動エネルギーの関係（摩擦の仕事を入れる）"],answer:1,explain:"動摩擦力が負の仕事をします。"},
    {id:"m3",type:"choice",prompt:"物体を一定の速さで高さ h まで引き上げるとき、人がした仕事を求めたい。",
     options:["人の仕事 ＝ mgh（運動エネルギーは変わらない）","人の仕事 ＝ ½mv²","人の仕事 ＝ 0（速さが一定だから）"],answer:0,
     explain:"速さが一定なので運動エネルギーは変わらず、人の仕事の分だけ位置エネルギーが mgh 増えます。"},
    {id:"m4",type:"choice",prompt:"高さ h から落とした物体の着地の速さは、運動の3式とエネルギーのどちらで解けるか。",
     options:["3式だけ","エネルギーだけ","どちらでも解ける"],answer:2,explain:"v² ＝ 2gh（3式）も mgh ＝ ½mv²（エネルギー）も同じ結果です。"},
    {id:"m5",type:"choice",prompt:"途中で速さが時間とともにどう変わるかを知りたい。エネルギーだけで分かるか。",
     options:["分かる","分からない。運動方程式と3式を使う"],answer:1,explain:"エネルギーは始めと終わりの比較で、時間を含みません。"},
    {id:"m6",type:"blanks",prompt:"次の文を完成させよ。",text:"{0}と{1}以外の力が仕事をしないときは力学的エネルギーが保存し、仕事をするときは、その仕事の分だけ力学的エネルギーが{2}する。",
     options:[["重力","摩擦力","垂直抗力"],["人の力","張力","弾性力"],["変化","保存","0 に"]],answer:[0,2,0],
     explain:"摩擦力が負の仕事をすれば減少し、人が正の仕事をすれば増加します。"}
  ]}]
}
];

registerUnit({
  id: "energy",
  title: "仕事と力学的エネルギー",
  sections: SECTIONS
});
})();
