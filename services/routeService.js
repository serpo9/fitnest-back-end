const gymRoutes = require('../routes/gymRoutes.js');  // Use `require` instead of `import`
 

module.exports = (app) => {
  app.use('/api/fitnest', gymRoutes);  // Prefix all Hikvision API routes with /api/s
};


// const express = require("express");
// const authMiddleware = require("../middlewares/auth-middleware.js");
// const gymRoutes = require('../routes/gymRoutes.js');


// const routeService = express.Router();
// // routeService.use('/public');
// routeService.use('/loggedin', authMiddleware);


// //mountAuthentication routes
// routeService.use('/loggedin/auth',gymRoutes.privateRouter)



// //mountAuthentication routes

// module.exports = routeService;
