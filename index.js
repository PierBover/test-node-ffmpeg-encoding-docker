import {spawn} from 'child_process';

async function encodeMp3 (originPath, targetPath) {
	try {
		const params = ['-y', '-i', originPath, '-c:a', 'libmp3lame', '-b:a', '192k', '-ar', '44100', '-loglevel', 'error', targetPath];
		await spawnAsync('ffmpeg', params);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

function spawnAsync (command, params, ignoreStdError = false) {
	return new Promise((resolve, reject) => {

		const child = spawn(command, params);

		let failMessage;

		child.stdout.on('data', (data) => {
			// console.log(`stdout:\n${data}`);
		});

		if (!ignoreStdError) {
			child.stderr.on('data', async (data) => {
				const message = `${command} error: ${data}`;
				failMessage = message;
			});
		}

		child.on('error', async (error) => {
			const message = `${command} error: ${error.message}`;
			reject(message);
		});

		child.on('close', async (code) => {
			const message = `${command} FINISH`;
			if (failMessage) reject(failMessage);
			else resolve();
		});
	});
}

async function work () {
	const start = new Date();
	console.log('start time', start);

	await encodeMp3('test.wav', 'test.mp3');


	const end = new Date();
	console.log('end time', end);

	const totalTime = (end.getTime() - start.getTime()) / 1000;

	console.log('total time', totalTime, 'seconds');
}

work();
