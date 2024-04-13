//const calculateBtn = document.querySelector('.calculate-btn');
const addNewInputBtn = document.querySelector('.add-new-input-btn');

// Output
const sumValue = document.querySelector('.sum-value');
const avgValue = document.querySelector('.avg-value');
const minValue = document.querySelector('.min-value');
const maxValue = document.querySelector('.max-value');

const inputContainer = document.querySelector('.input-list');

const calculate = () => {
	const inputs = document.querySelectorAll('.input-list-item-input');
	const values = [];

	inputs.forEach((input) => {
		values.push(parseInt(input.value) || 0);
	});

	const sum = values.reduce((acc, value) => (acc += value), 0);

	sumValue.textContent = sum;
	avgValue.textContent = Math.floor(sum / values.length);
	minValue.textContent = Math.min(...values);
	maxValue.textContent = Math.max(...values);
};

addNewInputBtn.addEventListener('click', () => {
	const newListItem = document.createElement('li');
	newListItem.className = 'input-list-item';
	const newInput = document.createElement('input');
	newInput.type = 'number';
	const newRemoveInputBtn = document.createElement('button');
	newRemoveInputBtn.textContent = 'Remove';
	newRemoveInputBtn.className = 'button button-destructive';

	newInput.className = 'input-list-item-input';
	newListItem.appendChild(newInput);
	newListItem.appendChild(newRemoveInputBtn);

	inputContainer.appendChild(newListItem);
});

//calculateBtn.addEventListener('click', () => {
//calculate();
//});

inputContainer.addEventListener('click', (event) => {
	if (event.target.tagName === 'BUTTON') {
		const listItem = event.target.parentElement;
		inputContainer.removeChild(listItem);

		// after remove some input calculate results once again
		calculate();
	}
});

inputContainer.addEventListener('input', (event) => {
	if (event.target.classList.contains('input-list-item-input')) {
		calculate();
	}
});
