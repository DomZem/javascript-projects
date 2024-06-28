setInterval(() => {
	const noteList = JSON.parse(localStorage.getItem('noteList'));

	noteList.forEach((note) => {
		if (note.remindAt) {
			const remindAt = new Date(note.remindAt);
			const now = new Date();

			if (Math.abs(remindAt.getTime() - now.getTime()) < 1000) {
				alert(`Reminder: ${note.title}`);
			}
		}
	});
}, 1000);
