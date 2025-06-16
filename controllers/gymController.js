const DigestClient = require("digest-fetch");
require("dotenv").config();
const utilityService = require("../services/utilityService");
const sqlService = require("../services/sqlService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const devices = require("../config/device");
const fs = require("fs");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const path = require("path");
const multer = require("multer");
const axios = require('axios');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "fitnestAssets/plans/dietplan";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("file");


// const authMiddleware = require("middleware/auth.middleware");
const express = require("express");
const { logger } = require("sequelize/lib/utils/logger");
// const moment = require('moment-timezone');


const registerAllUsers = async () => {
  userList = [
    { "name": "Dhan Raj Sharma", "employeeNo": "380" },
    { "name": "Nirmala Bhatt", "employeeNo": "00000337" },
    { "name": "Sarswati Bhatt", "employeeNo": "00000855" },
    { "name": "Nar singh Bohara", "employeeNo": "439" },
    { "name": "shristi bhatt", "employeeNo": "00001412" },
    { "name": "Aashana Ayer", "employeeNo": "00000624" },
    { "name": "Ramesh Prsad Bohara", "employeeNo": "00000334" },
    { "name": "Gyanu rawat", "employeeNo": "00000390" },
    { "name": "Raju Kunwar", "employeeNo": "332" },
    { "name": "Laxmi Chand", "employeeNo": "00001235" },
    { "name": "Abiral Chand", "employeeNo": "00000596" },
    { "name": "Anurag Bhatt", "employeeNo": "00000192" },
    { "name": "Dipesh Deuba", "employeeNo": "00000290" },
    { "name": "Niraj Deuba", "employeeNo": "00000791" },
    { "name": "Bishnu Prasad Kharel", "employeeNo": "00000320" },
    { "name": "Gyanendra Rawal", "employeeNo": "00000300" },
    { "name": "Dipendra Thakurathi", "employeeNo": "440" },
    { "name": "Bimal bist", "employeeNo": "00001431" },
    { "name": "Utkrishta rawal", "employeeNo": "00001250" },
    { "name": "Pankaj Rawal", "employeeNo": "00001157" },
    { "name": "Ganga Thapa", "employeeNo": "459" },
    { "name": "Saksham Gupta", "employeeNo": "386" },
    { "name": "Prabin Deuba", "employeeNo": "438" },
    { "name": "Ammar Singh Khadka", "employeeNo": "00000488" },
    { "name": "Anjali Chand", "employeeNo": "00001338" },
    { "name": "Kanchan Chand", "employeeNo": "00001345" },
    { "name": "Rajendra Khati", "employeeNo": "302" },
    { "name": "Karna Shahi", "employeeNo": "307" },
    { "name": "Parash Joshi", "employeeNo": "00001446" },
    { "name": "Laxman Kharel", "employeeNo": "00000161" },
    { "name": "Buddi thapa", "employeeNo": "0000001" },
    { "name": "Rupa Shresta", "employeeNo": "444" },
    { "name": "Babita Karki", "employeeNo": "445" },
    { "name": "Khakendara Karki", "employeeNo": "00000731" },
    { "name": "Shrisht Mahara", "employeeNo": "00001160" },
    { "name": "Sirjana Gahatra", "employeeNo": "460" },
    { "name": "Vishal Gurung", "employeeNo": "387" },
    { "name": "Yagya raj Awasthi", "employeeNo": "123" },
    { "name": "Andy pandey", "employeeNo": "00000240" },
    { "name": "Urmi thapa", "employeeNo": "00000010" },
    { "name": "Hemant Saud", "employeeNo": "373" },
    { "name": "piyush joshi", "employeeNo": "00001423" },
    { "name": "Krish Pant", "employeeNo": "312" },
    { "name": "Tapendra Thagunna", "employeeNo": "268" },
    { "name": "Anand Bhatt", "employeeNo": "442" },
    { "name": "Sunil Rokaya", "employeeNo": "347" },
    { "name": "Bharat Dhanuk", "employeeNo": "00000419" },
    { "name": "Himanshu Chand", "employeeNo": "00001447" },
    { "name": "Hritik Bhatt", "employeeNo": "391" },
    { "name": "Pankaj Pal", "employeeNo": "00001276" },
    { "name": "AatipBohara", "employeeNo": "216" },
    { "name": "Ashim K.c", "employeeNo": "00000186" },
    { "name": "Bibek shantanu", "employeeNo": "00000268" },
    { "name": "Kushal Pandey", "employeeNo": "00000406" },
    { "name": "Ansu Bist", "employeeNo": "00001456" },
    { "name": "Dinesh Bhatt", "employeeNo": "00001457" },
    { "name": "Paras Joshi", "employeeNo": "00000271" },
    { "name": "Vinod Pandey", "employeeNo": "00000249" },
    { "name": "Kishor Lekhak", "employeeNo": "00000179" },
    { "name": "Bikram Bist", "employeeNo": "394" },
    { "name": "Krish Joshi", "employeeNo": "260" },
    { "name": "Rohit Thapa", "employeeNo": "449" },
    { "name": "Bansh Chand", "employeeNo": "461" },
    { "name": "Aashrit Kahthayat", "employeeNo": "452" },
    { "name": "Janak Bohara", "employeeNo": "00000369" },
    { "name": "Suraj chand", "employeeNo": "00000019" },
    { "name": "Khusbu Awasthi", "employeeNo": "00000645" },
    { "name": "Surendra Jagri", "employeeNo": "450" },
    { "name": "Ram Bdh Chand", "employeeNo": "00001151" },
    { "name": "Sandip Mahara", "employeeNo": "00000500" },
    { "name": "Garima Mahara", "employeeNo": "316" },
    { "name": "Anup Joshi", "employeeNo": "00001006" },
    { "name": "Bhawana Chand Bohora", "employeeNo": "00000235" },
    { "name": "Mahesh Bhatt", "employeeNo": "00000603" },
    { "name": "Kapil Singh Mauni", "employeeNo": "00001444" },
    { "name": "Rijan Saud", "employeeNo": "00000466" },
    { "name": "aayushjoshi", "employeeNo": "199" },
    { "name": "Anuj Bohara", "employeeNo": "435" },
    { "name": "NikhilJoshi", "employeeNo": "46" },
    { "name": "Bibek dangaura", "employeeNo": "00000576" },
    { "name": "Asad ( guddu bhai )", "employeeNo": "00001433" },
    { "name": "Roman singh Thakuri", "employeeNo": "280" },
    { "name": "Sujal Joshi", "employeeNo": "370" },
    { "name": "Rabin Joshi", "employeeNo": "00001177" },
    { "name": "TapendraChhetri", "employeeNo": "146" },
    { "name": "Parwati Chaudhary", "employeeNo": "00000818" },
    { "name": "Khem Joshi", "employeeNo": "00000237" },
    { "name": "Sugam Rana", "employeeNo": "00001021" },
    { "name": "Aman Paudel", "employeeNo": "366" },
    { "name": "Prashant Chand", "employeeNo": "00000229" },
    { "name": "Kamal Bhatt", "employeeNo": "00000141" },
    { "name": "NirajanJoshi", "employeeNo": "110" },
    { "name": "Rohit Bhattarai", "employeeNo": "369" },
    { "name": "Prashant Bhatt", "employeeNo": "368" },
    { "name": "Sandesh Bokati", "employeeNo": "00000460" },
    { "name": "Nirmala Oad", "employeeNo": "453" },
    { "name": "Kamala Dhami", "employeeNo": "00000311" },
    { "name": "D.r Durgesh Chaudhary", "employeeNo": "00001374" },
    { "name": "Amit Rawal", "employeeNo": "00000539" },
    { "name": "kabi pant", "employeeNo": "244" },
    { "name": "Sahil mahara", "employeeNo": "00000324" }
  ]

  for (let i = 0; i < userList.length; i++) {
    let user = userList[i];
    // let newuser = {...user, phoneNumber: '', password:999999, cPassword:999999, createdByAdmin: 2, status:'active',userType:'Customer';}
    const req = {
      body: {
        name: user.name,
        phoneNumber: '',
        userType: 'Customer',
        password: '999999',
        cPassword: '999999',
        gymName: null,
        fitnessGoal: null,
        healthIssue: null,
        createdByAdmin: 2,
        employeeNo,
        email: null,
      }
    };

    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        console.log(`User: ${user.name} - Status: ${this.statusCode}`, data);
      }
    };

    const next = (err) => {
      console.error(`Error registering ${user.name}:`, err);
    };

    await dummyregisterUserByAdmin(req, res, next);
  }
}
const registerUser = async (req, res, next) => {
  const {
    name,
    email,
    phoneNumber,
    gymName,
    userType,
    fitnessGoal,
    healthIssue,
    specialization,
    password,
    cPassword,
    createdByAdmin,
  } = req.body;

  try {
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !userType ||
      !password ||
      !cPassword
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    if (password !== cPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords don't match!" });
    }

    // If user is a trainer, specialization is required
    if (userType.toLowerCase() === "trainer" && !specialization) {
      return res.status(400).json({
        success: false,
        message: "Specialization is required for trainers!",
      });
    }

    // If user is an admin, gymName is required
    if (userType === "Admin" && !gymName) {
      return res
        .status(400)
        .json({ success: false, message: "Gym name is required for admins!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user and log response
    let sqlQuery = `SELECT * FROM users WHERE email="${email}"`;
    await sqlService.query(sqlQuery, async (response) => {
      if (response.data.length == 1) {
        res.send({
          sucess: false,
          message: "User is already registered!",
        });
        return;
      } else {
        if (password === cPassword) {
          utilityService.sendEmail(phoneNumber, email, (otpData) => {
            if (otpData) {
              res.send({
                success: true,
                message: "Verify your email!",
              });
            }
          });
        } else {
          res.send({
            success: false,
            message: "Password doesn't match!",
          });
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

const verifyRegisteringUser = async (req, res, next) => {
  try {
    const {
      otp,
      userType,
      name,
      email,
      phoneNumber,
      gymName,
      fitnessGoal,
      healthIssue,
      createdByAdmin,
      specialization,
      password,
      cPassword,
    } = req.body;

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !userType ||
      !password ||
      !cPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    // If user is a Trainer, ensure createdByAdmin is provided and valid
    if (userType === "Trainer") {
      if (!createdByAdmin) {
        return res.status(400).json({
          success: false,
          message: "A trainer must be assigned to an existing Admin.",
        });
      }
    }

    let selectQuery = `SELECT * FROM verifications WHERE email="${email}" LIMIT 1;`;

    sqlService.query(selectQuery, async (response) => {
      if (response.error) {
        return res
          .status(400)
          .json({ success: false, message: "Error fetching OTP record" });
      }

      let otpRecord = response.data[0];

      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: "OTP not found. Please request a new one.",
        });
      }

      if (otpRecord.otp !== otp) {
        return res
          .status(200)
          .json({ success: false, message: "Invalid OTP!" });
      }

      if (new Date() > otpRecord.expiresAt) {
        return res.status(400).json({
          success: false,
          message: "OTP has expired. Request a new OTP.",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Prepare user object for insertion
      let createObj = {
        name,
        email,
        phoneNumber: phoneNumber,
        gymName,
        userType: userType,
        fitnessGoal,
        healthIssue,
        createdByAdmin,
        specialization: specialization.toLowerCase(),
        password: hashedPassword,
      };

      if (userType === 'Customer') {
        createObj = {
          ...createObj,
          status: 'active'
        }
      }

      // Insert user using sqlService
      sqlService.insert(sqlService.Users, createObj, function (response) {
        if (response.error) {
          return res.status(400).json({
            success: false,
            message: "User already registered or an error occurred.",
          });
        }

        const user = response.data;

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );

        return res.status(201).json({
          success: true,
          message: "Email address verified! User registered successfully.",
          token: token + "Fitnest" + user.id,
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

const registerUserByAdmin = async (req, res, next) => {
  // console.log("req.body : ", req.body);
  try {
    const {
      userType,
      name,
      email,
      phoneNumber,
      gymName,
      fitnessGoal,
      healthIssue,
      createdByAdmin,
      password,
      cPassword,
    } = req.body;

    if (!name || !userType || !password || !cPassword) {
      return res.status(200).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUser = async (newEmail) => {
      const createObj = {
        name,
        email: newEmail,
        phoneNumber,
        gymName,
        userType,
        fitnessGoal,
        healthIssue,
        createdByAdmin,
        password: hashedPassword,
        status: 'active',
      };

      sqlService.insert(sqlService.Users, createObj, async function (response) {
        console.log("insert res ; ", response)
        if (!response.success) {
          return res.status(400).json({
            success: false,
            message: "User already registered or an error occurred.",
          });
        }

        const user = response.data.dataValues;

        sqlService.update(
          sqlService.Users,
          { employeeNo: user.id },
          { id: user.id },
          function (updateRes) {
            if (!updateRes.success) {
              return res.status(500).json({
                success: false,
                message: "User created but failed to update employeeNo.",
              });
            }

            const token = jwt.sign(
              { id: user.id, email: user.email },
              process.env.JWT_SECRET,
              { expiresIn: "30d" }
            );

            return res.status(201).json({
              success: true,
              message: "User registered successfully by Admin.",
              token: token + "Fitnest" + user.id,
            });
          }
        );
      });
    };

    // If email is provided, use it directly
    if (email) {
      await insertUser(email);
    } else {
      // Generate a new email like user1@gmail.com, user2@gmail.com, etc.
      const selectQuery = `
        SELECT email 
        FROM users 
        WHERE email LIKE 'user%@gmail.com' 
        ORDER BY CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(email, '@', 1), 'user', -1) AS UNSIGNED) DESC 
        LIMIT 1
      `;

      sqlService.query(selectQuery, async (emailCheckResult) => {
        let newEmail = "user1@gmail.com";

        if (emailCheckResult.success && emailCheckResult.data && emailCheckResult.data.length > 0) {
          const lastEmail = emailCheckResult.data[0].email;
          const match = lastEmail.match(/user(\d+)@gmail\.com/);
          const counter = match ? parseInt(match[1]) + 1 : 1;
          newEmail = `user${counter}@gmail.com`;
        }

        await insertUser(newEmail);
      });
    }
  } catch (error) {
    next(error);
  }
};

const dummyregisterUserByAdmin = async (req, res, next) => {
  // console.log("req.body : ", req.body);
  try {
    const {
      userType,
      name,
      email,
      phoneNumber,
      gymName,
      fitnessGoal,
      healthIssue,
      createdByAdmin,
      employeeNo,
      password,
      cPassword,
    } = req.body;

    if (!name || !userType || !password || !cPassword) {
      return res.status(200).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUser = async (newEmail) => {
      const createObj = {
        name,
        email: newEmail,
        phoneNumber,
        gymName,
        userType,
        fitnessGoal,
        healthIssue,
        createdByAdmin,
        employeeNo,
        password: hashedPassword,
        status: 'active',
      };

      sqlService.insert(sqlService.Users, createObj, async function (response) {
        console.log("insert res ; ", response)
        if (!response.success) {
          return res.status(400).json({
            success: false,
            message: "User already registered or an error occurred.",
          });
        }

        const user = response.data.dataValues;
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );

        return res.status(201).json({
          success: true,
          message: "User registered successfully by Admin.",
          token: token + "Fitnest" + user.id,
        });

      });
    };

    const selectQuery = `
        SELECT email 
        FROM users 
        WHERE email LIKE 'user%@gmail.com' 
        ORDER BY CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(email, '@', 1), 'user', -1) AS UNSIGNED) DESC 
        LIMIT 1
      `;

    sqlService.query(selectQuery, async (emailCheckResult) => {
      let newEmail = "user1@gmail.com";
      console.log("email res ; ", emailCheckResult)
      if (emailCheckResult.success && emailCheckResult.data && emailCheckResult.data.length > 0) {
        const lastEmail = emailCheckResult.data[0].email;
        const match = lastEmail.match(/user(\d+)@gmail\.com/);
        const counter = match ? parseInt(match[1]) + 1 : 1;
        newEmail = `user${counter}@gmail.com`;
      }

      await insertUser(newEmail);
    });

  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password, userType } = req.body; // Get userType from frontend

  try {
    let selectQuery = `SELECT * FROM users WHERE email="${email}" LIMIT 1;`;

    sqlService.query(selectQuery, async (response) => {

      if (!response.success) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred.",
          error: response.error,
        });
      }

      let user = response.data[0];

      if (!user) {
        return res.status(200).json({
          success: false,
          message: "User is not registered.",
        });
      }

      // If the user is an Admin, check if their status is pending
      if (userType === "Trainer" && user.status === "pending") {
        return res.status(200).json({
          success: false,
          message:
            "Your request is pending approval. Please wait for approval.",
        });
      }
      // If the user is an Admin, check if their status is pending
      if (userType === "Admin" && user.status === "pending") {
        return res.status(200).json({
          success: false,
          message:
            "Your request is pending approval. Please wait for approval.",
        });
      }

      // **New Condition: Check if userType from frontend matches the database**
      if (user.userType !== userType) {
        return res.status(200).json({
          success: false,
          message: "User is not registered.",
        });
      }

      // Compare hashed password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing password:", err);
          return res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
        }

        if (!isMatch) {
          return res.status(200).json({
            success: false,
            message: "Incorrect password. Please try again.",
          });
        }

        // Generate JWT Token
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            userType: user.userType,
          },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );

        res.status(200).json({
          success: true,
          message: "Login successful.",
          token: `${token}Fitnest${user.id}`,
        });
      });
    });
  } catch (err) {
    next(err);
  }
};

const silentLogin = async (req, res, next) => {
  const { token } = req.query;
  let newToken = token.split("Fitnest")[0];
  console.log("newToken...", newToken);
  

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }
  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(newToken, process.env.JWT_SECRET);

    // Extract email from the decoded token
    const userEmail = decoded.email;

    if (!userEmail) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Unsafe query (SQL Injection risk)
    const selectQuery = `SELECT * FROM users WHERE email="${userEmail}" LIMIT 1`;

    sqlService.query(selectQuery, (response) => {
      console.log("response..", response);
      
      let user = response.data[0];

      if (!user) {
        return res.send({
          success: false,
          reason: "User is not registered",
        });
      }

      res.json({
        success: true,
        message: "User logged in successfully",
        data: user,
      });
    });
  } catch (err) {
    // console.error("Error during silent login:", err);

    return res.status(200).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const newscheduling = async (req, res, next) => {
  try {
    const {
      startfrom,
      userId,
      trainerId,
      className,
      description,
      durationHours,
      durationMonths,
      startingTime,
      device,
      capacity,
    } = req.body;

    // Validate required fields
    if (!userId || !className || !durationMonths) {
      return res.status(200).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Prepare object for insertion
    const createObj = {
      adminId: userId,
      trainerId: trainerId,
      className: className,
      description: description,
      startfrom: startfrom,
      durationMonths: durationMonths,
      deviceId: device,
      capacity: capacity,
      startingTime: startingTime,
    };

    // Insert class scheduling details into the database
    sqlService.insert(sqlService.Schedules, createObj, (response) => {
      if (response.error) {
        return res.status(400).json({
          success: false,
          message: "Error inserting class schedule. Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Class scheduled successfully.",
        data: response.data,
      });
    });
  } catch (error) {
    next(error);
  }
};
const addDevice = async (req, res, next) => {
  try {
    const { userId, ipAddress, username, password, purpose } = req.body;

    // Validate required fields
    if (!userId || !ipAddress || !username || !password || !purpose) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Check if the device already exists for the same admin and purpose
    const query = `SELECT * FROM devices WHERE userId = ${userId} AND purpose = "${purpose}"`;

    sqlService.query(query, async (existingDevice) => {
      if (existingDevice && existingDevice.data.length > 0) {
        return res.status(200).json({
          success: false,
          message: `Device ${purpose} already exists!`,
        });
      }

      // Prepare object for insertion
      const createObj = {
        userId,
        ipAddress,
        username,
        password,
        purpose,
        status: "active",
      };

      // Insert device details into the database
      sqlService.insert(sqlService.Devices, createObj, (response) => {
        if (response.error) {
          return res.status(400).json({
            success: false,
            message: "Error adding device. Please try again.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Device added successfully.",
          data: response.data,
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

const getPendingAdmins = async (req, res, next) => {
  try {
    const { fromDate, toDate, searchTerm } = req.query;

    let conditions = [`userType = "Admin"`, `status = "pending"`];

    if (fromDate && toDate) {
      conditions.push(`DATE(createdAt) BETWEEN "${fromDate}" AND "${toDate}"`);
    }

    if (searchTerm) {
      conditions.push(`(
        email LIKE "%${searchTerm}%" OR 
        phoneNumber LIKE "%${searchTerm}%"
      )`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const sqlQuery = `SELECT * FROM users ${whereClause} ORDER BY createdAt DESC`;

    sqlService.query(sqlQuery, (response) => {
      if (response.error) {
        return res.status(500).json({
          success: false,
          message: "An error occurred while retrieving pending admins.",
        });
      }

      const data = response.data || [];

      if (data.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No pending admins found.",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        data,
        error: null,
      });
    });
  } catch (error) {
    next(error);
  }
};

const updateAdminStatus = async (req, res, next) => {
  try {
    const { userId, status } = req.body;

    // Validate required fields
    if (!userId || !status) {
      return res.status(400).json({
        success: false,
        message: "userId and status are required!",
      });
    }

    // Use sqlService.update() with a callback
    sqlService.update(
      sqlService.Users,
      { status: status },
      { id: userId },
      (response) => {
        if (!response.success) {
          return res.status(500).json({
            success: false,
            message: "Error updating admin status.",
            error: error.message,
          });
        }

        // Check if any row was updated
        if (response.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "No admin found with the given userId.",
          });
        }

        // sendApprovalEmail("krishankantvaishnav921@gmail.com");

        // Success message after update
        return res.status(200).json({
          success: true,
          message: "Admin status updated successfully.",
          data: response,
        });
      }
    );
  } catch (error) {
    next(error); // Handle unexpected errors
  }
};

const sendApprovalEmail = (email) => {
  // Configure mail transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // Use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Your Request Has Been Approved",
    text: `Your request has been approved. You can now access the admin panel.`,
    html: `<p>Your request has been approved. You can now access the <b>admin panel</b>.</p>`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Email sent successfully: ");
    }
  });
};
const getActiveTrainersByAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.body; // Admin ID from request

    // Validate required fields
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "adminId is required!",
      });
    }

    // SQL query to fetch active trainers created by the admin
    const query = `SELECT name ,specialization FROM USERS WHERE userType = 'Trainer' AND status = 'active' AND createdByAdmin = ${adminId}`;

    sqlService.query(query, async (response) => {
      if (response.error) {
        return res.status(500).json({
          success: false,
          message: "Error fetching active trainers.",
          error: error.message,
        });
      }

      if (response.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No active trainers found for this admin.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Active trainers retrieved successfully.",
        data: response,
      });
    });
  } catch (error) {
    next(error); // Handle unexpected errors
  }
};

const getActiveCustomerById = async (req, res, next) => {
  try {
    const { customerId } = req.query; // Extract userId from URL params

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Query to fetch active customer by userId
    // let query = `SELECT * FROM users WHERE id = "${userId}" AND userType = 'Customer' AND isActive = 1 LIMIT 1;`;
    let query = `SELECT u.*, 
        mp.planName, 
        mp.monthlyPrice, 
        mp.quarterlyPrice, 
        mp.yearlyPrice, 
        mp.status AS planStatus,
        mpu.expiryDate, 
        mpu.paymentStatus
      FROM users u
      LEFT JOIN membershipPurchases mpu ON u.id = mpu.userId AND mpu.expiryDate > NOW()
      LEFT JOIN membershipPlans mp ON mpu.membershipPlansId = mp.id
      WHERE u.userType = 'Customer' 
      AND u.id = ${customerId}
      AND u.status = 'active'`;

    sqlService.query(query, (response) => {
      if (response.error) {
        return res.status(500).json({
          success: false,
          message: "Error fetching customer",
          error: response.error,
        });
      }

      if (response.data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No active customer found with this ID",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Customer fetched successfully",
        data: response.data[0],
      });
    });
  } catch (error) {
    next(error);
  }
};

const addname = async (req, res, next) => {
  const name = "Krishna";
  const username = "Rahil";

  try {
    // Create object to insert
    const createObj = { name, username };

    // Insert data into AddrealtimeName table
    sqlService.insert(sqlService.AddrealtimeName, createObj, (response) => {
      if (response.error) {
        return res.status(400).json({
          success: false,
          message: "Error adding. Please try again.",
        });
      }

      // Call getAllNames after successful insertion
      return getAllNames(req, res, next);
    });
  } catch (error) {
    next(error);
  }
};

const getAllNames = async (req, res, next) => {
  try {
    const fetchQuery = `SELECT * FROM AddrealtimeNames`; // ✅ Fixed table name

    sqlService.query(fetchQuery, (response) => {
      if (response.error) {
        return res.status(400).json({
          success: false,
          message: "Error fetching data. Please try again.",
          error: response.error.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Data retrieved successfully.",
        data: response.data, // ✅ Fixed response format
      });
    });
  } catch (error) {
    next(error);
  }
};

const getAllAdmin = async (req, res, next) => {
  try {
    let query = `SELECT * FROM users WHERE userType="Admin"`; // Fetch users by user ID

    sqlService.query(query, (response) => {
      if (response.error) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred.",
          error: response.error,
        });
      }

      if (response.data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No users found for the given ID.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully.",
        data: response.data,
      });
    });
  } catch (error) {
    next(error);
  }
};

const getAllCustomers = async (req, res, next) => {
  try {
    const { adminId } = req.params; // Get adminId from request parameters
    let { fromDate, toDate } = req.query; // Get date range from query parameters

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required.",
      });
    }

    // Base query
    let query = `SELECT * FROM users WHERE userType IN ('Customer', 'Trainer') AND createdByAdmin = ${adminId}`;

    // Apply date filtering if fromDate and toDate are provided
    if (
      fromDate &&
      toDate &&
      fromDate !== "null" &&
      toDate !== "null" &&
      fromDate !== undefined &&
      toDate !== undefined
    ) {
      fromDate = fromDate.trim();
      toDate = toDate.trim();
      query += ` AND createdAt BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59'`;
    }
    sqlService.query(query, (response) => {
      if (!response.success) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred.",
          error: response.error,
        });
      }

      if (response.data.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No customers found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Customers retrieved successfully.",
        data: response.data,
      });
    });
  } catch (error) {
    next(error);
  }
};

