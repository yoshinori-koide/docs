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
var chatConnectArray = {};
var newCheckinPeers = {};
var meObj = JSON.parse(localStorage.getItem('me'));

const CHECKIN = 'checkin';
const CHAT = 'chat';

//　チャット用更新処理
function addchat(addData){
  		var userObj = JSON.parse(localStorage.getItem('user_' + meObj.user_id));
  		while(1){
  				var chatObj = localStorage.getItem('chat_' + msgCnt);
  				if(chatObj === null){
  					localStorage.setItem('chat_' + msgCnt, addData);
  					userObj.chat_ids = userObj.chat_ids + "," + msgCnt;
  					break;
  				}
  				msgCnt++;
  			}
  		localStorage.setItem('user_' + meObj.user_id ,JSON.stringify(userObj));
  	}

// peerIdリストを取得する
function getPeerIdList () {
	
	// 自身のユーザデータ取得
	var meData = JSON.parse(window.localStorage.getItem('me'));
	var myUserData = window.localStorage.getItem('user_' + meData.user_id);
	
 	/* // リクエストする
 	function loadText(path) {
 		req.onreadystatechange = readyStateChange;
 		// リクエスト発行
 		req.open("get", path, true);
 		req.send("");
 	}

 	// 通信状態変化時イベントハンドラ
 	function readyStateChange() {
 		// 通信完了
 		if(req.readyState == 4) {
 			// テキスト扱いされてしまうので配列にする
 			var subText = req.responseText.replace(/\[|\]|\"/g, '');
 			var peerIdList = subText.split(',');
 			if (peerIdList.length > 0) {
	 			// 全員にチェックインリクエスト送る
 				sendMeData(peerIdList,'user_' + meData.user_id,myUserData);
 			}
 		}
 	}

 	// peerIdリストを取得する
 	var req = new XMLHttpRequest();
 	loadText("https://skyway.io/active/list/cc6f5bfa-ec91-11e3-8c36-09d78563cbeb");
 	 */
 	
 	// peerIdリストを取得する
 	var req = new XMLHttpRequest();
 	// リクエスト発行
 	req.open("get",
 		"https://skyway.io/active/list/cc6f5bfa-ec91-11e3-8c36-09d78563cbeb",
 		false);
 	req.send(null);
 	var subText = req.responseText.replace(/\[|\]|\"/g, '');
 	var peerIdList = subText.split(',');
 	if (peerIdList.length > 0) {
 		for(var i=0; i<peerIdList.length; i++) {
 			// 全員にチャットデータを送る
 			sendMeData(peerIdList,'user_' + meData.user_id,myUserData);
 		}
 	}
}

// 自身のプロフィールを送信する
function sendMyData(peerId,label,userId,myUserData) {
	 // リクエスト
	 var c = peer.connect(peerId, {
	 	label: label,
	 	serialization: 'none',
	 	metadata: {'userId':userId,'meUserData':myUserData}
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

function sendMeData(peerIdList,userId,myUserData) {
	
	console.log("peerIdList:" + peerIdList);
	var label = CHECKIN;
	for(var i=0; i<peerIdList.length; i++) {
		sendMyData(peerIdList[i],label,userId,myUserData)
	}
}

// 他からの接続を検知
peer.on('connection', connect);

// 他との接続を検知したときに実行
function connect(c) {
	
	console.log("c.label:" + c.label);
	if (c.label === CHECKIN) {
		// 受信
		c.on('open', function() {
			// 保存
			console.log("c.metadata.meUserData:" + c.metadata.meUserData);
			window.localStorage.setItem(c.metadata.userId,c.metadata.meUserData);
		});
 		c.on('close', function() {
 			// 接続が切断されたことを検知
 			console.log(c.peer + ' has left.');
 			if ($('.connection').length === 0) {
 				console.log(c.peer + ' no connection');
 			}
 		});
 		c.on('error', function(err) {
 			resCount++;
 			alert(err);
 		});
	}
	else if (c.label === CHAT) {
		if(c.metadata === meObj.store_id){
	 	  	chatConnectArray[c.peer] = 1;
	 	  	c.on('open', function(){
	 	  		alert("connection start " + c.peer);
	 	  		console.log("connection start " + c.peer);
	 	  	})
	 	  	
		  	c.on('data', function(data) {
		  		alert("getData is:" + data);
		  		
		  		// var getMsgObj = data;
		  		var userObj = JSON.parse(localStorage.getItem(data.user_id));
		  		alert("get userTable success");
		  		
		  	      	$('#chat-space')
		  	        .append('<li class="field chat"><div class="user">' + 
		        	'<a href="show_profile.html" class="photo"><img src=' + userObj.photo + '></a>' +
		        	'<a href="show_profile.html" class="name">' + userObj.name + '</a>'  +
		        	'</div>' +
		        	'<p class="msg">' +
		        	'<time>' + getMsgObj.date + '</time>' +
		        	getMsgObj.msg +
		        	'</p></li>');
		        	
		        	// チャットを追加する
		  		addchat(JSON.stringify(data));
		  	});
		
		  	c.on('close', function() {
		  		delete chatConnectArray[c.peer];
		  	});
		}else{
			c.close();
		}
	}
}

window.onunload = window.onbeforeunload = function(e) {
  if (!!peer && !peer.destroyed) {
      peer.destroy();
  }
};
