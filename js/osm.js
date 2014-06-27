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


map = new OpenLayers.Map("map-canvas");
map.addLayer(new OpenLayers.Layer.OSM());

epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
projectTo = map.getProjectionObject("EPSG:900913"); //The map projection (Spherical Mercator)

var lonLat = new OpenLayers.LonLat(139.766084,35.681382).transform(epsg4326, projectTo); // 東京駅
var zoom = 8; // 関東圏全体表示くらい
map.setCenter (lonLat, zoom);

var vectorLayer = new OpenLayers.Layer.Vector("Overlay");

// Define markers as "features" of the vector layer:
for(var i=0; i < storeList.length; i++){
    var feature = getPoint(storeList[i]);
    vectorLayer.addFeatures(feature);
}

map.addLayer(vectorLayer);

//Add a selector control to the vectorLayer with popup functions
var controls = {
  selector: new OpenLayers.Control.SelectFeature(vectorLayer, { onSelect: createPopup, onUnselect: destroyPopup })
};
function createPopup(feature) {
  feature.popup = new OpenLayers.Popup("pop",
      feature.geometry.getBounds().getCenterLonLat(),
      new OpenLayers.Size(200,50),
      feature.attributes.description,
      true,
      function() { controls['selector'].unselectAll(); }
  );
  //feature.popup.closeOnMove = true;
  map.addPopup(feature.popup);
}

function destroyPopup(feature) {
  feature.popup.destroy();
  feature.popup = null;
}
map.addControl(controls['selector']);
controls['selector'].activate();

    function getPoint(store) {

        var feature = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(store['lng'],store['lat']).transform(epsg4326, projectTo),
                {description:'<div class="map-infowindow">'+
                '<h4>'+store['name']+'</h4>'+
                '<p>並んでいる人数: '+store['count']+'人</p>'+
                '</div>'},
                {externalGraphic: 'img/pin.png', graphicHeight: 25, graphicWidth: 25, graphicXOffset:-15, graphicYOffset:-25  }
            );
        return feature;
    }
