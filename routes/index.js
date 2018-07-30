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
//获取基本数据
let getHtmlData = (callback = () => {}) => {
    mysql.query("select * from base_info where id = 0", function (err, rs) {
        let base_info = rs[0];
        base_info.infoArr = base_info.info.split('。');
        base_info.contactArr = base_info.contact.split('|');
        base_info.about = base_info.about.split('|');
        mysql.query("select * from product_type", function (err, rs) {
            base_info.typesArr = rs;
            mysql.query("select * from products where home = 1", function (err, rs) {
                base_info.homeProducts = rs;
                callback(base_info)
            });
        });
    });
};

let handleRes = (req, res, next) => {
    var type = req.query.index || 1;
    var page = req.query.page || 1;
    mysql.escapingQuery('select count(*) from products where type = ?', [type], function (err, rs) {
        var count = rs[0]['count(*)'];
        var pageSize = 12;
        var totalPage = Math.ceil(count / pageSize);
        page = Math.min(totalPage, page);
        page = Math.max(page, 1)
        var startNum = (page - 1) * pageSize;
        mysql.escapingQuery("select * from products where type = ? limit ?, ?", [type, startNum, pageSize], function (err, rs) {
            var listData = splitFun(rs, type);
            listData.currentType = type;
            listData.currentPage = page;
            listData.totalPage = totalPage;
            listData.totalCount = count;
            getHtmlData((base_info) => {
                listData.base_info = base_info;
                res.render('index', listData);
            });
        });
    })
}

//首页
router.all('/', function (req, res, next) {
    handleRes(req, res, next)
});
//对应产品页面
router.all('/product', function (req, res, next) {
    handleRes(req, res, next)
});
//产品信息页面
router.all('/product_info', function (req, res, next) {
    var id = req.query.id || 0;
    mysql.escapingQuery("select * from products where id = ?", [id], function (err, rs) {
        // console.log(rs[0]);
        var data = {
            infoData: rs[0]
        };
        getHtmlData((base_info) => {
            data.base_info = base_info;
            res.render('product_info', data);
        })
    });
});
//关于页面
router.all('/about', function (req, res, next) {
    getHtmlData((base_info) => {
        res.render('about', {
            base_info: base_info
        });
    })
});
//合作伙伴页面
router.all('/hzhb', function (req, res, next) {
    getHtmlData((base_info) => {
        res.render('hzhb', {
            base_info: base_info
        });
    })
});

module.exports = router;