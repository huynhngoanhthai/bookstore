const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../constants");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: [3, "Must be at least 3 characters "],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "Must be at least 6 character"],
      maxlength: [30, "Must be less than 30 character"],
    },

    role: {
      type: String,
      // obj -> Array[values] of roles
      enum: {
        values: Object.values(ROLES),
        message: "bad role value",
      },
      default: ROLES.GUEST,
    },
    age: {
      type: Number,
    },
    books: [String],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    collection: "nd-users",
    timestamps: true,
  }
);

//hashPassword in update, b/c when hash and update psw.length > 30,so we need pre save isModified
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync();
    const hashPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashPassword;
    next();
  }
  next();
});
// userSchema.pre("save", function (next) {
//   if (this.isModified("password") || this.isNew) return next();
//   this.passwordChangedAt = Date.now();
//   next();
// });
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const Users = mongoose.model("users", userSchema);
module.exports = Users;
