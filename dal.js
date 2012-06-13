var config = require('./config');
var pg = require('pg');
var fs = require('fs');

// callback(err: Error, isVerified: bool)
exports.checkOpenId = function (openId, callback) {
    pg.connect(config.conString, function (err, client) {
        if (err) return callback(err);
        client.query('select count(1) from users where openId = $1', [openId], function (err, result) {
            callback(err, err || result.rows[0].count != 0);
        });
    });
}

// callback(err: Error, code: int)�
exports.verifyIdentity = function (name, idNumber, callback) {
    fs.readFile(__dirname + '/data/idinfo.csv', 'utf-8', function (err, data) {
        if (err) return callback(err);
        var matchArr = data.match(new RegExp(name + ',' + idNumber));
        if (matchArr) {
            pg.connect(config.conString, function (err, client) {
                if (err) return callback(err);
                client.query('select count(1) from users where idNumber = $1', [idNumber], function (err, result) {
                    if (err) return callback(err);
                    var code = 0;
                    if (result.rows[0].count != 0) {
                        code = 2;
                    }
                    callback(err, code);
                });
            });
        } else {
            callback(err, 1);
        }
    });
}

// callback(err: Error)
exports.createUser = function (openId, name, callback) {
    pg.connect(config.conString, function (err, client) {
        if (err) return callback(err);
        client.query('insert into users(openid, name) values($1, $2)', [openId, name], function (err, result) {
            callback(err);
        });
    });
}