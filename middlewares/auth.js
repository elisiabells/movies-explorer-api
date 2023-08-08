const jwt = require('jsonwebtoken');
const ErrorAccess = require('../utils/errors/ErrorAccess');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ErrorAccess('Необходима авторизация'));
  }

  const token = authHeader.split(' ')[1];

  const { NODE_ENV, JWT_SECRET } = process.env;
  const SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return next(new ErrorAccess('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
