const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const jwt = require('jsonwebtoken');
const { createUser } = require('./controllers/user');
const { login } = require('./controllers/login');
const UnauthorizedError = require('./errors/unauthorized');
const NotFoundError = require('./errors/not-found');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(DB_URL);

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res, next) => {
  const { token } = req.signedCookies;
  if (!token) {
    throw new UnauthorizedError('Требуется авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).send({ message: 'Требуется авторизация' });
  }
});

app.use('/', require('./routes/user'));
app.use('/', require('./routes/card'));

app.get('/', (req, res) => {
  res.send(req.query);
});

app.all('*', (_req, res, next) => {
  next(new NotFoundError('Не существует'));
});

app.use(errors());
app.use((err, _req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
