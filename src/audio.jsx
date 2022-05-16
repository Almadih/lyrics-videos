import {Audio} from 'remotion';
import React from 'react';

export default function audio({song}) {
	return (
		<div>
			<Audio src={require(`./assets/music/${song}`)} />
		</div>
	);
}
