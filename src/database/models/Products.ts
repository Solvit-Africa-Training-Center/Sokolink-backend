import { DataTypes, Sequelize, Model } from 'sequelize';
import { ProductCategory } from './ProductCategory';
import { ProductSubCategory } from './ProductSubCategory';
import { User } from './Users';
import { Rating } from './Ratings';

export interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  productCatId: string;
  productSubCatId: string;
  userId: string;
  variation: object | null;
  images: string[];
  isAvailable: boolean;
  expiredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes extends Omit<ProductAttributes, 'id'> {
  id?: string;
}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: string;
 declare name: string;
 declare description: string;
  declare price: number;
  declare stock: number;
  declare productCatId: string;
  declare productSubCatId: string;
  declare userId: string;
  declare variation: object | null;
  declare images: string[];
  declare isAvailable: boolean;
  declare expiredAt?: Date | undefined;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: {
    User: typeof User;
    ProductCategory: typeof ProductCategory;
    ProductSubCategory: typeof ProductSubCategory;
    Rating: typeof Rating;
  }): void {
    Product.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Product.belongsTo(models.ProductCategory, {
      foreignKey: 'productCatId',
      as: 'category',
    });

    Product.belongsTo(models.ProductSubCategory, {
      foreignKey: 'productSubCatId',
      as: 'subCategory',
    });

    Product.hasMany(models.Rating, {
      foreignKey: 'productId',
      as: 'ratings',
    });

  }

  public toJSON(): object | ProductAttributes {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      productCatId: this.productCatId,
      productSubCatId: this.productSubCatId,
      userId: this.userId,
      variation: this.variation,
      images: this.images,
      isAvailable: this.isAvailable,
      expiredAt: this.expiredAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const ProductModel = (sequelize: Sequelize): typeof Product => {
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      productCatId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'product_categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      productSubCatId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'product_sub_categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      variation: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },

      expiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
    },
  );

  return Product;
  
};
