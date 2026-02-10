const express = require('express');
const router = express.Router();
const controller = require('../controllers/cBBQ');
const { verifyJWT } = require('../middlewares/mdAuthentication');
const { isAuthorised } = require('../middlewares/mdAuthorisation');

// CRUD Router / BBQ
router.get('/byunitno/:unitno', verifyJWT, isAuthorised, controller.getBBQIdByNo);
router.get('/', verifyJWT, isAuthorised, controller.getBBQs);
router.get('/:id', verifyJWT, isAuthorised, controller.getBBQById);
router.post('/', verifyJWT, isAuthorised, controller.createBBQ);
router.delete('/cleanup', verifyJWT, isAuthorised, controller.deletePastBBQs);
router.delete('/:id', verifyJWT, isAuthorised, controller.deleteBBQ);

module.exports = router;