/* ========================================================================
 *  conf.js
 *  各種設定を行うファイル
 * ======================================================================== */
module.exports = {
	// Twitter 関連
	twitter : {
		id                  : 'hecomi',      // Twitter の ID
		list_name           : 'information', // リスト
		api                 : 'https://api.twitter.com/1.1/lists/members.json',
		consumer_key        : 'xxxxxxxxxx',
		consumer_secret     : 'xxxxxxxxxx',
		access_token_key    : 'xxxxxxxxxx',
		access_token_secret : 'xxxxxxxxxx'
		retry : {
			interval : 1000 * 60 * 5, // API がリミットに達した時などのリトライ間隔
	 		cnt      : 5              // リトライ回数
		}
	},
	gmail : {
		host     : 'smtp.gmail.com',
		username : 'xxxxxxxx', // Gmail のユーザ名
		password : 'xxxxxxxx'  // Gmail のパスワード
	},
	mail : {
		from     : 'hoge@hogehoge.com', // メールの送り元
		to       : 'hoge@hogehoge.com', // メールの送信先
		template : './template.html'    // メールのテンプレ
	},
	cronTime : '0 0-23/6 * * *' // メールを送信する間隔（cron 表記）
};
