var express = require('express');
var router = express.Router();
var path = require("path")
var fs = require('fs');


var gongyePath = path.join(__dirname, "../excel/product_gongye.json");
var huangbaoPath = path.join(__dirname, "../excel/product_huangbao.json");
var shiyongPath = path.join(__dirname, "../excel/product_shiyong.json");
var yiqiPath = path.join(__dirname, "../excel/product_yiqi.json");
var tuliaoPath = path.join(__dirname, "../excel/product_tuliao.json");


var dataMap = {
    1 : JSON.parse(fs.readFileSync(gongyePath)),
    2 : JSON.parse(fs.readFileSync(huangbaoPath)),
    3 : JSON.parse(fs.readFileSync(shiyongPath)),
    4 : JSON.parse(fs.readFileSync(yiqiPath)),
    5 : JSON.parse(fs.readFileSync(tuliaoPath))
}

for (var key in dataMap) {
    for(var i=0; i<dataMap[key].length; i++){
        dataMap[key][i].type = key
        dataMap[key][i].id = i
    }
}

router.all('/', function(req, res, next) {
    var type = req.query.index || 1;
    var json = dataMap[type];

    var newData = []
    for (var i=0; i<json.length; i++) {
        var element = json[i];
        if(element.name && element.name != '') {
            newData.push(element)
        }
    }
    res.render('index', {listData : newData});
});

router.all('/product_info', function(req, res, next) {
    var id = req.query.id || 0;
    var type = req.query.type || 0;

    var infoData = dataMap[type][id];
    var data = {infoData : infoData};
    res.render('product_info', data);
});

module.exports = router;