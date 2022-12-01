const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Please add a date"],
  },
  time: {
    type: String,
    required: [true, "Please add time"],
  },
  amount: {
    type: Number,
    required: [true, "Please add amount"],
  },
  detail: {
    type: String,
    required: [true, "Please add detail"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
