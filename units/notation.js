/*
 * 単元：表記ルールと測定値の扱い
 * SI単位・接頭語、物理量は斜体／単位は立体、文字の並び順（数係数→ギリシャ文字→ラテン文字）、
 * 測定器の最小目盛りと有効数字、測定値の計算ルール、誤差、数値解に分数や根号を残さない、次元。
 * 斜体・立体を画面で見分けられるよう、この単元専用のスタイルを読み込み時に追加する。
 */
(function(){

/* 斜体（物理量）と立体（単位）の表示用スタイル */
if(typeof document !== "undefined" && !document.getElementById("notation-style")){
  const st = document.createElement("style");
  st.id = "notation-style";
  st.textContent = '.qv{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:italic;font-size:1.1em;padding:0 .04em}'
                 + '.qu{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:normal;font-size:1.1em}';
  document.head.appendChild(st);
}
const I = s => `<i class="qv">${s}</i>`;          // 物理量（斜体）
const U = s => `<span class="qu">${s}</span>`;    // 単位・数字（立体）

const DEF_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>SI基本単位</th></tr>
<tr><td>長さ</td><td>${U("m")}（メートル）</td></tr>
<tr><td>質量</td><td>${U("kg")}（キログラム）</td></tr>
<tr><td>時間</td><td>${U("s")}（秒）</td></tr>
<tr><td>電流</td><td>${U("A")}（アンペア）</td></tr>
<tr><td>温度</td><td>${U("K")}（ケルビン）</td></tr>
</table></div>
<div class="tbl"><table>
<tr><th>組立単位</th><th>基本単位で表すと</th></tr>
<tr><td>N（力）</td><td>kg·m/s²</td></tr>
<tr><td>J（仕事・エネルギー）＝ N·m</td><td>kg·m²/s²</td></tr>
<tr><td>W（仕事率）＝ J/s</td><td>kg·m²/s³</td></tr>
<tr><td>Pa（圧力）＝ N/m²</td><td>kg/(m·s²)</td></tr>
</table></div>
<div class="tbl"><table>
<tr><th>接頭語</th><th>倍数</th></tr>
<tr><td>G（ギガ）・M（メガ）・k（キロ）</td><td>10⁹・10⁶・10³</td></tr>
<tr><td>c（センチ）・m（ミリ）・μ（マイクロ）・n（ナノ）</td><td>10⁻²・10⁻³・10⁻⁶・10⁻⁹</td></tr>
</table></div>
<p>物理量 ＝ 数値 × 単位。物理量の記号は斜体（${I("m")}, ${I("v")}, ${I("F")}, ${I("μ")}）、単位・数字・sin などの関数名は立体（${U("2.0 kg")}）。</p>
<p>文字の並び：数係数 → ギリシャ文字 → ラテン文字（例 2π${I("r")}、${I("μ")}′${I("mg")}）。数値の答えには分数や根号を残さない。</p>
<p>目盛りは最小目盛りの 1/10 まで読む。足し算・引き算は末位が最も高いものに、掛け算・割り算は有効数字の桁数が最も少ないものにそろえる。途中の計算は1桁多く残し、最後に丸める。</p>`;
const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th><th>次元</th></tr>
<tr><td>速度</td><td>m/s</td><td>〔L〕〔T〕⁻¹</td></tr>
<tr><td>加速度</td><td>m/s²</td><td>〔L〕〔T〕⁻²</td></tr>
<tr><td>力</td><td>N ＝ kg·m/s²</td><td>〔M〕〔L〕〔T〕⁻²</td></tr>
<tr><td>エネルギー</td><td>J ＝ kg·m²/s²</td><td>〔M〕〔L〕²〔T〕⁻²</td></tr>
<tr><td>仕事率</td><td>W ＝ kg·m²/s³</td><td>〔M〕〔L〕²〔T〕⁻³</td></tr>
<tr><td>圧力</td><td>Pa ＝ kg/(m·s²)</td><td>〔M〕〔L〕⁻¹〔T〕⁻²</td></tr></table></div>`;
const STEPS = `<p>1 目盛りを読む（最小目盛りの 1/10 まで） → 2 有効数字の桁数を確認 → 3 SI単位にそろえる → 4 文字式で解く → 5 代入（途中は1桁多く） → 6 計算ルールで丸める → 7 表記を点検（斜体・立体、分数や根号なし）</p>`;
/* ものさしの拡大図：0 を物体の左端に合わせ、右端付近（2.0〜4.0 cm）を拡大。1 mm ＝ 12 px、端は 3.47 cm */
const RULER = (() => {
  let t = "";
  for(let i = 0; i <= 20; i++){
    const x = 40 + i*12, len = (i % 10 === 0) ? 26 : (i % 5 === 0 ? 18 : 11);
    t += `<line x1="${x}" y1="74" x2="${x}" y2="${74+len}" stroke="currentColor" stroke-width="${i%10===0?1.6:1}"/>`;
  }
  return `<svg class="graph" viewBox="0 0 320 140" role="img" aria-label="ものさしの拡大図。物体の右端が3.4 cmと3.5 cmの目盛りの間、3.4寄りから7割ほど進んだ位置にある。">
<rect x="0" y="34" width="216.4" height="38" fill="var(--blue)" opacity=".25" stroke="var(--blue)"/>
<text x="90" y="58" font-size="13" fill="currentColor">台車の移動距離</text>
<rect x="20" y="74" width="272" height="50" fill="none" stroke="currentColor" stroke-width="1"/>
${t}
<line x1="216.4" y1="30" x2="216.4" y2="96" stroke="var(--red)" stroke-width="1.5"/>
<text x="36" y="118" font-size="13" fill="currentColor">2</text><text x="156" y="118" font-size="13" fill="currentColor">3</text><text x="276" y="118" font-size="13" fill="currentColor">4</text>
<text x="297" y="118" font-size="12" fill="currentColor">cm</text>
<text x="4" y="20" font-size="11" fill="currentColor">（0 は物体の左端に合わせてある）</text>
</svg>`;
})();
const TF = ["正しい","誤り"];
const ITAL = ["イタリック（斜体）","レギュラー（立体）"];
const DIMQ = ["〔L〕〔T〕⁻¹","〔M〕〔L〕〔T〕⁻²","〔M〕〔L〕²〔T〕⁻²","〔M〕〔L〕²〔T〕⁻³","〔M〕〔L〕⁻¹〔T〕⁻²"];

const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:"単位・表記・有効数字・誤差の約束を正確に覚えます。どの単元の答えにも共通するルールです。",
  advice:"SI基本単位、接頭語、斜体と立体の区別、有効数字の計算ルールを定義カードで覚え直そう。",
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"blanks",text:"SI基本単位で、長さは{0}、質量は{1}、時間は{2}である。",
     options:[["cm","m","km"],["g","kg","N"],["s","min","h"]],answer:[1,1,0],
     explain:"長さ m、質量 kg、時間 s。質量の基本単位は g ではなく kg です（接頭語 k がついた形が基本単位）。"},
    {id:"d2",type:"multi",prompt:"次のうち、SI基本単位をすべて選べ。",
     options:["m","kg","s","A","K","N","J","g","cm"],answer:[0,1,2,3,4],
     explain:"N と J は組立単位、g と cm は基本単位に接頭語をつけた単位です。SI基本単位はほかに mol と cd があります。"},
    {id:"d3",type:"choice",prompt:"1 N をSI基本単位で表したものはどれか。",
     options:["kg·m/s²","kg·m²/s²","kg·m/s","g·cm/s²"],answer:0,
     explain:"運動方程式 ma ＝ F から、N ＝ kg × m/s²。kg·m²/s² は J です。"},
    {id:"d4",type:"blanks",text:"1 J ＝ 1 {0} ＝ 1 kg·m²/s²、1 W ＝ 1 {1} である。",
     options:[["N·m","N/m","N·s"],["J·s","J/s","N·m"]],answer:[0,1],
     explain:"仕事 ＝ 力 × 距離なので J ＝ N·m。仕事率 ＝ 仕事 ÷ 時間なので W ＝ J/s。"},
    {id:"d5",type:"blanks",text:"接頭語 k は{0}、m（ミリ）は{1}、μ（マイクロ）は{2}を表す。",
     options:[["10²","10³","10⁶"],["10⁻²","10⁻³","10⁻⁶"],["10⁻³","10⁻⁶","10⁻⁹"]],answer:[1,1,1],
     explain:"k ＝ 10³、m ＝ 10⁻³、μ ＝ 10⁻⁶。"},
    {id:"d6",type:"blanks",text:"物理量を表す文字は{0}で、単位記号は{1}で書く。",
     options:[ITAL,ITAL],answer:[0,1],
     explain:`物理量は斜体、単位は立体。たとえば ${I("m")} ＝ ${U("2.0 kg")} の斜体の ${I("m")} は質量、立体の ${U("m")} はメートルです。`},
    {id:"d7",type:"choice",prompt:"物理量は、何と何の積で表されるか。",
     options:["数値 × 単位","文字 × 単位","数値 × 有効数字"],answer:0,
     explain:"物理量 ＝ 数値 × 単位。単位のない数値だけでは物理量を表せません。"},
    {id:"d8",type:"blanks",text:"測定器の目盛りは、最小目盛りの{0}まで目分量で読む。測定値の最後の桁には誤差が{1}。",
     options:[["1/2","1/10","1/100"],["含まれる","含まれない"]],answer:[1,0],
     explain:"最小目盛り 1 mm のものさしなら 0.1 mm の位まで読みます。その最後の桁は目分量なので誤差を含みます。"},
    {id:"d9",type:"blanks",text:"足し算・引き算の結果は、末位が{0}測定値の位にそろえる。掛け算・割り算の結果は、有効数字の桁数が{1}測定値にそろえる。",
     options:[["最も高い","最も低い"],["最も少ない","最も多い"]],answer:[0,0],
     explain:"足し算・引き算は「位」をそろえ、掛け算・割り算は「桁数」をそろえます。"}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル",
  intro:"書かれた記号や数値が何を意味しているかを読み取ります。表記のルールは、意味を正しく伝えるための約束です。",
  advice:"斜体と立体、大文字と小文字の違いが意味の違いであることを確かめ、有効数字の数え方を練習しよう。",
  groups:[
  { title:"A. 斜体と立体を読み分ける", qs:[
    {id:"ra1",type:"choice",prompt:"「質量 m が 2.0 kg」を正しく表記したものはどれか。",
     options:[`${I("m")} ＝ ${U("2.0 kg")}`,`${U("m")} ＝ ${U("2.0")} ${I("kg")}`,`${I("m")} ＝ ${U("2.0")} ${I("kg")}`,`${U("m")} ＝ ${U("2.0 kg")}`],answer:0,
     explain:"物理量の記号 m は斜体、単位 kg と数字は立体で書きます。"},
    {id:"ra2",type:"blanks",prompt:`「${U("5 m")}」の ${U("m")} と、「${I("m")} ＝ ${U("5 kg")}」の ${I("m")} について答えよ。`,
     text:`${U("5 m")} の立体の m は{0}<br>${I("m")} ＝ ${U("5 kg")} の斜体の m は{1}`,
     options:[["単位メートル","物理量の質量","接頭語ミリ"],["単位メートル","物理量の質量","接頭語ミリ"]],answer:[0,1],
     explain:"同じ文字 m でも、立体なら単位メートル、斜体なら物理量（ここでは質量）。書体は意味を区別しています。"},
    {id:"ra3",type:"multi",prompt:"次のうち、立体（レギュラー）で書くものをすべて選べ。",
     options:["単位記号（m, kg, s）","物理量を表す文字（v, t, F）","数字","sin・cos などの関数名","接頭語（k, m, μ）"],answer:[0,2,3,4],
     explain:"斜体で書くのは物理量を表す文字だけ。単位、数字、関数名、接頭語は立体です。"}
  ]},
  { title:"B. 単位表記の誤りを見つける", qs:[
    {id:"rb1",type:"choice",prompt:"SIの表記ルールに従っているものはどれか。",
     options:[U("9.8 m/s²"),U("9.8 m/sec²"),U("9.8 M/s²"),U("9.8 ms⁻²")],answer:0,
     explain:"sec はSIの記号ではありません（s）。M は接頭語メガ。ms と続けて書くとミリ秒と読めてしまいます。"},
    {id:"rb2",type:"multi",prompt:"単位の表記として正しいものをすべて選べ。",
     options:[U("3 kg"),U("3 Kg"),U("5 km"),U("5 Km"),U("2 s"),U("2 sec"),U("10 kgs")],answer:[0,2,4],
     explain:"キロは小文字 k。大文字 K は温度の単位ケルビンです。秒は s。単位記号には複数形の s をつけません。"},
    {id:"rb3",type:"choice",prompt:"1 Mm（メガメートル）は、1 mm（ミリメートル）の何倍か。",
     options:["10³ 倍","10⁶ 倍","10⁹ 倍"],answer:2,
     explain:"1 Mm ＝ 10⁶ m、1 mm ＝ 10⁻³ m なので 10⁹ 倍。大文字と小文字で 10 億倍違います。"}
  ]},
  { title:"C. 文字の並び順", lead:"この教材では、文字式を「数係数 → ギリシャ文字 → ラテン文字」の順に書く。", qs:[
    {id:"rc1",type:"blanks",prompt:"並び順を答えよ。",text:"{0} → {1} → {2}",
     options:[["数係数","ギリシャ文字","ラテン文字"],["数係数","ギリシャ文字","ラテン文字"],["数係数","ギリシャ文字","ラテン文字"]],answer:[0,1,2],
     explain:"数係数 → ギリシャ文字 → ラテン文字。例：2πr、μ′mg。"},
    {id:"rc2",type:"choice",prompt:"動摩擦力の大きさを約束どおりに書いたものはどれか。",
     options:[`${I("μ")}′${I("mg")}`,`${I("mg")}${I("μ")}′`,`${I("m")}${I("μ")}′${I("g")}`],answer:0,
     explain:"ギリシャ文字 μ′ を先に、ラテン文字 m, g を後に書きます。"},
    {id:"rc3",type:"choice",prompt:`半径 ${I("r")} の円周の長さを約束どおりに書いたものはどれか。`,
     options:[`2π${I("r")}`,`2${I("r")}π`,`${I("r")}2π`],answer:0,
     explain:"数係数 2 → ギリシャ文字 π → ラテン文字 r の順です。"},
    {id:"rc4",type:"choice",prompt:"動摩擦力だけを受けてすべる物体の加速度の大きさを約束どおりに書いたものは？",
     options:[`${I("μ")}′${I("g")}`,`${I("g")}${I("μ")}′`],answer:0,
     explain:"ギリシャ文字 μ′ が先、ラテン文字 g が後です。"}
  ]},
  { title:"D. 有効数字を数える", qs:[
    {id:"rd1",type:"num",prompt:`${U("0.0250 m")} の有効数字は何桁か。`,answer:3,tol:0.001,unit:"桁",
     traps:{"5":"小数点の位置を示すだけの 0（位取りの 0）は数えません。","2":"小数点以下の末尾の 0 は、測った桁を示すので数えます。","4":"先頭の 0.0 は位取りの 0 です。"},
     explain:"2、5、0 の3桁。前の 0.0 は位取りの 0 なので数えず、末尾の 0 は数えます。"},
    {id:"rd2",type:"num",prompt:`${U("2.00 × 10³ kg")} の有効数字は何桁か。`,answer:3,tol:0.001,unit:"桁",
     traps:{"4":"10³ の部分は位取りを表すだけで、桁数には入りません。","1":"2.00 の末尾の 0 も数えます。"},
     explain:"2.00 の3桁。× 10³ は位取りを表す部分です。"},
    {id:"rd3",type:"choice",prompt:`「${U("1500 m")}」では有効数字があいまいになる。有効数字2桁であることをはっきり示す書き方はどれか。`,
     options:[U("1.5 × 10³ m"),U("15 × 10² m"),U("1.50 × 10³ m"),U("1500. m")],answer:0,
     explain:"□.□ × 10ⁿ の形で、有効数字の桁だけを書きます。1.50 × 10³ は3桁になります。"},
    {id:"rd4",type:"choice",prompt:`「${U("5.0 cm")}」と「${U("5 cm")}」は同じ意味か。`,
     options:["同じ。0 は書いても書かなくてもよい","違う。5.0 cm は 0.1 cm の位まで測った値（有効数字2桁）"],answer:1,
     explain:"末尾の 0 は「その位まで測った」という情報です。勝手に省いたり付け加えたりしません。"}
  ]},
  { title:"E. 誤差を読む", qs:[
    {id:"re1",type:"choice",prompt:`最小目盛り 1 mm のものさしで ${U("23.4 mm")} と読んだ。真の値はどの範囲にあると考えられるか。`,
     options:["23.35 mm 以上 23.45 mm 未満","23 mm 以上 24 mm 未満","23.4 mm ちょうど","23.3 mm 以上 23.5 mm 未満"],answer:0,
     explain:"最後の桁（0.1 mm の位）に誤差が含まれます。23.4 と表される範囲は 23.35 以上 23.45 未満です。"},
    {id:"re2",type:"num",prompt:"真の値 50.0 cm の長さを 49.5 cm と測定した。誤差（測定値 − 真の値）はいくらか。",answer:-0.5,tol:0.001,unit:"cm",
     traps:{"0.5":"大きさは合っています。誤差は「測定値 − 真の値」なので符号に注意。"},
     explain:"49.5 − 50.0 ＝ −0.5 cm。測定値が真の値より小さいので負になります。"},
    {id:"re3",type:"num",prompt:"同じ測定の相対誤差の大きさは何 % か。",answer:1.0,tol:0.001,unit:"%",
     traps:{"0.5":"それは誤差の大きさ（cm）です。真の値で割ります。","0.01":"% で答えます（100 を掛ける）。"},
     explain:"0.5 ÷ 50.0 ＝ 0.010 ＝ 1.0%。"},
    {id:"re4",type:"choice",prompt:"ものさしの目盛りがもともとずれていたために生じる誤差はどれか。",
     options:["系統誤差","偶然誤差"],answer:0,
     explain:"測定器の狂いや測り方のくせで一定の向きに生じる誤差は系統誤差。何度測っても減りません。"},
    {id:"re5",type:"choice",prompt:"測定をくり返して平均をとると小さくできる誤差はどれか。",
     options:["系統誤差","偶然誤差"],answer:1,
     explain:"測るたびに不規則にばらつく偶然誤差は、平均をとると小さくなります。"}
  ]},
  { title:"F. 数値解の書き方", qs:[
    {id:"rf1",type:"choice",prompt:`${I("v")} ＝ √(2${I("gh")}) に ${I("g")} ＝ ${U("9.8 m/s²")}、${I("h")} ＝ ${U("5.0 m")} を代入した数値解として適切なものはどれか。`,
     options:[U("√98 m/s"),U("7√2 m/s"),U("9.9 m/s"),U("9.899 m/s")],answer:2,
     explain:"数値の答えには根号を残さず、小数に直します。g も h も有効数字2桁なので 9.9 m/s。"},
    {id:"rf2",type:"choice",prompt:"答えに分数や根号を残してよいのはどんなときか。",
     options:[`文字式の答え（例 ${I("v")} ＝ √(2${I("gh")})）のとき`,"数値の答えで、割り切れないとき","いつでも残してよい"],answer:0,
     explain:"文字式の答えでは分数や根号を残してかまいません。数値の答えは小数（必要なら指数表記）にして、有効数字をそろえます。"},
    {id:"rf3",type:"choice",prompt:`${I("t")} ＝ 10/3 s を、有効数字2桁の数値解として書いたものはどれか。`,
     options:[U("10/3 s"),U("3.3 s"),U("3.33 s"),U("3 s")],answer:1,
     explain:"10 ÷ 3 ＝ 3.333… を2桁に丸めて 3.3 s。"}
  ]}]
},
{ id:"dim", tab:"③次元", title:"③ 次元チェック",
  intro:"力学の量は、すべて長さ〔L〕・質量〔M〕・時間〔T〕の組み合わせで表せます。各単元の次元チェックの土台です。",
  advice:"組立単位を基本単位に分解し、足し算・引き算できるのは同じ次元どうしだけであることを確かめよう。",
  ref:{label:"次元の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 次元で表す", lead:"次の量の次元を選べ。", qs:[
    {id:"da1",type:"choice",prompt:"速度",options:DIMQ,answer:0,explain:"m/s → 〔L〕〔T〕⁻¹。"},
    {id:"da2",type:"choice",prompt:"力",options:DIMQ,answer:1,explain:"N ＝ kg·m/s² → 〔M〕〔L〕〔T〕⁻²。"},
    {id:"da3",type:"choice",prompt:"エネルギー",options:DIMQ,answer:2,explain:"J ＝ N·m ＝ kg·m²/s² → 〔M〕〔L〕²〔T〕⁻²。"},
    {id:"da4",type:"choice",prompt:"仕事率",options:DIMQ,answer:3,explain:"W ＝ J/s ＝ kg·m²/s³ → 〔M〕〔L〕²〔T〕⁻³。"},
    {id:"da5",type:"choice",prompt:"圧力",options:DIMQ,answer:4,explain:"Pa ＝ N/m² ＝ kg/(m·s²) → 〔M〕〔L〕⁻¹〔T〕⁻²。"}
  ]},
  { title:"B. 組立単位を基本単位で表す", qs:[
    {id:"db1",type:"choice",prompt:"1 Pa ＝ 1 N/m² をSI基本単位で表したものはどれか。",
     options:["kg/(m·s²)","kg·m/s²","kg·m²/s²","kg/(m²·s)"],answer:0,
     explain:"(kg·m/s²) ÷ m² ＝ kg/(m·s²)。"},
    {id:"db2",type:"choice",prompt:"1 W ＝ 1 J/s をSI基本単位で表したものはどれか。",
     options:["kg·m²/s²","kg·m²/s³","kg·m/s³","kg·m²/s"],answer:1,
     explain:"(kg·m²/s²) ÷ s ＝ kg·m²/s³。"}
  ]},
  { title:"C. 単位を換算する", qs:[
    {id:"dc1",type:"choice",prompt:"2.5 g/cm³ を kg/m³ で表したものはどれか。",
     options:[U("2.5 × 10³ kg/m³"),U("2.5 × 10⁻³ kg/m³"),U("2.5 kg/m³"),U("2.5 × 10⁶ kg/m³")],answer:0,
     explain:"1 g ＝ 10⁻³ kg、1 cm³ ＝ (10⁻² m)³ ＝ 10⁻⁶ m³ なので、2.5 × 10⁻³ ÷ 10⁻⁶ ＝ 2.5 × 10³ kg/m³。"},
    {id:"dc2",type:"choice",prompt:"3.0 cm² を m² で表したものはどれか。",
     options:[U("3.0 × 10⁻² m²"),U("3.0 × 10⁻⁴ m²"),U("3.0 × 10⁻⁶ m²"),U("3.0 × 10² m²")],answer:1,
     explain:"1 cm ＝ 10⁻² m なので 1 cm² ＝ (10⁻² m)² ＝ 10⁻⁴ m²。2乗を忘れないこと。"},
    {id:"dc3",type:"choice",prompt:"450 nm を m で表したものはどれか。",
     options:[U("4.5 × 10⁻⁷ m"),U("4.5 × 10⁻⁹ m"),U("4.5 × 10⁻⁶ m"),U("4.5 × 10² m")],answer:0,
     explain:"450 × 10⁻⁹ m ＝ 4.5 × 10² × 10⁻⁹ m ＝ 4.5 × 10⁻⁷ m。"}
  ]},
  { title:"D. 足し算・引き算できるのは同じ次元どうし", qs:[
    {id:"dd1",type:"multi",prompt:"次の計算のうち、意味をもたない（次元が合わない）ものをすべて選べ。",
     options:[U("3.0 m ＋ 25 cm"),U("2.0 m ＋ 3.0 s"),U("5.0 kg × 2.0 m/s²"),U("4.0 N − 1.0 kg")],answer:[1,3],
     explain:"長さと時間、力と質量は足し引きできません。3.0 m ＋ 25 cm は単位をそろえれば 3.25 m。掛け算は次元が違ってもよく、5.0 kg × 2.0 m/s² ＝ 10 N です。"}
  ]},
  { title:"E. 次元で式を確かめる", lead:`振り子の周期 ${I("T")}（単位 s）を、糸の長さ ${I("l")} と重力加速度の大きさ ${I("g")} で表す。`, qs:[
    {id:"de1",type:"choice",prompt:"次元が正しい式はどれか。",
     options:[`2π√(${I("l")}/${I("g")})`,`2π√(${I("g")}/${I("l")})`,`2π${I("lg")}`,`2π${I("l")}/${I("g")}`],answer:0,
     explain:"√(m ÷ m/s²) ＝ √(s²) ＝ s で、時間の単位になるのはこれだけ。式を知らなくても次元で絞り込めます。"}
  ]}]
},
{ id:"step", tab:"④手順", title:"④ 手順固定の演習",
  intro:"測定値から答えを出すまでを7ステップで進めます。ほかの単元の「数値を代入」「妥当性」を細かくしたものです。",
  advice:"最も粗い測定値が答えの精度を決めること、途中で丸めないことを意識して解き直そう。",
  ref:{label:"7ステップを見る", html:STEPS},
  groups:[
  { title:"問題1（すべてのステップ）",
    quote:"台車が移動した距離を、最小目盛り 1 mm のものさしで測った（図は右端付近の拡大）。移動にかかった時間をストップウォッチで測ると 0.52 s だった。台車の平均の速さを求めよ。", figure:RULER, qs:[
    {id:"s11",type:"choice",prompt:"ステップ1　移動距離を読め。",
     options:[U("3.4 cm"),U("3.5 cm"),U("3.47 cm"),U("3.470 cm")],answer:2,
     explain:"最小目盛り 1 mm（0.1 cm）の 1/10、つまり 0.01 cm の位まで目分量で読みます。端は 3.4 と 3.5 の間の 7 割ほどの位置なので 3.47 cm。"},
    {id:"s12",type:"blanks",prompt:"ステップ2　有効数字の桁数を確認する。",text:"距離 3.47 cm：{0}　時間 0.52 s：{1}",
     options:[["2桁","3桁","4桁"],["2桁","3桁","4桁"]],answer:[1,0],
     explain:"3.47 は3桁。0.52 は位取りの 0 を数えないので2桁。"},
    {id:"s13",type:"choice",prompt:"ステップ3　距離をSI単位で表す。",
     options:[U("3.47 × 10⁻² m"),U("3.47 × 10² m"),U("3.47 × 10⁻³ m"),U("34.7 m")],answer:0,
     explain:"1 cm ＝ 10⁻² m。"},
    {id:"s14",type:"choice",prompt:"ステップ4〜6　平均の速さ（v ＝ x ÷ t）を、正しい桁数で答えよ。",
     options:[U("6.673 × 10⁻² m/s"),U("6.67 × 10⁻² m/s"),U("6.7 × 10⁻² m/s"),U("7 × 10⁻² m/s")],answer:2,
     explain:"3.47 × 10⁻² ÷ 0.52 ＝ 0.06673… 割り算なので、桁数が最も少ない 0.52 s（2桁）にそろえて 6.7 × 10⁻² m/s。"},
    {id:"s15",type:"choice",prompt:"答えを2桁にした理由はどれか。",
     options:["時間 0.52 s の有効数字が2桁で、割り算では桁数が最も少ないものにそろえるから","距離 3.47 cm の有効数字が3桁だから","割り算の答えはいつも2桁にするから"],answer:0,
     explain:"最も粗い測定値（ここでは時間）が、答えの精度を決めます。"},
    {id:"s16",type:"multi",prompt:"ステップ7　答案の表記として正しいものをすべて選べ。",
     options:[`${I("v")} ＝ ${U("6.7 × 10⁻² m/s")}`,`${U("v")} ＝ ${U("6.7 × 10⁻² m/s")}`,`${I("v")} ＝ ${U("6.7 × 10⁻²")}`,`${I("v")} ＝ ${U("0.067 m/s")}`],answer:[0,3],
     explain:"物理量 v は斜体、単位は必ず書きます。0.067 m/s も同じ有効数字2桁を表す正しい書き方です。"}
  ]},
  { title:"問題2（足し算・引き算）", qs:[
    {id:"s21",type:"choice",prompt:"ビーカーの質量を最小表示 0.1 g の電子てんびんで測ると 125.4 g、水を入れた後に最小表示 1 g のはかりで測ると 237 g だった。水の質量はどれか。",
     options:[U("111.6 g"),U("112 g"),U("111 g"),U("1.1 × 10² g")],answer:1,
     explain:"237 − 125.4 ＝ 111.6。引き算なので、末位が最も高い 237 g（1 g の位）にそろえて 112 g。"},
    {id:"s22",type:"choice",prompt:"長さ 12.3 cm と 4.56 cm の棒を一直線につないだ。全体の長さはどれか。",
     options:[U("16.86 cm"),U("16.9 cm"),U("17 cm"),U("16.860 cm")],answer:1,
     explain:"12.3 ＋ 4.56 ＝ 16.86。末位が最も高い 12.3 cm（0.1 cm の位）にそろえて 16.9 cm。足し算は「位」、掛け算は「桁数」でそろえます。"}
  ]},
  { title:"問題3（途中で丸めない）", lead:"紙に計算してから答えを選べ。",
    quote:"高さ h ＝ 1.25 m から小球を静かにはなした。g ＝ 9.8 m/s² とする。", qs:[
    {id:"s31",type:"choice",prompt:`(1) 床に達するまでの時間 ${I("t")}`,
     options:[U("√(2.5/9.8) s"),U("0.505 s"),U("0.51 s"),U("0.5 s")],answer:2,
     explain:"t ＝ √(2h/g) ＝ √(2.50/9.8) ＝ 0.505… g が2桁なので 0.51 s。根号は残しません。"},
    {id:"s32",type:"choice",prompt:`(2) 床に達する直前の速さ ${I("v")}`,
     options:[U("5.0 m/s"),U("4.9 m/s"),U("4.95 m/s"),U("√24.5 m/s")],answer:1,
     explain:"v ＝ √(2gh) ＝ √24.5 ＝ 4.949… → 4.9 m/s。(1) で丸めた 0.51 s を使って v ＝ gt ＝ 9.8 × 0.51 とすると 5.0 m/s になり、ずれてしまいます。"},
    {id:"s33",type:"self",prompt:"(2) で、丸めた 0.51 s を使うと答えが変わってしまう理由と、それを防ぐ方法を書け。",
     model:"丸めたときの誤差が次の計算に持ち込まれるから。途中の計算は有効数字より1桁多く残して最後に丸めるか、文字式で最後まで解いてから数値を代入する。"},
    {id:"s34",type:"checklist",prompt:"解き終えたら点検しよう（採点には入りません）。",
     items:["最小目盛りの 1/10 まで読んだ","単位をSIにそろえてから代入した","途中の計算は桁を多めに残した","最後に計算ルールで丸めた","答えに分数や根号が残っていない","物理量は斜体、単位は立体で書いた"]}
  ]}]
},
{ id:"sum", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。場面ごとに、どのルールを使うかを選びます。",
  advice:"答えを書いたら、桁数・単位・書体・分数や根号の有無を毎回点検しよう。",
  groups:[{ title:"ルールを選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"測定値どうしを掛け算・割り算した結果は、何にそろえるか。",
     options:["有効数字の桁数が最も少ない測定値","末位が最も高い測定値","有効数字の桁数が最も多い測定値"],answer:0,
     explain:"掛け算・割り算は「桁数」。"},
    {id:"m2",type:"choice",prompt:"測定値どうしを足し算・引き算した結果は、何にそろえるか。",
     options:["有効数字の桁数が最も少ない測定値","末位が最も高い測定値","末位が最も低い測定値"],answer:1,
     explain:"足し算・引き算は「位」。"},
    {id:"m3",type:"choice",prompt:"式に出てくる ½ や 2 のような数は、有効数字をどう扱うか。",
     options:["有効数字1桁として扱う","有効数字を考えない（何桁でもあるとみなす）","答えの桁数をそれに合わせる"],answer:1,
     explain:"測定値ではない正確な数なので、答えの桁数を制限しません。"},
    {id:"m4",type:"choice",prompt:"g ＝ 9.8 m/s² を使って計算したとき、答えの有効数字は最大何桁か。",
     options:["2桁","3桁","制限されない"],answer:0,
     explain:"9.8 は2桁なので、掛け算・割り算の答えは2桁までになります。"},
    {id:"m5",type:"multi",prompt:"次の答案のうち、表記に誤りがあるものをすべて選べ。",
     options:[`${I("v")} ＝ ${U("9.9 m/s")}`,`${I("v")} ＝ ${U("√98 m/s")}`,`${I("F")} ＝ ${U("5.0")} ${I("N")}`,`${I("F")}′ ＝ ${I("mg")}${I("μ")}′`,`${I("t")} ＝ ${U("0.51 s")}`],answer:[1,2,3],
     explain:"√98 は根号が残っている。単位 N を斜体にしている。μ′ を後ろに書いている（ギリシャ文字が先）。"},
    {id:"m6",type:"blanks",prompt:"次の文を完成させよ。",text:"数値の答えは{0}で表し、有効数字をそろえる。文字の並びは{1}を先に、{2}を後に書く。",
     options:[["小数（必要なら指数表記）","分数や根号"],["ギリシャ文字","ラテン文字"],["ギリシャ文字","ラテン文字"]],answer:[0,0,1],
     explain:"この約束は、ほかのすべての単元の答えに共通します。"}
  ]}]
}
];

registerUnit({
  id: "notation",
  title: "表記ルールと測定値の扱い",
  sections: SECTIONS
});
})();
