import { User } from "./../models/user";
import { sequelize } from "./conn";

User.sync({ alter: true });
