/* ========================================================================
 *  tw2db.js
 *  Streaming API で Twitter の TL を MongoDB へ保存する
 * ======================================================================== */
var twitter    = require('twitter')
  , mongoose   = require('mongoose')
  , Schema     = mongoose.Schema
  , Setting    = require('./setting.js');
;

// typeof で得た文字列を型に変換
var typeMap = {
	number   : Number,
	string   : String,
	boolean  : Boolean,
	object   : Object,
	function : Function
};

// オブジェクト/配列を受け取って Mongoose 用 Schema に変換
function makeSchema(data) {
	var schema = {};
	for (var x in data) {
		var type = typeof data[x];
		if (data[x] === null) {
			schema[x] = Object;
		} else if (type === 'object') {
			schema[x] = makeSchema(data[x]) ;
		} else {
			schema[x] = typeMap[type];
		}
	}
	return schema;
}

// MongoDB へ接続
mongoose.connect('mongodb://localhost/Twitter');

// mongoose のスキーマ
var PostSchema, Post, isSchemaDefined = false;

// Twitter へ接続
var tw = new twitter({
	consumer_key        : Setting.twitter.consumer_key,
	consumer_secret     : Setting.twitter.consumer_secret,
	access_token_key    : Setting.twitter.access_token_key,
	access_token_secret : Setting.twitter.access_token_secret
});

tw.stream('user', function(stream) {
	stream.on('data', function(data) {
		// Friends リストのデータはすっ飛ばす
		if ( !('id' in data) ) {
			return;
		} else {
			console.log(data.user.screen_name, data.text);
		}

		// 最初のデータで Schema を作成
		if (!isSchemaDefined) {
			PostSchema = new Schema( makeSchema(data) )
			Post       = mongoose.model('Post', PostSchema)
			isSchemaDefined = true;
		}

		// Post Schema から保存用のデータを生成して保存
		var post = new Post(data);
		post.save( function(err) {
			if (err) console.error(err);
		});
	});
});

// 例外処理
process.on('uncaughtException', function (err) {
	console.log('uncaughtException => ' + err);
});
