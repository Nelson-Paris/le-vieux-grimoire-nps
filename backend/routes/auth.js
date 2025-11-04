const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth');
const auth = require('../middleware/auth');

router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);
// test pour voir tout les users à delete suprression avant mise en production
router.get('/all', ctrl.getAllu);
router.delete('/:id', ctrl.removeUser);

module.exports = router;