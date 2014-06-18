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

    	
    	// コメント取得
    	var comment = document.profile.comment.value;

    	if(error === ""){
        	var id = "user_id";
        	var user = {};
        	var value = {"name":name, "sex":sex, "state":state, "age":age, "comment":comment};
        	user[id] = value;
    	
        	window.localStorage.setItem(id, JSON.stringify(user));
    		
    	}
    	else{
    		window.alert(error);
    		location.href = "new_profile.html";
    	}
    	
    	
     }
    
 // localstrageから自分のプロフィールを取得する
    function getProfileValue(){
    	// TODO
    	// 自分のIDを取得する
    	
    	// localstrageからユーザ情報を取得
    	var user_info = JSON.parse(window.localStorage.getItem("user_id"));
    	// 名前
    	document.getElementById("name").innerHTML="<h4>"+user_info.user_id.name+"</h4>";
    	// 性別
    	var sex_select = document.getElementsByName("sex");
    	for(var i=0; i<sex_select.length;i++){
    		if(sex_select[i].value == user_info.user_id.sex){
    			sex_select[i].checked = true;
    		}
    	}
 	
    	// 都道府県
        var state_select = document.profile.state;
    	for(var i=0; i<state_select.length; i++){
    		if(state_select.options[i].value == user_info.user_id.state){
    			state_select.options[i].selected = true;
    		}
    	}
    	
    	// 年代
        var age_select = document.profile.age;
    	for(var i=0; i<age_select.length; i++){
    		if(age_select.options[i].value == user_info.user_id.age){
    			age_select.options[i].selected = true;
    		}
    	}
    	
    	// コメント
    	document.profile.comment.value = user_info.user_id.comment; 
    	// 写真
    	
    	
    }

 // プロフィールをloalstrageに保存する
    function editProfileValue() {
    	var error = "";
    	// 名前取得
    	var user_info = JSON.parse(window.localStorage.getItem("user_id"));
    	var name = user_info.user_id.name;
    	
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

    	
    	// コメント取得
    	var comment = document.profile.comment.value;
    	
       	if(error === ""){
        	var id = "user_id";
        	var user = {};
        	var value = {"name":name, "sex":sex, "state":state, "age":age, "comment":comment};
        	user[id] = value;
    	
        	window.localStorage.setItem(id, JSON.stringify(user));
    		
    	}
    	else{
    		window.alert(error);
    		location.href = "edit_profile.html";
    	}

    	
    	
     }

