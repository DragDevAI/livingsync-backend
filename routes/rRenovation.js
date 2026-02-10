const express = require('express');
const router = express.Router();
const controller = require('../controllers/cRenovation');
const { verifyJWT } = require('../middlewares/mdAuthentication');
const { isAuthorised } = require('../middlewares/mdAuthorisation');

// CRUD Router / Renovation
router.get('/byunitno/:unitno', verifyJWT, isAuthorised, controller.getRenovationIdByNo);
router.get('/', verifyJWT, isAuthorised, controller.getRenovations);
router.get('/:id', verifyJWT, isAuthorised, controller.getRenovationById);
router.post('/', verifyJWT, isAuthorised, controller.createRenovation);
router.delete('/cleanup', verifyJWT, isAuthorised, controller.deletePastRenovations);
router.delete('/:id', verifyJWT, isAuthorised, controller.deleteRenovation);

module.exports = router;