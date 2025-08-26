const express = require('express');
const router = express.Router();
const { searchNews } = require('../controllers/newsController.js');
const fetchHeadLines = require('../controllers/headlinesController.js')
router.get('/search', searchNews);
router.get('/headlines', fetchHeadLines);
module.exports = router;
