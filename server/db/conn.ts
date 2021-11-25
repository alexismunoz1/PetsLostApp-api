import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
   dialect: "postgres",
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE,
   port: parseInt(process.env.DB_PORT),
   host: process.env.DB_HOST,
   ssl: true,
   // esto es necesario para que corra correctamente
   dialectOptions: {
      ssl: {
         require: true,
         rejectUnauthorized: false,
      },
   },
});
