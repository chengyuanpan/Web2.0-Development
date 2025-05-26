const gameAreaRow = 4;
const gameAreaCol = 4;
const totalGameArea = gameAreaRow * gameAreaCol - 1;
// Create a 2D array to represent the game area
const pos = Array.from({ length: gameAreaRow }, () =>
	Array.from({ length: gameAreaCol }, () => 0)
);
// Initialize the position array
let start = 0;

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

	// Ensure the generated array is playable
	while (!isPlayable()) {
		shuffleArray();
	}
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

const isGameFinished = () => {
	for (let i = 0; i < gameAreaRow; i++) {
		for (let j = 0; j < gameAreaCol; j++) {
			if (pos[i][j] != gameAreaRow * i + j + 1 &&
				!(i == gameAreaRow - 1 && j == gameAreaCol - 1)) {
				return false;
			}
		}
	}
	return true;
};

const movePicture = (event) => {
	if (event.target.id == "blank" || start == 0) {
		return;
	}

	let isValid = false;
	let pictureX, pictureY;
	let blankSpaceX, blankSpaceY;

	// Find the position of the clicked picture and the blank space
	for (let i = 0; i < gameAreaRow; i++) {
		for (let j = 0; j < gameAreaCol; j++) {
			if ("pic" + pos[i][j] == event.target.id) {
				pictureX = i;
				pictureY = j;
			}
			if (pos[i][j] == 0) {
				blankSpaceX = i;
				blankSpaceY = j;
			}
		}
	}

	// Check if the clicked picture is adjacent to the blank space
	if (blankSpaceX == pictureX && Math.abs(blankSpaceY - pictureY) == 1) {
		isValid = true;
	} else if (blankSpaceY == pictureY && Math.abs(blankSpaceX - pictureX) == 1) {
		isValid = true;
	}

	if (isValid) {
		pos[blankSpaceX][blankSpaceY] = pos[pictureX][pictureY];
		pos[pictureX][pictureY] = 0;
		let blank = document.getElementById("blank");
		event.target.className = "pic row" + (blankSpaceX + 1) + " col" + (blankSpaceY + 1);
		blank.className = "blank row" + (pictureX + 1) + " col" + (pictureY + 1);
	}

	if (isGameFinished()) {
		alert("Finished");
		start = 0;
	}
};

const addPicture = () => {
	let gameFragments = document.createDocumentFragment();

	// process pictures
	for (let i = 0; i < gameAreaRow; i++) {
		for (let j = 0; j < gameAreaCol; j++) {
			if (!(i == gameAreaRow - 1 && j == gameAreaCol - 1)) {
				let pic = document.createElement("div");
				pic.className = "pic row" + (i + 1) + " col" + (j + 1);
				pic.id = "pic" + (gameAreaRow * i + j + 1);
				pic.addEventListener('click', movePicture);
				gameFragments.appendChild(pic);
			}
		}
	}

	// process blank space
	let blankSpace = document.createElement("div");
	blankSpace.className = "blank row" + gameAreaRow + " col" + gameAreaCol;
	blankSpace.id = "blank";
	blankSpace.addEventListener('click', movePicture);
	pos[gameAreaRow - 1][gameAreaCol - 1] = 0;
	gameFragments.appendChild(blankSpace);

	document.getElementById("gameArea").appendChild(gameFragments);
};

window.onload = () => {
	addPicture();
	document.getElementById("restart").onclick = refresh;
};
