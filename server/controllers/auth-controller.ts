import { Auth } from "../models/index";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

function getSHA256ofJSON(input) {
   return crypto.createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

export const authController = {
   async findOrCreateAuth(authData, user) {
      const { email, password } = authData;

      const [auth, authCreated] = await Auth.findOrCreate({
         where: { user_id: user.get("id") },
         defaults: {
            email,
            password: getSHA256ofJSON(password),
            user_id: user.get("id"),
         },
      });

      return auth;
   },
   async tokenFunction(authData) {
      const { email, password } = authData;
      const passwordHash = getSHA256ofJSON(password);
      const auth = await Auth.findOne({
         where: {
            email,
            password: passwordHash,
         },
      });

      const token = jwt.sign({ id: auth.get("user_id") }, process.env.JWT_SECRET);
      return token;
   },
};
