var express = require('express');
var router = express.Router();
var mysql = require('./../dao/mysql.js');
var _root = 'background/';


//类型数据
var html_data = {
    viewType: '',
    types: [],
}

let updateTypes = (callback = () => { }) => {
    //读取数据 拿到列表
    mysql.query("select * from product_type", function (err, rs) {
        if (err) {
            console.log(err);
            callback(false, err);
            return;
        }
        html_data.types = rs;
        callback(true, rs);
    });

};

let updateBaseInfo = (callback = () => { }) => {
    //拿到公司的基本信息
    mysql.query("select * from base_info where id = 0", function (err, rs) {
        if (err) {
            console.log(err);
            callback(false, err)
            return;
        } else {
            if (rs.length > 0) {
                html_data.base_info = rs[0];
                callback(true, rs[0]);
            } else {
                callback(false, err)
            }
        }
    });
};

let updateDataByType = (type = '', name = '', callback) => {
    callback = callback || function () { };
    mysql.escapingQuery("update product_type set name = ? where type = ?", [name, type], function (err, rs) {
        if (err) {
            callback(false, '数据库语句执行失败：' + err);
        } else {
            if (rs.affectedRows > 0) {
                callback(true);
            } else {
                callback(false, '数据库语句执行失败：没有发现对应的type')
            }
        }
    });
}

let getDataByType = (type) => {
    for (let item of html_data.types) {
        if (item.type == type) {
            return item;
        }
    }
}

//更新公司数据
updateTypes();
updateBaseInfo();
/**
 * 权限控制
 */
router.all('/*', function (req, res, next) {
    //判断seeion是否已经有过权限
    //1.有,直接通过
    //2.没有.跳转到登录页面
    //console.log(req.path);
    if ('/login' == req.path) {
        next();
    } else {
        var limits = req.session.limits;
        if (limits && '0' == limits) {
            next();
        } else {
            res.render(_root + "login", {});
        }
    }
});
/**
 * 登录页面
 */
router.all('/', function (req, res, next) {
    res.render(_root + "login", {});
});
/**
 * 验证登录
 */
