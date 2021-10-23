const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sign } = require("jsonwebtoken");
const catchAsync = require("../middleware/async");
const Users = require("../models/User");
const Books = require("../models/Book");
const TokenDelete = require("../models/tokenDelete");
const Token = require("../models/Token");
const ApiError = require("../utils/ApiError");
const EmailService = require("../utils/sendEmail");

exports.register = catchAsync(async (req, res) => {
  const { name, email, age, password, role } = req.body;
  const user = await Users.create({
    name,
    email,
    age,
    password,
    role,
  });

  res.json({
    success: true,
    data: user,
  });
  EmailService.sendEmail(email, "Welcome to website", "user@example.com");
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const existedUser = await Users.findOne({ email });
  if (!existedUser) {
    throw new ApiError(403, "email or password wrong");
  }
  const isMatch = bcrypt.compareSync(password, existedUser.password);
  if (!isMatch) {
    throw new ApiError(403, "email or password wrong");
  }
  const token = sign(
    {
      email: existedUser.email,
      password: existedUser.password, //password hashed
      name: existedUser.name,
      role: existedUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.json({
    success: true,
    token: token,
    user: req.user,
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  //1) get user based on the token
  const { olbPassword, password } = req.body;
  if (olbPassword === password)
    throw new ApiError(403, "old password must not be the same password");
  //add password hashed in payload token
  const isMatch = bcrypt.compareSync(olbPassword, req.user.password);
  if (!isMatch) {
    throw new ApiError(403, "password wrong");
  }
  const user = await Users.findOne({ email: req.user.email });
  if (!user) throw new ApiError(404, "not found");
  user.password = password;
  await user.save();
  res.json({
    success: true,
    user: user,
  });
});

// exports.forgotPassword = catchAsync(async (req, res) => {
//   const { email } = req.body;
//   const user = await Users.findOne({ email: email });
//   if (!user)
//     throw new ApiError(404, "there is no user with that email address");
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });
//   const resetURL = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/auth/resetPassword/${resetToken}`;

//   const message = `forgot your password? submit a PATCH request  with your new password  to:${resetURL}.\n`;
//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Your password was reset token (in 10min)",
//       message,
//     });

//     res.json({
//       success: true,
//     });
//   } catch (err) {
//     (user.passwordResetToken = undefined),
//       (user.passwordResetExpires = undefined);
//     await user.save({ validateBeforeSave: false });
//     throw new ApiError(500, "there was an error sending email");
//   }
// });

// exports.resetPasswordToken = catchAsync(async (req, res) => {
//   const token = req.params.token;
//   const { password } = req.body;
//   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
//   const user = await Users.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });
//   if (!user) throw new ApiError(400, "token is invalid or has expired");
//   user.password = password;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();
//   console.log(user);
//   res.json({
//     success: true,
//     user,
//   });
// });

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "email is wrong");
  const user = await Users.findOne({ email });
  if (!user) throw new ApiError(404, "not found email");
  //b/c token will change
  let token = await Token.findOne({ userId: user._id });
  if (token)
    return res
      .status(200)
      .json({ success: true, message: "please check your email" });
  const randomToken = crypto.randomBytes(32).toString("hex");
  //hashedToken
  const hashedToken = bcrypt.hashSync(randomToken, bcrypt.genSaltSync());
  if (!token) {
    token = await new Token({
      userId: user._id,
      token: hashedToken,
    }).save();
  }
  const link = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${user._id}/${randomToken}`;
  console.log(link);
  res.json({ success: true, link: link });
  EmailService.sendEmail(user.email, "Password reset", link);
});

exports.resetPasswordToken = catchAsync(async (req, res) => {
  const { userId, token } = req.params;
  const { password } = req.body;
  // console.log();
  if (!userId || !token) throw new ApiError(400, "invalid link or expired");
  const user = await Users.findById(userId);
  const userToken = await Token.findOne({ userId: user._id });
  if (!userToken || !user) throw new ApiError(400, "invalid link or expired");
  //isMatch
  const isMatch = bcrypt.compareSync(token, userToken.token);
  if (!isMatch) throw new ApiError(400, "invalid link or expired");

  user.password = password;
  // await Promise.all([user.save(), userToken.remove()]);
  const result = await user.save();
  if (result) await userToken.remove();
  res.json({ success: true, message: "password reset successfully" });
});

exports.deleteMe = catchAsync(async (req, res) => {
  const myEmail = req.user.email;
  if (!myEmail) throw new ApiError(401, "invalid signature");
  const user = await Users.findOne({ email: myEmail });

  if (!user) throw new ApiError(404, "not found email");
  //b/c token will change
  let token = await TokenDelete.findOne({ userId: user._id });
  const randomToken = crypto.randomBytes(32).toString("hex");
  if (!token) {
    token = await new TokenDelete({
      userId: user._id,
      token: randomToken,
    }).save();
  }
  // if user forgot email, don't delete
  const link = `${req.protocol}://${req.get("host")}/api/v1/auth/deleteMe/${
    user._id
  }/${randomToken}`;
  EmailService.sendEmail(myEmail, "delete your account", link);
  console.log(link);
  res.json({ success: true, message: "please check your email" });
});

exports.deleteMeById = catchAsync(async (req, res) => {
  const { userId, token } = req.params;
  if (!userId || !token) throw new ApiError(400, "invalid link or expired");
  const user = await Users.findById(userId);
  if (!user) throw new ApiError(400, "invalid link or expired");
  const userToken = await TokenDelete.findOne({
    userId: user._id,
    token: token,
  });
  if (!userToken) throw new ApiError(400, "invalid link or expired");
  await Books.deleteMany({ author: user.email });
  await user.delete();
  await userToken.delete();
  res.json({ success: true, message: "deleted your account" });
});
