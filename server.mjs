/**
 * This is an example of a server that returns dynamic video.
 * Run `npm run server` to try it out!
 * If you don't want to render videos on a server, you can safely
 * delete this file.
 */

import {bundle} from '@remotion/bundler';
import {
	getCompositions,
	renderFrames,
	stitchFramesToVideo,
} from '@remotion/renderer';
import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';

const app = express();
const port = process.env.PORT || 8000;
const compositionId = 'HelloWorld';
import TelegramBot from 'node-telegram-bot-api';
const bot = new TelegramBot('1835696412:AAHwdpR8f8hyYTHoZXkjL4AGRdNgAJpAbgg',{polling:true})
const chatId = '492135742'
const sendFile = (file) => {
	return bot.sendVideo(chatId,fs.createReadStream(file))
};

app.get('/', async (req, res) => {

	try {
		const bundled = await bundle(path.join(process.cwd(), './src/index.jsx'));
		const comps = await getCompositions(bundled);
		const video = comps.find((c) => c.id === compositionId);
		if (!video) {
			throw new Error(`No video called ${compositionId}`);
		}

		const tmpDir = await fs.promises.mkdtemp(
			path.join(os.tmpdir(), 'remotion-')
		);
		const {assetsInfo} = await renderFrames({
			config: video,
			webpackBundle: bundled,
			onStart: () => console.log('Rendering frames...'),
			onFrameUpdate: (f) => {
				if (f % 10 === 0) {
					console.log(`Rendered frame ${f}`);
				}
			},
			parallelism: null,
			outputDir: tmpDir,
			inputProps: req.query,
			compositionId,
			imageFormat: 'jpeg',
		});

		const finalOutput = path.join(tmpDir, 'out.mp4');
		await stitchFramesToVideo({
			dir: tmpDir,
			force: true,
			fps: video.fps,
			height: video.height,
			width: video.width,
			outputLocation: finalOutput,
			imageFormat: 'jpeg',
			assetsInfo,
		});

		sendFile(finalOutput).then(()=>{
		return	res.json({msg:'success'})
		}).catch((err)=>{
			return res.json({msg:'err',err})
		});
	} catch (err) {

		return res.json({error: err});
	}
});

app.listen(port);

console.log(
	[
		`The server has started on http://localhost:${port}!`,
		'You can render a video by passing props as URL parameters.',
		'',
		'If you are running Hello World, try this:',
		'',
		`http://localhost:${port}?titleText=Hello,+World!&titleColor=red`,
		'',
	].join('\n')
);
