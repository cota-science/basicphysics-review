/*
 * 単元：波の性質
 * 横波・縦波、振幅・波長・周期・振動数、v ＝ fλ、y-x グラフと y-t グラフの読み分け、
 * 重ね合わせ、反射（自由端・固定端）、定在波（定常波）。
 * ②読解 D〜G：縦波の横波表示（密・疎）、反射波の作図と端の節・腹、重ね合わせと独立性、波が届く時刻と2点の振動のずれ。
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

/* 振動数と周期：1 s 間を、1回の振動の時間 T ずつに区切ると f 個に分かれる（fT ＝ 1） */
const FT = (() => {
  const X = s => 40 + s * 260;
  const row = (cy, fr, label, tlabel) => {
    const Tp = 1 / fr; let g = "";
    for(let n = 0; n < fr; n++){
      const a = X(n * Tp), b = X((n + 1) * Tp), w = b - a;
      g += `<rect x="${a.toFixed(1)}" y="${cy - 24}" width="${w.toFixed(1)}" height="48" fill="${n % 2 ? "var(--red-soft)" : "var(--blue-soft)"}"/>`
        +  `<text x="${(a + w * 0.75).toFixed(1)}" y="${cy - 10}" font-size="10.5" text-anchor="middle" fill="currentColor">${n + 1}回目</text>`
        +  `<line x1="${(a + 3).toFixed(1)}" y1="${cy + 33}" x2="${(b - 3).toFixed(1)}" y2="${cy + 33}" stroke="currentColor" stroke-width="1.2"/>`
        +  `<polyline points="${(a + 8).toFixed(1)},${cy + 29} ${(a + 3).toFixed(1)},${cy + 33} ${(a + 8).toFixed(1)},${cy + 37}" fill="none" stroke="currentColor" stroke-width="1.2"/>`
        +  `<polyline points="${(b - 8).toFixed(1)},${cy + 29} ${(b - 3).toFixed(1)},${cy + 33} ${(b - 8).toFixed(1)},${cy + 37}" fill="none" stroke="currentColor" stroke-width="1.2"/>`
        +  `<text x="${((a + b) / 2).toFixed(1)}" y="${cy + 47}" font-size="12" text-anchor="middle" fill="currentColor">${SI("T")}</text>`;
    }
    return g
      + `<line x1="${X(0)}" y1="${cy}" x2="${X(1)}" y2="${cy}" stroke="currentColor" stroke-width="1"/>`
      + `<polyline points="${sine(X(0), X(1), X(0), cy, 17, 260 * Tp, 0)}" fill="none" stroke="var(--blue)" stroke-width="2.4"/>`
      + `<text x="${X(0) + 5}" y="${cy - 32}" font-size="12" fill="currentColor">${label}</text>`
      + `<text x="${X(1)}" y="${cy - 32}" font-size="12" text-anchor="end" fill="var(--red)">${tlabel}</text>`;
  };
  return `<svg class="graph" viewBox="0 0 320 262" role="img" aria-label="1 s 間の振動を、1回の振動にかかる時間 T ずつに区切った図。振動数 2 Hz では1 s 間に2回振動し、周期は0.50 s。振動数 4 Hz では1 s 間に4回振動し、周期は0.25 s。">
<line x1="${X(0)}" y1="14" x2="${X(0)}" y2="252" stroke="currentColor" stroke-dasharray="3 3" stroke-width="1"/>
<line x1="${X(1)}" y1="14" x2="${X(1)}" y2="252" stroke="currentColor" stroke-dasharray="3 3" stroke-width="1"/>
<line x1="${X(0)}" y1="20" x2="${X(1)}" y2="20" stroke="currentColor" stroke-width="1.4"/>
<line x1="${X(0)}" y1="14" x2="${X(0)}" y2="26" stroke="currentColor" stroke-width="1.4"/><line x1="${X(1)}" y1="14" x2="${X(1)}" y2="26" stroke="currentColor" stroke-width="1.4"/>
<rect x="${X(0.5) - 24}" y="11" width="48" height="18" fill="var(--sheet)"/>
<text x="${X(0.5)}" y="24" font-size="12" font-weight="700" text-anchor="middle" fill="currentColor">1 s 間</text>
<text x="${X(0) - 4}" y="24" font-size="10" text-anchor="end" fill="currentColor">${SI("t")}＝0</text>
${row(84, 2, `${SI("f")} ＝ 2 Hz（1 s 間に2回）`, `${SI("T")} ＝ 0.50 s`)}
${row(196, 4, `${SI("f")} ＝ 4 Hz（1 s 間に4回）`, `${SI("T")} ＝ 0.25 s`)}
</svg>`;
})();
const FT_NOTE = `<p>1 s 間に ${f} 回振動し、1回に ${T}〔s〕かかる。${f} 回分の時間をつなげるとちょうど 1 s になるので、<b>${f}${T} ＝ 1</b>（${f} ＝ 1/${T}、${T} ＝ 1/${f}）。振動数が2倍になると、周期は半分になる。</p>
<p>単位で確かめる：${f}〔Hz ＝ 1/s〕×${T}〔s〕→ 1/s × s ＝ 1（単位なし）。</p>`;

