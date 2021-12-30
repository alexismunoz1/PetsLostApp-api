import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/conn";

export class Pet extends Model {}

Pet.init(
   {
      petname: DataTypes.STRING,
      lat: DataTypes.FLOAT,
      lng: DataTypes.FLOAT,
      ubication: DataTypes.STRING,
      petstate: DataTypes.STRING,
      petimage: DataTypes.STRING,
   },
   { sequelize, modelName: "pet" }
);
