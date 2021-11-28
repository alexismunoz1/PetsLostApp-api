import { User } from "../models/user";

export async function findOrCreateUser(userData) {
   const { fullname, email } = userData;
   if (!fullname || !email) {
      throw "fullname and email are required";
   }

   const [user, created] = await User.findOrCreate({
      where: { email: email },
      defaults: {
         fullname,
         email,
      },
   });

   return user;
}

export async function getUsers() {
   return await User.findAll();
}
