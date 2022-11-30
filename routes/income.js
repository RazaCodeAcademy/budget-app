const express = require("express");

const {
  getIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} = require("../controllers/income");

const Income = require("../models/Income");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(protect, advancedResults(Income, "user"), getIncomes)
  .post(protect, createIncome);

router
  .route("/:id")
  .get(protect, getIncome)
  .put(protect, updateIncome)
  .delete(protect, deleteIncome);

module.exports = router;
