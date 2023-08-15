const Movie = require('../models/movie');
const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const NotUnique = require('../utils/errors/NotUnique');

// Получение всех фильмов текущего пользователя
exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.status(200).send(movies);
  } catch (error) {
    if (error instanceof NotFound) {
      next(error);
    } else {
      next(new NotFound('Фильмы не найдены'));
    }
  }
};

// Создание нового фильма
exports.createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });

    res.status(201).send(movie);
  } catch (error) {
    if (error instanceof NotFound || error instanceof BadRequest || error instanceof NotUnique) {
      next(error);
    } else if (error.name === 'MongoError' && error.code === 11000) {
      next(new NotUnique('Такой фильм уже существует'));
    } else if (error.name === 'ValidationError') {
      next(new BadRequest('Ошибка валидации данных'));
    } else {
      next(new BadRequest('Неизвестная ошибка'));
    }
  }
};

// Удаление фильма по ID
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!movie) {
      throw new NotFound('Фильм не найден или у Вас нет прав на удаление этого фильма');
    }

    res.status(200).send({ message: 'Фильм успешно удален' });
  } catch (error) {
    if (error instanceof NotFound) {
      next(error);
    } else if (error.name === 'CastError') {
      next(new BadRequest('Неверный формат ID'));
    } else {
      next(new BadRequest('Неизвестная ошибка'));
    }
  }
};
