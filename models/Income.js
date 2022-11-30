const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema({
  detail: {
    type: String,
    required: [true, "Please add detail"],
  },
  amount: {
    type: Number,
    required: [true, "Please add amount"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Income", IncomeSchema);
