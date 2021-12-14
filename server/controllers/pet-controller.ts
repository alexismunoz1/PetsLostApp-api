import { Pet, User } from "../models/index";

export const petController = {
   // Método para crear una mascota.
   async createNewLostPet(petData, userId) {
      const { petname, petstate, lat, lng } = petData;

      const pet = await Pet.create({
         petname,
         petstate,
         lat,
         lng,
         userId,
      });

      return pet;
   },

   // Método para actualizar los datos de una mascota.
   async updatePet(petNewData, userId) {
      let { petname, newpetname, petstate, lat, lng } = petNewData;
      if (!newpetname) {
         newpetname = petname;
      }

      const pet = await (
         await User.findByPk(userId, {
            include: { model: Pet, where: { petname: petname } },
         })
      ).get("pets")[0];

      pet.update({
         petname: newpetname,
         petstate,
         lat,
         lng,
      });

      return pet;
   },

   // Método para obtener todas las mascotas del usuario autenticado.
   async getPetsByUserId(userId: number) {
      const pets = await (
         await User.findByPk(userId, {
            include: [{ model: Pet }],
         })
      ).get("pets");

      return pets;
   },

   // Método para obtener una mascota por su nombre.
   async findPetByName(userId, petName) {
      const pet = await (
         await User.findByPk(userId, {
            include: { model: Pet, where: { petname: petName } },
         })
      ).get("pets");

      return pet;
   },

   // Método para eliminar una mascota.
   async deletePet(petData, userId) {
      const { petname } = petData;

      const pet = await (
         await User.findByPk(userId, {
            include: { model: Pet, where: { petname: petname } },
         })
      ).get("pets")[0];

      pet.destroy();

      return pet;
   },
};
