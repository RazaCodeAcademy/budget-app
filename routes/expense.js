const express = require("express");

const {
  getExpenses,
  getExpense,
  addExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expense");

const Expense = require("../models/Expense");

// include other resource routers
const userRouter = require("./auth");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(protect, advancedResults(Expense, "category user"), getExpenses)
  .post(protect, addExpense);

router
  .route("/:id")
  .get(protect, getExpense)
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

module.exports = router;
