const nodemailer = require("nodemailer");

const sendEmail = (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  console.log(email);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email.to,
    subject: email.subject,
    text: email.text,
    html: email.html,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err + "Error in sendEmail");
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;
