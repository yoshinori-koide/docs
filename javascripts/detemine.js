function getDistance(){
  var lat1 = $('#lat1');
  var lng1 = $('#lng1');
  var lat2 = $('#lat2');
  var lng2 = $('#lng2');
  var result = $('#result1');

  if(lat1.val() == '' || lng1.val() == '' || lat2.val() == '' || lng2.val() == '') {
      result.html('未入力項目があります');
      return false;
  }

  var d = __geoDistance(parseFloat(lat1.val()), parseFloat(lng1.val()), parseFloat(lat2.val()), parseFloat(lng2.val()), 4);
  result.html(d.toFixed(2)+' m / '+(d / 1000).toFixed(2)+' km');
}

//
// 測地線航海算法の公式
//
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

function setPosition(point, id) {
  var lat1 = $('#lat'+point);
  var lng1 = $('#lng'+point);
  var inputLat = $("#inputLat"+id);
  var inputLng = $("#inputLng"+id);
  lat1.val(inputLat.html());
  lng1.val(inputLng.html());
}
function clearForm() {
  $('#lat1').val('');
  $('#lng1').val('');
  $('#lat2').val('');
  $('#lng2').val('');
  $('#inputLat4').html('');
  $('#inputLng4').html('');
  $('#result1').html('');
  $('#result2').html('');
}


function searchMap() {

  // フォームに入力されたキーワードを取得
  var key = $('#keyword').val();
  if(key == '') {
    return false;
  }
  // 取得した住所を引数に指定してcodeAddress()関数を実行
  getCoordinate(key);
}

// 座標取得
function getCoordinate(key) {

  // google.maps.Geocoder()コンストラクタのインスタンスを生成
  var geocoder = new google.maps.Geocoder();

  // geocoder.geocode()メソッドを実行 
  geocoder.geocode( { 'address': key}, function(results, status) {
	  $('#inputLat4').html(results[0].geometry.location.k.toFixed(6)); // 緯度
	  $('#inputLng4').html(results[0].geometry.location.A.toFixed(6)); // 経度
  });
}