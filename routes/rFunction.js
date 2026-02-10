const express = require('express');
const router = express.Router();
const controller = require('../controllers/cFunction');
const { verifyJWT } = require('../middlewares/mdAuthentication');
const { isAuthorised } = require('../middlewares/mdAuthorisation');

// CRUD Router / Function
router.get('/byunitno/:unitno', verifyJWT, isAuthorised, controller.getFunctionIdByNo);
router.get('/', verifyJWT, isAuthorised, controller.getFunctions);
router.get('/:id', verifyJWT, isAuthorised, controller.getFunctionById);
router.post('/', verifyJWT, isAuthorised, controller.createFunction);
router.delete('/cleanup', verifyJWT, isAuthorised, controller.deletePastFunctions);
router.delete('/:id', verifyJWT, isAuthorised, controller.deleteFunction);

module.exports = router;