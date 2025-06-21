require('dotenv').config();
const Sequelize = require('sequelize'),
	util = require('util'),
	path = require('path'),
	sequelize = new Sequelize(process.env['MYSQL_DB'], process.env['MYSQL_USERNAME'], process.env['MYSQL_PASSWORD'], {
		host: process.env['MYSQL_HOST'],
		port: process.env['MYSQL_PORT'],
		dialect: 'mysql',
		logging: false
	}),
	moment = require('moment');

const Users = sequelize.define('users', {
	name: Sequelize.STRING,
	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	phoneNumber: Sequelize.STRING,
	gymName: Sequelize.STRING, // Gym where the user is registered
	userType: {
		type: Sequelize.ENUM('Admin', 'Trainer', 'Customer', 'SuperAdmin', 'Receptionist', 'Cleaner', 'Weight-Picker'), // Trainers bhi yahi store honge
		allowNull: false
	},
	status: {
		type: Sequelize.ENUM('active', 'inactive', 'pending'),
		defaultValue: 'pending'
	},
	fitnessGoal: Sequelize.STRING, // Only for Customers
	healthIssue: Sequelize.STRING, // Only for Customers
	specialization: Sequelize.STRING, // Only for Trainers (e.g., Yoga, Cardio)
	createdByAdmin: {
		type: Sequelize.INTEGER,
		references: {
			model: 'users',
			key: 'id'
		},
		allowNull: true // NULL for Admins & Customers, but will store Admin ID for Trainers
	},
	password: Sequelize.STRING,
	employeeNo: Sequelize.STRING
}, {
	timestamps: true
});

var Verifications = sequelize.define('verifications', {
	email: Sequelize.STRING,
	phone: Sequelize.STRING,
	otp: Sequelize.STRING,
	expiresAt: Sequelize.DATE,
});

const Schedules = sequelize.define('schedules', {
	adminId: {  // ✅ Admin who scheduled the class
		type: Sequelize.INTEGER,
		references: {
			model: Users, key: 'id'
		},
		onDelete: 'CASCADE'
	},
	userId: {  // ✅ Admin who scheduled the class
		type: Sequelize.INTEGER,
		references: {
			model: Users, key: 'id'
		},
		onDelete: 'CASCADE'
	},
	startingTime: Sequelize.STRING,
	endTime: Sequelize.STRING,
	className: Sequelize.STRING,
	trainerId: {  // ✅ trainer that will be assigned to the class
		type: Sequelize.INTEGER,
		references: {
			model: Users, key: 'id'
		},
		onDelete: 'CASCADE'
	},
	capacity: Sequelize.INTEGER,
	filledCapacity: Sequelize.INTEGER,
}, {
	timestamps: true,

});


const ScheduleDays = sequelize.define('scheduledays', {
	scheduleId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Schedules,
			key: 'id'
		},
		onDelete: 'CASCADE'
	},
	day: {
		type: Sequelize.STRING,
		allowNull: false
	}
}, {
	timestamps: true
});

const ScheduleUser = sequelize.define('scheduleUsers', {
	scheduleId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Schedules,
			key: 'id'
		},
		onDelete: 'CASCADE'
	},
	userId: {  // ✅ Admin who scheduled the class
		type: Sequelize.INTEGER,
		references: {
			model: Users, key: 'id'
		},
		onDelete: 'CASCADE'
	},
}, {
	timestamps: true
})







const Devices = sequelize.define('devices', {
	userId: {
		type: Sequelize.INTEGER,
		references: {
			model: Users,
			key: 'id'
		},
		onDelete: 'CASCADE'
	},
	ipAddress: Sequelize.STRING,
	username: Sequelize.STRING,
	password: Sequelize.STRING,
	purpose: Sequelize.STRING,
	status: Sequelize.STRING
});

const AddrealtimeName = sequelize.define('addrealtimeName', {

	name: Sequelize.STRING,
	username: Sequelize.STRING
});

