import { Router } from 'express';
import usercontroller from './controller/usercontroller';

const routes = Router();

routes.post('/', usercontroller.create);
routes.post('/login', usercontroller.login);
routes.post('/logout', usercontroller.logout);
routes.post('/protected', usercontroller.protectedRoute);
routes.post('/refresh_token', usercontroller.acessRefreshToken);

routes.get('/list', usercontroller.index);

export default routes;
