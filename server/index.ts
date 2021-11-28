import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import "dotenv/config";

import { findOrCreateAuth, authFunction } from "./controllers/auth-controller";
import { findOrCreateUser, getUsers } from "./controllers/user-controller";
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
      res.json({ user, auth });
   } else {
      res.status(400).json({ error: "Unauthorized" });
   }
});

//Singin
app.post("/auth/token", async (req, res) => {
   const auth = await authFunction(req.body);
   if (auth) {
      res.json(auth);
   } else {
      res.status(400).json({ message: "Invalid credentials" });
   }
});

app.get("/me", authMiddleware, async (req, res) => {
   res.json(req["_user"]);
});

app.use(express.static(staticDirPath));

app.get("*", function (req, res) {
   res.sendFile(staticDirPath + "/index.html");
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
