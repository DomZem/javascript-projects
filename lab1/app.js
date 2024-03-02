const calculateBtn = document.querySelector('.calculate-btn');
const addNewInputBtn = document.querySelector('.add-new-input-btn');

// Output
const sumValue = document.querySelector('.sum-value');
const avgValue = document.querySelector('.avg-value');
const minValue = document.querySelector('.min-value');
const maxValue = document.querySelector('.max-value');

const inputContainer = document.querySelector('.inputs-container');

const calculate = () => {
    const inputs = document.querySelectorAll('.input');
    const values = [];

    inputs.forEach((input) => {
        values.push(parseInt(input.value) || 0);
    });

    const sum = values.reduce((acc, value) => acc += value, 0);

    sumValue.textContent = sum;
    avgValue.textContent = Math.floor(sum / values.length);
    minValue.textContent = Math.min(...values);
    maxValue.textContent = Math.max(...values);
};

addNewInputBtn.addEventListener('click', () => {
    // create new list item 
    const newListItem = document.createElement('li');
    const newInput = document.createElement('input');
    const newRemoveInputBtn = document.createElement('button');
    newRemoveInputBtn.textContent = "x";
    
    newInput.className = "input";
    newListItem.appendChild(newInput);
    newListItem.appendChild(newRemoveInputBtn);

    // add new input to list container
    inputContainer.appendChild(newListItem);
});

calculateBtn.addEventListener('click', () => {
    calculate();
});

inputContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const listItem = event.target.parentElement;
        inputContainer.removeChild(listItem);
        
        // after remove some input calculate results once again
        calculate();
    }
});

inputContainer.addEventListener('change', (event) => {
    if (event.target.classList.contains('input')) {
        calculate();
    }
})
