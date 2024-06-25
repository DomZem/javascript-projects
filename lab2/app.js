const slider = document.querySelector('.slider');
const slidesWrapper = document.querySelector('.slides-wrapper');

const dotsContainer = document.querySelector('.dots');

// cta buttons
const nextSlideBtn = document.querySelector('.next-slide-btn');
const prevSlideBtn = document.querySelector('.prev-slide-btn');
const pauseBtn = document.querySelector('.pause-btn');

const lightbox = document.querySelector('.lightbox');

const slides = [
	{
		type: 'image',
		value: 'https://cdn.pixabay.com/photo/2023/06/10/15/40/berlin-8054311_1280.jpg',
	},
	{
		type: 'image',
		value: 'https://cdn.pixabay.com/photo/2024/01/30/14/02/road-8542123_960_720.jpg',
	},
	{
		type: 'image',
		value: 'https://cdn.pixabay.com/photo/2024/02/24/10/31/norway-8593725_960_720.jpg',
	},
	{
		type: 'text',
		value: 'Hello world',
	},
	{
		type: 'video',
		value: 'https://www.w3schools.com/html/mov_bbb.mp4',
	},
];

let currentSlide = 0;
let isPaused = false;
let interval;

const initSlides = () => {
	slides.forEach((s, i) => {
		const slide = document.createElement('li');
		slide.classList.add('slide');

		switch (s.type) {
			case 'image':
				const img = document.createElement('img');
				img.src = s.value;
				slide.appendChild(img);
				break;
			case 'text':
				const textWrapper = document.createElement('div');
				textWrapper.classList.add('slide-text-wrapper');

				const p = document.createElement('p');
				p.textContent = s.value;
				p.classList.add('slide-text');

				textWrapper.appendChild(p);
				slide.appendChild(textWrapper);
				break;
			case 'video':
				const video = document.createElement('video');
				video.src = s.value;
				video.controls = true;
				video.style.width = '100%';
				video.style.height = '100%';
				slide.appendChild(video);
				break;
		}

		slidesWrapper.appendChild(slide);

		const dot = document.createElement('span');
		dot.classList.add('dot');
		dot.classList.add(`dot-${i}`);
		dot.addEventListener('click', () => goToSlide(i));
		dotsContainer.appendChild(dot);
	});

	updateDots();
};

const updateDots = () => {
	const dots = document.querySelectorAll('.dot');

	dots.forEach((dot, i) => {
		dot.classList.toggle('active', i === currentSlide);
	});
};

const goToSlide = (index) => {
	currentSlide = index;
	slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
	updateDots();
};

const nextSlide = () => {
	currentSlide = (currentSlide + 1) % slides.length;
	goToSlide(currentSlide);
};

const prevSlide = () => {
	currentSlide = (currentSlide - 1 + slides.length) % slides.length;
	goToSlide(currentSlide);
};

const togglePause = () => {
	isPaused = !isPaused;
	pauseBtn.textContent = isPaused ? 'Play' : 'Pause';

	if (isPaused) {
		clearInterval(interval);
	} else {
		startAutoSlide();
	}
};

const startAutoSlide = () => {
	interval = setInterval(nextSlide, 3000);
};

const openLightbox = ({ type, src }) => {
	switch (type) {
		case 'image':
			const img = document.createElement('img');
			img.src = src;
			img.style.width = '50%';
			img.style.height = '50%';
			lightbox.appendChild(img);
			break;
		case 'video':
			const video = document.createElement('video');
			video.src = src;
			video.controls = true;
			video.autoplay = true;
			video.style.width = '50%';
			video.style.height = '50%';

			lightbox.appendChild(video);
			break;
	}

	lightbox.classList.add('visible');

	clearInterval(interval);
};

const closeLightbox = () => {
	while (lightbox.firstChild) {
		lightbox.removeChild(lightbox.firstChild);
	}

	lightbox.classList.remove('visible');

	if (!isPaused) startAutoSlide();
};

lightbox.addEventListener('click', closeLightbox);

slider.addEventListener('click', (e) => {
	switch (e.target.tagName) {
		case 'IMG':
			openLightbox({ type: 'image', src: e.target.src });
			break;
		case 'VIDEO':
			openLightbox({ type: 'video', src: e.target.src });
			break;
	}

	if (e.target.classList.contains('dot')) {
		const index = parseInt(e.target.classList[1].split('-')[1]);
		goToSlide(index);
	}
});

nextSlideBtn.addEventListener('click', nextSlide);
prevSlideBtn.addEventListener('click', prevSlide);
pauseBtn.addEventListener('click', togglePause);

initSlides();
startAutoSlide();
