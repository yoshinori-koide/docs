var peer = new Peer({
  // Set API key for cloud server (you don't need this if you're running your
  // own.
  key: 'cc6f5bfa-ec91-11e3-8c36-09d78563cbeb',
// localhostは以下のキーを使用
//  key: '6165842a-5c0d-11e3-b514-75d3313b9d05',

  // Set highest debug level (log everything!).
  debug: 3,

  // Set a logging function:
  logFunction: function() {
    var copy = Array.prototype.slice.call(arguments).join(' ');
    console.log(copy);
  }
});
var connectedPeers = {};
var newCheckinPeers = {};
var reqCount = 0;
var resCount = 0;

// 送信専用
function sendMyData(myData,peerId) {
    var peer = new Peer({
	// Set API key for cloud server (you don't need this if you're running your
	// own.
	key: 'cc6f5bfa-ec91-11e3-8c36-09d78563cbeb',
	// localhostは以下のキーを使用
	//  key: '6165842a-5c0d-11e3-b514-75d3313b9d05',
	
	// Set highest debug level (log everything!).
	debug: 3,
	
	// Set a logging function:
	logFunction: function() {
	var copy = Array.prototype.slice.call(arguments).join(' ');
	console.log(copy);
	}
    });
    
	 // リクエスト
	 var c = peer.connect(peerId, {
	 	label: 'checkin',
	 	serialization: 'none',
	 	metadata: {myData:myData}
	 });
	 c.on('open', function() {
	 	connect(c);
	 });
	 c.on('close', function() {
	 	console.log(c.peer + ' close.');
	 });
	 c.on('error', function(err) {
	 	alert(err);
	 });
}

// 他からの接続を検知
peer.on('connection', connect);

