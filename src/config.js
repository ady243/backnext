import "dotenv/config";

export default {
  port: process.env.APP_PORT,
  db: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      directory: "./src/db/migrations",
    },
  },
  security: {
    password: {
      pepper: process.env.SECURITY_PASSWORD_PEPPER,
      interation: 1000,
      Keylen: 128,
      digest: "sha512",
    },
  },
};
