var express = require('express');
var router = express.Router();
var path = require("path")
var fs = require('fs');


var gongyePath = path.join(__dirname, "../excel/product_gongye.json");
var huangbaoPath = path.join(__dirname, "../excel/product_huangbao.json");
var shiyongPath = path.join(__dirname, "../excel/product_shiyong.json");
var yiqiPath = path.join(__dirname, "../excel/product_yiqi.json");
var tuliaoPath = path.join(__dirname, "../excel/product_tuliao.json");




for (var key in dataMap) {
    for(var i=0; i<dataMap[key].length; i++){
        dataMap[key][i].type = key
        dataMap[key][i].id = i
    }
}

String.prototype.replaceAll = function (FindText, RepText) {
    regExp = new RegExp(FindText, "g");
    return this.replace(regExp, RepText);
}

String.prototype.trim = function(){ 
    return this.replace(/(^\s*)|(\s*$)/g, ""); 
}

String.prototype.trimSpace = function(){ 
    return this.replace(/&#10;/g, ""); 
}


var dataMap = {
    1 : JSON.parse(fs.readFileSync(gongyePath)),
    2 : JSON.parse(fs.readFileSync(huangbaoPath)),
    3 : JSON.parse(fs.readFileSync(shiyongPath)),
    4 : JSON.parse(fs.readFileSync(yiqiPath)),
    5 : JSON.parse(fs.readFileSync(tuliaoPath))
}

//去除空白对象
var filterFun = function(arr){
    var newJson = []
    for (var i=0; i<arr.length; i++) {
        var element1 = arr[i];
        if(element1.name && element1.name != '') {
            element1.name = element1.name.replaceAll('&#10;', '')
            element1.feature = element1.feature.replaceAll('&#10;', '')
            element1.userInfo = element1.userInfo.replaceAll('&#10;', '')
            element1.otherName = element1.otherName.replaceAll('&#10;', '')
            element1.enName = element1.enName.replaceAll('&#10;', '')
            element1.howUse = element1.howUse.replaceAll('&#10;', '')
            element1.CAS = element1.CAS.replaceAll('&#10;', '')
            element1.formula = element1.formula.replaceAll('&#10;', '')
            newJson.push(element1)
        }
    }
    return newJson
}
//分成4个对象
var splitFun = function(newJson, type){
    var list1 = []
    var list2 = []
    var list3 = []
    var list4 = []
    for (var i=0; i<newJson.length; i+=4) {
        var element1 = newJson[i];
        var element2 = newJson[i+1];
        var element3 = newJson[i+2];
        var element4 = newJson[i+3];
        if(element1 && element1.name && element1.name != '') {
            element1.id = i
            element1.type = type
            list1.push(element1)
        }
        if(element2 && element2.name && element2.name != '') {
            element2.id = i+1
            element2.type = type
            list2.push(element2)
        }
        if(element3 && element3.name && element3.name != '') {
            element3.id = i+2
            element3.type = type
            list3.push(element3)
        }
        if(element4 && element4.name && element4.name != '') {
            element4.id = i+3
            element4.type = type
            list4.push(element4)
        }
    }
    var listData = {
        list1 : list1,
        list2 : list2,
        list3 : list3,
        list4 : list4
    }
    return listData
}

router.all('/', function(req, res, next) {
    var json = dataMap[1];
    var newJson = filterFun(json)
    // console.log('===================================================')
    // console.log(newJson)
    // console.log('===================================================')
    var arr = [];
    var config = [0,1,3,5,7,8,9,10,11,14];
    for (var i = 0; i < config.length; i++) {
        var id = config[i];
        var item = newJson[id]
        item.id = id;
        item.type = 1;
        arr.push(item)
    }
    res.render('home', {listData : arr} );
});

router.all('/product', function(req, res, next) {
    var type = req.query.index || 1;
    var json = dataMap[type];
    //去空
    var newJson = filterFun(json)
    //分类
    var listData = splitFun(newJson, type)
    res.render('index', listData);
});



router.all('/product_info', function(req, res, next) {
    var id = req.query.id || 0;
    var type = req.query.type || 0;
    var infoData = dataMap[type][id];
    if (!fs.existsSync(path.join(__dirname, '../public/images/product_list/' + infoData.img)) ) {
        infoData.img = null;
    }

    var data = {infoData : infoData};
    res.render('product_info', data);
});

router.all('/about', function(req, res, next) {
    res.render('about', {});
});

router.all('/hzhb', function(req, res, next) {
    res.render('hzhb', {});
});

module.exports = router;