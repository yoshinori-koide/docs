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
  	// 自分のIDを取得する
    	var me = JSON.parse(window.localStorage.getItem("me"));
   		var user_id = "user_"+me.user_id;
  		var user_info = JSON.parse(window.localStorage.getItem(user_id));

		document.getElementById("name_profile").innerHTML="<h4><i class='icon-user'></i> "+user_info.name+" さんのプロフィール</h4>";
		document.getElementById("show_profile").innerHTML="<h3>"+user_info.name+"</h3><span>"+getAge(user_info.age)+"</span>/<span>"+getSex(user_info.sex)+"</span>/<span>"+getState(user_info.state)+"</span><p class='comment'>"+user_info.comment+"</p>";
        
}


