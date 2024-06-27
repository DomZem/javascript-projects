// Buttons
const homePlayButton = document.querySelector('.home-play-button');
const homeRecordsButton = document.querySelector('.home-records-button');

// Game Mode Buttons
const oneHolePlayButton = document.querySelector('.one-hole-play-button');
const multipleHolePlayButton = document.querySelector('.multiple-hole-play-button');
const blackHolePlayButton = document.querySelector('.black-hole-play-button');

// Records View Buttons
const recordsViewHomeButton = document.querySelector('.records-home-button');

// Views
const homeView = document.querySelector('.home-view');
const gameModeView = document.querySelector('.game-mode-view');
const recordsView = document.querySelector('.records-view');

// Game Views
const oneHoleGameView = document.querySelector('.one-hole-game-view');
const multipleHoleGameView = document.querySelector('.multiple-hole-game-view');
const blackHoleGameView = document.querySelector('.black-hole-game-view');

const displayRecords = () => {
	const records = JSON.parse(localStorage.getItem('records')) || [];

	// Sort records by score
	records.sort((a, b) => b.score - a.score);

	// Remove all records from the list
	const recordsList = document.querySelector('.records-list');
	recordsList.innerHTML = '';

	const virtualRecordsList = document.createDocumentFragment();

	// Display records
	records.forEach(({ createdAt, score }, index) => {
		const recordItem = document.createElement('li');
		recordItem.classList.add('records-list-item');

		const recordContent = document.createElement('div');
		recordContent.classList.add('records-list-item-content');

		const recordId = document.createElement('p');
		recordId.textContent = `#${++index}`;

		const recordCreatedAt = document.createElement('p');
		recordCreatedAt.textContent = createdAt;

		recordContent.appendChild(recordId);
		recordContent.appendChild(recordCreatedAt);

		const recordScore = document.createElement('p');
		recordScore.classList.add('records-list-item-score');
		recordScore.textContent = score;

		recordItem.appendChild(recordContent);
		recordItem.appendChild(recordScore);

		virtualRecordsList.appendChild(recordItem);
	});

	recordsList.appendChild(virtualRecordsList);
};

// Home View Actions
homePlayButton.addEventListener('click', () => {
	homeView.classList.toggle('hidden');
	gameModeView.classList.toggle('hidden');
});

homeRecordsButton.addEventListener('click', () => {
	homeView.classList.toggle('hidden');
	recordsView.classList.toggle('hidden');
	displayRecords();
});

// Records View Actions
recordsViewHomeButton.addEventListener('click', () => {
	recordsView.classList.toggle('hidden');
	homeView.classList.toggle('hidden');
});

// Game Modes
oneHolePlayButton.addEventListener('click', () => {
	gameModeView.classList.toggle('hidden');
	oneHoleGameView.classList.toggle('hidden');
	startOneHoleGame();
});

multipleHolePlayButton.addEventListener('click', () => {
	gameModeView.classList.toggle('hidden');
	multipleHoleGameView.classList.toggle('hidden');
});

blackHolePlayButton.addEventListener('click', () => {
	gameModeView.classList.toggle('hidden');
	blackHoleGameView.classList.toggle('hidden');
});

// Dialog
const modal = document.querySelector('.modal');
const gameOverScoreText = document.querySelector('.game-over-score');

// One Hole Game
const canvas = document.querySelector('.one-hole-canvas');
const ctx = canvas.getContext('2d');
const timerText = document.querySelector('.one-hole-time-left-value');
const scoreText = document.querySelector('.one-hole-score-value');

const restartButton = document.querySelector('.one-hole-restart-game-button');
const homeButton = document.querySelector('.home-button');

const ballRadius = 15;
const holeRadius = 20;

let ballPosition = { x: canvas.width / 2, y: canvas.height / 2 };
let holePosition = {
	x: Math.random() * (canvas.width - holeRadius * 2) + holeRadius,
	y: Math.random() * (canvas.height - holeRadius * 2) + holeRadius,
};

let remainingTimeSeconds = 10;
let score = 0;
let gameOver = false;

const drawBall = () => {
	ctx.beginPath();
	ctx.arc(ballPosition.x, ballPosition.y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = 'blue';
	ctx.fill();
	ctx.closePath();
};

const drawHole = () => {
	ctx.beginPath();
	ctx.arc(holePosition.x, holePosition.y, holeRadius, 0, Math.PI * 2);
	ctx.fillStyle = 'red';
	ctx.fill();
	ctx.closePath();
};

const checkCollision = () => {
	const dx = ballPosition.x - holePosition.x;
	const dy = ballPosition.y - holePosition.y;
	const distance = Math.sqrt(dx * dx + dy * dy);

	if (distance < ballRadius + holeRadius) {
		score++;
		scoreText.innerText = score;
		holePosition = {
			x: Math.random() * (canvas.width - holeRadius * 2) + holeRadius,
			y: Math.random() * (canvas.height - holeRadius * 2) + holeRadius,
		};
	}
};

const draw = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawHole();
};

const animate = () => {
	if (!gameOver) {
		draw();
		checkCollision();
		animationFrameId = requestAnimationFrame(animate);
	}
};

const saveRecord = (score) => {
	const records = JSON.parse(localStorage.getItem('records')) || [];

	records.push({
		id: records.length + 1,
		createdAt: new Date().toLocaleString(),
		score,
	});
	localStorage.setItem('records', JSON.stringify(records));
};

const updateTimer = () => {
	remainingTimeSeconds--;
	timerText.innerText = `${remainingTimeSeconds}s`;

	if (remainingTimeSeconds <= 0) {
		gameOver = true;
		clearInterval(timer);
		cancelAnimationFrame(animationFrameId);
		modal.showModal();
		gameOverScoreText.innerText = score;

		// Add new record to local storage
		saveRecord(score);
	}
};

const startOneHoleGame = () => {
	score = 0;
	scoreText.innerText = score;
	remainingTimeSeconds = 10;
	timerText.innerText = `${remainingTimeSeconds}s`;
	gameOver = false;
	ballPosition = { x: canvas.width / 2, y: canvas.height / 2 };
	holePosition = {
		x: Math.random() * (canvas.width - holeRadius * 2) + holeRadius,
		y: Math.random() * (canvas.height - holeRadius * 2) + holeRadius,
	};
	animationFrameId = requestAnimationFrame(animate);
	timer = setInterval(updateTimer, 1000);
};

window.addEventListener('deviceorientation', (event) => {
	if (gameOver) return;

	const { beta, gamma } = event;
	ballPosition.y += beta / 10;
	ballPosition.x += gamma / 10;

	// Keep ball within bounds
	ballPosition.x = Math.max(ballRadius, Math.min(canvas.width - ballRadius, ballPosition.x));
	ballPosition.y = Math.max(ballRadius, Math.min(canvas.height - ballRadius, ballPosition.y));
});

restartButton.addEventListener('click', () => {
	startOneHoleGame();
	modal.close();
});

homeButton.addEventListener('click', () => {
	homeView.classList.toggle('hidden');
	oneHoleGameView.classList.toggle('hidden');
	modal.close();
});
