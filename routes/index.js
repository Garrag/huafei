var express = require('express');
var router = express.Router();
var path = require("path")
var fs = require('fs');
var mysql = require('./dao/mysql');


String.prototype.replaceAll = function (FindText, RepText) {
    regExp = new RegExp(FindText, "g");
    return this.replace(regExp, RepText);
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.trimSpace = function () {
    return this.replace(/&#10;/g, "");
}

//分成4个对象
var splitFun = function (newJson, type) {
    var list1 = []
    var list2 = []
    var list3 = []
    var list4 = []
    for (var i = 0; i < newJson.length; i += 4) {
        var element1 = newJson[i];
        var element2 = newJson[i + 1];
        var element3 = newJson[i + 2];
        var element4 = newJson[i + 3];
        if (element1) {
            list1.push(element1)
        }
        if (element2) {
            list2.push(element2)
        }
        if (element3) {
            list3.push(element3)
        }
        if (element4) {
            list4.push(element4)
        }
    }
    var listData = {
        list1: list1,
        list2: list2,
        list3: list3,
        list4: list4
    }
    return listData
}

//首页
router.all('/', function (req, res, next) {
    mysql.query("select * from products where home = 1", function (err, rs) {
        res.render('home', {
            listData: rs
        });
    });
});
//对应产品页面
router.all('/product', function (req, res, next) {
    var type = req.query.index || 1;
    mysql.escapingQuery("select * from products where type = ?", [type], function (err, rs) {
        var listData = splitFun(rs, type)
        res.render('index', listData);
    });
});
//产品信息页面
router.all('/product_info', function (req, res, next) {
    var id = req.query.id || 0;
    mysql.escapingQuery("select * from products where id = ?", [id], function (err, rs) {
        // console.log(rs[0]);
        var data = {
            infoData: rs[0]
        };
        res.render('product_info', data);
    });
});
//关于页面
router.all('/about', function (req, res, next) {
    res.render('about', {});
});
//合作伙伴页面
router.all('/hzhb', function (req, res, next) {
    res.render('hzhb', {});
});

module.exports = router;