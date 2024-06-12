const getRandomInt = (min, max) => {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);

	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};

const getRandomArbitrary = (min, max) => {
	return Math.random() * (max - min) + min;
};
