require('dotenv').config();

import express, { json } from 'express';
import cookie_parser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes';
import endpoint from './services/endpoint';

// 1- Register a user
// 2- Login a user
// 3- Logout a user
// 4- Setup a protected route
// 5- Get a new acesstoken with a refresh token

mongoose.connect(endpoint.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const app = express();

app.use(cookie_parser());
app.use(json());

app.use(routes);

app.listen(process.env.PORT);
