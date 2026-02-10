const express = require('express');
const router = express.Router();
const controller = require('../controllers/cUnit');
const { verifyJWT } = require('../middlewares/mdAuthentication');
const { isAuthorised } = require('../middlewares/mdAuthorisation');

// CRUD Router / Unit
router.get('/byunitno/:unitno', verifyJWT, isAuthorised, controller.getUnitIdByNo);
router.get('/', verifyJWT, isAuthorised, controller.getUnits);
router.get('/:id', verifyJWT, isAuthorised, controller.getUnitByIdNo);

module.exports = router;