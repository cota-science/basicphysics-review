/*
 * 単元の一覧（メニュー画面に表示される順番）
 *
 * 単元を追加するとき：
 *   1. units/TEMPLATE.js をコピーして units/〇〇.js を作り、問題を書く
 *   2. 下の一覧で、その単元の file に "units/〇〇.js" を書く
 *      （一覧にない単元なら、{ id: ..., title: ..., file: ... } の行を追加する）
 *
 * file: null の単元は、メニューに「準備中」と表示されます。
 * href を書いた行は単元ではなく、そのページへのボタンになります（例：アニメーション集）。
 * id は半角英数字とハイフンだけにし、単元ファイルの registerUnit の id と同じにしてください。
 */
window.UNIT_LIST = [
    { group: "基礎", units: [
    { id: "notation",   title: "表記ルールと測定値の扱い",   file: "units/notation.js" }
  ]},
  { group: "運動とエネルギー", units: [
    { id: "anim-motion", title: "▶ 運動のシミュレーター",     href: "anim/index.html#motion", note: "運動と x-t・v-t・a-t 図を連動させて、傾き・面積・式の意味を確かめよう。合成速度と相対速度・投射運動・モンキーハンティングも（月や惑星でも）" },
    { id: "kinematics", title: "速度・加速度（運動の表し方）", file: "units/kinematics.js" },
    { id: "free-fall",  title: "落体の運動",                 file: "units/free-fall.js" },
    { id: "plane-motion", title: "合成速度・相対速度・放物運動", file: "units/plane-motion.js" },
    { id: "anim-force", title: "▶ 力のシミュレーター（力学ラボ）", href: "anim/index.html#force", note: "力の作図・合成・分解、フックの法則、力のつりあい、摩擦力、運動の三法則、空気抵抗と終端速度、水圧・浮力・パスカルの原理" },
    { id: "force",      title: "力とつり合い",               file: "units/force.js" },
    { id: "newton",     title: "運動の法則",                 file: "units/newton.js" },
    { id: "fluid-drag", title: "圧力・浮力・空気抵抗",         file: "units/fluid-drag.js" },
    { id: "anim-energy", title: "▶ 仕事とエネルギーのシミュレーター", href: "anim/index.html#energy", note: "仕事と F-x グラフ・仕事率・仕事の原理、運動エネルギーの思考実験、位置エネルギー、力学的エネルギー保存を、エネルギー図と連動させて確かめよう" },
    { id: "energy",     title: "仕事と力学的エネルギー",     file: "units/energy.js" }
  ]},
  { group: "熱", units: [
    { id: "anim-heat",  title: "▶ 熱のアニメーション",       href: "anim/index.html#heat", note: "熱平衡・状態変化・相平衡・熱力学第一法則・熱機関を、モデルで見よう" },
    { id: "heat",       title: "熱とエネルギー",             file: "units/heat.js" }
  ]},
  { group: "波", units: [
    { id: "anim-waves", title: "▶ 波と音のアニメーション集", href: "anim/index.html", note: "演習の前に、波の動きを見て確かめよう" },
    { id: "waves",      title: "波の性質",                   file: "units/waves.js" },
    { id: "sound",      title: "音",                         file: "units/sound.js" }
  ]},
  { group: "電気", units: [
    { id: "anim-elec",  title: "▶ 電気のアニメーション",     href: "anim/index.html#elec", note: "オームの法則と電力、回路、ジュール熱、電流と磁場、モーター、電磁誘導と発電機、変圧器と送電" },
    { id: "current",    title: "電流と電気抵抗",             file: "units/current.js" },
    { id: "ac",         title: "電流と磁場・交流",           file: "units/ac.js" }
  ]},
  { group: "エネルギーとその利用", units: [
    { id: "anim-nuclear", title: "▶ 原子核と放射線のアニメーション", href: "anim/index.html#nuclear", note: "放射線の透過力と電離作用、崩壊と半減期（原子核を選べる）、核分裂の連鎖反応と制御棒、核融合" },
    { id: "energy-use", title: "エネルギーとその利用",       file: "units/energy-use.js" }
  ]},
  { group: "付録：数学とつなげる", units: [
    { id: "anim-calculus", title: "▶ 微分・積分で見る運動",     href: "anim/calculus.html", note: "数学Ⅱの極限・微分・積分で運動を読む。平均変化率 → 瞬間の速度、x → v → a と増減表（折り返し）、短冊の和 → 定積分 ＝ 変位、等加速度の3式を導く" },
    { id: "anim-vector", title: "▶ ベクトルで見る運動と力",     href: "anim/vector.html", note: "数学Cのベクトルで力学を読む。和・差・成分（合成速度・相対速度・合力）、位置・速度・加速度ベクトル、力のつりあいと軸のとり方、仕事 ＝ 内積" },
    { id: "math-link",  title: "数学で読む力学（微分・積分・ベクトル）", file: "units/math-link.js" }
  ]}
];
