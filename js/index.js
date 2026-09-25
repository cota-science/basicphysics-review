/*
 * 単元の一覧（メニュー画面に表示される順番）
 *
 * 単元を追加するとき：
 *   1. units/TEMPLATE.js をコピーして units/〇〇.js を作り、問題を書く
 *   2. 下の一覧で、その単元の file に "units/〇〇.js" を書く
 *      （一覧にない単元なら、{ id: ..., title: ..., file: ... } の行を追加する）
 *
 * file: null の単元は、メニューに「準備中」と表示されます。
 * id は半角英数字とハイフンだけにし、単元ファイルの registerUnit の id と同じにしてください。
 */
window.UNIT_LIST = [
  { group: "運動とエネルギー", units: [
    { id: "kinematics", title: "速度・加速度（運動の表し方）", file: "units/kinematics.js" },
    { id: "free-fall",  title: "落体の運動",                 file: "units/free-fall.js" },
    { id: "force",      title: "力とつり合い",               file: "units/force.js" },
    { id: "newton",     title: "運動の法則",                 file: "units/newton.js" },
    { id: "energy",     title: "仕事と力学的エネルギー",     file: null }
  ]},
  { group: "熱", units: [
    { id: "heat",       title: "熱とエネルギー",             file: null }
  ]},
  { group: "波", units: [
    { id: "waves",      title: "波の性質",                   file: null },
    { id: "sound",      title: "音",                         file: null }
  ]},
  { group: "電気", units: [
    { id: "current",    title: "電流と電気抵抗",             file: null },
    { id: "ac",         title: "電流と磁場・交流",           file: null }
  ]},
  { group: "エネルギーとその利用", units: [
    { id: "energy-use", title: "エネルギーとその利用",       file: null }
  ]}
];
