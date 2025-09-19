import { Router } from 'express';
import { registerRetailer } from '../controllers/retailerController';
import { AddRetailerSchema } from '../schema/userSchema';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';

const retailerRouter = Router();

retailerRouter.post('/register',  ValidationMiddleware({ type: 'body', schema: AddRetailerSchema }), registerRetailer);

export { retailerRouter };
