/* 力学ラボ 共通部品 */
(function(){
'use strict';
const L = window.L = {};
const UI = '"BIZ UDPGothic","Hiragino Kaku Gothic ProN","Yu Gothic UI","Meiryo",system-ui,sans-serif';
const SYM = '"Bookman Old Style","Cambria Math","Cambria","Times New Roman",serif';
const NUM = '"BIZ UDGothic","BIZ UDPGothic",ui-monospace,Consolas,monospace';
L.UI = UI; L.SYM = SYM; L.NUM = NUM;
L.g = 9.8;

/* ---------- colors ---------- */
const VARS = ['bg','surface','surface2','line','grid','grid2','ink','ink2','ink3','ui','ui-soft','pos','vel','acc','neg','hl2','ghost',
  'Fg','FN','Ff','FT','Fk','Fb','Fnet','Fx','block','block2','ground','hatch','water','water2','air','ok','ng','pos-a','vel-a','acc-a','hl2-a'];
L.C = {};
L.refreshColors = function(){
  const cs = getComputedStyle(document.documentElement);
  for (const v of VARS) L.C[v.replace('-', '_')] = cs.getPropertyValue('--' + v).trim();
};
L.refreshColors();
const redrawers = [];
L.onTheme = f => redrawers.push(f);
if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { L.refreshColors(); redrawers.forEach(f => f()); });

/* ---------- formatting ---------- */
L.f = function(v, d = 1){
  if (!isFinite(v)) return '—';
  let s = (Math.abs(v) < 0.5 * Math.pow(10, -d) ? 0 : v).toFixed(d);
  if (s === '-0' || /^-0\.0*$/.test(s)) s = s.slice(1);
  return s.replace('-', '−');
};
/* markup: $F$ → italic symbol, _x / _{xy} → subscript, ^x → superscript */
L.h = function(str){
  let out = '', it = false, i = 0;
  while (i < str.length){
    const ch = str[i];
    if (ch === '$'){ out += it ? '</i>' : '<i class="s">'; it = !it; i++; continue; }
    if ((ch === '_' || ch === '^') && i + 1 < str.length && str[i+1] !== ' '){
      let t; if (str[i+1] === '{'){ const j = str.indexOf('}', i + 2); t = str.slice(i + 2, j); i = j + 1; } else { t = str[i+1]; i += 2; }
      const tag = ch === '_' ? 'sub' : 'sup';
      out += it ? `</i><${tag}>${t}</${tag}><i class="s">` : `<${tag}>${t}</${tag}>`; continue;
    }
    out += ch; i++;
  }
  if (it) out += '</i>';
  return out.replace(/<i class="s"><\/i>/g, '');
};
L.set = function(el, html){ if (typeof el === 'string') el = document.getElementById(el); if (el && el._h !== html){ el.innerHTML = html; el._h = html; } };

/* ---------- canvas ---------- */
L.canvas = function(cv, draw){
  const ctx = cv.getContext('2d');
  const o = { cv, ctx, w: 300, h: 150, draw };
  const fit = () => {
    const r = cv.getBoundingClientRect(); const d = window.devicePixelRatio || 1;
    if (r.width < 2) return;
    o.w = r.width; o.h = r.height;
    cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    o.draw && o.draw();
  };
  o.fit = fit;
  o.clear = () => { ctx.clearRect(0, 0, o.w, o.h); };
  if (window.ResizeObserver) new ResizeObserver(fit).observe(cv); else addEventListener('resize', fit);
  L.onTheme(() => o.draw && o.draw());
  requestAnimationFrame(fit);
  return o;
};

/* rich text on canvas (same markup as L.h). returns width */
L.rich = function(ctx, str, x, y, o = {}){
  const size = o.size || 14, align = o.align || 'left';
  const segs = []; let it = false, i = 0;
  str = String(str);
  while (i < str.length){
    const ch = str[i];
    if (ch === '$'){ it = !it; i++; continue; }
    if ((ch === '_' || ch === '^') && i + 1 < str.length && str[i+1] !== ' '){
      let t; if (str[i+1] === '{'){ const j = str.indexOf('}', i + 2); t = str.slice(i + 2, j); i = j + 1; } else { t = str[i+1]; i += 2; }
      segs.push({ t, it: false, sub: ch === '_' ? 1 : -1 }); continue;
    }
    const last = segs[segs.length - 1];
    if (last && !last.sub && last.it === it) last.t += ch; else segs.push({ t: ch, it, sub: 0 });
    i++;
  }
  const font = s => s.it ? `italic ${o.bold ? '700 ' : ''}${(s.sub ? size * .72 : size * 1.1).toFixed(1)}px ${SYM}`
                         : `${o.bold ? '700 ' : ''}${(s.sub ? size * .72 : size).toFixed(1)}px ${o.num ? NUM : UI}`;
  let w = 0;
  for (const s of segs){ ctx.font = font(s); s.w = ctx.measureText(s.t).width + (s.it ? size * .06 : 0); w += s.w; }
  let x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  if (o.bg){
    ctx.save(); ctx.globalAlpha = o.bgAlpha == null ? .85 : o.bgAlpha; ctx.fillStyle = o.bg;
    L.rrect(ctx, x0 - 4, y - size * .78, w + 8, size * 1.56, 4); ctx.fill(); ctx.restore();
  }
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillStyle = o.color || L.C.ink;
  for (const s of segs){ ctx.font = font(s); ctx.fillText(s.t, x0, y + (s.sub === 1 ? size * .32 : s.sub === -1 ? -size * .42 : 0)); x0 += s.w; }
  return w;
};
/* zigzag spring from (x0,y0) to (x1,y1) */
L.spring = function(ctx, x0, y0, x1, y1, o = {}){
  const n = o.coils || 12, wd = o.width || 14, lead = o.lead == null ? 10 : o.lead;
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy); if (len < 1) return;
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const body = Math.max(1, len - 2 * lead);
  ctx.save(); ctx.strokeStyle = o.color || L.C.ink2; ctx.lineWidth = o.w || 2; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + ux * lead, y0 + uy * lead);
  for (let i = 0; i < n * 2; i++){
    const t = lead + body * (i + .5) / (n * 2), side = i % 2 ? -1 : 1;
    ctx.lineTo(x0 + ux * t + nx * wd * side, y0 + uy * t + ny * wd * side);
  }
  ctx.lineTo(x1 - ux * lead, y1 - uy * lead); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
};
L.rrect = function(ctx, x, y, w, h, r){
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
};

