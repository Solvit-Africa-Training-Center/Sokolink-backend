import { DataTypes, Model, Optional, Sequelize, HasManyGetAssociationsMixin } from 'sequelize';
import { CartItem } from './cartItemModel';
import { User } from './Users';

export interface CartAttributes {
  id: string;
  retailerId: string;   
  createdAt?: Date;
  updatedAt?: Date;
  items?: CartItem[];
}

export type CartCreationAttributes = Optional<CartAttributes, 'id'>;

export class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public id!: string;
  public retailerId!: string;  
  public createdAt!: Date;
  public updatedAt!: Date;

  public items?: CartItem[];

  public getItems!: HasManyGetAssociationsMixin<CartItem>;
  quantity: number | undefined;

  public static associate(models: { CartItem: typeof CartItem; User: typeof User }): void {
    Cart.hasMany(models.CartItem, {
      foreignKey: 'cartId',
      sourceKey: 'id',
      as: 'items',
      onDelete: 'CASCADE',
    });

    Cart.belongsTo(models.User, { 
      foreignKey: 'retailerId', 
      targetKey: 'id',
      as: 'retailer',           
    });
  }

  public toJSON(): CartAttributes {
    return {
      id: this.id,
      retailerId: this.retailerId, 
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      items: this.items,
    };
  }
}

export const CartModel = (sequelize: Sequelize): typeof Cart => {
  Cart.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      retailerId: { 
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'carts',
      timestamps: true,
      modelName: 'Cart',
    },
  );
  return Cart;
};
