import { App } from '../client/App';
import { renderToString } from 'react-dom/server';

const app = renderToString(App);
const html = `
	<html lang='en'>
	<head>
		<script src='client.js' async defer></script>
	</head>
	<body>
		<div id='root'>${app}</div>
	</body>
	</html>
`;

export const htmlString = html;
