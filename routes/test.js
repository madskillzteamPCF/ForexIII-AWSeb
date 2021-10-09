'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('./views/test', function (req, res) {
    res.render('responded', { title: 'Madskillz Trade Geniuses' });
    res.json(res.data);
});

module.exports = router;