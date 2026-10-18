/*
 * 新しい単元のひな形（このファイル自体は一覧に載せない）
 * 使い方：このファイルをコピーして units/〇〇.js を作り、js/index.js に1行書く。
 * 各セクション（①定義・②読解・③次元・④手順・まとめ）に groups → qs の順で問題を書く。
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
const I = s => `<i class='qv'>${s}</i>`;     // 物理量の文字（斜体）
/* アニメーション（anim/）へのボタン */
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;
const TF = ["正しい","誤り"];

const DEF_TABLE = `<div class="tbl"><table>
<tr><th>用語</th><th>定義</th><th>式・単位</th></tr>
<tr><td>速度</td><td>単位時間あたりの変位</td><td>m/s</td></tr>
</table></div>`;

const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:`用語と式を正確に覚えます。<br>アニメーションで確かめよう：<br>${ANIM("anim/average.html#v","平均の速度と瞬間の速度")}`,
  advice:"定義カードを開いて、言葉と単位を覚え直そう。",
  ref:{label:"定義カードを見る", html:DEF_TABLE},
  groups:[{ title:"穴埋め", qs:[
    {id:"d1",type:"choice",prompt:"1つ選ぶ問題の例。",options:["正解の選択肢","誤りの選択肢"],answer:0,explain:"解説（答えたあとに出る）。"},
    {id:"d2",type:"multi",prompt:"すべて選ぶ問題の例。",options:["A","B","C"],answer:[0,2],explain:"A と C。"},
    {id:"d3",type:"blanks",text:`速度の単位は{0}、${I("v")} は{1}をもつ量である。`,options:[["m/s","m"],["向き","色"]],answer:[0,0],explain:"m/s。向きをもつ。"}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル", intro:"問題文の言葉を物理量に置き換えます。", advice:"言葉を数値と符号にしてから式を立てよう。",
  groups:[{ title:"A. 正しいか、誤りか", lead:"group の lead には、図（figure:）や引用（quote:）も付けられる。", qs:[
    {id:"ra1",type:"choice",prompt:"正誤問題の例。",options:TF,answer:0,explain:"正しい。"}
  ]}]
},
{ id:"dim", tab:"③次元", title:"③ 次元チェック", intro:"単位で式を確かめます。", advice:"両辺の単位をそろえよう。",
  groups:[{ title:"A. 単位を予測する", qs:[
    {id:"da1",type:"choice",prompt:`${I("v")} × ${I("t")}`,options:["m","m/s"],answer:0,two:true,explain:"m/s × s ＝ m。"}
  ]}]
},
{ id:"step", tab:"④手順", title:"④ 手順固定の演習", intro:"7ステップで解きます。", advice:"ステップを飛ばさずに書こう。",
  groups:[{ title:"問題1", quote:"速さ 2.0 m/s で 5.0 s 進んだ。進んだ距離を求めよ。", qs:[
    {id:"s11",type:"num",prompt:"進んだ距離",answer:10,tol:0.1,unit:"m",
     traps:{"2.5":"時間で割るのではなく、掛けます。"},explain:"2.0 × 5.0 ＝ 10 m。"},
    {id:"s12",type:"self",prompt:"記述問題の例（自己採点）。",model:"模範解答。"},
    {id:"s13",type:"checklist",prompt:"点検（採点なし）。",items:["単位を書いた","有効数字をそろえた"]}
  ]}]
},
{ id:"sum", tab:"まとめ", title:"単元のまとめ", intro:"使う考え方を選びます。", advice:"どの式を使うかの判断を振り返ろう。",
  groups:[{ title:"式を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"一定の速さで進んだ距離を求めたい。",options:["距離 ＝ 速さ × 時間","距離 ＝ 速さ ÷ 時間"],answer:0,explain:"速さ × 時間。"}
  ]}]
}
];

registerUnit({ id:"template", title:"ひな形", sections: SECTIONS });
})();
