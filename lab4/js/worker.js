setInterval(() => {
	const noteList = JSON.parse(localStorage.getItem('noteList'));

	noteList.forEach((note) => {
		if (note.remindAt) {
			const remindAt = new Date(note.remindAt);
			const now = new Date();

			if (now > remindAt) {
				alert(`Reminder: ${note.title}`);
			}
		}
	});
}, 1000);
