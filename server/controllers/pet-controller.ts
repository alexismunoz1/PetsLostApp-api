import { Pet, User } from "../models/index";

export const petController = {
   async createNewLostPet(
      userId: number,
      petname: string,
      lat: string,
      lng: string,
      ubication: string,
      petimage
   ): Promise<Pet> {
      // Método para crear una mascota.
      const defaultPetState: string = "lost";

      const pet: Pet = await Pet.create({
         petname,
         petstate: defaultPetState,
         lat,
         lng,
         ubication,
         petimage,
         userId,
      });

      return pet;
   },

   async updatePet(
      userId: number,
      petid: number,
      petname: string,
      lat: string,
      lng: string,
      ubication: string,
      petimage
   ): Promise<Pet> {
      // Método para actualizar los datos de una mascota.

      // Se busca al usuario que está actualmente autenticado,
      // y se busca una mascota con el id que se recibe en la petición.
      const pet: Pet = await (
         await User.findByPk(userId, {
            include: { model: Pet, where: { id: petid } },
         })
      ).get("pets")[0];

      if (pet) {
         pet.update({
            petname,
            lat,
            lng,
            ubication,
            petimage,
         });

         return pet;
      } else {
         return null;
      }
   },

   async statePet(userid, petid, petstate) {
      // Método para actualizar el estado de una mascota.
      // Si esta perdido "lost", si fue encontrado "found".
      const pet: Pet = await (
         await User.findByPk(userid, {
            include: { model: Pet, where: { id: petid } },
         })
      ).get("pets")[0];

      if (pet) {
         pet.update({
            petstate,
         });

         return pet;
      } else {
         return null;
      }
   },

   async getPetsByUserId(userId: number): Promise<any> {
      // Método para obtener todas las mascotas del usuario autenticado.
      const pets = await (
         await User.findByPk(userId, {
            include: [{ model: Pet }],
         })
      ).get("pets");

      if (pets) {
         return pets;
      } else {
         return null;
      }
   },

   async getPetById(userId, petId): Promise<any> {
      // Método para obtener una mascota por su id.
      const pet = await (
         await User.findByPk(userId, {
            include: { model: Pet, where: { id: petId } },
         })
      ).get("pets");

      if (pet) {
         return pet;
      } else {
         return null;
      }
   },

   async getPetByName(userId: number, petName: string): Promise<any> {
      // Método para obtener una mascota por su nombre.
      const pet = await (
         await User.findByPk(userId, {
            include: { model: Pet, where: { petname: petName } },
         })
      ).get("pets");

      if (pet) {
         return pet;
      } else {
         return null;
      }
   },

   async deletePet(userId: number, petId: number): Promise<any> {
      // Método para eliminar una mascota.
      const pet = await (
         await User.findByPk(userId, {
            include: { model: Pet, where: { id: petId } },
         })
      ).get("pets")[0];

      if (pet) {
         pet.destroy();
         return pet;
      } else {
         return null;
      }
   },
};
