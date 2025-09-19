import { Sequelize, Model, DataTypes } from 'sequelize';
import { Role } from './Roles';
import { Profile } from './Profiles';
import { Rating } from './Ratings';
import { Product } from './Products';
interface UserAttribute {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  businessName?: string; 
  phoneNumber?: string;
  businessLicenseDocument?: string | null;
  taxCertificate?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

export interface UserCreationAttribute
  extends Omit<UserAttribute, 'id' | 'deletedAt' | 'createdAt' | 'updatedAt'> {
  id?: string;
  deletedAt?: null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Model<UserAttribute, UserCreationAttribute> implements UserAttribute {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare roleId: string;
  declare businessName: string; 
  declare phoneNumber: string;
  declare businessLicenseDocument: string;
  declare taxCertificate: string;  
  declare status: 'pending' | 'approved' | 'rejected';
  declare updatedAt: Date;
  declare deletedAt: null;
  declare createdAt: Date;

  public toJSON(): object | UserAttribute {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      roleId: this.roleId,
      businessName: this.businessName,
      phoneNumber: this.phoneNumber, 
      businessLicenseDocument: this.businessLicenseDocument,
      taxCertificate: this.taxCertificate,
      status: this.status,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };
  }

  static associate(models: {
    Role: typeof Role;
    Profile: typeof Profile;
    Rating: typeof Rating;
    Product: typeof Product;
  }): void {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    User.hasMany(models.Profile, {
      foreignKey: 'userId',
      as: 'user',
    });

    User.hasMany(models.Product, {
      foreignKey: 'userId',
      as: 'products',
    });

    User.hasMany(Rating, {
      foreignKey: 'postedBy',
      as: 'ratings',
    });
  }
}

export const UserModal = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      businessName: { type: DataTypes.STRING, allowNull: true },  
      phoneNumber: { type: DataTypes.STRING, allowNull: true },
       status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: true,
      defaultValue: 'pending',
    },
      businessLicenseDocument: {
      type: DataTypes.STRING,
      allowNull: true, // Wholesaler uploads it
    },
    taxCertificate: {
      type: DataTypes.STRING,
      allowNull: true, // Wholesaler uploads it
    },

    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Users',
      tableName: 'users',
    },
  );
  return User;
};