var map;
var count = 0;


function initialize() {
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
	// （1）位置情報の取得に成功した場合
function successCallback(position) {
	count++;
	if(count >= 1){
		var lat2 = position.coords.latitude ;
		var lon2 = position.coords.longitude ;
		var location ="<li>"+"緯度：" + lat2 + "</li>";
		location += "<li>"+"経度：" + lon2 + "</li>";
		location += "<li>"+"方角：" + position.coords.heading + "</li>";
		location += "<li>"+"速度：" + position.coords.speed + "</li>";
		location += "<li>"+"呼び出し回数：" + count + "</li>";
		document.getElementById("location").innerHTML = location;
		var latlng = new google.maps.LatLng(lat2,lon2);
		var opts = {
				zoom: 13,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: false
		};
		map = new google.maps.Map(document.getElementById("map_canvas"), opts);
		var marker = new google.maps.Marker({
			position: latlng,
			map: map
		});
	}else{
		var lat2 = position.coords.latitude ;
		var lon2 = position.coords.longitude ;
		var location ="<li>"+"緯度：" + lat2 + "</li>";
		location += "<li>"+"経度：" + lon2 + "</li>";
		location += "<li>"+"方角：" + position.coords.heading + "</li>";
		location += "<li>"+"速度：" + position.coords.speed + "</li>";
		location += "<li>"+"呼び出し回数：" + count + "</li>";
		document.getElementById("location").innerHTML = location;
		var latlng = new google.maps.LatLng(lat2,lon2);
		var marker = new google.maps.Marker({
			position: latlng,
			map: map
		});
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
