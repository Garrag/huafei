var fs = require('fs');
var express = require('express');
var multiparty = require('multiparty');
var multer = require('multer')
var path = require('path')

var _root = path.join('public', 'images'); //, 'product_list'
var _temp = path.join('public', 'tempImg');

var router = express.Router();
var upload = multer({
    dest: _temp
});
router.post('/', upload.single('img'), function (req, res, next) {
    var file = req.file;
    //重命名文件 加上文件后缀
    var min = file.originalname.split('.').splice(-1)[0];
    console.log();
    fs.renameSync(path.join(_temp, file.filename), path.join(_root, file.filename + '.' + min));
    res.jsonp({
        ret: 0,
        msg: "ok",
    })
})

module.exports = router;