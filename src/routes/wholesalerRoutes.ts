import { Router } from 'express';
import { registerWholesaler, approveWholesaler} from '../controllers/WholesalerController';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware';
import multer from 'multer';
import { AddWholesalerSchema } from '../schema/userSchema';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
const upload = multer({ dest: 'uploads/legalDocs/' });
const wholesalerRouter = Router();

wholesalerRouter.post('/register', upload.fields([
    { name: 'businessLicenseDocument', maxCount: 1 },
    { name: 'taxCertificate', maxCount: 1 },
  ]),  ValidationMiddleware({ type: 'body', schema: AddWholesalerSchema }), registerWholesaler);

// Admin-only approval
wholesalerRouter.put('/:id/approval', authMiddleware, checkRole(['Admin']), approveWholesaler);

export { wholesalerRouter };
