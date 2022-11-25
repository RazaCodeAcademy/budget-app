const express = require("express");

const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  forgotPassword,
  resetPassword,
  updatePassword,
  emailVerification,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router
  .post("/register", register)
  .post("/login", login)
  .get("/logout", logout)
  .get("/me", protect, getMe)
  .put("/update-details", protect, updateDetails)
  .post("/forgot-password", forgotPassword)
  .put("/reset-password/:resetToken", resetPassword)
  .post("/update-password", protect, updatePassword)
  .put("/email-verification/:verifiedToken", emailVerification);

module.exports = router;
