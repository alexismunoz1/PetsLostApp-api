import { User } from "../models/index";

export const userController = {
   // Método para crear un nuevo usuario.
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

   // Método para actualizar los datos de un usuario.
   async updateDataUser(userId: number, newData: any) {
      const { fullname, email } = newData;

      const user = await User.findByPk(userId);

      return await user.update({
         fullname,
         email,
      });
   },

   // Método para buscar un usuario por su email.
   async findUserByEmail(email: string) {
      return await User.findOne({
         where: { email: email },
      });
   },

   // Método para buscar un usuario por su id.
   async findUserById(id: number) {
      return await User.findByPk(id);
   },

   // Método para obtener todos los usuarios.
   async getUsers() {
      return await User.findAll();
   },
};
