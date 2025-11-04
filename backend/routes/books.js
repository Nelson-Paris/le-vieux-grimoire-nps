const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// publique
router.get('/', ctrl.getAll);
router.get('/bestrating', ctrl.getBest);  
router.get('/:id', ctrl.getOne);

// protégées
router.post('/', auth, multer, ctrl.create);
router.put('/:id', auth, multer, ctrl.update);
router.delete('/:id', auth, ctrl.remove);

// protégée
router.post('/:id/rating', auth, ctrl.rate);

module.exports = router;