import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/conn";

export class User extends Model {}

User.init(
   {
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
   },
   { sequelize, modelName: "user" }
);
