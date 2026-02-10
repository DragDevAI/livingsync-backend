const express = require('express');
const router = express.Router();
const controller = require('../controllers/cCar');
const { verifyJWT } = require('../middlewares/mdAuthentication');
const { isAuthorised } = require('../middlewares/mdAuthorisation');

// CRUD Router / Car
router.get('/byunitno/:unitno', verifyJWT, isAuthorised, controller.getCarsByUnit);
router.get('/', verifyJWT, isAuthorised, controller.getCars);
//router.get('/:id', verifyJWT, isAuthorised, controller.getCarByIdNo);
router.post('/', verifyJWT, isAuthorised, controller.createCar);
router.put('/:id', verifyJWT, isAuthorised, controller.updateCar);
router.delete('/:id', verifyJWT, isAuthorised, controller.deleteCar);

module.exports = router;