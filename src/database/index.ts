import { Sequelize } from "sequelize";
import { databaseConfig } from "../config/config";
import { AllModal } from "./models";

const dbConnection = () => {
  const db_config = databaseConfig();

  let sequelize: Sequelize;

  if (db_config.url) {
    // Render / PROD
    sequelize = new Sequelize(db_config.url, {
      dialect: "postgres",
      logging: false,
    });
  } else {
    // Local DEV
    sequelize = new Sequelize({
      ...db_config,
      dialect: "postgres",
      logging: false,
    });
  }

  return sequelize;
};

const sequelizeInstance = dbConnection();

// ✅ Test DB connection
sequelizeInstance
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const models = AllModal(sequelizeInstance);

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export type DatabaseType = typeof models & { database: Sequelize };
export const Database = { ...models, database: sequelizeInstance };
