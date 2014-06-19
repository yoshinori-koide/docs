// *** メソッド *** //
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
          var user_ids = store_data.user_ids.split(',');
          store_list[j]['count'] = user_ids.length;
          createMarker(store_list[j]);
          j++;
      } 
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
    '<p>並んでいる人数'+store['count']+'</p>'+
    '</div>';
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString);
        infowindow.open(map,this);
    });
}


getAllStoreList();