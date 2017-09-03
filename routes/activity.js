/**
 * Created by admin on 2015/11/2.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('activity', {});
});

module.exports = router;
