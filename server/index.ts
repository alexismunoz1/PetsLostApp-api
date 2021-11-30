import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import "dotenv/config";

import { findOrCreateAuth, authFunction } from "./controllers/auth-controller";
import { findOrCreateUser, getUsers, findUserById } from "./controllers/user-controller";
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
   const users = await getUsers();
   res.send(users);
});

//Singup
app.post("/auth", async (req, res) => {
   const user = await findOrCreateUser(req.body);
   const auth = await findOrCreateAuth(req.body, user);

   if (auth) {
      res.status(200).json({ user, auth });
   } else {
      res.status(400).json({ error: "Unauthorized" });
   }
});

//login
app.post("/auth/token", async (req, res) => {
   const auth = await authFunction(req.body);
   if (auth) {
      res.status(200).json(auth);
   } else {
      res.status(400).json({ message: "Invalid credentials" });
   }
});

app.get("/me", authMiddleware, async (req, res) => {
   const user = await findUserById(req["_user"].id);
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
