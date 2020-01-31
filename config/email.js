require('dotenv').config();
const nodemailer = require('nodemailer');

const Email = require('email-templates');

let environment = process.env;

const transporter = nodemailer.createTransport({
    service: environment.EMAIL_SERVICE_NAME,
    host: environment.EMAIL_SERVICE_HOST,
    secure:environment.EMAIL_SERVICE_SECURE,
    port: environment.EMAIL_SERVICE_PORT,
    auth: {
        user: environment.EMAIL_USER_NAME,
        pass: environment.EMAIL_USER_PASSWORD
    }
});

const email = new Email({
    transport: transporter,
    send: true,
    preview: false,
    views: {
      options: {
        extension: 'hbs',
      },
      root: 'view/email',
    },
  });

module.exports.email = email