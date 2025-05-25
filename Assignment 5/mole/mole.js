let score = 0;
let time = 30;
let _hole;
let start = 0;
let mousePos = -1;
let clock;
let delay1, delay2;

function insertHole() {
	let i, j;
	let hole;
	let gameArea = document.getElementById("gameArea");
	for (i = 0; i < 6; i++) {
		for (j = 0; j < 10; j++) {
			hole = document.createElement("div");
			hole.className = "hole";
			hole.addEventListener('click', check);
			gameArea.appendChild(hole);
		}
	}
	_hole = document.getElementsByClassName("hole");
}

function check(event) {
	if (start == 1) {
		if (event.target.id == "mouseAppear") {
			_hole[mousePos].id = "mouseHitted";
			delay2 = window.setTimeout(refresh, 150);
		} else score--;
		document.getElementById("scoreDisplay").value = score;
	}
}

function myReset() {
	time = 30;
	score = 0;
	start = 0;
	_hole[mousePos].id = "";
	mousePos = -1;
	clearInterval(clock);
	clearTimeout(delay1);
	clearTimeout(delay2);
	document.getElementById("result").value = "Pressing button to restart";
}

function timeSub() {
	time--;
	document.getElementById("timeDisplay").value = time;
	if (time == 0) {
		alert("Game Over, you have got" + score);
		myReset();
	}
}

function judgeStatus() {
	if (start == 0) {
		start = 1;
		mousePos = Math.round(Math.random() * 60);
		_hole[mousePos].id = "mouseAppear";
		document.getElementById("scoreDisplay").value = score;
		document.getElementById("timeDisplay").value = time;
		clock = window.setInterval(timeSub, 1000);
		document.getElementById("result").value = "Gaming";
	} else if (start == 1) {
		start = -1;
		clearInterval(clock);
		document.getElementById("result").value = "Pausing";
	} else if (start == -1) {
		start = 1;
		document.getElementById("result").value = "Gaming";
		clock = window.setInterval(timeSub, 1000);
	}
}

function hitted() {
	_hole[mousePos].id = "mouseHitted";
}

function refresh() {
	_hole[mousePos].id = "";
	score++;
	mousePos = Math.round(Math.random() * 60);
	if (mousePos >= 60) mousePos = 59;
	_hole[mousePos].id = "mouseAppear";
}

window.onload = function () {
	insertHole();
	document.getElementById("start/stopButton").onclick = judgeStatus;
	document.getElementById("gameArea").onmouseover = function () {
		this.className = "star";
	}
}
