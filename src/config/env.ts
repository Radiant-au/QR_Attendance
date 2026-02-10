// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  DB_HOST: string;
  DB_PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  USE_HTTPS: string;
  JWT_SECRET: string;
  JWT_EXPIRE_MINUTES: string;
  PORT: string;
  ENV: string;
  DB_SSL: string;
  CORS_ORIGINS: string[];
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
}

function validateEnv(): EnvConfig {
  const requiredVars = [
    'DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD',
    'DB_NAME', 'JWT_SECRET'
  ];

  const missing = requiredVars.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: process.env.DB_PORT!,
    DB_USERNAME: process.env.DB_USERNAME!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_NAME: process.env.DB_NAME!,
    USE_HTTPS: process.env.USE_HTTPS || 'false',
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRE_MINUTES: process.env.JWT_EXPIRE_MINUTES || '15',
    PORT: process.env.PORT || '5000',
    ENV: process.env.ENV || 'development',
    DB_SSL: process.env.DB_SSL || 'false',
    CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [],
    ADMIN_USERNAME: process.env.ADMIN_USERNAME!,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!
  };
}

export const env = validateEnv();