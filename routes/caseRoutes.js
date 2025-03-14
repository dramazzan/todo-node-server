const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, caseController.createCase);
router.get('/all', caseController.getAllCases)
router.put('/update/:id', authMiddleware, caseController.updateCase);
router.delete('/delete/:id', authMiddleware, caseController.deleteCase);
router.get('/case/:id',  caseController.getCaseInfo)
router.get('/search' , caseController.searchCases)

module.exports = router;