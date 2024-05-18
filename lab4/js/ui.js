const createNoteTags = (tags) => {
	const virtualNoteTagList = document.createDocumentFragment();

	tags.forEach((tag) => {
		const noteTag = document.createElement('li');
		noteTag.classList.add('note-tag-list-item');
		noteTag.textContent = tag;

		virtualNoteTagList.appendChild(noteTag);
	});

	return virtualNoteTagList;
};

const createNoteSubtasks = (subtasks) => {
	const virtualNoteSubtaskList = document.createDocumentFragment();

	subtasks.forEach((subtask) => {
		const noteSubtaskListItem = document.createElement('li');

		const noteSubtaskLabel = document.createElement('label');
		noteSubtaskLabel.className = 'note-subtask-label';
		const noteSubtaskCheckbox = document.createElement('input');
		noteSubtaskCheckbox.type = 'checkbox';
		noteSubtaskCheckbox.className = 'note-subtask-checkbox';
		noteSubtaskCheckbox.id = `subtask-${subtask.id}`;

		if (subtask.done) {
			noteSubtaskCheckbox.checked = true;
		}

		const noteSubtaskText = document.createElement('p');
		noteSubtaskText.textContent = subtask.title;

		noteSubtaskLabel.appendChild(noteSubtaskCheckbox);
		noteSubtaskLabel.appendChild(noteSubtaskText);

		noteSubtaskListItem.appendChild(noteSubtaskLabel);

		virtualNoteSubtaskList.appendChild(noteSubtaskListItem);
	});

	return virtualNoteSubtaskList;
};

const createNote = (note) => {
	// TODO: Make better approach
	const css = `
		.note-list-item-${note.id}:hover {
			box-shadow: 0 0 0 2px ${note.color};
			
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

	if (note.isPinned) {
		notePinOptionIcon.classList.add('active');
	}

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

	const noteInfoList = document.createElement('ul');
	noteInfoList.classList.add('note-info-list');

	const noteCreatedAt = document.createElement('li');
	noteCreatedAt.classList.add('note-info-list-item');

	const noteCreatedAtIcon = document.createElement('i');
	noteCreatedAtIcon.className = 'fa-solid fa-calendar-days';

	const noteCreatedAtText = document.createElement('span');
	noteCreatedAtText.textContent = new Date(note.createdAt).toLocaleDateString().split('/').join('.');

	noteCreatedAt.appendChild(noteCreatedAtIcon);
	noteCreatedAt.appendChild(noteCreatedAtText);

	const noteCompletedSubtasks = document.createElement('li');
	noteCompletedSubtasks.className = 'note-info-list-item note-info-subtasks-count';

	const noteCompletedSubtasksIcon = document.createElement('i');
	noteCompletedSubtasksIcon.className = 'fa-regular fa-circle-check';

	const noteCompletedSubtasksLength = note.subtasks.filter(({ done }) => done).length;

	const noteCompletedSubtasksText = document.createElement('span');
	noteCompletedSubtasksText.textContent = `${noteCompletedSubtasksLength} / ${note.subtasks.length}`;

	const noteSubtaskList = document.createElement('ul');
	noteSubtaskList.classList.add('note-list-item-subtask-list');

	noteSubtaskList.appendChild(createNoteSubtasks(note.subtasks));

	noteCompletedSubtasks.appendChild(noteCompletedSubtasksIcon);
	noteCompletedSubtasks.appendChild(noteCompletedSubtasksText);
	noteCompletedSubtasks.appendChild(noteSubtaskList);

	noteInfoList.appendChild(noteCreatedAt);
	noteInfoList.appendChild(noteCompletedSubtasks);

	if (note.remindAt !== null) {
		const noteRemindAt = document.createElement('li');
		noteRemindAt.classList.add('note-info-list-item');

		const noteRemindAtIcon = document.createElement('i');
		noteRemindAtIcon.className = 'fa-solid fa-bell';

		const noteRemindAtText = document.createElement('span');
		noteRemindAtText.textContent = formatDate(new Date(note.remindAt));

		noteRemindAt.appendChild(noteRemindAtIcon);
		noteRemindAt.appendChild(noteRemindAtText);
		noteInfoList.appendChild(noteRemindAt);
	}

	noteListItem.appendChild(noteColor);
	noteListItem.appendChild(noteHeader);

	if (note.tags.length > 0) {
		const noteTagList = document.createElement('ul');
		noteTagList.classList.add('note-tag-list');
		noteTagList.appendChild(createNoteTags(note.tags));
		noteListItem.appendChild(noteTagList);
	}

	noteListItem.appendChild(noteInfoList);

	return noteListItem;
};
