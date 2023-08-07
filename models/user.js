const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/unauthorized');
const regexUrl = require('../utils/regexUrl');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minLength: [2, 'Минимум 2 знака'],
    maxLength: [30, 'Максимум 30 знаков'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minLength: [2, 'Минимум 2 знака'],
    maxLength: [30, 'Максимум 30 знаков'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      // eslint-disable-next-line arrow-body-style
      validator: (v) => {
        return regexUrl.test(v);
      },
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: [true, 'Поле обязательно к заполнению'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный Email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле обязательно к заполнению'],
    select: false,
  },
}, { versionKey: false });

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверные почта или пароль');
          }

          return user;
        })
        .catch(next);
    });
};

module.exports = mongoose.model('user', userSchema);
