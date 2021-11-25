import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import "dotenv/config";
import { createUser, getUsers, getUserByPk } from "./controllers/user-controller";
const app = express();
const port = process.env.PORT || 3000;
const staticDirPath = path.resolve(__dirname, "../public");

app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
   res.send({
      message: true,
   });
});

app.post("/user", async (req, res) => {
   const newUser = await createUser(req.body);
   res.send(newUser);
});

app.get("/user", async (req, res) => {
   const users = await getUsers();
   res.send(users);
});

app.get("/user/:id", async (req, res) => {
   const user = await getUserByPk(req.params.id);
   res.send(user);
});

app.use(express.static(staticDirPath));

app.get("*", function (req, res) {
   res.sendFile(staticDirPath + "./index.html");
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
