let pos = [[0], [0], [0], [0]];
let start = 0;

function randomArray() {
	let i, j;
	let random, tmp;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			if (!(i == 3 && j == 3)) pos[i][j] = 4 * i + j + 1;
		}
	}
	pos[3][3] = 0;
	for (i = 14; i >= 0; i--) {
		random = Math.round(Math.random() * i);
		tmp = pos[Math.floor(i / 4)][i % 4];
		pos[Math.floor(i / 4)][i % 4] = pos[Math.floor(random / 4)][random % 4];
		pos[Math.floor(random / 4)][random % 4] = tmp;
	}
	while (!isPlayable()) {
		for (i = 14; i >= 0; i--) {
			random = Math.round(Math.random() * i);
			tmp = pos[Math.floor(i / 4)][i % 4];
			pos[Math.floor(i / 4)][i % 4] = pos[Math.floor(random / 4)][random % 4];
			pos[Math.floor(random / 4)][random % 4] = tmp;
		}
	}
}

function isPlayable() {
	let count = 0;
	for (let i = 0; i < 15; i++) {
		for (let j = i + 1; j < 15; j++) {
			if (pos[Math.floor(i / 4)][i % 4] > pos[Math.floor(j / 4)][j % 4]) count++;
		}
	}
	if (count % 2 == 0) return true;
	else return false;
}

function addPic() {
	let game = document.createDocumentFragment();
	let i, j;
	let pic;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			if (!(i == 3 && j == 3)) {
				pic = document.createElement("div");
				pic.className = "pic row" + (i + 1) + " col" + (j + 1);
				pic.id = "pic" + (4 * i + j + 1);
				pic.addEventListener('click', picMove);
				game.appendChild(pic);
			}
		}
	}
	let blank = document.createElement("div");
	blank.className = "blank row4 col4";
	blank.id = "blank";
	pos[3][3] = 0;
	game.appendChild(blank);
	document.getElementById("gameArea").appendChild(game);
}

function picMove(event) {
	if (event.target.id == "blank" || start == 0) return;
	let i, j;
	let isValid = 0;
	let posX, posY, blankX, blankY;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			if ("pic" + pos[i][j] == event.target.id) posX = i, posY = j;
			if (pos[i][j] == 0) blankX = i, blankY = j;
		}
	}
	if (blankX == posX && (blankY - posY == -1 || blankY - posY == 1)) isValid = 1;
	else if (blankY == posY && (blankX - posX == -1 || blankX - posX == 1)) isValid = 1;
	if (isValid == 1) {
		pos[blankX][blankY] = pos[posX][posY];
		pos[posX][posY] = 0;
		event.target.className = "pic row" + (blankX + 1) + " col" + (blankY + 1);
		document.getElementById("blank").className = "blank row" + (posX + 1) + " col" + (posY + 1);
	}
	check();
}

function check() {
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (pos[i][j] != 4 * i + j + 1 && !(i == 3 && j == 3)) return;
		}
	}
	alert("Finished");
	start = 0;
}

function refresh() {
	randomArray();
	$(".pic").each(function (i) {
		this.id = "pic" + pos[Math.floor(i / 4)][i % 4];
		this.className = "pic row" + (Math.floor(i / 4) + 1) + " col" + (i % 4 + 1);
	});
	document.getElementsByClassName("blank").className = "blank row4 col4";
	start = 1;
}

window.onload = function () {
	addPic();
	document.getElementById("restart").onclick = refresh;
}
