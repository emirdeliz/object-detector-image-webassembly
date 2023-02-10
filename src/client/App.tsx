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
	const [clientMessage, setClientMessage] = useState('');

	const initialize = useCallback(async () => {
		await testDetector();
	}, []);

	const testDetector = async () => {
		const fileOne = await getFileFromUrl('doctor-house.png');
		const fileTwo = await getFileFromUrl('doctor-house-tongue.png');
		console.log(await detectImageInsideImage(fileOne, fileTwo));
	}

	useEffect(() => {
		setClientMessage('Hello From React');
		initialize();
	}, []);

	return (
		<>
			<h1>Hello World!</h1>
			<h2>{clientMessage}</h2>
		</>
	);
};

export const App = <AppBase />;

// clear && yarn server:build && yarn start

// https://github.com/adamjberg/react-ssr
