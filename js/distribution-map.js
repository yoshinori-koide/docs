// *** メソッド *** //
function getAllStoreList() {
    var storeList = new Array();
    var storeIds = new Array();
    Array.prototype.in_array = function(val) {
        for(var i = 0, l = this.length; i < l; i++) {
            if(this[i] == val) {
                return true;
            }
        }
        return false;
    }
    j = 0;
    for(var i = 0; i < window.localStorage.length; i++){
      // キー名の取得 
      var k = window.localStorage.key(i);
        // store_で始まるデータを判別する
      if (k.indexOf('user_') !== -1) {
          // キー名から緯度経度を取得
          var userData = JSON.parse(window.localStorage.getItem(k));

          if(storeIds.in_array(userData.store_id)) {
              // 店舗配列にあるIDならカウントアップ
              for(var k = 0; k < storeList.length; k++) {
                  if(storeList[k]['id'] == userData.store_id) {
                      storeList[k]['count']++;
                  }
              }
          } else {
              // 店舗配列にないIDなら作成
              storeList[j] = new Array(5);
              storeList[j]['id'] = userData.store_id;
              storeList[j]['lat'] = userData.store_lat;
              storeList[j]['lng'] = userData.store_lng;
              storeList[j]['name'] = userData.store_name;
              storeList[j]['count'] = 1;
              storeIds[j] = userData.store_id;
              j++;
          }
      }
    }
    for(var i=0; i < storeList.length; i++){
        createMarker(storeList[i]);
    }
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
getAllStoreList();
