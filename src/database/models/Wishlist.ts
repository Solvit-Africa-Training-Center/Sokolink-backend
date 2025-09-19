import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db';// Adjust the path to where your Sequelize instance is exported
import { User } from './Users';
import { Product } from './Products';

export class Wishlist extends Model {
  public id!: number;
  public retailerId!: number;
  public productId!: number;
}

Wishlist.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    retailerId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false }
  },
  { sequelize, tableName: 'wishlists' }
);

Wishlist.belongsTo(User, { foreignKey: 'retailerId', as: 'retailer' });
Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
