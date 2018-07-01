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

String.prototype.replaceAll = function (FindText, RepText) {
    regExp = new RegExp(FindText, "g");
    return this.replace(regExp, RepText);
}

// console.log(dataMap[1]);

'INSERT INTO products(type, name, img, other_name, en_name, formula, cas, feature, use_info, how_use) VALUES( "你好世界" , "NULL" , "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL");'

let sqlStr = `INSERT INTO products(type, name, img, other_name, en_name, formula, cas, feature, use_info, how_use) VALUES( ? , ? , ?, ?, ?, ?, ?, ?, ?, ?);`
for (let type in dataMap) {
    let typeData = dataMap[type];
    for (const _item of typeData) {
        var callback = (err, rs) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(rs);
        }
        if (_item.name)
            _item.name = _item.name.replaceAll('&#10;', '')
        if (_item.other_name)
            _item.other_name = _item.other_name.replaceAll('&#10;', '')
        if (_item.enName)
            _item.enName = _item.enName.replaceAll('&#10;', '')
        if (_item.formula)
            _item.formula = _item.formula.replaceAll('&#10;', '')
        if (_item.cas)
            _item.cas = _item.cas.replaceAll('&#10;', '')
        if (_item.feature)
            _item.feature = _item.feature.replaceAll('&#10;', '')
        if (_item.userInfo)
            _item.userInfo = _item.userInfo.replaceAll('&#10;', '')
        if (_item.howUse)
            _item.howUse = _item.howUse.replaceAll('&#10;', '')
        if (_item.name)
            if (_item.name) {
                let insertData = [
                    type,
                    _item.name || '',
                    _item.img || '',
                    _item.other_name || '',
                    _item.enName || '',
                    _item.formula || '',
                    _item.cas || '',
                    _item.feature || '',
                    _item.userInfo || '',
                    _item.howUse || ''
                ]
                mysql.escapingQuery(sqlStr, insertData, callback)
            }
    }
}
// let _item = dataMap[1][0];
// let insertData = [
//     1,
//     _item.name || 'NULL',
//     _item.img || 'NULL',
//     _item.other_name || 'NULL',
//     _item.enName || 'NULL',
//     _item.formula || 'NULL',
//     _item.cas || 'NULL',
//     _item.feature || 'NULL',
//     _item.userInfo || 'NULL',
//     _item.howUse || 'NULL'
// ]
// console.log(sqlStr)
// mysql.escapingQuery(sqlStr, insertData, (err, rs) => {
//     if (!err)
//         console.log(rs);
// })