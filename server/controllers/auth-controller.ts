import { Auth } from "../models/index";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

// Funcion para encriptar la contraseña
function encryptPassword(input) {
   return crypto.createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

export const authController = {
   // Método para crear un nuevo usuario en la tabla auth.
   async findOrCreateAuth(authData, user) {
      const { email, password } = authData;

      const [auth, authCreated] = await Auth.findOrCreate({
         where: { user_id: user.get("id") },
         defaults: {
            email,
            password: encryptPassword(password),
            user_id: user.get("id"),
         },
      });

      return auth;
   },

   // Método para obtener el token de autenticacion.
   async tokenFunction(authData) {
      const { email, password } = authData;
      const passwordHash = encryptPassword(password);
      const auth = await Auth.findOne({
         where: {
            email,
            password: passwordHash,
         },
      });

      // Si el usuario existe y la contraseña es correcta,
      // se genera el token de autenticacion.
      const token = jwt.sign({ id: auth.get("user_id") }, process.env.JWT_SECRET);
      return token;
   },
};