const SubscriptionPlan = sequelize.define('subscriptionPlan', {
	userId: {
		type: Sequelize.INTEGER,
		references: {
			model: 'users', // Referencing the Users table
			key: 'id'
		},
		onDelete: 'CASCADE'
	},
	scheduleId: {
		type: Sequelize.INTEGER,
		references: {
			model: 'schedules', // Referencing the Schedules table
			key: 'id'
		},
		onDelete: 'CASCADE'
	},
	adminId: {
		type: Sequelize.INTEGER,
		references: {
			model: 'users', // Referencing the Users table (admin who created the plan)
			key: 'id'
		},
		onDelete: 'CASCADE'
	},
	employeeNo: Sequelize.STRING,
	deviceId: {
		type: Sequelize.INTEGER,
		references: {
			model: 'devices', // Referencing the Users table (admin who created the plan)
			key: 'id'
		},
		onDelete: 'CASCADE'
	},
	amountPaid: {
		type: Sequelize.FLOAT,
		allowNull: false
	}
}, {
	timestamps: true
});



const UserProfiles = sequelize.define('userProfiles', {
	userId: Sequelize.INTEGER,
	bloodGroup: Sequelize.STRING,
	height: Sequelize.STRING,
	weight: Sequelize.STRING,
	fitnessGoals: Sequelize.STRING,
	dob: Sequelize.STRING,
	gender: Sequelize.STRING
})

const TrackProgresses = sequelize.define('trackProgresses', {
	userId: Sequelize.INTEGER,
	weight: Sequelize.STRING,
})

const MembershipPlans = sequelize.define('membershipPlans', {
	userId: Sequelize.INTEGER,
	planName: Sequelize.STRING,  // Short plan name, so keeping STRING
	description: Sequelize.TEXT,
	features: Sequelize.TEXT,    // Changed to TEXT for long descriptions
	includesPersonalTrainer: Sequelize.STRING,
	includesGroupClasses: Sequelize.STRING,
	monthlyPrice: Sequelize.STRING,
	quarterlyPrice: Sequelize.STRING,
	yearlyPrice: Sequelize.STRING,
	extraPersonalTrainerFee: Sequelize.STRING,
	extraGroupClassFee: Sequelize.STRING,
	status: Sequelize.STRING,
	isDeleted: Sequelize.STRING,
	pricePerDay: Sequelize.STRING,
	planType: Sequelize.STRING,
	doors: Sequelize.STRING,
});

const MembershipPurchases = sequelize.define('membershipPurchases', {
	userId: Sequelize.INTEGER,
	membershipPlansId: Sequelize.INTEGER,
	purchaseDate: Sequelize.DATE,
	expiryDate: Sequelize.DATE,  // Stores when the membership ends
	paymentStatus: Sequelize.STRING,
	amountPaid: Sequelize.STRING,
	selectedDuration: Sequelize.STRING,  // "monthly", "quarterly", or "yearly"
	monthQty: Sequelize.INTEGER,
	dayQty: Sequelize.INTEGER,
	status: Sequelize.STRING, // 'active', 'inactive', 'expired'
	admissionFee: Sequelize.INTEGER,
});

const MembershipPurchasesHistories = sequelize.define('membershipPurchasesHistories', {
	userId: Sequelize.INTEGER,
	membershipPlansId: Sequelize.INTEGER,
	amountPaid: Sequelize.STRING,
	paymentStatus: Sequelize.STRING,
	purchaseDate: Sequelize.DATE,
	expiryDate: Sequelize.DATE,
	selectedDuration: Sequelize.STRING,
	monthQty: Sequelize.INTEGER,
	dayQty: Sequelize.INTEGER,
	status: Sequelize.STRING,
	admissionFee: Sequelize.INTEGER,
});

const MembershipPurchasedInstallmentAmounts = sequelize.define('membershipPurchasedInstallmentAmounts', {
	purchaseHistoryId: Sequelize.INTEGER,
	userId: Sequelize.INTEGER,
	receivedAmount: Sequelize.STRING,
	paymentStatus: Sequelize.STRING,

});

const Attendances = sequelize.define('attendances', {
	userId: Sequelize.INTEGER,
	adminId: Sequelize.INTEGER,
	deviceId: Sequelize.INTEGER,
	name: Sequelize.STRING,
	time: Sequelize.DATE,
	status: Sequelize.STRING,
});

