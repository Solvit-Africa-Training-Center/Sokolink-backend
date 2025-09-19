import { Request } from 'express';
import { CartItem } from '../database/models/cartItemModel';
import { CartAttributes } from '../database/models/cartModel';

export interface ICartWithItems extends CartAttributes {
  items?: CartItem[];
}

export interface ICartItem {
  id?: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  totalprice?: number;
}

export interface ICart {
  id?: string;
  retailerId: string;
  items?: ICartItem[];
  totalPrice?: number;
}

export interface IRequestUser extends Request {
  user?: { id: string; role?: string };
}
