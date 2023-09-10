const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'some-default-secret';

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ message: 'Требуется авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Требуется авторизация' });
  }

  req.user = payload;

  return next();
};
