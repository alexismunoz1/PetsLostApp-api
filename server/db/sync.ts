import { sequelize } from "./conn";
import "../models";

// Método para sincronizar la base de datos.
sequelize.sync({ alter: true }).then((res) => console.log(res));
