let pos = [[0], [0], [0], [0]];
let start = 0;

const gameAreaRow = 4;
const gameAreaCol = 4;
const totalGameArea = gameAreaRow * gameAreaCol - 1;

const randomArray = () => {
	let i, j;
	let random, tmp;
	for (i = 0; i < gameAreaRow; i++) {
		for (j = 0; j < gameAreaCol; j++) {
			if (!(i == gameAreaRow - 1 && j == gameAreaCol - 1)) {
				pos[i][j] = gameAreaRow * i + j + 1;
			}
		}
	}
	pos[gameAreaRow - 1][gameAreaCol - 1] = 0;
	for (i = totalGameArea - 1; i >= 0; i--) {
		random = Math.round(Math.random() * i);
		tmp = pos[Math.floor(i / gameAreaRow)][i % gameAreaCol];
		pos[Math.floor(i / gameAreaRow)][i % gameAreaCol] =
			pos[Math.floor(random / gameAreaRow)][random % gameAreaCol];
		pos[Math.floor(random / gameAreaRow)][random % gameAreaCol] = tmp;
	}
	while (!isPlayable()) {
		for (i = totalGameArea - 1; i >= 0; i--) {
			random = Math.round(Math.random() * i);
			tmp = pos[Math.floor(i / gameAreaRow)][i % gameAreaCol];
			pos[Math.floor(i / gameAreaRow)][i % gameAreaCol] =
				pos[Math.floor(random / gameAreaRow)][random % gameAreaCol];
			pos[Math.floor(random / gameAreaRow)][random % gameAreaCol] = tmp;
		}
	}
};

const isPlayable = () => {
	let count = 0;
	for (let i = 0; i < totalGameArea; i++) {
		for (let j = 0; j < totalGameArea; j++) {
			if (pos[Math.floor(i / gameAreaRow)][i % gameAreaCol] >
			    pos[Math.floor(i / gameAreaRow)][i % gameAreaCol]) {
				count++;
			}
		}
	}
	return (count % 2 == 0) ? true : false;
};

const picMove = (event) => {
	if (event.target.id == "blank" || start == 0) return;
	let i, j;
	let isValid = 0;
	let direction = "";
	let posX, posY;
	let blankX, blankY;
	for (i = 0; i < gameAreaRow; i++) {
		for (j = 0; j < gameAreaCol; j++) {
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

const addPicture = () => {
	let gameFragment = document.createDocumentFragment();
	let i, j;
	let pic;
	for (i = 0; i < gameAreaRow; i++) {
		for (j = 0; j < gameAreaCol; j++) {
			if (!(i == gameAreaRow - 1 && j == gameAreaCol - 1)) {
				pic = document.createElement("div");
				pic.className = "pic row" + (i + 1) + " col" + (j + 1);
				pic.id = "pic" + (gameAreaRow * i + j + 1);
				pic.addEventListener('click', picMove);
				gameFragment.appendChild(pic);
			}
		}
	}
	let blank = document.createElement("div");
	blank.className = "blank row" + gameAreaRow + " col" + gameAreaCol;
	blank.id = "blank";
	blank.addEventListener('click', picMove);
	pos[gameAreaRow - 1][gameAreaCol - 1] = 0;
	gameFragment.appendChild(blank);
	document.getElementById("gameArea").appendChild(gameFragment);
};

const check = () => {
	for (let i = 0; i < gameAreaRow; i++) {
		for (let j = 0; j < gameAreaCol; j++) {
			if (pos[i][j] != gameAreaRow * i + j + 1 &&
				!(i == gameAreaRow - 1 && j == gameAreaCol - 1)) {
				return;
			}
		}
	}
	alert("Finished");
	start = 0;
};

const refresh = () => {
	let pic = document.getElementsByClassName("pic");
	randomArray();
	for (let i = 0; i < gameAreaRow; i++) {
		for (let j = 0; j < gameAreaCol; j++) {
			if (!(i == gameAreaRow - 1 && j == gameAreaCol - 1)) {
				pic[gameAreaRow * i + j].className = "pic row" + (i + 1) + " col" + (j + 1);
				pic[gameAreaRow * i + j].id = "pic" + pos[i][j];
			}
		}
	}
	let blank = document.getElementsByClassName("blank");
	blank[0].className = "blank row" + gameAreaRow + " col" + gameAreaCol;
	blank[0].id = "blank";
	start = 1;
};

window.onload = () => {
	addPicture();
	document.getElementById("restart").onclick = refresh;
};
