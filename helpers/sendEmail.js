const nodemailer = require("nodemailer");
require("dotenv").config();
// const { PASSWORD_META } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "reshta_ira@meta.ua",
    pass: "5svH7Dj7C3",
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "reshta_ira@meta.ua" };
  await transport.sendMail(email);
  return true;
};

module.exports = { sendEmail };
