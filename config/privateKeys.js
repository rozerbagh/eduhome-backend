import dotenv from 'dotenv';
dotenv.config();

let {
    DB_STRING,
    DB_STRING_DEV,
    PORT,
    nodemailerEmail,
    nodemailerPassword,
} = process.env;

export const privateKey = {
    'DB_STRING': DB_STRING,
    'DB_STRING_DEV': DB_STRING_DEV,
    'PORT': PORT,
    'EMAIL': nodemailerEmail,
    'PASSWORD': nodemailerPassword,
};
