import {config} from 'dotenv';

config();
export const settings = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || "1234",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "12345",
    TOKEN_LIFE: 300,
    REFRESH_TOKEN_LIFE: 600,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT || 5432,
    POSTGRES_USERNAME: process.env.POSTGRES_USERNAME,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
}