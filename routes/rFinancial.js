const express = require('express');
const router = express.Router();
const controller = require('../controllers/cFinancial');
const { verifyJWT } = require('../middlewares/mdAuthentication');
const { isAuthorised } = require('../middlewares/mdAuthorisation');

// CRUD Router / Financial
router.get('/byunitno/:unitno', verifyJWT, isAuthorised, controller.getFinancialIdByNo);
router.get('/', verifyJWT, isAuthorised, controller.getFinancials);
router.get('/:id', verifyJWT, isAuthorised, controller.getFinancialByIdNo);
router.put('/:id', verifyJWT, isAuthorised, controller.updateFinancial);

module.exports = router;