/**
 * Created by admin on 2015/12/1.
 */
var express = require('express');
var mysql = require('./dao/mysql.js');
var router = express.Router();

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

router.get('/list', function (req, res, next) {
    var index = req.query.index;
    var num = 8;
    if (!index || index == undefined || index < 0) {
        index = 0;
    }
    var startIndex = index * num;
    var str = "select id,img,title,date,info from news order by date desc limit ?,?";
    mysql.escapingQuery(str, [startIndex, num], function (err, rs) {
        if (err)console.log(err);
        else {
            if (!rs || rs.length == 0) {
                res.redirect('/news/list?index=' + (--index));
            }
            for (var k in rs) {
                rs[k].date = rs[k].date.Format("yyyy-MM-dd");
            }
            res.render('newsList', {index: index, news: rs});
        }
    });
});


/**
 * 获取下一页的新闻
 */
router.get('/nNews', function(req, res, next){
    var id = req.query.id;
    var str = "select id,title,date,content from news where id = (select id from news where id < ? order by id desc limit 1)";
    mysql.escapingQuery(str, [id], function(err, rs){
        if(err)console.log(err);
        else {
            if(rs.length == 0){
                res.redirect('/news?id='+id);
            }else {
                var data = {
                    title:rs[0].title,
                    content:rs[0].content,
                    id:rs[0].id
                };
                var d = rs[0].date;
                data.date = d.Format("yyyy-MM-dd");
                res.render('item/news', data);
            }
        }
    });
});


/**
 * 获取上一页的新闻
 */
router.get('/pNews', function(req, res, next){
    var id = req.query.id;
    var str = "select id,title,date,content from news where id = (select id from news where id > ? order by id asc limit 1)";
    mysql.escapingQuery(str, [id], function(err, rs){
        if(err)console.log(err);
        else {
            if(rs.length == 0){
                res.redirect('/news?id='+id);
            }else {
                var data = {
                    title:rs[0].title,
                    content:rs[0].content,
                    id:rs[0].id
                };
                var d = rs[0].date;
                data.date = d.Format("yyyy-MM-dd");
                res.render('item/news', data);
            }
        }
    });
});

module.exports = router;