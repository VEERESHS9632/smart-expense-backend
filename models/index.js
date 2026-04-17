const Sequelize = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Expense = require('./expense')(sequelize, Sequelize.DataTypes);

db.User.hasMany(db.Expense, { foreignKey: 'user_id' });
db.Expense.belongsTo(db.User, { foreignKey: 'user_id' });

module.exports = db;
