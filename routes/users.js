const router = require('express').Router();
const {
  getUsers, getCurrentUser, getUserById, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');
const { userValidation, userIDValidation, userAvatarValidation } = require('../middlewares/validations');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', userIDValidation, getUserById);
router.patch('/me', userValidation, updateUserInfo);
router.patch('/me/avatar', userAvatarValidation, updateUserAvatar);

module.exports = router;
