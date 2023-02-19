import React, { useCallback, useEffect, useState } from 'react';

import { processImages } from '../../webassembly/src/utils';

const getFileFromUrl = async (name: string) => {
	const response = await fetch(`http://localhost:3000/${name}`);
	const imgBlob = await response.blob();
	return imgBlob;
}

const AppBase: React.FC = () => {
	const [clientMessage, setClientMessage] = useState('');
	const initialize = useCallback(async () => {
		await testDetector();
	}, []);

	const testDetector = async () => {
		// const fileOne = await getFileFromUrl('doctor-house.png');
		// const fileTwo = await getFileFromUrl('doctor-house-tongue.png');

		const fileOneUrl = 'http://localhost:3000/doctor-house.png';
		const fileTwoUrl = 'http://localhost:3000/doctor-house-tongue.png'

		// setTimeout(async () => {
		// console.log(
			await processImages(fileOneUrl, fileTwoUrl)
		// );
		// }, 1000);
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
	/* <div style={style}></div> */
	
	return (
		<div>
			<h1>Hello World!</h1>
			<h2>{clientMessage}</h2>
			<div style={{
				position: 'relative',
				border: 'solid 3px pink',
				width: '452px',
				height: '665px',
				backgroundImage: 'url(doctor-house.png)',
				backgroundSize: 'contain'
			}}>
			</div>
		</div>
	);
};

export const App = <AppBase />;

// clear && yarn server:build && yarn start

// https://github.com/adamjberg/react-ssr
