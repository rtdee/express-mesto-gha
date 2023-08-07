const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regexUrl = require('../utils/regexUrl');

const {
  getUsers, getUserById, updateUser, updateAvatar, getUserMe,
} = require('../controllers/user');

router.get('/users', getUsers);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .default('Жак-Ив Кусто'),
    about: Joi.string().required().min(2).max(30)
      .default('Исследователь'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), updateUser);
router.patch('users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .regex(regexUrl)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), updateAvatar);
router.get('users/me', getUserMe);

module.exports = router;
