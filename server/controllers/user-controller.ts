import { User } from "../models/user";

export async function createUser(userData) {
   const { fullname, email } = userData;
   if (!fullname || !email) {
      throw "fullname and email are required";
   }

   const user = await User.create(userData);
   return user;
}

export async function getUsers() {
   const users = await User.findAll({});
   return users;
}

export async function getUserByPk(id: string) {
   const user = await User.findByPk(id);
   return user;
}
