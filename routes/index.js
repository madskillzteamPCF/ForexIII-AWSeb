'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function (req, res) {
    req.query;
    res.render('index', { title: 'Madskillz Trade Geniuses' });
});

module.exports = router;
