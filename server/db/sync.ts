import { sequelize } from "./conn";
import "../models";

sequelize.sync({ alter: true }).then((res) => console.log(res));
