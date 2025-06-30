const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const gymController = require('../controllers/gymController.js');
const userController = require('../controllers/userController.js');
const scheduleController = require('../controllers/scheduleController.js');
const notificationController = require('../controllers/notificationController.js');
const router = express.Router();
const upload = require("../config/multer.js")

router.post('/admin/batch-register', gymController.registerAllUsers);
router.post('/dummy/batch-register', gymController.dummyregisterUserByAdmin);
router.post('/register', gymController.registerUser);
router.post('/register-verify', gymController.verifyRegisteringUser);
router.post('/register-user-by-admin', gymController.registerUserByAdmin);
router.post('/login', gymController.login);
router.get('/silent-login', gymController.silentLogin);
router.post('/new-scheduling', scheduleController.newscheduling);
router.post('/add-device', gymController.addDevice);
router.get('/pending-admin', gymController.getPendingAdmins);
router.post('/update-admin-status', gymController.updateAdminStatus);
router.post('/update-trainer-status', gymController.updateTrainerStatus);
router.get('/all-active-trainer', gymController.getActiveTrainersByAdmin);
router.post('/add-name', gymController.addname);
router.get('/get-all-data', gymController.getAllNames);
router.get('/get-all-admin', gymController.getAllAdmin);
router.get('/get-active-customer/:adminId', userController.getAllCustomers); // for all users
router.get('/get-active-Trainer/:adminId', gymController.getAllTrainer);
router.get('/get-pending-Trainer/:adminId', gymController.getPendingTrainer);
router.get('/get-active-sessions/:adminId', gymController.getAllSessions);
router.get('/get-active-device/:adminId', gymController.getAllactiveDevice);
router.post('/add-subscription-plan', gymController.addSubscriptionPlan);
router.get('/get-Schedules/:adminId', scheduleController.getSchedules);
router.get('/get-subscriptionplan/:adminId/:duration?', gymController.getallsubscriptionplan);
router.get('/get-trainer-schedules/:trainerId', gymController.trainerSchedules);
router.get('/get-all-trainer-schedules/:adminId', gymController.getAllTrainerSchedules);
router.get('/get-gymname/:adminId', gymController.getAdminGymName);

router.post('/complete-profile', userController.completeProfile);
router.get('/user-profile/:userId', gymController.getProfileDetails);
router.post('/track-progress', gymController.trackProgress);
router.get('/get-tracking-progress/:userId', gymController.fetchTrackUsers);

//all users routes
router.get('/users-count/:adminId', gymController.getUserCounts);
router.get('/staffs-count/:adminId', gymController.getStaffCount);
router.get('/search-users/:adminId', userController.searchUsers);
router.post('/update-profile', userController.updateUserPersonalData);
router.get('/search-usersByType/:adminId', userController.searchUsersByUserType);
router.get('/search-trainerByStatus/:adminId', userController.searchTrainerByStatus);
router.post('/approve-trainer', userController.approveOrDeactivateTrainer);
router.post('/assign-trainer/:scheduleId', userController.assignTrainer);
router.get('/delete-schedule/:scheduleId', scheduleController.deleteSchedule);
router.post('/edit-schedule/:scheduleId', scheduleController.editSchedule);
router.post('/get-scheduleByDays', scheduleController.getSchedulesByDays);
router.post('/get-trainerScheduleByDays', scheduleController.getTrainerSchduleByDays);

router.post('/assign-userToSchedule/:scheduleId', scheduleController.assignUserToSchedule);
router.get('/get-userClasses/:userId', scheduleController.getUserClasses);
router.post('/send-notification/', notificationController.sendnotification);
router.get('/users-for-notification/:adminId', userController.findUsersForNotification);
router.post('/send-invoice', notificationController.sendInvoice);
router.get('/trainer-schedule/', scheduleController.getTrainerSchedules);
router.post('/request-subscription', scheduleController.requestSubscription);
router.get('/get-subscription-request/:adminId', scheduleController.getSubscriptionRequests);
router.get('/get-staff/:adminId',userController.getStaff);
router.post('/registerStaff',userController.registerStaff);




//schedules routes
router.get('/search-schedules/:adminId', scheduleController.searchSchedule);


// device connnection 
router.post('/device-entry-gate', gymController.entryGate);
router.get('/get-devices/:adminId', gymController.fetchDevices);

