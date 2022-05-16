import {useCurrentFrame, useVideoConfig} from 'remotion';
import { useEffect, useState } from 'react';


export const Lyrics = ({song,cover}) => {
	const frame = useCurrentFrame();
	const [text, setText] = useState('');
	// get current time from video
	const videoConfig = useVideoConfig();
	const currentTime = parseInt(frame / videoConfig.fps) * 1000;

	// get current text from lyrics
	useEffect(() => {
		const currentLine = song.lyrics.filter(lyric =>  currentTime >= lyric.startTime && currentTime <= lyric.endTime);
		let currentText = currentLine[0]?.text?.length > 0 ? currentLine[0].text : '[Music]';
		setText(currentText);
	}, [currentTime]);

	return (
		<div className='container' >
			<div className='song-meta' >

			<img src={cover} className='cover' alt='logo' />
			<h2 className='text' >{`${song.artist} `} <br/><br/>{`${song.name}` }</h2>
			</div>
			<div className='lyrics-container' >
			<p className='text' >{text}</p>

			</div>
		</div>
	);
};
