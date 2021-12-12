// modulos y dependencias
import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import "dotenv/config";

// controllers
import { authController } from "./controllers/auth-controller";
import { UserController } from "./controllers/user-controller";
import { PetController } from "./controllers/pet-controller";

// middlewares
import { authMiddle } from "./controllers/middlewares";
import { User } from "./models";

// inicializacion de express
const staticDirPath = path.resolve(__dirname, "../../dist");
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
   // endpoint para testear el servidor
   res.send({
      message: true,
   });
});

app.get("/users", async (req, res) => {
   // endpoint para traer todos los usuarios
   const users = await UserController.getUsers();
   res.send(users);
});

app.post("/auth/verify-email", async (req, res) => {
   // endpoint para verificar si el mail existe en la base de datos
   const { email } = req.body;
   const user = await UserController.findUserByEmail(email);
   if (user) {
      res.status(200).json(user);
   } else {
      res.status(404).json({ message: "User not found" });
   }
});

app.post("/auth", async (req, res) => {
   // endpoint para autenticar un usuario
   const user = await UserController.findOrCreateUser(req.body);
   const auth = await authController.findOrCreateAuth(req.body, user);

   if (user && auth) {
      res.status(200).json({ user, auth });
   } else {
      res.status(400).json({ error: "Unauthorized" });
   }
});

app.post("/auth/token", async (req, res) => {
   // endpoint para obtener el token de autenticacion
   const token = await authController.tokenFunction(req.body);
   if (token) {
      res.status(200).json(token);
   } else {
      res.status(404).json({ errors: "Invalid credentials" });
   }
});

app.get("/me", authMiddle, async (req, res) => {
   // endpoint para obtener el usuario autenticado
   const userId = req["_user"].id;
   const user = await UserController.findUserById(userId);
   if (user) {
      res.status(200).json(user);
   } else {
      res.status(400).json({ message: "Invalid credentials" });
   }
});

app.put("/me", authMiddle, async (req, res) => {
   // endpoint para actualizar los datos del usuario autenticado
   const userId = req["_user"].id;
   const user = await UserController.updateDataUser(userId, req.body);
   if (user) {
      res.status(200).json(user);
   } else {
      res.status(400).json({ error: "Invalid credentials" });
   }
});

app.post("/me/pets", authMiddle, async (req, res) => {
   // endpoint para crear una nueva mascota
   const userId = req["_user"].id;
   const pet = await PetController.createNewLostPet(req.body, userId);

   if (pet) {
      res.status(200).json(pet);
   } else {
      res.status(400).json({ error: "Invalid credentials" });
   }
});

app.put("/me/pets/:id", authMiddle, async (req, res) => {
   // endpoint para actualizar los datos de una mascota
   const userId = req["_user"].id;
   const petId = req.params.id;
   const pet = await PetController.updatePet(req.body, petId, userId);

   if (pet) {
      res.status(200).json(pet);
   } else {
      res.status(404).json({ error: "Pet id does not exist" });
   }
});

app.get("/me/pets", authMiddle, async (req, res) => {
   // endpoint para obtener las mascotas del usuario autenticado
   const userId = req["_user"].id;
   const pets = await PetController.getPetsByUserId(userId);

   if (pets) {
      res.status(200).json(pets);
   } else {
      res.status(400).json({ error: "Invalid credentials" });
   }
});

app.use(express.static(staticDirPath));

app.get("*", function (req, res) {
   staticDirPath + "/index.html";
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