const MonthlySalarySettings = sequelize.define('monthlySalarySettings', {
	userId: Sequelize.INTEGER,
	adminId: Sequelize.INTEGER,
	salaryAmount: Sequelize.FLOAT,
	effectiveFrom: Sequelize.DATE,
});



const SubscriptionRequest = sequelize.define('subscriptionRequest', {
	membershipPlansId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: MembershipPlans,
			key: 'id'
		},
		onDelete: 'CASCADE'
	},
	userId: {  // ✅ Admin who scheduled the class
		type: Sequelize.INTEGER,
		references: {
			model: Users, key: 'id'
		},
		onDelete: 'CASCADE'
	},
	adminId: Sequelize.INTEGER,
	status: {
		type: Sequelize.STRING,
		defaultValue: 'pending',
	},
}, {
	timestamps: true
})

const HolidaySummaries = sequelize.define('holidaySummaries', {
	adminId: Sequelize.INTEGER,
	userId: Sequelize.INTEGER,
	month: Sequelize.INTEGER,           // e.g., 4 for April
	year: Sequelize.INTEGER,            // e.g., 2025
	weeklyOffs: Sequelize.INTEGER,      // Saturdays/Sundays
	publicHolidays: Sequelize.INTEGER,  // National holidays, declared by admin
	privateOffDays: Sequelize.INTEGER,   // Personal off days (e.g., sick leave)
	extraDuties: Sequelize.INTEGER
});

const LeaveDetails = sequelize.define('leaveDetails', {
	userId: Sequelize.INTEGER,
	adminId: Sequelize.INTEGER,
	leaveDate: Sequelize.DATEONLY, // Format: YYYY-MM-DD
	leaveType: Sequelize.STRING,   // 'public', 'private', or 'weekly'
	isCancelled: Sequelize.STRING
});

const SalaryHistories = sequelize.define('salaryHistories', {
	userId: Sequelize.INTEGER,
	adminId: Sequelize.INTEGER,
	totalPresentDays: Sequelize.INTEGER,
	calculatedAmount: Sequelize.FLOAT,
	month: Sequelize.STRING,  // Format: '04' for April
	year: Sequelize.STRING,   // Format: '2025'
});

const UserDietPlans = sequelize.define('userDietPlans', {
	adminId: Sequelize.INTEGER,
	userId: Sequelize.INTEGER,
	trainerId: Sequelize.INTEGER,
	mealType: Sequelize.STRING,    // e.g., Breakfast, Lunch, etc.
	time: Sequelize.TIME,          // e.g., "08:00:00"
	foodName: Sequelize.STRING,    // e.g., "Rice"
	quantity: Sequelize.STRING,    // e.g., "200g" or "2 eggs"
	notes: Sequelize.TEXT,         // Optional
	status: Sequelize.STRING
});


const StorePlans = sequelize.define('storePlans' , {
	trainerId: Sequelize.INTEGER,    
	adminId: Sequelize.INTEGER,   
	pdfname: Sequelize.STRING,
})


const ClientDietPlan = sequelize.define('clientDietPlan' , {
	trinaerId: Sequelize.INTEGER,    
	adminId: Sequelize.INTEGER,   
	username: Sequelize.STRING,
	userid: Sequelize.STRING,
	pdfname: Sequelize.STRING,
})


const SubscriptionAssignmentRequests = sequelize.define('subscriptionAssignmentRequests', {
	userId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	phoneNo: {
		type: Sequelize.STRING,
	},
	email: {
		type: Sequelize.STRING,
	},
	membershipPlansId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	planType: {
		type: Sequelize.STRING,
	},
	selectedDuration: {
		type: Sequelize.STRING,
	},
	monthQty: {
		type: Sequelize.INTEGER,
	},
	amountPaid: {
		type: Sequelize.STRING,
	},
	admissionFee: {
		type: Sequelize.STRING,
	},
	status: {
		type: Sequelize.STRING,
		defaultValue: 'pending',
	},
	paymentStatus: {
		type: Sequelize.STRING,
		defaultValue: 'false',
	},
	adminId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	daysQty: {
		type: Sequelize.INTEGER,
		allowNull: false,
	}
});



