const bcrypt = require('bcrypt');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const InternalServerError = require('../errors/internal-server');

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
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFoundError(`Пользователь с ID ${req.params.userId} не найден`);
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      next();
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      next();
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.updateOne(req.user._id, { name, about })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      next();
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.updateOne(req.user._id, { avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      next();
    });
};

module.exports.getUserMe = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email })
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFoundError(`Пользователь с email ${email} не найден`);
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      next();
    });
};
