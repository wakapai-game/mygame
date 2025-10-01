# Monster Duel Web

ブラウザで遊べる「モンスター対戦」デモサイト。  
**公開**: GitHub Pages（`Settings > Pages`）でブランチを `main`、フォルダを `/root` に設定。

## 構成
- `index.html` … TOP
mygame/
├─ index.html # トップページ（概要・リンク集）
├─ demo.html # デモプレイ画面
├─ changelog.html # 更新履歴
├─ concept/ # コンセプト関連ページ
│ ├─ index.html # コンセプト総覧
│ ├─ overall.html # 全体コンセプト
│ ├─ growth.html # 育成システムコンセプト
│ └─ battle.html # 対戦システムコンセプト
├─ requirements/ # 要件定義関連ページ
│ ├─ index.html # 要件定義トップ
│ ├─ gameplay.html # 画面/ゲームプレイ要件
│ ├─ system.html # システム/データ要件
│ └─ roadmap.html # ロードマップ
├─ pages/ # データ閲覧ページ
│ ├─ monsters.html # モンスター図鑑（JSON読込表示）
│ ├─ moves.html # 技一覧（JSON読込表示）
│ └─ type-chart.html # 属性相性表
├─ data/ # 正本データ（ゲーム/サイト共用）
│ ├─ monsters.json # モンスター情報
│ ├─ moves.json # 技情報
│ ├─ types.json # 属性相性マトリクス
│ └─ version.json # バージョン管理
├─ assets/ # 静的リソース
│ ├─ css/
│ │ └─ site.css # 共通スタイル
│ ├─ js/
│ │ ├─ main.js # 共通スクリプト
│ │ ├─ render-monsters.js# モンスター一覧描画
│ │ ├─ render-moves.js # 技一覧描画
│ │ └─ type-chart.js # 属性相性表描画
│ └─ images/ # 画像素材
├─ .github/
│ └─ ISSUE_TEMPLATE/
│ └─ feedback.yml # フィードバック用テンプレート
├─ docs/ # 仕様資料（Markdown/PDF）
│ ├─ concept.md # コンセプトまとめ
│ ├─ requirements.md # 要件定義まとめ
│ └─ repository-structure.md # リポジトリ構成の最新ドキュメント
├─ README.md # この説明ファイル
├─ robots.txt # 検索クローラー設定
└─ sitemap.xml # サイトマップ

## 📑 フォルダ/ファイル説明

- **index.html** : サイトのトップページ。デモ・コンセプト・要件定義・データへの導線をまとめる。  
- **demo.html** : 実際に遊べるデモプレイ画面。  
- **changelog.html** : バージョン履歴や更新情報を記載。  

### concept/
- **index.html** : コンセプト全体の目次。  
- **overall.html** : ゲーム全体の設計思想。  
- **growth.html** : 育成システムの考え方。  
- **battle.html** : 対戦システムの設計思想。  

### requirements/
- **index.html** : 要件定義の目次。  
- **gameplay.html** : 画面/ゲームプレイに関する要件。  
- **system.html** : システム設計・データ仕様。  
- **roadmap.html** : 今後の開発計画。  

### pages/
- **monsters.html** : モンスター図鑑をJSONから生成して表示（`assets/js/monsters.js`, `assets/css/monsters.css` を使用）。  
- **moves.html** : 技一覧をJSONから生成して表示（`assets/js/moves.js`, `assets/css/moves.css` を使用）。  
- **type-chart.html** : 属性相性表を描画。  

### data/
- **monsters.json** : モンスターの基礎データ。  
- **moves.json** : 技データ。  
- **types.json** : 属性相性表（多次元配列）。  
- **version.json** : データ/ゲームバージョン。  

### assets/
- **css/site.css** : 共通デザイン定義。  
- **css/monsters.css** : モンスター一覧固有の追加スタイル。  
- **css/moves.css** : 技一覧固有の追加スタイル。  
- **css/battle.css** : バトル画面用のスタブスタイル。  
- **js/main.js** : 共通スクリプト。  
- **js/render-***.js** : 各データをHTMLに描画する専用スクリプト。  
- **images/** : アイコンや背景などの素材。  

### docs/
- **concept.md** : コンセプト文書（Markdown形式）。  
- **requirements.md** : 要件定義文書（Markdown形式）。  
- **repository-structure.md** : 最新のリポジトリ構成をMarkdownでまとめたもの。  

### その他
- **.github/ISSUE_TEMPLATE/feedback.yml** : フィードバック投稿用テンプレート。  
- **robots.txt** : 検索エンジン用のクロール設定。  
- **sitemap.xml** : サイトマップ。  

---

## 📨 フィードバック
- GitHub Issues: https://github.com/OWNER/REPO/issues/new?labels=feedback&template=feedback.yml

## ローカル動作
静的ファイルのみ。VSCode Live Server などでOK。

## データ差し替え
`data/monsters.json`, `moves.json`, `types.json` を編集すると自動で反映。カラムを増やす場合は `assets/js/monsters.js` / `assets/js/moves.js` を調整。

## ライセンス
© Monster Duel Project
