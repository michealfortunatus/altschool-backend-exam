const User = require('../models/userModel');
const JWT = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    if (!newUser) return new Error('user not created');
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(401).json({ status: 'Failed', message: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return new Error('Please, provide a valid Email, Password');
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return new Error('Please, provide a valid Email, Password');
    }
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(401).json({ status: 'Failed', message: err.message });
  }
};
exports.protect = async (req, res, next) => {
  try {
    if (
      !req.headers ||
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer')
    ) {
      return new Error('Please, provide token');
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
    if (!decoded) return new Error('Please, provide token');
    const user = await User.findById(decoded.id);
    if (!user) {
      return new Error('Please, provide token');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ status: 'Failed', message: err.message });
  }
};
