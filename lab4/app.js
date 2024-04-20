const createNoteBtn = document.querySelector('.create-note-btn');
const subtaskList = document.querySelector('.subtask-list');
const main = document.querySelector('.main');
const noteListAll = document.querySelector('.note-list-all');

// modal
const noteModal = document.querySelector('.note-modal');
const cancelNoteModalBtn = document.querySelector('.create-note-cancel-button');
const createSubtaskBtn = document.querySelector('.create-subtask-button');

// Form
const noteForm = document.querySelector('.note-form');
const noteFormHeader = document.querySelector('.note-form-header');
const noteFormInputTitle = document.querySelector('.note-form-input-title');
const noteFormInputContent = document.querySelector('.note-form-input-content');
const noteFormSelectColor = document.querySelector('.note-form-select-color');
const noteFormInputTags = document.querySelector('.note-form-input-tags');

// Filters
const noteFilters = document.querySelector('.note-filters');

const createNote = (note) => {
	const css = `
		.note-list-item-${note.id}:hover {
			box-shadow: 0 0 0 2px ${note.color};
			scale: 1.02;
		}
	`;
	const style = document.createElement('style');
	style.appendChild(document.createTextNode(css));

	const noteListItem = document.createElement('li');
	noteListItem.classList.add('note-list-item');
	noteListItem.classList.add(`note-list-item-${note.id}`);

	noteListItem.id = note.id;
	noteListItem.appendChild(style);

	const noteColor = document.createElement('div');
	noteColor.classList.add('note-color');
	noteColor.style.backgroundColor = note.color;

	const noteHeader = document.createElement('header');
	noteHeader.classList.add('note-header');

	const noteTitle = document.createElement('h4');
	noteTitle.classList.add('note-title');
	noteTitle.textContent = note.title;

	const noteOptions = document.createElement('ul');
	noteOptions.classList.add('note-options');

	const noteCheckOption = document.createElement('li');
	noteCheckOption.classList.add('note-option');

	const notePinOption = document.createElement('li');
	notePinOption.classList.add('note-option');

	const notePinOptionIcon = document.createElement('i');
	notePinOptionIcon.className = 'note-icon note-pin fa-solid fa-thumbtack';
	notePinOption.appendChild(notePinOptionIcon);

	const noteEditOption = document.createElement('li');
	noteEditOption.classList.add('note-option');

	const noteEditOptionIcon = document.createElement('i');
	noteEditOptionIcon.className = 'note-icon note-edit fa-solid fa-pen';
	noteEditOption.appendChild(noteEditOptionIcon);

	const noteRemoveOption = document.createElement('li');
	noteRemoveOption.classList.add('note-option');

	const noteRemoveOptionIcon = document.createElement('i');
	noteRemoveOptionIcon.className = 'note-icon note-remove fa-solid fa-trash';
	noteRemoveOption.appendChild(noteRemoveOptionIcon);

	noteOptions.appendChild(notePinOption);
	noteOptions.appendChild(noteEditOption);
	noteOptions.appendChild(noteRemoveOption);

	noteHeader.appendChild(noteTitle);
	noteHeader.appendChild(noteOptions);

	const noteTagList = document.createElement('ul');
	noteTagList.classList.add('note-tag-list');

	const virtualNoteTagList = document.createDocumentFragment();

	note.tags.forEach((tag) => {
		const noteTag = document.createElement('li');
		noteTag.classList.add('note-tag-list-item');
		noteTag.textContent = tag;

		virtualNoteTagList.appendChild(noteTag);
	});

	noteTagList.appendChild(virtualNoteTagList);

	const noteInfoList = document.createElement('ul');
	noteInfoList.classList.add('note-info-list');

	const noteCreatedAt = document.createElement('li');
	noteCreatedAt.classList.add('note-info-list-item');

	const noteCreatedAtIcon = document.createElement('i');
	noteCreatedAtIcon.className = 'fa-solid fa-calendar-days';

	const noteCreatedAtText = document.createElement('span');
	noteCreatedAtText.textContent = note.createdAt.toLocaleString().split(',')[0];

	noteCreatedAt.appendChild(noteCreatedAtIcon);
	noteCreatedAt.appendChild(noteCreatedAtText);

	const noteCompletedSubtasks = document.createElement('li');
	noteCompletedSubtasks.className = 'note-info-list-item note-info-subtasks-count';

	const noteCompletedSubtasksIcon = document.createElement('i');
	noteCompletedSubtasksIcon.className = 'fa-regular fa-circle-check';

	const noteCompletedSubtasksText = document.createElement('span');
	noteCompletedSubtasksText.textContent = `0 / ${note.subtasks.length}`;

	const noteSubtaskList = document.createElement('ul');
	noteSubtaskList.classList.add('note-list-item-subtask-list');

	const virtualNoteSubtaskList = document.createDocumentFragment();

	note.subtasks.forEach((subtask) => {
		const noteSubtaskListItem = document.createElement('li');

		const noteSubtaskLabel = document.createElement('label');
		noteSubtaskLabel.className = 'note-subtask-label';
		const noteSubtaskCheckbox = document.createElement('input');
		noteSubtaskCheckbox.type = 'checkbox';
		noteSubtaskCheckbox.className = 'note-subtask-checkbox';
		noteSubtaskCheckbox.id = `subtask-${subtask.id}`;

		const noteSubtaskText = document.createElement('p');
		noteSubtaskText.textContent = subtask.title;

		noteSubtaskLabel.appendChild(noteSubtaskCheckbox);
		noteSubtaskLabel.appendChild(noteSubtaskText);

		noteSubtaskListItem.appendChild(noteSubtaskLabel);

		virtualNoteSubtaskList.appendChild(noteSubtaskListItem);
	});

	noteSubtaskList.appendChild(virtualNoteSubtaskList);

	noteCompletedSubtasks.appendChild(noteCompletedSubtasksIcon);
	noteCompletedSubtasks.appendChild(noteCompletedSubtasksText);
	noteCompletedSubtasks.appendChild(noteSubtaskList);

	noteInfoList.appendChild(noteCreatedAt);
	noteInfoList.appendChild(noteCompletedSubtasks);

	noteListItem.appendChild(noteColor);
	noteListItem.appendChild(noteHeader);
	noteListItem.appendChild(noteTagList);
	noteListItem.appendChild(noteInfoList);

	return noteListItem;
};

