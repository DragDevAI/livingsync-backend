const express = require('express');
const router = express.Router();
const controller = require('../controllers/cAccount');
const { verifyJWT } = require('../middlewares/mdAuthentication');
const { isAuthorised } = require('../middlewares/mdAuthorisation');

// CRUD Router / Account
router.get('/', verifyJWT, isAuthorised, controller.getAccounts);
router.get('/:id', verifyJWT, isAuthorised, controller.getAccountByIdNo);
router.put('/:id', verifyJWT, isAuthorised, controller.updateAccount);
router.delete('/:id', verifyJWT, isAuthorised, controller.deleteAccount);
router.post('/signup', controller.createAccount);
router.post('/login', controller.login);
// Route to allow account holders having more than one unit to switch between them
router.post('/switch-unit', verifyJWT, controller.switchUnit);

module.exports = router;