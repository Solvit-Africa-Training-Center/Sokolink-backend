import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import {
  addCartItemSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from '../schema/cartSchema';
import { CartService } from '../services/cartService';

const cartRoutes = Router();

// Get cart ( retailer)
cartRoutes.get(
  '/carts',
  authMiddleware,
  checkRole(['retailer']),
  CartController.getCart,
);

//  Add item ( retailer)
cartRoutes.post(
  '/carts',
  authMiddleware,
  checkRole(['retailer']),
  ValidationMiddleware({ type: 'body', schema: addCartItemSchema }),
  CartController.addItem,
);

//  Update item ( retailer)
cartRoutes.put(
  '/carts/:cartItemId',
  authMiddleware,
  checkRole(['retailer']),
  ValidationMiddleware({ type: 'body', schema: updateCartItemSchema }),
  CartController.updateItem,
);

//  Remove one item ( retailer)
cartRoutes.delete(
  '/carts/:cartItemId',
  authMiddleware,
  checkRole(['retailer']),
  ValidationMiddleware({ type: 'body', schema: removeCartItemSchema }),
  CartController.removeItem,
);

// Clear all items in a cart
cartRoutes.delete(
  '/carts/:cartId/clear',
  authMiddleware,
  checkRole(['retailer']),
    CartController.clearCart,
);

interface User {
  id: string;
  role?: string;
}

interface IRequestUser extends Request {
  user?: User;
}

export { cartRoutes };
