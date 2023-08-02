// eslint-disable-next-line no-unused-vars
module.exports.errorHandler = (err, _req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
  res.status(err.statusCode).send({ message: err.message });
};
