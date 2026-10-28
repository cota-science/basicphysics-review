/* 五線紙（ト音記号・ヘ音記号の大譜表）に、いま鳴っている音を表示する。
   使い方：Staff.mount(要素) → Staff.set(要素, 振動数Hz)。基準は A4 ＝ 440 Hz の平均律。
   平均律の半音にぴったり合わない音は、最も近い半音の位置に書き、ずれをセントの文字で注釈する。 */
(function(){
"use strict";
const NAMES = ["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"];
const KANA  = ["ド","ド♯","レ","レ♯","ミ","ファ","ファ♯","ソ","ソ♯","ラ","ラ♯","シ"];
const FLAT  = {"C♯":"D♭","D♯":"E♭","F♯":"G♭","G♯":"A♭","A♯":"B♭"};
const STEP  = [0,0,1,1,2,3,3,4,4,5,5,6];
const A4 = 440, d = 8, W = 300, X0 = 62, XN = 188;      // d：線の間隔
const MIDI_MIN = 21, MIDI_MAX = 108;                      // A0〜C8
const css = `
.staffbox{margin:14px 0 0;padding:10px 12px 12px;border:1px solid var(--line);border-radius:8px;background:var(--sheet)}
.staffbox h3{font-size:15px;margin:0 0 4px}
.staffbox svg{display:block;width:100%;max-width:400px;margin:0 auto;height:auto;color:var(--ink)}
.staffbox .st-cap{font-size:14px;line-height:1.65;margin:6px 0 0}
.staffbox .st-cap b{color:var(--blue)}
@media (min-width:1000px){
  .staffbox{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:16px;align-items:center;padding:8px 12px 10px;margin-top:10px}
  .staffbox h3{grid-column:2;grid-row:1;margin:0 0 2px;align-self:end}
  .staffbox .st-fig{grid-column:1;grid-row:1 / span 2}
  .staffbox .st-cap{grid-column:2;grid-row:2;align-self:start}
  .staffbox .st-cap{margin:0;font-size:13.5px;line-height:1.55}
  .staffbox .st-micro{font-size:12.5px}
}
.staffbox .st-sub{display:block;font-size:13px;color:var(--muted)}
.staffbox .st-micro{display:block;margin-top:4px;padding:5px 9px;background:var(--red-soft,#FCECEA);border-radius:6px;font-size:13.5px}
.staffbox .st-micro b{color:var(--red)}
`;
function injectCss(){ if(document.getElementById("staff-css")) return; const s = document.createElement("style"); s.id = "staff-css"; s.textContent = css; document.head.appendChild(s); }
const I = s => `<i class="qv">${s}</i>`;
function fmtF(x){ return x >= 1000 ? x.toFixed(0) : x >= 100 ? x.toFixed(1) : x.toFixed(2); }

/* 位置（C4＝0 で、白鍵ひとつ上がるごとに +1）から y 座標へ。pos ≥ 0 は高音部、pos < 0 は低音部 */
function layout(top, bot){
  const yE4 = top + 4 * d;           // 高音部の第1線（E4）
  const yA3 = yE4 + 3 * d;           // 低音部の第5線（A3）
  return { top, yE4, yA3, bot: yA3 + 4 * d,
    y: p => p >= 0 ? yE4 - (p - 2) * d / 2 : yA3 - (p + 2) * d / 2 };
}
const CLEF_G = "M -0.9,2.9 C -0.4,3.6 0.5,3.2 0.5,2.2 L 0.5,-3.4 C 0.5,-4.6 1.4,-4.6 1.4,-3.6 C 1.4,-2.4 -0.2,-1.8 -1.2,-0.8 C -2.0,0.1 -1.6,1.6 -0.2,1.6 C 1.3,1.6 1.6,0.2 0.9,-0.4 C 0.2,-0.9 -0.8,-0.3 -0.6,0.5";
const CLEF_F = "M -1.1,0 C -1.1,-1.1 0.5,-1.4 1.0,-0.4 C 1.5,0.7 0.6,2.4 -1.7,3.4";

function svgFor(f){
  const out = { svg:"", cap:"" };
  let midi = 69 + 12 * Math.log2(f / A4);
  const n = Math.round(midi), cents = (midi - n) * 100;
  const ok = isFinite(midi) && n >= MIDI_MIN && n <= MIDI_MAX;
  let pos = 0, shift = 0, nm = "", oct = 0, pc = 0;
  if(ok){
    pc = ((n % 12) + 12) % 12; oct = Math.floor(n / 12) - 1; nm = NAMES[pc];
    pos = 7 * (oct - 4) + STEP[pc];
    let p = pos;
    while(p > 16){ p -= 7; shift++; }
    while(p < -16){ p += 7; shift--; }
    pos = p;
  }
  // 上下の余白：音符の加線と 8va 記号が入る分だけ（最低でも 2 本ぶん）
  const need = Math.max(1, ok && pos >= 12 ? (pos - 10) / 2 : 0), needB = Math.max(1, ok && pos <= -12 ? (-pos - 10) / 2 : 0);
  const top = Math.ceil(need) * d + 18, bot = Math.ceil(needB) * d + 18;
  const L = layout(top, bot), H = L.bot + bot;
  let g = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="大譜表（ト音記号とヘ音記号）に、鳴っている音を書いた五線紙">`;
  const lineX1 = 14, lineX2 = W - 10;
  // 五線
  for(let i = 0; i < 5; i++){
    g += `<line x1="${lineX1}" x2="${lineX2}" y1="${L.yE4 - i * d}" y2="${L.yE4 - i * d}" stroke="currentColor" stroke-width="0.9"/>`;
    g += `<line x1="${lineX1}" x2="${lineX2}" y1="${L.yA3 + i * d}" y2="${L.yA3 + i * d}" stroke="currentColor" stroke-width="0.9"/>`;
  }
  // 小節線（左端）とかっこ
  g += `<line x1="${lineX1}" x2="${lineX1}" y1="${L.yE4 - 4 * d}" y2="${L.bot}" stroke="currentColor" stroke-width="1.3"/>`;
  g += `<line x1="${lineX2}" x2="${lineX2}" y1="${L.yE4 - 4 * d}" y2="${L.bot}" stroke="currentColor" stroke-width="1.3"/>`;
  g += `<path d="M ${lineX1 - 3},${L.yE4 - 4 * d} C ${lineX1 - 9},${(L.yE4 - 4 * d + L.bot) / 2 - 12} ${lineX1 - 9},${(L.yE4 - 4 * d + L.bot) / 2 + 12} ${lineX1 - 3},${L.bot}" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
  // 音部記号（線 1 間隔 d に合わせて拡大）
  const yG = L.yE4 - d, yF = L.yA3 + d;
  g += `<g transform="translate(${X0 - 24},${yG}) scale(${d})"><path d="${CLEF_G}" fill="none" stroke="currentColor" stroke-width="0.22" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  g += `<g transform="translate(${X0 - 24},${yF}) scale(${d})"><path d="${CLEF_F}" fill="none" stroke="currentColor" stroke-width="0.26" stroke-linecap="round"/><circle cx="-1.1" cy="0" r="0.5" fill="currentColor"/><circle cx="2.0" cy="-0.5" r="0.27" fill="currentColor"/><circle cx="2.0" cy="0.5" r="0.27" fill="currentColor"/></g>`;
  if(ok){
    const y = L.y(pos), x = XN;
    // 加線
    const lines = [];
    if(pos >= 12) for(let p = 12; p <= pos; p += 2) lines.push(p);
    if(pos <= -12) for(let p = -12; p >= pos - (pos % 2 ? 1 : 0); p -= 2) lines.push(p);
    if(pos === 0 || pos === 1) lines.push(0);
    [...new Set(lines)].forEach(p => { const yy = L.y(p); g += `<line x1="${x - 11}" x2="${x + 11}" y1="${yy}" y2="${yy}" stroke="currentColor" stroke-width="1.1"/>`; });
    // 音符（全音符）
    g += `<g transform="translate(${x},${y})"><ellipse rx="6.4" ry="4.4" transform="rotate(-18)" fill="var(--blue)"/><ellipse rx="3.3" ry="2.2" transform="rotate(-48)" fill="var(--sheet)"/></g>`;
    if(nm.includes("♯")) g += `<text x="${x - 14}" y="${y + 5}" font-size="17" text-anchor="middle" fill="var(--blue)" font-family="'Segoe UI Symbol','Apple Symbols','Noto Sans Symbols2','Noto Music',sans-serif">♯</text>`;
    // 音名の注記
    const lab = nm + oct;
    g += `<text x="${x + 17}" y="${y + 4}" font-size="11" font-weight="700" fill="var(--blue)" stroke="var(--sheet)" stroke-width="3" paint-order="stroke">${lab}</text>`;
    if(Math.abs(cents) >= 3) g += `<text x="${x + 17}" y="${y + 16}" font-size="9.5" fill="var(--red)" stroke="var(--sheet)" stroke-width="3" paint-order="stroke">${cents > 0 ? "＋" : "−"}${Math.abs(cents).toFixed(0)}セント</text>`;
    // オクターブ記号
    if(shift !== 0){
      const nameS = shift > 0 ? (shift === 1 ? "8va" : "15ma") : (shift === -1 ? "8vb" : "15mb");
      const yy = shift > 0 ? L.y(Math.max(pos, 10)) - 17 - (pos > 10 ? 0 : 0) : L.y(Math.min(pos, -10)) + 20;
      const yl = shift > 0 ? Math.min(yy, y - 14) : Math.max(yy, y + 14);
      g += `<text x="${x - 24}" y="${yl + 3}" font-size="10" font-style="italic" fill="var(--blue)" text-anchor="middle">${nameS}</text><line x1="${x - 14}" x2="${x + 14}" y1="${yl}" y2="${yl}" stroke="var(--blue)" stroke-width="0.9" stroke-dasharray="3 2"/><line x1="${x + 14}" x2="${x + 14}" y1="${yl}" y2="${yl + (shift > 0 ? 5 : -5)}" stroke="var(--blue)" stroke-width="0.9"/>`;
    }
  }
  g += `</svg>`;
  out.svg = g;
  // 説明文
  let cap;
  if(!ok){
    const lo = f < 27.5;
    cap = `<b>五線紙の範囲外</b>です。いまの振動数 ${I("f")} ＝ ${fmtF(f)} Hz は、ピアノの音域（A0＝27.5 Hz 〜 C8≒4186 Hz）より${lo ? "低い" : "高い"}音です。`;
  } else {
    const fe = A4 * Math.pow(2, (n - 69) / 12), label = nm + oct + (FLAT[nm] ? `（${FLAT[nm]}${oct}）` : "");
    cap = `<b>${label}　${KANA[pc]}</b><span class="st-sub">平均律で最も近い音：${fmtF(fe)} Hz（A4 ＝ 440 Hz）</span>`;
    if(shift){ const sym = shift > 0 ? (shift === 1 ? "8va" : "15ma") : (shift === -1 ? "8vb" : "15mb"), oc = Math.abs(shift) === 1 ? "1オクターブ" : "2オクターブ";
      cap += `<span class="st-sub">加線が多くなるので、${sym} の記号を使っています。書いてある位置より${oc}${shift > 0 ? "高い" : "低い"}音を表します。</span>`; }
    if(Math.abs(cents) < 3){
      cap += `<span class="st-sub">鳴っている音（${fmtF(f)} Hz）は、平均律の音とほぼ一致しています。</span>`;
    } else {
      const frac = Math.abs(cents) / 100;
      const near = Math.abs(cents) >= 40 ? "2つの半音のほぼ中間にあたる、平均律にはない音（微分音）です。" : "平均律の半音にはあてはまらない微分音程です。";
      cap += `<span class="st-micro">鳴っている音 ${I("f")} ＝ <b>${fmtF(f)} Hz</b> は、${nm}${oct} より約 <b>${Math.abs(cents).toFixed(0)} セント</b>（半音の約 ${frac.toFixed(2)} 倍）<b>${cents > 0 ? "高い" : "低い"}</b>音です。${near}五線紙には最も近い半音の位置に書いています。</span>`;
    }
  }
  out.cap = cap;
  return out;
}
const Staff = {
  mount(el){ injectCss(); el.classList.add("staffbox"); el.innerHTML = `<h3>五線紙で見る</h3><div class="st-fig"></div><p class="st-cap" aria-live="polite"></p>`; },
  set(el, f){ const r = svgFor(f); el.querySelector(".st-fig").innerHTML = r.svg; el.querySelector(".st-cap").innerHTML = r.cap; },
  _svgFor: svgFor
};
window.Staff = Staff;
})();
