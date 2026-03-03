$(function(){
	// キーワードのサジェスト機能
	var beforeString = new Array(); //最後尾以外の検索文字保存用配列
	$("#keyword").autocomplete({
		source: function (req, resp) {
			// テキストボックス内の単語を空白で分割
			$inputArr = req.term.split(/\s+|　+/);

			// 検索する単語が一つの場合
			if ($inputArr.length == 1) {
				beforeString = new Array();
				$.ajax({
					url: "/order/api/suggest",
					type: "POST",
					cache: false,
					dataType: "json",
					data: {
						q: $inputArr[0]
					},
					success: function (o) {
						resp(o);
					},
					error: function (xhr, ts, err) {
						resp(['']);
					}
				});
			}
				// 検索する単語が二つ以上の場合
			else {
				if ($inputArr[$inputArr.length - 1] != "") {
					// 最後尾の単語以外を一時的に保存
					for (i = 0; i < $inputArr.length - 1; i++) {
						beforeString[i] = $inputArr[i];
					}
					$.ajax({
						url: "/order/api/suggest",
						type: "POST",
						cache: false,
						dataType: "json",
						data: {
							q: $inputArr[$inputArr.length - 1]
						},
						success: function (o) {
							resp(o);
						},
						error: function (xhr, ts, err) {
							resp(['']);
						}
					});
				}
			}
		},
		// 検索完了後で且つメニューを開く直前にトリガされる
		// サジェストされる文字列の操作
		response: function (event, ui) {
			if (beforeString.length != 0) {
				for (i = 0; i < ui.content.length; i++) {
					ui.content[i].label = beforeString.join(" ") + " " + ui.content[i].label;
					ui.content[i].value = beforeString.join(" ") + " " + ui.content[i].value;
				}

				beforeString = new Array();
			}
		}
	});
});
