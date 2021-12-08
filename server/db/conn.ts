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

async function main() {
   try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
   } catch (error) {
      console.error("Unable to connect to the database:", error);
   }
}
main();
