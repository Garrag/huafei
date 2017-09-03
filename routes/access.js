/**
 * Created by admin on 2016/3/29.
 */
var express = require('express');
var router = express.Router();
var mysql = require('./dao/mysql.js');

router.get('/a/:index', function (req, res, next) {
    var index = req.params.index;
    mysql.escapingQuery('update access_record set num=num+1 where id = ?', [index], function (err, rs) {
        if(err){
            console.log("更新统计：" + err);
            res.redirect('http://z.jd.com/project/details/47997.html#rd');
        } else {
            res.redirect('http://z.jd.com/project/details/47997.html#rd');
        }
    });
});

//结果查看
router.get('/rs', function (req, res, next) {
    mysql.escapingQuery('select * from access_record', [], function (err, rs) {
        res.render('record/index', {data:rs});
    });
});

router.get('/dyr', function(req, res, next){
    var sql = 'select av.name as l_name,oi.name as b_name  from (select a.name, r.c_openid from action_vote as a left join action_vote_record as r on a.openid = r.d_openid where a.openid <> r.c_openid) as oi left join action_vote as av on oi.c_openid = av.openid order by av.name;';
    mysql.escapingQuery(sql, [], function (err, rs) {
        res.render('record/dyr', {data:rs});
    });
});

//添加基础数据
var addData = function () {
    var sql = 'insert into access_record(id, name, num) value(?,?,?)';
    for (var i = 1; i <= 20; i++) {
        mysql.escapingQuery(sql, [i, '活动'+i, 0], function (err, rs) {
        })
    }
};


module.exports = router;