const getAllTrainer = async (req, res, next) => {
  try {
    const { adminId } = req.params; // Get adminId from request parameters
    const { fromDate, toDate } = req.query;
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required.",
      });
    }
    // let query = `SELECT * FROM users WHERE userType = 'Trainer' AND  status = 'active' AND createdByAdmin = ${adminId}`;
    let query = `SELECT * FROM users WHERE userType = 'Trainer' AND createdByAdmin = ${adminId}`;
    if (fromDate && toDate && fromDate !== "null" && toDate !== "null") {
      query += ` AND createdAt BETWEEN '${fromDate} 00:00:00' AND '${toDate}' 23:59:59`;
    }

    sqlService.query(query, (response) => {
      if (response.error) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred.",
          error: response.error,
        });
      }

      if (response.data.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No Trainer found for the given Admin ID.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Trainer retrieved successfully.",
        data: response.data,
      });
    });
  } catch (error) {
    next(error);
  }
};
const getPendingTrainer = async (req, res, next) => {
  try {
    const { adminId } = req.params; // Get adminId from request parameters

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required.",
      });
    }

    let query = `SELECT * FROM users WHERE userType = 'Trainer' AND  status = 'pending' AND createdByAdmin = ${adminId}`;

    sqlService.query(query, (response) => {
      if (response.error) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred.",
          error: response.error,
        });
      }

      if (response.data.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No Trainer found for the given Admin ID.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Trainer retrieved successfully.",
        data: response.data,
      });
    });
  } catch (error) {
    next(error);
  }
};
const getAllSessions = async (req, res, next) => {
  try {
    const { adminId } = req.params; // Get adminId from request parameters

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required.",
      });
    }

    let query = `SELECT * FROM schedules WHERE adminId = ${adminId}`;

    sqlService.query(query, (response) => {
      if (response.error) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred.",
          error: response.error,
        });
      }

      if (response.data.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No sessions found for the given Admin ID.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "session retrieved successfully.",
        data: response.data,
      });
    });
  } catch (error) {
    next(error);
  }
};

const addSubscriptionPlan = async (req, res, next) => {
  try {
    // Destructure data from the request body

    const { userid, scheduleid, adminid, amountpaid, devices, employeeno } =
      req.body;

    // Validate the data - ensure all required fields are provided
    if (
      !userid ||
      !scheduleid ||
      !adminid ||
      !amountpaid ||
      !devices ||
      !employeeno
    ) {
      return res.status(200).json({
        success: false,
        message:
          "All fields (userId, scheduleId, adminId, amountPaid, employeeNo, devices) are required",
      });
    }

    // Check if the employeeNo already exists in the SubscriptionPlan table for the given admin
    const employeeQuery = `SELECT * FROM subscriptionPlans WHERE employeeNo = ${employeeno} AND adminId = ${adminid};`;
    const deviceQuery = `SELECT * FROM devices WHERE purpose = "${devices}" AND userId = ${adminid};`;

    sqlService.query(employeeQuery, (empResponse) => {
      if (empResponse.error) {
        return res.status(200).json({
          success: false,
          message:
            "An error occurred while checking the employee number. Please try again.",
          error: empResponse.error,
        });
      }

      if (empResponse.data.length > 0) {
        return res.status(200).json({
          success: false,
          message: "This employee number is already assigned to the admin.",
        });
      }

      // Check if the device exists
      sqlService.query(deviceQuery, (deviceResponse) => {
        if (deviceResponse.error) {
          return res.status(200).json({
            success: false,
            message:
              "An error occurred while checking the device. Please try again.",
            error: deviceResponse.error,
          });
        }

        if (deviceResponse.data.length === 0) {
          return res.status(200).json({
            success: false,
            message: `The specified device for ${devices} does not exist .`,
          });
        }
        const deviceId = deviceResponse.data[0].id;

        // Create the subscription plan record
        const createObj = {
          userId: userid,
          scheduleId: scheduleid,
          adminId: adminid,
          amountPaid: amountpaid,
          deviceId: deviceId, // Using the extracted device ID
          employeeNo: employeeno,
        };

        // Insert class scheduling details into the database
        sqlService.insert(
          sqlService.SubscriptionPlan,
          createObj,
          (insertResponse) => {
            if (insertResponse.error) {
              return res.status(200).json({
                success: false,
                message: "Error inserting class schedule. Please try again.",
              });
            }
            return res.status(200).json({
              success: true,
              message: "Class scheduled successfully.",
              data: insertResponse.data,
            });
          }
        );
      });
    });
  } catch (error) {
    // Catch any error and pass it to the error handler
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while creating the subscription plan",
    });
  }
};

const getAllactiveDevice = async (req, res, next) => {
  try {
    const { adminId } = req.params; // Get adminId from request parameters

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required.",
      });
    }

    let query = `SELECT * FROM devices WHERE userId = ${adminId} and status = "active"`;

    sqlService.query(query, (response) => {
      if (response.error) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred.",
          error: response.error,
        });
      }

      if (response.data.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No device found for the given Admin ID.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "device retrieved successfully.",
        data: response.data,
      });
    });
  } catch (error) {
    next(error);
  }
};

const updateTrainerStatus = async (req, res, next) => {
  try {
    const { userId, status } = req.body;
    // Validate required fields
    if (!userId || !status) {
      return res.status(400).json({
        success: false,
        message: "userId and status are required!",
      });
    }

    // SQL query to update user status
    const updateQuery = `UPDATE USERS SET status = :status WHERE Id = :userId`;

    // Use sqlService.update() with a callback
    sqlService.update(
      sqlService.Users,
      { status: status },
      { id: userId },
      (response) => {
        if (response.error) {
          return res.status(500).json({
            success: false,
            message: "Error updating admin status.",
            error: error.message,
          });
        }

        // Check if any row was updated
        if (response.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "No admin found with the given userId.",
          });
        }
        sendApprovalEmail("krishankantvaishnav921@gmail.com");

        // Success message after update
        return res.status(200).json({
          success: true,
          message: "Trainer status updated successfully.",
          data: response,
        });
      }
    );
  } catch (error) {
    next(error); // Handle unexpected errors
  }
};

