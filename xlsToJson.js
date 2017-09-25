node_xj = require("xls-to-json");
var root = '/Users/root/code/UnityCode/LastTaoist/Assets/ImgPro/excel/'
var outUrl = '/Users/root/code/UnityCode/LastTaoist/Assets/StreamingAssets/';


node_xj({
    input: root + "配置文件.xlsx", // input xls 
    sheet: "道具", // specific sheetname 
    output: outUrl + "PropConfig.json" // output json 
}, function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log("道具,转化完成!!!");
    }
});

node_xj({
    input: root + "配置文件.xlsx", // input xls 
    output: outUrl + "LevelConfig.json", // output json 
    sheet: "等级" // specific sheetname 
}, function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log("等级属性,转化完成!!!");
    }
});