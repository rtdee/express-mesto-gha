const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { createUser } = require('./controllers/user');
const { login } = require('./controllers/login');
const auth = require('./middlewares/auth');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(DB_URL);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

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

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
