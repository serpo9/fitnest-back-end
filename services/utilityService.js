const appConfig = require('../config/appConfig'); // ✅ Correct

const Logger = require("../services/loggerService");
const sqlService = require("../services/sqlService");
const PDFDocument = require('pdfkit');
const streamBuffers = require('stream-buffers');
const { WritableStreamBuffer } = require('stream-buffers');

const stream = new WritableStreamBuffer();
const fs = require('fs');
// const AppError = require("services/errorHandlingService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const authMiddleware = require("middleware/auth.middleware");
const nodemailer = require("nodemailer");
const axios = require("axios");
// const { UserDetail } = require('otpless-node-js-auth-sdk');

const utilityFunction = {
  removeWhiteSpace: function (str) {
    return str.replace(" ", "");
  },

  validatePhone: function (phone) {
    let phoneLength = phone.toString().length;
    if (phoneLength == 10) {
      return true;
    } else {
      return false;
    }
  },

  validateEmail: function (email) {
    let at = email.indexOf("@");
    let dot = email.lastIndexOf(".");
    return (
      email.length > 0 &&
      at > 0 &&
      dot > at + 1 &&
      dot < email.length &&
      email[at + 1] !== "." &&
      email.indexOf(" ") === -1 &&
      email.indexOf("..") === -1
    );
  },

  validateName: function (name) {
    let checkSpacesForFirstAndLastName = name.split(" ");
    if (checkSpacesForFirstAndLastName.length > 3) {
      return false;
    } else {
      let chars = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        " ",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ];
      let validCharacters = true;
      let namestring = name.toString().split("");
      namestring.forEach(function (single) {
        if (chars.indexOf(single) == -1) {
          validCharacters = false;
        }
      });

      return validCharacters;
    }
  },

  generateOTP: (string_length = 6) => {
    let chars = "0123456789";
    let randomstring = "";
    for (let i = 0; i < string_length; i++) {
      let rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  },

  sendEmail: async (phone, email, cb) => {
    try {
      if (!phone || !email) {
        return cb({ success: false, message: "Phone and email are required!" });
      }

      // Generate OTP
      const otp = utilityFunction.generateOTP();
      // console.log(`Generated OTP: ${otp} for ${email}`);

      // Set OTP Expiry Time (2 minutes)
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 2);

      // Configure mail transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Email options
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
        html: `<p>Your OTP is: <b>${otp}</b>. It will expire in 2 minutes.</p>`,
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent:", info.messageId);

      // ✅ Delete old OTP before inserting a new one
      let deleteQuery = `DELETE FROM Verifications WHERE email="${email}"`;
      await sqlService.query(deleteQuery, async (deleteResponse) => {
        if (deleteResponse.success) {
          console.log(`Deleted old OTP for ${email}`);
        }

        // ✅ Insert new OTP into Verifications table
        let verificationData = {
          phone: phone,
          email: email,
          otp: otp,
          expiresAt: expirationTime,  // ✅ Added expiry time
        };

        await sqlService.insert(sqlService.Verifications, verificationData, (response) => {
          if (response.success) {
            // console.log("OTP inserted successfully!", response.data);
            return cb({ success: true, message: "OTP sent successfully!" });
          } else {
            console.error("Error inserting OTP:", response);
            return cb({ success: false, message: "Failed to save OTP. Try again!" });
          }
        });
      });

    } catch (error) {
      console.error("Error in sendEmail:", error);
      return cb({ success: false, message: "Internal Server Error" });
    }
  },



  sendOtpEmail: async (email, cb) => {
    const url = `${appConfig.url.otpBaseUrl}/send`;
    const clientId = process.env["CLIENT_ID"];
    const clientSecret = process.env["CLIENT_SECRET"];

    const data = {
      phoneNumber: "",
      email: email,
      channel: process.env["OTP_CHANNEL"],
      otpLength: 6,
      expiry: process.env["OTP_EXPIRY"],
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        clientId: clientId,
        clientSecret: clientSecret,
      },
    };

    try {
      if (email) {
        const response = await axios.post(url, data, config);
        console.log("OTP sent successfully:", response.data);

        const obj = {
          orderId: response.data.orderId,
          email: email,
        };

        if (response.data) {
          let sqlQuery = `SELECT * FROM verifications WHERE email="${email}"`;
          await sqlService.query(sqlQuery, async (res) => {
            // console.log('response...', res)
            if (res.data.length == 1) {
              sqlService.update(
                sqlService.Verifications,
                { orderId: response.data.orderId },
                { email: email },
                (res) => {
                  const data = res.data;
                  if (res.success) {
                    Logger.log("OrderId updated...", data);
                    cb({
                      success: true,
                      message: data,
                    });
                  } else {
                    Logger.error("error...", res);
                    cb({
                      success: false,
                      message: "Try again later!",
                    });
                  }
                }
              );
            } else {
              await sqlService.insert(sqlService.Verifications, obj, (res) => {
                const data = res.data;
                if (res.success) {
                  Logger.log("OrderId inserted....", data);
                  cb({
                    success: true,
                    message: data,
                  });
                } else {
                  Logger.error("error...", res);
                  cb({
                    success: false,
                    message: "Try again later!",
                  });
                }
              });
            }
          });
        } else {
          cb({
            error: true,
            message: "Technical Error sending OTP!",
          });
        }
      } else {
        cb({
          success: false,
          message: "Invalid email!",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  },

  verifyOTP: async (useremail, otp, cb) => {
    try {
      if (!useremail || !otp) {
        return cb({
          success: false,
          message: "Invalid parameters!",
        });
      }

      // Query the database to find the OTP record for the given email
      let sqlQuery = `SELECT * FROM verifications WHERE email="${useremail}"`;
      await sqlService.query(sqlQuery, async (res) => {
        if (!res.data || res.data.length === 0) {
          cb({
            success: false,
            message: "No verification record found for the provided email",
          });
          Logger.error("No verification record found for the provided email.");
          return;
        }

        const verification = res.data[0];
        const { otp: storedOtp, expiresAt } = verification;

        // Check if the OTP has expired
        const currentTime = new Date();
        if (currentTime > new Date(expiresAt)) {
          // OTP has expired
          cb({
            success: false,
            message: "OTP Expired!",
          });
          return;
        }

        // Check if the provided OTP matches the stored OTP
        if (storedOtp !== otp) {
          cb({
            success: false,
            message: "Incorrect OTP!",
          });
          return;
        }

        // OTP is valid, return success
        cb({
          success: true,
          message: "OTP Verified successfully!",
        });

        // Optional: Delete or mark the OTP as used after verification
        // await sqlService.delete(sqlService.Verifications, { email: useremail }); // If you want to delete the OTP after successful verification
      });
    } catch (error) {
      Logger.error("Error verifying OTP", error);
      cb({
        success: false,
        message: "Error while verifying OTP",
      });
    }
  },


  resendOTP: async (email, cb) => {
    const url = `${appConfig.url.otpBaseUrl}/resend`;
    const clientId = process.env["CLIENT_ID"];
    const clientSecret = process.env["CLIENT_SECRET"];

    const config = {
      headers: {
        "Content-Type": "application/json",
        clientId: clientId,
        clientSecret: clientSecret,
      },
    };

    let otpResponse;

    try {
      let sqlQuery = `SELECT * FROM verifications WHERE email='${email}'`;

      await sqlService.query(sqlQuery, async (res) => {
        let user = res.data[0];
        // Logger.log('User...', user);

        let data = {
          orderId: user.orderId,
        };

        otpResponse = await axios.post(url, data, config);
        // console.log('response from resend OTP...', otpResponse)

        let otpMsg = otpResponse.data;

        if (otpResponse.status != 200) {
          console.log("resend-otp failed...", otpResponse.data.message);
          cb({
            success: false,
            message: "Try it after sometime!",
          });
          return;
        }

        cb({ success: true, message: otpMsg });
      });
    } catch (err) {
      Logger.error("Error resending OTP:", err);
      cb({ success: false, message: "Error resending OTP" });
    }
  },

  forgotPasswordSendOTP: async (email, cb) => {
    try {
      await utilityFunction.sendOtpEmail(email, (result) => {
        if (result.success) {
          cb({
            success: true,
            message: result.message,
          });
        } else {
          cb({
            success: false,
            message: result.message,
          });
        }
      });
    } catch (err) {
      console.log("errr...", err);
      cb({ success: false, message: "Error while resetting password!" });
    }
  },

  verifyForgotPasswordOTP: async (useremail, otp, cb) => {
    try {
      if (useremail && otp) {
        utilityFunction.verifyOTP(useremail, otp, (result) => {
          if (result.success) {
            cb({
              success: true,
              message: result.message,
            });
          } else {
            cb({
              success: false,
              message: result.message,
            });
          }
        });
      } else {
        Logger.log("User email or otp is undefined..");
      }
    } catch (error) {
      cb({
        success: false,
        message: "Error while verifying OTP",
      });
    }
  },

  resetPassword: async (email, newPassword, newCPassword, cb) => {
    try {
      if (email && newPassword && newCPassword) {
        if (newPassword === newCPassword) {
          await sqlService.findOne(
            sqlService.Users,
            { email: email },
            async (response) => {
              if (!response.data.id) {
                cb({
                  success: false,
                  message: "No account found, Sign up!",
                });
              } else {
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);

                let obj = {
                  email: email,
                  password: hashedNewPassword,
                };

                await sqlService.update(
                  sqlService.Users,
                  obj,
                  { email: email },
                  (updateRes) => {
                    if (updateRes.data.length != 1) {
                      Logger.error("Couldn't update!");
                      cb({
                        success: false,
                        message: "Cannot update!",
                      });
                    } else {
                      cb({
                        success: true,
                        message: "Updated the password!",
                      });
                    }
                  }
                );
              }
            }
          );
        } else {
          Logger.warn("Password and confirm pass doesn't match!");
          cb({
            success: false,
            message: "Password doesn't match!",
          });
        }
      } else {
        Logger.warn("One of the Data is undefined...");
        cb({
          success: false,
          message: "Data is missing!",
        });
      }
    } catch (error) {
      cb({
        success: false,
        message: "Couldn't reset password, Try again later!",
      });
    }
  },

  generateEmailTemplate: async(subject, message)=> {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${subject}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 0;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #fff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #1976d2;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 24px;
              border-radius: 8px 8px 0 0;
            }
            .message {
              font-size: 16px;
              line-height: 1.6;
              color: #333;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #888;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">${subject}</div>
            <div class="message">${message.replace(/\n/g, "<br>")}</div>
            <div class="footer">This email was sent by Your App • ${new Date().getFullYear()}</div>
          </div>
        </body>
      </html>
    `;
  }
,

   generateInvoicePDF : async(invoiceData)=> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = new WritableStreamBuffer();
  
      doc.pipe(stream);
  
      // HEADER
      doc
        .fontSize(20)
        .fillColor('#333')
        .text(' GYM Membership Invoice', { align: 'center' })
        .moveDown(1);
  
      // Customer & Date
      doc
        .fontSize(12)
        .fillColor('#000')
        .text(`Invoice Date: ${invoiceData.date}`, { align: 'right' })
        .moveDown(0.5);
  
      doc
        .fontSize(12)
        .text(`Invoice To:`, { underline: true })
        .moveDown(0.2)
        .font('Helvetica-Bold')
        .text(`${invoiceData.customerName}`)
        .font('Helvetica')
        .moveDown(1);
  
      // Divider line
      doc
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .strokeColor('#cccccc')
        .stroke()
        .moveDown(1);
  
      // Invoice Details
      doc
        .fontSize(14)
        .text('Membership Plan', 60)
        .text('Amount', 450, doc.y - 15)
        .moveDown(0.5);
  
      doc
        .fontSize(11)
        .text(invoiceData.items[0].name || 'Standard Plan', 60)
        .text(`₹${invoiceData.items[0].price}`, 450, doc.y - 15)
        .moveDown(1);
  
      // Total Section
      doc
        .fontSize(14)
        .fillColor('#000')
        .text('Total Amount:', 60)
        .font('Helvetica-Bold')
        .text(`₹${invoiceData.total}`, 450, doc.y - 15)
        .font('Helvetica')
        .moveDown(2);
  
      // Footer
      doc
        .fontSize(10)
        .fillColor('#999')
        .text('Thank you for choosing our gym!', { align: 'center' })
        .text('For any queries, contact us at support@gym.com', { align: 'center' });
  
      doc.end();
  
      stream.on('finish', () => {
        const buffer = stream.getContents();
        resolve(buffer);
      });
  
      stream.on('error', (err) => reject(err));
    });
  
  
  },

 



  


  calculateWeekendDays: async (month, year) => {
    let weekends = 0;
    const daysInMonth = new Date(year, month, 0).getDate(); // 0 gives last day of prev month (i.e., current)

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay(); // Sunday = 0, Saturday = 6
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends++;
      }
    }

    return weekends;
  },

  logLeaveDates: async (adminId, userId, dates, type) => {

    try {
      if (typeof dates === 'string') {
        try {
          dates = JSON.parse(dates);
        } catch (e) {
          console.error("Failed to parse dates string:", dates);
          dates = [];
        }
      }

      dates = Array.isArray(dates) ? dates : [];

      const insertPromises = dates.map((date) => {
        return new Promise((resolve) => {
          const insertObj = {
            adminId,
            userId,
            leaveDate: date,
            leaveType: type, // 'Public' or 'Private'
            isCancelled: 'false'
          };

          sqlService.insert(sqlService.LeaveDetails, insertObj, (res) => {
            if (!res.success) {
              console.error("Error logging leave:", res);
            }
            resolve(res); // Always resolve to not stop Promise.all midway
          });
        });
      });

      await Promise.all(insertPromises);
      return { success: true };
    } catch (err) {
      console.error("Unexpected error in logLeaveDates:", err);
      return { success: false, error: err.message };
    }
  }

}

module.exports = utilityFunction;