// memberships [ apis]
router.post('/create-membership-plan', gymController.createMembershipPlans);
router.post('/create-visitor-plan', gymController.createVisitorPlans);
router.post('/update-membership-plan/:membershipPlanId', gymController.updateMembershipPlan);
router.get('/get-membership-plan/:adminId', gymController.getMembershipPlans);
router.get('/get-visitor-plan/:adminId', gymController.getVistiorPlans);
router.get('/get-all-plans/:adminId', gymController.getAllPlans);
router.get('/view-plans-by-id/:adminId/:membershipPlanId', gymController.viewPlansById);
router.get('/get-active-customers/:adminId', gymController.getActiveCustomers); // get subs-users
router.get('/get-active-customers-by-id', gymController.getActiveCustomerById); 
router.get('/view-purchased-plans/:userId', gymController.viewPurchasedPlanByUser);
router.get('/view-subs-plans/:adminId', gymController.getSubscribedUsers);
router.post('/buy-membership-plan', gymController.buyMembershipPlan);
router.get('/dashboard-users-count/:adminId', gymController.getDashboardCounts);
router.get('/expiring-users-plans/:adminId', gymController.getExpiringPlansOfUsers);
router.post('/update-expired-plans', gymController.updateUserPlanStatusIfExpired);
router.get('/todays-collection/:adminId', gymController.getTodaysCollection);
router.get('/memberships-installment-payments/:adminId', gymController.getMembershipInstallmentPayments);
router.post('/update-memberships-dueAmount', gymController.updateReceivedAmount);
router.get('/membership-dueAmount/:userId', gymController.getDueAmount);

// Salary Based APIs
router.post('/assign-SalaryToStaff',userController.assignSalary);
router.post('/set-monthly-salary', gymController.setMonthlySalary); //
router.post('/calculate-salary', gymController.calculateSalary);
router.get('/get-salary-info', userController.getStaffSalaryInfo);
router.get('/get-individual-salary-history', gymController.getIndividualSalaryHistories);
router.get('/salary-history/:adminId', gymController.getSalaryHistories);
router.post('/post-salary-history', gymController.insertSalaryHistory);
router.get('/memberships-history/:adminId', gymController.getMembershipPaymentHistory);


// Leave Based APIs
router.get('/active-staffs/:adminId', gymController.getActiveStaffUsers);
router.post('/manage-leave', gymController.manageHolidaySummary);
router.get('/leave-details/:adminId', gymController.getLeaveDetails);

//************** */ device connnection  //************** */ 
router.post('/device-entry-gate', gymController.entryGate);
router.post('/device-attendance', gymController.fetchAttendanceData);
router.get('/get-today-attendance/:adminId', gymController.fetchTodaysAttendance);

//*************** */ Edit user by Admin //************/
router.get('/get-user-by-admin/:adminId/:userId', userController.getUserDataByAdmin);
router.post('/update-user-by-admin', userController.updateUserByAdmin);
router.post('/delete-user-by-admin', userController.deleteUserByAdmin);
router.get('/get-users-attendances/:adminId/:userId', gymController.getAttendancesOfUser)
router.get('/get-individual-attendance/:adminId/:userId', gymController.getIndividualAttendance)

// Diet 
router.post('/create-diet', gymController.createDietPlan);
router.get('/view-diet/:trainerId', gymController.getDietPlansByTrainer);

router.post('/register-admin', gymController.registerAdminBySuperAdmin);
router.get('/view-all-admin', gymController.getActiveAdmins);
router.post('/update-more-profile-info', userController.updateMoreProfileInfo);
router.get('/get-userprofile/:userId', userController.getUserProfile);
router.get('/get-dietplan/:userId', userController.getUserDietPlans);

// Receptionist
router.post('/send-request-for-approval', gymController.requestSubscriptionAssignment);
router.get('/get-subs-approval-list/:adminId', gymController.listPendingSubscriptionRequests);
router.post('/approve-subs-approval-list', gymController.approvePendingSubscriptionRequests);
router.post('/upload-pdf', upload.single('file'), gymController.uploadFile);
router.get('/get-trainer-pdfs/:trainerId',gymController.getTrainerPDFs);
router.get('/get-plan-for-users/:id',gymController.getPlansByAdminOrTrainerId);
router.post('/assign-plan-to-users',gymController.assignPlanToUser);
router.get('/get-asssigned-users/:adminId',gymController.getAssignedUsers);
router.post('/delete-membership-plan', gymController.deleteMembershipPlan);

module.exports = router;
