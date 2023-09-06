// eslint-disable-next-line import/no-extraneous-dependencies
const mailer = require("nodemailer");

const sendEmail = async (options) => {
  //1)create transporter (the service to send email with it .....like mailtrap, gmail,mailgun,sendGrid )
  const transporter = mailer.createTransport({
    service:'gmail',
    auth: {
      user: process.env.EMAIL_USER, //the gmail where i will send from it
      pass: process.env.EMAIL_PASSWORD, //from app access in the gmail account
    },
  });
  //2)define email option (from ,to ,subject,content)
  const mailOptions = {
    from: "E-shop app <c.aboodmagdy@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3)send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