// 他との接続を検知したときに実行
function connect(c) {
	if (c.label === 'checkin') {
		// チェックイン時接続
		c.on('open', function() {
		
			var uId = c.metadata.userId;
			var meData = JSON.parse(window.localStorage.getItem('me'));
			if (meData.store_id) {
				// ユーザ情報も上書き保存
				window.localStorage.setItem('user_' + c.metadata.userId, JSON.stringify(c.metadata.userData));
				var mDataList = [c.metadata.matrixDataList];
				for (key in mDataList) {
					// マトリクスはとりあえず全件保存しとく
					window.localStorage.setItem(key, JSON.stringify(mDataList[key]));
				}
				
				var sId = c.metadata.storeId;
				// 自身がチェックイン中のお店と一致したら返信する
				if (sId === meData.store_id) {
					// 自身のデータ作成
					// meデータを取得
					meData = JSON.parse(window.localStorage.getItem('me'));
					// 自身のユーザデータ取得
					var myUserData = 'user_' + meData.user_id + ':' + window.localStorage.getItem('user_' + meData.user_id);
					// localStrageのデータ全件からmatrix_log_を全件取得する
					var matrixData = [];
					for(var i = 0; i < window.localStorage.length; i++){  
					   // キー名の取得  
					   var k = window.localStorage.key(i);  
					     // matrix_log_[user_id]_で始まるデータを判別する
							var str = ' ' + k;
							if (str.indexOf(' matrix_log_' + meData.user_id + '-') !== -1) {
								var mData = window.localStorage.getItem(k);
								matrixData.push(k + ':' + mData);
							}
					}
					
					// 自身の情報を送り返す
					newCheckinPeers[c.peer] = 1;
//				    eachActiveConnection(function(c, $c) {
					    console.log("c.label" + c.label);
							if (c.label === 'checkin') {
								// データ投げ返す
								var myData = {userId:meData.user_id,userData:JSON.stringify(myUserData),matrixDataList:matrixData};
								//c.send(JSON.stringify(myData));
								console.log(myData);
								sendMyData(myData,c.metadata.userData.peer_id);
							}
//				    });
				    
				    } else {
				    	c.close();
				    }
			    } else {
			    	c.close();
			    }
			
		});
		
		c.on('data', function(data) {
 			var getUserData = JSON.parse(data);
 			// うけとったデータを保存する
 			console.log(getUserData);
 			// とりあず保存
 			window.localStorage.setItem('user_' + getUserData.userId, JSON.stringify(getUserData.userData));
 			var mDataList = getUserData.matrixDataList;
 			for (key in mDataList) {
 				// マトリクスはとりあえず全件保存しとく
 				window.localStorage.setItem(key, JSON.stringify(mDataList[key]));
 			}
 			// ストアデータ更新
 			var meData = JSON.parse(window.localStorage.getItem('me'));
 			var storeData = JSON.parse(window.localStorage.getItem(meData.store_id));
 			var otherUserData = getUserData.userData;
 			window.localStorage.setItem(meData.store_id, JSON.stringify({'name':storeData.name,'user_ids':storeData.users_id + ',' + getUserData.userId,'chat_ids':storeData.chat_ids + ',' + otherUserData.peer_id}));
 			// カウント増やす
 			resCount++;
			if (resCount == reqCount - 1) {
				// 取得完了。画面遷移
				var meData = JSON.parse(window.localStorage.getItem('me'));
				var meUserData = JSON.parse(window.localStorage.getItem('user_' + meData.user_id));
				if (meUserData.name) {
					// チャットへ遷移
 					location.href = "chat.html";
				} else {
					// プロフ登録へ遷移
 					location.href = "new_profile.html";
				}
			}
 		});
 		c.on('close', function() {
 			// 接続が切断されたことを検知
 			console.log(c.peer + ' has left.');
 			if ($('.connection').length === 0) {
 				console.log(c.peer + ' no connection');
 			}
 			delete connectedPeers[c.peer];
 		});
 		c.on('error', function(err) {
 			resCount++;
 			alert(err);
 		});
 		
	 	connectedPeers[c.peer] = 1;
	}
	else if(c.label === 'distribution-map') {
        // 分布マップ時接続
        c.on('open', function() {
            var store_list = new Array()
            var store_list = new Array();
            for(var i = 0; i < window.localStorage.length; i++){ 
              // キー名の取得 
              var k = window.localStorage.key(i); 
              // store_で始まるデータを判別する
              if (k.indexOf('store_') !== -1) {
                  // 店名
                  store_list[i]['key'] = k;
                  store_list[i]['val'] = JSON.parse(window.localStorage.getItem(k));
              }
            }
            console.log("### distribution-map store_list count: " + store_list.length);
            if (c.label === 'distribution-map') {
                // データ投げ返す
                c.send(store_list);
                console.log(store_list);
            }
          });
	}
	else if (c.label === 'chat') {
	  	/* connectedPeers[c.metadata] = new dataConnection();
	  	connectedPeers[c.metadata] = c;
	  	
	  	var storeObj = JSON.parse(localStoreage.getItem(meObj.store_id));
	  	storeObj */  			
	
	  	c.on('data', function(data) {
	  		// チャットを追加する
	  		addchat(data);
	  		
	  		var getMsgObj = JSON.parce(data);
	  		var userObj = JSON.parse(getMssgObj.user_id)
	  	      	$('#chat-space')
	  	        .append('<li class="field chat"><div class="user">' + 
	        	'<a href="show_profile.html" class="photo"><img src=' + "img/noimage.png" + '></a>' +
	        	'<a href="show_profile.html" class="name">' + userObj.name + '</a>'  +
	        	'</div>' +
	        	'<p class="msg">' +
	        	'<time>' + getMsgObj.date + '</time>' +
	        	getMsgObj.msg +
	        	'</p></li>')
	  	});
	
	  	// ページ遷移でもこのイベントが発生するためすごく不便だと思うの
	  	c.on('close', function() {
	  		alert(c.peer + ' has left the chat.');
	  		
	  		if ($('.connection').length === 0) {
	  			$('.filler').show();
	  		}
	  		
	  		delete connectedPeers[c.peer];
	  		
	  		// var meObj = JSON.parse(localStorage.getItem("me")); いちいち作るの？
	  		var storeObj = JSON.parse(localStorage.getItem('store_' + meObj.store_id));
	  		var userArray = storeObj.user_ids.split(",");
	  		
	  		for(var index in userArray){
	  			var userObj = JSON.parse(localStorage.getItem('user_' + userArray[index]));
	  			if(c.peer === userObj.peer_id){
	  				userArray.split(index, 1);
	  				break;
	  			}
	  		}
	  		
	  		//ログアウトしました
	  		alert("チェックアウトしました");
	  		
	  	});
	}
}

