const DigestClient = require("digest-fetch");
require("dotenv").config();
const utilityService = require("../services/utilityService");
const sqlService = require("../services/sqlService");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const devices = require("../config/device");
const { Json } = require("sequelize/lib/utils");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});


const notificationController = {
sendnotification : async(req,res,next)=>{
  const { users, subject, message } = req.body;
let usersForMail = JSON.parse(users);
   if (!Array.isArray(usersForMail) || usersForMail.length === 0) {
    return res.status(400).json({ success: false, message: 'No users provided.' });
  }

  const results = [];

  for (const user of usersForMail) {
    const { email, phone } = user;
    const result = { email, phone, emailSent: false, smsSent: false };

    // Send Email
    try {
      if (email) {
        await transporter.sendMail({
          from: `<${process.env.SMTP_FROM}>`,
          to: email,
          subject: subject,
          text: message,
          html:await utilityService.generateEmailTemplate(subject, message)
        });
        result.emailSent = true;
      }
    } catch (err) {
      console.error(`Email error for ${email}:`, err.message);
    }

    // // Send SMS
    // try {
    //   if (phone) {
    //     await twilioClient.messages.create({
    //       body: message,
    //       from: process.env.TWILIO_PHONE,
    //       to: phone
    //     });
    //     result.smsSent = true;
    //   }
    // } catch (err) {
    //   console.error(`SMS error for ${phone}:`, err.message);
    // }

    results.push(result);
  }

  res.status(200).json({ success: true, results });

}	
,
sendInvoice: async (req, res) => {
  try {
    const invoiceData = req.body;

    if (!invoiceData.email || !invoiceData.items || !invoiceData.total) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const pdfBuffer = await utilityService.generateInvoicePDF(invoiceData);

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: invoiceData.email,
      subject: `Invoice - ${invoiceData.invoiceId}`,
      html: `
        <p>Hello ${invoiceData.customerName},</p>
        <p>Please find your invoice attached for your recent purchase.</p>
        <p>Thank you!</p>
      `,
      attachments: [
        {
          filename: `Invoice-${invoiceData.invoiceId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }
      ]
    });

    res.status(200).json({ success: true, message: "Invoice sent successfully." });
  } catch (error) {
    console.error("Error sending invoice:", error);
    res.status(500).json({ success: false, message: "Failed to send invoice." });
  }
}

}
;

module.exports = notificationController;




