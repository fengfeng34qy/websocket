function checkId (Idno) {
	if ((Idno.length != 18) && (Idno.length != 15)) {
		app.trigger("warn", "身份证位数不对!");
		return false;
	}
	if (Idno.length == 18) {
		for (i = 0; i < Idno.length - 1; i++) {
			// 如何判断一个字母是数字
			if (isNaN(parseInt(Idno.charAt(i)))) {
				app.trigger("warn", "身份证格式错误!");
				return false;
			}

		}
		var lastIDNum = Idno.charAt(17);
		if (isNaN(parseInt(Idno.charAt(i)))
				&& lastIDNum.toLowerCase() != 'x') {
			app.trigger("warn", "身份证格式最后一位错误!");
			return false;
		}
	}
	if (Idno.length == 15) {
		for (i = 0; i < Idno.length; i++) {
			// 如何判断一个字母是数字
			if (isNaN(parseInt(Idno.charAt(i)))) {
				app.trigger("warn", "15位身份证格式错误!");
				return false;
			}
		}
	}
}