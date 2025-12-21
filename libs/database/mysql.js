
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('quick_chat', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, 
});

sequelize.authenticate()
  .then(() => console.log('MySQL (Sequelize) connected successfully!'))
  .catch(err => console.error('MySQL connection error:', err));

module.exports = sequelize;
