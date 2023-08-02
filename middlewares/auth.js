const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
  const { token } = req.signedCookies;
  if (!token) {
    res.status(401).send({ message: 'Требуется авторизация' });
  }
  let payload;
  try {
    payload = jwt.verify(token);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).send({ message: 'Требуется авторизация' });
  }
};
