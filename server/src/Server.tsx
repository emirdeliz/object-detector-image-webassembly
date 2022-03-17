import express from 'express';
import { renderToString } from 'react-dom/server';
import { App } from '../../client/src/App';

const app = express();
app.get('/', (_req, res) => {
    const app = renderToString(<App />);

    const html = `
        <html lang='en'>
        <head>
            <script src='app.js' async defer></script>
        </head>
        <body>
            <div id='root'>${app}</div>
        </body>
        </html>
    `
    res.send(html);
});

app.use(express.static('./built'));
app.listen(4242);