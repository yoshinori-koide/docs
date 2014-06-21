// プロフィールをloalstrageに保存する
    function setProfileValue() {
    	// 名前取得
    	var error = "";
    	var name = document.profile.user_name.value;
    	// 入力されていなかった場合
    	if(name === ""){
    		error = "ユーザ名を入力してください\n";
    	}
    	
    	// 性別取得
    	var sex_select = document.getElementsByName("sex");
    	var sex = "";
    	for(var i=0; i<sex_select.length;i++){
    		if(sex_select[i].checked){
    			sex = sex_select[i].value;
    		}
    	}
    	// 選択されていなかった場合
    	if(sex==""){
    		error = error+"性別を選択してください\n";
    	}

    	// 都道府県取得
        var state_select = document.profile.state;
        var state = "";
    	for(var i=0; i<state_select.length; i++){
    		if(state_select.options[i].selected){
    			state = state_select.options[i].value;
    		}
    	}
    	// 選択されていなかった場合
    	if(state==""){
    		error = error+"都道府県を選択してください\n";
    	}
    	
    	// 年代取得
        var age_select = document.profile.age;
        var age = "";
    	for(var i=0; i<age_select.length; i++){
    		if(age_select.options[i].selected){
    			age = age_select.options[i].value;
    		}
    	}
    	// 選択されていなかった場合
    	if(age==""){
    		error = error+"年代を選択してください\n";
    	}
		
    	// 写真を取得
    	var file = "";
		file = document.profile.photo.value;
    	
    	// コメント取得
    	var comment = document.profile.comment.value;

    	if(error === ""){
    	
   		    // 自分のIDを取得する
    		var me = JSON.parse(window.localStorage.getItem("me"));
    		var user_id = "user_"+me.user_id;
    		var user_info = JSON.parse(window.localStorage.getItem(user_id));
        	var user = {"name":name, "sex":sex, "state":state, "age":age, "comment":comment, "matrix_log_ids":user_info.matrix_log_ids, "peer_id":user_info.peer_id, "photo":file};
    	
        	window.localStorage.setItem(user_id, JSON.stringify(user));
    		
    	}
    	else{
    		window.alert(error);
    		location.href = "http://2014camp-pro.github.io/docs/new_profile.html";
    	}
    	
    	
     }
    
 // localstrageから自分のプロフィールを取得する
    function getProfileValue(){
    	// 自分のIDを取得する
    	var me = JSON.parse(window.localStorage.getItem("me"));
   		var user_id = "user_"+me.user_id;
  		var user_info = JSON.parse(window.localStorage.getItem(user_id));
    	// 名前
    	document.getElementById("name").innerHTML="<h4>"+user_info.name+"</h4>";
    	// 性別
    	var sex_select = document.getElementsByName("sex");
    	for(var i=0; i<sex_select.length;i++){
    		if(sex_select[i].value == user_info.sex){
    			sex_select[i].checked = true;
    		}
    	}
 	
    	// 都道府県
        var state_select = document.profile.state;
    	for(var i=0; i<state_select.length; i++){
    		if(state_select.options[i].value == user_info.state){
    			state_select.options[i].selected = true;
    		}
    	}
    	
    	// 年代
        var age_select = document.profile.age;
    	for(var i=0; i<age_select.length; i++){
    		if(age_select.options[i].value == user_info.age){
    			age_select.options[i].selected = true;
    		}
    	}
    	
    	// コメント
    	document.profile.comment.value = user_info.comment; 
    	// 写真
    	var photo = user_info.photo;
    	if(photo === ""){
    		document.getElementById("photo").src = "img/noimage.png";
    	}
    	else{
    		document.getElementById("photo").src = photo;
    	}
       	
    }

 // プロフィールをloalstrageに保存する
    function editProfileValue() {
    	var error = "";
   	// 自分のIDを取得する
    	var me = JSON.parse(window.localStorage.getItem("me"));
   		var user_id = "user_"+me.user_id;
  		var user_info = JSON.parse(window.localStorage.getItem(user_id));
    	var name = user_info.name;
    	
    	// 性別取得
    	var sex_select = document.getElementsByName("sex");
    	var sex = "";
    	for(var i=0; i<sex_select.length;i++){
    		if(sex_select[i].checked){
    			sex = sex_select[i].value;
    		}
    	}
    	// 選択されていなかった場合
    	if(sex==""){
    		error = "性別を選択してください\n";
    	}

    	// 都道府県取得
        var state_select = document.profile.state;
        var state = "";
    	for(var i=0; i<state_select.length; i++){
    		if(state_select.options[i].selected){
    			state = state_select.options[i].value;
    		}
    	}
    	// 選択されていなかった場合
    	if(state==""){
    		error = error+"都道府県を選択してください\n";
    	}
    	
    	// 年代取得
        var age_select = document.profile.age;
        var age = "";
    	for(var i=0; i<age_select.length; i++){
    		if(age_select.options[i].selected){
    			age = age_select.options[i].value;
    		}
    	}
    	// 選択されていなかった場合
    	if(age==""){
    		error = error+"年代を選択してください\n";
    	}
		
    	// 写真を取得
		var photo = document.getElementById("photo").src;
    	
    	// コメント取得
    	var comment = document.profile.comment.value;
    	
       	if(error === ""){
        	var id = "user_id";
        	var user = {};
        	var value = {"name":name, "sex":sex, "state":state, "age":age, "comment":comment, "matrix_log_ids":user_info.matrix_log_ids, "peer_id":user_info.peer_id, "photo":photo};
        	user[id] = value;
    	
        	window.localStorage.setItem(id, JSON.stringify(user));
    		
    	}
    	else{
    		window.alert(error);
    		location.href = "http://2014camp-pro.github.io/docs/edit_profile.html";
    	}
    }
