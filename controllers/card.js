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

  Card.create(req.user._id, {
    name, link,
  })
    .then((card) => {
      res.status(201).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.deleteOne(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => {
      if (card) {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена` });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => {
      if (card) {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена` });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteLike = (req, res) => {
  Card.updateOne(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => {
      if (card) {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена` });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
