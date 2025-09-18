import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import {
  CreateProductSchema,
  UpdateProductSchema,
  IdValidationSchema,
} from '../schema/productSchema';
import { authMiddleware, checkRole, rateLimiting } from '../middlewares/authMiddleware';
import { AddProductCategorySchema } from '../schema/productCategorySchema';
import { productSubCatSchema } from '../schema/productSubCategorySchema';
import { productImageValidation } from '../middlewares/fileValidationMiddleware';
import { storage } from '../utils/upload';
import multer from 'multer';

const uploadMiddleware = multer({ storage });
const productRoutes = Router();
const controller = new ProductController();

// product category routes
productRoutes.get('/categories', rateLimiting(30), controller.viewAllCategories);
productRoutes.get('/categories/:name', rateLimiting(30), controller.viewSingleCategory);
productRoutes.post(
  '/categories',
  rateLimiting(30),
  authMiddleware,
  checkRole(['Wholesaler']),
  ValidationMiddleware({ type: 'body', schema: AddProductCategorySchema }),
  controller.createCategory,
);
productRoutes.patch(
  '/categories/:id',
  rateLimiting(30),
  authMiddleware,
  checkRole(['Wholesaler']),
  ValidationMiddleware({ type: 'body', schema: AddProductCategorySchema }),
  controller.updateCategory,
);
productRoutes.delete(
  '/categories/:id',
  rateLimiting(30),
  authMiddleware,
  checkRole(['admin', 'Wholesaler']),
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.deleteCategory,
);

// product sub-category routes

productRoutes.get('/sub-categories', rateLimiting(30), controller.viewAllSubCategories);
productRoutes.get('/sub-categories/:name', rateLimiting(30), controller.viewSingleSubCategory);
productRoutes.post(
  '/sub-categories',
  rateLimiting(30),
  authMiddleware,
  checkRole(['Wholesaler']),
  ValidationMiddleware({ type: 'body', schema: productSubCatSchema }),
  controller.createSubCategory,
);
productRoutes.patch(
  '/sub-categories/:id',
  rateLimiting(30),
  authMiddleware,
  checkRole(['Wholesaler']),
  ValidationMiddleware({ type: 'body', schema: productSubCatSchema }),
  controller.updateSubCategory,
);
productRoutes.delete(
  '/sub-categories/:id',
  rateLimiting(30),
  authMiddleware,
  checkRole(['admin', 'Wholesaler']),
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.deleteSubCategory,
);

// product routes

productRoutes.get(
  '/products/admin',
  rateLimiting(30),
  authMiddleware,
  checkRole(['admin']),
  controller.viewAllProducts,
);

productRoutes.get(
  '/products/Wholesaler',
  rateLimiting(30),
  authMiddleware,
  checkRole(['Wholesaler']),
  controller.WholesalerViewAllProducts,
);

productRoutes.get('/products', rateLimiting(30), controller.retailerViewAllProducts);
productRoutes.get('/products/:id', rateLimiting(30), controller.viewSingleProduct);
productRoutes.post(
  '/products',
  rateLimiting(30),
  authMiddleware,
  checkRole(['Wholesaler']),
  uploadMiddleware.array('images', 8),
  productImageValidation,
  ValidationMiddleware({ type: 'body', schema: CreateProductSchema }),
  controller.createProduct,
);
productRoutes.patch(
  '/products/:id',
  rateLimiting(30),
  authMiddleware,
  checkRole(['Wholesaler']),
  uploadMiddleware.array('images', 8),
  productImageValidation,
  ValidationMiddleware({ type: 'body', schema: UpdateProductSchema }),
  controller.updateProduct,
);
productRoutes.delete(
  '/products/:id',
  rateLimiting(30),
  authMiddleware,
  checkRole(['Admin', 'Wholesaler']),
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.deleteProduct,
); //admin

export { productRoutes };
