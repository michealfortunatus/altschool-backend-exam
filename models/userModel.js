const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, 'Enter your first name'],
    },
    last_name: {
      type: String,
      required: [true, 'Enter your last name'],
    },
    email: {
      type: String,
      required: [true, 'Enter your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Enter a password'],
      minlength: [
        10,
        'A user password must have more or equal to 10 characters',
      ],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'User must Confirm their password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords do not match!',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema.virtual("blogs", {
  ref: "Blog",
  foreignField: "author",
  localField: "_id",
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 14);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  myPassword,
  userPassword
) {
  return await bcrypt.compare(myPassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);
