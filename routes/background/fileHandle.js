var express = require('express');
var fs = require("fs");
var path = require('path');
var router = express.Router();

var imgTypes = '.png.jpg.PNG.PNG';
var _root = path.join(__dirname, '..', '..' ,'public','upfile');

function getFileExt(str)
{
  var result =/\.[^\.]+$/.exec(str);
  return result;
}

function checkType(str){
    if(imgTypes.indexOf(str) > -1){
      return true;
    }
  return false;
}

/**
 * 获取上传文件根目录下面的文件夹和文件
 */
router.get('/getFileList', function(req, res, next) {
  var reqPath = req.query.reqPath;
  var rootPath = '/upfile';
  var url = _root;
  if(reqPath){  //处理请求
    reqPath.forEach(function(str){
      url += path.sep + str;
      rootPath += ("/" +str);
    });
  }else{
    reqPath = [];
  }
  fs.readdir(url , function(err, files){
    if(err) {
      console.log(err);
    }else {
      var dirs = [];
      var images = [];
      files.forEach( function (file){
        var hz = getFileExt(file);
          if(!hz){
            dirs.push(file);
          }else if(checkType(hz[0])){
            var imgJson = {};
            imgJson['name'] = file;
            imgJson['url'] = (rootPath+"/" +file);
            images.push(imgJson);
          }
      });
      res.jsonp({dirs:dirs, images:images, paths:reqPath});
    }
  });
});


router.get('/deleteImg', function(req, res, next) {
  var url = req.query.url;
  var arr = url.trim().split('/');
  var deleteUrl = _root;
  var rs = [];
  arr.forEach(function(obj){
    if('' != obj && 'upfile' !=obj){
      deleteUrl += (path.sep + obj);
      rs.push(obj);
    }
  });
  //拿到需要删除的文件链接
  fs.unlink(deleteUrl, function(err){
      if(err)console.log(err)
      rs.pop();
      res.jsonp(rs);
  });

});

module.exports = router;
