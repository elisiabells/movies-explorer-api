const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'some-default-secret';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send({ message: 'Требуется авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Требуется авторизация' });
  }

  req.user = payload;

  return next();
};
