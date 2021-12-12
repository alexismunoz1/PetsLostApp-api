import { Pet, User, Auth } from "../models/index";

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

   async getPetsByUserId(userId: number) {
      const pets = await (
         await User.findByPk(userId, {
            include: [{ model: Pet }],
         })
      ).get("pets");

      return pets;
   },

   async updatePet(petNewData: any, petId: any, userId: any) {
      const { petname, lat, lng } = petNewData;

      const pet = await (
         await User.findByPk(userId, {
            include: { model: Pet, where: { id: petId } },
         })
      ).get("pets")[0];

      pet.update({
         petname,
         lat,
         lng,
      });

      return pet;
   },
};
