const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized');

module.exports.login = (req, res, next) => {
  const { email } = req.body;

  return User.findUserByCredentials({ email }.select('+password'))
    .orFail(new UnauthorizedError('Неверные почта или пароль'))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secretkey', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).end();
    })
    .catch(next);
};
