import { User } from "./user";
import { Auth } from "./auth";
import { Pet } from "./pet";
import { Report } from "./report";

User.hasOne(Auth);
Auth.belongsTo(User);

User.hasMany(Pet);
Pet.belongsTo(User);

User.hasMany(Report);
Report.belongsTo(User);

Pet.hasMany(Report);
Report.belongsTo(Pet);

export { User, Auth, Pet, Report };
