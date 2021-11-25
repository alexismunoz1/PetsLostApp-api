import { Sequelize } from "sequelize";
import "dotenv/config";

export const sequelize = new Sequelize({
   dialect: "postgres",
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE,
   port: 5432,
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

// await sequelize.sync();

// try {
//    sequelize.authenticate();
//    console.log("Connection has been established successfully.");
// } catch (err) {
//    console.error("Unable to connect to the database:", err);
// }
