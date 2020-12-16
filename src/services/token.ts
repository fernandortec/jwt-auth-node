import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import endpoint from './endpoint';

const createAcessToken = (user_id: string) => {
  return sign({ user_id }, endpoint.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

const createRefreshToken = (user_id: string) => {
  return sign({ user_id }, endpoint.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

const sendAcessToken = (
  request: Request,
  response: Response,
  acess_token: string
) => {
  response.json({
    acess_token,
    request_email: request.body.email,
  });
};

const sendRefreshToken = (response: Response, refresh_token: string) => {
  response.cookie('refreshtoken', refresh_token, {
    path: '/refresh_token',
  });
};

export {
  createAcessToken,
  createRefreshToken,
  sendAcessToken,
  sendRefreshToken,
};
