// import { MailtrapClient } from "mailtrap";
import nodemailer from "nodemailer";
import { privateKey } from "../../config/privateKeys.js";
const { createTransport } = nodemailer;
// import fs from "node:fs";
// import path from "node:path";

// const TOKEN = "62f9c69f19411d137c3db98003888b68";
// const SENDER_EMAIL = "tutionsearch1@gmail.com";

// const client = new MailtrapClient({ token: TOKEN });
// const sender = { name: "Tutition Search", email: SENDER_EMAIL };

// export const sendEmail = async (email, otp) => {
//   try {
//     const response = await client.send({
//       category: "prod",
//       custom_variables: {
//         hello: email.to,
//         year: new Date().getFullYear(),
//         anticipated: true,
//       },
//       from: sender,
//       to: [{ email: email.to }],
//       subject: "Hello from Tuition Search!",
//       html: `
// 			<!doctype html>
// 			<html>
// 				<head>
// 					<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
// 					<style>
// 						.main { background-color: white; }
// 						a:hover { border-left-width: 1em; min-height: 2em; }
// 					</style>
// 				</head>
// 				<body style="font-family: sans-serif;">
// 					<div style="display: block; margin: auto; max-width: 600px;" class="main">
// 						<h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Reset password for the Tuition Search!</h1>
// 						<p>Here is your OTP to reset the password</p>
// 						<h3>${otp}</h3>
// 					</div>
// 				</body>
// 			</html>
// 		`,
//       // attachments: [
//       //   {
//       //     filename: "welcome.png",
//       //     content_id: "welcome.png",
//       //     disposition: "inline",
//       //     content: welcomeImage,
//       //   },
//       // ],
//     });
//     console.log(response);
//     return {
//       data: response,
//       success: true,
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       data: error,
//       success: false,
//     };
//   }
// };

export const sendEmail = async (toMail) =>
  new Promise((resolve, reject) => {
    // const transport = nodemailer.createTransport({
    //   host: "sandbox.smtp.mailtrap.io",
    //   port: 2525,
    //   auth: {
    //     user: "22698cc42f3e7d",
    //     pass: "dff1bfbbc0ba3d",
    //   },
    // });
    const transport = createTransport({
      service: "gmail",
      auth: {
        user: privateKey.EMAIL,
        pass: privateKey.PASSWORD,
      },
    });

    transport.sendMail(toMail, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response.messageId);
      }
      transport.close();
    });
  });
