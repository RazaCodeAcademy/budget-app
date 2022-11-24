const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { access } = require("fs");

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return next(
      new ErrorResponse("Password does not match with confirmation", 400)
    );
  }

  // create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // create token
  const token = user.getSignedJwtToken();

  //   get verifiedToken
  const verifiedToken = user.getVerificationToken();
  await user.save({ validateBeforeSave: false });

  //   create verified token url
  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/email-verification/${verifiedToken}`;

  const message = `You are receiving this email because you (or someone elese) has requested for email verification.
    Please make a PUT request to: \n\n ${verificationUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Email Verification",
      message,
    });

    res.status(200).json({
      success: true,
      message: "User registerd and email for verification sent successfuly!",
      token: token,
    });
  } catch (err) {
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc    Verified User
// @route   PUT /api/auth/email-verification/:verifiedToken
// @access  Public
exports.emailVerification = asyncHandler(async (req, res, next) => {
  // get hased token
  const verificationToken = crypto
    .createHash("sha256")
    .update(req.params.verifiedToken)
    .digest("hex");

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  //   set verifiedAt
  user.verifiedAt = Date.now();
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfuly!",
  });
});

// @desc    Login user
// @route   Post /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // check for user
  const user = await User.findOne({ email: email }).select("+password");

  // if email not available
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // check if password matches
  const isMatch = await user.matchPassword(password.toString());

  // if password does not match
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Logout user / clear cookie
// @route   Get /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// get token from model, create cokie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // create token 
  const token = user.getSignedJwtToken();

  const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
      options.secure = true;
  };

  res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token: token
  });
}
