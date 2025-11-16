import Mailgen from "mailgen";

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

export { verifyEmailTemplate, forgotPasswordEmailTemplate };
