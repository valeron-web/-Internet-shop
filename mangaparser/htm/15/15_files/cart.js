
// エラー時のコールバック関数
var funcResolveFailure = function resolveFailure(req, ajaxComponent) {
    alert(req.responseText);
};

/**
 * Kumu.Ajax.executeTeedaAjaxのラッパー
 */
function executeCartTeedaAjaxWrapper(callback, param, option, responseType) {
	// パラメータの作成
	var ajaxParams = {};
	if(param) {
		// オブジェクト(連想配列)
		if(param instanceof Object) {
			ajaxParams = param;
		}
		// 配列
		else if(param instanceof Array) {
			for(var i = 0; i < param.length; i++){
				ajaxParams["AjaxParam" + new String(i)] = param[i];
			}
		}
		// 文字列又は数値
		else {
			ajaxParams["AjaxParam0"] = param;
		}
	}
	// オプションを追加
	for(var key in option) {
		ajaxParams[key] = option[key];
	}
	// 実行
	Kumu.Ajax.URL = getContextPath() + '/teeda.ajax';
	Kumu.Ajax.executeTeedaAjax(callback, ajaxParams, responseType);
}

/**
 * 商品をカートに追加。
 */
var g_cartBlinkCount = 0;
function addItem(id) {
	executeCartTeedaAjaxWrapper(
		cartService_addItem,
			[id, 1, g_shopType, g_lang, g_countryId], {'method':'POST'});
}
function cartService_addItem(response) {
	// カート追加後は注文画面に自動遷移する
	goOrderPage();
	
	//showCart();
	//g_cartBlinkCount = 0;
	//document.getElementById('cart').style.backgroundColor = '#ffcccc';
	//window.setTimeout("changeCartBackground()", 500);
}
function changeCartBackground() {
	if (g_cartBlinkCount == 0) {
		document.getElementById('cart').style.backgroundColor = '';
		g_cartBlinkCount++;
		window.setTimeout("changeCartBackground()", 500);
	} else if (g_cartBlinkCount == 1) {
	document.getElementById('cart').style.backgroundColor = '#ffcccc';
		g_cartBlinkCount++;
		window.setTimeout("changeCartBackground()", 500);
	} else {
		document.getElementById('cart').style.backgroundColor = '';
	}
}

/**
 * 注文ページへ移動。
 */
function goOrderPage() {
	location.href = getOrderPageUrl();
}
function getOrderPageUrl() {
	var lang = g_lang;
	lang = lang.substring(0, 1).toUpperCase() + lang.substring(1, 2);
	var referrerParam = 'referer=' + escape(document.URL);
	return getSecureContextPath() + '/view/order/inputOrder' + lang + '.html?' + referrerParam;
}

/**
 * カート商品を表示。
 */
function showCart() {
	executeCartTeedaAjaxWrapper(
		cartService_getCartThumbnail, [g_lang], {'method':'POST'});
}
function cartService_getCartThumbnail(response) {

	var cart = response;
	var list = "";
	var count = 0;
	for (shop in cart) {
	    var info = cart[shop];
	    count += info.count;
	}

	list += '<p>' + count + g_countLabelPre + '</p>';
	list += '<p><a href="javascript:goOrderPage()">' + g_countLabelPost + '</a></p>';

	document.getElementById('cartThumbnail').innerHTML = list;
	document.getElementById('shoppingcart').style.display = 'block';
}

function getContextPath() {
	return location.protocol + "//ekizo.mandarake.co.jp/cart";
	//return location.protocol + "//" + location.host + "/cart";
}

function getSecureContextPath() {
	return "https://ekizo.mandarake.co.jp/cart";
	//return "https://" + location.host + "/cart";
}

function getCookie(name) {
	var search = name + '=';
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = document.cookie.indexOf(';', offset);
			if (end == -1) {
				end = document.cookie.length;
			}
			return unescape(document.cookie.substring(offset, end));
		}
	}
	return null;
}

function initializeCart() {
	var flgName = "initialized_cart";
	if (getCookie(flgName) == null) {
		document.cookie = flgName + "=1; path=/;";
		executeCartTeedaAjaxWrapper(cartService_getCart);
	}
}
function cartService_getCart(response) {
}

initializeCart();
