const nodemailer = require('nodemailer');


    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'veridcorptest@gmail.com',
        pass: 'Veridcorp2017'
      }
    })
module.exports = transporter;;