const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../utils/errors/BadRequest');
const ErrorAccess = require('../utils/errors/ErrorAccess');
const NotFound = require('../utils/errors/NotFound');

// Получение информации о текущем пользователе
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      throw new NotFound('Пользователь не найден');
    }
    res.status(200).send(user);
  } catch (error) {
    if (error instanceof NotFound) {
      next(error);
    } else {
      next(new NotFound('Ошибка при поиске пользователя'));
    }
  }
};

// Обновление информации о текущем пользователе
exports.updateUser = async (req, res, next) => {
  const { email, name } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.user._id, { email, name }, { new: true }).select('-password');
    if (!user) {
      throw new NotFound('Пользователь не найден');
    }
    res.status(200).send(user);
  } catch (error) {
    if (error instanceof NotFound) {
      next(error);
    } else {
      next(new BadRequest('Ошибка при обновлении данных пользователя'));
    }
  }
};

// Регистрация нового пользователя
exports.signup = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при регистрации:', error);
    if (error instanceof BadRequest) {
      next(error);
    } else if (error.name === 'MongoError' && error.code === 11000) {
      next(new BadRequest('Пользователь с таким email уже существует'));
    } else {
      next(new BadRequest('Ошибка при регистрации пользователя'));
    }
  }
};

// Вход пользователя
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ErrorAccess('Неправильные почта или пароль');
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new ErrorAccess('Неправильные почта или пароль');
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'some-default-secret';
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' }).send({ token });
    res.send({ token });
  } catch (error) {
    if (error instanceof ErrorAccess) {
      next(error);
    } else {
      next(new BadRequest('Ошибка при входе пользователя'));
    }
  }
};
