const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Category = require("../models/Category");

// @desc    Get all categories
// @route   Get /api/categories
// @access  Private
exports.getCategories = asyncHandler(async (req, res, next) => {
  // make sure user is category owner
  if (!req.user) {
    return next(
      new ErrorResponse(`You are not authorized to access this route`, 401)
    );
  }
  res.status(200).json(res.advancedResults);
});

// @desc    Get single category
// @route   Get api/categories/:id
// @access  Private
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  //   if data not found
  if (!category) {
    return next(
      new ErrorResponse(
        `Category not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  // make sure user is category owner
  if (category.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`You are not authorized to access this route`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc    Create Category
// @route   Post api/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  // add user to req.body
  req.body.user = req.user.id;

  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category,
  });
});

// @desc    Update Category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  //   if data not found
  if (!category) {
    return next(
      new ErrorResponse(
        `Category not found with the id of ${req.paramas.id}`,
        400
      )
    );
  }

  // make sure user is category owner
  if (category.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`You are not authorized to access this route`, 401)
    );
  }

  category = await Category.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc      Delete category
// @route     Delete /api/categories/:id
// @access    Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  // if data not found
  if (!category) {
    return next(
      new ErrorResponse(
        `Category not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  // make sure user is category owner
  if (category.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`You are not authorized to access this route`, 401)
    );
  }

  category.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
