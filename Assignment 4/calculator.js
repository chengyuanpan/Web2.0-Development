function caculate(expr) {
	try {
		// Only numbers, operators and brackets are allowed to prevent malicious code
		if (!/^[\d+\-*/().]+$/.test(expr)) {
			throw new Error("Illegal expression");
		}

		// Use the Function constructor to safely execute expressions
		const result = Function('"use strict"; return (' + expr + ')')();
		return String(result);
	} catch (e) {
		return "Illegal expression";
	}
}

window.onload = function () {
	let display = "";
	let result = "";

	const displayInput = document.getElementById("display");
	const resultInput = document.getElementById("result");

	function updateDisplay() {
		displayInput.value = display;
	}

	const normalButtons = [
		{ id: "num0", val: "0" },
		{ id: "num1", val: "1" },
		{ id: "num2", val: "2" },
		{ id: "num3", val: "3" },
		{ id: "num4", val: "4" },
		{ id: "num5", val: "5" },
		{ id: "num6", val: "6" },
		{ id: "num7", val: "7" },
		{ id: "num8", val: "8" },
		{ id: "num9", val: "9" },
		{ id: "spot", val: "." },
		{ id: "leftBracket", val: "(" },
		{ id: "rightBracket", val: ")" }
	];

	normalButtons.forEach(btn => {
		document.getElementById(btn.id).onclick = () => {
			display += btn.val;
			updateDisplay();
		};
	});

	const operatorButtons = [
		{ id: "add", op: "+" },
		{ id: "subtract", op: "-" },
		{ id: "mutiply", op: "*" },
		{ id: "divide", op: "/" }
	];

	operatorButtons.forEach(btn => {
		document.getElementById(btn.id).onclick = () => {
			if (result !== "") {
				display = result;
				result = "";
				resultInput.value = "";
			}
			display += btn.op;
			updateDisplay();
		};
	});

	document.getElementById("delete").onclick = () => {
		display = display.slice(0, -1);
		updateDisplay();
	};

	document.getElementById("clear").onclick = () => {
		display = "";
		result = "";
		updateDisplay();
		resultInput.value = "";
	};

	document.getElementById("equal").onclick = () => {
		result = caculate(display);
		resultInput.value = "=" + result;
		updateDisplay();
	};
};