/* arrow. o: color,w,head,dash,alpha,label,lside(±1),lpos(0..1),lsize,ldist,dot(start dot) */
L.arrow = function(ctx, x0, y0, x1, y1, o = {}){
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
  const col = o.color || L.C.ink, w = o.w || 3;
  ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.dot){ ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x0, y0, w + 1.2, 0, 7); ctx.fill(); }
  if (len >= 1.5){
    const ux = dx / len, uy = dy / len, h = Math.min(o.head || (8 + w * 1.6), len * .7), hw = h * .5;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = 'butt';
    if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux * h * .85, y1 - uy * h * .85); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - ux * h - uy * hw, y1 - uy * h + ux * hw); ctx.lineTo(x1 - ux * h + uy * hw, y1 - uy * h - ux * hw); ctx.closePath();
    if (o.hollow){ ctx.lineWidth = 1.5; ctx.stroke(); } else ctx.fill();
  }
  ctx.restore();
  if (o.label){
    const ux = len > 0 ? dx / len : 0, uy = len > 0 ? dy / len : -1;
    const p = o.lpos == null ? 1 : o.lpos, side = o.lside || 1, d = o.ldist || 15;
    let lx = x0 + dx * p + (-uy) * d * side, ly = y0 + dy * p + ux * d * side;
    if (p >= 1){ lx += ux * 8; ly += uy * 8; }
    L.rich(ctx, o.label, lx, ly, { color: col, size: o.lsize || 14, align: 'center', bg: o.lbg === false ? null : L.C.surface, bold: o.lbold });
  }
};
L.line = function(ctx, x0, y0, x1, y1, col, w = 1, dash){
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
};
L.poly = function(ctx, pts, fill, stroke, w = 1.5){
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
  if (fill){ ctx.fillStyle = fill; ctx.fill(); }
  if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.stroke(); }
};
/* ground with hatching; from x0 to x1 at y (surface), hatch below */
L.ground = function(ctx, x0, y, x1, depth = 12){
  ctx.save();
  ctx.fillStyle = L.C.surface2; ctx.fillRect(x0, y, x1 - x0, depth);
  ctx.strokeStyle = L.C.hatch; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.rect(x0, y, x1 - x0, depth); ctx.clip();
  ctx.beginPath(); for (let x = x0 - depth; x < x1 + depth; x += 8){ ctx.moveTo(x, y + depth); ctx.lineTo(x + depth, y); } ctx.stroke();
  ctx.restore();
  L.line(ctx, x0, y, x1, y, L.C.ground, 2);
};
/* hatched wall/ceiling along a segment (hatch on the left side when going from p0 to p1) */
L.hatchSeg = function(ctx, x0, y0, x1, y1, depth = 10){
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = uy, ny = -ux;
  ctx.save(); ctx.strokeStyle = L.C.hatch; ctx.lineWidth = 1; ctx.beginPath();
  for (let s = 0; s < len; s += 8){ const ax = x0 + ux * s, ay = y0 + uy * s; ctx.moveTo(ax, ay); ctx.lineTo(ax + nx * depth - ux * depth * .7, ay + ny * depth - uy * depth * .7); }
  ctx.stroke(); ctx.restore();
  L.line(ctx, x0, y0, x1, y1, L.C.ground, 2);
};
/* rotated block centered at (cx,cy), angle a (rad, canvas rotation), size w×h */
L.block = function(ctx, cx, cy, w, h, a = 0, o = {}){
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
  ctx.fillStyle = o.fill || L.C.block; ctx.strokeStyle = o.stroke || L.C.block2; ctx.lineWidth = 1.5;
  L.rrect(ctx, -w / 2, -h / 2, w, h, 3); ctx.fill(); ctx.stroke();
  if (o.text){ L.rich(ctx, o.text, -w / 2 + 6, -h / 2 + 11, { size: o.tsize || 12, align: 'left', color: L.C.ink2 }); }
  ctx.restore();
};
L.angleArc = function(ctx, cx, cy, r, a0, a1, col, label, lsize = 14){
  ctx.save(); ctx.strokeStyle = col || L.C.ink2; ctx.lineWidth = 1.4; ctx.beginPath();
  ctx.arc(cx, cy, r, a0, a1, a1 < a0); ctx.stroke(); ctx.restore();
  if (label){ const am = (a0 + a1) / 2; L.rich(ctx, label, cx + Math.cos(am) * (r + 11), cy + Math.sin(am) * (r + 11), { color: col || L.C.ink2, align: 'center', size: lsize }); }
};

