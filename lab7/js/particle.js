class Particle {
	id;
	forceX;
	forceY;
	dx;
	dy;
	radius;

	constructor() {
		const dx = Math.random() * canvasWidth;
		const dy = Math.random() * canvasHeight;

		const radius = getRandomInt(PARTICLE_RADIUS_FROM, PARTICLE_RADIUS_TO);
		const force = getRandomArbitrary(0.1, 1);

		this.id = particlesCounter++;
		this.dx = dx;
		this.dy = dy;
		this.radius = radius;
		this.forceX = force;
		this.forceY = force;
		this.draw(dx, dy);
	}

	draw(x, y) {
		ctx.beginPath();
		ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#7e22ce';
		ctx.stroke();
	}
}
