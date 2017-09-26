node_xj = require("xls-to-json");
var root = './excel/'
var outUrl = './excel/';


node_xj({
    input: root + "data.xlsx", // input xls 
    sheet: "工业化工原料", // specific sheetname 
    output: outUrl + "product_gongye.json" // output json 
}, function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log("工业化工原料,转化完成!!!");
    }
});

node_xj({
    input: root + "data.xlsx", // input xls 
    sheet: "环保处理原料", // specific sheetname 
    output: outUrl + "product_huangbao.json" // output json 
}, function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log("环保处理原料,转化完成!!!");
    }
});

node_xj({
    input: root + "data.xlsx", // input xls 
    sheet: "食用化工原料", // specific sheetname 
    output: outUrl + "product_shiyong.json" // output json 
}, function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log("食用化工原料,转化完成!!!");
    }
});

node_xj({
    input: root + "data.xlsx", // input xls 
    sheet: "化学试剂仪器", // specific sheetname 
    output: outUrl + "product_yiqi.json" // output json 
}, function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log("化学试剂仪器,转化完成!!!");
    }
});

node_xj({
    input: root + "data.xlsx", // input xls 
    sheet: "艺术涂料", // specific sheetname 
    output: outUrl + "product_tuliao.json" // output json 
}, function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log("艺术涂料,转化完成!!!");
    }
});