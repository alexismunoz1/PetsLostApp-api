import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import "dotenv/config";

import { authController } from "./controllers/auth-controller";
import { UserController } from "./controllers/user-controller";
import { authMiddleware } from "./controllers/middlewares";

const staticDirPath = path.resolve(__dirname, "../../dist");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
   res.send({
      message: true,
   });
});

app.get("/users", async (req, res) => {
   const users = await UserController.getUsers();
   res.send(users);
});

// Buscar usuario por emial
app.post("/auth/verify-email", async (req, res) => {
   const { email } = req.body;
   const user = await UserController.findUserByEmail(email);
   if (user) {
      res.status(200).json(user);
   } else {
      res.status(404).json({ message: "User not found" });
   }
});

//Singup
app.post("/auth", async (req, res) => {
   const user = await UserController.findOrCreateUser(req.body);
   const auth = await authController.findOrCreateAuth(req.body, user);

   if (user && auth) {
      res.status(200).json({ user, auth });
   } else {
      res.status(400).json({ error: "Unauthorized" });
   }
});

//login
app.post("/auth/token", async (req, res) => {
   const token = await authController.tokenFunction(req.body);
   if (token) {
      res.status(200).json(token);
   } else {
      res.status(404).json({ message: "Invalid credentials" });
   }
});

app.get("/me", authMiddleware, async (req, res) => {
   const user = await UserController.findUserById(req["_user"].id);
   if (user) {
      res.status(200).json(user);
   } else {
      res.status(400).json({ message: "Invalid credentials" });
   }
});

app.use(express.static(staticDirPath));

app.get("*", function (req, res) {
   staticDirPath + "/index.html";
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
