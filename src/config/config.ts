import { config } from "dotenv";
config();

interface ConfigInterface {
  username?: string;
  password?: string;
  database?: string;
  port?: number;
  host?: string;
  url?: string;
}

// ✅ Single function to return the right DB config
export function databaseConfig(): ConfigInterface {
  // If DATABASE_URL is provided (Render / PROD), use it
  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL, // will be passed directly to Sequelize
    };
  }

  // Otherwise, fallback to local DEV environment
  return {
    username: process.env.DEV_USERNAME,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_DATABASE,
    host: process.env.DEV_HOST,
    port: Number(process.env.DEV_PORT) || 5432,
  };
}
