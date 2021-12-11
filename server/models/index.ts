import { User } from "./user";
import { Auth } from "./auth";
import { Pet } from "./pet";

User.hasOne(Auth);
Auth.belongsTo(User);

User.hasMany(Pet);
Pet.belongsTo(User);

export { User, Auth, Pet };
