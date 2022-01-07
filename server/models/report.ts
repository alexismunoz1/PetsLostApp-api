import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/conn";

export class Report extends Model {}

Report.init(
   {
      fullname: DataTypes.STRING,
      phonenumber: DataTypes.INTEGER,
      report: DataTypes.TEXT,
   },
   { sequelize, modelName: "report" }
);
