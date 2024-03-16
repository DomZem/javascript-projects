const nextSlideBtn = document.querySelector('.next-slide-btn');
const prevSlideBtn = document.querySelector('.prev-slide-btn');
const slider = document.querySelector('.slider');
const dotsContainer = document.querySelector('.dots');

const images = [
	'https://cdn.pixabay.com/photo/2023/06/10/15/40/berlin-8054311_1280.jpg',
	'https://cdn.pixabay.com/photo/2024/01/30/14/02/road-8542123_960_720.jpg',
	'https://cdn.pixabay.com/photo/2024/02/24/10/31/norway-8593725_960_720.jpg',
];

images.forEach((image, i) => {
	const img = document.createElement('img');
	img.src = image;

	const dot = document.createElement('span');
	dot.classList.add('dot');
	dotsContainer.appendChild(dot);

	if (i !== 0) {
		img.classList.add('hidden');
	}

	slider.appendChild(img);
});

let currentSlide = 0;

nextSlideBtn.addEventListener('click', () => {
	const slides = slider.querySelectorAll('img');

	slides[currentSlide].classList.add('animation');
	slides[currentSlide].classList.add('hidden');

	currentSlide = (currentSlide + 1) % slides.length;
	slides[currentSlide].classList.remove('hidden');

	makeDotActive();
});

prevSlideBtn.addEventListener('click', () => {
	const slides = slider.querySelectorAll('img');

	slides[currentSlide].classList.add('hidden');
	currentSlide = (currentSlide - 1 + slides.length) % slides.length;
	slides[currentSlide].classList.remove('hidden');

	makeDotActive();
});

const makeDotActive = () => {
	const dots = document.querySelectorAll('.dot');

	dots.forEach((dot, i) => {
		if (i === currentSlide) {
			dot.classList.add('active');
		} else {
			dot.classList.remove('active');
		}
	});
};
