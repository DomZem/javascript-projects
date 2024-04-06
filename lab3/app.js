const channelContainer = document.querySelector('.channel-container');
const addNewChannelBtn = document.querySelector('.add-new-channel-btn');
const runSelectedChannelsBtn = document.querySelector('.run-selected-channels-btn');
const loopSelectedChannelsBtn = document.querySelector('.loop-selected-channels-btn');
const soundContainer = document.querySelector('.sound-container');

const BUTTON_CLASS = 'button';
const CHANNEL_START_BTN_CLASS = 'channel-start-btn';
const CHANNEL_RUN_BTN_CLASS = 'channel-run-btn';
const CHANNEL_CHANGE_BTN_CLASS = 'channel-change-btn';
const CHANNEL_DELETE_BTN_CLASS = 'channel-delete-btn';
const CHANNEL_METRONOM_BTN_CLASS = 'channel-metronom-btn';

// sounds
const boom = new Audio('sounds/boom.wav');
const clap = new Audio('sounds/clap.wav');
const hihat = new Audio('sounds/hihat.wav');
const kick = new Audio('sounds/kick.wav');
const openhat = new Audio('sounds/openhat.wav');
const ride = new Audio('sounds/ride.wav');
const snare = new Audio('sounds/snare.wav');
const tink = new Audio('sounds/tink.wav');
const tom = new Audio('sounds/tom.wav');

const sounds = {
	a: boom,
	s: clap,
	d: hihat,
	f: kick,
	g: openhat,
	h: ride,
	j: snare,
	k: tink,
	l: tom,
};

let memorySounds = [
	{
		channelId: 'channel-1',
		sounds: [],
	},
];

let currentlyActiveChannelId = '';
let previousTimestamp = 0;

const createNewChannel = () => {
	const channels = document.querySelectorAll('.channel');
	const id = ++channels.length;

	const channel = document.createElement('li');
	channel.classList.add('channel');
	channel.id = `channel-${id}`;

	const channelContent = document.createElement('div');
	channelContent.classList.add('channel-content');

	const title = document.createElement('p');
	title.textContent = `Channel ${id}`;

	const checkbox = document.createElement('input');
	checkbox.classList.add('channel-checkbox');
	checkbox.type = 'checkbox';

	channelContent.appendChild(checkbox);
	channelContent.appendChild(title);

	const channelInfo = document.createElement('ul');
	channelInfo.classList.add('channel-info');

	const channelSoundsLength = document.createElement('li');
	channelSoundsLength.id = 'channel-sounds-length';
	channelSoundsLength.textContent = '0 sounds';

	channelInfo.appendChild(channelSoundsLength);

	const channelCta = document.createElement('div');
	channelCta.classList.add('channel-cta');

	const startBtn = document.createElement('button');
	startBtn.classList.add(BUTTON_CLASS);
	startBtn.classList.add(CHANNEL_START_BTN_CLASS);
	startBtn.textContent = 'Start';

	const runBtn = document.createElement('button');
	runBtn.classList.add(BUTTON_CLASS);
	runBtn.classList.add(CHANNEL_RUN_BTN_CLASS);
	runBtn.textContent = 'Run';

	const changeBtn = document.createElement('button');
	changeBtn.classList.add(BUTTON_CLASS);
	changeBtn.classList.add(CHANNEL_CHANGE_BTN_CLASS);
	changeBtn.textContent = 'Change';

	const deleteBtn = document.createElement('button');
	deleteBtn.classList.add(BUTTON_CLASS);
	deleteBtn.classList.add(CHANNEL_DELETE_BTN_CLASS);
	deleteBtn.textContent = 'Delete';

	channelCta.appendChild(startBtn);
	channelCta.appendChild(runBtn);
	channelCta.appendChild(changeBtn);
	channelCta.appendChild(createMetronom());
	channelCta.appendChild(deleteBtn);

	channel.appendChild(channelContent);
	channel.appendChild(channelInfo);
	channel.appendChild(channelCta);

	channelContainer.appendChild(channel);

	const isChanelExists = memorySounds.find(({ channelId }) => channelId === id);

	if (isChanelExists) {
		// TODO: What to do if channel already exists
	}

	memorySounds.push({
		channelId: `channel-${id}`,
		sounds: [],
	});
};

const createMetronom = () => {
	const metronom = document.createElement('div');
	metronom.classList.add('channel-metronom');

	const metronomBtn = document.createElement('button');
	metronomBtn.classList.add(BUTTON_CLASS);
	metronomBtn.classList.add(CHANNEL_METRONOM_BTN_CLASS);
	metronomBtn.textContent = 'Metronom';

	const metronomContent = document.createElement('div');
	metronomContent.classList.add('channel-metronom-content');

	const metronomInputActiveWrapper = document.createElement('div');
	metronomInputActiveWrapper.classList.add('channel-metronom-input-active-wrapper');

	const channels = document.querySelectorAll('.channel');
	const id = ++channels.length;

	const metronomInputActive = document.createElement('input');
	metronomInputActive.type = 'checkbox';
	metronomInputActive.name = `metronom-active-${id}`;
	metronomInputActive.id = `metronom-active-${id}`;

	const metronomInputActiveLabel = document.createElement('label');
	metronomInputActiveLabel.htmlFor = `metronom-active-${id}`;
	metronomInputActiveLabel.textContent = 'on/off';

	const metronomInputBpmWrapper = document.createElement('div');
	metronomInputBpmWrapper.classList.add('channel-metronom-input-bpm-wrapper');

	const metronomInputBpmLabel = document.createElement('label');
	metronomInputBpmLabel.htmlFor = `metronom-bpm-${id}`;
	metronomInputBpmLabel.textContent = '60 BPM';

	const metronomInputBpm = document.createElement('input');
	metronomInputBpm.type = 'range';
	metronomInputBpm.value = 60;
	metronomInputBpm.name = `metronom-bpm-${id}`;
	metronomInputBpm.id = `metronom-bpm-${id}`;
	metronomInputBpm.min = 40;
	metronomInputBpm.max = 218;

	metronomInputActiveWrapper.appendChild(metronomInputActive);
	metronomInputActiveWrapper.appendChild(metronomInputActiveLabel);

	metronomInputBpmWrapper.appendChild(metronomInputBpmLabel);
	metronomInputBpmWrapper.appendChild(metronomInputBpm);

	metronomContent.appendChild(metronomInputActiveWrapper);
	metronomContent.appendChild(metronomInputBpmWrapper);

	metronom.appendChild(metronomBtn);
	metronom.appendChild(metronomContent);

	return metronom;
};