// Goes through each active peer and calls FN on its connections.
function eachActiveConnection(fn) {
	var actives = $('.active');
	var checkedIds = {};
	for(peerId in newCheckinPeers) {
		if (!checkedIds[peerId]) {
			var conns = peer.connections[peerId];
			for (var i = 0, ii = conns.length; i < ii; i += 1) {
				var conn = conns[i];
				fn(conn, $(this));
			}
		}
		checkedIds[peerId] = 1;
	};
}




// 1桁の数字を0埋めで2桁にする
var toDoubleDigits = function(num) {
	num += "";
	if (num.length === 1) {
		num = "0" + num;
	}
	return num;     
};

function checkPosition() {
	if (navigator.geolocation) {
		// オプション・パラメータをセット
		var position_options = {
			enableHighAccuracy: true,    // 高精度を要求する
			timeout: 60000,              // 最大待ち時間（ミリ秒）
			maximumAge: 0                // キャッシュ有効期間（ミリ秒）
		};
		// 現在の位置情報を取得
		navigator.geolocation.watchPosition(successCallback,errorCallback,position_options);
	} else {
    window.alert("本ブラウザではGeolocationが使えません");
    }
	// （1）位置情報の取得に成功した
function successCallback(position) {
	// チェックイン中の店の位置と現在地を比較
	// 現在地
	var meLat = position.coords.latitude ;
	var meLng = position.coords.longitude ;
	// チェックイン中の店の位置取得
	var meData = JSON.parse(window.localStorage.getItem('me'));
	var storeId= meData.store_id
	storeId = storeId.replace(/store_/g,"");
	storeId = storeId.replace(/\-/g,".");
	var storePosition = [];
	storePosition = storeId.split("_");
	var storeLng = storePosition[0];
	var storeLat = storePosition[1];
	// 現在地と比較
	var d = __geoDistance(parseFloat(storeLat), parseFloat(storeLng), parseFloat(meLat), parseFloat(meLng), 4);
	var distance = d.toFixed(2);
	console.log(distance);
	// B.一定距離外（適当に100m以上とする）
	if (distance > 200) {
		// チェックアウト処理する
			// ログアウトを周囲の人に通知
			sendLogoutData();
			//・店データのuser_idsから自分のidを削除  
			//・行列ログデータのoutを設定更新
			for(var i = 0; i < window.localStorage.length; i++){  
				// キー名の取得  
				var k = window.localStorage.key(i);  
				// matrix_log_[user_id]_で始まるデータを判別する
				var str = " " + k;
				if (str.indexOf(" matrix_log_" + meData.user_id + "-") !== -1) {
					var mData = JSON.parse(window.localStorage.getItem(k));
					if (mData.out === "" && mData.store_id === meData.store_id) {
						// matrixデータ更新
						var today=new Date();
						var checkOutDate = toDoubleDigits(today.getFullYear()) + '-' + toDoubleDigits(today.getMonth()+1) + '-' + toDoubleDigits(today.getDate());
						checkOutDate += ' ' + toDoubleDigits(today.getHours()) + ':' + toDoubleDigits(today.getMinutes()) + ':' + toDoubleDigits(today.getSeconds());
						window.localStorage.setItem(k,JSON.stringify({'store_id':mData.store_id,'user_id':mData.user_id,'date':mData.date,'in':mData.in, 'out':checkOutDate}));
					}
				}
			}
			
			//・meデータのstore_idを削除 
			window.localStorage.setItem('me',JSON.stringify({'user_id':meData.user_id,'peer_id':meData.peer_id,'store_id':''}));
			
			
			// トップへ飛ばす？？
			location.href = "https://www.google.co.jp/?gws_rd=ssl";
	}
	
	
	// ログアウトを通知
	function sendLogoutData() {
	 // Connect to a peer
	 // チェックアウトリクエスト用データ作成
	 // meデータを取得
	 var meData = JSON.parse(window.localStorage.getItem('me'));
	 // ストア情報取得
	 var storeData = JSON.parse(window.localStorage.getItem(meData.store_id));
	 var chatIds = storeData.chat_ids;
	 // リクエスト送る
	 for (var i=0; i<chatIds.length; i++) {
	 	requestedPeer = chatIds[i];
	 	if (!connectedPeers[requestedPeer]) {
	 		// リクエスト
	 		var c = peer.connect(requestedPeer, {
	 			label: 'checkout',
	 			serialization: 'none',
	 			metadata: {storeId:meData.store_id,userId:meData.user_id}
	 		});
	 		c.on('open', function() {
	 			connect(c);
	 		});
	 		c.on('close', function() {
	 			console.log(c.peer + ' cancel.');
	 		});
	 		c.on('error', function(err) { alert(err); });
	 	}
	 connectedPeers[requestedPeer] = 1;
	 }
	}
}
  // （2）位置情報の取得に失敗した場合
function errorCallback(error) {
    var message = "";

	switch (error.code) {

	  // 位置情報が取得できない場合
	  case error.POSITION_UNAVAILABLE:
	    message = "位置情報の取得ができませんでした。";
	    break;

	  // Geolocationの使用が許可されない場合
	  case error.PERMISSION_DENIED:
	    message = "位置情報取得の使用許可がされませんでした。";
	    break;

	  // タイムアウトした場合
	  case error.PERMISSION_DENIED_TIMEOUT:
	    message = "位置情報取得中にタイムアウトしました。";
	            break;
	        }
	        window.alert(message);
  }
}

