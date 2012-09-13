node-tw2email
==============

はじめに
--------------
Twitter の特定の TL を一定間隔で HTML メールで送信してくれます。

ライセンス
--------------
NYSL ライセンスです。

必要な環境
--------------
* Node.js
* MongoDB

インストール
--------------
	$ git clone git://github.com/hecomi/node-tw2email
	$ cd node-tw2email
	$ npm install

使い方
--------------
setting.js に Twitter / gmail のアカウント等を記入して下さい。
この後、forever で永続的にプロセスを走らせれば完了です。
forever をインストールしていない人は下記コマンドでインストールして下さい

	$ npm install -g forever

tw2db で DB へ自分のホーム TL を格納します。
tw2email で setting.js の cron で設定した間隔でメールを送信します。

	$ forever start tw2db
	$ forever start tw2email

詳細
--------------
その他詳細は Twitter:@hecomi へご質問いただくか、http://d.hatena.ne.jp/hecomi/ をご参照下さい。

