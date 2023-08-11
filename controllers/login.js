const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверные почта или пароль');
      }
      const token = jwt.sign({ _id: user._id }, 'secretkey', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