// 2点間の距離を求める
function __geoDistance(lat1, lng1, lat2, lng2, precision) {
  // 引数　precision は小数点以下の桁数（距離の精度）
  var distance = 0;
  if ((Math.abs(lat1 - lat2) < 0.00001) && (Math.abs(lng1 - lng2) < 0.00001)) {
    distance = 0;
  } else {
    lat1 = lat1 * Math.PI / 180;
    lng1 = lng1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lng2 = lng2 * Math.PI / 180;
 
    var A = 6378140;
    var B = 6356755;
    var F = (A - B) / A;
 
    var P1 = Math.atan((B / A) * Math.tan(lat1));
    var P2 = Math.atan((B / A) * Math.tan(lat2));
 
    var X = Math.acos(Math.sin(P1) * Math.sin(P2) + Math.cos(P1) * Math.cos(P2) * Math.cos(lng1 - lng2));
    var L = (F / 8) * ((Math.sin(X) - X) * Math.pow((Math.sin(P1) + Math.sin(P2)), 2) / Math.pow(Math.cos(X / 2), 2) - (Math.sin(X) - X) * Math.pow(Math.sin(P1) - Math.sin(P2), 2) / Math.pow(Math.sin(X), 2));
 
    distance = A * (X + L);
    var decimal_no = Math.pow(10, precision);
    distance = Math.round(decimal_no * distance / 1) / decimal_no;   // kmに変換するときは(1000で割る)
  }
  return distance;
}

// Make sure things clean up properly.

window.onunload = window.onbeforeunload = function(e) {
  if (!!peer && !peer.destroyed) {
      peer.destroy();
  }
};
