const { Expense } = require('../models');
const { Op } = require('sequelize');

exports.createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date, payment_type } = req.body;
    if (!amount || !category || !date || !payment_type) return res.status(400).json({ message: 'Missing required fields' });

    const expense = await Expense.create({
      amount, category, description, date, payment_type, user_id: req.user.id
    });
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, payment_type, search, minAmount, maxAmount } = req.query;
    const where = { user_id: req.user.id };

    if (category) where.category = category;
    if (payment_type) where.payment_type = payment_type;
    if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] };
    if (search) where.description = { [Op.iLike]: `%${search}%` };
    if (minAmount && maxAmount) where.amount = { [Op.between]: [minAmount, maxAmount] };

    const expenses = await Expense.findAll({ where, order: [['date', 'DESC']] });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    next(err);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    await expense.update(req.body);
    res.json(expense);
  } catch (err) {
    next(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    await expense.destroy();
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    next(err);
  }
};
