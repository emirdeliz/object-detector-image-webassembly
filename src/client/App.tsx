import React, { useCallback, useEffect, useState } from 'react';

import { detectImageInsideImage } from '../../webassembly/src/utils';

const getFileFromUrl = async (name: string) => {
	const response = await fetch(`http://localhost:3000/${name}`);
	const data = await response.blob();
	const metadata = { type: 'image/png' };
	const file = new File([data], name, metadata);
	return file;
}

const AppBase: React.FC = () => {
	let _moduleDetector;
	const [clientMessage, setClientMessage] = useState('');

	const initialize = useCallback(async () => {
		await testDetector();
	}, []);

	const testDetector = async () => {
		const fileOne = await getFileFromUrl('doctor-house.png');
		const fileTwo = await getFileFromUrl('doctor-house-tongue.png');

		setTimeout(async () => {
			console.log(await detectImageInsideImage(fileOne, fileTwo));
		}, 3000);
	}

	useEffect(() => {
		setClientMessage('Hello From React');
		initialize();
	}, []);

	const style = {
		border: 'solid 3px red',
		position: 'absolute',
		width: '50px',
		height: '117px',
		top: `${452}px`,
		left: `${271}px`
	};

	// 13/01 no valor de 382.49BRL

	return (
		<>
			<h1>Hello World!</h1>
			<h2>{clientMessage}</h2>
			<div style={{ position: 'relative', border: 'solid 3px pink', width: '452px' }}>
				<img src="doctor-house.png" />
				<div style={style}></div>
			</div>
		</>
	);
};

export const App = <AppBase />;

// clear && yarn server:build && yarn start

// https://github.com/adamjberg/react-ssr
