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
const noteFormInputRemindAt = document.querySelector('.note-form-input-remind-at');

// Filters
const noteFilters = document.querySelector('.note-filters');

let isCreatingNote = false;
let editNoteId = null;

// Check if noteList exists in local storage
if (!localStorage.getItem('noteList')) {
	localStorage.setItem('noteList', JSON.stringify([]));
}

// create note list
const noteList = JSON.parse(localStorage.getItem('noteList'));
const virtualNoteList = document.createDocumentFragment();

noteList.forEach((note) => {
	virtualNoteList.appendChild(createNote(note));
});

noteListAll.appendChild(virtualNoteList);

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
			content: noteFormInputContent.value,
			color: noteFormSelectColor.value,
			remindAt: noteFormInputRemindAt.value.length > 0 ? new Date(noteFormInputRemindAt.value) : null,
			tags: noteFormInputTags.value
				.split(', ')
				.map((tag) => tag.trim())
				.filter((tag) => tag !== ''),
			subtasks,
		};

		// Save note to local storage
		localStorage.setItem('noteList', JSON.stringify([...noteList, note]));
		noteListAll.appendChild(createNote(note));
		alert('Note created!');

		noteFormInputTitle.value = '';
		noteFormInputContent.value = '';
		noteFormSelectColor.value = '';
		noteFormInputRemindAt.value = '';
		noteFormInputTags.value = '';
		subtaskList.innerHTML = '';
		createSubtask();
	} else {
		const note = noteList.find((note) => note.id === editNoteId);

		note.title = noteFormInputTitle.value;
		note.content = noteFormInputContent.value;
		note.color = noteFormSelectColor.value;
		note.remindAt = noteFormInputRemindAt.value;
		note.tags = noteFormInputTags.value.split(',');

		// Save note to local storage
		localStorage.setItem('noteList', JSON.stringify(noteList));
		alert('Note updated!');

		// find element in noteListAll and update it
		const noteListItem = document.querySelector(`.note-list-item-${editNoteId}`);
		noteListItem.querySelector('.note-title').textContent = note.title;
		noteListItem.querySelector('.note-color').style.backgroundColor = note.color;
		noteListItem.querySelector('.note-tag-list').innerHTML = '';
		noteListItem.querySelector('.note-tag-list').appendChild(createNoteTags(note.tags));
	}
});

main.addEventListener('click', (e) => {
	const element = e.target;
	const noteOption = element.parentElement;
	const noteOptions = noteOption.parentElement;
	const noteHeader = noteOptions.parentElement;
	const noteListItem = noteHeader.parentElement;

	if (element.classList.contains('note-remove')) {
		handleRemoveNote(noteListItem);
	}

	if (element.classList.contains('note-edit')) {
		handleEditNote(noteListItem);
	}

	if (element.classList.contains('note-pin')) {
		handlePinNote(noteListItem);
	}

	// Dispaly subtask list for note
	if (element.classList.contains('note-info-list-item')) {
		const noteSubtaskList = element.querySelector('.note-list-item-subtask-list');
		noteSubtaskList.classList.toggle('active');
	}

	if (element.classList.contains('note-subtask-checkbox')) {
		handleToggleSubtask(element);
	}
});

noteFilters.addEventListener('input', (e) => {
	const noteList = JSON.parse(localStorage.getItem('noteList'));
	const input = e.target;

	const noteTitle = input.id === 'note-filter-input-title' ? input.value : '';
	const noteDate = input.id === 'note-filter-input-date' ? input.value : '';
	const noteTags = input.id === 'note-filter-input-tags' ? (input.value.length > 0 ? input.value.split(',') : []) : [];
	const mappedNoteTags = noteTags.map((tag) => tag.trim()).filter((tag) => tag !== '');

	const filteredNotes = noteList.filter((note) => {
		if (noteTitle === '' && noteDate === '' && noteTags.length === 0) return true;

		const title = note.title.toLowerCase().includes(noteTitle.toLowerCase());
		const date = note.createdAt.toLocaleString().split(', ')[0].includes(noteDate);
		const tag = note.tags.some((tag) => mappedNoteTags.includes(tag));

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

const handleRemoveNote = (noteListItem) => {
	noteListItem.remove();

	const noteList = JSON.parse(localStorage.getItem('noteList'));
	localStorage.setItem('noteList', JSON.stringify(noteList.filter((note) => note.id !== parseInt(noteListItem.id))));
};

const handleEditNote = (noteListItem) => {
	const noteList = JSON.parse(localStorage.getItem('noteList'));
	const noteId = noteListItem.id;

	const note = noteList.find((note) => note.id === parseInt(noteId));
	editNoteId = note.id;

	noteFormHeader.textContent = 'Edit note';
	noteFormInputTitle.value = note.title;
	noteFormInputContent.value = note.content;
	noteFormSelectColor.value = note.color;
	noteFormInputTags.value = note.tags.join(', ');

	note.subtasks.forEach(({ title }) => {
		createSubtask(title);
	});

	noteModal.showModal();
};

const handlePinNote = (noteListItem) => {
	const noteList = JSON.parse(localStorage.getItem('noteList'));
	const noteId = noteListItem.id;

	const note = noteList.find((note) => note.id === parseInt(noteId));
	note.isPinned = !note.isPinned;

	localStorage.setItem('noteList', JSON.stringify(noteList));

	// Update UI
	const notePin = noteListItem.querySelector('.note-pin');
	notePin.classList.toggle('active');
};

const handleToggleSubtask = (element) => {
	const noteList = JSON.parse(localStorage.getItem('noteList'));

	const noteListItem = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
	const noteId = parseInt(noteListItem.id, 10);

	const note = noteList.find((note) => note.id == noteId);
	const subtaskId = parseInt(element.id.split('-')[1], 10);

	const subtask = note.subtasks.find((subtask) => subtask.id === subtaskId);
	subtask.done = element.checked;

	localStorage.setItem('noteList', JSON.stringify(noteList));

	// update ui
	const noteInfoSubtasksCount = noteListItem.querySelector('.note-info-subtasks-count span');
	noteInfoSubtasksCount.textContent = `${note.subtasks.filter((subtask) => subtask.done).length} / ${note.subtasks.length}`;
};
