import express from 'express';
import cors from 'cors';
import { router } from './routes'

const port = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(router);

app.listen(port, () => console.log('listening on port ' + port));