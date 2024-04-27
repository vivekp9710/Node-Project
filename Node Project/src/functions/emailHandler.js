import nodeMailer from "nodemailer";
import ejs from "ejs";

let transpoter = nodeMailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "orlo.vonrueden@ethereal.email",
    pass: "9KZyYjtYKQKhCaYwty",
  },
});

export const sendMail = ({ from, to, subject, text, html }) => {
  transpoter.sendMail({ from, to, subject, text, html });
};

const otpGenerator = () => {
  let str = "1234567890";
  let code = "";
  for (let i = 0; i < 6; i++) {
    let num1 = Math.floor(Math.random() * str.length);
    code += str[num1];
  }
  return code;
}

export const sendOtp = (emails) => {
  let path = __dirname + "/emailtemplate/otp.ejs";
  let otp = otpGenerator();
  ejs.renderFile(path, { otp }, (err, res) => {
    let obj = {
      from: "vkp10@gmail.com",
      to: emails,
      subject: "otp for login",
      html: res,
    };
    sendMail(obj);
  });
  return otp;
};