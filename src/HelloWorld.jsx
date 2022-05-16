import {interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {Lyrics} from './HelloWorld/Lyrics';
import Audio from './audio';
import './assets/index.css'
import ColorThief from '../node_modules/colorthief/dist/color-thief.mjs'
import { useEffect, useState } from 'react';
import songs from './assets/songs.json'



export const HelloWorld = ({name}) => {
	const song = songs.find(song => song.name === name);
	const [background, setBackground] = useState('linear-gradient(to right, #010102, #4a00e0)');
	const frame = useCurrentFrame();
	const videoConfig = useVideoConfig();
	const colorThief = new ColorThief();
	const image = document.createElement('img');
	image.src = require(`./assets/covers/${song.cover}`);

	useEffect(() => {
		if (image && image?.complete) {
		let colors =	colorThief.getPalette(image,3)
		//convert rgb to hex
		let hexColors = colors.map(color => {
			let hex = color.map(c => c.toString(16).padStart(2, '0')).join('');
			return `#${hex}`
		})
		setBackground(`linear-gradient(to right, ${hexColors[0]}, ${hexColors[2]})`)
	}
	}, [image])

	return (
		<div className='background' style={{backgroundImage:background}} >
				<Sequence from={0} durationInFrames={videoConfig.durationInFrames}>
					<Lyrics song={require(`./assets/lyrics/${song.lyrics}`)} cover={require(`./assets/covers/${song.cover}`)}   />
				</Sequence>
				<Audio song={song.music} />
		</div>
	);
};
