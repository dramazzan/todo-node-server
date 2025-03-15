const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/permissions");
const userController = require("../controllers/userController");


const router = express.Router();

router.delete('/delete/:id', authMiddleware, isAdmin, adminController.deleteUser)
router.get('/users', authMiddleware, isAdmin, adminController.getUserList)
router.get('/user/:id', authMiddleware, isAdmin, adminController.getUserById)
router.post('/user/get_by_login', authMiddleware, isAdmin, adminController.getUserByLogin);
router.post('/user/get_by_email', authMiddleware, isAdmin, adminController.getUserByEmail);


module.exports = router;