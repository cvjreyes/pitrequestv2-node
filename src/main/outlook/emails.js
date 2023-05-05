import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import url from "url";

import { getName } from "../../helpers/usersname.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transport = nodemailer.createTransport({
  host: "es001vs0064",
  port: 25,
  secure: false,
  auth: {
    user: process.env.NODE_NODEMAILER_EMAIL,
    pass: process.env.NODE_NODEMAILER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const options = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve(__dirname, "views"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "views"),
  extName: ".handlebars",
};

transport.use("compile", hbs(options));

export async function sendEmail({ email, subject, template, link }) {
  const mailOptions = {
    from: process.env.NODE_NODEMAILER_EMAIL,
    replyTo: process.env.NODE_NODEMAILER_EMAIL,
    to: email,
    subject,
    template,
    context: {
      name: getName(email),
      link,
    },
    attachments: [
      {
        filename: "technip.png",
        path: __dirname + "/views/assets/technip.png",
        cid: "technip", //same cid value as in the html img src
      },
    ],
  };
  try {
    transport.sendMail(mailOptions, function (err) {
      if (err) {
        console.error("err: ", err);
        throw err;
      }
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
