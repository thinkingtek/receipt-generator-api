import {Router} from 'express';
import { createUserByAdmin, loginUser, profile, logoutUser } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.get('/', profile);
authRouter.post('/add-user', createUserByAdmin);
authRouter.post('/login', loginUser);
authRouter.get('/logout', logoutUser);

export default authRouter;