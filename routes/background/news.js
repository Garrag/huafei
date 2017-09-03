var express = require('express');
var router = express.Router();
var mysql = require('./../dao/mysql.js');

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

router.get('/getNewsList', function(req, res, next) {
  mysql.query("select id,title,date,type,img from news order by date desc", function(err, rs){
    if(err)console.log(err);
    else {
      var homeNews = []; //首页数据
      var news = [];  //其余所有数据
      for (var k in rs) {
        rs[k].date = rs[k].date.Format("yyyy-MM-dd hh:mm:ss");
        if(0 == rs[k].type){
          homeNews.push(rs[k]);
        }else {
          news.push(rs[k]);
        }
      }
      res.jsonp({news:news, homeNews:homeNews});
    }
  });
});

/**
 * 删除
 */
router.get('/deleteNew', function(req, res, next) {
  var id = req.query.id;
  mysql.escapingQuery("DELETE FROM news WHERE id = ?",[id],  function(err, rs){
    if(err)console.log(err);
    else {
      res.jsonp({code:200});
    }
  });
});

//updateNewType
router.get('/updateNewType', function(req, res, next) {
  var id = req.query.id;
  var type = req.query.type;
  mysql.escapingQuery("update news set type = ? WHERE id = ?",[type, id],  function(err, rs){
    if(err)console.log(err);
    else {
      res.jsonp({code:200});
    }
  });
});

/**
 * 获取新闻内容
 */
router.get('/getNew', function(req, res, next) {
  var id = req.query.id;
  mysql.escapingQuery("select * from news where id = ?",[id],  function(err, rs){
    if(err)console.log(err);
    else {
      res.jsonp({code:200, data:rs[0]});
    }
  });
});


/**
 * 处理上传的新闻与更改
 */
router.post('/up_new', function(req, res, next){
  var data = req.body;
  var str = 'insert into news(title, img, info, date, type, content) values(?,"http://www.juxinkeji.net/upfiles/201510/24/af5592fcabd50825c.jpg",?,now(),?,?) ' +
      ' ON DUPLICATE KEY UPDATE ' +
      'info = ?, date= now(), type= ?, content=?';
  mysql.escapingQuery(str, [data.title, data.info, data.type||1, data.content, data.info, data.type||1, data.content], function(err, rs){
    if(err){
      console.log(err);
      res.jsonp({code:500}); // 添加出错
    } else {
      res.jsonp({code:200});
    }
  });
});
//changeNewTileImg
router.all('/changeNewTitleImg', function(req, res, next){
  var url = req.query.url;
  var id = req.query.id;
  var str = "update news set img = ? WHERE id = ?";
  mysql.escapingQuery(str, [url, id], function(err, rs){
    if(err){
      console.log(err);
      res.jsonp({code:500}); // 添加出错
    } else {
      res.jsonp({code:200});
    }
  });
});


module.exports = router;
