const joi = require('joi');

const createUserSchema = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  email: joi
    .string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }),
  password: joi.string().required().min(8),
  passwordConfirm: joi.string().required().valid(joi.ref('password')),
});

exports.validateCreateUser = (req, res, next) => {
    try {
      const { error } = createUserSchema.validate(req.body);
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }
      next();
    } catch (err) {
      res.status(401).json({ status: 'Failed', message: err.message });
    }
};

const updateUserSchema = joi.object({
  first_name: joi.string().optional(),
  last_name: joi.string().optional(),
});

exports.validateUpdateUser = (req, res, next) => {
    try {
      const { error } = updateUserSchema.validate(req.body);
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }
      next();
    } catch (err) {
      res.status(401).json({ status: 'Failed', message: err.message });
    }
    };


const changePasswordSchema = joi.object({
  password: joi.string().required().min(10),
  passwordConfirm: joi.string().required().valid(joi.ref('password')),
});

exports.validateChangePassword = (req, res, next) => {
    try {
      const { error } = changePasswordSchema.validate(req.body);
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }
      next();
    } catch (err) {
      res.status(401).json({ status: 'Failed', message: err.message });
    }
};

const loginSchema = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } })
    .required(),
  password: joi.string().required(),
});

exports.validateLogin = (req, res, next) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }
      next();
    } catch (err) {
      res.status(401).json({ status: 'Failed', message: err.message });
    }
};
