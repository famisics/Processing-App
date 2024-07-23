# funget (ファンジェット - Processing-App)

> 🔧　大急ぎで個人制作をしたため、コミットメッセージが意味をなしていないことを、ご了承ください。コメント、READMEは整備してあるはずです。

[Githubリポジトリ - famisics/Processing-App](https://github.com/famisics/Processing-App)

## 注意

1. インターネットに接続されていない状態でAPIを呼び出すと、ぬるぽ(NullPointerException)を吐きます  
仕様なのでおそらくどうにもできません、気をつけてください

2. APIキーは暗号化されていますが、おそらくがんばれば復号できます。  
このアプリ以外でAPIキーを利用したり、APIキーを復号しようとしたりしないでください。

3. APIのレスポンスはキャッシュ(2分間)されているので、何度もページを切り替えても、APIに制限がかかることはありません  
ただし、バスの取得とIPアドレスの判定については、リアルタイム性を優先してキャッシュを保存していません  
バックエンドに負荷がかかるので、理由なくリロードを繰り返さないでください

## 追加情報

1. アプリ名の funget = funで役立つ + widget(ウィジェット) という意味  
~~winget風味でもある~~

2. コメントは、vscode拡張機能「Better Comments」に最適化されています  
動作できる環境をお持ちの方は、より分かりやすく色付けされたコメントを確認できます

3. このアプリでは、IPアドレスのorganizationから接続先を検出し、モードに適用しています  
free-wifiがフレッツ光回線であるため、ご家庭のフレッツ光でも未来大モードとして検出されます  
フレッツ光をお使いの方は、free-wifiを未来大モードから除外するスイッチをONにしてください

## バックエンド

- Google Apps Script (funbus, fitbit)

  - Google Spreadsheet

- Fitbit API

- Open Weather Map API

- ipinfo.io API

## ライセンス

- みんちりえ ([https://min-chi.material.jp/](https://min-chi.material.jp/))

- ぱくたそ ([https://www.pakutaso.com](https://www.pakutaso.com))

- Google Fonts

- Google Material Symbols

2024 © famisics ([uiro.dev](https://uiro.dev))
