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
import { uploadImageCloudinary } from "./controllers/cloudinary-controller";

// Middlewares
import { authMiddlewares } from "./controllers/middlewares";

// Inicializacion de express
const app = express();
app.use(
   express.json({
      limit: "100mb",
   })
);
app.use(cors());

// Puerto de la aplicacion en heroku o 3000 en local y asignacion de rutas
const staticDirPath = path.resolve(__dirname, "../../dist");
const port = process.env.PORT || 3000;

app.get("/test", (req, res) => {
   // Endpoint para testear el servidor
   res.send({
      message: true,
   });
});

app.get("/users", async (req, res) => {
   // Endpoint para traer todos los usuarios
   try {
      const users = await userController.getUsers();
      res.status(200).send(users);
   } catch (error) {
      res.status(500).send(error);
   }
});

app.post("/auth/verify-email", async (req, res) => {
   // Endpoint para verificar si el mail existe en la base de datos
   const { email } = req.body;
   const user = await userController.findUserByEmail(email);
   if (user) {
      res.status(200).json(user);
   } else {
      res.status(404).json({ message: "User does not exist" });
   }
});

app.post("/auth", async (req, res) => {
   // Endpoint para crear y autenticar un usuario
   const { fullname, email, password } = req.body;

   const user = await userController.createUser(fullname, email);
   const auth = await authController.findOrCreateAuth(email, password, user);

   if (user && auth) {
      res.status(200).json({ user, auth });
   } else {
      res.status(500).json({ message: "Error creating user" });
   }
});

app.post("/auth/token", async (req, res) => {
   // Endpoint para obtener el token de autenticacion
   const { email, password } = req.body;
   const token = await authController.tokenFunction(email, password);

   if (token) {
      res.status(200).json(token);
   } else {
      res.status(500).json({ message: "Email or password incorrect" });
   }
});

app.get("/me", authMiddlewares, async (req, res) => {
   // Endpoint para obtener el usuario autenticado
   const userId = req["_user"].id;

   const user = await userController.findUserById(userId);
   res.status(200).json(user);
});

app.put("/me", authMiddlewares, async (req, res) => {
   // Endpoint para actualizar los datos del usuario autenticado
   const userId = req["_user"].id;
   const { fullname, email } = req.body;

   const user = await userController.updateDataUser(userId, fullname, email);

   if (user) {
      res.status(200).json(user);
   } else {
      res.status(500).json({ message: "Error updating user" });
   }
});

app.post("/me/pets", authMiddlewares, async (req, res) => {
   // Endpoint para crear una nueva mascota
   const userId = req["_user"].id;
   const { petname, lat, lng, petimage } = req.body;

   const imageUrl = await uploadImageCloudinary(petimage);
   const pet = await petController.createNewLostPet(userId, petname, lat, lng);

   if (pet) {
      const petInAlgolia = await algoliaController.addPetInAlgolia(pet);
      if (petInAlgolia) {
         res.status(200).json({ pet, petInAlgolia });
      }
   } else {
      res.status(500).json({ message: "Error creating pet" });
   }
});

app.put("/me/pets", authMiddlewares, async (req, res) => {
   // Endpoint para actualizar los datos de una mascota
   const userId = req["_user"].id;
   const { petid, petname, petstate, lat, lng } = req.body;

   // const imageUri = await cloudinaryController.uploadImageCloudinary(petimage);

   const pet = await petController.updatePet(userId, petid, petname, petstate, lat, lng);

   if (pet) {
      const updatePetInAlgolia = await algoliaController.updatePetInAlgolia(pet);

      if (updatePetInAlgolia) {
         res.status(200).json({ pet, updatePetInAlgolia });
      }
   } else {
      res.status(500).json({ message: "Error updating pet" });
   }
});

app.get("/me/pets", authMiddlewares, async (req, res) => {
   // Endpoint para obtener las mascotas del usuario autenticado
   const userId = req["_user"].id;
   const { petname } = req.body;

   // Si se introduce un nombre de mascota en el body,
   // se filtra por el nombre de la mascota, del usuario autenticado.
   // Si no se introduce nada, se traen todas las mascotas del usuario autenticado.
   try {
      if (petname) {
         const pet = await petController.findPetByName(userId, petname);

         res.status(200).json(pet);
      } else {
         const pets = await petController.getPetsByUserId(userId);
         res.status(200).json(pets);
      }
   } catch (error) {
      res.status(500).json({ message: "Error getting pets" });
   }
});

app.delete("/me/pets", authMiddlewares, async (req, res) => {
   // Endpoint para eliminar una mascota del usuario autenticado
   const userId = req["_user"].id;
   const { petid } = req.body;

   try {
      const pet = await petController.deletePet(userId, petid);
      await algoliaController.deletePetInAlgolia(pet);

      res.status(200).json({ message: "Pet deleted" });
   } catch (error) {
      res.status(500).json({ message: "Error deleting pet" });
   }
});

app.get("/pets/around", async (req, res) => {
   // Endpoint para obtener las mascotas cercanas a una ubicacion
   const { lat, lng } = req.query;
   const { distance, petstate } = req.body;

   try {
      const pets = await algoliaController.searchPetsInAlgoliaByLocation(
         lat,
         lng,
         distance,
         petstate
      );
      res.status(200).json(pets);
   } catch (error) {
      res.status(500).json({ message: "Error getting pets", error });
   }
});

app.use(express.static(staticDirPath));

// Static files
app.get("*", function (req, res) {
   staticDirPath + "/index.html";
});

// Listen on port
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