/* ---------- graph ---------- */
L.nice = function(range, n = 5){
  const raw = range / n, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
  return (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
};
/* o: x0,x1,y0,y1,xl,yl,xs,ys,pad:{l,r,t,b} */
L.plot = function(ctx, W, H, o){
  const pad = Object.assign({ l: 52, r: 16, t: 16, b: 34 }, o.pad || {});
  const bx = pad.l, by = pad.t, bw = W - pad.l - pad.r, bh = H - pad.t - pad.b;
  const X = v => bx + (v - o.x0) / (o.x1 - o.x0) * bw, Y = v => by + bh - (v - o.y0) / (o.y1 - o.y0) * bh;
  const xs = o.xs || L.nice(o.x1 - o.x0), ys = o.ys || L.nice(o.y1 - o.y0, 4);
  ctx.save();
  ctx.lineWidth = 1;
  for (let v = Math.ceil(o.x0 / xs - 1e-9) * xs; v <= o.x1 + 1e-9; v += xs){
    const x = X(v); ctx.strokeStyle = L.C.grid; ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x, by + bh); ctx.stroke();
    L.rich(ctx, L.f(v, xs < 1 ? (xs < .1 ? 2 : 1) : 0), x, by + bh + 12, { size: 11, align: 'center', color: L.C.ink3, num: true });
  }
  for (let v = Math.ceil(o.y0 / ys - 1e-9) * ys; v <= o.y1 + 1e-9; v += ys){
    const y = Y(v); ctx.strokeStyle = L.C.grid; ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx + bw, y); ctx.stroke();
    L.rich(ctx, L.f(v, ys < 1 ? (ys < .1 ? 2 : 1) : 0), bx - 5, y, { size: 11, align: 'right', color: L.C.ink3, num: true });
  }
  ctx.strokeStyle = L.C.ink3; ctx.lineWidth = 1.4;
  const ax = o.x0 <= 0 && o.x1 >= 0 ? X(0) : bx, ay = o.y0 <= 0 && o.y1 >= 0 ? Y(0) : by + bh;
  ctx.beginPath(); ctx.moveTo(bx, ay); ctx.lineTo(bx + bw, ay); ctx.moveTo(ax, by); ctx.lineTo(ax, by + bh); ctx.stroke();
  ctx.restore();
  if (o.xl) L.rich(ctx, o.xl, bx + bw, by + bh + 26, { size: 12.5, align: 'right', color: L.C.ink2 });
  if (o.yl) L.rich(ctx, o.yl, bx + 4, by + 2, { size: 12.5, align: 'left', color: L.C.ink2, bg: L.C.surface });
  return { X, Y, bx, by, bw, bh, clip(){ ctx.save(); ctx.beginPath(); ctx.rect(bx, by - 1, bw, bh + 2); ctx.clip(); }, unclip(){ ctx.restore(); } };
};
L.path = function(ctx, P, pts, col, w = 2, dash){
  if (!pts.length) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = 'round'; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); pts.forEach((p, i) => { const x = P.X(p[0]), y = P.Y(p[1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.restore();
};
L.fn = function(ctx, P, f, a, b, col, w = 2, dash, n = 200){
  const pts = []; for (let i = 0; i <= n; i++){ const x = a + (b - a) * i / n; const y = f(x); if (isFinite(y)) pts.push([x, y]); }
  L.path(ctx, P, pts, col, w, dash);
};
L.dot = function(ctx, x, y, r, col, ring){
  ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  if (ring){ ctx.strokeStyle = L.C.surface; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore();
};

/* ---------- pointer drag ---------- */
L.drag = function(cv, h){
  let cur = null;
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointerdown', e => { const [x, y] = pos(e); cur = h.hit(x, y); if (cur){ cv.setPointerCapture(e.pointerId); e.preventDefault(); h.move(cur, x, y); } });
  cv.addEventListener('pointermove', e => { const [x, y] = pos(e);
    if (cur){ h.move(cur, x, y); } else cv.style.cursor = h.hit(x, y) ? 'grab' : 'default'; });
  const end = () => { if (cur){ h.end && h.end(cur); cur = null; } };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
};

/* ---------- animation loop ---------- */
L.loop = function(step){
  let raf = 0, last = 0;
  const o = { running: false,
    start(){ if (o.running) return; o.running = true; last = performance.now(); raf = requestAnimationFrame(tick); o.onstate && o.onstate(); },
    stop(){ o.running = false; cancelAnimationFrame(raf); o.onstate && o.onstate(); } };
  function tick(t){
    const dt = Math.max(0, Math.min(.05, (t - last) / 1000)); last = Math.max(last, t);
    const r = step(dt);
    if (r === false){ o.stop(); return; }
    if (o.running) raf = requestAnimationFrame(tick);
  }
  return o;
};

/* ---------- params panel ---------- */
/* defs: {k,lab,min,max,step,unit,d,hint,wide} | {t:'seg',k,lab,opts:[[v,label]]} | {t:'check',k,lab} | {t:'html',html} */
L.params = function(el, defs, st, onChange){
  if (typeof el === 'string') el = document.getElementById(el);
  el.innerHTML = ''; el.classList.add('prm');
  const api = { inputs: {} };
  for (const d of defs){
    const f = document.createElement('div'); f.className = 'field' + (d.wide ? ' wide' : '');
    if (d.t === 'html'){ f.innerHTML = d.html; el.appendChild(f); continue; }
    if (d.t === 'seg'){
      f.innerHTML = `<div class="lab"><span>${L.h(d.lab)}</span></div><div class="seg" role="group"></div>${d.hint ? `<div class="hint">${L.h(d.hint)}</div>` : ''}`;
      const sg = f.querySelector('.seg');
      for (const [v, lab] of d.opts){
        const b = document.createElement('button'); b.type = 'button'; b.innerHTML = '<span>' + L.h(lab) + '</span>'; b.dataset.v = v;
        b.setAttribute('aria-pressed', String(st[d.k] == v));
        b.onclick = () => { st[d.k] = typeof st[d.k] === 'number' ? +v : v; sg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); onChange(d.k, st[d.k]); };
        sg.appendChild(b);
      }
      api.inputs[d.k] = { set(v){ st[d.k] = v; sg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.v == v))); } };
      el.appendChild(f); continue;
    }
    if (d.t === 'check'){
      f.innerHTML = `<label class="chip" style="align-self:flex-start"><input type="checkbox"> <span>${L.h(d.lab)}</span></label>${d.hint ? `<div class="hint">${L.h(d.hint)}</div>` : ''}`;
      const c = f.querySelector('input'); c.checked = !!st[d.k];
      c.onchange = () => { st[d.k] = c.checked; onChange(d.k, c.checked); };
      api.inputs[d.k] = { set(v){ st[d.k] = v; c.checked = !!v; } };
      el.appendChild(f); continue;
    }
    const id = 'p_' + d.k + '_' + Math.random().toString(36).slice(2, 7);
    f.innerHTML = `<div class="lab"><label for="${id}">${L.h(d.lab)}</label><output for="${id}"></output></div>
      <input type="range" id="${id}" min="${d.min}" max="${d.max}" step="${d.step}">${d.hint ? `<div class="hint">${L.h(d.hint)}</div>` : ''}`;
    const inp = f.querySelector('input'), out = f.querySelector('output');
    const show = () => { out.innerHTML = L.f(st[d.k], d.d == null ? 1 : d.d) + (d.unit ? ' ' + L.h(d.unit) : ''); };
    inp.value = st[d.k]; show();
    inp.oninput = () => { st[d.k] = +inp.value; show(); onChange(d.k, st[d.k]); };
    api.inputs[d.k] = { set(v){ st[d.k] = v; inp.value = v; show(); }, el: inp, setMax(m){ inp.max = m; if (st[d.k] > m){ st[d.k] = m; inp.value = m; show(); } } };
    el.appendChild(f);
  }
  return api;
};

