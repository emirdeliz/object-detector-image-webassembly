import React, { useCallback, useEffect, useState } from 'react';
import { detectImageInsideImage } from '../../webassembly/src/utils';

var cdetector = {};
function binary(e) {
	return new Promise(((t, r) => {
		var n = new XMLHttpRequest;
		n.open("GET", e, !0),
			n.responseType = "arraybuffer", n.onload = () => {
				t(n.response)
			}, n.send(null)
	}))
}

function script(e) {
	return new Promise(((t, r) => {
		var n = document.createElement("script");
		n.src = e, n.onload = () => {
			t()
		}, document.body.appendChild(n)
	}))
}

Promise.all([binary("webassembly/object-detector-on-image-cpp.js"), binary("webassembly/object-detector-on-image-cpp.wasm")]).then((e => {
	cdetector.wasm = e[1];

	console.log(e[0]);

	var t = URL.createObjectURL(new Blob([e[0]], {
		type: "application/javascript"
	}));
	script(t).then((() => {
		URL.revokeObjectURL(t)
	}))
}))


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
		// const fileOne = await getFileFromUrl('doctor-house.png');
		// const fileTwo = await getFileFromUrl('doctor-house-tongue.png');
		// console.log(await detectImageInsideImage(fileOne, fileTwo));
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
