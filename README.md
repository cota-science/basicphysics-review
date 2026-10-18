# 物理基礎ラボ（高2・物理基礎）

見て、動かして、解いて確かめる物理基礎の Web 教材です。単元ごとの演習（Webテスト）と、アニメーション・シミュレーターでできています。続編は [物理ラボ](https://cota-science.github.io/physics-lab/)（高3・物理）です。

- 公開ページ：https://cota-science.github.io/basicphysics-review/
- アニメーション集：https://cota-science.github.io/basicphysics-review/anim/
- 対象：高校2年・物理基礎（初めて物理を学ぶ生徒）
- 構成：学習指導要領「物理基礎」の (1) 物体の運動とエネルギー (2) 様々な物理現象とエネルギーの利用 にそった全15単元（基礎1・運動とエネルギー7・熱1・波2・電気2・エネルギーとその利用1・付録1）、採点問題 約830問、アニメーション45ページ
- 付録「数学とつなげる」では、数学Ⅱ（極限・微分・積分）と数学C（ベクトル）で力学を読み直します
- 答えは端末（ブラウザ）に保存され、途中でやめても続きから解けます。サーバーへの送信はありません

## フォルダ構成

```
index.html        単元メニュー（トップページ）
css/style.css     演習ページの見た目
js/app.js         演習の本体（通常は編集不要。答えは端末に保存、保存キーは physics-test:）
js/index.js       単元の一覧（単元を追加したらここに1行書く。href を書いた行はアニメーションへのボタン）
units/            単元ファイル（1単元＝1ファイル）
  TEMPLATE.js     新しい単元のひな形（一覧には載せない）
  notation.js     表記ルールと測定値の扱い
  kinematics.js   速度・加速度（運動の表し方）
  free-fall.js    落体の運動
  plane-motion.js 合成速度・相対速度・放物運動
  force.js        力とつり合い
  newton.js       運動の法則
  fluid-drag.js   圧力・浮力・空気抵抗
  energy.js       仕事と力学的エネルギー
  heat.js         熱とエネルギー
  waves.js        波の性質
  sound.js        音
  current.js      電流と電気抵抗
  ac.js           電流と磁場・交流
  energy-use.js   エネルギーとその利用
  math-link.js    付録：数学で読む力学（微分・積分・ベクトル）
anim/             アニメーション・シミュレーター（1ページ＝1ファイル、ページごとに独立）
  index.html      アニメーション集（カード番号 1〜45）
  lab.css, lab.js 力学ラボ（カード 6〜12）の共通部品（ページ一覧のメニュー、スマホでは折りたたみ）
tools/check.py    単元の検証スクリプト（下の「検証」）
```

## 単元のつくり

どの単元も同じ5つのタブで進みます。

1. **①定義** … 定義カード（用語・式・単位）を見ながら、言葉と式を正確に覚える
2. **②読解** … 図や問題文の言葉を、物理量・向き・符号・条件に置き換える
3. **③次元** … 単位を予測し、式の次元を判定する。次元で見つからない誤りも確かめる
4. **④手順** … 7ステップ（図示 → 既知・未知 → 式を選ぶ → 文字式 → 単位 → 数値・有効数字 → 妥当性）で解く
5. **まとめ** … どの考え方・式を使うかを選ぶ

問題文の ▶ ボタンから、その場面のアニメーションを開いて確かめられます。範囲外の内容には「発展」、中学の内容の確認には「中学の復習」のバッジを付けています。

## 単元を追加する

1. `units/TEMPLATE.js` をコピーして `units/〇〇.js` を作り、問題を書く（`registerUnit` の `id` を一覧と同じにする）
2. `js/index.js` の一覧に `{ id: "〇〇", title: "…", file: "units/〇〇.js" }` を1行書く（`file: null` にすると「準備中」と表示）
3. ブラウザで開くと、書き方に誤り（answer の範囲外、id の重複など）があれば、ページの上に「先生向け」の警告が出ます

問題の種類（`type`）：`choice`（1つ選ぶ）、`multi`（すべて選ぶ）、`blanks`（空欄に選んで入れる）、`num`（数値を入力。`tol` は許容誤差、`traps` はよくある誤答とヒント）、`self`（記述・自己採点。`model` に模範解答）、`checklist`（点検・採点なし）

## アニメーションへのリンク

URL の `#` 以降で、開くタブ（場面）を指定できます。問題文の ▶ ボタンはこれを使っています。

| 分野 | カード | ページと `#` |
|---|---|---|
| 運動 | 1〜5 | `average.html#v` `#a`／`kinematics.html#uniform` `#accel` `#fall`（`#ff-free` など問題ごとの指定も）／`projectile.html`／`monkey.html`／`relative.html#line-sum` `#line-rel` `#plane-sum` `#plane-rel` |
| 力（力学ラボ） | 6〜12 | `forces.html#draw` `#compose` `#resolve`／`spring.html#hang` `#pull`／`balance.html#two` `#three`／`friction.html#floor` `#slope`／`newton.html#inertia` `#law2` `#action` `#eom`／`drag.html`／`fluid.html#pressure` `#buoy` `#pascal` |
| 仕事とエネルギー | 13〜15 | `work.html#def` `#fx` `#power` `#principle`／`energy.html#kinetic` `#theorem` `#gravity` `#spring`／`mech.html#proof` `#cond` `#nc` |
| 波 | 16〜21 | `wave-speed.html#medium` `#free`／`wave-3d.html`／`transverse.html#sup` `#ref` `#std`／`longitudinal.html` |
| 音 | 22〜26 | `string.html`／`air-column.html`／`beats.html`／`timbre.html#add` `#mic` `#vowel`（倍音の加算合成・マイクで声の波形・母音の合成）／`hearing.html`（可聴域） |
| 熱 | 27〜32 | `heat-equilibrium.html`／`heat-motion.html`／`phase-equilibrium.html#lv` `#sl`／`first-law.html`／`heat-engine.html` |
| 電気 | 33〜39 | `ohm.html#one` `#series` `#parallel`／`circuit.html`／`joule.html`／`magnetic.html`／`motor.html#wire` `#sum` `#fix`／`induction.html`／`transformer.html` |
| 原子 | 40〜43 | `nuclear.html#rays` `#decay` `#fission` `#fusion`（`#decay-ra226` のように原子核も指定できる） |
| 付録：数学 | 44〜45 | `calculus.html#lim` `#diff` `#int` `#derive`／`vector.html#ops` `#motion` `#force` `#work` |

カード番号はアニメーション集の表示順の連番です。ページを追加したときは、その分野の末尾に入れて番号を振り直します。

マイク（`timbre.html#mic`）は https のページでのみ使えます。音声は端末の中だけで処理し、録音・送信はしません。

## 文字の表記

- **物理量の文字はイタリック**（*v, a, F, m, g, λ* …）。演習では `<i class='qv'>v</i>` と書く
- **レギュラーのまま**にするもの：単位（m, s, N, J, Hz, kg, m/s² …）、sin・cos・tan、Δ・π、点や物体の名前（A, B, O, P …）
- ベクトルを表すときは、文字の上に矢印（→）を付ける（主に付録「数学とつなげる」のページ）
- 数値は有効数字をそろえ、重力加速度は *g* ＝ 9.8 m/s² とする（詳しくは単元「表記ルールと測定値の扱い」）

## 検証

`tools/check.py` で、単元の全採点問題が「正解」と判定されるか、誤答ヒントがすべて出るか、スマホ幅（390px）・PC 幅（1280px）ではみ出しや JS エラーがないかを確かめられます（Playwright と Node.js が必要）。

```
python3 -m http.server 8130        # リポジトリの直下で
python3 tools/check.py sound "anim/timbre.html#add"   # 単元 id と、確かめたいアニメーションの URL
```

## 進み具合

| 大項目 | 単元 | 演習 | アニメーション |
|---|---|---|---|
| 基礎 | 表記ルールと測定値の扱い | ✓（59問） | |
| (1) 物体の運動とエネルギー | 速度・加速度（運動の表し方） | ✓（70問） | 平均と瞬間、直線運動ラボ |
| | 落体の運動 | ✓（61問） | 直線運動ラボ、投射運動ラボ、モンキーハンティング |
| | 合成速度・相対速度・放物運動 | ✓（48問） | 合成速度と相対速度、投射運動ラボ |
| | 力とつり合い | ✓（53問） | 力学ラボ（作図・合成・分解、フックの法則、つりあい） |
| | 運動の法則 | ✓（64問） | 力学ラボ（摩擦力、運動の三法則） |
| | 圧力・浮力・空気抵抗 | ✓（49問） | 力学ラボ（空気抵抗、水圧・浮力・パスカル） |
| | 仕事と力学的エネルギー | ✓（58問） | 仕事と仕事率、運動エネルギーと位置エネルギー、力学的エネルギー保存 |
| (2) 様々な物理現象とエネルギーの利用 | 熱とエネルギー | ✓（51問） | 熱平衡、状態変化、相平衡、熱力学第一法則、熱機関 |
| | 波の性質 | ✓（67問） | 波の速さ、波を3次元で見る、横波、縦波 |
| | 音 | ✓（46問） | 弦・気柱の固有振動、うなり、音色と波形、可聴域 |
| | 電流と電気抵抗 | ✓（47問） | オームの法則と電力、回路シミュレーター、ジュール熱 |
| | 電流と磁場・交流 | ✓（44問） | 電流がつくる磁場、モーター、電磁誘導と発電機、変圧器と送電 |
| | エネルギーとその利用 | ✓（49問） | 放射線、崩壊と半減期、核分裂、核融合 |
| 付録 | 数学で読む力学 | ✓（62問） | 微分・積分で見る運動、ベクトルで見る運動と力 |

問題数は採点される問題の数（記述・点検を除く）です。
