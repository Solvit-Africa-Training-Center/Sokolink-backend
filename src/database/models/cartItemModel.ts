import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Cart } from './cartModel';
import { Product } from './Products';

export interface CartItemAttributes {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  totalprice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export type CartItemCreationAttributes = Optional<CartItemAttributes, 'id' | 'totalprice'>;
export class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  id!: string;
  cartId!: string;
  productId!: string;
  quantity!: number;
  price!: number;
  totalprice!: number;
  createdAt?: Date | undefined;

  updatedAt?: Date | undefined;

  public static associate(models: { Cart: typeof Cart; Product: typeof Product }): void {
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cartId',
      targetKey: 'id',
      as: 'cart',
    });
    CartItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      targetKey: 'id',
      as: 'product',
    });
  }
  public toJSON(): CartItemAttributes {
    return {
      id: this.id,
      cartId: this.cartId,
      productId: this.productId,
      quantity: this.quantity,
      price: this.price,
      totalprice: this.totalprice,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const CartItemModel = (sequelize: Sequelize): typeof CartItem => {
  CartItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cartId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      totalprice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'cart_items',
      timestamps: true,
      modelName: 'CartItem',
    },
  );
  return CartItem;
};
