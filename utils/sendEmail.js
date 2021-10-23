const nodemailer = require("nodemailer");

// const sendEmail = async (email, subject, text) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       service: "smtp",
//       port: 465,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       secure: true,
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: subject,
//       text: text,
//     });
//     console.log("email sent sucessfully");
//   } catch (error) {
//     console.log(error, "email not sent");
//   }
// };

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.@gmail.com",
//     port: 5,
//     // secure: true,
//     // host: process.env.EMAIL_HOST,
//     // port: process.env.EMAIL_PORT,

//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: options.email,
//     subject: options.message,
//     // html:
//   };

//   await transporter.sendMail(mailOptions);
// };

class EmailService {
  transporter;
  static init() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: true,
    });
  }
  static async sendEmail(to, subject, text, html) {
    const from = process.env.EMAIL_USER;
    await this.transporter.sendMail({ from, to, subject, text, html });
  }
}

// class EmailSender {
//   transport;
//   constructor() {
//     this.transport = NodeMailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       secure: true,
//     });
//   }

//   async sendMessage(to, subject, text, html) {
//     let mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text,
//       html,
//     };
//     await this.transport.sendMail(mailOptions);
//   }
// }
// module.exports = sendEmail;
module.exports = EmailService;
