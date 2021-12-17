import * as jwt from "jsonwebtoken";

// Funcion para verificar el token de autenticacion y obtener el id del usuario.
export async function authMiddlewares(req, res, next): Promise<void> {
   const token = req.headers.authorization.split(" ")[1];
   try {
      req._user = jwt.verify(token, process.env.JWT_SECRET);
      next();
   } catch (error) {
      res.status(401).json({ message: "Token not valid" });
   }
}
