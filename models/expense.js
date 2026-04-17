module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define('Expense', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false, index: true },
    description: { type: DataTypes.STRING },
    date: { type: DataTypes.DATEONLY, allowNull: false, index: true },
    payment_type: { type: DataTypes.STRING, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false, index: true }
  }, {
    indexes: [
      { fields: ['user_id'] },
      { fields: ['date'] },
      { fields: ['category'] }
    ]
  });

  return Expense;
};
