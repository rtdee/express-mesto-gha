const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const ForbiddenError = require('../errors/forbidden');

module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.postCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Введены некорректные данные');
      }
      res.status(201).send({ card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new BadRequestError('Введены некорректные данные'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет доступа');
      }
      if (!card) {
        throw new NotFoundError(`Карточка с ID ${req.params.cardId} не найдена`);
      }
      card.deleteOne(card)
        .then(res.send({ card }));
    })
    .catch(next);
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new BadRequestError('Введены некорректные данные'))
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с ID ${req.params.cardId} не найдена`);
      }
      res.send({ card });
    })
    .catch(next);
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new BadRequestError('Введены некорректные данные'))
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с ID ${req.params.cardId} не найдена`);
      }
      res.send({ card });
    })
    .catch(next);
};
