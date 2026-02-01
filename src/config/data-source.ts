import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { env } from "./env";

const isProduction = env.ENV === "production" || process.env.NODE_ENV === "production";
const fileExt = isProduction ? "js" : "ts";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT || "5432"),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [path.resolve(__dirname, `../entities/**/*.${fileExt}`)],
  migrations: [path.resolve(__dirname, `../migrations/**/*.${fileExt}`)],
  synchronize: false,
  logging: env.ENV === 'development',
  extra: {
    connectionLimit: 30,     // Allow 30 active connections
    queueLimit: 100,           // Unlimited queued requests
    waitForConnections: true // Queue requests instead of failing
  },
  ssl: env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
});