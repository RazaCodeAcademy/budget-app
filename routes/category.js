const express = require("express");

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

const Category = require("../models/Category");

const router = express.Router();

const advancedResulsts = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(protect, advancedResulsts(Category, "user"), getCategories)
  .post(protect, createCategory);

router
  .route("/:id")
  .get(protect, getCategory)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
