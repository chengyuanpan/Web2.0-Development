var display = "";
var result = "";

function isValid() {
	if (display == "") return true;
	if (display[0] == '+' || display[0] == '-' || display[0] == '*' || display[0] == '/' || display[0] == ')' || display[0] == '.') return false;
	var max = display.length - 1;
	if (display[max] == '+' || display[max] == '-' || display[max] == '*' || display[max] == '/' || display[max] == '(' || display[max] == '.') return false;
	var leftBracket = 0, rightBracket = 0;
	for (var i = 1; i <= max; i++) {
		if ((display[i] == '+' || display[i] == '-' || display[i] == '*' || display[i] == '/') &&
			(display[i - 1] == '+' || display[i - 1] == '-' || display[i - 1] == '*' || display[i - 1] == '/')) return false;
		if (display[i] == '.') {
			if ((display[i - 1] > '9' || display[i - 1] < '0') || (display[i + 1] > '9' || display[i + 1] < '0')) return false;
		}
		if (display[i] == '(') {
			if (display[i + 1] == '+' || display[i + 1] == '-' || display[i + 1] == '*' || display[i + 1] == '/' || display[i + 1] == ')' || display[i + 1] == '.') return false;
			leftBracket++;
		}
		if (display[i] == ')') {
			if (rightBracket >= leftBracket) return false;
			if (display[i - 1] == '+' || display[i - 1] == '-' || display[i - 1] == '*' || display[i - 1] == '/' || display[i - 1] == '.') return false;
			rightBracket++;
		}
	}
	if (leftBracket != rightBracket) return false;
	return true;
}

function calculate() {
}

window.onload = function () {
	//当按钮被点击时传入值
	document.getElementById("num7").onclick = function () {
		display += "7";
		document.getElementById("display").value = display;
	}
	document.getElementById("num8").onclick = function () {
		display += "8";
		document.getElementById("display").value = display;
	}
	document.getElementById("num9").onclick = function () {
		display += "9";
		document.getElementById("display").value = display;
	}
	document.getElementById("num4").onclick = function () {
		display += "4";
		document.getElementById("display").value = display;
	}
	document.getElementById("num5").onclick = function () {
		display += "5";
		document.getElementById("display").value = display;
	}
	document.getElementById("num6").onclick = function () {
		display += "6";
		document.getElementById("display").value = display;
	}
	document.getElementById("num1").onclick = function () {
		display += "1";
		document.getElementById("display").value = display;
	}
	document.getElementById("num2").onclick = function () {
		display += "2";
		document.getElementById("display").value = display;
	}
	document.getElementById("num3").onclick = function () {
		display += "3";
		document.getElementById("display").value = display;
	}
	document.getElementById("num0").onclick = function () {
		display += "0";
		document.getElementById("display").value = display;
	}
	document.getElementById("divide").onclick = function () {
		//用户可直接将已算出结果当做新表达式的第一个输入，下同
		if (result != "") {
			display = result;
			document.getElementById("result").value = "";
		}
		display += "/";
		document.getElementById("display").value = display;
	}
	document.getElementById("mutiply").onclick = function () {
		if (result != "") {
			display = result;
			document.getElementById("result").value = "";
		}
		display += "*";
		document.getElementById("display").value = display;
	}
	document.getElementById("subtract").onclick = function () {
		if (result != "") {
			display = result;
			document.getElementById("result").value = "";
		}
		display += "-";
		document.getElementById("display").value = display;
	}
	document.getElementById("add").onclick = function () {
		if (result != "") {
			display = result;
			document.getElementById("result").value = "";
		}
		display += "+";
		document.getElementById("display").value = display;
	}
	document.getElementById("spot").onclick = function () {
		display += ".";
		document.getElementById("display").value = display;
	}
	document.getElementById("delete").onclick = function () {
		display = display.substring(0, display.length - 1);
		document.getElementById("display").value = display;
	}
	document.getElementById("leftBracket").onclick = function () {
		display += "(";
		document.getElementById("display").value = display;
	}
	document.getElementById("rightBracket").onclick = function () {
		display += ")";
		document.getElementById("display").value = display;
	}
	document.getElementById("clear").onclick = function () {
		display = "";
		result = "";
		document.getElementById("display").value = display;
		document.getElementById("result").value = result;
	}
	document.getElementById("equal").onclick = function () {
		//调用函数，判断表达式是否符合要求，此处不判断除法中除数是0的情况，不去排除不合理但合法的输入
		if (!isValid()) {
			alert("error input");
		} else {
			eval("result = " + display);
			document.getElementById("result").value = "=" + result;
			document.getElementById("display").value = display;
		}
	}
}

