const startAnimationBtn = document.querySelector('.start-animation-button');
const resetAnimationBtn = document.querySelector('.reset-animation-button');

// Form
const settingsAnimationForm = document.querySelector('.settings-animation-form');

// Inputs
const particlesAmountInput = document.querySelector('.particles-amount-input');
const distanceToDrawLineInput = document.querySelector('.distance-to-draw-line-input');
const usePushPullInput = document.querySelector('.use-push-pull-input');

const pushPullInput = document.querySelector('.push-pull-input');
const pushPullLabel = document.querySelector('.push-pull-label');

const pushPullForceInput = document.querySelector('.push-pull-force-input');

// Inputs Output
const particlesAmountOutput = document.querySelector('.particles-amount-output');
const distanceToDrawLineOutput = document.querySelector('.distance-to-draw-line-output');
const pushPullOutput = document.querySelector('.push-pull-output');
const pushPullForceOutput = document.querySelector('.push-pull-force-output');

// Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const clearCanvas = () => {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
};

// Particle
const PARTICLE_RADIUS_FROM = 1;
const PARTICLE_RADIUS_TO = 10;

let PARTICLES_AMOUNT = parseInt(particlesAmountInput.value, 10);
let DISTANCE_TO_DRAW_LINE = parseInt(distanceToDrawLineInput.value, 10);
let PUSH_PULL_FORCE = parseInt(pushPullForceInput.value, 10);

let isAnimationRunning = false;
let particlesCounter = 0;

// create particles
let particles = Array.from({ length: PARTICLES_AMOUNT }, () => new Particle());

const handleDrawLine = (particle) => {
	particles.forEach((otherParticle) => {
		if (particle !== otherParticle) {
			const distance = Math.sqrt((particle.dx - otherParticle.dx) ** 2 + (particle.dy - otherParticle.dy) ** 2);

			if (distance < DISTANCE_TO_DRAW_LINE) {
				ctx.beginPath();
				ctx.moveTo(particle.dx, particle.dy);
				ctx.lineTo(otherParticle.dx, otherParticle.dy);
				ctx.strokeStyle = 'black';
				ctx.stroke();
			}
		}
	});
};

const handleMove = (particle) => {
	particle.dx += particle.forceX;
	particle.dy += particle.forceY;
};

const handleBounce = (particle) => {
	if (particle.forceX + particle.dx > canvasWidth - particle.radius || particle.dx + particle.forceX < particle.radius) {
		particle.forceX *= -1;
	}

	if (particle.forceY + particle.dy > canvasHeight - particle.radius || particle.dy + particle.forceY < particle.radius) {
		particle.forceY *= -1;
	}
};

const handlePull = (particle, mouseX, mouseY) => {
	const distance = Math.sqrt((particle.dx - mouseX) ** 2 + (particle.dy - mouseY) ** 2);

	if (distance < 100) {
		particle.forceX = (mouseX - particle.dx) / PUSH_PULL_FORCE;
		particle.forceY = (mouseY - particle.dy) / PUSH_PULL_FORCE;
	}
};

const handlePush = (particle, mouseX, mouseY) => {
	const distance = Math.sqrt((particle.dx - mouseX) ** 2 + (particle.dy - mouseY) ** 2);

	if (distance < 100) {
		particle.forceX = (particle.dx - mouseX) / PUSH_PULL_FORCE;
		particle.forceY = (particle.dy - mouseY) / PUSH_PULL_FORCE;
	}
};

canvas.addEventListener('click', (event) => {
	const x = event.offsetX;
	const y = event.offsetY;

	const particle = particles.find((particle) => {
		if (particle.dx - particle.radius < x && particle.dx + particle.radius > x && particle.dy - particle.radius < y && particle.dy + particle.radius > y) {
			return particle;
		}
	});

	if (particle) {
		const index = particles.indexOf(particle);
		// Remove particle
		particles.splice(index, 1);

		// Add two new particles
		particles.push(new Particle(), new Particle());
	}
});

canvas.addEventListener('mousemove', (e) => {
	if (!usePushPullInput.checked) {
		return;
	}

	const x = e.offsetX;
	const y = e.offsetY;

	particles.forEach((particle) => {
		if (pushPullInput.checked) {
			handlePull(particle, x, y);
		} else {
			handlePush(particle, x, y);
		}
	});
});

const animate = () => {
	if (isAnimationRunning) {
		clearCanvas();

		particles.forEach((particle) => {
			handleMove(particle);
			handleBounce(particle);
			handleDrawLine(particle);
			particle.draw(particle.dx, particle.dy);
		});
	}

	requestAnimationFrame(animate);
};

animate();

// CTA buttons
startAnimationBtn.addEventListener('click', () => {
	isAnimationRunning = !isAnimationRunning;

	//  ui
	startAnimationBtn.classList.toggle('button-destructive');
	startAnimationBtn.textContent = isAnimationRunning ? 'Stop' : 'Start';
});

resetAnimationBtn.addEventListener('click', () => {
	particles = Array.from({ length: PARTICLES_AMOUNT }, () => new Particle());
});

settingsAnimationForm.addEventListener('input', (e) => {
	const target = e.target;

	if (target.classList.contains('particles-amount-input')) {
		// clearCanvas();
		PARTICLES_AMOUNT = parseInt(target.value, 10);
		particlesAmountOutput.textContent = PARTICLES_AMOUNT;
		particles = Array.from({ length: PARTICLES_AMOUNT }, () => new Particle());
	} else if (target.classList.contains('distance-to-draw-line-input')) {
		DISTANCE_TO_DRAW_LINE = parseInt(target.value, 10);
		distanceToDrawLineOutput.textContent = DISTANCE_TO_DRAW_LINE;
	} else if (target.classList.contains('push-pull-force-input')) {
		PUSH_PULL_FORCE = parseInt(target.value, 10);
		pushPullForceOutput.textContent = PUSH_PULL_FORCE;
	}
});

pushPullInput.addEventListener('input', (e) => {
	// update UI
	if (pushPullInput.checked) {
		pushPullLabel.textContent = 'Pull';
	} else {
		pushPullLabel.textContent = 'Push';
	}
});
