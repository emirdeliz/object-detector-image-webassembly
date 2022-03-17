import React, { useEffect, useState } from 'react';
import { hydrate } from 'react-dom';

export const App: React.FC = () => {
	const [clientMessage, setClientMessage] = useState('');

	useEffect(() => {
		setClientMessage('Hello From React');
	});

	return (
		<>
			<h1>Hello World!</h1>
			<h2>{clientMessage}</h2>
		</>
	);
};

hydrate(<App />, document.getElementById('root'));

// clear && yarn server:build && yarn start

// https://github.com/adamjberg/react-ssr