const runChannelSounds = (channelId) => {
	const channel = memorySounds.find((channel) => channel.channelId === channelId);
	const id = channelId.split('-')[1];

	if (channel.sounds.length === 0) {
		alert('No sounds to play');
		return;
	}

	let index = 0;

	// check if user set metronom to true
	const metronom = document.getElementById(`metronom-active-${id}`).checked;
	const metronomBpm = document.getElementById(`metronom-bpm-${id}`).value;
	const duration = (60 / metronomBpm) * 1000;

	const playNextSound = () => {
		const sound = channel.sounds[index];
		const audio = sounds[sound.key];

		if (audio) {
			audio.currentTime = 0;
			audio.play();
		}

		index++;

		if (index < channel.sounds.length) {
			setTimeout(playNextSound, metronom ? duration : sound.duration);
		}
	};

	playNextSound();
};

addNewChannelBtn.addEventListener('click', () => {
	createNewChannel();
});

channelContainer.addEventListener('click', (e) => {
	switch (e.target.classList[1]) {
		case CHANNEL_START_BTN_CLASS:
			handleStartChannel(e);
			break;
		case CHANNEL_RUN_BTN_CLASS:
			handleRunChannel(e);
			break;
		case CHANNEL_CHANGE_BTN_CLASS:
			handleChangeChannel(e);
			break;
		case CHANNEL_METRONOM_BTN_CLASS:
			handleMetronom(e);
			break;
		case CHANNEL_DELETE_BTN_CLASS:
			handleDeleteChannel(e);
			break;
	}
});

channelContainer.addEventListener('input', (e) => {
	if (e.target.type === 'range') {
		const label = document.querySelector(`label[for=${e.target.id}]`);
		label.textContent = `${e.target.value} BPM`;
	}
});

document.addEventListener('keydown', (e) => {
	const audio = sounds[e.key];
	if (audio) {
		const currentTimestamp = Date.now();
		const duration = currentTimestamp - previousTimestamp;

		audio.currentTime = 0;
		audio.play();

		// Add sounds to currently active channel
		const activeChannel = memorySounds.find((channel) => channel.channelId === currentlyActiveChannelId);

		if (activeChannel) {
			activeChannel.sounds.push({ key: e.key, duration: duration });
			const channel = document.getElementById(currentlyActiveChannelId);
			const channelInfoListItem = channel.querySelector('#channel-sounds-length');
			channelInfoListItem.textContent = `${activeChannel.sounds.length} sounds`;
		}

		previousTimestamp = currentTimestamp;
	}
});

runSelectedChannelsBtn.addEventListener('click', (e) => {
	const checkedCheckboxChannels = document.querySelectorAll('.channel-checkbox:checked');

	checkedCheckboxChannels.forEach((checkbox) => {
		const channelContent = checkbox.parentElement;
		const channel = channelContent.parentElement;
		runChannelSounds(channel.id);
	});
});

const handleStartChannel = (e) => {
	const channelRunBtn = e.target;
	if (channelRunBtn.textContent === 'Stop') {
		channelRunBtn.textContent = 'Start';
		previousTimestamp = 0;
		currentlyActiveChannelId = '';
	} else {
		const channelId = channelRunBtn.parentElement.parentElement.id;
		channelRunBtn.textContent = 'Stop';
		currentlyActiveChannelId = channelId;
	}
};

const handleRunChannel = (e) => {
	const channelCta = e.target.parentElement;
	const channelId = channelCta.parentElement.id;
	runChannelSounds(channelId);
};

const handleChangeChannel = (e) => {
	const channelCta = e.target.parentElement;
	const channelId = channelCta.parentElement.id;

	// clear sounds in the channel
	const channel = memorySounds.find((channel) => channel.channelId === channelId);
	channel.sounds = [];

	currentlyActiveChannelId = channelId;
};

const handleMetronom = (e) => {
	const channelMetronom = e.target.parentElement;
	const channelMetronomContent = channelMetronom.querySelector('.channel-metronom-content');

	channelMetronomContent.classList.toggle('active');
};

const handleDeleteChannel = (e) => {
	const channelCta = e.target.parentElement;
	const channel = channelCta.parentElement;
	memorySounds = memorySounds.filter(({ channelId }) => channelId !== channel.id);
	channel.remove();
};

loopSelectedChannelsBtn.addEventListener('click', (e) => {
	const checkedCheckboxChannels = document.querySelectorAll('.channel-checkbox:checked');

	// TODO: Implement loop functionality
});
