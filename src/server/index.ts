import express from 'express';
import { htmlString } from './App';

const port = 3003;
const app = express();

app.route('/').get((_req, res) => {
  res.send(htmlString);
});

console.log(__dirname)

app.use(express.static(__dirname));
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
