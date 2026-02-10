const express = require('express');
const router = express.Router();
const controller = require('../controllers/cVisitor');
const { verifyJWT } = require('../middlewares/mdAuthentication');
const { isAuthorised } = require('../middlewares/mdAuthorisation');

// CRUD Router / Visitor
router.get('/byunitno/:unitno', verifyJWT, isAuthorised, controller.getVisitorIdByNo);
router.get('/', verifyJWT, isAuthorised, controller.getVisitors);
router.get('/:id', verifyJWT, isAuthorised, controller.getVisitorById);
router.post('/', verifyJWT, isAuthorised, controller.createVisitor);
router.put('/:id', verifyJWT, isAuthorised, controller.updateVisitor);
router.delete('/cleanup', verifyJWT, isAuthorised, controller.deletePastVisitors);
router.delete('/:id', verifyJWT, isAuthorised, controller.deleteVisitor);

module.exports = router;