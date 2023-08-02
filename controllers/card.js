const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const UnauthorizedError = require('../errors/unauthorized');

module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.postCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;

  Card.create(req.user._id, {
    name, link,
  })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Введены некорректные данные');
      }
      res.status(201).send({ card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.deleteOne(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => {
      if (card.owner._id !== req.params.userId) {
        throw new UnauthorizedError('Нет доступа');
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFoundError(`Карточка с ID ${req.params.cardId} не найдена`);
      } else if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      next();
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => {
      if (card) {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFoundError(`Карточка с ID ${req.params.cardId} не найдена`);
      } else if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      next();
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.updateOne(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => {
      if (card) {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFoundError(`Карточка с ID ${req.params.cardId} не найдена`);
      } else if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      next();
    });
};
