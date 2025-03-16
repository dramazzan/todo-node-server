const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/update', authMiddleware ,userController.updateUser);
router.delete('/delete' , authMiddleware , userController.deleteUser)
router.get('/dashboard' , authMiddleware , userController.getUserData)



module.exports = router;