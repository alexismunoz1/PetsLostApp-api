import { User } from "../models/index";

export const UserController = {
   async findOrCreateUser(userData) {
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

   async findUserByEmail(email) {
      return await User.findOne({
         where: { email: email },
      });
   },

   async findUserById(id) {
      return await User.findByPk(id);
   },

   async getUsers() {
      return await User.findAll();
   },
};
