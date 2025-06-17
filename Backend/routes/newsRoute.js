const express = require('express');
const router = express.Router();
const { searchNews } = require('../controllers/newsController');

router.get('/search', searchNews);

module.exports = router;