let sendExports = {
	insert: function (table, createObj, callback) {
		table.create(createObj)
			.then(function (data) {
				callback({
					success: true,
					data: data
				})
			}, function (err) {
				callback({
					success: false,
					data: err
				})
			});
	},
	findOrCreate: function (table, whereObj, defaultsObj, callback) {
		table
			.findOrCreate({ where: whereObj, defaults: defaultsObj })
			.then(function (data) {
				callback({
					success: true,
					data: data
				})
			}, function (err) {
				callback({
					success: false,
					data: err
				})
			});
	},
	findOrCreateSimple: function (table, whereObj, defaultsObj, callback) {
		sendExports.findOne(table, whereObj, function (response) {
			if (response.error) {
				callback({
					sucess: false,
					reason: 'Some error while saving data!'
				})
			} else {
				if (response && response.data && response.data.dataValues && response.data.dataValues.id) {
					callback(response);
				} else {
					sendExports._createRealTime(table, defaultsObj, callback);
				}
			}
		});
	},
	findAll: function (table, whereObj, callback) {
		let order;
		if (whereObj.order) {
			delete whereObj.order;
			order = [['createdAt', 'DESC']];
		} else {
			delete whereObj.order;
			order = [['createdAt', 'ASC']];
		}
		table.findAll({ where: whereObj, order: order }).then(function (projects) {
			callback({
				success: true,
				data: projects
			})
		}, function (err) {
			callback({
				sucess: false,
				data: err
			})
		});
	},
	findPagination: function (table, whereObj, limit, offset, callback) {
		table.findAll({ where: whereObj, order: [['createdAt', 'DESC']], offset: offset, limit: limit }).then(function (projects) {
			callback({
				success: true,
				data: projects
			})
		}, function (err) {
			callback({
				sucess: false,
				data: err
			})
		});
	},
	findOne: function (table, whereObj, callback) {
		table.findAll({ limit: 1, where: whereObj }).then(function (projects) {
			let sendProjects;
			if (projects[0]) {
				sendProjects = projects[0];
			} else {
				sendProjects = {};
			}
			callback({
				success: true,
				data: sendProjects
			})
		}, function (err) {
			callback({
				sucess: false,
				data: err
			})
		});
	},
	findOneDesc: function (table, whereObj, callback) {
		let order = [['createdAt', 'DESC']];
		table.findAll({ limit: 1, where: whereObj, order: order }).then(function (projects) {
			let sendProjects;
			if (projects[0]) {
				sendProjects = projects[0];
			} else {
				sendProjects = {};
			}
			callback({
				success: true,
				data: sendProjects
			})
		}, function (err) {
			callback({
				sucess: false,
				data: err
			})
		});
	},
	update: function (table, newObj, whereObj, callback) {
		table.update(newObj, { where: whereObj }).then(function (response) {
			callback({
				success: true,
				data: response
			})
		}, function (err) {
			callback({
				sucess: false,
				data: err
			})
		});
	},
	delete: function (table, whereObj, callback) {
		table.destroy({
			where: whereObj
		}).then(function () {
			callback({
				success: true
			});
		}, function (err) {
			callback({
				sucess: false,
				data: err
			})
		});
	},
	truncate: function (table, callback) {
		table.destroy({
			truncate: true,
			cascade: false
		}).then(function () {
			callback({
				error: false
			});
		}, function (err) {
			callback({
				sucess: false,
				data: err
			})
		});
	},
	count: function (table, name, callback) {
		table.findAndCountAll({ attributes: [name], group: name }).then(function (result) {
			callback({
				success: true,
				data: result
			})
		}, function (err) {
			callback({
				sucess: false,
				data: err
			})
		});
	},
	_findUsers: function (deliveryId, cb) {
		sendExports.findOneDesc(Users, { id: deliveryId }, function (response) {
			if (response.error) {
				sendExports._findUsers(deliveryId, cb);
			} else {
				if (response && response.data && response.data.dataValues && response.data.dataValues.id) {
					cb({
						askDetails: "false"
					});
				} else {
					cb({
						askDetails: "true"
					});
				}
			}
		});
	},
	_updateRealTime: function (table, findObj, obj, cb) {
		sendExports.update(table, obj, findObj, function (result) {
			if (result.error) {
				cb({
					sucess: false,
					reason: 'Some error while saving data!'
				})
			} else {
				cb(result);
			}
		});
	},
	_createRealTime: function (table, obj, cb) {
		sendExports.insert(table, obj, function (result) {
			if (result.error) {
				cb({
					sucess: false,
					reason: 'Some error while saving data!'
				})
			} else {
				cb(result);
			}
		});
	},
	createOrUpdate: function (table, findObj, obj, cb) {
		sendExports.findOne(table, findObj, function (response) {
			if (response.error) {
				cb({
					sucess: false,
					reason: 'Some error while saving data!'
				})
			} else {
				if (response && response.data && response.data.dataValues && response.data.dataValues.id) {
					//Update User
					sendExports._updateRealTime(table, findObj, obj, cb);
				} else {
					//Create User
					sendExports._createRealTime(table, obj, cb);
				}
			}
		});
	},
	_returnRealTime: function (table, findObj, cb) {
		sendExports.findOne(table, findObj, function (response) {
			if (response.error) {
				cb(false, {
					data: 'Database error!'
				});
			} else {
				if (response && response.data && response.data.dataValues && response.data.dataValues.id) {
					cb(true, response);
				} else {
					cb(false, response);
				}
			}
		});
	},
	_returnAllRealTime: function (table, findObj, cb) {
		sendExports.findAll(table, findObj, function (response) {
			if (response.error) {
				cb(false, {
					data: 'Database error!'
				});
			} else {
				if (response && response.data && response.data.length > 0) {
					cb(true, response);
				} else {
					cb(false, response);
				}
			}
		});
	},
	bulkInsert: function (table, recordsArray, callback) {
		table.bulkCreate(recordsArray)
			.then(function (data) {
				callback({ success: true, data });
			})
			.catch(function (err) {
				callback({ success: false, data: err });
			});
	},

	queryGen: function (query, callback) {
		sequelize.query(query).then(function (result) {
			callback({
				success: true,
				data: result
			});
		}, function (err) {
			callback({
				success: false,
				data: err
			});
		});
	},
	query: function (query, callback) {
		sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(function (result) {
			callback({
				success: true,
				data: result
			});
		}, function (err) {
			callback({
				success: false,
				data: err
			});
		});
	},
	updateTransaction: function (table, newObj, whereObj, transaction, callback) {
		return table.update(newObj, { where: whereObj, transaction: transaction }, {
		}).then(function (data) {
			return callback({
				success: true,
				data: data
			})
		}, function (err) {
			return callback({
				success: false,
				data: err
			})
		});
	},
	findOneTransaction: function (table, whereObj, transaction, callback) {
		return table.findAll({ limit: 1, where: whereObj, transaction: transaction, lock: transaction.LOCK.UPDATE }).then(function (projects) {
			let sendProjects;
			if (projects[0]) {
				sendProjects = projects[0];
			} else {
				sendProjects = {};
			}
			return callback({
				success: true,
				data: sendProjects
			})
		}, function (err) {
			return callback({
				success: false,
				data: err
			})
		});
	},

	Sequelize: sequelize,
	Users,
	Devices,
	Schedules,
	Verifications,
	AddrealtimeName,
	SubscriptionPlan,
	UserProfiles,
	TrackProgresses,
	ScheduleDays,
	MembershipPlans,
	MembershipPurchases,
	SubscriptionRequest,
	ScheduleUser,
	Attendances,
	MonthlySalarySettings,
	HolidaySummaries,
	LeaveDetails,
	SalaryHistories,
	MembershipPurchasesHistories,
	MembershipPurchasedInstallmentAmounts,
	UserDietPlans,
	SubscriptionAssignmentRequests,
	ClientDietPlan,
	StorePlans
}

module.exports = sendExports;