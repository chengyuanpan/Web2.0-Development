let isStart = false;
let isThrough = false;
const wallNumber = 6;
const pathNumber = 3;

function warning(event) {
	if (isStart) {
		isStart = false;
		event.target.id = 'error';
		document.getElementById("result").textContent = 'You lose';
	}
}

function wallRecover(event) {
	if (event.target.id == 'error') {
		event.target.id = 'wall';
	}
}

function changeMouse(event) {
	if (isStart) {
		event.target.style.cursor = "pointer";
	}
}

function addListener() {
	let areaElement, pathElement;
	for (let i = 1; i <= wallNumber; i++) {
		areaElement = document.getElementsByClassName("area" + i);
		for (let j = 0; j < areaElement.length; j++) {
			areaElement[j].addEventListener('mouseover', warning);
			areaElement[j].addEventListener('mouseout', wallRecover);
		}
		if (i <= pathNumber) {
			pathElement = document.getElementsByClassName("path" + i);
			for (let j = 0; j < pathElement.length; j++) {
				pathElement[j].addEventListener('mouseover', changeMouse);
			}
		}
	}
}

window.onload = function () {
	addListener();
	document.getElementById("s").onmouseover = function () {
		if (!isStart) {
			isStart = true;
			document.getElementById("result").textContent = 'Gaming';
		}
	}
	document.getElementById("e").onmouseover = function () {
		if (isStart && isThrough) {
			isStart = false;
			isThrough = false;
			document.getElementById("result").textContent = 'You Win';
		} else if (isStart && !isThrough) {
			isStart = false;
			isThrough = false;
			document.getElementById("result").textContent = 'Don\'t cheat!';
		}
	}
	document.getElementsByClassName("path3")[0].onmouseover = function () {
		if (isStart && !isThrough) {
			isThrough = true;
		}
	}
}
