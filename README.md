# Monster Duel Web

ブラウザで遊べる「モンスター対戦」デモサイト。  
**公開**: GitHub Pages（`Settings > Pages`）でブランチを `main`、フォルダを `/root` に設定。

## 構成
- `index.html` … TOP
- `demo.html` … デモ埋め込み（`openDemo` ボタンの `data-demo-src` を公開URLへ）
- `changelog.html` … `data/version.json` を読み込んで更新履歴を表示
- `concept/*` … 世界観・育成・バトルの説明
- `requirements/*` … 要件定義（ゲームプレイ／システム／ロードマップ）
- `pages/*` … データ連動一覧（モンスター／技／属性相性）
- `data/*` … JSON データ
- `assets/css/site.css` `assets/js/*` … 共通アセット

## ローカル動作
静的ファイルのみ。VSCode Live Server などでOK。

## データ差し替え
`data/monsters.json`, `moves.json`, `types.json` を編集すると自動で反映。カラムを増やす場合は `assets/js/render-*.js` を調整。

## ライセンス
© Monster Duel Project