/* 縦波を横波のように表したグラフ：右向き（x の正の向き）の変位を y の正にとる。λ ＝ 0.40 m、y ＝ A sin(2πx/λ) */
const LONG = (() => {
  const k = 260 / 0.60, X = m => 40 + m * k;
  let ticks = "", pts = "";
  for(let i = 1; i <= 6; i++) ticks += `<line x1="${X(i/10)}" y1="78" x2="${X(i/10)}" y2="84" stroke="currentColor"/><text x="${X(i/10) - 9}" y="98" font-size="10" fill="currentColor">${(i/10).toFixed(1)}</text>`;
  [["a",0,81],["b",0.1,38],["c",0.2,81],["d",0.3,124],["e",0.4,81]].forEach(([n,m,cy]) => {
    pts += `<circle cx="${X(m)}" cy="${cy}" r="4.5" fill="var(--red)"/><text x="${X(m) + (m === 0 ? 6 : -4)}" y="${cy === 124 ? cy + 18 : cy - 9}" font-size="13" fill="var(--red)">${n}</text>`;
  });
  return `<svg class="graph" viewBox="0 0 320 170" role="img" aria-label="縦波のある時刻の変位を、右向きの変位を上にとって横波のように表したグラフ。波長0.40 m。点aはx＝0で変位0、点bはx＝0.10 mで右向きに最大、点cはx＝0.20 mで変位0、点dはx＝0.30 mで左向きに最大、点eはx＝0.40 mで変位0。">
<line x1="40" y1="81" x2="306" y2="81" stroke="currentColor" stroke-width="1.2"/>
<line x1="40" y1="150" x2="40" y2="12" stroke="currentColor" stroke-width="1.2"/>
<text x="4" y="34" font-size="10" fill="currentColor">右向き</text><text x="4" y="136" font-size="10" fill="currentColor">左向き</text>
${ticks}
<polyline points="${sine(40, 300, 40, 81, 43, 0.40 * k, 0)}" fill="none" stroke="var(--blue)" stroke-width="2.6"/>
${pts}
<text x="48" y="16" font-size="12" fill="currentColor">変位 ${SI("y")}（右向きを正）</text><text x="272" y="122" font-size="12" fill="currentColor">${SI("x")}〔m〕</text>
<line x1="228" y1="160" x2="290" y2="160" stroke="currentColor" stroke-width="1.6"/><polygon points="290,155 300,160 290,165" fill="currentColor"/>
<text x="200" y="154" font-size="11" fill="currentColor">波の進む向き</text>
</svg>`;
})();

/* 端に向かって進むパルス（左側がゆるやか、右側（進む向きの前）が急） */
const REFL = `<svg class="graph" viewBox="0 0 320 120" role="img" aria-label="右へ進む山形のパルスが、右の端に向かっている。パルスは左側がゆるやかに上がり、右側（前側）が急に下がる形。">
<line x1="20" y1="80" x2="270" y2="80" stroke="currentColor" stroke-width="1.6"/>
<line x1="270" y1="30" x2="270" y2="104" stroke="currentColor" stroke-width="2.4"/>
${[34,46,58,70,82,94].map(yy => `<line x1="270" y1="${yy}" x2="280" y2="${yy - 10}" stroke="currentColor"/>`).join("")}
<text x="282" y="22" font-size="12" text-anchor="end" fill="currentColor">端</text>
<polyline points="60,80 150,30 180,80" fill="none" stroke="var(--blue)" stroke-width="3" stroke-linejoin="round"/>
<line x1="186" y1="44" x2="228" y2="44" stroke="currentColor" stroke-width="1.6"/><polygon points="228,39 238,44 228,49" fill="currentColor"/>
<text x="62" y="104" font-size="11" fill="currentColor">ゆるやか</text><text x="160" y="104" font-size="11" fill="currentColor">急（前側）</text>
</svg>`;
/* 反射後のパルスの選択肢（左向きに進む）。steep：急な側 "L"/"R"、up：山なら true */
const RP = (lab, up, steep) => {
  const y0 = 30, h = up ? -22 : 22, a = 40, b = 130, m = steep === "L" ? a + 20 : b - 20;
  return `<span style='display:inline-flex;align-items:center;gap:8px'><b>${lab}</b><svg width="170" height="60" viewBox="0 0 170 60" aria-label="${up ? "山" : "谷"}、${steep === "L" ? "左側" : "右側"}が急">
<line x1="6" y1="${y0}" x2="152" y2="${y0}" stroke="currentColor" stroke-width="1.3"/>
<line x1="152" y1="4" x2="152" y2="56" stroke="currentColor" stroke-width="2"/>
<polyline points="${a},${y0} ${m},${y0 + h} ${b},${y0}" fill="none" stroke="var(--blue)" stroke-width="2.6" stroke-linejoin="round"/>
<line x1="8" y1="${up ? 50 : 10}" x2="30" y2="${up ? 50 : 10}" stroke="currentColor" stroke-width="1.3"/><polygon points="8,${up ? 46 : 6} 2,${up ? 50 : 10} 8,${up ? 54 : 14}" fill="currentColor"/>
</svg></span>`;
};
const RPOPT = [RP("ア", true, "L"), RP("イ", true, "R"), RP("ウ", false, "L"), RP("エ", false, "R")];

