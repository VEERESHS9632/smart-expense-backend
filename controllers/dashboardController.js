const { Expense } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

exports.getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const totalExpenses = await Expense.sum('amount', { where: { user_id: userId } }) || 0;
    // Income module optional, so set to 0
    const totalIncome = 0;
    const netBalance = totalIncome - totalExpenses;

    const categoryBreakdown = await Expense.findAll({
      where: { user_id: userId },
      attributes: ['category', [fn('SUM', col('amount')), 'total']],
      group: ['category']
    });

    res.json({
      totalIncome,
      totalExpenses,
      netBalance,
      categoryBreakdown
    });
  } catch (err) {
    next(err);
  }
};

exports.getMonthly = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const monthly = await Expense.findAll({
      where: { user_id: userId },
      attributes: [
        [fn('DATE_TRUNC', 'month', col('date')), 'month'],
        [fn('SUM', col('amount')), 'total']
      ],
      group: [literal('month')],
      order: [[literal('month'), 'ASC']]
    });
    res.json(monthly);
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const categories = await Expense.findAll({
      where: { user_id: userId },
      attributes: [
        [fn('DISTINCT', col('category')), 'category']
      ]
    });
    res.json(categories.map(c => c.category));
  } catch (err) {
    next(err);
  }
};
