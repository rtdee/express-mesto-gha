const Card = require('../models/card');

module.exports.getCards = (_req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Не удалось получить карточки' }));
};

module.exports.postCard = (req, res) => {
  const {
    name, link,
  } = req.body;

  Card.create({
    name, link,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Неизвестная ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.deleteOne(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена` });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Неизвестная ошибка' });
      }
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена` });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Неизвестная ошибка' });
      }
    });
};

module.exports.deleteLike = (req, res) => {
  Card.updateOne(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена` });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'Неизвестная ошибка' });
      }
    });
};
