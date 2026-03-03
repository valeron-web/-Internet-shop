// お気に入り追加
function addMypageList(itemCode, target) {
	var form = document.getElementById("mypagelist_form");
	form.itemCode.value = itemCode;
	form.target.value = target;
	form.submit();
}

// お気に入り追加
function result() {
	alert('お気に入りに追加しました。');
}

// キーワード検索実行
function serchKeyword() {
	var form = document.forms["serch_form"];
	var keyWord = form.elements["keyword"].value;
	if ((keyWord == "") ||
        (keyWord == "キーワードを入力") ||
        (keyWord == "Input Keyword")) {
	    return;
	}
	// 空白のみチェック
	target = keyWord.replace(/(^\s+)|(\s+$)/g, "");
	if (target == "") {
		return;
	}
	// 長さチェック
	if (target.length > 200) {
		return;
	}

    // 履歴に格納
    if (window.mdkSearchHistory !== undefined) {
        mdkSearchHistory().setHistory(target);
    }

	form.submit();
}

// 検索実行
function serch(url) {
	// 改修により本関数は渡されたURLに従ってそのまま遷移するのみとなった
	// 新規コードで利用する意味はないため、今後は使用しないこと。
	location.href = url;
}

// 画面の検索条件のクリア
function clearSearchCondition() {
    $("#keyword").val("");
    $("#target").val("00");
}

// リスト削除
function deleteItem(deleteIndex, target) {
	var form = document.getElementById("delete_form");
	form.deleteIndex.value = deleteIndex;
	form.target.value = target;
	form.submit();
}

// キーワード削除
function deleteKeyword(deleteIndex) {
	var form = document.getElementById("delete_form_key");
	form.deleteIndex.value = deleteIndex;
	form.submit();
}

// メール通知設定変更
function changeMailState(keywordIndex, status) {
	var form = document.getElementById("change_mail_form");
	form.keywordIndex.value = keywordIndex;
	form.status.value = status;
	if (!(status == 0 || status == 1)) {
		return;
	}
	form.submit();
}

// メール通知設定変更(商品単位)
function changeMailStateItem(shohinIndex, status) {
	var form = document.getElementById("change_mail_item_form");
	form.shohinIndex.value = shohinIndex;
	form.status.value = status;
	if (!(status == 0 || status == 1)) {
		return;
	}
	form.submit();
}

// キーワード履歴から検索実行
function serchKeywordHistory(keyword) {
	var form = document.forms["reserch_form"];
	form.elements["keyword"].value = keyword;
	form.submit();
}

// キーワード履歴から削除
function deleteSerchKeyword(deleteIndex, target) {
	var form = document.getElementById("delete_form_key");
	form.deleteIndex.value = deleteIndex;
	form.target.value = target;
	form.submit();
}

// 検索履歴表示非表示変更
function changeSerchKeywordState(status) {
	var form = document.getElementById("disp_change_form");
	form.status.value = status;
	form.submit();
}

// お知らせリストキーワード選択
function selectAnnounceListKeyword() {
	var select = document.getElementById("keywordList");
	var keywordIndex = select.options[select.selectedIndex].value;
	location.href = "/order/mypage/announceList" + "?keywordIndex=" + keywordIndex;
}

// DOMへのイベント登録
(function(){
    document.addEventListener('DOMContentLoaded', function(){
        if (document.serch_form !== undefined && document.serch_form.tagName == 'FORM') {
            document.serch_form.addEventListener('submit', function(e){
                e.preventDefault();
                serchKeyword();
            });
        }
    });
}());