import { Sequelize } from "sequelize";
import { databaseConfig } from "./config";

const config = databaseConfig();

const sequelize = config.url
  ? new Sequelize(config.url, { dialect: "postgres" })
  : new Sequelize(config.database!, config.username!, config.password, {
      host: config.host,
      port: config.port,
      dialect: "postgres",
    });

export default sequelize;

