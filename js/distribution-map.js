// *** メソッド *** //
var apiKey = "cc6f5bfa-ec91-11e3-8c36-09d78563cbeb";
//var apiKey = "6165842a-5c0d-11e3-b514-75d3313b9d05";
var peer = new Peer({
  key: apiKey,
  debug: 3,
});
var connectedPeers = {};

//通信状態変化時イベントハンドラ
function distSendData() {
    peerIdList = {};
    // localStrageのデータ全件からstore_を全件取得する
    var storeList = getAllStoreList();

     // peerIdリストを取得する
     var req = new XMLHttpRequest();
     distLoadText("https://skyway.io/active/list/"+apiKey);
     // リクエストする
     function distLoadText(path) {
         req.onreadystatechange = distReadyStateChange;
         // リクエスト発行
         req.open("get", path, true);
         req.send("");
     }
    
     // 通信状態変化時イベントハンドラ
     function distReadyStateChange() {
         // 通信完了
         if(req.readyState == 4) {
             // テキスト扱いされてしまうので配列にする
             var subText = req.responseText.replace(/\[|\]|\"/g, '');
             peerIdList = subText.split(',');
         }
     }

    // 全員にお店リストを送る
    for (var i=0; i<peerIdList.length; i++) {
    requestedPeer = peerIdList[i];
    if (!connectedPeers[requestedPeer]) {
        // リクエスト
        var c = peer.connect(requestedPeer, {
            label: 'distribution-map',
            serialization: 'none',
            metadata: {storeList:storeList}
        });
        c.on('open', function() {
            returnStoreList(c);
        });
        c.on('error', function(err) { alert(err); });
    }
    connectedPeers[requestedPeer] = 1;
    }
    
}

//他からの接続を検知したら、自分の持っている店データを返す
peer.on('connection', returnStoreList);
function returnStoreList(dataConnection) {
    // Handle a chat connection.
    if (dataConnection.label === 'distribution-map') {

        dataConnection.on('data', function(data) {
            storeList = data;
            for(var i = 0; i < storeList.length; i++) {
                // 受け取ったデータを保存する
                console.log('*********');
                window.localStorage.setItem(storeList[i]['key'],JSON.stringify(storeList[i]['val']));
                console.log('*********');
            }
       });
        dataConnection.on('close', function() {
           // 接続が切断されたことを検知
           console.log(dataConnection.peer + ' has left.');
           if ($('.connection').length === 0) {
               console.log(dataConnection.peer + ' no connection');
           }
           delete connectedPeers[dataConnection.peer];
       });
   }
   connectedPeers[dataConnection.pz1eer] = 1;
}

function getAllStoreList() {
    var store_list = new Array();
    var j = 0;
    for(var i = 0; i < window.localStorage.length; i++){
      // キー名の取得 
      var k = window.localStorage.key(i); 
        // store_で始まるデータを判別する
      if (k.indexOf('store_') !== -1) {
          // キー名から緯度経度を取得
          var key_array = k.split('_');
          store_list[j] = new Array(4);
          store_list[j]['lat'] = key_array[2].replace('-', '.');
          store_list[j]['lng'] = key_array[1].replace('-', '.');
          // 店名
          var store_data = JSON.parse(window.localStorage.getItem(k));
          store_list[j]['name'] = store_data.name;
          // チェッックインユーザー数
          var user_ids = new Array();
          if(store_data.user_ids != null) {
              user_ids = store_data.user_ids.split(',');
          }
          store_list[j]['count'] = user_ids.length;
//          createMarker(store_list[j]);
          j++;
      }
    }
    return store_list;
}


var mapdiv = document.getElementById('map-canvas');
var myOptions = {
    zoom: 8, // 関東圏全体表示くらい
    center: new google.maps.LatLng(35.681382,139.766084), // 東京駅
};
var map = new google.maps.Map(mapdiv, myOptions);
var infowindow = new google.maps.InfoWindow();

// 地図上にマーカー作成
function createMarker(store) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(store['lat'], store['lng']),
        map: map, 
    });
    var contentString = '<div class="map-infowindow">'+
    '<h4>'+store['name']+'</h4>'+
    '<p>並んでいる人数: '+store['count']+'人</p>'+
    '</div>';
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString);
        infowindow.open(map,this);
    });
}
var localStoreList = getAllStoreList();
for(var i=0; i < localStoreList.length; i++){
    createMarker(localStoreList[i]);
}

window.onunload = window.onbeforeunload = function(e) {
    if (!!peer && !peer.destroyed) {
        peer.destroy();
    }
};