const getSchedules = async (req, res, next) => {
  try {
    const adminId = Number(req.params.adminId); // Converts to a number

    if (!adminId || isNaN(adminId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin ID.",
      });
    }

    const sqlQuery = `
    SELECT 
  sch.id As class_id,
  sch.className AS class_name,
  sch.startfrom AS start_date,
  sch.description AS class_description,
  sch.durationMonths AS class_duration_months,
  sch.status AS class_status,
  sch.trainerId AS trainerId,
  u.name AS trainer_name  -- Getting trainer's name, will be null if no trainer is assigned
FROM schedules sch
LEFT JOIN users u ON sch.trainerId = u.id  -- Left join to include schedules without a trainer
WHERE sch.adminId = ${adminId};

`;

    // Execute query using Sequelize's `query` method
    sqlService.query(sqlQuery, (response) => {
      if (!response.success) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred. Please try again later.",
        });
      }

      if (!response || response.data.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No data found for the given Admin ID.",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Retrieved successfully.",
        data: response.data,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const trainerSchedules = async (req, res, next) => {
  try {
    const trainerId = Number(req.params.trainerId); // Converts to a number

    if (!trainerId || isNaN(trainerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Trainer.",
      });
    }

    const sqlQuery = `
    SELECT 
        s.className,
        s.startfrom,
        s.description,
        s.durationHours,
        s.durationMonths,
        u_trainer.name AS trainerName
    FROM schedules s
    JOIN users u_trainer ON s.trainerId = u_trainer.id
    WHERE u_trainer.id = ${trainerId};
    `;

    // Execute query using Sequelize's `query` method
    sqlService.query(sqlQuery, (response) => {
      if (!response.success) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred. Please try again later.",
        });
      }

      if (!response || response.data.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No data found.",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Retrieved successfully.",
        data: response.data,
      });
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getAllTrainerSchedules = async (req, res, next) => {
  try {
    const adminId = Number(req.params.adminId); // Convert to a number
    const { className } = req.query; // Get className from the frontend (query params)

    if (!adminId || isNaN(adminId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin ID.",
      });
    }

    if (!className) {
      return res.status(400).json({
        success: false,
        message: "className is required.",
      });
    }

    const sqlQuery = `
    SELECT 
        s.className, 
        s.startfrom, 
        s.description, 
        s.durationMonths
    FROM schedules s
    WHERE s.adminId = ${adminId}
    AND s.className = '${className}';  -- ✅ Filters only the provided className
  `;

    // Execute query using Sequelize's `query` method
    sqlService.query(sqlQuery, (response) => {
      if (!response.success) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred. Please try again later.",
        });
      }

      if (!response.data || response.data.length === 0) {
        return res.status(200).json({
          success: true,
          message: `No schedules found for class '${className}'.`,
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: `Trainer schedules for class '${className}' retrieved successfully.`,
        data: response.data,
      });
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getallsubscriptionplan = async (req, res, next) => {
  try {
    const adminId = Number(req.params.adminId);
    const duration = req.query.duration ? Number(req.query.duration) : null; // Fetch duration or set to null

    if (!adminId || isNaN(adminId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin ID.",
      });
    }

    // SQL Query
    let sqlQuery = `
      SELECT 
        sub.id AS subscription_id,
        sub.amountPaid AS amount_paid,
        sub.employeeNo AS employee_no,
        
        -- Customer Details
        customer.name AS customer_name,
        customer.email AS customer_email,
        customer.phoneNumber AS customer_phone,
        
        -- Chosen Schedule Details
        sch.id AS schedule_id,
        sch.className AS class_name,
        sch.durationMonths AS class_duration_months,
        sch.startfrom AS start_date

      FROM subscriptionPlans sub
      LEFT JOIN users customer ON sub.userId = customer.id  -- Customer details
      LEFT JOIN users admin ON sub.adminId = admin.id  -- Admin details
      LEFT JOIN schedules sch ON sub.scheduleId = sch.id  -- Schedule details
        WHERE sub.adminId = ${adminId}
    `;

    // Apply Date Filter Only If Duration Exists
    if (duration && !isNaN(duration)) {
      sqlQuery += ` AND sub.createdAt >= DATE_SUB(CURDATE(), INTERVAL ${duration} MONTH)`;
    }

    // Execute query using Sequelize's `query` method
    sqlService.query(sqlQuery, (response) => {
      if (!response.success) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred. Please try again later.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Retrieved successfully.",
        data: response.data,
      });
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getAdminGymName = async (req, res, next) => {
  try {
    const adminId = Number(req.params.adminId);

    if (!adminId || isNaN(adminId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin ID.",
      });
    }

    // SQL Query to fetch the gym name for the given adminId
    const sqlQuery = `
      SELECT gymName FROM users WHERE id = ${adminId} AND userType = 'Admin' LIMIT 1
    `;

    // Execute query
    sqlService.query(sqlQuery, (response) => {
      if (!response.success || response.data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Gym name not found for the given Admin ID.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Gym name retrieved successfully.",
        gymName: response.data[0].gymName,
      });
    });
  } catch (error) {
    console.error("Error fetching gym name:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getProfileDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "UserId is undefined" });
    }

    const query = `SELECT * FROM userProfiles WHERE userId=${userId}`;

    sqlService.query(query, (response) => {
      if (!response.success) {
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      // Check if user profile exists
      if (response.data.length === 0) {
        return res.status(200).json({
          success: false,
          message: "Profile not found",
          data: response.data,
        });
      }

      // Return user profile
      res.status(200).json({ success: true, data: response.data });
    });
  } catch (error) {
    console.error("Error fetching profile details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const trackProgress = async (req, res) => {
  const { userId, weight } = req.body;

  // Validate required fields
  if (!userId || !weight) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Get the current year and month
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1; // Month is 0-indexed, so +1

    // Check if entry exists for the current month
    const checkQuery = `
      SELECT * FROM trackProgresses 
      WHERE userId = ${userId} 
      AND YEAR(createdAt) = ${currentYear} 
      AND MONTH(createdAt) = ${currentMonth}`;


    sqlService.query(checkQuery, (checkResponse) => {

      if (checkResponse.success && checkResponse.data.length > 0) {
        return res.status(200).json({
          success: false,
          message: "Progress already tracked for this month",
        });
      }

      const obj = {
        userId: userId,
        weight: weight,
      };

      sqlService.insert(sqlService.TrackProgresses, obj, (insertResponse) => {
        if (!insertResponse.success) {
          console.error("Error inserting progress:", insertResponse.success);
          return res.status(500).json({
            success: false,
            message: "Failed to track progress",
          });
        }

        res.status(201).json({
          success: true,
          message: "Progress tracked successfully!",
        });
      });
    });
  } catch (err) {
    console.error("Error in trackProgress:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getUserCounts = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({ success: false, message: "adminId is required" });
    }

    const query = `
      SELECT
        SUM(CASE WHEN userType = 'Customer' THEN 1 ELSE 0 END) AS customerCount,
        SUM(CASE WHEN userType = 'Trainer' THEN 1 ELSE 0 END) AS trainerCount
      FROM users
      WHERE createdByAdmin = ${adminId};
    `;

    sqlService.query(query, (response) => {
      if (!response.success) {
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      const { customerCount = 0, trainerCount = 0 } = response.data[0];

      return res.status(200).json({
        success: true,
        customerCount,
        trainerCount,
      });
    });
  } catch (error) {
    console.error("Error fetching user counts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getStaffCount = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({ success: false, message: "adminId is required" });
    }

    const query = `
      SELECT COUNT(*) AS staffCount 
      FROM users 
      WHERE userType NOT IN ('Customer', 'Admin', 'SuperAdmin')
      AND createdByAdmin = ${adminId};
    `;

    sqlService.query(query, (response) => {
      if (!response.success) {
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      const { staffCount = 0 } = response.data[0];

      return res.status(200).json({
        success: true,
        staffCount,
      });
    });
  } catch (error) {
    console.error("Error fetching staff count:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getDashboardCounts = async (req, res) => {
  try {
    const { adminId } = req.params;


    if (!adminId) {
      return res.status(400).json({ success: false, message: "adminId is required" });
    }

    const userCountsQuery = `
      SELECT
        SUM(CASE WHEN userType = 'Customer' THEN 1 ELSE 0 END) AS customerCount,
        SUM(CASE WHEN userType = 'Trainer' THEN 1 ELSE 0 END) AS trainerCount,
        SUM(CASE WHEN userType NOT IN ('Customer', 'Admin', 'SuperAdmin') THEN 1 ELSE 0 END) AS staffCount
      FROM users
      WHERE createdByAdmin = ${adminId};
    `;

    const subscriptionQuery = `
      SELECT 
        COUNT(DISTINCT mpPurchases.userId) AS totalUniqueBuyers
      FROM membershipPurchases mpPurchases
      INNER JOIN membershipPlans mpPlans
        ON mpPurchases.membershipPlansId = mpPlans.id
      WHERE mpPlans.userId = ${adminId}
      AND mpPurchases.status = 'active';
    `;

    sqlService.query(userCountsQuery, (userResponse) => {

      if (!userResponse.success) {
        return res.status(500).json({ success: false, message: "Failed to fetch user counts" });
      }

      const { customerCount = 0, trainerCount = 0, staffCount = 0 } = userResponse.data[0];

      sqlService.query(subscriptionQuery, (subResponse) => {

        if (!subResponse.success) {
          return res.status(500).json({ success: false, message: "Failed to fetch subscription count" });
        }

        const totalUniqueBuyers = subResponse.data.length > 0 ? subResponse.data[0].totalUniqueBuyers : 0;

        return res.status(200).json({
          success: true,
          data: {
            customerCount,
            trainerCount,
            staffCount,
            totalUniqueBuyers
          }
        });
      });
    });

  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createMembershipPlans = async (req, res) => {
  const {
    userId,
    planName,
    description,
    features,
    includesPersonalTrainer,
    includesGroupClasses,
    monthlyPrice,
    quarterlyPrice,
    yearlyPrice,
    extraPersonalTrainerFee,
    extraGroupClassFee,
    status,
    planType,
    doors,
  } = req.body;

  try {
    const membershipData = {
      userId: userId,
      planName: planName,
      description: description,
      features: features,
      includesPersonalTrainer: includesPersonalTrainer,
      includesGroupClasses: includesGroupClasses,
      monthlyPrice: monthlyPrice,
      quarterlyPrice: quarterlyPrice,
      yearlyPrice: yearlyPrice,
      extraPersonalTrainerFee: extraPersonalTrainerFee,
      extraGroupClassFee: extraGroupClassFee,
      status: status,
      isDeleted: "false",
      planType: planType,
      doors: doors
    };

    sqlService.insert(
      sqlService.MembershipPlans,
      membershipData,
      (response) => {
        if (!response.success) {
          res.status(500).json({
            success: false,
            message: "Error Inserting membership plan",
          });
        }

        res.status(200).json({ success: true, data: response.data });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating membership plan",
      error: error.message,
    });
  }
};

const createVisitorPlans = async (req, res) => {
  const { userId, planName, description, status, planType, price, days, doors } =
    req.body;

  try {
    const vistiorPlanData = {
      userId: userId,
      planName: planName,
      description: description,
      status: status,
      planType: planType,
      pricePerDay: price,
      dayQty: days,
      isDeleted: "false",
      doors: doors
    };


    sqlService.insert(
      sqlService.MembershipPlans,
      vistiorPlanData,
      (response) => {
        if (!response.success) {
          res
            .status(500)
            .json({
              success: false,
              message: "Error Inserting membership plan",
            });
        }

        res.status(200).json({ success: true, data: response.data });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating membership plan",
        error: error.message,
      });
  }
};

const updateMembershipPlan = async (req, res) => {
  const { membershipPlanId } = req.params;
  const {
    planName,
    description,
    features,
    includesPersonalTrainer,
    includesGroupClasses,
    monthlyPrice,
    quarterlyPrice,
    yearlyPrice,
    extraPersonalTrainerFee,
    extraGroupClassFee,
    status,
    planType,
  } = req.body;

  try {
    if (!membershipPlanId) {
      return res
        .status(400)
        .json({ success: false, message: "Plan ID is required" });
    }

    if (
      !planName ||
      !description ||
      !features ||
      includesPersonalTrainer === undefined ||
      includesGroupClasses === undefined ||
      monthlyPrice === undefined ||
      quarterlyPrice === undefined ||
      yearlyPrice === undefined ||
      extraPersonalTrainerFee === undefined ||
      extraGroupClassFee === undefined ||
      status === undefined ||
      planType === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const isDeleted = "false";

    const updateData = {
      planName,
      description,
      features,
      includesPersonalTrainer,
      includesGroupClasses,
      monthlyPrice,
      quarterlyPrice,
      yearlyPrice,
      extraPersonalTrainerFee,
      extraGroupClassFee,
      status,
      isDeleted,
      planType,
    };

    sqlService.update(
      sqlService.MembershipPlans,
      updateData,
      { id: membershipPlanId },
      (response) => {
        if (!response.success) {
          return res
            .status(500)
            .json({
              success: false,
              message: "Error updating membership plan",
            });
        }

        const query = `SELECT * FROM membershipPlans WHERE isDeleted=false`;

        sqlService.query(query, (plansResponse) => {
          if (!plansResponse.success) {
            res
              .status(500)
              .json({ success: false, message: "Internal server error!" });
          }

          return res
            .status(200)
            .json({ success: true, data: plansResponse.data });
        });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating membership plan",
        error: error.message,
      });
  }
};

const sendInvoice = async (invoiceData) => {

  try {
    if (!invoiceData.email || !invoiceData.items || !invoiceData.total) {
      throw new Error("Missing required fields");
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

    return { success: true, message: "Invoice sent successfully." };

  } catch (error) {
    console.error("Error sending invoice:", error);
    return { success: false, message: "Failed to send invoice.", error: error.message };
  }
};

const buyMembershipPlan = async (req, res) => {
  try {
    const {
      planType,
      userId,
      membershipPlansId,
      amountPaid,
      paymentStatus,
      selectedDuration,
      monthQty,
      visitorAmountPaid,
      daysQty,
      name,
      phoneNo,
      email,
      adminId,
      admissionFee
    } = req.body;


    // Validation
    if (planType === "subs-plan") {
      if (!userId || !membershipPlansId || !amountPaid || !paymentStatus || !selectedDuration || !monthQty) {
        return res.status(400).json({ message: "All fields are required" });
      }
    }

    if (planType === "visitor-plan") {
      if (!userId || !membershipPlansId || !visitorAmountPaid || !paymentStatus || !daysQty) {
        return res.status(400).json({ message: "All fields are required" });
      }
    }

    const query = `SELECT * FROM membershipPlans WHERE id=${membershipPlansId}`;
    sqlService.query(query, async (response) => {
      if (!response.success || response.data.length === 0) {
        return res.status(400).json({ success: false, message: "Subscription plan doesn't exist!" });
      }

      const planData = response.data[0];
      let checkAmount;
      let durationInDays = 0;
      const purchaseDate = new Date();
      let expiryDate = new Date();

      if (planType === "subs-plan") {
        if (selectedDuration === "monthly") {
          durationInDays = 30 * monthQty;
          checkAmount = planData.monthlyPrice * monthQty;
        } else if (selectedDuration === "quarterly") {
          durationInDays = 90;
          checkAmount = planData.quarterlyPrice;
        } else if (selectedDuration === "yearly") {
          durationInDays = 365;
          checkAmount = planData.yearlyPrice;
        } else {
          return res.status(400).json({ success: false, message: "Invalid selectedDuration" });
        }

        // if (amountPaid != checkAmount) {
        //   return res.send({ success: false, message: "Paid amount does not match plan price!" });
        // }

        expiryDate.setDate(expiryDate.getDate() + durationInDays);
      }

      if (planType === "visitor-plan") {
        expiryDate = new Date(purchaseDate);
        expiryDate.setDate(expiryDate.getDate() + parseInt(daysQty));
      }

      // Fetch devices BEFORE inserting/updating database
      const doorList = planData?.doors?.split(",").map((d) => `'${d.trim()}'`).join(",");

      if (!doorList) {
        return res.status(400).json({
          success: false,
          message: 'No door is avaialble!'
        })
      }
      const fetchDevicesQuery = `SELECT * FROM devices WHERE purpose IN (${doorList}) AND userId=${adminId}`;

      sqlService.query(fetchDevicesQuery, async (deviceResponse) => {
        if (!deviceResponse.success || !Array.isArray(deviceResponse.data)) {
          return res.status(500).json({ success: false, message: "Error fetching devices or devices not found" });
        }

        const devices = deviceResponse.data;
        const userData = {
          userId,
          phoneNo,
          name,
          valid: {
            beginTime: purchaseDate.toISOString(),
            endTime: expiryDate.toISOString(),
          },
        };



        if (devices.length === 0) {
          return res.send({
            success: true,
            message: 'No device found!'
          })
        }

        // Register user on devices
        const registerPromises = devices.map((device) => {
          return registerUserOnDevices([device], userData);
        });

        const registrationResults = (await Promise.all(registerPromises)).flat();

        const allSuccess = registrationResults.every((r) => r.success);
        console.log("allSuccess...", allSuccess);

        if (!allSuccess) {
          const failedDevices = registrationResults
            .filter(r => !r.success)
            .map(r => r.deviceId || 'Unknown Device');

          return res.send({
            success: false,
            message: "Device registration failed!",
            failedDevices
          });
        }

        // All devices registered, now save to DB
        const purchaseData = {
          userId,
          membershipPlansId,
          amountPaid: planType === "subs-plan" ? amountPaid : visitorAmountPaid,
          paymentStatus,
          purchaseDate,
          expiryDate,
          selectedDuration: planType === "subs-plan" ? selectedDuration : null,
          monthQty: planType === "subs-plan" ? monthQty : null,
          dayQty: planType === "visitor-plan" ? daysQty : null,
          status: 'active',
          admissionFee
        };

        const checkExistUserQuery = `SELECT * FROM membershipPurchases WHERE userId=${userId}`;
        sqlService.query(checkExistUserQuery, async (existUserResponse) => {

          if (!existUserResponse.success) {
            return res.status(500).json({ success: false, message: "Internal server error" });
          }

          const saveOrUpdate = () => {
            return new Promise((resolve) => {
              if (existUserResponse.data.length > 0) {
                sqlService.update(sqlService.MembershipPurchases, purchaseData, { userId }, resolve);
              } else {
                sqlService.insert(sqlService.MembershipPurchases, purchaseData, resolve);
              }
            });
          };

          const saveResult = await saveOrUpdate();
          console.log("saveResult..", saveResult);

          if (!saveResult.success) {
            return res.status(500).json({ success: false, message: "Error saving membership purchase" });
          }

          // Insert into membershipPurchasesHistory to record the transaction
          const historyData = {
            userId,
            membershipPlansId,
            amountPaid: planType === "subs-plan" ? amountPaid : visitorAmountPaid,
            paymentStatus,
            purchaseDate,
            expiryDate,
            selectedDuration: planType === "subs-plan" ? selectedDuration : null,
            monthQty: planType === "subs-plan" ? monthQty : null,
            dayQty: planType === "visitor-plan" ? daysQty : null,
            status: 'active',
            admissionFee
          };

          sqlService.insert(sqlService.MembershipPurchasesHistories, historyData, async (historyInsertResponse) => {

            if (!historyInsertResponse.success) {
              console.error("Failed to log transaction in history:", historyInsertResponse.message);
            }
            else {
              let insertData = {
                id: historyInsertResponse.data.dataValues.id,
                userId: historyInsertResponse.data.dataValues.userId,
                membershipPlansId: historyInsertResponse.data.dataValues.membershipPlansId,
                amountPaid,
                status: ''
              };
              if (amountPaid != checkAmount) {
                insertData.status = 'incomplete'
              }
              else {
                insertData.status = 'complete'
              }

              await insertReceivedAmount(insertData);
            }
          });

          const invoicePayload = {
            invoiceId: `INV-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            customerName: name,
            email: email, // fallback logic
            items: [
              {
                name: planType === "subs-plan"
                  ? `${planData.planName} (${selectedDuration})`
                  : `${planData.planName} (Visitor - ${daysQty} days)`,
                price: planType === "subs-plan" ? amountPaid : visitorAmountPaid,
              },
            ],
            total: planType === "subs-plan" ? amountPaid : visitorAmountPaid,
          };

          try {
            await sendInvoice(invoicePayload);
            console.log("Invoice sent!");
          } catch (invoiceErr) {
            console.error("Failed to send invoice:", invoiceErr.message);
          }

          return res.status(201).json({
            success: true,
            message: existUserResponse.data.length > 0
              ? "Devices registered and membership updated"
              : "Devices registered and membership purchased",
            data: saveResult.data,
            invoice: invoicePayload,
            registeredDevices: devices.map((d) => d.deviceName || d.id),
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing membership purchase",
      error: error.message,
    });
  }
};


const insertReceivedAmount = async (insertData) => {

  return new Promise((resolve) => {
    const postObj = {
      purchaseHistoryId: insertData.id,
      userId: insertData.userId,
      membershipPlansId: insertData.membershipPlansId,
      receivedAmount: insertData.amountPaid,
      paymentStatus: insertData.status
    }
    sqlService.insert(sqlService.MembershipPurchasedInstallmentAmounts, postObj, resolve)
    console.log("resolve : ", resolve);
  })
};

const updateReceivedAmount = async (req, res) => {
  const { purchaseHistoryId, membershipPlansId, userId, payAmount, purchaseDate } = req.body;
  console.log("body : ", req.body)
  if (!purchaseHistoryId || !membershipPlansId || !userId || !payAmount || !purchaseDate) {
    return res.status(400).json({ success: false, message: "all fields are required" })
  }
  if (payAmount === 'undefined' || payAmount === null) return res.status(400).json({ success: false, message: "amount is required" })
  try {
    let planData;
    let planPrice;
    let amountPaid;

    let planDetailQuery = `SELECT * FROM membershipPlans where id=${membershipPlansId}`;
    sqlService.query(planDetailQuery, planDetailRes => {
      console.log("planDetailQuery : ", planDetailRes.data);
      if (!planDetailRes.success) {
        return res.status(500).json({ success: false, message: "database error" });
      }
      planData = planDetailRes.data[0];
      const formatToLocalDateTime = (date) => {

        const parts = date.split('T');
        const datePart = parts[0];
        const timePart = parts[1].split('.')[0];
        const final = `${datePart} ${timePart}`;
        console.log(final);
        return final;
      };

      const formattedDate = formatToLocalDateTime(purchaseDate);
      const purchasedPlanQuery = `Select * from membershipPurchases where userId = ${userId} AND purchaseDate = '${formattedDate}'`;
      sqlService.query(purchasedPlanQuery, purchasedPlanRes => {
        // console.log("planDetailQuery res :  ", purchasedPlanRes);
        if (!purchasedPlanRes.success || purchasedPlanRes.data.length == 0) {
          return res.json({ success: false, message: "no data found or something went wrong" });
        }

        let purchasedPlanData = purchasedPlanRes.data[0];
        if (purchasedPlanData.selectedDuration === "monthly") {
          planPrice = purchasedPlanData.monthQty * planData.monthlyPrice;
        }
        else if (purchasedPlanData.selectedDuration === "quarterly") {
          planPrice = planData.quarterlyPrice;
        }
        else planPrice = planData.yearlyPrice;

        if (purchasedPlanData.admissionFee !== 0) {
          planPrice = parseFloat(planPrice) + parseFloat(purchasedPlanData.admissionFee);
        }

        amountPaid = purchasedPlanData.amountPaid;
        console.log("amount paid ; ", amountPaid)
        amountDue = parseFloat(planPrice) - parseFloat(amountPaid);

        if (amountDue == 0) {
          return res.json({ success: false, message: "No Amount dues" });
        }
        const newPaidAmount = parseFloat(amountPaid) + parseFloat(payAmount);

        if (planPrice < newPaidAmount) return res.json({ success: false, message: "Invalid amount" });

        const updateObj = {
          amountPaid: newPaidAmount
        }
        console.log("new paid amoint ; ", newPaidAmount);
        sqlService.update(sqlService.MembershipPurchases, updateObj, { id: purchasedPlanData.id }, async updateRes => {
          console.log("update response : ", updateRes);
          if (!updateRes.success) {
            return res.status(500).json({ success: false, message: "database error during amount update" });
          }
        })

        sqlService.update(sqlService.MembershipPurchasesHistories, updateObj, { id: purchaseHistoryId }, historyUpdateRes => {
          if (!historyUpdateRes.success) return res.status(500).json({ success: false, message: "database error during amount update" });
          let insertData = {
            id: purchaseHistoryId,
            userId: userId,
            membershipPlansId: membershipPlansId,
            amountPaid: payAmount,
            status: ''
          };
          if (newPaidAmount != planPrice) {
            insertData.status = 'incomplete'
          }
          else {
            insertData.status = 'complete'
          }

          insertReceivedAmount(insertData);
          return res.status(200).send({ success: true, message: "amount updated successfully" })
        })

      })
    })
  }
  catch (error) {
    return res.status(500).json({ success: false, message: "something went wrong", error: error.message, });
  }
};

const getDueAmount = async (req, res) => {
  const { userId } = req.params;
  const { purchaseDate, membershipPlansId } = req.query;
  try {
    let planDetailQuery = `SELECT * FROM membershipPlans WHERE membershipPlans.id = ${membershipPlansId}`;
    sqlService.query(planDetailQuery, planDetailRes => {
      // console.log("planDetailQuery : ", planDetailRes.data);
      if (!planDetailRes.success) {
        return res.status(500).json({ success: false, message: "database error" });
      }
      planData = planDetailRes.data[0];
      const formatToLocalDateTime = (date) => {

        const parts = date.split('T');
        const datePart = parts[0];
        const timePart = parts[1].split('.')[0];
        const final = `${datePart} ${timePart}`;
        console.log(final);
        return final;
      };

      const formattedDate = formatToLocalDateTime(purchaseDate);

      const purchasedPlanQuery = `SELECT * FROM membershipPurchases WHERE userId = ${userId} AND purchaseDate = '${formattedDate}'`;
      // console.log("query : ", purchasedPlanQuery)
      sqlService.query(purchasedPlanQuery, purchasedPlanRes => {
        // console.log("purchased plan res :  ", purchasedPlanRes);
        if (!purchasedPlanRes.success || purchasedPlanRes.data.length == 0) {
          return res.json({ success: false, message: "no data found or something went wrong" });
        }



        let purchasedPlanData = purchasedPlanRes.data[0];
        if (purchasedPlanData.selectedDuration === "monthly") {
          planPrice = purchasedPlanData.monthQty * planData.monthlyPrice;
        }
        else if (purchasedPlanData.selectedDuration === "quarterly") {
          planPrice = planData.quarterlyPrice;
        }
        else planPrice = planData.yearlyPrice;

        if (purchasedPlanData.admissionFee !== 0) {
          planPrice = parseFloat(planPrice) + parseFloat(purchasedPlanData.admissionFee);
        }

        amountPaid = purchasedPlanData.amountPaid;

        amountDue = parseFloat(planPrice) - parseFloat(amountPaid);

        if (amountDue == 0) {
          return res.json({ success: false, message: "No dues Amount" });
        }

        return res.status(200).json({ success: true, data: { amountDue, amountPaid, planPrice, purchasedPlanData } })

      })
    })
  }
  catch (error) {
    return res.status(500).json({ status: false, message: "server error" });
  }
}

const getMembershipPlans = async (req, res) => {
  const { adminId } = req.params;
  const query = `SELECT * FROM membershipPlans WHERE isDeleted=false AND planType='membership' AND userId=${adminId}`;

  sqlService.query(query, (response) => {
    if (!response.success) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }

    return res.status(200).json({ success: true, data: response.data });
  });
};

const getAllPlans = async (req, res) => {
  const { adminId } = req.params;
  const query = `SELECT * FROM membershipPlans WHERE isDeleted=false AND userId=${adminId}`;

  sqlService.query(query, (response) => {
    if (!response.success) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }

    return res.status(200).json({ success: true, data: response.data });
  });
};

const getVistiorPlans = async (req, res) => {
  const query = `SELECT * FROM membershipPlans WHERE isDeleted=false AND planType='visitor'`;

  sqlService.query(query, (response) => {
    if (!response.success) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }

    return res.status(200).json({ success: true, data: response.data });
  });
};

const viewPlansById = async (req, res) => {
  const { adminId, membershipPlanId } = req.params;

  if (!membershipPlanId) {
    return res.status(400).json({ message: "Membership Plan Id is required" });
  }

  const query = `SELECT * FROM membershipPlans WHERE id = ${membershipPlanId} AND userId=${adminId} AND isDeleted=false`;

  sqlService.query(query, (response) => {
    if (!response.success) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }

    res.status(200).json({ success: true, data: response.data });
  });
};

const getActiveCustomers = async (req, res, next) => {
  try {
    const { adminId } = req.params;


    const { searchTerm } = req.query;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required.",
      });
    }

    // Base query
    let query = `
      SELECT u.*, 
        mp.planName, 
        mp.monthlyPrice, 
        mp.quarterlyPrice, 
        mp.yearlyPrice, 
        mp.status AS planStatus,
        mpu.expiryDate, 
        mpu.paymentStatus
      FROM users u
      LEFT JOIN membershipPurchases mpu ON u.id = mpu.userId AND mpu.expiryDate > NOW()
      LEFT JOIN membershipPlans mp ON mpu.membershipPlansId = mp.id
      WHERE u.userType = 'Customer' 
      AND u.createdByAdmin = ${adminId}
      AND u.status = 'active'
    `;

    let countQuery = `SELECT COUNT(*) AS total
    FROM users u
    LEFT JOIN membershipPurchases mpu ON u.id = mpu.userId AND mpu.expiryDate > NOW()
    LEFT JOIN membershipPlans mp ON mpu.membershipPlansId = mp.id
    WHERE u.userType = 'Customer' 
    AND u.createdByAdmin = ${adminId}
    AND u.status = 'active'
    `;

    // Apply searchTerm filter for phoneNo and name
    // Helper function to check if a string is a number
    function isDigit(str) {
      return /^\d+$/.test(str);
    }

    if (searchTerm) {
      const sanitizedSearch = searchTerm.trim();

      if (isDigit(sanitizedSearch)) {
        query += ` AND ( u.employeeNo LIKE '%${sanitizedSearch}%')`;
        countQuery += ` AND ( u.employeeNo LIKE '%${sanitizedSearch}%')`;
      }
      else {
        query += ` AND (u.name LIKE '%${sanitizedSearch}%'  OR u.employeeNo LIKE '%${sanitizedSearch}%' OR u.email LIKE '%${sanitizedSearch}%')`;
        countQuery += ` AND (u.name LIKE '%${sanitizedSearch}%'  OR u.employeeNo LIKE '%${sanitizedSearch}%' OR u.email LIKE '%${sanitizedSearch}%')`;
      }
    }

    // Pagination
    const { page = 1, limit = 4 } = req.query;
    const offset = (page - 1) * limit;

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    sqlService.query(query, (response) => {
      if (!response.success) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred.",
          error: response.error,
        });
      }

      if (response.data.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No customers found",
        });
      }

      sqlService.query(countQuery, (countResponse) => {
        if (!response.error) {
          return res.status(200).json({
            success: true,
            message: "Customers retrieved successfully.",
            data: response.data,
            totalData: countResponse.data[0].total,
            page: page,
            limit: limit,
            totalPages: Math.ceil(countResponse.data[0].total / limit),
          });
        }
      })

      // return res.status(200).json({
      //   success: true,
      //   message: "Customers retrieved successfully.",
      //   data: response.data,
      // });
    });
  } catch (error) {
    next(error);
  }
};

const viewPurchasedPlanByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is missing.",
      });
    }

    let query = `SELECT 
        p.*,
        mp.id AS purchaseId,
        mp.userId AS customerId,
        mp.purchaseDate,
        mp.expiryDate,
        mp.paymentStatus,
        mp.amountPaid,
        mp.selectedDuration,
        mp.dayQty,
        mp.monthQty,
        mp.status,
        u.name AS customerName,
        u.email AS customerEmail,
        u.phoneNumber AS customerPhone,
        u.userType AS customerType
    FROM membershipPlans p
    LEFT JOIN membershipPurchases mp 
        ON mp.membershipPlansId = p.id 
        AND mp.userId = ${userId}
    LEFT JOIN users u 
        ON mp.userId = u.id
    WHERE mp.status = 'active'`;

    sqlService.query(query, (response) => {
      if (!response.success) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred.",
          error: response.error,
        });
      }

      if (response.data.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No plan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Customers retrieved successfully.",
        data: response.data,
      });
    });
  } catch (error) {
    next(error);
  }
};

const getSubscribedUsers = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const { fromDate, toDate, searchTerm, filter } = req.query;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "AdminId is missing.",
      });
    }

    let query = `
    SELECT 
    p.planName,
    mp.*,                
    u.name,
    u.phoneNumber,
    u.email,
    u.employeeNo
    FROM membershipPlans p
    JOIN membershipPurchases mp 
    ON mp.membershipPlansId = p.id
    JOIN users u
    ON mp.userId = u.id
    WHERE p.userId = ${adminId}
    AND mp.status = 'active'
`;

    if (
      fromDate &&
      toDate &&
      fromDate !== "null" &&
      toDate !== "null" &&
      fromDate !== undefined &&
      toDate !== undefined
    ) {
      const from = `${fromDate} 00:00:00`;
      const to = `${toDate} 23:59:59`;
      query += ` AND mp.createdAt BETWEEN '${from}' AND '${to}'`;
    }


    if (searchTerm && searchTerm !== "null") {
      query += ` AND u.phoneNumber LIKE '%${searchTerm}%'`;
    }

    if (filter === 'expired') {
      query += ` AND mp.expiryDate < NOW()`;
    } else {
      // Default: Only non-expired users
      query += ` AND mp.expiryDate >= NOW()`;
    }



    sqlService.query(query, (response) => {

      if (!response.success) {
        return res.status(500).json({
          success: false,
          message: "Database error occurred.",
          error: response.error,
        });
      }

      if (response.data.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No plan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Customers retrieved successfully.",
        data: response.data,
      });
    });
  } catch (error) {
    next(error);
  }
};

// const getSubscribedUsers = async (req, res, next) => {
//   try {
//     const { adminId } = req.params;
//     const { fromDate, toDate, searchTerm } = req.query;

//     if (!adminId) {
//       return res.status(400).json({
//         success: false,
//         message: "Admin ID is required.",
//       });
//     }

//     let query = `SELECT
//         mp.*,
//         p.*,
//         u.*
//       FROM membershipPurchases mp
//       JOIN membershipPlans p ON mp.membershipPlansId = p.id
//       JOIN users u ON mp.userId = u.id
//       WHERE p.userId = ${adminId}
//         AND mp.status = 'active'`;

//     // Apply searchTerm (on user name or phone number)
//     if (searchTerm) {
//       const trimmedSearch = searchTerm.trim();
//       query += ` AND (u.name LIKE '%${trimmedSearch}%' OR u.phoneNumber LIKE '%${trimmedSearch}%')`;
//     }

//     // Apply date filters (assuming mp.createdAt exists)
//     if (fromDate && toDate && fromDate !== "null" && toDate !== "null") {
//       query += ` AND mp.createdAt BETWEEN '${fromDate}' AND '${toDate}'`;
//     }

//     console.log("query:", query);

//     sqlService.query(query, (response) => {
//       if (!response.success) {
//         return res.status(500).json({
//           success: false,
//           message: "Database error occurred.",
//           error: response.error,
//         });
//       }

//       if (response.data.length === 0) {
//         return res.status(200).json({
//           success: false,
//           message: "No subscribed customers found.",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Customers retrieved successfully.",
//         data: response.data,
//       });
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const setMonthlySalary = async (req, res) => {
  try {
    const { userId, adminId, salaryAmount, effectiveFrom } = req.body;

    if (!userId || !adminId || !salaryAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const checkQuery = `
      SELECT * FROM monthlySalarySettings
      WHERE adminId = ${adminId} AND userId = ${userId}`;

    sqlService.query(checkQuery, async (existing) => {

      if (existing.data.length > 0) {
        // Record exists → Update
        const record = existing.data?.[0];
        const updateObj = { salaryAmount };

        sqlService.update(
          sqlService.MonthlySalarySettings,
          updateObj,
          { id: record.id },
          async (updateRes) => {
            if (!updateRes.success) {
              return res.status(500).json({
                success: false,
                message: "Error updating salary settings",
              });
            }

            return res.status(200).json({
              success: true,
              message: "Monthly salary updated successfully",
            });
          }
        );
      } else {
        // Record does not exist → Insert
        const insertObj = {
          userId,
          adminId,
          salaryAmount,
          effectiveFrom
        };

        sqlService.insert(
          sqlService.MonthlySalarySettings,
          insertObj,
          async (insertRes) => {
            if (!insertRes.success) {
              return res.status(500).json({
                success: false,
                message: "Error inserting salary settings",
              });
            }

            return res.status(201).json({
              success: true,
              message: "Monthly salary created successfully",
            });
          }
        );
      }
    });
  } catch (error) {
    console.error("Error in setMonthlySalary:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const calculateSalary = async (req, res) => {
  const { adminId, month, year } = req.body;
  const { searchTerm } = req.query;

  let getUsersQuery = `
    SELECT id, name, email, phoneNumber, userType FROM users
    WHERE userType NOT IN ('Admin', 'SuperAdmin', 'Customer')
    AND createdByAdmin = ${adminId}
    AND status = 'active'
  `;

  // If phoneNumber is provided, add it to the query
  if (searchTerm) {
    getUsersQuery += ` AND name LIKE '%${searchTerm}%' OR  phoneNumber LIKE '%${searchTerm}%'`;
  }

  sqlService.query(getUsersQuery, async (usersRes) => {

    if (!usersRes.success) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch users" });
    }

    const users = usersRes.data;
    const results = [];

    await Promise.all(
      users.map((user) => {
        const { id: userId, name, email, phoneNumber, userType } = user;

        return new Promise((resolve) => {
          const getSalarySettingQuery = `
            SELECT salaryAmount FROM monthlySalarySettings
            WHERE userId = ${userId} AND adminId = ${adminId}
          `;

          sqlService.query(getSalarySettingQuery, (salaryRes) => {
            if (!salaryRes.success || !salaryRes.data.length) {
              results.push({
                userId,
                name,
                email,
                phoneNumber,
                userType,
                totalPresentDays: 0,
                calculatedAmount: 0,
                oneDaySalary: 0,
                reason: "No salary setting found",
                month,
                year
              });
              return resolve();
            }

            const salaryAmount = salaryRes.data[0].salaryAmount;
            const baseDays =
              month == 2
                ? 24
                : ["04", "06", "09", "11"].includes(month)
                  ? 26
                  : 27;
            const oneDaySalary = Math.round(salaryAmount / baseDays);

            const getAttendanceQuery = `
              SELECT COUNT(*) AS total FROM attendances
              WHERE userId = ${userId} AND adminId = ${adminId}
              AND MONTH(time) = ${month} AND YEAR(time) = ${year} AND status='Present'
            `;

            sqlService.query(getAttendanceQuery, (attendanceRes) => {
              if (!attendanceRes.success) {
                results.push({
                  userId,
                  name,
                  email,
                  phoneNumber,
                  userType,
                  calculatedAmount: 0,
                  reason: "Attendance query failed",
                  month,
                  year
                });
                return resolve();
              }

              const totalAttendance = attendanceRes.data[0].total;

              const getHolidayQuery = `
                SELECT privateOffDays, extraDuties FROM holidaySummaries
                WHERE userId = ${userId} AND adminId = ${adminId}
                AND month = ${month} AND year = ${year}
              `;

              sqlService.query(getHolidayQuery, (holidayRes) => {
                if (!holidayRes.success) {
                  results.push({
                    userId,
                    name,
                    email,
                    phoneNumber,
                    userType,
                    calculatedAmount: 0,
                    reason: "Holiday summary failed",
                    month,
                    year
                  });
                  return resolve();
                }

                const summary = holidayRes.data[0] || {
                  privateOffDays: 0,
                  extraDuties: 0,
                };
                const effectiveDays =
                  totalAttendance -
                  summary.privateOffDays +
                  summary.extraDuties;

                const salary = Math.round(oneDaySalary * effectiveDays);

                results.push({
                  userId,
                  name,
                  email,
                  phoneNumber,
                  userType,
                  totalPresentDays: effectiveDays,
                  oneDaySalary,
                  salaryAmount,
                  salary,
                  month,
                  year
                });

                resolve();
              });
            });
          });
        });
      })
    );

    return res.json({ success: true, data: results });
  });
};


const getSalaryHistories = (req, res) => {
  const { adminId } = req.params;
  const { fromDate, toDate, searchTerm } = req.query;

  if (!adminId) {
    return res.status(400).json({ success: false, message: 'adminId is required' });
  }

  let query = `
    SELECT 
      salaryHistories.*, 
      users.id AS userId,
      users.name AS userName, 
      users.email AS userEmail,
      users.phoneNumber AS userPhone
      FROM salaryHistories
      JOIN users ON users.id = salaryHistories.userId
      WHERE salaryHistories.adminId = ${adminId}
  `;

  if (
    fromDate &&
    toDate &&
    fromDate !== "null" &&
    toDate !== "null" &&
    fromDate !== undefined &&
    toDate !== undefined
  ) {
    query += ` AND salaryHistories.createdAt BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59'`;
  }


  if (searchTerm && searchTerm !== "null") {
    query += ` AND users.phoneNumber = '${searchTerm}'`;
  }

  sqlService.query(query, (response) => {

    if (!response.success) {
      return res.status(500).json({ success: false, message: 'Failed to fetch salary histories' });
    }

    const totalAmount = response.data.reduce((total, item) => total + parseFloat(item.calculatedAmount || 0), 0);

    const data = response.data.map(item => ({
      ...item,
      amountPaid: item.calculatedAmount,
      type: 'Salary'
    }));

    return res.json({ success: true, data: data, totalAmount });
  });
};

const getIndividualSalaryHistories = (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required' });
  }

  let query = `
    SELECT 
      salaryHistories.*, 
      users.id AS userId,
      users.name AS userName, 
      users.email AS userEmail,
      users.phoneNumber AS userPhone
      FROM salaryHistories
      JOIN users ON users.id = salaryHistories.userId
      WHERE salaryHistories.userId = ${userId}
      ORDER BY createdAt DESC
  `;

  // if (
  //   fromDate &&
  //   toDate &&
  //   fromDate !== "null" &&
  //   toDate !== "null" &&
  //   fromDate !== undefined &&
  //   toDate !== undefined
  // ) {
  //   query += ` AND salaryHistories.createdAt BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59'`;
  // }


  // if (searchTerm && searchTerm !== "null") {
  //   query += ` AND users.phoneNumber = '${searchTerm}'`;
  // }

  sqlService.query(query, (response) => {

    if (!response.success) {
      return res.status(500).json({ success: false, message: 'Failed to fetch salary histories' });
    }

    const totalAmount = response.data.reduce((total, item) => total + parseFloat(item.calculatedAmount || 0), 0);



    return res.json({ success: true, data: response.data, totalAmount });
  });
};

const insertSalaryHistory = async (req, res) => {
  const { userId, adminId, totalPresentDays, calculatedAmount, month, year } = req.body;

  if (!userId || !adminId || !month || !year) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const checkQuery = `
  SELECT * FROM salaryHistories 
  WHERE userId = ${userId} 
  AND adminId = ${adminId} 
  AND month = '${month}' 
  AND year = '${year}'
`;


  sqlService.query(checkQuery, (response) => {
    if (!response.success) {
      return res.status(500).json({ success: false, message: "Error checking salary history" });
    }

    if (response.data.length > 0) {
      return res.status(200).json({ success: false, message: "Salary record already exists for this user, month, and year." });
    }

    const insertObj = {
      userId,
      adminId,
      totalPresentDays: totalPresentDays || 0,
      calculatedAmount: calculatedAmount || 0,
      month,
      year
    };

    sqlService.insert(sqlService.SalaryHistories, insertObj, (insertResponse) => {
      if (!insertResponse.success) {
        return res.status(500).json({ success: false, message: "Failed to insert salary history" });
      }

      return res.status(201).json({ success: true, data: insertResponse.data });
    });
  })



};

const getMembershipPaymentHistory = async (req, res) => {
  const { adminId } = req.params;
  const { fromDate, toDate, searchTerm } = req.query;

  if (!adminId) {
    return res.status(400).json({ success: false, message: 'adminId is required' });
  }

  let query = `
    SELECT 
      users.id AS userId,
      users.name AS userName,
      users.phoneNumber AS userPhone,
      users.email AS userEmail,
      membershipPlans.userId AS adminId,
      DATE(membershipPurchasesHistories.createdAt) AS createdDate,
      MAX(membershipPurchasesHistories.amountPaid) AS amountPaid, 
      MAX(membershipPurchasesHistories.admissionFee) AS admissionFee, 
      MAX(membershipPurchasesHistories.createdAt) AS createdAt
    FROM membershipPurchasesHistories
    JOIN users ON users.id = membershipPurchasesHistories.userId
    LEFT JOIN membershipPlans ON membershipPlans.id = membershipPurchasesHistories.membershipPlansId
    WHERE membershipPlans.userId = ${adminId}
  `;

  if (
    fromDate &&
    toDate &&
    fromDate !== "null" &&
    toDate !== "null" &&
    fromDate !== undefined &&
    toDate !== undefined
  ) {
    query += ` AND membershipPurchasesHistories.createdAt BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59'`;
  }

  if (searchTerm && searchTerm !== "null") {
    query += ` AND users.phoneNumber = '${searchTerm}'`;
  }

  query += ` GROUP BY users.id, DATE(membershipPurchasesHistories.createdAt)
             ORDER BY createdAt DESC`;

  sqlService.query(query, (response) => {
    if (!response.success) {
      return res.status(500).json({ success: false, message: 'Failed to fetch membership payment histories' });
    }

    const data = response.data.map(item => ({
      userId: item.userId,
      adminId: item.adminId,
      userName: item.userName,
      userEmail: item.userEmail,
      userPhone: item.userPhone,
      createdAt: item.createdAt,
      amountPaid: item.amountPaid,
      type: 'Membership',
      admissionFee: item.admissionFee
    }));
    let total = 0;

    response.data.forEach(item => total = parseFloat(item.amountPaid) + parseFloat(total))

    let totalAmount = total;
    return res.json({ success: true, data, totalAmount });
  });
};

const getMembershipInstallmentPayments = async (req, res) => {
  const { adminId } = req.params;
  const { fromDate, toDate, searchTerm } = req.query;

  if (!adminId) {
    return res.status(400).json({ success: false, message: 'adminId is required' });
  }

  // let query = `
  //   SELECT 
  //     u.id AS userId,
  //     u.name AS userName,
  //     u.phoneNumber AS userPhone,
  //     u.email AS userEmail,
  //     mpr.createdAt, 
  //     mpr.purchaseHistoryId, 
  //     mph.amountPaid as amountPaid,
  //     mp.userId AS adminId,
  //     mp.id AS membershipPlansId,
  //     mph.purchaseDate, 
  //     mpr.paymentStatus
  //   FROM (
  //     SELECT purchaseHistoryId, MAX(createdAt) AS latestPaymentDate, paymentStatus
  //     FROM membershipPurchasedInstallmentAmounts
  //     GROUP BY purchaseHistoryId
  //   ) AS latestPayments
  //   JOIN membershipPurchasedInstallmentAmounts mpr 
  //     ON mpr.purchaseHistoryId = latestPayments.purchaseHistoryId 
  //     AND mpr.createdAt = latestPayments.latestPaymentDate
  //   JOIN membershipPurchasesHistories mph 
  //     ON mph.id = mpr.purchaseHistoryId
  //   JOIN users u 
  //     ON u.id = mph.userId
  //   LEFT JOIN membershipPlans mp 
  //     ON mp.id = mph.membershipPlansId
  //   WHERE mp.userId = ${adminId}
  // `;

  let query = `
  SELECT 
    u.id AS userId,
    u.name AS userName,
    u.phoneNumber AS userPhone,
    u.email AS userEmail,
    mpr.createdAt, 
    mpr.purchaseHistoryId, 
    mph.amountPaid as amountPaid,
    mp.userId AS adminId,
    mp.id AS membershipPlansId,
    mph.purchaseDate, 
    mpr.paymentStatus
  FROM (
    SELECT purchaseHistoryId, MAX(createdAt) AS latestPaymentDate
    FROM membershipPurchasedInstallmentAmounts
    GROUP BY purchaseHistoryId
  ) AS latestPayments
  JOIN membershipPurchasedInstallmentAmounts mpr 
    ON mpr.purchaseHistoryId = latestPayments.purchaseHistoryId 
    AND mpr.createdAt = latestPayments.latestPaymentDate
  JOIN membershipPurchasesHistories mph 
    ON mph.id = mpr.purchaseHistoryId
  JOIN users u 
    ON u.id = mph.userId
  LEFT JOIN membershipPlans mp 
    ON mp.id = mph.membershipPlansId
  WHERE mp.userId = ${adminId}
`;

  if (
    fromDate &&
    toDate &&
    fromDate !== "null" &&
    toDate !== "null" &&
    fromDate !== undefined &&
    toDate !== undefined
  ) {
    query += ` AND mpr.createdAt BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59'`;
  }

  if (searchTerm && searchTerm !== "null") {
    query += ` AND u.phoneNumber = '${searchTerm}'`;
  }

  query += ` ORDER BY mpr.createdAt DESC`;

  sqlService.query(query, (response) => {

    if (!response.success) {
      return res.status(500).json({ success: false, message: 'Failed to fetch membership payment histories' });
    }

    const data = response.data.map(item => ({
      userId: item.userId,
      adminId: item.adminId,
      userName: item.userName,
      userEmail: item.userEmail,
      userPhone: item.userPhone,
      createdAt: item.createdAt,
      amountPaid: item.amountPaid,
      type: 'Membership',
      purchaseHistoryId: item.purchaseHistoryId,
      membershipPlansId: item.membershipPlansId,
      purchaseDate: item.purchaseDate,
      paymentStatus: item.paymentStatus
    }));

    return res.json({ success: true, data });
  });
};

const getActiveStaffUsers = (req, res) => {
  const { adminId } = req.params;
  const { fromDate, toDate, searchTerm } = req.query;

  if (!adminId) {
    return res.status(400).json({ success: false, message: 'adminId is required' });
  }

  let query = `
    SELECT id, name, email, phoneNumber, userType, employeeNo 
    FROM users 
    WHERE userType NOT IN ('Admin', 'SuperAdmin', 'Customer')
    AND status = 'active'
    AND createdByAdmin = ${adminId}
  `;

  // if (fromDate && toDate && fromDate !== 'null' && toDate !== 'null') {
  //   query += ` AND createdAt BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59'`;
  // }

  if (searchTerm && searchTerm !== 'null') {
    query += ` AND phoneNumber LIKE '%${searchTerm}%'`;
  }

  sqlService.query(query, (response) => {
    if (!response.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }

    return res.json({
      success: true,
      data: response.data
    });
  });
};

const getExpiringPlansOfUsers = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { fromDate, toDate, searchTerm } = req.query;

    if (!adminId) {
      return res.status(400).json({ success: false, message: "adminId is required" });
    }

    let whereClause = `
      mpPlans.userId = ${adminId}
      AND mpPurchases.status = 'active'
    `;

    if (fromDate && toDate) {
      whereClause += ` AND mpPurchases.expiryDate BETWEEN '${fromDate} 00:00:00' AND '${toDate} 23:59:59'`;
    } else {
      // Default to 90-day logic if no custom dates are sent
      whereClause += ` AND mpPurchases.expiryDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)`;
    }

    if (searchTerm) {
      whereClause += ` AND (
        users.name LIKE '%${searchTerm}%' OR
        users.phoneNumber LIKE '%${searchTerm}%' OR
        users.email LIKE '%${searchTerm}%'
      )`;
    }

    const query = `
      SELECT 
        users.id AS userId,
        users.name,
        users.phoneNumber,
        users.email,
        mpPurchases.expiryDate,
        mpPurchases.purchaseDate,
        mpPurchases.status,
        mpPlans.planName
      FROM membershipPurchases mpPurchases
      INNER JOIN membershipPlans mpPlans
        ON mpPurchases.membershipPlansId = mpPlans.id
      INNER JOIN users
        ON mpPurchases.userId = users.id
      WHERE ${whereClause};
    `;

    sqlService.query(query, (response) => {
      if (!response.success) {
        return res.status(500).json({ success: false, message: "Failed to fetch expiring plans" });
      }

      return res.status(200).json({
        success: true,
        data: response.data
      });
    });

  } catch (error) {
    console.error("Error fetching expiring plans:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const updateUserPlanStatusIfExpired = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required in the request body" });
    }

    // Step 1: Fetch active plans for the given user where expiryDate = today
    const selectQuery = `
      SELECT id 
      FROM membershipPurchases 
      WHERE userId = ${userId} 
      AND status = 'active' 
      AND expiryDate = CURDATE();
    `;

    sqlService.query(selectQuery, (selectResponse) => {
      if (!selectResponse.success) {
        return res.status(500).json({ success: false, message: "Error fetching user plans" });
      }

      const plansToExpire = selectResponse.data;

      if (plansToExpire.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No active plans found expiring today for this user."
        });
      }

      // Step 2: Update those plans to status 'expired'
      const idsToUpdate = plansToExpire.map(row => row.id).join(',');

      const updateQuery = `
        UPDATE membershipPurchases 
        SET status = 'expired' 
        WHERE id IN (${idsToUpdate});
      `;

      sqlService.query(updateQuery, (updateResponse) => {
        if (!updateResponse.success) {
          return res.status(500).json({ success: false, message: "Error updating plan statuses" });
        }

        return res.status(200).json({
          success: true,
          message: `${plansToExpire.length} plan(s) marked as expired for userId: ${userId}`
        });
      });
    });

  } catch (error) {
    console.error("Error updating plan status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};





// Device connection controller
const entryGate = async (req, res, next) => {
  const { employeeNo, name, userType, valid, doorRight } = req.body;
  // Set default static values (will be overwritten if provided in req.body)
  const defaultData = {
    employeeNo: employeeNo || "1001",
    name: name || "Default User",
    userType: userType || "normal",
    valid: valid || {
      enable: true,
      beginTime: "2025-01-01T00:00:00",
      endTime: "2025-12-31T23:59:59",
    },
    doorRight: doorRight || "1",
  };

  // Get current date
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  // Set fixed times for 2 PM and 4 PM
  const beginTime = `${year}-${month}-${day}T14:00:00`;
  const endTime = `${year}-${month}-${day}T16:00:00`;

  // Request payload
  const requestData = {
    UserInfo: {
      employeeNo: defaultData.employeeNo,
      name: defaultData.name,
      userType: defaultData.userType,
      valid: {
        enable: defaultData.valid.enable,
        beginTime: valid?.beginTime || beginTime,
        endTime: valid?.endTime || endTime,
      },
      doorRight: defaultData.doorRight,
    },
  };


  try {
    const client = new DigestClient("admin", "Rcit@123");
    const userInfoUrl = `http://192.168.29.112/ISAPI/AccessControl/Userinfo/Record?format=json`; // for registrations

    const userResponse = await client.fetch(userInfoUrl, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: { "Content-Type": "application/json" },
    });

    const userData = await userResponse.json();
    if (userData.statusCode === 1) {
      return res.status(200).json({
        success: true,
        message: "User added successfully",
        data: userData,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: userData.errorMsg,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Failed to process user information",
      details: err.message.errorMsg,
    });
  }
};



// Function to register the user on multiple devices
const registerUserOnDevices = async (devices, userData) => {
  const registrationResults = [];

  // Iterate over each device and register the user
  for (const device of devices) {
    const result = await registerUserOnDevice(device, userData);
    registrationResults.push(result);
  }
  // Return the results for all devices
  return registrationResults;
};




// const registerUserOnDevice = async (device, userData) => {
//   console.log(userData, "userData", device);
//   try {
//     const deviceIp = device.ipAddress;
//     const registerUrl = `http://${deviceIp}/ISAPI/AccessControl/Userinfo/Record?format=json`;
//     const modifyUrl = `http://${deviceIp}/ISAPI/AccessControl/UserInfo/Modify?format=json`;

//     const formatDate = (date, type = 'start') => {
//       const d = new Date(date);
//       const year = d.getFullYear();
//       const month = String(d.getMonth() + 1).padStart(2, '0');
//       const day = String(d.getDate()).padStart(2, '0');
//       let hours = String(d.getHours()).padStart(2, '0');
//       let minutes = String(d.getMinutes()).padStart(2, '0');
//       let seconds = String(d.getSeconds()).padStart(2, '0');

//       if (type === 'end') {
//         hours = '23';
//         minutes = '59';
//         seconds = '59';
//       }

//       return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
//     };

//     const requestData = {
//       UserInfo: {
//         employeeNo: userData.userId,
//         name: userData.name,
//         userType: "normal",
//         doorRight: "1",
//         valid: {
//           enable: true,
//           beginTime: formatDate(userData.valid.beginTime, 'start'),
//           endTime: formatDate(userData.valid.endTime, 'end'),
//         },
//         RightPlan: [
//           {
//             doorNo: 1,
//             planTemplateNo: "1"
//           }
//         ],
//       }
//     };

//     const client = new DigestClient(device.username, device.password);

//     // Try registering user
//     let response = await client.fetch(registerUrl, {
//       method: "POST",
//       body: JSON.stringify(requestData),
//       headers: { "Content-Type": "application/json" },
//     });

//     let result = await response.json();

//     if (result.statusCode === 1) {
//       console.log(`✅ User registered successfully on device ${device.deviceName}`);
//       return { success: true, deviceName: device.deviceName };
//     }

//     // If user already exists, modify them
//     if (result.subStatusCode === 'employeeNoAlreadyExist') {
//       console.log(`🔁 User exists. Attempting to modify user ${userData.userId} on device ${device.deviceName}...`);

//       let modifyResponse = await client.fetch(modifyUrl, {
//         method: "PUT",
//         body: JSON.stringify(requestData),
//         headers: { "Content-Type": "application/json" },
//       });

//       let modifyResult = await modifyResponse.json();

//       if (modifyResult.statusCode === 1) {
//         console.log(`✅ User modified successfully on device ${device.deviceName}`);
//         return { success: true, deviceName: device.deviceName, modified: true };
//       } else {
//         console.log(`❌ Failed to modify user on device ${device.deviceName}:`, modifyResult.errorMsg);
//         return { success: false, data: modifyResult.subStatusCode };
//       }
//     }

//     // General failure
//     console.log(`❌ Failed to register user on device ${device.deviceName}:`, result.errorMsg);
//     return { success: false, data: result.subStatusCode };

//   } catch (err) {
//     console.error(`Error registering/modifying user on device ${device.deviceName}:`, err);
//     return { success: false, error: err.message };
//   }
// };

const registerUserOnDevice = async (device, userData) => {

  try {
    const deviceIp = device.ipAddress;
    console.log("deviceIp...", deviceIp);

    const registerUrl = `http://${deviceIp}/ISAPI/AccessControl/Userinfo/Record?format=json`;
    const modifyUrl = `http://${deviceIp}/ISAPI/AccessControl/UserInfo/Modify?format=json`;

    const formatDate = (date, type = 'start') => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      let hours = String(d.getHours()).padStart(2, '0');
      let minutes = String(d.getMinutes()).padStart(2, '0');
      let seconds = String(d.getSeconds()).padStart(2, '0');

      if (type === 'end') {
        hours = '23';
        minutes = '59';
        seconds = '59';
      }

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const requestData = {
      UserInfo: {
        employeeNo: userData.userId,
        name: userData.name,
        userType: "normal",
        doorRight: "1",
        valid: {
          enable: true,
          beginTime: formatDate(userData.valid.beginTime, 'start'),
          endTime: formatDate(userData.valid.endTime, 'end'),
        },
        RightPlan: [
          {
            doorNo: 1,
            planTemplateNo: "1"
          }
        ],
      }
    };

    const client = new DigestClient(device.username, device.password);

    // Attempt registering the user
    let response = await client.fetch(registerUrl, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: { "Content-Type": "application/json" },
    });

    let result = await response.json();
    console.log("result : ", result);
    if (result.statusCode === 1) {
      console.log(`✅ User registered successfully on device ${device.purpose}`);
      return { success: true, deviceName: device.purpose };
    }
    console.log("result.subStatusCode : ", result.subStatusCode)
    // If user already exists, attempt modification
    if (result.subStatusCode === 'employeeNoAlreadyExist') {
      console.log(`🔁 User exists. Attempting to modify user ${userData.userId} on device ${device.deviceName}...`);

      let modifyResponse = await client.fetch(modifyUrl, {
        method: "PUT",
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      });

      let modifyResult = await modifyResponse.json();

      if (modifyResult.statusCode === 1) {
        console.log(`✅ User modified successfully on device ${device.deviceName}`);
        return { success: true, deviceName: device.deviceName, modified: true };
      } else {
        console.error(`❌ Failed to modify user on device ${device.deviceName}:`, modifyResult.errorMsg);
        return { success: false, message: `Error modifying user: ${modifyResult.errorMsg}` };
      }
    }

    // General failure scenario
    console.error(`❌ Failed to register user on device ${device.purpose}:`, result.errorMsg);
    return { success: false, message: `Registration failed: ${result.errorMsg}` };

  } catch (err) {
    return { success: false, message: `Unexpected error occurred: ${err.message}` };
  }
};


// const fetchAttendanceData = async (req, res) => {
//   try {
//     const { adminId, userType, deviceId } = req.body;

//     const { startTime, endTime, userId } = req.query;

//     if (!adminId) {
//       return res.status(400).json({ success: false, message: "Invalid adminId or userId." });
//     }

//     if (!userType) {
//       return res.status(400).json({ success: false, message: "Provide the userType" });
//     }

//     const now = moment().utcOffset("+05:30").endOf("day");
//     const start = startTime ? moment(new Date(startTime)).utcOffset("+05:30").startOf("day") : moment().subtract(1, "day").utcOffset("+05:30").startOf("day");
//     const end = endTime ? moment(new Date(endTime)).utcOffset("+05:30").endOf("day") : moment().subtract(1, "day").utcOffset("+05:30").endOf("day");

//     if (start.isAfter(now) || end.isAfter(now)) {
//       return res.status(200).json({ success: false, message: "Date range must be today or earlier." });
//     }

//     const searchID = `search-${Date.now()}`;
//     const requestData = {
//       AcsEventCond: {
//         searchID,
//         searchResultPosition: 0,
//         maxResults: 1000,
//         major: 5,
//         minor: 75,
//         startTime: start.format("YYYY-MM-DDTHH:mm:ssZ"),
//         endTime: end.format("YYYY-MM-DDTHH:mm:ssZ"),
//         picEnable: false
//       },
//     };

//     // Promisify the SQL query:
//     const deviceResponse = await new Promise((resolve, reject) => {
//       sqlService.query(`SELECT * FROM devices WHERE id=${deviceId}`, (result) => {
//         if (!result.success) return reject(new Error("Failed to fetch device IP."));
//         resolve(result);
//       });
//     });

//     console.log('deviceResponse..', deviceResponse);


//     const userName = deviceResponse.data[0].username;
//     const password = deviceResponse.data[0].password;

//     const ipAddress = deviceResponse.data[0].ipAddress;

//     const client = new DigestClient(userName, password);
//     const url = `http://${ipAddress}/ISAPI/AccessControl/AcsEvent?format=json`;

//     let response;
//     try {
//       response = await client.fetch(url, {
//         method: "POST",
//         body: JSON.stringify(requestData),
//         headers: { "Content-Type": "application/json" },
//       });
//     } catch (error) {
//       console.error(`Error connecting to device at ${ipAddress}`);
//       if (['ETIMEDOUT', 'EHOSTDOWN', 'ENETUNREACH', 'ECONNREFUSED'].includes(error.code)) {
//         return res.status(200).json({ success: false, message: `Device is unreachable (${error.code}).` });
//       }
//       return res.status(500).json({ success: false, message: `Unexpected fetch error: ${error.message}` });
//     }

//     if (!response.ok) {
//       return res.status(500).json({ success: false, message: `Device error: ${response.statusText}` });
//     }

//     const data = await response.json();
//     const attendanceList = data?.AcsEvent?.InfoList || [];
//     const attendanceMap = {};

//     for (const info of attendanceList) {
//       const empId = info.employeeNoString;
//       const date = new Date(info.time).toISOString().split("T")[0];
//       const key = `${empId}-${date}`;
//       if (!attendanceMap[key] || new Date(info.time) < new Date(attendanceMap[key].time)) {
//         attendanceMap[key] = info;
//       }
//     }

//     const startDate = start.format("YYYY-MM-DD HH:mm:ss");
//     const endDate = end.format("YYYY-MM-DD HH:mm:ss");

//     // Just to get active users who's absent
//     let membershipsQuery = `
//       SELECT u.id AS userId, u.name, m.purchaseDate, m.expiryDate
//       FROM users u
//       INNER JOIN membershipPurchases m ON u.id = m.userId
//       WHERE u.userType = '${userType}'
//       AND u.createdByAdmin = ${adminId}
//       AND m.status = 'active'
//       AND m.paymentStatus = 'true'
//       AND m.expiryDate >= '${startDate} 00:00:00'
//       AND m.purchaseDate <= '${endDate} 23:59:59'`;

//     if (userId) membershipsQuery += ` AND u.id = ${userId}`;

//     const membershipResponse = await new Promise((resolve, reject) => {
//       sqlService.query(membershipsQuery, (result) => {
//         if (!result.success) return reject(new Error("Failed to fetch active members."));
//         resolve(result);
//       });
//     });

//     const members = membershipResponse.data;
//     const insertPromises = [];
//     const resultData = [];

//     for (const member of members) {
//       const empId = member.userId;
//       const name = member.name;
//       const validFrom = moment(member.purchaseDate).startOf("day");
//       const validTo = moment(member.expiryDate).endOf("day");

//       for (let date = moment(start); date.isSameOrBefore(end, "day"); date.add(1, "day")) {
//         const dateStr = date.format("YYYY-MM-DD");
//         if (date.isBefore(validFrom) || date.isAfter(validTo)) continue;

//         const key = `${empId}-${dateStr}`;
//         const existing = attendanceMap[key];

//         const checkQuery = `
//           SELECT * FROM attendances WHERE userId = '${empId}' AND DATE(time) = '${dateStr}' AND adminId = '${adminId}' LIMIT 1
//         `;

//         const attendanceResult = await new Promise((resolve, reject) => {
//           sqlService.query(checkQuery, (result) => {
//             if (!result.success) return reject(new Error("Failed during attendance check."));
//             resolve(result);
//           });
//         });

//         if (attendanceResult.data.length === 0) {
//           const isToday = moment(dateStr).isSame(moment(), "day");
//           if (!existing && isToday) continue;

//           const insertObj = {
//             userId: empId,
//             adminId,
//             name,
//             time: existing ? new Date(existing.time) : new Date(dateStr),
//             status: existing ? "Present" : "Absent",
//             deviceId: deviceId
//           };

//           insertPromises.push(new Promise((resolve, reject) => {
//             sqlService.insert(sqlService.Attendances, insertObj, (insertResponse) => {
//               if (!insertResponse.success) return reject(new Error("Failed to insert attendance record."));
//               resolve(insertResponse);
//             });
//           }));

//           resultData.push(insertObj);
//         } else {
//           resultData.push({
//             userId: empId,
//             name,
//             time: attendanceResult.data[0].time,
//             status: attendanceResult.data[0].status,
//           });
//         }
//       }
//     }

//     await Promise.all(insertPromises);

//     const presentCountByType = await new Promise((resolve, reject) => {
//       const presentQuery = `
//         SELECT u.userType, COUNT(*) AS count
//         FROM attendances a
//         INNER JOIN users u ON a.userId = u.id
//         WHERE a.adminId = '${adminId}'
//         AND a.status = 'Present'
//         AND DATE(a.time) BETWEEN '${start.format("YYYY-MM-DD")}' AND '${end.format("YYYY-MM-DD")}'
//         GROUP BY u.userType
//       `;

//       sqlService.query(presentQuery, (result) => {
//         if (!result.success) return reject(new Error("Failed to count present attendances."));
//         const counts = { Customer: 0, Trainer: 0 };
//         for (const row of result.data) {
//           if (row.userType === "Customer") counts.Customer = row.count;
//           else if (row.userType === "Trainer") counts.Trainer = row.count;
//         }
//         resolve(counts);
//       });
//     });

//     res.status(200).json({
//       success: true,
//       message: "Attendance processed with valid memberships only.",
//       data: resultData,
//       presentCount: presentCountByType,
//     });
//   } catch (err) {
//     console.error(`❌ Error: ${err.code || ''} ${err.message}`);
//     res.status(500).json({ success: false, message: "Internal server error.", error: err.message });
//   }
// };

const fetchAttendanceData = async (req, res) => {

  try {
    const { adminId, userType, deviceId } = req.body;
    const { fromDate, toDate, userId } = req.query;

    if (!adminId) return res.status(400).json({ success: false, message: "Invalid adminId or userId." });
    if (!userType) return res.status(400).json({ success: false, message: "Provide the userType" });

    const now = moment().utcOffset("+05:30").endOf("day");

    const start = fromDate
      ? moment(fromDate.trim(), "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        .utcOffset("+05:30")
        .startOf("day")
      : moment().subtract(1, "day").utcOffset("+05:30").startOf("day");

    const end = toDate
      ? moment(toDate.trim(), "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        .utcOffset("+05:30")
        .endOf("day")
      : moment().utcOffset("+05:30").endOf("day");

    console.log("start...", start);
    console.log("end...", end);


    if (start.isAfter(now) || end.isAfter(now)) {
      return res.status(200).json({ success: false, message: "Date range must be today or earlier." });
    }

    const searchID = `search-${Date.now()}`;

    const requestDataBase = {
      AcsEventCond: {
        searchID,
        searchResultPosition: 0,
        maxResults: 30,  // device is returning 30 anyway, better to fix it
        major: 5,
        minor: 75,
        startTime: start.format("YYYY-MM-DDTHH:mm:ssZ"),
        endTime: end.format("YYYY-MM-DDTHH:mm:ssZ"),
        picEnable: false
      },
    };

    const deviceResponse = await new Promise((resolve, reject) => {
      sqlService.query(`SELECT * FROM devices WHERE id=${deviceId}`, (result) => {
        if (!result.success) return reject(new Error("Failed to fetch device IP."));
        resolve(result);
      });
    });

    const userName = deviceResponse.data[0].username;
    const password = deviceResponse.data[0].password;
    const ipAddress = deviceResponse.data[0].ipAddress;

    const url = `http://${ipAddress}/ISAPI/AccessControl/AcsEvent?format=json`;


    let totalAttendanceList = [];
    let employeeNoJson = {};
    let currentPosition = 0;
    let hasMore = true;

    while (hasMore) {
      const client = new DigestClient(userName, password);
      const requestData = {
        AcsEventCond: {
          ...requestDataBase.AcsEventCond,
          searchResultPosition: currentPosition,
        },
      };

      let response;
      try {
        response = await client.fetch(url, {
          method: "POST",
          body: JSON.stringify(requestData),
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error(`Error connecting to device at ${ipAddress}`);
        if (['ETIMEDOUT', 'EHOSTDOWN', 'ENETUNREACH', 'ECONNREFUSED'].includes(error.code)) {
          return res.status(200).json({ success: false, message: `Device is unreachable (${error.code}).` });
        }
        return res.status(500).json({ success: false, message: `Unexpected fetch error: ${error.message}` });
      }

      if (!response.ok) return res.status(500).json({ success: false, message: `Device error: ${response.statusText}` });

      const data = await response.json();
      const attendanceList = data?.AcsEvent?.InfoList || [];
      totalAttendanceList = totalAttendanceList.concat(attendanceList);
      // console.log("attendance : ", totalAttendanceList)
      const totalMatches = data?.AcsEvent?.totalMatches || 0;
      const responseStatusStrg = data?.AcsEvent?.responseStatusStrg || "";
      currentPosition += attendanceList.length;

      console.log(`Fetched ${currentPosition} / ${totalMatches} entries`);

      hasMore = responseStatusStrg === "MORE" && currentPosition < totalMatches;
      console.log(" totalAttendanceList length : ", totalAttendanceList.length)
    }

    const attendanceMap = {};
    const employeeNoArray = [];
    for (const info of totalAttendanceList) {
      // console.log(cnt1++ , " : ", info.employeeNoString);

      const empId = info.employeeNoString;
      const date = info.time.split("T")[0];
      // console.log("info time :", info.time);

      const key = `${empId}-${date}`;
      if (!attendanceMap[key] || new Date(info.time) < new Date(attendanceMap[key].time)) {
        // console.log("key : ", key);
        attendanceMap[key] = info;

        employeeNoJson[empId] = empId;
      }
    }

    // const filePath = path.join(__dirname, '../data/employeeNoJson.json');

    // fs.writeFile(filePath, JSON.stringify(employeeNoJson, null, 2), (err) => {
    //   if (err) {
    //     console.error("❌ Error writing JSON file:", err);
    //   } else {
    //     console.log("✅ employeeNoJson saved at:", filePath);
    //   }
    // });

    // console.log("employee No : ", employeeNoArray);
    console.log("attendanceMap length: ", Object.keys(attendanceMap).length);
    // console.log("attendance data : ", attendanceMap)

    const startDate = start.format("YYYY-MM-DD HH:mm:ss");
    const endDate = end.format("YYYY-MM-DD HH:mm:ss");

    // fetching to compare if the user exists for the current admin
    let usersQuery = `
      SELECT u.id AS userId, u.employeeNo, u.name${userType === "Customer" ? ', m.purchaseDate, m.expiryDate' : ''}
      FROM users u
      ${userType === "Customer" ? 'INNER JOIN membershipPurchases m ON u.id = m.userId' : ''}
      WHERE u.userType = '${userType}'
      AND u.createdByAdmin = ${adminId}
      ${userType === "Customer" ? `
        AND m.status = 'active'
        AND m.paymentStatus = 'true'
        AND m.expiryDate >= '${startDate}'
        AND m.purchaseDate <= '${endDate}'
      ` : ''}
    `;
    // console.log("userQuery : ", usersQuery)
    if (userId) usersQuery += ` AND u.id = ${userId}`;

    const usersResponse = await new Promise((resolve, reject) => {
      sqlService.query(usersQuery, (result) => {

        // console.log("result : ", result);
        if (!result.success) return reject(new Error("Failed to fetch users."));
        resolve(result);
      });
    });

    const users = usersResponse.data;
    console.log("users...", users.length);


    const insertPromises = [];
    const resultData = [];
    let cnt = 0;
    let cnt1 = 0;
    let cnt2 = 0;
    for (const user of users) {
      const empId = user.employeeNo;
      const userId = user.userId;
      const name = user.name;

      const validFrom = userType === 'Customer' ? moment(user.purchaseDate).startOf("day") : start.clone();
      const validTo = userType === 'Customer' ? moment(user.expiryDate).endOf("day") : end.clone();

      for (let date = moment(start); date.isSameOrBefore(end, "day"); date.add(1, "day")) {
        // console.log("date in for loop : ", date);
        const dateStr = date.format("YYYY-MM-DD");
        if (date.isBefore(validFrom) || date.isAfter(validTo)) continue;

        const key = `${empId}-${dateStr}`;
        // console.log("key 2 : ", key);
        const existing = attendanceMap[key];
        if (existing) {
          cnt++;
        }
        else cnt2++;

        // const checkQuery = `
        //   SELECT * FROM attendances
        //   WHERE userId = '${userId}'
        //   AND time BETWEEN '${dateStr} 00:00:00' AND '${dateStr} 23:59:59'
        //   AND adminId = '${adminId}'
        //   LIMIT 1
        //   `;

        const checkQuery =
          ` SELECT * FROM attendances WHERE userId = '${userId}' AND DATE(time) = '${dateStr}' AND adminId = '${adminId}' LIMIT 1`
          ;
        // console.log("checkQuery : ", checkQuery);

        const attendanceResult = await new Promise((resolve, reject) => {
          sqlService.query(checkQuery, (result) => {
            if (!result.success) return reject(new Error("Failed during attendance check."));
            resolve(result);
          });
        });

        // console.log("attendanceResult...", attendanceResult);


        if (attendanceResult.data.length === 0) {
          // const isToday = moment(dateStr).isSame(moment(), "day");

          // console.log("existing...", existing);


          if (!existing && userType === "Customer") continue;

          const insertObj = {
            userId: userId,
            adminId,
            name,
            time: existing ? new Date(existing.time) : new Date(dateStr),
            status: existing ? "Present" : "Absent",
            deviceId: deviceId
          };
          // console.log("insertObj...", insertObj);


          insertPromises.push(new Promise((resolve, reject) => {
            sqlService.insert(sqlService.Attendances, insertObj, (insertResponse) => {
              // console.log("insertResponse", insertResponse);

              if (!insertResponse.success) return reject(new Error("Failed to insert attendance record."));
              resolve(insertResponse);
            });
          }));

          insertObj.employeeNo = empId;
          resultData.push(insertObj);
        } else {
          resultData.push({
            userId: userId,
            name,
            time: attendanceResult.data[0].time,
            status: attendanceResult.data[0].status,
            employeeNo: empId
          });
        }
      }
    }
    console.log("cnt : ", cnt);
    console.log("cnt2 : ", cnt2);

    await Promise.all(insertPromises);

    const presentCountByType = await new Promise((resolve, reject) => {
      const presentQuery = `
        SELECT u.userType, COUNT(*) AS count
        FROM attendances a
        INNER JOIN users u ON a.userId = u.id
        WHERE a.adminId = '${adminId}'
        AND a.status = 'Present'
        AND DATE(a.time) BETWEEN '${start.format("YYYY-MM-DD")}' AND '${end.format("YYYY-MM-DD")}'
        GROUP BY u.userType
      `;

      sqlService.query(presentQuery, (result) => {
        if (!result.success) return reject(new Error("Failed to count present attendances."));
        const counts = { Customer: 0, Trainer: 0 };
        for (const row of result.data) {
          if (row.userType === "Customer") counts.Customer = row.count;
          else if (row.userType === "Trainer") counts.Trainer = row.count;
        }
        resolve(counts);
      });
    });

    res.status(200).json({
      success: true,
      message: "Attendance processed.",
      data: resultData,
      presentCount: presentCountByType,
    });

  } catch (err) {
    console.error(`❌ Error: ${err.code || ''} ${err.message}`);
    res.status(500).json({ success: false, message: "Internal server error.", error: err.message });
  }
};

const fetchTodaysAttendance = async (req, res) => {
  const { adminId } = req.params;

  const query = ` SELECT COUNT(*) AS count
      FROM attendances
      WHERE DATE(time) = CURDATE() AND adminId=${adminId}`

  try {
    sqlService.query(query, (response) => {
      if (!response.success) {
        return res.json({ success: false, message: "error while getting attendance." })
      }
      res.status(200).json({
        success: true,
        count: response.data[0].count
      });
    })
  } catch (error) {
    console.error('Error fetching today\'s attendance count:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching today\'s attendance count'
    });
  }
}

const manageHolidaySummary = async (req, res) => {
  try {
    const {
      adminId,
      userId,
      month,
      year,
      publicHolidays,
      privateOffDays,
      leaveDate,
      extraDuties,
    } = req.body;

    const weeklyOffs = await utilityService.calculateWeekendDays(
      parseInt(month),
      parseInt(year)
    );

    const checkQuery = `
      SELECT * FROM holidaySummaries
      WHERE adminId = ${adminId} AND userId = ${userId} AND month = ${month} AND year = ${year}
    `;

    sqlService.query(checkQuery, (response) => {
      if (!response.success) {
        return res.status(500).json({
          success: false,
          message: "Error checking existing holiday summary",
        });
      }

      const record = response.data?.[0];

      if (record) {
        const updatedPrivate = record.privateOffDays + Number(privateOffDays);
        const updatedPublic = record.publicHolidays + Number(publicHolidays);

        const updateObj = {
          publicHolidays: updatedPublic,
          privateOffDays: updatedPrivate,
          weeklyOffs,
          extraDuties,
        };

        sqlService.update(
          sqlService.HolidaySummaries,
          updateObj,
          { id: record.id },
          async (updateRes) => {
            if (!updateRes.success) {
              return res.status(500).json({
                success: false,
                message: "Error updating holiday summary",
              });
            }

            if (publicHolidays && publicHolidays > 0) {
              const logRes = await utilityService.logLeaveDates(
                adminId,
                userId,
                leaveDate,
                "Public"
              );

              if (!logRes.success) {
                return res.status(500).json({
                  success: false,
                  message: "Failed to log public holidays while updating.",
                });
              }
            }

            if (privateOffDays && privateOffDays > 0) {
              console.log("in the pvt");

              const logRes = await utilityService.logLeaveDates(
                adminId,
                userId,
                leaveDate,
                "Private"
              );
              if (!logRes.success) {
                return res.status(500).json({
                  success: false,
                  message: "Failed to log public holidays while updating.",
                });
              }
            }

            return res.status(200).json({
              success: true,
              message: "Holiday summary updated successfully",
            });
          }
        );
      } else {
        const insertObj = {
          adminId,
          userId,
          month,
          year,
          publicHolidays,
          privateOffDays,
          weeklyOffs,
          extraDuties,
        };

        sqlService.insert(
          sqlService.HolidaySummaries,
          insertObj,
          async (insertRes) => {

            if (!insertRes.success) {
              return res.status(500).json({
                success: false,
                message: "Error inserting holiday summary",
              });
            }

            if (publicHolidays && publicHolidays > 0) {
              const logRes = await utilityService.logLeaveDates(
                adminId,
                userId,
                leaveDate,
                "Public"
              );
              if (!logRes.success) {
                return res.status(500).json({
                  success: false,
                  message: "Failed to log public holidays while inserting!",
                });
              }
            }

            if (privateOffDays && privateOffDays > 0) {
              const logRes = await utilityService.logLeaveDates(
                adminId,
                userId,
                leaveDate,
                "Private"
              );
              if (!logRes.success) {
                return res.status(500).json({
                  success: false,
                  message: "Failed to log public holidays while inserting!",
                });
              }
            }

            return res.status(200).json({
              success: true,
              message: "Holiday summary created successfully",
            });
          }
        );
      }
    });
  } catch (err) {
    console.error("err...", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server.",
    });
  }
};

const fetchDevices = async (req, res) => {
  const { adminId } = req.params;

  const query = `SELECT * FROM devices WHERE userId=${adminId}`;

  sqlService.query(query, (response) => {

    if (!response.success) {
      return res.status(500).json({ success: false, message: 'Server Error!' })
    }

    res.status(200).json({ success: true, data: response.data })
  })
}

const fetchTrackUsers = async (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      t.*, 
      u.name, 
      u.phoneNumber, 
      u.email, 
      u.userType 
    FROM trackProgresses t
    INNER JOIN users u ON t.userId = u.id
    WHERE t.userId = ${userId};
  `;

  sqlService.query(query, (response) => {

    if (!response.success) {
      return res.status(200).json({ success: false, message: 'Internal server Error!' });
    }

    res.status(200).json({ success: true, data: response.data });
  });
}

const getAttendancesOfUser = async (req, res) => {
  const { userId, adminId } = req.params;

  if (!userId || !adminId) {
    return res.status(400).json({ success: false, message: 'userId and adminId are required' });
  }

  const query = `
    SELECT * FROM attendances 
    WHERE userId = ${userId} AND adminId = ${adminId}
    ORDER BY createdAt DESC
  `;

  sqlService.query(query, (response) => {
    if (!response.success) {
      return res.status(500).json({ success: false, message: 'Failed to fetch attendances' });
    }

    return res.json({ success: true, data: response.data });
  });
};

const getIndividualAttendance = async (req, res) => {
  const { adminId, userId } = req.params;
  const { fromDate, toDate } = req.query;

  if (!userId || !adminId) {
    return res.status(400).json({ success: false, message: 'userId and adminId are required' });
  }

  let query = `
    SELECT * FROM attendances 
    WHERE userId = ${userId} AND adminId = ${adminId}
  `;

  if (fromDate && toDate) {
    query += ` AND DATE(time) BETWEEN "${fromDate}" AND "${toDate}"`;
  }

  query += ` ORDER BY createdAt DESC`;

  sqlService.query(query, (response) => {
    if (!response.success) {
      return res.status(500).json({ success: false, message: 'Failed to fetch attendances' });
    }

    return res.json({ success: true, data: response.data });
  });
};


const getTodaysCollection = async (req, res) => {
  const { adminId } = req.params;

  if (!adminId) {
    return res.status(400).json({ success: false, message: 'adminId is required' });
  }

  const query = `
    SELECT SUM(mph.amountPaid) AS totalAmountPaid
    FROM membershipPurchases AS mph
    JOIN membershipPlans AS mp ON mph.membershipPlansId = mp.id
    WHERE mp.userId = ${adminId}
    AND DATE(mph.purchaseDate) = CURDATE()
  `;

  sqlService.query(query, (response) => {

    if (!response.success) {
      return res.status(500).json({ success: false, message: 'Failed to fetch today\'s collection' });
    }

    const total = response.data[0]?.totalAmountPaid || 0;

    res.status(200).json({
      success: true,
      totalAmountPaid: total
    });
  });
};

const createDietPlan = async (req, res) => {
  try {
    const {
      adminId,
      userId,
      trainerId,
      mealType,
      time,
      foodName,
      quantity,
      notes
    } = req.body;

    if (!adminId || !userId || !trainerId || !mealType || !time || !foodName || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const createObj = {
      adminId,
      userId,
      trainerId,
      mealType,
      time,
      foodName,
      quantity,
      notes,
      status: 'active'
    };

    sqlService.insert(sqlService.UserDietPlans, createObj, (insertRes) => {

      console.log("insertRes..", insertRes);

      if (!insertRes.success) {
        return res.status(500).json({
          success: false,
          message: "Failed to create diet plan.",
        });
      }

      res.status(201).json({
        success: true,
        message: "Diet plan created successfully.",
        data: insertRes.data,
      });
    });

  } catch (error) {
    console.error("Error in createDietPlan:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the diet plan.",
    });
  }
};



const getDietPlansByTrainer = (req, res) => {
  const { trainerId } = req.params;
  const { startDate, endDate, searchBy } = req.query;

  if (!trainerId) {
    return res.status(400).json({
      success: false,
      message: "trainerId is required",
    });
  }

  let whereConditions = `WHERE udp.trainerId = ${trainerId}`;

  // Date filter
  if (startDate && endDate) {
    whereConditions += ` AND DATE(udp.startDate) >= '${startDate}' AND DATE(udp.endDate) <= '${endDate}'`;
  }

  // Search filter
  if (searchBy) {
    whereConditions += ` AND u.name LIKE '%${searchBy}%'`;
  }

  const query = `
    SELECT udp.*, u.name AS name, u.phoneNumber, u.email, u.employeeNo
    FROM userDietPlans AS udp
    JOIN users AS u ON udp.userId = u.id
    ${whereConditions}
    ORDER BY udp.mealType, udp.time
  `;

  sqlService.query(query, (response) => {
    if (!response.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch diet plans",
      });
    }

    res.status(200).json({
      success: true,
      data: response.data,
    });
  });
};

const registerAdminBySuperAdmin = async (req, res, next) => {
  const {
    name,
    email,
    phoneNumber,
    gymName,
    password
  } = req.body;

  try {
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !password ||
      !gymName
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUserQuery = `SELECT * FROM users WHERE email="${email}"`;
    sqlService.query(checkUserQuery, async (response) => {

      if (response.data.length > 0) {
        return res.send({
          success: false,
          message: "User is already registered!",
        });
      }

      const newUser = {
        name,
        email,
        phoneNumber,
        gymName,
        userType: 'Admin',
        password: hashedPassword,
        status: "active",
      };

      sqlService.insert(sqlService.Users, newUser, (insertResponse) => {
        if (!insertResponse.success) {
          return res.status(500).json({
            success: false,
            message: "Failed to register user",
          });
        }

        return res.status(201).json({
          success: true,
          message: "User registered and activated successfully!",
        });
      });
    });
  } catch (err) {
    next(err);
  }
};

const getActiveAdmins = async (req, res, next) => {
  try {
    const { fromDate, toDate, searchBy } = req.query;

    let conditions = [`userType = "Admin"`, `status = "active"`];

    if (fromDate && toDate) {
      conditions.push(`DATE(createdAt) BETWEEN "${fromDate}" AND "${toDate}"`);
    }

    if (searchBy) {
      conditions.push(`(
        email LIKE "%${searchBy}%" OR 
        phoneNumber LIKE "%${searchBy}%"
      )`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const sqlQuery = `SELECT * FROM users ${whereClause} ORDER BY createdAt DESC`;

    sqlService.query(sqlQuery, (response) => {
      if (response.error) {
        return res.status(500).json({
          success: false,
          message: "An error occurred while retrieving active admins.",
        });
      }

      const data = response.data || [];

      if (data.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No active admins found.",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        data,
        error: null,
      });
    });
  } catch (error) {
    next(error);
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: "Please upload a PDF file!" });
    }
    res.status(200).json({
      error: false,
      message: "File uploaded successfully!",
      fileName: req.file.filename,
      filePath: req.file.path,
    });
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};




// Reception view
const requestSubscriptionAssignment = async (req, res) => {
  try {
    const {
      userId,
      requestedBy,
      adminId,
      membershipPlansId,
      selectedDuration,
      amountPaid,
      monthQty,
      planType,
      email,
      phoneNo,
      name,
      admissionFee,
    } = req.body;

    console.log("req.body.", req.body);


    if (planType === "subs-plan") {
      if (!userId || !requestedBy || !adminId || !membershipPlansId || !amountPaid || !monthQty || !selectedDuration || !name || !email || !planType || !phoneNo) {
        return res.status(400).json({ message: "All fields are required" });
      }
    }

    if (planType === "visitor-plan") {
      if (!userId || !membershipPlansId || !requestedBy || !adminId || !name || !email || !planType || !phoneNo) {
        return res.status(400).json({ message: "All fields are required" });
      }
    }

    let requestObj = {
      userId,
      requestedBy,
      adminId,
      membershipPlansId,
      selectedDuration,
      amountPaid,
      monthQty,
      planType,
      email,
      phoneNo,
      name,
      admissionFee,
      status: 'pending', // default value
      paymentStatus: 'true'
    };

    // Insert into subscriptionAssignmentRequests table
    sqlService.insert(sqlService.SubscriptionAssignmentRequests, requestObj, function (response) {
      if (response.success) {
        res.status(201).json({
          success: true,
          message: 'Subscription assignment request submitted successfully',
          data: response.data,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create request',
          error: response.error,
        });
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

const listPendingSubscriptionRequests = async (req, res) => {
  try {
    const { adminId } = req.params;

    let query = `SELECT * FROM subscriptionAssignmentRequests WHERE adminId=${adminId} AND status='pending'`
    sqlService.query(query, (response) => {

      if (response.success) {
        return res.status(200).json({ success: true, data: response });
      } else {
        res.status(500).json({
          success: false,
          message: 'No request!',
        });
      }
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching requests', error: error.message });
  }
};

const approvePendingSubscriptionRequests = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({ success: false, message: 'Request ID is required' });
    }

    let query = `SELECT * FROM subscriptionAssignmentRequests WHERE id=${requestId} LIMIT 1`;
    sqlService.query(query, async (response) => {

      if (response.success) {

        const request = response.data[0];

        if (request.status !== 'pending') {
          return res.status(400).json({ success: false, message: 'Request already processed' });
        }

        // Destructure necessary data
        const {
          planType,
          userId,
          membershipPlansId,
          amountPaid,
          selectedDuration,
          monthQty,
          name,
          phoneNo,
          email,
          adminId,
          admissionFee
        } = request;

        // Construct payload
        const payload = {
          planType,
          userId,
          membershipPlansId,
          amountPaid,
          paymentStatus: true,
          selectedDuration,
          monthQty,
          visitorAmountPaid: null, // if not applicable
          daysQty: null,            // if not applicable
          name,
          phoneNo,
          email,
          adminId,
          admissionFee
        };

        // Call /buy-membership-plan internally
        try {
          const buyPlanRes = await axios.post('http://localhost:8000/api/fitnest/buy-membership-plan', payload); // replace PORT

          if (buyPlanRes.data.success) {
            // Update subscriptionAssignmentRequests status to approved
            sqlService.update(
              sqlService.SubscriptionAssignmentRequests,
              { status: 'approved' },
              { id: requestId },
              (updateRes) => {
                return res.status(200).json({
                  success: true,
                  message: 'Subscription approved and assigned successfully',
                });
              }
            );
          } else {
            return res.status(500).json({
              success: false,
              message: 'Failed to assign plan',
              error: buyPlanRes.data.message,
            });
          }
        } catch (err) {
          console.log("err..", err);

          return res.status(500).json({
            success: false,
            message: 'Internal call to buy-membership-plan failed',
            error: err.message,
          });
        }

      } else {
        return res.status(404).json({
          success: false,
          message: 'No subscription request found',
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error in approval process',
      error: error.message,
    });
  }
};




module.exports = {
  registerUser,
  verifyRegisteringUser,
  login,
  silentLogin,
  newscheduling,
  addDevice,
  getPendingAdmins,
  updateAdminStatus,
  getActiveTrainersByAdmin,
  getActiveCustomerById,
  entryGate,
  addname,
  getAllNames,
  getAllAdmin,
  getAllCustomers,
  addSubscriptionPlan,
  getAllTrainer,
  getAllSessions,
  getAllactiveDevice,
  updateTrainerStatus,
  getSchedules,
  getallsubscriptionplan,
  trainerSchedules,
  getAllTrainerSchedules,
  getPendingTrainer,
  registerUserByAdmin,
  getAdminGymName,
  getProfileDetails,
  trackProgress,
  getUserCounts,
  getStaffCount,
  createMembershipPlans,
  createVisitorPlans,
  buyMembershipPlan,
  getMembershipPlans,
  getVistiorPlans,
  viewPlansById,
  updateMembershipPlan,
  getActiveCustomers,
  getAllPlans,
  viewPurchasedPlanByUser,
  getSubscribedUsers,
  fetchAttendanceData,
  manageHolidaySummary,
  setMonthlySalary,
  calculateSalary,
  getSalaryHistories,
  getIndividualSalaryHistories,
  insertSalaryHistory,
  getMembershipPaymentHistory,
  getMembershipInstallmentPayments,
  getActiveStaffUsers,
  getDashboardCounts,
  getExpiringPlansOfUsers,
  updateUserPlanStatusIfExpired,
  fetchDevices,
  fetchTrackUsers,
  getAttendancesOfUser,
  getIndividualAttendance,
  registerUserOnDevices,
  fetchTodaysAttendance,
  getTodaysCollection,
  createDietPlan,
  getDietPlansByTrainer,
  registerAdminBySuperAdmin,
  getActiveAdmins,
  updateReceivedAmount,
  getDueAmount,
  registerAllUsers,
  dummyregisterUserByAdmin,
  requestSubscriptionAssignment,
  listPendingSubscriptionRequests,
  approvePendingSubscriptionRequests,
  uploadFile
}
