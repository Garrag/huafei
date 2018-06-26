/**
 * Created by Dall on 15/9/15.
 */
var mysql = require("mysql");
//数据库连接池配置
var pool = mysql.createPool({
    connectionLimit: 10,
    host: '120.77.56.23',
    user: 'root',
    password: 'jun123',
    database: 'huafei'
});

//创建一个空的对象
var sql = {};
/**
 * 给sql实例添加一个方法
 * @param sql  sql语句
 * @param callback 完成后的回调函数
 */
sql.query = function (sql, callback) {
    //获取一个数据库连接
    pool.getConnection(function (err, conn) {
        if (err) {
            //如果出错,把错误传入回调方法的第一个参数
            callback(err, null);
        } else {
            //拿到的连接,进行数据库查询
            conn.query(sql, function (err, rs) {
                //释放连接
                conn.release();
                //事件驱动回调,传递错误和结果
                callback(err, rs);
            });
        }
    });
};

sql.escapingQuery = function (sql, arr, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, arr, function (err, rs) {
                conn.release();
                callback(err, rs);
            });
        }
    });
};
//暴露sql对象
module.exports = sql;