const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
dotenv.config({path: './config.env' })

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

// define a function to send an email
function sendEmail(email, subject, message) {
  // set up the email options
  let mailOptions = {
    from: process.env.USER,
    to: email,
    subject: subject,
    text: message
  };

  // send the email
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = sendEmail;