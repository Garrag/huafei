var fs = require('fs');
var express = require('express');
var multer = require('multer')
var path = require('path')
var crypto = require('crypto');
var mysql = require('./../dao/mysql.js');

var _root = path.join(process.cwd(), 'public', 'images', 'product_list'); //, 'product_list'
var _temp = path.join(process.cwd(), 'public', 'tempImg');

var router = express.Router();
var upload = multer({
    dest: _temp
});

let createMD5 = function (password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}

router.all('/', upload.single('img'), function (req, res, next) {
    var file = req.file;
    var id = req.body.id;
    //重命名文件 加上文件后缀
    var min = file.originalname.split('.').splice(-1)[0];
    let filePath = path.join(_temp, file.filename);
    var fileStr = fs.readFileSync(filePath);
    let finalImgName = createMD5(fileStr) + '.' + min;
    fs.renameSync(filePath, path.join(_root, finalImgName));
    //关联产品
    mysql.escapingQuery("update products set img = ? where id = ?;", [finalImgName, id], function (err, rs) {
        if (err) console.log(err);
        else {
            if (rs.length > 0) {
                html_data.productData = rs[0];
                res.render(_root + "index", html_data);
            }
        }
    });

    res.jsonp({
        ret: 0,
        msg: "上传图片成功!",
    })
})

module.exports = router;