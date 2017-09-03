/**
 * Created by admin on 2015/10/30.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('这是产品中心');
});


router.get('/water', function (req, res, next) {
    res.render('products/water', {});
});

router.get('/classics', function (req, res, next) {
    res.render('products/classics', {});
});

router.get('/rose', function (req, res, next) {
    res.render('products/rose', {});
});

router.get('/vermilion', function (req, res, next) {
    res.render('products/vermilion', {});
});

router.get('/sedentary', function (req, res, next) {
    res.render('products/sedentary', {});
});


//新详情图片

router.get('/baseWater', function (req, res, next) {
    res.render('products/baseWater', {});
});

router.get('/baseClassics', function (req, res, next) {
    res.render('products/baseClassics', {});
});

router.get('/baseRose', function (req, res, next) {
    res.render('products/baseRose', {});
});

router.get('/baseVermilion', function (req, res, next) {
    res.render('products/baseVermilion', {});
});

router.get('/baseSedentary', function (req, res, next) {
    res.render('products/baseSedentary', {});
});

router.get('/baseWendu', function (req, res, next) {
    res.render('products/baseWendu', {});
});

module.exports = router;
