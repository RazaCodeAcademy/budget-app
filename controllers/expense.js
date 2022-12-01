const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Expense = require("../models/Expense");

// @desc    Get all expenses
// @route   Get /api/expenses
// @access  Private
exports.getExpenses = asyncHandler(async (req, res, next) => {
  // make sure user is expense owner
  if (!req.user.id) {
    return next(
      new ErrorResponse("You are not authorized to access this route", 401)
    );
  }

  res.status(200).json(res.advancedResults);
});

// @desc    Get single expense
// @route   Get /api/expenses/:id
// @access  Private
exports.getExpense = asyncHandler(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  // if data not found
  if (!expense) {
    return next(
      new ErrorResponse(`Expense not found with id of ${req.params.id}`, 404)
    );
  }

  // make sure user is expense owner
  if (expense.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("You are not authorized to access this route", 401)
    );
  }

  res.status(200).json({
    success: true,
    data: expense,
  });
});

// @desc    Add expense
// @route   Post /api/expenses
// @access  Private
exports.addExpense = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.category = req.body.category_id;

  const expense = await Expense.create(req.body);

  res.status(201).json({
    success: true,
    data: expense,
  });
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = asyncHandler(async (req, res, next) => {
  let expense = await Expense.findById(req.params.id);

  req.body.category = req.body.category_id;

  // if data not found
  if (!expense) {
    return next(
      new ErrorResponse(
        `Expense not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  // make sure user is expense owner
  if (expense.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("You are not authorized to access this route", 401)
    );
  }

  expense = await Expense.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: expense,
  });
});

// @desc    Delete expense
// @route   Delete /api/expenses/:id
// @access  Private
exports.deleteExpense = asyncHandler(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  // if data not found
  if (!expense) {
    return next(
      new ErrorResponse(
        `Expense not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  // make sure user is expense owner
  if (expense.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("You are not authorized to access the route", 401)
    );
  }

  expense.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
