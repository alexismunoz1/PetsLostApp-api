import { User } from "../models/index";

export const UserController = {
   async findOrCreateUser(userData: any) {
      const { fullname, email } = userData;

      const [user, created] = await User.findOrCreate({
         where: { email: email },
         defaults: {
            fullname,
            email,
         },
      });

      return user;
   },

   async updateDataUser(userId: number, newData: any) {
      const { fullname, email } = newData;

      const user = await User.findByPk(userId);

      return await user.update({
         fullname,
         email,
      });
   },

   async getUserPets(userId) {},

   async findUserByEmail(email: string) {
      return await User.findOne({
         where: { email: email },
      });
   },

   async findUserById(id: number) {
      return await User.findByPk(id);
   },

   async getUsers() {
      return await User.findAll();
   },
};
