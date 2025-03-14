const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

router.post('/create', caseController.createCase);
router.get('/all', caseController.getAllCases)
router.put('/update/:id', caseController.updateCase);
router.delete('/delete/:id', caseController.deleteCase);
router.get('/case/:id', caseController.getCaseInfo)

module.exports = router;