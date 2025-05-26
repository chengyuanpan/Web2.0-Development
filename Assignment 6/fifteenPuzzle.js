let pos = [[0], [0], [0], [0]];
let start = 0;

const randomArray = () => {
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
};

const isPlayable = () => {
	let count = 0;
	for (let i = 0; i < 15; i++) {
		for (let j = 0; j < 15; j++) {
			if (pos[Math.floor(i / 4)][i % 4] > pos[Math.floor(i / 4)][i % 4]) count++;
		}
	}
	if (count % 2 == 0) return true;
	else return false;
};

const addPicture = () => {
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
	blank.addEventListener('click', picMove);
	pos[3][3] = 0;
	game.appendChild(blank);
	document.getElementById("gameArea").appendChild(game);
};

const picMove = (event) => {
	if (event.target.id == "blank" || start == 0) return;
	let i, j;
	let isValid = 0;
	let direction = "";
	let posX, posY;
	let blankX, blankY;
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			if ("pic" + pos[i][j] == event.target.id) {
				posX = i;
				posY = j;
			}
			if (pos[i][j] == 0) {
				blankX = i;
				blankY = j;
			}
		}
	}
	if (blankX == posX) {
		if (blankY - posY == -1) {
			isValid = 1;
			direction = "up";
		} else if (blankY - posY == 1) {
			isValid = 1;
			direction = "down";
		}
	} else if (blankY == posY) {
		if (blankX - posX == -1) {
			isValid = 1;
			direction = "left";
		} else if (blankX - posX == 1) {
			isValid = 1;
			direction = "right";
		}
	}
	if (isValid == 1) {
		pos[blankX][blankY] = pos[posX][posY];
		pos[posX][posY] = 0;
		let blank = document.getElementById("blank");
		event.target.className = "pic row" + (blankX + 1) + " col" + (blankY + 1);
		blank.className = "blank row" + (posX + 1) + " col" + (posY + 1);
	}
	check();
};

const check = () => {
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (pos[i][j] != 4 * i + j + 1 && !(i == 3 && j == 3)) return;
		}
	}
	alert("Finished");
	start = 0;
};

const refresh = () => {
	let pic = document.getElementsByClassName("pic");
	randomArray();
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (!(i == 3 && j == 3)) {
				pic[4 * i + j].className = "pic row" + (i + 1) + " col" + (j + 1);
				pic[4 * i + j].id = "pic" + pos[i][j];
			}
		}
	}
	let blank = document.getElementsByClassName("blank");
	blank[0].className = "blank row4 col4";
	blank[0].id = "blank";
	start = 1;
};

window.onload = () => {
	addPicture();
	document.getElementById("restart").onclick = refresh;
};
