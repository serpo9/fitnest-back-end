const sqlService = require("../services/sqlService"),
  config = require("../config/appConfig"),
  jwt = require("jsonwebtoken");
  

const authentication = async (req, res, next) => {
  var token = req.query.token || req.headers.authentication || req.params.token;
  const sendAuthenticationError = function () {
    res.status(502);
    res.send({
      error: true,
      reason: "authentication error",
    });
  };

  if (token) {
    let newToken = token.replace(/Fitnest.*/, "");
    jwt.verify(newToken, process.env["JWT_SECRET"], function (err, decoded) {
      if (err) {
        sendAuthenticationError();
      } else {
        req.decoded = decoded;
        var whereObj = {
          id: req.decoded.id,
        };

		sqlService.findOne(sqlService.Users, whereObj, function (obj) {
			if (!(obj.data.id)) {
			  sendAuthenticationError();
			} else {
			 req.user = obj;
			  next();
			}
		  });
      }
	  
    });
  } else {
    sendAuthenticationError();
  }
};

module.exports = authentication;
