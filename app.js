const express = require('express');
const app = express();
const client = require('discord-rich-presence')('437773390363754497');
const argv = require('minimist')(process.argv.slice(2));

app.use(express.json());

app.post("/", (request, response) => {
	let body = request.body;
	let timestamp = request.headers['drp-start-timestamp'];

	let presence = {
		state: body.state.substring(0, 128),
		details: body.details.substring(0, 128),
		largeImageKey: 'logo',
		largeImageText: 'Everybody Edits',
		instance: true
	};

	if (timestamp != -1 && !argv._.includes('no-timestamp')) {
		presence.startTimestamp = Math.round(parseInt(timestamp) / 1000);
	}

	if (!presence.details)
		return;

	client.updatePresence(presence);
	response.sendStatus(200);
});

app.listen(3000, () => console.log('Everybody Edits Discord Presence is ready.'))
