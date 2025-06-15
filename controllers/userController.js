const DigestClient = require("digest-fetch");
require("dotenv").config();
const utilityService = require("../services/utilityService");
const sqlService = require("../services/sqlService");
const devices = require("../config/device");
const express = require("express");
const bcrypt = require("bcryptjs");
const { logger } = require("sequelize/lib/utils/logger");
const { error } = require("../services/loggerService");
const gymController = require("../controllers/gymController");

const userController = {
	searchUsers: async (req, res, next) => {
		try {
			const { adminId } = req.params; // Get adminId from request parameters
			const { searchTerm } = req.query;

			// Validate adminId
			if (!adminId) {
				return res.send({
					error: true,
					message: "Provide admin ID",
				});
			}

			// Validate searchTerm
			if (!searchTerm) {
				const query = `SELECT * FROM users WHERE createdByAdmin = ${adminId}`;
			}

			query = `SELECT * FROM users WHERE (name LIKE '%${searchTerm}%' OR phoneNumber LIKE '%${searchTerm}%') AND createdByAdmin = ${adminId}`;
			sqlService.query(query, (response) => {
				if (!response.success) {
					return res.send({
						success: false,
						message: response.data,
					});
				}
				if (response.data.length == 0) {
					return res.send({
						success: true,
						message: "No users found",
						data: response.data,
					});
				} else {
					return res.send({
						success: true,
						message: "Customers retrieved successfully.",
						data: response.data,
					});
				}
			});
		} catch (error) {
			return res.send({
				error: true,
				message: "Internal Server Error",
			});
		}
	},

	getAllCustomers: async (req, res, next) => {
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
			let query = `SELECT * FROM users WHERE userType NOT IN ('Admin', 'SuperAdmin') AND createdByAdmin = ${adminId}`;

			// Apply date filtering if fromDate and toDate are provided
			// if (
			// 	fromDate &&
			// 	toDate &&
			// 	fromDate !== "null" &&
			// 	toDate !== "null" &&
			// 	fromDate !== undefined &&
			// 	toDate !== undefined
			// ) {
			// 	fromDate = fromDate.trim();
			// 	toDate = toDate.trim();
			// 	query += ` AND createdAt BETWEEN '${fromDate}' AND '${toDate}'`;
			// }
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
	},

	searchUsersByUserType: async (req, res, next) => {
		try {
			const { adminId } = req.params;
			const { userType, fromDate, toDate } = req.query;

			let query = `SELECT * FROM users WHERE userType NOT IN ('Admin', 'SuperAdmin') AND createdByAdmin = ${adminId}`;

			if (userType) {
				query = `SELECT * FROM users WHERE userType= '${userType}' AND createdByAdmin = ${adminId}`;
				if (userType == 'allStaff') {
					query = `SELECT * FROM users WHERE userType NOT IN ('Admin', 'SuperAdmin','Customer','Trainer') AND createdByAdmin = ${adminId}`;
				}
			}
			if (fromDate && toDate && fromDate !== "null" && toDate !== "null") {
				query += ` AND createdAt BETWEEN '${fromDate}' AND '${toDate}'`;
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
						message: "No customers found",
					});
				}

				return res.status(200).json({
					success: true,
					message: "Customers retrieved successfully.",
					data: response.data,
				});
			});
		} catch (error) { }
	},

	searchTrainerByStatus: async (req, res, next) => {
		try {
			const { adminId } = req.params;
			const { fromDate, toDate, status, searchTerm } = req.query;
			console.log("searchTerm..", searchTerm);
			
			if (!adminId) {
				return res.status(400).json({
					success: false,
					message: "Admin ID is required.",
				});
			}

			let query = `SELECT * FROM users WHERE userType = 'Trainer' AND createdByAdmin = ${adminId}`;

			// Add status condition only if status is provided

			if (status) {
				const trimmedstatus = status.trim(); // Trim spaces
				query += ` AND status='${trimmedstatus}'`;
			}

			// Add search condition
			if (searchTerm) {
				// query += ` AND (name LIKE %'${searchTerm}'% OR phoneNumber LIKE %'${searchTerm}'%)`;

				// query += ` AND (name=${searchTerm} OR phoneNumber=${searchTerm})`;
				const trimmedSearchTerm = searchTerm.trim(); // Trim spaces

				
				// query += ` AND (name='${trimmedSearchTerm}' OR phoneNumber='${trimmedSearchTerm}')`;

				query += ` AND (name LIKE '%${trimmedSearchTerm}%' OR phoneNumber LIKE '%${trimmedSearchTerm}%')`;
			}

			// Add date filter condition
			if (fromDate && toDate && fromDate !== "null" && toDate !== "null") {
				query += ` AND createdAt BETWEEN '${fromDate}' AND '${toDate}'`;
			}
			console.log("query...", query);
			
			sqlService.query(query, (response) => {
				console.log("response..", response);

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
						message: "No Trainer found",
					});
				}

				return res.status(200).json({
					success: true,
					message: "Trainer retrieved successfully.",
					data: response.data,
				});
			});
		} catch (error) { }
	},

	approveOrDeactivateTrainer: async (req, res, next) => {
		try {
			const { trainerId, status } = req.body; // Receiving status dynamically

			if (!trainerId || !status) {
				return res.status(400).json({
					success: false,
					message: "Trainer ID and status are required.",
				});
			}

			// Validate status input
			if (!["active", "inactive"].includes(status.toLowerCase())) {
				return res.status(400).json({
					success: false,
					message: "Invalid status. Allowed values: 'active' or 'inactive'.",
				});
			}

			// Query to check if the trainer exists
			let checkQuery = `SELECT * FROM users WHERE id = ${trainerId} AND userType = 'Trainer'`;

			sqlService.query(checkQuery, (checkResponse) => {
				if (checkResponse.error) {
					return res.status(500).json({
						success: false,
						message: "Database error occurred.",
						error: checkResponse.error,
					});
				}

				if (checkResponse.data.length === 0) {
					return res.status(404).json({
						success: false,
						message: "Trainer not found.",
					});
				}

				// Update query to change the trainer's status
				let updateQuery = `UPDATE users SET status = '${status}' WHERE id = ${trainerId}`;

				sqlService.query(updateQuery, (updateResponse) => {
					if (updateResponse.error) {
						return res.status(500).json({
							success: false,
							message: "Database error occurred while updating status.",
							error: updateResponse.error,
						});
					}

					return res.status(200).json({
						success: true,
						message: `Trainer status updated to '${status}' successfully.`,
						status: status, // Returning the updated status
					});
				});
			});
		} catch (error) {
			console.error("Error:", error);
			res.status(500).json({
				success: false,
				message: "Internal server error.",
				error: error.message,
			});
		}
	},
	completeProfile: async (req, res) => {
		const {
			userId,
			bloodGroup,
			height,
			weight,
			fitnessGoals,
			gender,
			dateOfBirth,
		} = req.body;

		if (
			!userId ||
			!bloodGroup ||
			!height ||
			!weight ||
			!fitnessGoals ||
			!gender ||
			!dateOfBirth
		) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const obj = {
			userId: userId,
			bloodGroup: bloodGroup,
			height: height,
			weight: weight,
			fitnessGoals: fitnessGoals,
			dob: dateOfBirth,
			gender: gender,
		};

		sqlService.insert(sqlService.UserProfiles, obj, (response) => {
			if (!response.success) {
				return res
					.status(500)
					.json({ success: false, message: "Internal server error" });
			}

			if (response.success) {
				res
					.status(200)
					.json({ success: true, message: "Completed profile successfully!" });
			}
		});
	},

	updateUserPersonalData: async (req, res) => {
		const { userId, name, phone } = req.body;

		try {
			if (!name || !phone || !userId) {
				return res.status(400).json({ message: "All fields are required" });
			}

			const obj = {
				name: name,
				phoneNumber: phone,
			};

			sqlService.update(sqlService.Users, obj, { id: userId }, (response) => {
				if (!response.success) {
					return res
						.status(500)
						.json({ success: false, message: "Internal server error" });
				}

				return res
					.status(200)
					.json({ success: true, message: "Updated succesfully!" });
			});
		} catch (error) {
			console.log("err...", error);
			return res
				.status(500)
				.json({ success: false, message: "Internal server error" });
		}
	},

	updateMoreProfileInfo: async (req, res) => {
		const { userId, height, weight, fitnessGoals } = req.body;

		if (!userId || !height || !weight || !fitnessGoals) {
			return res.status(400).json({ message: "All fields are required" });
		}

		try {
			const obj = {
				userId: userId,
				height: height,
				weight: weight,
				fitnessGoals: fitnessGoals,
			};

			sqlService.update(
				sqlService.UserProfiles,
				obj,
				{ userId: userId },
				(response) => {

					if (!response.success) {
						return res
							.status(500)
							.json({ success: false, message: "Internal server error" });
					}

					return res
						.status(200)
						.json({ success: true, message: "Updated succesfully!" });
				}
			);
		} catch (error) {
			console.log("error...", error);
			return res
				.status(500)
				.json({ success: false, message: "Internal server error" });
		}
	},

	assignTrainer: async (req, res, next) => {
		const { scheduleId } = req.params;
		const { trainerId } = req.body;
		if (!scheduleId || !trainerId) {
			return res.send({
				success: false,
				message: "Provide class and trainer ID",
			});
		}

		try {
			// Step 1: Update the trainerId in the schedules table
			const obj = {
				trainerId: trainerId,
			};

			// Update schedule
			sqlService.update(
				sqlService.Schedules,
				obj,
				{ id: scheduleId },
				async (updateResponse) => {
					if (!updateResponse.success) {
						return res.status(500).json({
							success: false,
							message: "Internal server error",
						});
					}

					// Step 2: Fetch the trainer's name using the trainerId
					const sqlQuery = `
			SELECT u.name AS trainer_name
			FROM users u
			WHERE u.id = ${trainerId};
		  `;

					try {
						await sqlService.query(sqlQuery, (response) => {
							if (response.success && response.data.length > 0) {
								const trainerName = response.data[0].trainer_name;
								return res.status(200).json({
									success: true,
									message: "Updated successfully!",
									trainerName: trainerName, // Send the trainer's name in response
								});
							} else {
								return res.status(404).json({
									success: false,
									message: "Trainer not found",
								});
							}
						});
					} catch (error) {
						console.log("Error fetching trainer:", error);
						return res.status(500).json({
							success: false,
							message: "Error fetching trainer's details",
						});
					}
				}
			);
		} catch (error) {
			console.log("Error in assigning trainer:", error);
			return res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	},

	assignSalaryToTrainer: async (req, res, next) => {
		const { userId, adminId, salaryAmount, month, year } = req.body;
		if (!userId || !adminId || !salaryAmount || !month || !year) {
			return res.status(400).json({ error: 'All fields are required' });
		}
	},

	findUsersForNotification: async (req, res, next) => {
		try {
			const { adminId } = req.params;
			const { type } = req.query;
			if (!adminId) {
				return res.status(400).json({
					success: false,
					message: "Admin ID is required.",
				});
			}
			// Start building the base query
			let query;
			// Filter based on the user type
			if (type === "all") {
				query = `SELECT * FROM users WHERE userType ='Customer' AND createdByAdmin = ${adminId} `;
			} else if (type == "subscribed") {
				query = `
         SELECT u.*, 
          mp.planName, 
          mp.monthlyPrice, 
          mp.quarterlyPrice, 
          mp.yearlyPrice, 
          mp.status AS planStatus,
          mpu.paymentStatus
   FROM users u
   LEFT JOIN membershipPurchases mpu ON u.id = mpu.userId AND mpu.expiryDate > NOW()
   LEFT JOIN membershipPlans mp ON mpu.membershipPlansId = mp.id
   WHERE u.userType = 'Customer' 
     AND u.createdByAdmin = ${adminId} 
     AND u.status = 'active'
 `;
			} else if (type == "upcomingRenewals") {
				query = `SELECT 
  u.id AS userId,
  u.name AS name,
  u.email AS email,
  m.expiryDate,
  DATEDIFF(m.expiryDate, NOW()) AS daysLeft
FROM membershipPurchases m
JOIN users u ON m.userId = u.id
WHERE DATEDIFF(m.expiryDate, NOW()) BETWEEN 1 AND 4
  AND m.status = 'active';`;
			} else if (type == "trainers") {
				query = `SELECT * FROM users WHERE userType ='Trainer' AND createdByAdmin = ${adminId} AND status = 'active'`;
			}
			// Run query
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
						message: "No users found",
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
	},



	getStaff: async (req, res, next) => {
		try {
			const { adminId } = req.params;
			const { searchTerm } = req.query; // <-- Accept search term from query params

			if (!adminId) {
				return res.status(400).json({
					success: false,
					message: "Admin ID is required.",
				});
			}

			let query = `
        SELECT 
          u.*,
          us.effectiveFrom, 
          us.salaryAmount
        FROM users u
        LEFT JOIN monthlySalarySettings us ON u.id = us.userId
        WHERE u.userType NOT IN ('Customer', 'SuperAdmin','Admin')
          AND u.createdByAdmin = ${adminId}
          AND u.status = 'active'
      `;

			// Append filter if searchTerm is provided
			if (searchTerm && searchTerm.trim() !== '') {
				const escapedTerm = searchTerm.replace(/'/g, "''"); // Escape single quotes
				query += ` AND (u.name LIKE '%${escapedTerm}%' OR u.phoneNumber LIKE '%${escapedTerm}%')`;
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
						message: "No users found",
					});
				}

				const finalData = response.data.map(user => ({
					...user,
					salaryAmount: user.salaryAmount !== null ? user.salaryAmount : null
				}));

				return res.status(200).json({
					success: true,
					message: "Staff users retrieved successfully.",
					data: finalData,
				});
			});
		} catch (error) {
			next(error);
		}
	},

	getStaffSalaryInfo: async (req, res, next) => {
		try {
			const { userId } = req.query;

			if (!userId) {
				return res.status(400).json({
					success: false,
					message: "user id is required.",
				});
			}

			let query = `
				SELECT 
				u.*,
				us.effectiveFrom, 
				us.salaryAmount
				FROM users u
				LEFT JOIN monthlySalarySettings us ON u.id = us.userId
				WHERE u.id = ${userId}
				`

			sqlService.query(query, (response) => {
				console.log("resposne : ", response)
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
						message: "No users found",
					});
				}



				return res.status(200).json({
					success: true,
					message: "Staff users retrieved successfully.",
					data: response.data,
				});
			});
		} catch (error) {
			next(error);
		}
	},

	registerStaff: async (req, res, next) => {
		try {
			const {
				name,
				email,
				phoneNo,
				password,
				userType,
				adminId,
				expiryDate
			} = req.body;

			// Validate required fields
			if (!name || !email || !phoneNo || !userType || !adminId) {
				return res.status(400).json({
					success: false,
					message: "Name, email, phone number, userType, and adminId are required.",
				});
			}

			// Check valid staff userType
			const validUserTypes = ['Admin', 'Trainer', 'Receptionist', 'Cleaner', 'Weight-Picker'];
			if (!validUserTypes.includes(userType)) {
				return res.status(400).json({
					success: false,
					message: "Invalid userType for staff registration.",
				});
			}

			// Check for existing user
			const checkUserQuery = `SELECT * FROM users WHERE email = '${email}' OR phoneNumber = '${phoneNo}'`;
			sqlService.query(checkUserQuery, async (checkResult) => {
				console.log("checkResult...", checkResult);

				if (checkResult.data.length > 0) {
					return res.status(200).json({
						success: false,
						message: "User with this email or phone number already exists.",
					});
				}
				const hashedPassword = await bcrypt.hash(password, 10);

				// Use your insert function
				const userData = {
					name,
					email,
					phoneNumber: phoneNo,
					password: hashedPassword,
					userType,
					createdByAdmin: adminId,
					status: 'active',
				};

				sqlService.insert(sqlService.Users, userData, (insertResponse) => {

					console.log("insertResponse...", insertResponse.data.dataValues);

					if (!insertResponse.success) {
						return res.status(500).json({
							success: false,
							message: "Failed to register staff member.",
							error: insertResponse.error,
						});
					}
					const user = insertResponse.data.dataValues;

					const fetchDevicesQuery = `SELECT * FROM devices WHERE userId=${adminId}`;

					sqlService.query(fetchDevicesQuery, async (deviceRes) => {
						if (!deviceRes.success) {
							return res.status(500).json({
								success: false,
								message: "Found no Device!",
							});
						}

						const devices = deviceRes.data;
						const expireDate = new Date(expiryDate).toISOString();

						const userData = {
							userId: String(user.id),
							phoneNo: String(phoneNo),
							name: String(name),
							valid: {
								beginTime: new Date().toISOString(),
								endTime: expireDate,
							},
						};

						// Register user on devices
						const registerPromises = devices.map((device) => {
							return gymController.registerUserOnDevices([device], userData);
						});

						const registrationResults = (await Promise.all(registerPromises)).flat();

						const allSuccess = registrationResults.every((r) => r.success);
						if (!allSuccess) {
							return res.send({
								success: false,
								message: "Device failed to register!"
							});
						}

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

								return res.status(201).json({
									success: true,
									message: "Staff member registered successfully on device!.",
								});
							}
						);
					})
				});
			});
		} catch (error) {
			next(error);
		}
	},

	assignSalary: async (req, res, next) => {
		try {
			const { userId, salaryAmount, adminId } = req.body;

			// Validate required fields
			if (!userId || !salaryAmount || !adminId) {
				return res.status(400).json({
					success: false,
					message: "userId, salaryAmount, and adminId are required.",
				});
			}

			// Check if the admin exists in the users table
			const checkAdminQuery = `SELECT * FROM users WHERE id = ${adminId} AND userType = 'Admin'`;
			sqlService.query(checkAdminQuery, (checkAdminResult) => {
				if (checkAdminResult.data.length === 0) {
					return res.status(404).json({
						success: false,
						message: "Admin not found or invalid adminId.",
					});
				}

				// Check if the user exists in the users table
				const checkUserQuery = `SELECT * FROM users WHERE id = ${userId}`;
				sqlService.query(checkUserQuery, (checkResult) => {
					if (checkResult.data.length === 0) {
						return res.status(404).json({
							success: false,
							message: "User not found.",
						});
					}

					// Check if a salary is already assigned for this user by this admin
					const checkSalaryQuery = `SELECT * FROM monthlySalarySettings WHERE userId = ${userId} AND adminId = ${adminId}`;
					sqlService.query(checkSalaryQuery, (checkSalaryResult) => {
						const effectiveFrom = new Date().toISOString(); // Use current date and time

						if (checkSalaryResult.data.length > 0) {
							// If salary already exists, update the salary record using the updateObj
							const updateObj = {
								salaryAmount,       // New salary
								effectiveFrom,      // Current date
							};

							// Use the generic update function to update the salary
							sqlService.update(sqlService.MonthlySalarySettings, updateObj, { userId, adminId }, (updateResponse) => {
								if (updateResponse.error) {
									return res.status(500).json({
										success: false,
										message: "Failed to update salary.",
										error: updateResponse.error,
									});
								}

								return res.status(200).json({
									success: true,
									message: "Salary updated successfully.",
									data: { userId, salaryAmount, effectiveFrom, adminId },
								});
							});
						} else {
							// If salary doesn't exist, insert a new salary record
							const insertObj = {
								userId,
								salaryAmount,
								effectiveFrom,
								adminId,
							};
							sqlService.insert(sqlService.MonthlySalarySettings, insertObj, (insertResponse) => {
								if (insertResponse.error) {
									return res.status(500).json({
										success: false,
										message: "Failed to assign salary.",
										error: insertResponse.error,
									});
								}

								return res.status(201).json({
									success: true,
									message: "Salary assigned successfully.",
									data: insertObj,
								});
							});
						}
					});
				});
			});
		} catch (error) {
			next(error);
		}
	},

	getUserDataByAdmin: async (req, res, next) => {
		try {
			const { adminId, userId } = req.params;

			if (!adminId || !userId) {
				return res.status(400).json({
					success: false,
					message: "adminId and userId are required!",
				});
			}

			// Check if user exists
			const query = `SELECT * FROM users WHERE id = ${userId} AND createdByAdmin=${adminId}`;
			sqlService.query(query, (result) => {

				if (!result.success || !result.data || result.data.length === 0) {
					return res.status(404).json({
						success: false,
						message: "User not found.",
					});
				}

				return res.status(200).json({
					success: true,
					data: result.data[0],
				});
			});
		} catch (error) {
			next(error);
		}
	},

	updateUserByAdmin: async (req, res, next) => {
		try {
			const { adminId, userId, name, email, phoneNumber, password } = req.body;


			if (!userId || !adminId || !name || !email || !phoneNumber) {
				return res.status(400).json({
					success: false,
					message: "All data are required!",
				});
			}

			const obj = {
				name: name,
				email: email,
				phoneNumber: phoneNumber,
			}

			if (password) {
				const hashedPassword = await bcrypt.hash(password, 10);
				obj.password = hashedPassword
			}

			// Update user
			sqlService.update(
				sqlService.Users,
				obj,
				{ id: userId },
				(updateResult) => {
					if (!updateResult.success) {
						return res.status(500).json({
							success: false,
							message: "Failed to update user.",
						});
					}

					return res.status(200).json({
						success: true,
						message: "User updated successfully.",
					});
				}
			);
		} catch (error) {
			next(error);
		}
	},

	deleteUserByAdmin: async (req, res, next) => {
		try {
			const { userId } = req.body;

			if (!userId) {
				return res.status(400).json({
					success: false,
					message: "userId is required!",
				});
			}

			sqlService.delete(sqlService.Users, { id: userId }, (response) => {

				if (!response.success) {
					return res.status(500).json({
						success: false,
						message: "Failed to delete user.",
					});
				}

				return res.status(200).json({
					success: true,
					message: "User deleted successfully.",
				});


			})
		} catch (error) {
			next(error);
		}
	},

	getUserProfile: async (req, res, next) => {
		try {
			const { userId } = req.params;

			if (!userId) {
				return res.status(200).json({
					success: false,
					message: "userId is required.",
				});
			}

			const query = `SELECT * FROM userProfiles WHERE userId = ${userId} LIMIT 1`;

			sqlService.query(query, (response) => {
				if (!response.success) {
					return res.status(500).json({
						success: false,
						message: "Database error occurred.",
						error: response.error,
					});
				}

				if (!response.data || response.data.length === 0) {
					return res.status(200).json({
						success: false,
						message: "User profile not found.",
					});
				}

				return res.status(200).json({
					success: true,
					message: "User profile retrieved successfully.",
					data: response.data[0],
				});
			});
		} catch (error) {
			next(error);
		}
	},

	getUserDietPlans: async (req, res, next) => {
		try {
			const { userId } = req.params;

			if (!userId) {
				return res.status(400).json({
					success: false,
					message: "userId is required.",
				});
			}

			const query = `
			SELECT * FROM userDietPlans
			WHERE userId = ${userId}
			ORDER BY FIELD(mealType, 'Breakfast', 'Lunch', 'Snack', 'Dinner'), time ASC
		  `;

			sqlService.query(query, (response) => {

				if (!response.success) {
					return res.status(500).json({
						success: false,
						message: "Database error occurred.",
						error: response.error,
					});
				}

				if (!response.data || response.data.length === 0) {
					return res.status(200).json({
						success: false,
						message: "No diet plans found for this user.",
					});
				}

				return res.status(200).json({
					success: true,
					message: "User diet plans retrieved successfully.",
					data: response.data,
				});
			});
		} catch (error) {
			next(error);
		}
	},

	getTrackProgress: async (req, res, next) => {
		try {
			const { userId } = req.params;

			if (!userId) {
				return res.status(400).json({
					success: false,
					message: "userId is required.",
				});
			}

			const query = `
			SELECT * FROM trackProgresses
			WHERE userId = ${userId}
			ORDER BY id DESC
		  `;

			sqlService.query(query, (response) => {
				if (!response.success) {
					return res.status(500).json({
						success: false,
						message: "Database error occurred.",
						error: response.error,
					});
				}

				if (!response.data || response.data.length === 0) {
					return res.status(200).json({
						success: false,
						message: "No progress records found for this user.",
					});
				}

				return res.status(200).json({
					success: true,
					message: "User progress records retrieved successfully.",
					data: response.data,
				});
			});
		} catch (error) {
			next(error);
		}
	}



};

module.exports = userController;