router.post('/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    // console.log(username, password);
    if (username == 'root' && password == "123456") {
        req.session.limits = "0";
        res.redirect("/" + _root + 'index');
    } else {
        res.send("账号密码有错误!!~~");
    }
});
//首页
router.all('/index', function (req, res, next) {
    res.render(_root + "index", html_data);
});
//查看类型
router.all('/managertype', function (req, res, next) {
    html_data.viewType = 'type_manager';
    mysql.query("select * from product_type", function (err, rs) {
        html_data.types = rs;
        res.render(_root + "index", html_data);
    });
});
//更新所有类型
router.all('/updatetypes', function (req, res, next) {
    //找出差异
    var changeTypes = [];
    for (var i = 1; i <= 20; i++) {
        let typeData = getDataByType(i);
        let name = req.body['type_' + i];
        if (typeData.name != name) {
            changeTypes.push({
                type: typeData.type,
                name: name
            });
        }
    }
    for (let i = 0; i < changeTypes.length; i++) {
        let item = changeTypes[i];
        if (i == changeTypes.length - 1) {
            updateDataByType(item.type, item.name, (status, msg) => {
                if(status){
                    res.jsonp({
                        ret: 0,
                        msg: "ok",
                    })
                }else {
                    console.log(msg);
                }
            });
        } else {
            updateDataByType(item.type, item.name);
        }
    }
});
//创建新产品
router.all('/newproduct', function (req, res, next) {
    html_data.viewType = 'product_new';
    res.render(_root + "index", html_data);
});
//查看公司信息
router.all('/editcompany', function (req, res, next) {
    let type = req.query.type || req.body.type;

    let info = req.body.info;   //需要更新的信息
    let link = req.body.link;
    let partner = req.body.partner;



    if (type == 'info') {
        html_data.viewType = 'company_info';
        if (info) {
            mysql.escapingQuery('update base_info set info=? where id = 0', [info], (err, rs) => {
                if (err) console.log(err);
                else {
                    html_data.base_info.info = info;
                    res.jsonp({
                        ret: 0,
                        msg: "ok",
                    })
                    // res.render(_root + "index", html_data);        
                }
            });
        } else {
            res.render(_root + "index", html_data);
        }
    } else if (type == 'link') {
        html_data.viewType = 'company_link';
        if (link) {
            mysql.escapingQuery('update base_info set contact=? where id = 0', [link], (err, rs) => {
                if (err) console.log(err);
                else {
                    html_data.base_info.contact = link;
                    res.jsonp({
                        ret: 0,
                        msg: "ok",
                    })
                    // res.render(_root + "index", html_data);
                }
            });
        } else {
            res.render(_root + "index", html_data);
        }
    } else if (type == 'partner') {
        html_data.viewType = 'company_partner';
        if (partner) {
            mysql.escapingQuery('update base_info set partner=? where id = 0', [partner], (err, rs) => {
                if (err) console.log(err);
                else {
                    html_data.base_info.partner = partner;
                    res.jsonp({
                        ret: 0,
                        msg: "ok",
                    })
                    // res.render(_root + "index", html_data);
                }
            });
        } else {
            res.render(_root + "index", html_data);
        }
    }
});
//编辑产品
router.all('/editproduct', function (req, res, next) {
    var id = req.query.id;
    // console.log(id);
    html_data.viewType = 'product_edit';
    mysql.escapingQuery("select * from products where id = ?", [id], function (err, rs) {
        if (err) console.log(err);
        else {
            if (rs.length > 0) {
                console.log(rs[0]);
                html_data.productData = rs[0];
                res.render(_root + "index", html_data);
            }
        }
    });
});
//产品列表界面
router.all('/productlist/', function (req, res, next) {
    var type = req.query.type;
    html_data.viewType = 'product_list';
    mysql.escapingQuery("select * from products where type = ? order by id desc;", [type], function (err, rs) {
        if (err) console.log(err);
        else {
            rs = rs.sort(function (a, b) {
                if (a.home > b.home) {
                    return -1;
                } else if (a.home < b.home) {
                    return 1;
                } else {
                    return 0;
                }
            })

            html_data.productListData = rs;
            res.render(_root + "index", html_data);
        }
    });
});
//创建商品
router.post('/createProduct', function (req, res, next) {
    let sqlStr = `INSERT INTO products(type, name, img, other_name, en_name, formula, cas, feature, use_info, how_use) VALUES( ? , ? , ?, ?, ?, ?, ?, ?, ?, ?);`
    if (!req.body.type) return;
    if (!req.body.name) return;
    let insertData = [
        req.body.type,
        req.body.name,
        req.body.img || '',
        req.body.other_name || '',
        req.body.enName || '',
        req.body.formula || '',
        req.body.cas || '',
        req.body.feature || '',
        req.body.userInfo || '',
        req.body.howUse || ''
    ]
    mysql.escapingQuery(sqlStr, insertData, function (err, rs) {
        if (err) {
            res.jsonp({
                ret: -1,
                msg: err,
            })
        } else {
            // console.log(rs);
            if (rs.affectedRows > 0) {
                res.jsonp({
                    ret: 0,
                    msg: "ok",
                })
            } else {
                res.jsonp({
                    ret: -1,
                    msg: err,
                })
            }
        }
    })
});
//更新数据
router.post('/updateProduct', function (req, res, next) {
    let sqlStr = `update products set name=?, other_name=?, en_name=?, formula=?, cas=?, feature=?, use_info=?, how_use=? where id = ?;`
    if (!req.body.id) return;
    let updateData = [
        req.body.name || '',
        req.body.other_name || '',
        req.body.enName || '',
        req.body.formula || '',
        req.body.cas || '',
        req.body.feature || '',
        req.body.userInfo || '',
        req.body.howUse || '',
        req.body.id,
    ]
    mysql.escapingQuery(sqlStr, updateData, function (err, rs) {
        if (err) {
            res.jsonp({
                ret: -1,
                msg: err,
            })
        } else {
            // console.log(rs);
            if (rs.affectedRows > 0) {
                res.jsonp({
                    ret: 0,
                    msg: "ok",
                })
            } else {
                res.jsonp({
                    ret: -1,
                    msg: err,
                })
            }
        }
    })
});
// 删除产品
router.post('/deleteproduct/', function (req, res, next) {
    var id = req.body.id;
    mysql.escapingQuery("DELETE FROM products WHERE id = ?", [id], function (err, rs) {
        if (err) {
            res.jsonp({
                ret: -1,
                msg: err,
            })
        } else {
            if (rs.affectedRows > 0) {
                res.jsonp({
                    ret: 0,
                    msg: "ok",
                })
            } else {
                res.jsonp({
                    ret: -1,
                    msg: err,
                })
            }
        }
    });
});
//删除图标
router.all('/deleteimg/', function (req, res, next) {
    var id = req.body.id;
    mysql.escapingQuery("update products set img = ? where id = ?", ['', id], function (err, rs) {
        if (err) {
            res.jsonp({
                ret: -1,
                msg: err,
            })
        } else {
            if (rs.affectedRows > 0) {
                res.jsonp({
                    ret: 0,
                    msg: "ok",
                })
            } else {
                res.jsonp({
                    ret: -1,
                    msg: err,
                })
            }
        }
    });
});
//添加首页
router.all('/addhome/', function (req, res, next) {
    var id = req.body.id;
    mysql.escapingQuery("update products set home = ? where id = ?", [1, id], function (err, rs) {
        if (err) {
            res.jsonp({
                ret: -1,
                msg: err,
            })
        } else {
            if (rs.affectedRows > 0) {
                res.jsonp({
                    ret: 0,
                    msg: "ok",
                })
            } else {
                res.jsonp({
                    ret: -1,
                    msg: err,
                })
            }
        }
    });
});
//移除首页
router.all('/removehome/', function (req, res, next) {
    var id = req.body.id;
    mysql.escapingQuery("update products set home = ? where id = ?", [0, id], function (err, rs) {
        if (err) {
            res.jsonp({
                ret: -1,
                msg: err,
            })
        } else {
            if (rs.affectedRows > 0) {
                res.jsonp({
                    ret: 0,
                    msg: "ok",
                })
            } else {
                res.jsonp({
                    ret: -1,
                    msg: err,
                })
            }
        }
    });
});

module.exports = router;