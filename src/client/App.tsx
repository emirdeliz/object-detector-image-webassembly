import React, { useCallback, useEffect, useState } from 'react';

const AppBase: React.FC = () => {
	const [clientMessage, setClientMessage] = useState('');

	const initialize = useCallback(async () => {
		const asmLibraryArg = {
			o: function () { },
			a: function () { },
			b: function () { },
			h: function () { },
			c: function () { },
			j: function () { },
			g: function () { },
			i: function () { },
			d: function () { },
			l: function () { },
			f: function () { },
			k: function () { },
			e: function () { },
		};
		console.log('CPTOOOOO', importObject);

		const response = await fetch('webassembly/object-detector-image-webassembly.wasm');
		const bytes = await response.arrayBuffer();
		WebAssembly.instantiate(bytes, importObject);

		// fetch('/webassembly/object_detector_on_image_webassembly.wasm')
		// 	.then((response) => response.arrayBuffer())
		// 	.then((bytes) => WebAssembly.instantiate(bytes, importObject))
		// 	.then((results) => {
		// 		console.log(results.exports);
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
