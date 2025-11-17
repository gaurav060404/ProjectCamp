import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Poject Camp",
      link: "https://projectcamp.com",
    },
  });
  const emailTextual = mailGenerator.generatePlaintext(options.mailGenContent);
  const emailHTML = mailGenerator.generate(options.mailGenContent);

  let transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.projectcamp@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHTML,
  };

  try {
    await transport.sendMail(mail);
  } catch (error) {
    console.error("Error occured while sending the email: ", error);
  }
};

const verifyEmailTemplate = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to ProjectCamp! We\'re excited to have you on board",
      action: {
        instructions:
          "To get started with ProjectCamp, Click here to verify your email",
        button: {
          color: "#52D5B6",
          text: "Verify your account",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we\'d love to help",
    },
  };
};

const forgotPasswordEmailTemplate = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions: "To reset your password, click on the below button",
        button: {
          color: "#d93737ff",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we\'d love to help.",
    },
  };
};

export { verifyEmailTemplate, forgotPasswordEmailTemplate, sendEmail };
