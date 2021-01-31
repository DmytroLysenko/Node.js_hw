const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM;
const DOMAIN = process.env.DOMAIN;

async function sendVerificationEmail(mail, verificationToken) {
  try {
    const msg = {
      to: mail,
      from: EMAIL_FROM,
      subject: "Node HW: Verify email",
      text: `Follow link for verifying your email: ${DOMAIN}/api/auth/verify/${verificationToken}`,
      html: `<strong>Click link for verifying your email: <a href="${DOMAIN}/api/auth/verify/${verificationToken}">Click here</a> </strong>`,
    };
    await sgMail.send(msg);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  sendVerificationEmail,
};
