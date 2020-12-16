import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import endpoint from './endpoint';

const isAuth = (request: Request, response: Response) => {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return response.json({ error: 'You need to login' });
  }

  const token = authorization.split(' ')[1];

  const { user_id } = verify(token, endpoint.ACCESS_TOKEN_SECRET);

  return user_id;
};
export default isAuth;
