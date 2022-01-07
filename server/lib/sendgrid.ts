const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendgridFunction(to, petname, fullname, phonenumber, report) {
   return await sgMail
      .send({
         to, // Change to your recipient
         from: "miguelalexmunoz79@gmail.com", // Change to your verified sender
         subject: `Alguien tiene informacion sobre ${petname}!!`,
         text: `Hola soy ${fullname} y tengo información sobre ${petname}.\nInfo: ${report}. \nPuedes comunicarte conmigo mediante este número de teléfono: ${phonenumber}`,
         html: `Hola soy <strong>${fullname}</strong> y tengo información sobre <strong>${petname}</strong>. <br /><strong>Info:</strong> ${report}. <br />Puedes comunicarte conmigo mediante este número de teléfono: <strong>${phonenumber}</strong>`,
      })
      .then(() => {
         console.log("Email sent");
      })
      .catch((error) => {
         console.error(error);
      });
}