/* readout cells: items [{k,lab,cls}] */
L.readout = function(el, items){
  if (typeof el === 'string') el = document.getElementById(el);
  el.innerHTML = items.map(it => `<div class="${it.cls || ''}"><div class="k">${L.h(it.lab)}</div><div class="v" data-k="${it.k}"${it.c ? ` style="color:var(--${it.c})"` : ''}>—</div></div>`).join('');
  el.style.setProperty('--cols', Math.min(items.length, 4));
  return vals => { for (const k in vals){ const c = el.querySelector(`[data-k="${k}"]`); if (c) L.set(c, vals[k]); } };
};

/* tabs with hash */
L.tabs = function(el, onChange){
  if (typeof el === 'string') el = document.getElementById(el);
  const tabs = [...el.querySelectorAll('.tab')];
  const sel = (m, push) => {
    if (!tabs.some(t => t.dataset.mode === m)) m = tabs[0].dataset.mode;
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.mode === m)));
    if (push) history.replaceState(null, '', '#' + m);
    onChange(m);
  };
  tabs.forEach(t => t.addEventListener('click', () => sel(t.dataset.mode, true)));
  addEventListener('hashchange', () => sel(location.hash.slice(1)));
  sel(location.hash.slice(1));
};

L.PAGES = [['forces.html','力の作図・合成・分解'],['spring.html','フックの法則'],['balance.html','力のつりあい'],['friction.html','摩擦力'],['newton.html','運動の三法則'],['drag.html','空気抵抗'],['fluid.html','水圧・浮力・パスカル']];
L.nav = function(){
  const el = document.getElementById('nav'); if (!el) return;
  const here = location.pathname.split('/').pop() || 'index.html';
  el.innerHTML = '<a href="index.html#force">≡ 力学ラボ</a>' + L.PAGES.map(([h, t]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ''}>${t}</a>`).join('');
};
document.addEventListener('DOMContentLoaded', L.nav);
L.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
L.deg = Math.PI / 180;
})();
