/**
 * Created by admin on 2015/12/24.
 */
var express = require('express');
var router = express.Router();
var mysql = require('./dao/mysql.js');

router.all('/', function (req, res, next) {
    var data = {
        classics: [],
        water: [],
        vermilion: [],
        rose: []
    };
    mysql.query('select * from trouble_shooting', function (err, rs) {
        if (err) {
            console.log("服务中心获取常见问题数据失败: " + err);
        } else {
            for (var k in rs) {
                switch (rs[k].type) {
                    case 1:
                        data.classics.push(rs[k]);
                        break;
                    case 2:
                        data.water.push(rs[k]);
                        break;
                    case 3:
                        data.vermilion.push(rs[k]);
                        break;
                    case 4:
                        data.rose.push(rs[k]);
                        break;
                    default :
                        break;
                }
            }
            res.render('question', data);
        }
    });
});

module.exports = router;