// INSERT INTO Persons(LastName, Address) VALUES('Wilson', 'Champs-Elysees')

var path = require("path")
var fs = require('fs');
var mysql = require('./mysql.js');


var gongyePath = path.join(__dirname, "../../excel/product_gongye.json");
var huangbaoPath = path.join(__dirname, "../../excel/product_huangbao.json");
var shiyongPath = path.join(__dirname, "../../excel/product_shiyong.json");
var yiqiPath = path.join(__dirname, "../../excel/product_yiqi.json");
var tuliaoPath = path.join(__dirname, "../../excel/product_tuliao.json");


var dataMap = {
    1: JSON.parse(fs.readFileSync(gongyePath)),
    2: JSON.parse(fs.readFileSync(huangbaoPath)),
    3: JSON.parse(fs.readFileSync(shiyongPath)),
    4: JSON.parse(fs.readFileSync(yiqiPath)),
    5: JSON.parse(fs.readFileSync(tuliaoPath))
}

// console.log(dataMap[1]);

let sqlStr =
    `INSERT INTO products(type, name, img, other_name, en_name, formula, cas, feature, use_info, how_use) VALUES( ? , ? , ?, ?, ?, ?, ?, ?, ?, ?);
    `
for (let type in dataMap) {
    let typeData = dataMap[type];
    for (const _item of typeData) {
        var callback = (rs) => {
            console.log(rs);
        }
        if (_item.name) {
            console.log([
                type,
                _item.name || 'NULL',
                _item.img || 'NULL',
                _item.other_name || 'NULL',
                _item.enName || 'NULL',
                _item.formula || 'NULL',
                _item.cas || 'NULL',
                _item.feature || 'NULL',
                _item.userInfo || 'NULL',
                _item.howUse || 'NULL'
            ])
            mysql.escapingQuery(sqlStr, [
                type,
                _item.name || 'NULL',
                _item.img || 'NULL',
                _item.other_name || 'NULL',
                _item.enName || 'NULL',
                _item.formula || 'NULL',
                _item.cas || 'NULL',
                _item.feature || 'NULL',
                _item.userInfo || 'NULL',
                _item.howUse || 'NULL'
            ], callback)
        }
    }
}