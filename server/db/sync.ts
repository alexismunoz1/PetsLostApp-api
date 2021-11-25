import { sequelize } from "./conn";

sequelize.sync({ force: true });
