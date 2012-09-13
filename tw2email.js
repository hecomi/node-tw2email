/* ========================================================================
 *  tw2email.js
 *  一定間隔で Twitter の特定のリストのつぶやきをメールで送信してくれる
 * ======================================================================== */
var Setting        = require('./setting.js')
  , list_name      = Setting.twitter.list_name
  , getListMembers = require('./getList.js')
  , mongoose       = require('mongoose')
  , Schema         = mongoose.Schema
  , mail           = require('mail').Mail(Setting.gmail)
  , ejs            = require('ejs')
  , fs             = require('fs')
  , cronJob        = require('cron').CronJob
;

var job = new cronJob({
	cronTime: Setting.cronTime,
	onTick: function() {
		main();
	},
	onComplete: function() {
		console.log('Complete!');
	},
	start: false,
	timeZone: 'Japan'
});
job.start();

// MongoDB へ接続
mongoose.connect('mongodb://localhost/Twitter');

// ツイート DB から必要な情報を抜き出す
var Post = mongoose.model('Post', new Schema({
	id         : Number,
	text       : String,
	created_at : String,
	user       : {
		profile_image_url : String,
		screen_name       : String
	}
}));

// 前回取得した日付を格納 / 取得
var LastTweet = mongoose.model('LastTweet', new Schema({
	list_name : String,
	id        : Number
}));

// リストのツイートをメールで送信
function main() {
	getListMembers( function(members) {
		LastTweet.findOne({ list_name: list_name }, function(err, doc) {
			// 最後に取得した ツイートID を取得
			var last_id = 0;
			if (doc !== null) {
				last_id = doc.id;
			}

			// 最後に取得したツイート移行のツイートを検索
			Post.find({
				id : { $gt: last_id },
				'user.screen_name' : { $in: members },
			}, function(err, docs) {
				if (err) {
					console.error(err);
					return;
				}
				var template = fs.readFileSync(Setting.mail.template).toString();
				var html     = ejs.render(template, {
					list_name : list_name,
					tweets    : docs
				});
				mail.message({
					from    : Setting.mail.from,
					to      : Setting.mail.to,
					subject : Setting.twitter.list_name + ' users\' new tweets',
					'Content-Type' : 'text/html; charset=ISO-2022-JP'
				})
				.body(html)
				.send(function(err) {
					if (err) console.error(err);
					console.log('[' + new Date() + '] Sent!')
				});

				// 最終取得 ID を更新
				LastTweet.update(
					{ list_name : list_name },
					{ id        : docs[docs.length - 1].id },
					{ upsert    : true },
					function (err, numAffected, raw) {
						if (err) console.error(err);
					}
				);
			});
		});
	});
}
