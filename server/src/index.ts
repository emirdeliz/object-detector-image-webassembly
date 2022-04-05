import express from 'express';
import { htmlString } from './App';

const app = express();
app.get('/', (_req, res) => res.send(htmlString));
app.use(express.static('./built'));
app.listen(4242);
