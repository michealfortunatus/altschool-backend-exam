const User = require('../models/userModel');
const APIFeatures = require('../utils/APIFeatures');

exports.getAllUsers = async (req, res, next) => {
    try {
      const features = new APIFeatures(User.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const users = await features.query;
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users,
        },
      });
    } catch (err) {
      res.status(401).json({ status: 'Failed', message: err.message });
    }
}

exports.getUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).populate('blogs');
      if (!user) return next(new AppError('User not found', 404));
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
      res.status(401).json({ status: 'Failed', message: err.message });
    }
};
