import nodemailer from "nodemailer";

// ? For production
export const SendEmail = async (To: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_AUTH,
                pass: process.env.PASSWORD_AUTH,
            },
        });

        const mailOptions = {
            from: `"Next Learn" <${process.env.EMAIL_AUTH}>`,
            to: To,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email. Check your SMTP settings.");
    }
};

// ! For testing/dev
// export const emailAuthentication = async (To: string, subject: string, html: string) => {
//     try {
//         const testAccount = await nodemailer.createTestAccount();

//         const transporter = nodemailer.createTransport({
//             host: testAccount.smtp.host,
//             port: testAccount.smtp.port,
//             secure: testAccount.smtp.secure,
//             auth: {
//                 user: testAccount.user,
//                 pass: testAccount.pass,
//             },
//         });

//         const mailOptions = {
//             from: `"Next Learn | NEUB" <${testAccount.user}>`,
//             to: To,
//             subject: subject,
//             html: html,
//         };

//         const info = await transporter.sendMail(mailOptions);

//         console.log("✅ Message sent:", info.messageId);
//         console.log("💌 Preview URL:", nodemailer.getTestMessageUrl(info));

//         return true;
//     } catch (error) {
//         console.error("❌ Error sending email:", error);
//         throw new Error("Failed to send email. Check your SMTP settings.");
//     }
// };