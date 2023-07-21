const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'Минимум 2 знака'],
    maxLength: [30, 'Максимум 30 знаков'],
    required: [true, 'Поле обязательно к заполнению'],
  },
  about: {
    type: String,
    minLength: [2, 'Минимум 2 знака'],
    maxLength: [30, 'Максимум 30 знаков'],
    required: [true, 'Поле обязательно к заполнению'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле обязательно к заполнению'],
    validate: {
      validator: (v) => validator.isUrl(v),
      message: 'Некорректный URL',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
