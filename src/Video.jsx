import {Composition,getInputProps} from 'remotion';
import {HelloWorld} from './HelloWorld';

const inputProps = getInputProps();
export const RemotionVideo = () => {
	
	return (
		<>
			<Composition
				id="HelloWorld"
				component={HelloWorld}
				durationInFrames={parseInt(inputProps?.frames ?? 180) }
				fps={30}
				height={1920}
				width={1080}
				defaultProps={{
						name:'guren',
				}}
			/>
		</>
	);
};
