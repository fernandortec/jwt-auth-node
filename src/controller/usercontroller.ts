import { Request, Response } from 'express';

import { compare } from 'bcrypt';

import {
  createAcessToken,
  createRefreshToken,
  sendAcessToken,
  sendRefreshToken,
} from '../services/token';

import User from '../models/User';
import isAuth from '../services/isAuth';
import { verify } from 'jsonwebtoken';
import endpoint from '../services/endpoint';

export interface UserRequestTypes {
  name: string;
  email: string;
  password: string;
}

// 1. Register a user
// 2. Login a user
// 3. Logout a user
// 4. Setup a protected route
// 5. Get a new accesstoken with a refresh token

export default {
  // 1. Register a user

  async create(request: Request, response: Response) {
    const { name, email, password }: UserRequestTypes = request.body;

    try {
      const user = await User.findOne({ email });

      /* Check if the user exists, if not create a new user */

      /* The password is being hashed in the database */

      if (!user) {
        const new_user = await User.create({
          email,
          name,
          password,
        });

        return response.json(new_user);
      }

      return response.json('Email already exists');
    } catch (err) {
      return response.json({ message: 'User could not be created' });
    }
  },

  //Optional feature

  async index(request: Request, response: Response) {
    const users = await User.find();

    return response.json(users);
  },

  // 2. Login a user

  async login(request: Request, response: Response) {
    try {
      const { email, password }: UserRequestTypes = request.body;

      const user = await User.findOne({ email });

      /* Check if the user exists */

      if (!user) {
        return response.json({
          error: 'Could not find a user with the provided email',
        });
      }

      /* Compare crypted and non-crypted passwords */

      if (!(await compare(password, user.password))) {
        return response.status(400).json({ error: 'Invalid password' });
      }

      /* Create refresh and acess tokens */

      const acess_token = createAcessToken(String(user.id));
      const refresh_token = createRefreshToken(String(user.id));

      /* Storing acess token in the database */

      await user.update({ acess_token });

      /* Send both tokens, refresh as a cookie and acesstoken as a regular response */

      sendRefreshToken(response, refresh_token);
      sendAcessToken(request, response, acess_token);
    } catch (err) {
      return response.json({ error: `Error: ${err}` });
    }
  },

  // 3. Logout a user

  async logout(request: Request, response: Response) {
    response.clearCookie('refreshtoken');

    return response.json({ message: 'Logged out' });
  },

  // 4. Setup a protected route

  async protectedRoute(request: Request, response: Response) {
    try {
      const user_id = isAuth(request, response);

      if (user_id != null && user_id != undefined) {
        return response.json({ message: 'This is protected data' });
      }
    } catch (err) {
      return response.json({ error: `Error: ${err}` });
    }
  },

  // 5. Get a new accesstoken with a refresh token

  async acessRefreshToken(request: Request, response: Response) {
    const token = request.cookies.refreshtoken;

    /* Checking if token exists */

    if (!token) {
      return response.json({ message: `Acess token: ${token}` });
    }

    /* Verifying token */

    let payload = null;

    try {
      payload = verify(token, endpoint.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return response.json({ error: `Acess token: '` });
    }

    const user_id = String(payload.user_id);
    const user = await User.findOne({ _id: user_id });

    /* Check if the user exists */

    if (!user) {
      return response.json({
        error: 'Could not find a user with the provided id',
      });
    }

    /* Check if refresh token exists on user */

    if (user.acess_token !== token) {
      return response.json({ acess_token: '' });
    }

    /* Creating new acess and refresh token */

    const acess_token = createAcessToken(String(user.id));
    const refresh_token = createRefreshToken(String(user.id));

    /* Update user acess and refresh tokens */

    await user.update({ acess_token });
    await user.update({ refresh_token });

    /* Send tokens */

    sendAcessToken(request, response, acess_token);
    sendRefreshToken(response, refresh_token);

    return response.json({ message: `Acess token: ${acess_token}` });
  },
};
