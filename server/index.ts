// Modulos y dependencias
import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import "dotenv/config";

// Controllers
import { authController } from "./controllers/auth-controller";
import { userController } from "./controllers/user-controller";
import { petController } from "./controllers/pet-controller";
import { algoliaController } from "./controllers/algolia-controller";

// Middlewares
import { authMiddlewares } from "./controllers/middlewares";

// Inicializacion de express
const app = express();
app.use(express.json());
app.use(cors());

// Puerto de la aplicacion en heroku o 3000 en local y asignacion de rutas
const staticDirPath = path.resolve(__dirname, "../../dist");
const port = process.env.PORT || 3000;

// Endpoint para testear el servidor
app.get("/test", (req, res) => {
   res.send({
      message: true,
   });
});

// Endpoint para traer todos los usuarios
app.get("/users", async (req, res) => {
   const users = await userController.getUsers();
   res.send(users);
});

// Endpoint para verificar si el mail existe en la base de datos
app.post("/auth/verify-email", async (req, res) => {
   const { email } = req.body;
   const user = await userController.findUserByEmail(email);
   if (user) {
      res.status(200).json(user);
   } else {
      res.status(404).json({ message: "User not found" });
   }
});

// Endpoint para autenticar un usuario
app.post("/auth", async (req, res) => {
   const user = await userController.findOrCreateUser(req.body);
   const auth = await authController.findOrCreateAuth(req.body, user);

   if (user && auth) {
      res.status(200).json({ user, auth });
   } else {
      res.status(400).json({ error: "Unauthorized" });
   }
});

// Endpoint para obtener el token de autenticacion
app.post("/auth/token", async (req, res) => {
   const token = await authController.tokenFunction(req.body);
   if (token) {
      res.status(200).json(token);
   } else {
      res.status(404).json({ errors: "Invalid credentials" });
   }
});

// Endpoint para obtener el usuario autenticado
app.get("/me", authMiddlewares, async (req, res) => {
   const userId = req["_user"].id;
   const user = await userController.findUserById(userId);
   if (user) {
      res.status(200).json(user);
   } else {
      res.status(400).json({ message: "Invalid credentials" });
   }
});

// Endpoint para actualizar los datos del usuario autenticado
app.put("/me", authMiddlewares, async (req, res) => {
   const userId = req["_user"].id;
   const user = await userController.updateDataUser(userId, req.body);
   if (user) {
      res.status(200).json(user);
   } else {
      res.status(400).json({ error: "Invalid credentials" });
   }
});

// Endpoint para crear una nueva mascota
app.post("/me/pets", authMiddlewares, async (req, res) => {
   const userId = req["_user"].id;
   const pet = await petController.createNewLostPet(req.body, userId);
   const petInAlgolia = await algoliaController.addPetInAlgolia(pet);

   if (pet) {
      res.status(200).json({ pet, petInAlgolia });
   } else {
      res.status(400).json({ error: "Invalid credentials" });
   }
});

// Endpoint para actualizar los datos de una mascota
app.put("/me/pets", authMiddlewares, async (req, res) => {
   const userId = req["_user"].id;

   try {
      const pet = await petController.updatePet(req.body, userId);
      const updatePetInAlgolia = await algoliaController.updatePetInAlgolia(pet);

      res.status(200).json({ pet, updatePetInAlgolia });
   } catch (error) {
      res.send({ error });
   }
});

// Endpoint para obtener las mascotas del usuario autenticado
app.get("/me/pets", authMiddlewares, async (req, res) => {
   const userId = req["_user"].id;
   const { petname } = req.body;
   try {
      if (petname) {
         const pet = await petController.findPetByName(userId, petname);

         res.status(200).json(pet);
      } else {
         const pets = await petController.getPetsByUserId(userId);
         res.status(200).json(pets);
      }
   } catch (error) {
      res.send({ error });
   }
});

// Endpoint para eliminar una mascota del usuario autenticado
app.delete("/me/pets", authMiddlewares, async (req, res) => {
   const userId = req["_user"].id;

   try {
      const pet = await petController.deletePet(req.body, userId);
      const deletePetInAlgolia = await algoliaController.deletePetInAlgolia(pet);

      res.status(200).json({ message: "Pet deleted", pet, deletePetInAlgolia });
   } catch (error) {
      res.send({ error });
   }
});

// Endpoint para obtener las mascotas cercanas a una ubicacion
app.get("/pets/around", async (req, res) => {
   try {
      const pets = await algoliaController.searchPetsInAlgoliaByLocation(req.query);
      res.status(200).json(pets);
   } catch (error) {
      res.send({ error });
   }
});

app.use(express.static(staticDirPath));

app.get("*", function (req, res) {
   staticDirPath + "/index.html";
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