/* 2つのパルスが向かい合って進む（1 目盛り ＝ 1 cm、どちらも 1 cm/s） */
const SUP = (() => {
  const X = c => 30 + c * 26, Y = c => 82 - c * 20;
  let g = "";
  for(let i = 0; i <= 10; i++) g += `<line x1="${X(i)}" y1="${Y(3)}" x2="${X(i)}" y2="${Y(-2)}" stroke="currentColor" opacity=".18"/><text x="${X(i)}" y="${Y(-2) + 14}" font-size="10" text-anchor="middle" fill="currentColor">${i}</text>`;
  for(let j = -2; j <= 3; j++) g += `<line x1="${X(0)}" y1="${Y(j)}" x2="${X(10)}" y2="${Y(j)}" stroke="currentColor" opacity=".18"/>`;
  return `<svg class="graph" viewBox="0 0 320 190" role="img" aria-label="時刻0の2つのパルス。Aは x＝0〜2 cm にある高さ2 cm の山で右へ、Bは x＝6〜8 cm にある深さ1 cm の谷で左へ、どちらも1 cm/sで進む。点Pは x＝4 cm。">
${g}
<line x1="${X(0)}" y1="${Y(0)}" x2="${X(10)}" y2="${Y(0)}" stroke="currentColor" stroke-width="1.3"/>
<polyline points="${X(0)},${Y(0)} ${X(0)},${Y(2)} ${X(2)},${Y(2)} ${X(2)},${Y(0)}" fill="none" stroke="var(--blue)" stroke-width="3"/>
<polyline points="${X(6)},${Y(0)} ${X(6)},${Y(-1)} ${X(8)},${Y(-1)} ${X(8)},${Y(0)}" fill="none" stroke="var(--red)" stroke-width="3"/>
<text x="${X(1)}" y="${Y(2) - 8}" font-size="13" text-anchor="middle" fill="var(--blue)" font-weight="700">A</text>
<line x1="${X(2.3)}" y1="${Y(2)}" x2="${X(3.6)}" y2="${Y(2)}" stroke="var(--blue)" stroke-width="1.6"/><polygon points="${X(3.6)},${Y(2) - 5} ${X(3.6) + 9},${Y(2)} ${X(3.6)},${Y(2) + 5}" fill="var(--blue)"/>
<text x="${X(7)}" y="${Y(-1) + 18}" font-size="13" text-anchor="middle" fill="var(--red)" font-weight="700">B</text>
<line x1="${X(5.7)}" y1="${Y(-1)}" x2="${X(4.4)}" y2="${Y(-1)}" stroke="var(--red)" stroke-width="1.6"/><polygon points="${X(4.4)},${Y(-1) - 5} ${X(4.4) - 9},${Y(-1)} ${X(4.4)},${Y(-1) + 5}" fill="var(--red)"/>
<circle cx="${X(4)}" cy="${Y(0)}" r="4" fill="currentColor"/><text x="${X(4) + 5}" y="${Y(0) - 6}" font-size="13" font-weight="700" fill="currentColor">P</text>
<text x="${X(10)}" y="${Y(-2) + 28}" font-size="11" text-anchor="end" fill="currentColor">${SI("x")}〔cm〕　1目盛り ＝ 1 cm（縦・横とも）</text>
<text x="${X(0)}" y="12" font-size="11" fill="currentColor">${SI("y")}〔cm〕　A・B ともに速さ 1 cm/s</text>
</svg>`;
})();

/* 波源から x 軸の正の向きへ進む波（λ ＝ 0.40 m、T ＝ 0.50 s、v ＝ 0.80 m/s）。観測点 A・B・C */
const DELAY = (() => {
  const X = m => 24 + m * 130, cy = 62;
  let ticks = "";
  for(let i = 0; i <= 4; i++){ const m = i * 0.5; ticks += `<line x1="${X(m)}" y1="${cy - 3}" x2="${X(m)}" y2="${cy + 3}" stroke="currentColor"/><text x="${X(m)}" y="${cy + 17}" font-size="10" text-anchor="middle" fill="currentColor">${m.toFixed(1)}</text>`; }
  const dot = (m, n, c) => `<circle cx="${X(m)}" cy="${cy}" r="5" fill="${c}"/><text x="${X(m)}" y="${cy - 12}" font-size="13" font-weight="700" text-anchor="middle" fill="${c}">${n}</text>`;
  return `<svg class="graph" viewBox="0 0 320 120" role="img" aria-label="x軸上に、波源（x＝0）、点A（x＝1.2 m）、点B（x＝1.4 m）、点C（x＝1.6 m）が並んでいる。波は波源からx軸の正の向きへ進む。波長は0.40 m、周期は0.50 s。">
<line x1="${X(0)}" y1="${cy}" x2="${X(2.0)}" y2="${cy}" stroke="currentColor" stroke-width="1.3"/>
${ticks}
<rect x="${X(0) - 7}" y="${cy - 16}" width="14" height="32" rx="3" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="1.5"/>
<text x="${X(0) + 12}" y="${cy - 34}" font-size="11" fill="var(--blue)">波源（時刻 0 に上向きに振動を始める）</text>
${dot(1.2, "A", "var(--red)")}${dot(1.4, "B", "var(--blue)")}${dot(1.6, "C", "var(--red)")}
<line x1="${X(0.35)}" y1="${cy + 36}" x2="${X(1.0)}" y2="${cy + 36}" stroke="currentColor" stroke-width="1.5"/><polygon points="${X(1.0)},${cy + 31} ${X(1.0) + 9},${cy + 36} ${X(1.0)},${cy + 41}" fill="currentColor"/>
<text x="${X(1.0) + 14}" y="${cy + 40}" font-size="11" fill="currentColor">波の進む向き</text>
<text x="312" y="${cy + 40}" font-size="11" text-anchor="end" fill="currentColor">${SI("x")}〔m〕</text>
</svg>`;
})();

