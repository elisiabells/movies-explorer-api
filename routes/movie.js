const express = require('express');

const router = express.Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { movieCreationValidation, movieDeletionValidation } = require('../middlewares/validate');

router.get('/', getMovies);
router.post('/', movieCreationValidation, createMovie);
router.delete('/:id', movieDeletionValidation, deleteMovie);

module.exports = router;
