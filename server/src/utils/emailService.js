const nodemailer = require("nodemailer");
const config = require("config");
const server = config.get("server");
const auth = config.get("auth");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: auth.EMAIL_ID,
    pass: auth.PSWD,
  },
});

module.exports = transporter;
