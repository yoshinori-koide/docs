// チェックイン状態かのチェック
function isCheckedIn() {
    meData = JSON.parse(window.localStorage.getItem('me'));
    if(meData != null) {
        return meData.store_id != '';
    }
    return false;
}
// チェックアウトさせる
function checkOut() {
    meData = JSON.parse(window.localStorage.getItem('me'));
    window.localStorage.setItem('me',JSON.stringify({'user_id':meData.id,'peer_id':meData.peer_id,'store_id':''}));
    location.href='checkout.html';
    return false;
}

//*** 共通メニュー制御 *** //
// チェックインフラグを取得
$isCheckin = isCheckedIn();
// 非チェックイン状態の場合はメニューを隠す
if(!$isCheckin) {
    $("#header-menu-chat").css('display','none');
    $("#header-menu-edit_profile").css('display','none');
    $("#header-menu-game").css('display','none');
    $("#header-menu-checkout").css('display','none');
}

// *** TOPページボタンの制御 *** //
if($isCheckin) {
    $("#top-menu-checkin").css('display','none');
}else {
    $("#top-menu-checkout").css('display','none');
}