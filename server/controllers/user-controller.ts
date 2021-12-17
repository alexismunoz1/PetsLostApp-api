import { User } from "../models/index";

export const userController = {
   async createUser(fullname: string, email: string): Promise<User> {
      // Método para crear un nuevo usuario.
      try {
         return await User.create({
            fullname,
            email,
         });
      } catch (error) {
         throw new Error(error);
      }
   },

   async updateDataUser(userId: number, fullname: any, email: any): Promise<User> {
      // Método para actualizar los datos de un usuario.
      const user = await User.findByPk(userId);
      const currentFullname = user.get("fullname");
      const currentEmail = user.get("email");

      if (!fullname && fullname == "") {
         fullname = currentFullname;
      }
      if (!email) {
         email = currentEmail;
      }

      if (user) {
         return await user.update({
            fullname,
            email,
         });
      } else {
         return null;
      }
   },

   async findUserByEmail(email: string): Promise<User> {
      // Método para buscar un usuario por su email.
      try {
         return await User.findOne({
            where: { email: email },
         });
      } catch (error) {
         throw new Error(error);
      }
   },

   async findUserById(id: number): Promise<User> {
      // Método para buscar un usuario por su id.
      try {
         return await User.findByPk(id);
      } catch (error) {
         throw new Error(error);
      }
   },

   async getUsers(): Promise<User[]> {
      // Método para obtener todos los usuarios.
      try {
         return await User.findAll();
      } catch (error) {
         throw new Error(error);
      }
   },
};
