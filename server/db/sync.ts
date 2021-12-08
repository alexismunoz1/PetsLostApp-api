import { sequelize } from "./conn";

sequelize.sync({ force: true }).then((res) => console.log(res));
