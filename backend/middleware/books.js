const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/books');
const auth = require('../middleware/auth');

// lecture publique
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

// écritures protégées
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;