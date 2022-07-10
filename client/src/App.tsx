import React, { useCallback, useEffect, useState } from 'react';

const AppBase: React.FC = () => {
	const [clientMessage, setClientMessage] = useState('');

	const initialize = useCallback(() => {
		const importObject = {
			imports: {
				detectImageInsideImage: (arg) => {
					console.log(arg);
				},
			},
		};

		// fetch('/web-assembly/object_detector_on_image_web_assembly.wasm')
		// 	.then((response) => response.arrayBuffer())
		// 	.then((bytes) => WebAssembly.instantiate(bytes, importObject))
		// 	.then((results) => {
		// 		console.log(results.instance.exports);
		// 	});
	}, []);

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
