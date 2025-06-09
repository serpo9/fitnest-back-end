var sqlService = require('../services/sqlService');
var sequelize = sqlService.Sequelize;

sequelize.sync({ alter: true })
	.then(() => {
		console.log('Database & tables created!');
	})
	.catch((error) => {
		console.error('Error syncing database:', error);
	});
