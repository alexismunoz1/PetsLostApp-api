import { User } from "./user";
import { Auth } from "./auth";

User.hasOne(Auth);
Auth.belongsTo(User);

export { User, Auth };
