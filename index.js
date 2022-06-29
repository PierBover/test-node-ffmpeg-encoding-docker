import {spawn} from 'child_process';
import fs from 'fs';
import Fastify from 'fastify';

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

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

async function encodeTestAudio () {
	if (fs.existsSync('test.mp3')) fs.unlinkSync('test.mp3');
	await encodeMp3('test.wav', 'test.mp3');
}

const fastify = Fastify({logger: true});

fastify.get('/encode', async function (request, reply) {
	const start = new Date();
	console.log('start time', start);

	await encodeTestAudio();

	const end = new Date();
	console.log('end time', end);
	const totalTime = (end.getTime() - start.getTime()) / 1000;
	console.log('total time', totalTime, 'seconds');

	reply.send({
		startTime: start,
		endTime: end,
		totalTimeSeconds: totalTime
	});
})

fastify.listen({port, host}, function (err, address) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});