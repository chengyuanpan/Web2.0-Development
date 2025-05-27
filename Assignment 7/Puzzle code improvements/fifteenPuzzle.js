const gameAreaRow = 4;
const gameAreaCol = 4;
const totalGameArea = gameAreaRow * gameAreaCol - 1;
// Create a 2D array to represent the game area
const pos = Array.from({ length: gameAreaRow }, () =>
	Array.from({ length: gameAreaCol }, () => 0)
);

let start = 0;

const isPlayable = () => {
	let count = 0;
	for (let i = 0; i < totalGameArea; i++) {
		for (let j = i + 1; j < totalGameArea; j++) {
			if (
				pos[Math.floor(i / gameAreaRow)][i % gameAreaCol] >
				pos[Math.floor(j / gameAreaRow)][j % gameAreaCol]
			) {
				count++;
			}
		}
	}

	return count % 2 == 0;
};

const shuffleArray = () => {
	for (let i = totalGameArea - 1; i >= 0; i--) {
		let random = Math.round(Math.random() * i);
		let tmp = pos[Math.floor(i / gameAreaRow)][i % gameAreaCol];
		pos[Math.floor(i / gameAreaRow)][i % gameAreaCol] =
			pos[Math.floor(random / gameAreaRow)][random % gameAreaCol];
		pos[Math.floor(random / gameAreaRow)][random % gameAreaCol] = tmp;
	}
};

const randomArray = () => {
	for (let i = 0; i < gameAreaRow; i++) {
		for (let j = 0; j < gameAreaCol; j++) {
			if (!(i == gameAreaRow - 1 && j == gameAreaCol - 1)) {
				pos[i][j] = gameAreaRow * i + j + 1;
			}
		}
	}
	pos[gameAreaRow - 1][gameAreaCol - 1] = 0;

	shuffleArray();

	while (!isPlayable()) {
		shuffleArray();
	}
};

const refresh = () => {
	randomArray();

	$(".pic").each(function (i) {
		this.id = "pic" + pos[Math.floor(i / gameAreaRow)][i % gameAreaCol];
		this.className =
			"pic row" +
			(Math.floor(i / gameAreaRow) + 1) +
			" col" +
			((i % gameAreaCol) + 1);
	});
	document.getElementsByClassName("blank").className =
		"blank row" + gameAreaRow + " col" + gameAreaCol;

	start = 1;
};

const isGameFinished = () => {
	for (let i = 0; i < gameAreaRow; i++) {
		for (let j = 0; j < gameAreaCol; j++) {
			if (
				pos[i][j] != gameAreaRow * i + j + 1 &&
				!(i == gameAreaRow - 1 && j == gameAreaCol - 1)
			) {
				return false;
			}
		}
	}
	return true;
};

const picMove = (event) => {
	if (event.target.id == "blank" || start == 0) {
		return;
	}

	let isValid = false;
	let posX, posY, blankX, blankY;
	for (let i = 0; i < gameAreaRow; i++) {
		for (let j = 0; j < gameAreaCol; j++) {
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

	// Check if the clicked picture is adjacent to the blank space
	if (
		(blankX == posX && Math.abs(blankY - posY) == 1) ||
		(blankY == posY && Math.abs(blankX - posX) == 1)
	) {
		isValid = true;
	}

	if (isValid) {
		pos[blankX][blankY] = pos[posX][posY];
		pos[posX][posY] = 0;
		event.target.className = "pic row" + (blankX + 1) + " col" + (blankY + 1);
		document.getElementById("blank").className =
			"blank row" + (posX + 1) + " col" + (posY + 1);
	}

	if (isGameFinished()) {
		alert("Finished");
		start = 0;
	}
};

const addPic = () => {
	let game = document.createDocumentFragment();
	for (let i = 0; i < gameAreaRow; i++) {
		for (let j = 0; j < gameAreaCol; j++) {
			if (!(i == gameAreaRow - 1 && j == gameAreaCol - 1)) {
				let pic = document.createElement("div");
				pic.className = "pic row" + (i + 1) + " col" + (j + 1);
				pic.id = "pic" + (gameAreaRow * i + j + 1);
				pic.addEventListener("click", picMove);
				game.appendChild(pic);
			}
		}
	}

	let blank = document.createElement("div");
	blank.className = "blank row" + gameAreaRow + " col" + gameAreaCol;
	blank.id = "blank";
	pos[gameAreaRow - 1][gameAreaCol - 1] = 0;
	game.appendChild(blank);

	document.getElementById("gameArea").appendChild(game);
};

window.onload = () => {
	addPic();
	document.getElementById("restart").onclick = refresh;
};
