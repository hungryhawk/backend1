const express = require('express');
const router = express.Router();

const { getBlocks } = require('../controllers/blockController');
const requireAuth = require('../middleware/checkAuth');

router.get('/blocks', requireAuth, getBlocks);

module.exports = router;
