const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/permissions");


const router = express.Router();

router.delete('/delete/:id', authMiddleware, isAdmin, adminController.deleteUser)
router.get('/users', authMiddleware, isAdmin, adminController.getUserList)


module.exports = router;