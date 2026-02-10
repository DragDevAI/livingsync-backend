const express = require('express');
const router = express.Router();
const controller = require('../controllers/cDocument');
const { verifyJWT } = require('../middlewares/mdAuthentication');
const { isAuthorised } = require('../middlewares/mdAuthorisation');

// CRUD Router / Document
router.get('/', verifyJWT, isAuthorised, controller.getDocuments);

module.exports = router;