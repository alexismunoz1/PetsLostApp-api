import { Report, User, Pet } from "../models";

export const reportController = {
   // Metodo para crear un reporte
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
