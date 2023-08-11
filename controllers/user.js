const bcrypt = require('bcrypt');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const InternalServerError = require('../errors/internal-server');
const ConflictError = require('../errors/conflict');

module.exports.getUsers = (_req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new InternalServerError('Не удалось получить список пользователей');
      }
      res.send({ users });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new BadRequestError('Введены некорректные данные'))
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с ID ${req.params.userId} не найден`);
      }
      res.send({ user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
      // eslint-disable-next-line no-param-reassign
        user.password = undefined;
        res.status(201).send({ user });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Пользователь уже существует'));
        }
        next();
      }));
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send({ user }))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .orFail(new BadRequestError('Введены некорректные данные'))
    .then((user) => res.send({ user }))
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email })
    .orFail(new BadRequestError('Введены некорректные данные'))
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с email ${email} не найден`);
      }
      res.send({ user });
    })
    .catch(next);
};
