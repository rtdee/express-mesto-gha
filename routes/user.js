const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateUser, updateAvatar, getUserMe,
} = require('../controllers/user');

router.get('/users', getUsers);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum(),
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
    avatar: Joi.string() // eslint-disable-next-line no-useless-escape
      .regex(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), updateAvatar);
router.get('users/me', getUserMe);

module.exports = router;
