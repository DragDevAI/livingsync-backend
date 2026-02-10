const express = require('express');
const router = express.Router();
const controller = require('../controllers/cReport');
const { verifyJWT } = require('../middlewares/mdAuthentication');
const { isAuthorised } = require('../middlewares/mdAuthorisation');

// CRUD Router / Report
router.get('/byunitno/:unitno', verifyJWT, isAuthorised, controller.getReportIdByNo);
router.get('/', verifyJWT, isAuthorised, controller.getReports);
router.get('/:id', verifyJWT, isAuthorised, controller.getReportById);
router.post('/', verifyJWT, isAuthorised, controller.createReport);
router.put('/:id', verifyJWT, isAuthorised, controller.updateReport);
router.delete('/cleanup', verifyJWT, isAuthorised, controller.deletePastReports);
router.delete('/:id', verifyJWT, isAuthorised, controller.deleteReport);

module.exports = router;