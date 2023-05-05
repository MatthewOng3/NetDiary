// const nodemailer = require('nodemailer')

// async function sendEmailVerification(email, subject, text){
//     try{
//         const transporter = nodemailer.createTransport({
// 			host: "smtp.gmail.com", 
// 			service: "gmail",
// 			port: 587,
// 			secure: true,
// 			auth: {
// 				user: "netdiary0@gmail.com",
// 				pass:  "ongyouzhi1998",
// 			},
// 		});

// 		await transporter.sendMail({
// 			from: "netdiary0@gmail.com",
// 			to: email,
// 			subject: subject,
// 			text: text,
// 		});
// 		console.log("email sent successfully");
//     }
//     catch(err){
//         console.log(err, "email not sent")
//     }
// }

// module.exports = {sendEmailVerification}