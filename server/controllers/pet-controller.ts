import { Pet } from "../models/index";

export const PetController = {
   async createNewLostPet(petData, userId) {
      const { petname, lat, lng } = petData;

      const pet = await Pet.create({
         petname,
         lat,
         lng,
         userId,
      });

      return pet;
   },
};
