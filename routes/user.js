const express = require('express');

const router = express.Router();
const { getCurrentUser, updateUser } = require('../controllers/user');
const { userProfileUpdateValidation } = require('../middlewares/validate');

router.get('/me', getCurrentUser);
router.patch('/me', userProfileUpdateValidation, updateUser);

module.exports = router;