function getShowProfile(){
	var params = getUrlVars();
	show_user_id = "user_"+params.id;
   	var user_info = JSON.parse(window.localStorage.getItem(show_user_id));

	document.getElementById("name_profile").innerHTML="<h4><i class='icon-user'></i> "+user_info.name+" さんのプロフィール</h4>";
	document.getElementById("show_profile").innerHTML="<h3>"+user_info.name+"</h3><span>"+getAge(user_info.age)+"</span>/<span>"+getSex(user_info.sex)+"</span>/<span>"+getState(user_info.state)+"</span><p class='comment'>"+user_info.comment+"</p>";
        // 写真
    	var photo = user_info.photo;
    	if(photo === ""){
    		document.getElementById("photo").src = "img/noimage.png";
    	}
    	else{
    		document.getElementById("photo").src = photo;
    	}

        var store_data = "";
        store_data = "<h4 class='storetype'>現在並んでいるお店</h4><p class='storename'>"+user_info.store_name+"</p><h4 class='storetype'>過去に並んだお店</h4>";
        var old_matrix = "";
        var matrix_log_ids = user_info.matrix_log_ids;
        for(i=0;i>matrix_log_ids.length;i++){
        	var matrix_logs = "";
        	matrix_logs = JSON.parse(window.localStorage.getItem(matrix_log_ids[i]));
        	old_matrix = "<p class='storename'>"+matrix_logs.name+"</p>"; 
        }
        store_data = store_data+old_matrix;
        document.getElementById("store_profile").innerHTML= store_data;
}

//GETパラメータ取得
function getUrlVars(){
    var vars = {}; 
    var param = location.search.substring(1).split('&');
    for(var i = 0; i < param.length; i++) {
        var keySearch = param[i].search(/=/);
        var key = '';
        if(keySearch != -1) key = param[i].slice(0, keySearch);
        var val = param[i].slice(param[i].indexOf('=', 0) + 1);
        if(key != '') vars[key] = decodeURI(val);
    } 
    return vars; 
}
function getState(id){
	var state_name = "";
	switch (id){
		case "1":
			state_name = "北海道";
			break;
		case "2":
			state_name = "青森県";
			break;
		case "3":
			state_name = "岩手県";
			break;
		case "4":
			state_name = "宮城県";
			break;
		case "5":
			state_name = "秋田県";
			break;
		case "6":
			state_name = "山形県";
			break;
		case "7":
			state_name = "福島県";
			break;
		case "8":
			state_name = "茨城県";
			break;
		case "9":
			state_name = "栃木県";
			break;
		case "10":
			state_name = "群馬県";
			break;
		case "11":
			state_name = "埼玉県";
			break;
		case "12":
			state_name = "千葉県";
			break;
		case "13":
			state_name = "東京都";
			break;
		case "14":
			state_name = "神奈川県";
			break;
		case "15":
			state_name = "新潟県";
			break;
		case "16":
			state_name = "富山県";
			break;
		case "17":
			state_name = "石川県";
			break;
		case "18":
			state_name = "福井県";
			break;
		case "19":
			state_name = "山梨県";
			break;
		case "20":
			state_name = "長野県";
			break;
		case "21":
			state_name = "岐阜県";
			break;
		case "22":
			state_name = "静岡県";
			break;
		case "23":
			state_name = "愛知県";
			break;
		case "24":
			state_name = "三重県";
			break;
		case "25":
			state_name = "滋賀県";
			break;
		case "26":
			state_name = "京都府";
			break;
		case "27":
			state_name = "大阪府";
			break;
		case "28":
			state_name = "兵庫県";
			break;
		case "29":
			state_name = "奈良県";
			break;
		case "30":
			state_name = "和歌山県";
			break;
		case "31":
			state_name = "鳥取県";
			break;
		case "32":
			state_name = "島根県";
			break;
		case "33":
			state_name = "岡山県";
			break;
		case "34":
			state_name = "広島県";
			break;
		case "35":
			state_name = "山口県";
			break;
		case "36":
			state_name = "徳島県";
			break;
		case "37":
			state_name = "香川県";
			break;
		case "38":
			state_name = "愛媛県";
			break;
		case "39":
			state_name = "高知県";
			break;
		case "40":
			state_name = "福岡県";
			break;
		case "41":
			state_name = "佐賀県";
			break;
		case "42":
			state_name = "長崎県";
			break;
		case "43":
			state_name = "熊本県";
			break;
		case "44":
			state_name = "大分県";
			break;
		case "45":
			state_name = "宮崎県";
			break;
		case "46":
			state_name = "鹿児島県";
			break;
		case "47":
			state_name = "沖縄県";
			break;
	}
	return state_name;
}

function getAge(id){
	var age = "";
	switch (id){
		case "10":
			age = "10代";
			break;
		case "20":
			age = "20代";
			break;
		case "30":
			age = "30代";
			break;
		case "40":
			age = "40代";
			break;
		case "50":
			age = "50代";
			break;
		case "60":
			age = "60代";
			break;
		case "70":
			age = "70代以上";
			break;
	}
	return age;
}

function getSex(id){
	var sex = "";
	switch (id){
		case "1":
			sex = "男性";
			break;
		case "2":
			sex = "女性";
			break;
		case "3":
			sex = "その他";
			break;
	}
	return sex;
}