let isCreatingNote = false;
let editNoteId = null;

// Check if noteList exists in local storage
if (!localStorage.getItem('noteList')) {
	localStorage.setItem('noteList', JSON.stringify([]));
}

// create note list
const noteList = JSON.parse(localStorage.getItem('noteList'));
noteList.forEach((note) => {
	noteListAll.appendChild(createNote(note));
});

const colors = {
	rose: '#e11d48',
	pink: '#db2777',
	fuchsia: '#c026d3',
	purple: '#9333ea',
	violet: '#7c3aed',
	indigo: '#4f46e5',
	blue: '#2563eb',
	sky: '#0284c7',
	cyan: '#0891b2',
	teal: '#0d9488',
	emerald: '#059669',
	red: '#dc2626',
	orange: '#ea580c',
	amber: '#d97706',
	yellow: '#ca8a04',
};

for (const color in colors) {
	const option = document.createElement('option');
	option.value = colors[color];
	option.textContent = color;
	noteFormSelectColor.appendChild(option);
}

createNoteBtn.addEventListener('click', () => {
	noteFormHeader.textContent = 'Create note';
	noteModal.showModal();
});

cancelNoteModalBtn.addEventListener('click', () => {
	noteFormInputTitle.value = '';
	noteFormInputContent.value = '';
	noteFormSelectColor.value = '';
	noteFormInputTags.value = '';
	subtaskList.innerHTML = '';

	noteModal.close();
	editNoteId = null;
});

createSubtaskBtn.addEventListener('click', () => {
	createSubtask();
});

const createSubtask = (value = '') => {
	const subtaskListItemLength = document.querySelectorAll('.subtask-list-item').length;
	const subtaskListItemId = subtaskListItemLength + 1;

	const subtaskListItem = document.createElement('li');
	subtaskListItem.classList.add('subtask-list-item');

	const subtaskListItemInput = document.createElement('input');
	subtaskListItemInput.classList.add('input');
	subtaskListItemInput.placeholder = 'Subtask title';
	subtaskListItemInput.name = `subtask-${subtaskListItemId}`;
	subtaskListItemInput.value = value;
	subtaskListItemInput.id = `subtask-${subtaskListItemId}`;

	const subtaskListItemRemoveBtn = document.createElement('button');
	subtaskListItemRemoveBtn.className = 'button button-destructive';
	subtaskListItemRemoveBtn.textContent = 'remove';
	subtaskListItemRemoveBtn.type = 'button';

	subtaskListItem.appendChild(subtaskListItemInput);
	subtaskListItem.appendChild(subtaskListItemRemoveBtn);

	const subtaskList = document.querySelector('.subtask-list');
	subtaskList.appendChild(subtaskListItem);
};

subtaskList.addEventListener('click', (e) => {
	if (e.target.classList.contains('button-destructive')) {
		const subtaskListItem = e.target.parentElement;
		subtaskListItem.remove();
	}
});

noteForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const noteList = JSON.parse(localStorage.getItem('noteList'));
	const subtaskInputs = e.target.querySelectorAll('.subtask-list-item input');
	const subtasks = [];

	if (!editNoteId) {
		subtaskInputs.forEach((subtaskInput, index) => {
			const subtask = {
				id: index + 1,
				title: subtaskInput.value,
				done: false,
			};

			subtasks.push(subtask);
		});

		const note = {
			id: noteList.length + 1,
			createdAt: new Date(),
			title: noteFormInputTitle.value,
			isPinned: false,
			reminderDate: null,
			content: noteFormInputContent.value,
			color: noteFormSelectColor.value,
			tags: noteFormInputTags.value.split(','),
			subtasks,
		};

		// Save note to local storage
		localStorage.setItem('noteList', JSON.stringify([...noteList, note]));
		noteListAll.appendChild(createNote(note));
		alert('Note created!');

		noteFormInputTitle.value = '';
		noteFormInputContent.value = '';
		noteFormSelectColor.value = '';
		noteFormInputTags.value = '';
		subtaskList.innerHTML = '';
	} else {
		const note = noteList.find((note) => note.id === editNoteId);

		note.title = noteFormInputTitle.value;
		note.content = noteFormInputContent.value;
		note.color = noteFormSelectColor.value;
		note.tags = noteFormInputTags.value.split(',');

		// Save note to local storage
		localStorage.setItem('noteList', JSON.stringify(noteList));
		alert('Note updated!');

		// find element in noteListAll and update it
		const noteListItem = document.querySelector(`.note-list-item-${editNoteId}`);
		noteListItem.querySelector('.note-title').textContent = note.title;
		noteListItem.querySelector('.note-color').style.backgroundColor = note.color;
		noteListItem.querySelector('.note-tag-list').innerHTML = note.tags;
	}
});

main.addEventListener('click', (e) => {
	const element = e.target;
	const noteOption = element.parentElement;
	const noteOptions = noteOption.parentElement;
	const noteHeader = noteOptions.parentElement;
	const noteListItem = noteHeader.parentElement;

	if (element.classList.contains('note-remove')) {
		noteListItem.remove();

		// Remove note from local storage
		const noteList = JSON.parse(localStorage.getItem('noteList'));
		localStorage.setItem('noteList', JSON.stringify(noteList.filter((note) => note.id !== parseInt(noteListItem.id))));
	}

	if (element.classList.contains('note-edit')) {
		const noteId = noteListItem.id;

		const note = noteList.find((note) => note.id === parseInt(noteId));
		editNoteId = note.id;

		noteFormHeader.textContent = 'Edit note';
		noteFormInputTitle.value = note.title;
		noteFormInputContent.value = note.content;
		noteFormSelectColor.value = note.color;
		noteFormInputTags.value = note.tags.join(',');

		note.subtasks.forEach(({ title }) => {
			createSubtask(title);
		});

		noteModal.showModal();
	}

	if (element.classList.contains('note-pin')) {
		const noteId = noteListItem.id;

		// TODO: After create note, we can't pin it
		const note = noteList.find((note) => note.id === parseInt(noteId));
		note.isPinned = !note.isPinned;

		localStorage.setItem('noteList', JSON.stringify(noteList));

		// Update UI
		const notePin = noteListItem.querySelector('.note-pin');
		notePin.classList.toggle('active');
	}

	// Dispaly subtask list for note
	if (element.classList.contains('note-info-list-item')) {
		const noteSubtaskList = element.querySelector('.note-list-item-subtask-list');
		noteSubtaskList.classList.toggle('active');
	}

	if (element.classList.contains('note-subtask-checkbox')) {
		const noteId = parseInt(element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id, 10);

		const note = noteList.find((note) => note.id === noteId);
		const subtaskId = parseInt(element.id.split('-')[1], 10);

		const subtask = note.subtasks.find((subtask) => subtask.id === subtaskId);
		subtask.done = element.checked;

		console.log(subtask);
	}
});

noteFilters.addEventListener('input', (e) => {
	const noteList = JSON.parse(localStorage.getItem('noteList'));
	const input = e.target;

	const noteTitle = input.id === 'note-filter-input-title' ? input.value : '';
	const noteDate = input.id === 'note-filter-input-date' ? input.value : '';
	const noteTags = input.id === 'note-filter-input-tags' ? input.value.split(', ') : '';

	const filteredNotes = noteList.filter((note) => {
		const title = note.title.toLowerCase().includes(noteTitle.toLowerCase());
		const date = note.createdAt.toLocaleString().split(',')[0].includes(noteDate);
		// const tags = note.tags.some((tag) => noteTags.includes(tag));

		return title && date;
	});

	// Update UI
	const virtualNoteList = document.createDocumentFragment();
	noteListAll.innerHTML = '';

	filteredNotes.forEach((note) => {
		virtualNoteList.appendChild(createNote(note));
	});

	noteListAll.appendChild(virtualNoteList);
});
