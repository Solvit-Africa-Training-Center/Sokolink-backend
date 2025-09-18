import { Cart } from '../database/models/cartModel';
import { CartItem } from '../database/models/cartItemModel';
import { Product } from '../database/models/Products';
import { ICart, ICartItem } from '../types/cartInterface';
import { Response } from 'express';
import { ResponseService } from '../utils/response';

interface IServiceResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export class CartService {

  static async getCartByRetailerId(retailerId: string, res: Response): Promise<void> {
    try {
      let cart = await Cart.findOne({
        where: { retailerId },
        include: [
          {
            model: CartItem,
            as: 'items',
            include: [{ model: Product, as: 'product' }],
          },
        ],
      });

      if (!cart) {
        cart = await Cart.create({ retailerId });
        ResponseService({
          data: { id: cart.id, retailerId: cart.retailerId, items: [], totalPrice: 0 },
          success: true,
          message: 'Cart created successfully.',
          status: 201,
          res
        })
      }

      const items = cart.items?.map((item: CartItem) => ({
        ...item.toJSON(),
        totalprice: Number(item.price) * item.quantity,
      }));

      const totalPrice = items?.reduce((acc, i) => acc + (i.totalprice ?? 0), 0) ?? 0;

      ResponseService({
        data: { id: cart.id, retailerId: cart.retailerId, items, totalPrice },
        message: 'Cart retrieved successfully.',
        success: true,
        status: 200,
        res
      })
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  static async addItem(retailerId: string, data: ICartItem, res: Response): Promise<void> {
    try {
      let cart = await Cart.findOne({ where: { retailerId } });
      if (!cart) cart = await Cart.create({ retailerId });

      const product = await Product.findByPk(data.productId);
      if (!product) {
        ResponseService({
          success: false,
          message: 'Product not found',
          data: null,
          status: 404,
          res
        });
        return;
      }

      if (data.quantity > product.stock) {
        ResponseService({
          success: false,
          message: `Insufficient stock. Only ${product.stock} units available.`,
          data: null,
          status: 400,
          res
        });
        return;
      }

      const existingCartItem = await CartItem.findOne({
        where: { cartId: cart.id, productId: data.productId },
      });

      if (existingCartItem) {
        ResponseService({
          success: false,
          message: 'This product is already in your cart. Please update the quantity instead.',
          data:null,
          status: 400,
          res
        });
        return;
      }

      const totalprice = Number(product.price) * data.quantity;
      const cartItem = await CartItem.create({
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
        price: Number(product.price),
        totalprice,
      });

      ResponseService({
        success: true,
        message: 'Item added to cart.',
        data: cartItem.toJSON() as ICartItem,
        status: 201,
        res
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }


  static async updateItem(cartItemId: string, quantity: number, res: Response): Promise<void> {
    try {
      const cartItem = await CartItem.findByPk(cartItemId);
      if (!cartItem) {
        ResponseService({
          success: false,
          message: 'Cart item not found.',
          data: null,
          status: 404,
          res
        });
        return;
      }

      const product = await Product.findByPk(cartItem.productId);
      if (!product) {
        ResponseService({
          success: false,
          message: 'Product not found.',
          data: null,
          status: 404,
          res
        });
        return;
      }
      if (quantity > product.stock) {
        ResponseService({
          success: false,
          message: `Insufficient stock. Only ${product.stock} units available.`,
          data: null,
          status: 400,
          res
        });
        return;
      }

      cartItem.quantity = quantity;
      cartItem.totalprice = Number(cartItem.price) * quantity;
      await cartItem.save();

      ResponseService({
        success: true,
        message: 'Cart item updated.',
        data: null,
        status: 200,
        res
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }


  static async removeItem(cartItemId: string, res: Response): Promise<void> {
    try {
      const deleted = await CartItem.destroy({ where: { id: cartItemId } });
      if (!deleted) {
        ResponseService({
          success: false,
          message: 'Cart item not found.',
          data: null,
          status: 404,
          res
        })
        return;
      }

      ResponseService({
        success: true,
        message: 'Item removed from cart.',
        data: null,
        status: 200,
        res
      })
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  static async clearCart(cartId: string, res: Response): Promise<void> {
    try {
      const deleted = await CartItem.destroy({ where: { cartId } });

      if (!deleted) {
        ResponseService({
          success: true,
          message: 'Cart is already empty.',
          data: null,
          status: 200,
          res
        });
        return;
      }

      ResponseService({
        success: true,
        message: 'All items removed from cart.',
        data: null,
        status: 200,
        res
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res
      });
    }
  }
}
