import * as jwt from "jsonwebtoken";

export async function authMiddle(req, res, next) {
   const token = req.headers.authorization.split(" ")[1];
   try {
      req._user = jwt.verify(token, process.env.JWT_SECRET);
      next();
   } catch (e) {
      res.status(401).json({
         error: true,
      });
   }
}
