const nodemailer = require('nodemailer');
const transportMailer = nodemailer.createTransport({
    // host: 'smtp.mailtrap.io',
    // port: 2525,
    service: 'gmail',
    auth: {
       user: 'saif.cloudwapp@gmail.com',
       pass: 'saifcloud'
    }
});


module.exports = transportMailer;