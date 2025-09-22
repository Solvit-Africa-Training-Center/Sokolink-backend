import { config } from "dotenv";
config();

export interface ConfigInterface {
  username?: string;
  password?: string;
  database?: string;
  port?: number;
  host?: string;
  url?: string;
}

// ✅ Named export
export function databaseConfig(): ConfigInterface {
  if (process.env.DATABASE_URL) {
    // Render / Production
    return {
      url: process.env.DATABASE_URL,
    };
  }

  // Local Development
  return {
    username: process.env.DEV_USERNAME,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_DATABASE,
    host: process.env.DEV_HOST,
    port: Number(process.env.DEV_PORT) || 5432,
  };
}
