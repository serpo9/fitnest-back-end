const DigestClient = require("digest-fetch");
require("dotenv").config();
const utilityService = require("../services/utilityService");
const sqlService = require("../services/sqlService");
const devices = require("../config/device");
const express = require("express");
const { logger } = require("sequelize/lib/utils/logger");
const { error } = require("../services/loggerService");
const { Json } = require("sequelize/lib/utils");

const scheduleController = {
  getSchedules: async (req, res, next) => {
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
		sch.trainerId AS trainerId,
    sch.startingTime As startfrom,
    sch.endTime As endTime,
    sch.capacity AS  capacity,
    sch.filledCapacity AS  filledCapacity,
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
  },


  // searchSchedule: async (req, res, next) => {
  //   try {
  //     const { adminId } = req.params;
  //     const { searchTerm, fromDate, toDate, status } = req.query;
  //     console.log(req.query, "request query");
  //     let query = `
  // 	SELECT 
  // 	sch.id As class_id,
  // 	sch.className AS class_name,
  // 	sch.trainerId AS trainerId,
  //   sch.startingTime As startfrom,
  //   sch.endTime As endTime,
  //   sch.capacity AS  capacity,
  //   sch.filledCapacity AS  filledCapacity,
  //   u.name AS trainer_name  -- Getting trainer's name, will be null if no trainer is assigned
  //    FROM schedules sch
  //   LEFT JOIN users u ON sch.trainerId = u.id  -- Left join to include schedules without a trainer
  //   WHERE sch.adminId = ${adminId};
  //   `;


  //     if (searchTerm) {
  //       const trimmedSearchTerm = searchTerm.trim();
  //       query += ` AND (sch.className LIKE '%${trimmedSearchTerm}%')`;
  //     }

  //     // Add fromdate and todate to the query if provided
  //       if (fromDate && toDate) {
  //     	console.log(toDate,fromDate,"fromdate and todate")
  //         // query += ` AND  sch.startfrom BETWEEN '${fromDate}' AND '${toDate}'`;
  //         query += ` AND sch.createdAt BETWEEN '${fromDate}' AND '${toDate}'`;

  //       }
  //       console.log("query for the select the schedule",query);
  //     // Execute the query
  //     sqlService.query(query, (response) => {
  //       console.log("response", response);
  //       if (!response.success) {
  //         return res.status(500).json({
  //           success: false,
  //           message: "Database error occurred. Please try again later.",
  //         });
  //       }

  //       if (!response.data || response.data.length === 0) {
  //         return res.status(200).json({
  //           success: true,
  //           message: "No schedules found matching the criteria.",
  //           data: [],
  //         });
  //       }

  //       return res.status(200).json({
  //         success: true,
  //         message: "Schedules fetched successfully.",
  //         data: response.data,
  //       });
  //     });
  //   } catch (error) {
  //     console.log("Error in searchSchedule:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Internal server error.",
  //     });
  //   }
  // },

  // deleteSchedule: async (req, res) => {
  //   try {
  //     const { scheduleId } = req.params; // Get schedule ID from request params

  //     if (!scheduleId) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Schedule ID is required.",
  //       });
  //     }

  //     sqlService.delete(
  //       sqlService.Schedules,
  //       { id: scheduleId },
  //       (response) => {
  //         if (response.error) {
  //           return res.status(500).json({
  //             success: false,
  //             message: "Failed to delete schedule.",
  //             error: response.data,
  //           });
  //         }

  //         return res.status(200).json({
  //           success: true,
  //           message: "Schedule deleted successfully.",
  //         });
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error deleting schedule:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Internal server error.",
  //     });
  //   }
  // },


  searchSchedule: async (req, res, next) => {
    try {
      const adminId = Number(req.params.adminId);
      const { searchTerm, fromDate, toDate, status } = req.query;

      if (!adminId || isNaN(adminId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Admin ID.",
        });
      }

      // Start base query
      let query = `
        SELECT 
          sch.id AS class_id,
          sch.className AS class_name,
          sch.trainerId AS trainerId,
          sch.startingTime AS startfrom,
          sch.endTime AS endTime,
          sch.capacity AS capacity,
          sch.filledCapacity AS filledCapacity,
          u.name AS trainer_name
        FROM schedules sch
        LEFT JOIN users u ON sch.trainerId = u.id
        WHERE sch.adminId = ${adminId}
      `;

      // Add filters directly into query
      if (searchTerm) {
        const term = searchTerm.trim().replace(/'/g, "''"); // escape single quotes
        query += ` AND sch.className LIKE '%${term}%'`;
      }

      if (fromDate && toDate) {
        query += ` AND sch.createdAt BETWEEN '${fromDate}' AND '${toDate}'`;
      }

      if (status) {
        const safeStatus = status.replace(/'/g, "''");
        query += ` AND sch.status = '${safeStatus}'`;
      }

      // Run the query
      sqlService.query(query, (response) => {
        if (!response.success) {
          return res.status(500).json({
            success: false,
            message: "Database error occurred. Please try again later.",
          });
        }

        if (!response.data || response.data.length === 0) {
          return res.status(200).json({
            success: true,
            message: "No schedules found matching the criteria.",
            data: [],
          });
        }

        return res.status(200).json({
          success: true,
          message: "Schedules fetched successfully.",
          data: response.data,
        });
      });

    } catch (error) {
      console.error("Error in searchSchedule:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },



  deleteSchedule: async (req, res) => {
    try {
      const { scheduleId } = req.params;

      if (!scheduleId) {
        return res.status(400).json({
          success: false,
          message: "Schedule ID is required.",
        });
      }

      // Delete from ScheduleUsers
      await new Promise((resolve, reject) => {
        sqlService.delete(
          sqlService.ScheduleUser,
          { scheduleId: scheduleId },
          (response) => {
            if (response.error) {
              reject(response.data);
            } else {
              resolve(response.data);
            }
          }
        );
      });

      // Delete from ScheduleDays
      await new Promise((resolve, reject) => {
        sqlService.delete(
          sqlService.ScheduleDays,
          { scheduleId: scheduleId },
          (response) => {
            if (response.error) {
              reject(response.data);
            } else {
              resolve(response.data);
            }
          }
        );
      });

      // Delete from Schedules
      await new Promise((resolve, reject) => {
        sqlService.delete(
          sqlService.Schedules,
          { id: scheduleId },
          (response) => {
            if (response.error) {
              reject(response.data);
            } else {
              resolve(response.data);
            }
          }
        );
      });

      return res.status(200).json({
        success: true,
        message: "Schedule and related data deleted successfully.",
      });

    } catch (error) {
      console.error("Error deleting schedule:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete schedule and related data.",
        error: error,
      });
    }
  },


  editSchedule: async (req, res) => {
    try {
      const { scheduleId } = req.params; // Extract schedule ID from URL params
      const updateData = req.body; // Get updated schedule data from request body

      if (!scheduleId) {
        return res.status(400).json({
          success: false,
          message: "Schedule ID is required.",
        });
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No update data provided.",
        });
      }

      const obj = {
        className: updateData.className,
        startingTime: updateData.startfrom,
        capacity: updateData.capacity,
        endTime: updateData.endTime
      }

      // Call the SQL update function
      sqlService.update(
        sqlService.Schedules,
        obj,
        { id: scheduleId },
        (response) => {
          if (response.error) {
            return res.status(500).json({
              success: false,
              message: "Failed to update schedule.",
              error: response.data,
            });
          }

          return res.status(200).json({
            success: true,
            message: "Schedule updated successfully.",
          });
        }
      );
    } catch (error) {
      console.error("Error updating schedule:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },
  newscheduling: async (req, res, next) => {
    try {
      const {
        adminId,
        className,
        startTime,
        endTime,
        capacity,
        days
      } = req.body;

      let scheduleDays = JSON.parse(days);
      // Validation
      if (!adminId || !className || !startTime) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be filled, including days.",
        });
      }

      const scheduleObj = {
        adminId: adminId,
        className: className,
        startingTime: startTime,
        endTime: endTime,
        capacity: capacity,
      };

      // Step 1: Insert into main schedule table
      sqlService.insert(sqlService.Schedules, scheduleObj, (scheduleRes) => {
        if (scheduleRes.error) {
          return res.status(400).json({
            success: false,
            message: "Error inserting schedule.",
          });
        }

        const scheduleId = scheduleRes.data.dataValues.id;

        // Step 2: Insert selected days (assuming another table `ScheduleDays`)
        const dayRecords = scheduleDays.map(day => ({
          scheduleId,
          day
        }));

        sqlService.bulkInsert(sqlService.ScheduleDays, dayRecords, (dayRes) => {
          if (!dayRes.success) {
            return res.status(400).json({
              success: false,
              message: "Class created but failed to assign days.",
            });
          }
          return res.status(200).json({
            success: true,
            message: "Class scheduled successfully.",
            data: { scheduleId, days },
          });
        });
      });
    } catch (error) {
      next(error);
    }
  },

  getSchedulesByDays: async (req, res, next) => {
    // const {scheduleId}=req.params;
    try {
      const { weekdays, adminId } = req.body;
      let days = JSON.parse(weekdays);
      if (typeof days === 'string') {
        try {
          days = JSON.parse(days);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: 'Invalid days array format.',
          });
        }
      }
      if (!Array.isArray(days) || days.length === 0 || !adminId) {
        return res.status(400).json({
          success: false,
          message: "days (array), adminId, and scheduleId are required.",
        });
      }

      const dayPlaceholders = days.map(day => `'${day}'`).join(','); // 'Sunday','Monday','Tuesday'

      const query = `
        SELECT 
          sch.id AS scheduleId,
          sch.className,
          sch.startingTime,
          sch.endTime,
          sch.capacity,
          sch.adminId,
          sd.day
        FROM schedules sch
        JOIN scheduledays sd ON sch.id = sd.scheduleId
        WHERE sd.day IN (${dayPlaceholders})
        AND sch.adminId = ${adminId}
      `;

      const result = sqlService.query(query, async (response) => {
        if (response.success) {
          return res.status(200).json({
            success: true,
            data: response.data,
          });
        } else {
          return res.status(200).json({
            success: false,
            message: response.err,
          });
        }
      }); // No params needed
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  getTrainerSchduleByDays: async (req, res, next) => {
    // const {scheduleId}=req.params;
    try {
      const { weekdays, trainerId } = req.body;
      let days = JSON.parse(weekdays);
      if (typeof days === 'string') {
        try {
          days = JSON.parse(days);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: 'Invalid days array format.',
          });
        }
      }
      if (!Array.isArray(days) || days.length === 0) {
        return res.status(400).json({
          success: false,
          message: "days (array), adminId, and scheduleId are required.",
        });
      }

      const dayPlaceholders = days.map(day => `'${day}'`).join(','); // 'Sunday','Monday','Tuesday'

      // const query = `
      //   SELECT 
      //     sch.id AS scheduleId,
      //     sch.className,
      //     sch.startingTime,
      //     sch.endTime,
      //     sch.capacity,
      //     sch.adminId,
      //     sd.day
      //   FROM schedules sch
      //   JOIN scheduledays sd ON sch.id = sd.scheduleId
      //   WHERE        
      //   AND sch.trainerId = ${trainerId}
      //   AND sd.day IN (${dayPlaceholders})
      // `;

      const query = `
      SELECT 
        sch.id AS scheduleId,
        sch.className,
        sch.startingTime,
        sch.endTime,
        sch.capacity,
        sch.adminId,
        sd.day
      FROM schedules sch
      JOIN scheduledays sd ON sch.id = sd.scheduleId
      WHERE sd.day IN (${dayPlaceholders})
      AND sch.trainerId = ${trainerId}
    `;

      const result = sqlService.query(query, async (response) => {
        console.log(response, "response")
        if (response.success) {
          return res.status(200).json({
            success: true,
            data: response.data,
          });
        } else {
          return res.status(200).json({
            success: false,
            message: response.err,
          });
        }
      }); // No params needed
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }

  },

  assignUserToSchedule: async (req, res, next) => {
    const { scheduleId } = req.params;
    const { userId } = req.body;

    if (!scheduleId || !userId) {
      return res.send({
        success: false,
        message: "Provide schedule ID and user ID",
      });
    }

    try {
      // Step 1: Get schedule info (wrap in a Promise)
      const scheduleData = await new Promise((resolve, reject) => {
        const scheduleQuery = `SELECT capacity, filledCapacity FROM schedules WHERE id = ${scheduleId}`;
        sqlService.query(scheduleQuery, (response) => {
          if (!response.success || response.data.length === 0) {
            return reject(new Error("Schedule not found"));
          }
          resolve(response.data[0]); // Only return the first row
        });
      });
      const capacity = scheduleData.capacity;
      const filledCapacity = scheduleData.filledCapacity;

      if (filledCapacity >= capacity) {
        return res.send({
          success: false,
          message: "Class is already full. Cannot assign more users.",
        });
      }

      // Step 3: Check if user is already assigned to this class
      const isAlreadyAssigned = await new Promise((resolve, reject) => {
        const checkQuery = `SELECT * FROM scheduleUsers WHERE scheduleId = ${scheduleId} AND userId = ${userId}`;
        sqlService.query(checkQuery, (response) => {
          if (!response.success) return reject(new Error("Failed to check existing assignment"));
          resolve(response.data.length > 0);
        });
      });

      if (isAlreadyAssigned) {
        return res.send({
          success: false,
          message: "User is already assigned to this class.",
        });
      }

      //assign users 
      let obj = {
        scheduleId: scheduleId,
        userId: userId
      }
      await new Promise((resolve, reject) => {
        sqlService.insert(sqlService.ScheduleUser, obj, (response) => {
          if (!response.success) return reject(new Error("Failed to assign user"));
          resolve();
        });
      });



      // Step 3: Update filled count
      await new Promise((resolve, reject) => {
        sqlService.update(
          sqlService.Schedules, // assuming `db.schedules` is your Sequelize model
          { filledCapacity: filledCapacity + 1 },
          { id: scheduleId },
          (response) => {
            if (!response.success) return reject(new Error("Failed to update filled capacity"));
            resolve();
          }
        );
      });
      return res.send({
        success: true,
        message: "User assigned to schedule successfully",
      });


    } catch (error) {
      console.error("Error assigning user to schedule:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  getUserClasses: async (req, res, next) => {
    const { userId } = req.params;

    if (!userId) {
      return res.send({
        success: false,
        message: "User ID is required",
      });
    }

    try {
      const query = `
        SELECT s.* FROM schedules s
        INNER JOIN scheduleUsers su ON s.id = su.scheduleId
        WHERE su.userId = ${userId}
      `;

      const classData = await new Promise((resolve, reject) => {
        sqlService.query(query, (response) => {
          if (!response.success) {
            return reject(new Error("Failed to fetch user classes"));
          }
          resolve(response.data);
        });
      });

      return res.send({
        success: true,
        message: "User's classes fetched successfully",
        data: classData,
      });

    } catch (error) {
      console.error("Error fetching user's classes:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
  getTrainerSchedules: async (req, res, next) => {
    try {
      const { adminId } = req.params;
      const { trainerId } = req.query;

      // Validate parameters
      if (!trainerId) {
        return res.status(400).json({
          success: false,
          message: "Invalid  Trainer ID.",
        });
      }

      // SQL query to fetch trainer's classes
      // const sqlQuery = `
      //   SELECT 
      //     sch.id AS class_id,
      //     sch.className AS class_name,
      //     sch.trainerId AS trainer_id,
      //     sch.startingTime AS start_time,
      //     sch.endTime AS end_time,
      //     sch.capacity,
      //     sch.filledCapacity
      //   FROM schedules sch
      //   WHERE sch.adminId = ${adminId} AND sch.trainerId = ${trainerId};
      // `;


      const sqlQuery = `
      SELECT 
        sch.id AS class_id,
        sch.className AS class_name,
         sch.className AS class_name,
        sch.trainerId AS trainer_id,
        sch.startingTime AS start_time,
        sch.endTime AS end_time,
        sch.capacity,
        sch.filledCapacity
      FROM schedules sch
      WHERE sch.trainerId = ${trainerId};
    `;

      // Execute query
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
            message: "No classes found for this trainer in the specified gym.",
            data: [],
          });
        }

        return res.status(200).json({
          success: true,
          message: "Trainer's classes retrieved successfully.",
          data: response.data,
        });
      });
    } catch (error) {
      console.error("Error fetching trainer's classes:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  requestSubscription: async (req, res, next) => {
    try {
      const { userId, membershipPlansId, adminId } = req.body;

      if (!userId || !membershipPlansId || !adminId) {
        return res.status(400).json({
          success: false,
          message: "All fields are required!",
        });
      }

      // 1. Check if user exists
      const user = await sqlService.Users.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // 2. Check if membership plan exists
      const plan = await sqlService.MembershipPlans.findOne({ where: { id: membershipPlansId } });
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Membership plan not found.",
        });
      }

      // 3. Check if a request already exists
      const existingRequest = await sqlService.SubscriptionRequest.findOne({
        where: { userId, membershipPlansId, adminId },
      });

      if (existingRequest) {
        return res.status(201).json({
          success: true,
          message: "You have already requested this membership plan.",
        });
      }

      // 4. Insert request
      const createObj = { userId, membershipPlansId, adminId };

      sqlService.insert(sqlService.SubscriptionRequest, createObj, (response) => {
        if (!response.success) {
          return res.status(500).json({
            success: false,
            message: "Failed to save subscription request.",
            error: response.data,
          });
        }

        return res.status(201).json({
          success: true,
          message: "Subscription request submitted successfully.",
          data: response.data,
        });
      });
    } catch (error) {
      next(error);
    }
  },

  getSubscriptionRequests: async (req, res, next) => {
    const { adminId } = req.params;

    try {
      const query = `
      SELECT 
        sr.id AS requestId,
        u.id AS userId,
        u.name AS username,
        u.email,
        u.phoneNumber,
        mp.id AS membershipPlansId,
        mp.planName
      FROM subscriptionRequests sr
      JOIN users u ON sr.userId = u.id
      JOIN membershipPlans mp ON sr.membershipPlansId = mp.id
      WHERE sr.adminId = ${adminId} AND sr.status='pending'
      ORDER BY sr.createdAt DESC
    `;

      sqlService.query(query, (response) => {
        if (!response.success) {
          return res.status(500).json({
            success: false,
            message: "Failed to fetch subscription requests.",
            error: response.data,
          });
        }

        if (response.data.length === 0) {
          return res.status(200).json({
            success: true,
            message: "No subscription requests found.",
            data: [],
          });
        }

        return res.status(200).json({
          success: true,
          message: "Subscription requests fetched successfully.",
          data: response.data,
        });
      });
    } catch (error) {
      next(error);
    }
  }

  // getSubscriptionRequests: async (req, res, next) => {
  //   try {
  //     const query = `
  //       SELECT 
  //         sr.id AS requestId,
  //         u.id AS userId,
  //         u.name AS username,
  //         u.email,
  //         u.phoneNumber,
  //         mp.id AS membershipPlansId,
  //         mp.planName
  //       FROM subscriptionRequests sr
  //       JOIN users u ON sr.userId = u.id
  //       JOIN membershipPlans mp ON sr.membershipPlansId = mp.id
  //       WHERE NOT EXISTS (
  //         SELECT 1 FROM membershipPurchases mpur 
  //         WHERE mpur.userId = sr.userId 
  //           AND mpur.membershipPlansId = sr.membershipPlansId
  //       )
  //       ORDER BY sr.createdAt DESC
  //     `;

  //     sqlService.query(query, (response) => {
  //       if (!response.success) {
  //         return res.status(500).json({
  //           success: false,
  //           message: "Failed to fetch subscription requests.",
  //           error: response.data,
  //         });
  //       }

  //       return res.status(200).json({
  //         success: true,
  //         message: "Subscription requests fetched successfully.",
  //         data: response.data,
  //       });
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
















};

module.exports = scheduleController;
