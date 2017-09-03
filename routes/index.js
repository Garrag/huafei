var express = require('express');
var router = express.Router();
// var mysql = require('./dao/mysql.js');

router.all('/', function(req, res, next) {
    var data = {};
    res.render('index', data);
});

/**
 * 获取新闻内容
 */
router.get('/news', function(req, res, next) {
    var data = {};
    res.render('item/news', data);
});


module.exports = router;