const DEF_TABLE = `<div class="tbl"><table>
<colgroup><col style="width:6.6em"><col></colgroup>
<tr><th>用語</th><th>定義（記号・式・単位）</th></tr>
<tr><th colspan='2' style='text-align:left;background:var(--blue-soft)'>波の基本</th></tr>
<tr><td>波源</td><td>振動を始めて、波をつくり出すもの</td></tr>
<tr><td>波（波動）</td><td>ある点の振動が、次々と周りに伝わっていく現象。媒質そのものは移動しない</td></tr>
<tr><td>媒質</td><td>波を伝える物質（ひも・ばね・水・空気など）。媒質の各点はその場で振動するだけで、波と一緒には移動しない</td></tr>
<tr><td>進行波</td><td>波形が一定の速さで進んでいく波</td></tr>
<tr><td>パルス波</td><td>波源が1回だけ振動してできる、孤立した短い波</td></tr>
<tr><td>連続波</td><td>波源が続けて振動してできる、途切れずに続く波</td></tr>
<tr><td>波形</td><td>ある時刻の媒質全体の形。${y}-${x} グラフで表す</td></tr>
<tr><td>変位</td><td>媒質の各点の、振動の中心（もとの位置）からのずれ。向きをもつ量<br><span style='color:var(--blue);font-weight:700'>${y}〔m〕</span></td></tr>
<tr><td>山・谷</td><td>波形で、変位が正の向きに最大の所が山、負の向きに最大の所が谷</td></tr>
<tr><td>横波・縦波</td><td>媒質の振動方向が、波の進む向きに垂直なのが横波、平行なのが縦波（疎密波）</td></tr>
<tr><td>密・疎</td><td>縦波で、媒質の点が集まって密度が大きくなった所が密、まばらになって密度が小さくなった所が疎</td></tr>
<tr><th colspan='2' style='text-align:left;background:var(--blue-soft)'>波を表す量</th></tr>
<tr><td>振幅</td><td>媒質の振動の中心からの最大の変位<br><span style='color:var(--blue);font-weight:700'>${A}〔m〕</span></td></tr>
<tr><td>波長</td><td>隣り合う山と山（谷と谷）の間隔。1回の振動の間に波が進む距離<br><span style='color:var(--blue);font-weight:700'>${L}〔m〕</span></td></tr>
<tr><td>周期</td><td>媒質の1点が1回振動するのにかかる時間<br><span style='color:var(--blue);font-weight:700'>${T}〔s〕</span></td></tr>
<tr><td>振動数</td><td>媒質の1点が1 s 間に振動する回数<br><span style='color:var(--blue);font-weight:700'>${f} ＝ 1/${T}〔Hz〕</span></td></tr>
<tr><td>波の速さ</td><td>波形が1 s 間に進む距離。媒質によって決まる（媒質の点が振動する速さとは別のもの）<br><span style='color:var(--blue);font-weight:700'>${v} ＝ ${f}${L} ＝ ${L}/${T}〔m/s〕</span></td></tr>
<tr><th colspan='2' style='text-align:left;background:var(--blue-soft)'>波の重ね合わせ</th></tr>
<tr><td>合成波</td><td>2つ以上の波が重なってできる波<br><span style='color:var(--blue);font-weight:700'>${y} ＝ ${Sb('y','1')} ＋ ${Sb('y','2')}</span></td></tr>
<tr><td>重ね合わせの原理</td><td>2つの波が重なった点の変位は、それぞれの波の変位の和になる<br><span style='color:var(--blue);font-weight:700'>${y} ＝ ${Sb('y','1')} ＋ ${Sb('y','2')}</span></td></tr>
<tr><td>波の独立性</td><td>重なり合った波は、すれ違った後、互いに影響を受けずにもとの形のまま進む</td></tr>
<tr><th colspan='2' style='text-align:left;background:var(--blue-soft)'>波の反射と定在波（定常波）</th></tr>
<tr><td>入射波</td><td>境界（端）に向かって進んでくる波</td></tr>
<tr><td>反射波</td><td>境界（端）ではね返って戻っていく波</td></tr>
<tr><td>自由端</td><td>媒質が自由に動ける端</td></tr>
<tr><td>固定端</td><td>媒質が固定されていて動けない端（変位はいつも 0）</td></tr>
<tr><td>自由端反射</td><td>自由端での反射。山は山のまま反射する（位相は変わらない）。自由端は合成波の腹になる</td></tr>
<tr><td>固定端反射</td><td>固定端での反射。山は谷になって反射する（位相が逆になる）。固定端は合成波の節になる</td></tr>
<tr><td>定在波（定常波）</td><td>逆向きに進む同じ波が重なってできる、どちらにも進まない波。振動しない点が節、最も大きく振動する点が腹<br><span style='color:var(--blue);font-weight:700'>節の間隔 ＝ ${L}/2</span></td></tr>
</table></div>
<p>${y}-${x} グラフはある時刻の波形（山と山の間隔が波長）。${y}-${t} グラフは媒質の1点の振動（山と山の間隔が周期）。</p>
<h3 style='font-size:15px;margin:14px 0 4px'>振動数と周期の関係</h3>
${FT}
${FT_NOTE}`;
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

