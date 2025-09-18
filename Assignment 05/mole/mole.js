let score = 0;
let time = 10;
let holeElement;
let start = 0; // 0: not started, 1: gaming, -1: paused
let molePos = -1;
let clock;
let delay;

const holesRowNum = 6;
const holesColNum = 10;
const totalHoles = holesRowNum * holesColNum;

const refresh = () => {
	holeElement[molePos].id = "";
	molePos = Math.floor(Math.random() * totalHoles);
	holeElement[molePos].id = "moleAppear";
};

const check = (event) => {
	if (start == 1) {
		if (event.target.id == "moleAppear") {
			score++;
			holeElement[molePos].id = "moleHitted";
			delay = window.setTimeout(refresh, 150);
		} else {
			score--;
		}
		document.getElementById("scoreDisplay").value = score;
	}
};

const insertHole = () => {
	let hole;
	let gameArea = document.getElementById("gameArea");
	for (let i = 0; i < holesRowNum; i++) {
		for (let j = 0; j < holesColNum; j++) {
			hole = document.createElement("div");
			hole.className = "hole";
			hole.addEventListener('click', check);
			gameArea.appendChild(hole);
		}
	}
	holeElement = document.getElementsByClassName("hole");
};

const myReset = () => {
	time = 10;
	score = 0;
	start = 0;
	holeElement[molePos].id = "";
	molePos = -1;
	clearInterval(clock);
	clearTimeout(delay);
	document.getElementById("result").value = "Pressing button to restart";
};

const timeSub = () => {
	time--;
	document.getElementById("timeDisplay").value = time;
	if (time == 0) {
		alert("Game Over, you have got: " + score);
		myReset();
	}
};

const judgeStatus = () => {
	if (start == 0) {
		start = 1;
		molePos = Math.round(Math.random() * 60);
		holeElement[molePos].id = "moleAppear";
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
};

window.onload = () => {
	insertHole();
	document.getElementById("start/stopButton").onclick = judgeStatus;
	document.getElementById("gameArea").onmouseover = () => {
		this.className = "mousePointer";
	};
};
