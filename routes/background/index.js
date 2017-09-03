var express = require('express');
var router = express.Router();
var _root = 'background/';
/**
 * 权限控制
 */
router.all('/*', function (req, res, next) {
    //判断seeion是否已经有过权限
    //1.有,直接通过
    //2.没有.跳转到登录页面
    //console.log(req.path);
    if ('/login' == req.path) {
        next();
    } else {
        var limits = req.session.limits;
        if (limits && '0' == limits) {
            next();
        } else {
            res.render(_root+"login", {});
        }
    }
});
/**
 * 登录页面
 */
router.all('/', function (req, res, next) {
    res.render(_root+"login", {});
});

/**
 * 验证登录
 */
router.post('/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if (username == 'lehoo' && password == "juxinkeji") {
        req.session.limits = "0";
        res.redirect("/" +_root+ 'index');
    } else {
        res.send("账号密码有错误!!~~");
    }
});

router.all('/index', function (req, res, next) {
    res.render(_root + "index", {});
});

module.exports = router;