/* アニメーションへのボタン型リンク */
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;
const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  intro:`波で動いているのは「振動の状態」で、媒質そのものではありません。用語と記号を正確に覚えます。<br>アニメーションで確かめよう：<br>${ANIM("anim/wave-speed.html",`波の速さ（${v} ＝ ${f}${L}）`)}${ANIM("anim/wave-3d.html","波を3次元で見る")}${ANIM("anim/transverse.html#sup","波の重ね合わせ")}${ANIM("anim/transverse.html#ref","波の反射")}${ANIM("anim/transverse.html#std","定在波（定常波）")}${ANIM("anim/longitudinal.html","縦波（疎密波）")}`,
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
    {id:"d6",type:"blanks",text:"定在波（定常波）で、まったく振動しない点を{0}、最も大きく振動する点を{1}という。隣り合う節の間隔は{2}である。",
     options:[["節","腹"],["節","腹"],["<i class='qv'>λ</i>/2","<i class='qv'>λ</i>","<i class='qv'>λ</i>/4"]],answer:[0,1,0],explain:`隣り合う節と節の間隔は半波長 ${L}/2 です。`},
    {id:"d7",type:"choice",prompt:"固定端で反射するとき、入射した山はどのように反射するか。",
     options:["山として反射する","谷として反射する","反射しない"],answer:1,explain:"固定端では位相が逆になります。自由端ではそのまま山として反射します。"},
    {id:"d8",type:"choice",prompt:"2つの波が重なった点の変位はどうなるか（重ね合わせの原理）。",
     options:[`それぞれの変位の和 ${Sb("y","1")} ＋ ${Sb("y","2")}`,"大きいほうの波の変位","それぞれの変位の積"],answer:0,
     explain:"重なり合った後、それぞれの波はもとの形のまま進んでいきます（独立性）。"}
  ]},
  { title:"振動数と周期を図で見る", lead:"どちらも 1 s 間の振動です。色の帯1つが1回の振動で、その時間が周期 <i class='qv'>T</i> です。", figure:FT, qs:[
    {id:"d9",type:"choice",prompt:"振動数を 2 Hz から 4 Hz にすると、1回の振動にかかる時間（周期）はどうなるか。",
     options:["半分になる","2倍になる","変わらない"],answer:0,
     explain:`1 s 間に入る振動の回数が2倍になるので、1回あたりの時間は半分になります。${f}${T} ＝ 1 なので、${f} と ${T} は反比例します。`},
    {id:"d10",type:"num",prompt:`振動数 ${f} ＝ 5.0 Hz の振動の周期 ${T} を求めよ。`,answer:0.20,tol:0.005,unit:"s",
     traps:{"5":"それは振動数の値です。<i class='qv'>T</i> ＝ 1/<i class='qv'>f</i> です。","0.5":"1 ÷ 5.0 を計算し直そう。"},
     explain:`${T} ＝ 1/${f} ＝ 1 ÷ 5.0 ＝ 0.20 s。1 s 間を5つに区切った1つ分です。`}
  ]}]
},
{ id:"read", tab:"②読解", title:"② 読解ドリル",
  intro:`波の問題でいちばん多い誤りは、グラフの種類の取り違えです。横軸が ${x} か ${t} かを、必ず最初に確かめます。<br>2つのグラフが同じ波を別の向きで切ったものであることは、アニメーションで確かめよう：<br>${ANIM("anim/wave-3d.html",`波を3次元で見る（${y}-${x} グラフと ${y}-${t} グラフ）`)}`,
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
     explain:"山や谷の位置は振動の端なので、媒質の振動の速さは 0 です。振動の中心を通るとき、速さは最大になります。"}
  ]},
  { title:"B. <i class='qv'>y</i>-<i class='qv'>t</i> グラフ（1点の振動）を読む", lead:"同じ波が伝わる媒質の、ある1点の変位と時間の関係。", figure:OSC, qs:[
    {id:"rb1",type:"num",prompt:`周期 ${T} を読め。`,answer:0.50,tol:0.005,unit:"s",
     traps:{"0.25":"それは半周期です。山と山の間隔を読みます。","1":"グラフ全体には2回分の振動が描かれています。"},explain:"山と山の間隔は 0.50 s。"},
    {id:"rb2",type:"num",prompt:`振動数 ${f} を求めよ。`,answer:2.0,tol:0.02,unit:"Hz",
     traps:{"0.5":"<i class='qv'>f</i> ＝ 1/<i class='qv'>T</i> です。"},explain:`${f} ＝ 1/${T} ＝ 1/0.50 ＝ 2.0 Hz。`},
    {id:"rb3",type:"choice",prompt:"この <i class='qv'>y</i>-<i class='qv'>t</i> グラフの山と山の間隔は何を表すか。",options:["周期","波長","振幅"],answer:0,
     explain:"横軸が時間なので、山と山の間隔は時間（周期）です。<i class='qv'>y</i>-<i class='qv'>x</i> グラフなら波長になります。"}
  ]},
  { title:"C. 正しいか、誤りか", lead:"迷ったら <a href='anim/transverse.html#ref' style='color:var(--blue);font-weight:700'>反射と定在波（定常波）のアニメーション</a> で動きを見てから答えよう。", qs:[
    {id:"rc1",type:"choice",prompt:"波が伝わると、媒質も波と一緒に移動する。",options:TF,answer:1,explain:"誤り。媒質はその場で振動するだけです。"},
    {id:"rc2",type:"choice",prompt:"同じ媒質を伝わる波では、振動数を大きくすると波の速さも大きくなる。",options:TF,answer:1,
     explain:"誤り。波の速さは媒質で決まります。振動数を大きくすると、波長が短くなります。"},
    {id:"rc3",type:"choice",prompt:"音は縦波である。",options:TF,answer:0,explain:"正しい。空気の密な部分と疎な部分が伝わります。"},
    {id:"rc4",type:"choice",prompt:"自由端で反射するとき、山は山として反射する。",options:TF,answer:0,explain:"正しい。固定端では谷として反射します。"},
    {id:"rc5",type:"choice",prompt:"定在波（定常波）は、波形が左右どちらにも進まない。",options:TF,answer:0,explain:"正しい。節の位置は動かず、腹の位置でその場の振動をくり返します。"},
    {id:"rc6",type:"choice",prompt:"振幅が大きい波ほど、速く伝わる。",options:TF,answer:1,explain:"誤り。振幅は波の速さに関係しません。"}
  ]},
  { title:"D. 縦波を横波のように表したグラフを読む", lead:`縦波（疎密波）のある時刻の変位を、右向き（${x} の正の向き）の変位を ${y} の正にとって、横波のように表したグラフ。点 a〜e は、媒質の各点のもとの位置。答えたら確かめよう：${ANIM("anim/longitudinal.html","縦波（疎密波）")}`, figure:LONG, qs:[
    {id:"rd1",type:"choice",prompt:"点 b の媒質は、この瞬間どちら向きにずれているか。",options:["右向きに最大","左向きに最大","ずれていない"],answer:0,
     explain:`${y} が正の最大なので、右向きに最大だけずれています。縦波のグラフの「上」は「右向き」の意味です。`},
    {id:"rd2",type:"choice",prompt:"媒質が最も密になっている点はどれか。",options:["a","b","c","d","e"],answer:2,
     explain:"c の左側の点（b）は右へ、右側の点（d）は左へずれているので、c に向かって集まり、密になります。"},
    {id:"rd3",type:"multi",prompt:"媒質が最も疎になっている点をすべて選べ。",options:["a","b","c","d","e"],answer:[0,4],
     explain:"a・e では、左側の点が左へ、右側の点が右へずれていて、まわりの点が離れていくので疎になります。"},
    {id:"rd4",type:"choice",prompt:"変位が最大の点（b・d）の位置では、媒質の密度はどうなっているか。",options:["密","疎","密でも疎でもない（もとの密度）"],answer:2,
     explain:"b のまわりの点はどれも同じくらい右へずれているので、間隔は変わりません。密・疎は変位が 0 の点にできます。"},
    {id:"rd5",type:"num",prompt:"隣り合う密と密の間隔は何 m か。",answer:0.40,tol:0.005,unit:"m",
     traps:{"0.2":"それは密と疎の間隔（半波長）です。","0.1":"変位が最大の点と密の点の間隔（1/4 波長）です。"},
     explain:"密と密の間隔は 1 波長で 0.40 m。縦波の波長は「密から次の密まで」です。"}
  ]},
  { title:"E. 反射波を作図する・端は節か腹か", lead:`山形のパルスが右へ進み、右の端で反射する。答えたら確かめよう：${ANIM("anim/transverse.html#ref","反射と定在波（定常波）")}`, figure:REFL, qs:[
    {id:"re1",type:"choice",prompt:"右の端が<b>固定端</b>のとき、完全に反射して左へ進むパルスの形はどれか。",options:RPOPT,answer:2,
     explain:"固定端：端がないとして端の向こうへ進んだ波を描き、上下を反転させてから端で左右に折り返します。山は谷になり、前側だった急な側は、左へ進む反射波でも前側（左側）になります。"},
    {id:"re2",type:"choice",prompt:"右の端が<b>自由端</b>のとき、完全に反射して左へ進むパルスの形はどれか。",options:RPOPT,answer:0,
     explain:"自由端：端の向こうへ進んだ波を、上下はそのまま、端で左右に折り返します。山は山のまま、急な側は左側（前側）になります。"},
    {id:"re3",type:"choice",prompt:"固定端反射の反射波を作図する手順として正しいものはどれか。",
     options:["端の向こうへ進んだはずの波を描き、上下を反転させてから、端を軸に折り返す","端の向こうへ進んだはずの波を描き、上下はそのままで、端を軸に折り返す","入射波を上下に反転させるだけで、折り返さない"],answer:0,
     explain:"2番目は自由端の手順です。反射波は逆向きに進むので、必ず端で折り返します。"},
    {id:"re4",type:"blanks",prompt:"連続した波が端で反射し、入射波と反射波が重なって定在波（定常波）ができた。",text:"固定端は定在波の{0}に、自由端は定在波の{1}になる。",
     options:[["節","腹"],["節","腹"]],answer:[0,1],
     explain:"固定端は動けないので、いつも変位 0 の節です。自由端は入射波と反射波が同じ向きに重なるので、大きく振動する腹です。"},
    {id:"re5",type:"choice",prompt:"固定端で定在波（定常波）ができたとき、端から最も近い腹までの距離は？",options:[`${L}/4`,`${L}/2`,`${L}`],answer:0,
     explain:`端は節。節と節の間隔が ${L}/2 で、腹はその真ん中にあるので、端から ${L}/4 です。`}
  ]},
  { title:"F. 重ね合わせと独立性", lead:`時刻 0 に、A（高さ 2 cm の山）と B（深さ 1 cm の谷）が向かい合って進んでいる。答えたら確かめよう：${ANIM("anim/transverse.html#sup","波の重ね合わせ")}`, figure:SUP, qs:[
    {id:"rf1",type:"num",prompt:"時刻 3.0 s のとき、点 P（<i class='qv'>x</i> ＝ 4 cm）の変位は何 cm か。",answer:1,tol:0.01,unit:"cm",
     traps:{"3":"B は谷なので、変位は負（−1 cm）です。2 ＋ (−1) を計算します。","-1":"A の山の変位 ＋2 cm も加えます。","2":"3.0 s 後には B も P に届いています。"},
     explain:"3.0 s 後、A は <i class='qv'>x</i> ＝ 3〜5 cm、B も <i class='qv'>x</i> ＝ 3〜5 cm に来て、ぴったり重なります。変位は 2 ＋ (−1) ＝ 1 cm。"},
    {id:"rf2",type:"choice",prompt:"時刻 3.0 s の合成波の形はどれか。",options:["<i class='qv'>x</i> ＝ 3〜5 cm に高さ 1 cm の山","<i class='qv'>x</i> ＝ 3〜5 cm に高さ 3 cm の山","どこも変位 0（平ら）"],answer:0,
     explain:"重なった部分の変位は、それぞれの変位の和です（重ね合わせの原理）。"},
    {id:"rf3",type:"choice",prompt:"時刻 6.0 s のとき、A はどうなっているか。",options:["<i class='qv'>x</i> ＝ 6〜8 cm に、高さ 2 cm の山のまま進んでいる","<i class='qv'>x</i> ＝ 6〜8 cm に、高さ 1 cm の山になって進んでいる","B と打ち消しあって消えている"],answer:0,
     explain:"すれ違った後、それぞれの波はもとの形のまま進みます（波の独立性）。6.0 s で 6 cm 進むので、A は <i class='qv'>x</i> ＝ 6〜8 cm にあります。"},
    {id:"rf4",type:"choice",prompt:"同じ形の山と谷がぴったり重なって変位がどこも 0 になった瞬間、2つの波は消えてなくなっている。",options:TF,answer:1,
     explain:"誤り。その瞬間だけ変位が打ち消しあっていますが、それぞれの波は進み続け、すれ違った後はもとの形で現れます。"},
    {id:"rf5",type:"choice",prompt:`振幅 ${A} の同じ波が逆向きに進んで重なり、定在波（定常波）ができた。腹の振幅は？`,options:[`${A}/2`,`${A}`,`2${A}`],answer:2,
     explain:`腹では2つの波がいつも同じ向きに重なるので、振幅は ${A} ＋ ${A} ＝ 2${A} です。節では打ち消しあって 0 です。`}
  ]},
  { title:"G. 波が届く時刻と、離れた2点の振動のずれ", lead:`波源から右へ伝わる波を、<i class='qv'>x</i> 軸上の点 A・B・C で観察する。波の速さは ${v} ＝ ${L}/${T} ＝ 0.40 ÷ 0.50 ＝ 0.80 m/s。答えたら確かめよう：${ANIM("anim/wave-3d.html","波を3次元で見る（観測点を動かす・B を追加）")}`, figure:DELAY, qs:[
    {id:"rg1",type:"num",prompt:"波源が時刻 0 に振動を始めた。波が点 A（波源から 1.2 m）に届いて、A が振動を始めるのは何 s 後か。",answer:1.5,tol:0.01,unit:"s",
     traps:{"0.96":"距離 × 速さではなく、距離 ÷ 速さです。（時間 ＝ 距離 ÷ 速さ）","0.5":"それは周期です。A に届くまでの時間は、距離 ÷ 波の速さです。"},
     explain:"波は一定の速さ 0.80 m/s で進むので、時間 ＝ 距離 ÷ 速さ ＝ 1.2 ÷ 0.80 ＝ 1.5 s。"},
    {id:"rg2",type:"num",prompt:"点 B は A より 0.20 m 先にある。B が振動を始めるのは、A が振動を始めてから何 s 後か。",answer:0.25,tol:0.005,unit:"s",
     traps:{"0.16":"距離 × 速さではなく、距離 ÷ 速さです。","0.2":"0.20 は距離（m）です。時間は 0.20 ÷ 0.80 です。"},
     explain:"0.20 ÷ 0.80 ＝ 0.25 s。0.20 m は半波長なので、ちょうど半周期（0.50 s の半分）です。"},
    {id:"rg3",type:"choice",prompt:`A と B の ${y}-${t} グラフ（それぞれの点の振動）を重ねて描くと、どうなっているか。`,
     options:["B は A と上下が逆（A が山のとき B は谷）","B は A とまったく同じ","B は A より振幅が小さい"],answer:0,
     explain:"B の振動は A の振動を半周期（0.25 s）遅らせたもの。半周期ずれると、山と谷が入れかわります。半波長はなれた2点は、いつも反対向きに振動します。"},
    {id:"rg4",type:"num",prompt:"点 C は A より 0.40 m（1 波長）先にある。C が振動を始めるのは、A が振動を始めてから何 s 後か。",answer:0.50,tol:0.005,unit:"s",
     traps:{"0.32":"距離 × 速さではなく、距離 ÷ 速さです。"},
     explain:`0.40 ÷ 0.80 ＝ 0.50 s。ちょうど 1 周期 ${T} です。`},
    {id:"rg5",type:"choice",prompt:`A と C の ${y}-${t} グラフを比べると、どうなっているか。`,
     options:["C は A と同じ向きに動き、山も谷も同時にくる（同じ振動を 1 周期遅らせただけ）","C は A と上下が逆","C は A より振動数が小さい"],answer:0,
     explain:"1 周期ずらした振動は、もとの振動と重なります。1 波長はなれた2点は、いつも同じ向きに振動します。振動数は波の全体で同じです。"},
    {id:"rg6",type:"num",prompt:"時刻 1.0 s のとき、波の先頭（まだ振動していない点との境）は、波源から何 m の所にあるか。",answer:0.80,tol:0.01,unit:"m",
     traps:{"1.0":"波は 1.0 s 間に、速さ 0.80 m/s で進んだ距離だけ進みます。"},
     explain:"距離 ＝ 速さ × 時間 ＝ 0.80 × 1.0 ＝ 0.80 m。A（1.2 m）にはまだ届いていません。"}
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
  { title:"問題1（2つのグラフから速さを求める）", lead:"②読解ドリルの <i class='qv'>y</i>-<i class='qv'>x</i> グラフと <i class='qv'>y</i>-<i class='qv'>t</i> グラフは、同じ波についてのものである。<br><a href='anim/wave-speed.html' style='color:var(--blue);font-weight:700'>波の速さのアニメーション</a> で、2つのグラフの関係を見てから解こう。", qs:[
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
  { title:"問題2　定在波（定常波）", lead:"腹と節の並び方は <a href='anim/transverse.html#std' style='color:var(--blue);font-weight:700'>定在波（定常波）のアニメーション</a> で確かめられる。", quote:"長さ 1.2 m の弦の両端を固定して振動させたところ、腹が3つの定在波（定常波）ができた。弦を伝わる波の速さは 40 m/s である。", qs:[
    {id:"s21",type:"num",prompt:"定在波（定常波）の波長を求めよ。",answer:0.80,tol:0.01,unit:"m",
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
    {id:"m4",type:"choice",prompt:"定在波（定常波）の、隣り合う節と節の間隔は？",options:[`${L}/2`,`${L}`,`${L}/4`],answer:0,explain:"腹1つ分が半波長です。"},
    {id:"m5",type:"blanks",prompt:"次の文を完成させよ。",text:"波が伝わるとき、移動するのは{0}であり、媒質は{1}。",
     options:[["振動の状態（エネルギー）","媒質"],["その場で振動するだけである","波と一緒に移動する"]],answer:[0,0],
     explain:"この見方が、横波・縦波・反射・定在波（定常波）すべての土台です。"}
  ]}]
}
];

registerUnit({ id:"waves", title:"波の性質", sections: SECTIONS });
})();
