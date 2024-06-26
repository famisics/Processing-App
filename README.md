# funget (ファンジェット - Processing-App)

> 🤔 APIキーが含まれていないため、このリポジトリからアプリを正常に実行することはできません  
> 動作しているアプリを確認したい場合は、[私のWebサイト](https://uiro.dev) からアプリの紹介記事を探し、公開されているこのプロジェクトのURLに移動してください

[Github リポジトリ - famisics/Processing-App](https://github.com/famisics/Processing-App)

## 注意

1. インターネットに接続されていない状態で API を呼び出すと、ぬるぽ(NullPointerException)を吐きます  
   仕様なのでおそらくどうにもできません、気をつけてください

2. API キーは暗号化されていますが、おそらくがんばれば復号できます。  
   このアプリ以外で API キーを利用したり、API キーを復号しようとしたりしないでください。

3. API のレスポンスはキャッシュ(2 分間)されているので、何度もページを切り替えても、API に制限がかかることはありません  
   ただし、バスの取得と IP アドレスの判定については、リアルタイム性を優先してキャッシュを保存していません  
   バックエンドに負荷がかかるので、理由なくリロードを繰り返さないでください

## 追加情報

1. アプリ名の funget = fun で役立つ + widget(ウィジェット) という意味  
   ~~winget 風味でもある~~

2. コメントは、vscode 拡張機能「Better Comments」に最適化されています  
   動作できる環境をお持ちの方は、より分かりやすく色付けされたコメントを確認できます

3. このアプリでは、IP アドレスの organization から接続先を検出し、モードに適用しています  
   free-wifi がフレッツ光回線であるため、ご家庭のフレッツ光でも未来大モードとして検出されます  
   フレッツ光をお使いの方は、free-wifi を未来大モードから除外するスイッチを ON にしてください

## バックエンド

- Google Apps Script (funbus, fitbit)

  - Google Spreadsheet

- Fitbit API

- Open Weather Map API

- ipinfo.io API

## ライセンス

- [freepik](https://www.flaticon.com/authors/freepik)

- みんちりえ ([https://min-chi.material.jp/](https://min-chi.material.jp/))

- ぱくたそ ([https://www.pakutaso.com](https://www.pakutaso.com))

- Google Fonts

- Google Material Symbols

2024 © famisics ([uiro.dev](https://uiro.dev))
