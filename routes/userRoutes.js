const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/all', userController.getUsers)
router.get('/user/:id', userController.getUserById)
router.post('/user/get_by_login', userController.getUserByLogin);
router.post('/user/get_by_email', userController.getUserByEmail);

module.exports = router;