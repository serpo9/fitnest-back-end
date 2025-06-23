var sqlService = require('../services/sqlService');
var sequelize = sqlService.Sequelize;

// sequelize.sync({ alter: true })
// 	.then(() => {
// 		console.log('Database & tables created!');
// 	})
// 	.catch((error) => {
// 		console.error('Error syncing database:', error);
// 	});

sequelize.authenticate()
  .then(async () => {
    console.log('✅ DB connected');

    // Set session time zone for this connection
    await sequelize.query(`SET time_zone='+05:30'`);
    console.log('✅ time_zone set to +05:30');

    return sequelize.sync({ alter: true }); // Sync after time zone is set
  })
  .then(() => {
    console.log('✅ Database & tables created or updated!');
  })
  .catch((error) => {
    console.error('❌ Error syncing database:', error);
  });