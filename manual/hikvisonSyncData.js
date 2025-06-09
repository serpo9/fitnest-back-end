const DigestClient = require("digest-fetch");
const axios = require('axios');
// const { Users } = require('./models'); // Assuming your Sequelize models are exported from here
const sqlService = require('../services/sqlService');
const bcrypt = require("bcryptjs");

const DEVICE_IP = '192.168.29.112';
const BASE_URL = `http://${DEVICE_IP}/ISAPI/AccessControl/UserInfo`;
const MAX_RESULTS = 30;

const client = new DigestClient('admin', 'Rcit@123'); // Replace with actual credentials
notInsertedMap = {
  "00000746": "00000746",
  "00001235": "00001235",
  "00000596": "00000596",
  "00001250": "00001250",
  "00000488": "00000488",
  "00000192": "00000192",
  "123": "123",
  "00000161": "00000161",
  "00001446": "00001446",
  "00000733": "00000733",
  "46": "46",
  "00001456": "00001456",
  "00001457": "00001457",
  "00001463": "00001463",
  "00001468": "00001468",
  "00000268": "00000268",
  "50": "50",
  "00001447": "00001447",
  "154": "154",
  "216": "216",
  "00001276": "00001276",
  "00000179": "00000179",
  "45": "45",
  "00000603": "00000603",
  "00000576": "00000576",
  "199": "199",
  "146": "146"
}

async function fetchUserCount() {
    const response = await client.fetch(`${BASE_URL}/Count?format=json`);
    const data = await response.json();
    console.log("count resposne : ", data);
    return data.UserInfoCount.userNumber;
}

async function fetchUsers(startPosition) {
    const payload = {
        UserInfoSearchCond: {
            searchID: `${Date.now()}`,
            searchResultPosition: startPosition,
            maxResults: MAX_RESULTS
        }
    };

    const response = await client.fetch(`${BASE_URL}/Search?format=json`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    });
    
    const text = await response.text(); // get response as text
    
    // console.log('Response Text:', text);
    
    // Check if the response contains XML (this can be determined by the start of the response text)
    if (text.startsWith('<')) {
        console.log('Skipping XML response...');
        return; // Skip further processing if it's XML
    }
    
    try {
        const data = JSON.parse(text); // Try to parse as JSON if it's not XML
        console.log("data....", data);
        return data.UserInfoSearch.UserInfo || [];
    } catch (error) {
        console.error('Failed to parse JSON:', error);
        throw error;
    }
    
    
}

async function generateUniqueEmail(baseName) {
    const query = `SELECT email FROM users WHERE email LIKE '${baseName}%@gmail.com' ORDER BY id DESC LIMIT 1`;
    return new Promise((resolve, reject) => {
        sqlService.query(query, (results) => {
            let counter = 1;
            if (results.data && results.data.length > 0) {
                const existing = results.data[0];
                const match = existing.email.match(/(\d+)@gmail\.com$/);
                if (match) {
                    counter = parseInt(match[1]) + 1;
                }
            }
            resolve(counter);
        });
    });
}



async function saveUsersToDB(users) {
    const baseCounter = await generateUniqueEmail('user');
    let counter = baseCounter;
    console.log("counter...", counter);
    
    const now = new Date();

    console.log("notInsertedMap[user.employeeNo] : ", notInsertedMap);
    for (let user of users) {
        console.log("user.employeeNo : ",user.employeeNo)
        if(notInsertedMap[user.employeeNo]){
        const expiryTime = user?.Valid?.endTime ? new Date(user.Valid.endTime) : null;

        const formattedExpiry = formatToMySQLDate(user.Valid.endTime);

        if (!expiryTime || expiryTime <= now) {
            console.log(`------- Skipping user ${user.name || 'Unknown'} due to expired Valid. ${formattedExpiry}`);
            continue; // Skip expired users
        }
        const name = (user.name || 'Unknown').replace(/\s+/g, ''); // remove space if there is any
        const employeeNo = user.employeeNo;

        const email = `user${counter}@gmail.com`;
        const password = `${name}1234`;
        const hashedPassword = await bcrypt.hash(password, 10);

        const obj = {
            name: name,
            email: email,
            phoneNumber: '',
            gymName: '',
            userType: 'Customer',
            status: 'active',
            fitnessGoal: '',
            healthIssue: '',
            specialization: '',
            createdByAdmin: 2,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
            employeeNo: employeeNo
        };

        console.log("obj...", obj.email);
        
        sqlService.insert(sqlService.Users, obj, async (response) => {
            
            console.log(`Inserted: ${name} | ${email} | ${password}`);

            // After inserting user, get userId and insert into membershipPurchases
            const userId = await response.data.id;
            console.log("userId..", userId);
            saveMembershipPurchase(userId, formattedExpiry);
        });

        counter++;
        }
    }
}

async function saveMembershipPurchase(userId, expireDate) {
    const currentDate = new Date();

    const formattedDate = currentDate.getFullYear() + '-' +
        String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(currentDate.getDate()).padStart(2, '0') + ' ' +
        String(currentDate.getHours()).padStart(2, '0') + ':' +
        String(currentDate.getMinutes()).padStart(2, '0') + ':' +
        String(currentDate.getSeconds()).padStart(2, '0');

    console.log("Formatted Date:", formattedDate);


    const membershipData = {
        userId: userId,
        membershipPlansId: 1, // Fixed to 1
        purchaseDate: formattedDate,
        purchaseDate: formattedDate,
        expiryDate: expireDate,
        paymentStatus: 'Paid', // Assuming payment is successful
        amountPaid: '', // Set default value or retrieve from elsewhere
        selectedDuration: 'monthly',
        monthQty: 1,
        dayQty: 0,
        status: 'active'
    };

    // Insert the membership purchase record
    sqlService.insert(sqlService.MembershipPurchases, membershipData, (response) => {
        console.log(`Inserted Membership for userId ${userId}`);
    });
}


async function syncUsersFromDevice() {
    try {
        const totalUsers = await fetchUserCount();
        console.log("totalUsers....", totalUsers);

        const loops = Math.ceil(totalUsers / MAX_RESULTS);
        console.log('loop...', loops);
        

        for (let i = 0; i < loops; i++) {
            const startPosition = i * MAX_RESULTS;
            const users = await fetchUsers(startPosition);

            if (users) {
                await saveUsersToDB(users);
            }
            
        }

        console.log('All users synced successfully.');
    } catch (error) {
        console.error('Error syncing users:', error);
    }
}

function formatToMySQLDate(isoDate) {
    const date = new Date(isoDate);
    const pad = (n) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // JS months are 0-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

syncUsersFromDevice();
