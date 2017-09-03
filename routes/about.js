/**
 * Created by admin on 2015/10/31.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('about', {});
});

module.exports = router;