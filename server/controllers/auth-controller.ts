import { Auth, User } from "../models/index";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

function encryptPassword(input: string): string {
   // Funcion para encriptar la contraseña mediante un hash SHA256
   return crypto.createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

export const authController = {
   async findOrCreateAuth(email: string, password: string, user: User): Promise<Auth> {
      // Método para crear un nuevo usuario en la tabla auth.
      try {
         const [auth, created] = await Auth.findOrCreate({
            where: { user_id: user.get("id") },
            defaults: {
               email,
               password: encryptPassword(password),
               user_id: user.get("id"),
            },
         });

         return auth;
      } catch (error) {
         throw new Error(error);
      }
   },

   async tokenFunction(email: string, password: string): Promise<string> {
      // Método para obtener el token de autenticacion.
      const passwordHash = encryptPassword(password);

      const auth: Auth = await Auth.findOne({
         where: {
            email,
            password: passwordHash,
         },
      });

      // Si el usuario existe y la contraseña es correcta,
      // se genera el token de autenticacion.
      if (auth) {
         return jwt.sign({ id: auth.get("user_id") }, process.env.JWT_SECRET);
      } else {
         return null;
      }
   },
};
