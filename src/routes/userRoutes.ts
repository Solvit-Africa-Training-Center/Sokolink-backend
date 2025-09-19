import { Router } from 'express';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { getAllUsers, registerUser, loginUser, logoutUser, deleteUser } from '../controllers/userController';
import { AddUserSchema, LoginUserSchema } from '../schema/userSchema';
import { authMiddleware, checkRole, rateLimiting } from '../middlewares/authMiddleware';

const userRouter = Router();

userRouter.get('/users', rateLimiting(50), authMiddleware,  getAllUsers);

userRouter.post(
  '/users',
  rateLimiting(30),
  ValidationMiddleware({ type: 'body', schema: AddUserSchema }),
  registerUser,
);

userRouter.post(
  '/login',
  ValidationMiddleware({ type: 'body', schema: LoginUserSchema }),
  loginUser,
);

userRouter.post('/logout', authMiddleware, logoutUser);
// Delete user by ID
userRouter.delete('/users/:id',  authMiddleware, deleteUser);

export { userRouter };
