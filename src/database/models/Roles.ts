import { Sequelize, Model, DataTypes } from 'sequelize';
import { User } from './Users';

export interface RoleAttributes {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleCreationAttributes
  extends Omit<RoleAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  public toJSON(): object | RoleAttributes {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static associate(models: { User: typeof User }): void {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'users',
    });
  }
}

export const RoleModel = (sequelize: Sequelize) => {
  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Roles',
      tableName: 'roles',
    },
  );

  return Role;
};