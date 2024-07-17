const nodemailer = require('nodemailer');
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const { SENDGRID_API_KEY } = process.env;

function replaceContent(content, creds) {
    let allkeysArr = Object.keys(creds);
    allkeysArr.forEach(function (key) {
        content = content.replace(`#{${key}}`, creds[key]);
    })

    return content;
}
async function EmailHelper(templateName, receiverEmail, creds) {
    // console.log(templateName, receiverEmail, creds)
    if (!templateName || !receiverEmail || !creds) {
        console.error("Invalid input parameters.");
        return;
    }
    try {
        const templatePath = path.join(__dirname, "email_templates", templateName);
        let content = await fs.promises.readFile(templatePath, "utf-8");
        content = replaceContent(content, creds); 
        const emailDetails = {
            to: receiverEmail,
            from: 'abhay.23bcs10181@sst.scaler.com', // Change to your verified sender
            subject: 'RESET OTP',
            text: `Hi ${creds.name} this your reset otp ${creds.otp}`,
            html: content,
        }
        const transportDetails = {
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: {
                user: "apikey",
                pass: SENDGRID_API_KEY
            }
        }

        const transporter = nodemailer.createTransport(transportDetails);
        await transporter.sendMail((emailDetails))
        console.log("Email sent successfully");
    } catch (err) {
        console.error("Failed to send email:", err);
    }

}

module.exports = EmailHelper;