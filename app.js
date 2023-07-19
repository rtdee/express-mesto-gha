const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, _res, next) => {
  req.user = {
    _id: '64b6734ade803381037d6f01',
  };
  next();
});

app.use('/', require('./routes/user'));
app.use('/', require('./routes/card'));

app.get('/', (req, res) => {
  res.send(req.query);
});

app.get('*', (_req, res) => {
  res.status(404).send({ message: 'Не существует' });
});
app.patch('*', (_req, res) => {
  res.status(404).send({ message: 'Не существует' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
