const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, postCard, deleteCard, putLike, deleteLike,
} = require('../controllers/card');

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}), postCard);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }),
}), deleteCard);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }),
}), putLike);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }),
}), deleteLike);

module.exports = router;
