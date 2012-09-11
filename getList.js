/* ========================================================================
 *  getList.js
 *  リストに格納されたメンバ一覧を配列で返す getListMembers() を定義
 * ======================================================================== */
var util       = require('util')
  , twitter    = require('twitter')
  , mongoose   = require('mongoose')
  , Schema     = mongoose.Schema
  , Setting    = require('./conf.js')
;

// リストに含まれているメンバーの ID
var members = [];

// Twitter へ接続
var tw = new twitter({
	consumer_key        : Setting.twitter.consumer_key,
	consumer_secret     : Setting.twitter.consumer_secret,
	access_token_key    : Setting.twitter.access_token_key,
	access_token_secret : Setting.twitter.access_token_secret
});

// 指定したリストに含まれるアカウント一覧を取得する
function getListMembersRecursive(cursor, callback) {
	var param = {
		slug              : Setting.twitter.list_name,
		owner_screen_name : Setting.twitter.id,
		cursor            : cursor
	};
	tw.get(Setting.twitter.api, param, function(data) {
		// エラーが起きたときは interval 秒後にリトライ
		if (!data.hasOwnProperty('users')) {
			console.error('[getListMembers.js] Error!');
			console.error(data);
			if (--Setting.twitter.retry.cnt <= 0) {
				throw 'Reached max retry num...';
				return;
			}
			setTimeout( function(){
				getListMembersRecursive(cursor, callback);
			}, Setting.twitter.retry.interval );
			return;
		}

		// ID を members に格納する
		for (var i in data.users) {
			members.push( data.users[i].screen_name );
		}
		util.print('.');
		if (data.next_cursor !== 0) {
			getListMembersRecursive(data.next_cursor, callback);
		} else {
			// next_cursor がなくなったら callback を呼ぶ
			util.print('\n');
			callback(members);
		}
	});
}

// export する関数
module.exports = function(callback) {
	getListMembersRecursive(-1, callback);
}

// 例外処理
process.on('uncaughtException', function (err) {
	console.log('uncaughtException => ' + err);
});

