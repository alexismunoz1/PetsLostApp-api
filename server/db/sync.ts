import { sequelize } from "./conn";

sequelize.sync({ alter: true }).then((res) => console.log(res));
