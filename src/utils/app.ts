import express from 'express';
import Routes from '../routes';
import morgan from 'morgan';
import 'express-async-errors';
import cors from 'cors';
import config from 'config';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const NODE_ENV = config.get<string>('node_env');
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

Routes(app);

export { app };
