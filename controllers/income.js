const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Income = require("../models/Income");

// @desc    Get all incomes
// @route   Get /api/incomes
// @access  Private
exports.getIncomes = asyncHandler(async (req, res, next) => {
  // make sure user is category owner
  if (!req.user) {
    return next(
      new ErrorResponse(`You are not authorized to access this route`, 401)
    );
  }

  res.status(200).json(res.advancedResults);
});

// @desc    Get single income
// @route   Get /api/incomes/:id
// @access  Private
exports.getIncome = asyncHandler(async (req, res, next) => {
  const income = await Income.findById(req.params.id);

  // if not data not found
  if (!income) {
    return next(
      new ErrorResponse(`Income not found with id of ${req.params.id}`, 404)
    );
  }

  // make sure user is income owner
  if (income.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("You are not authorized to access the route", 401)
    );
  }

  res.status(200).json({
    success: true,
    data: income,
  });
});

// @desc    Create income
// @route   Post /api/incomes
// @access  Private
exports.createIncome = asyncHandler(async (req, res, next) => {
  // add user to req.body
  req.body.user = req.user.id;

  const income = await Income.create(req.body);

  res.status(201).json({
    success: true,
    data: income,
  });
});

// @desc    Update income
// @route   PUT /api/incomes/:id
// @access  Private
exports.updateIncome = asyncHandler(async (req, res, next) => {
  let income = await Income.findById(req.params.id);

  // if data not found
  if (!income) {
    return next(
      new ErrorResponse(`Income not found with the id of ${req.params.id}`, 404)
    );
  }

  // make sure user is income owner
  if (income.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("You are not authorized to access this route", 401)
    );
  }

  income = await Income.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: income,
  });
});

// @desc    Delete Income
// @route   Delete /api/incomes/:id
// @access  Private
exports.deleteIncome = asyncHandler(async (req, res, next) => {
  const income = await Income.findById(req.params.id);

  // if data not found
  if (!income) {
    return next(
      new ErrorResponse(`Income not found with the id of ${req.params.id}`, 404)
    );
  }

  // make sure user is income owner
  if (income.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("You are not authorized to access this route", 401)
    );
  }

  income.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
