var start = 0;
var through = 0;

function warning(event) {
	if (start == 1) {
		start = 0;
		event.target.id = 'error';
		document.getElementById("result").textContent = 'You lose';
	}
}

function myReset(event) {
	if (event.target.id == 'error') event.target.id = 'wall';
}

function addListener() {
	var i, j;
	var _area, _path;
	for (i = 1; i <= 6; i++) {
		_area = document.getElementsByClassName("area"+i);
		for (j = 0; j < _area.length; j++) {
			_area[j].addEventListener('mouseover', warning);
			_area[j].addEventListener('mouseout', myReset);
		}
		if (i <= 3) {
			_path = document.getElementsByClassName("path"+i);
			for (j = 0; j < _path.length; j++) _path[j].addEventListener('mouseover', changeMouse);
		}
	}
}

function changeMouse(event) {
	if (start == 1) event.target.style.cursor = "pointer";
}

window.onload = function() {
	addListener();
	document.getElementById("s").onmouseover = function() {
		if (start == 0) {
			start = 1;
			document.getElementById("result").textContent = 'Gaming';
		}
	}
	document.getElementById("e").onmouseover = function() {
		if (start == 1 && through == 1) {
			start = 0;
			through = 0;
			document.getElementById("result").textContent = 'You Win';
		} else if (start == 1 && through == 0) {
			start = 0;
			through = 0;
			document.getElementById("result").textContent = 'Don\'t cheat!';
		}
	}
	document.getElementsByClassName("path3")[0].onmouseover = function() {
		if (start == 1) {
			if (through == 0) through = 1;
		}
	}
}
