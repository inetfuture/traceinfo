module.exports = function (app, mongoose) {
    var fs = require('fs');

    var Info = mongoose.model('Info');

    app.get('/login', function (req, res, next) {
        req.session.auth = null;
        res.render('auth/login', { title: '登录', qqCallback: req.query.qqCallback });
    });
    app.post('/login', function (req, res, next) {
        var openId = req.body.openId;

        if (openId) {
            Info.findOne({ openId: openId }, ['name'], function (err, info) {
                if (err) return next(err);
                var redirectUrl = '';
                if (info) {
                    req.session.auth = { openId: openId, name: info.name };
                    redirectUrl = '/';
                } else {
                    redirectUrl = 'verify';
                    req.session.tempOpenId = openId;
                }
                res.send('window.location.href = "' + redirectUrl + '"');
            });
        }
    });

    app.get('/verify', function (req, res, next) {
        var openId = req.session.tempOpenId;

        if (openId) {
            res.render('auth/verify', { title: '验证', openId: openId });
            req.session.tempOpenId = null;
        } else {
            res.redirect('/');
        }
    });
    app.post('/verify', function (req, res, next) {
        var openId = req.body.openId;
        var name = req.body.name;
        var idNumber = req.body.idNumber;

        if (!openId || !name || !idNumber) {
            res.render('auth/verify', { title: '验证', openId: openId, name: name, idNumber: idNumber, errorMsg: '信息不完整！' });
        }

        fs.readFile( process.cwd() + '/data/idinfo.csv', 'utf-8', function (err, data) {
            if (err) return next(err);
            var matchArr = data.match(new RegExp(name + ',' + idNumber));
            if (matchArr) {
                Info.count({ idNumber: idNumber }, function (err, count) {
                    if (err) return next(err);
                    if (count > 0) {
                        res.render('auth/verify', { title: '验证', openId: openId, name: name, idNumber: idNumber, errorMsg: '该身份已被使用！' });
                    } else {
                        var info = new Info();
                        info.openId = openId;
                        info.name = name;
                        info.idNumber = idNumber;
                        info.save(function (err) {
                            if (err) return next(err);
                            req.session.auth = { name: name, idNumber: idNumber };
                            res.redirect("/");
                        });
                    }
                });
            } else {
                res.render('auth/verify', { title: '验证', openId: openId, name: name, idNumber: idNumber, errorMsg: '姓名或身份证号无效！' });
            }
        });
    });
}
