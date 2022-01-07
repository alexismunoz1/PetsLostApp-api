import { Report, User, Pet } from "../models";

export const reportController = {
   async sendReport(userId, petId, fullname, phonenumber, report) {
      const created = await Report.create({
         userId,
         petId,
         fullname,
         phonenumber,
         report,
      });
      const pet = await Pet.findByPk(petId, { include: [User] });
      return [created, pet];
   },
};
