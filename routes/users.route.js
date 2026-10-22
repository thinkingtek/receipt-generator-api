import { Router } from 'express';
// import  authorize  from '../middleware/auth.middleware.js';
import { getAllUsers, getUserById } from '../controllers/users.controller.js';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);

export default userRouter;