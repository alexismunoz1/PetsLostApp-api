import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/conn";

export class Pet extends Model {}

Pet.init(
   {
      petname: DataTypes.STRING,
      lat: DataTypes.FLOAT,
      lng: DataTypes.FLOAT,
      petstate: DataTypes.STRING,
   },
   { sequelize, modelName: "pet" }
);
