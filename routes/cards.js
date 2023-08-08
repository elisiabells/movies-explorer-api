const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { cardValidation, cardIDValidation } = require('../middlewares/validations');

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.delete('/:cardId', cardIDValidation, deleteCard);
router.put('/:cardId/likes', cardIDValidation, likeCard);
router.delete('/:cardId/likes', cardIDValidation, dislikeCard);

module.exports = router;
