var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {
    var data = {};
    res.render('index', data);
});

router.all('/product_info', function(req, res, next) {
    var data = {};
    res.render('product_info', data);
});


module.exports = router;