const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');
const { signup, signin, signout } = require('../controllers/user');
const userRouter = require('./user');
const movieRouter = require('./movie');
const NotFound = require('../utils/errors/NotFound');
const { userRegistrationValidation, userLoginValidation } = require('../middlewares/validate');

router.post('/signup', userRegistrationValidation, signup);
router.post('/signin', userLoginValidation, signin);

router.post('/signout', signout);
router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

module.exports = router;
