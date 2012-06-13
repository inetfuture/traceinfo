var dal = require('../dal');

module.exports = function (app) {
    app.get('/login', function (req, res, next) {
        req.session.openId = null;
        res.render('sign/login', { title: '登录', qqCallback: req.query.qqCallback });
    });
    app.post('/login', function (req, res, next) {
        if (req.body.openId) {
            dal.checkOpenId(req.body.openId, function (err, isVerified) {
                if (err) return next(err);
                var redirectUrl = '';
                if (isVerified) {
                    req.session.openId = req.body.openId;
                    redirectUrl = '/';
                } else {
                    console.log('1');
                    redirectUrl = 'verify';
                    req.session.tempOpenId = req.body.openId;
                }
                res.send('window.location.href = "' + redirectUrl + '"');
            });
        }
    });

    app.get('/verify', function (req, res, next) {
        if (req.session.tempOpenId) {
            res.render('sign/verify', { title: '验证', openId: req.session.tempOpenId });
            req.session.tempOpenId = null;
        } else {
            res.redirect('/');
        }
    });
    app.post('/verify', function (req, res, next) {
        if (!req.body.openId || !req.body.name || !req.body.idNumber) {
            res.render('sign/verify', { title: '验证', openId: req.body.openId, name: req.body.name, idNumber: req.body.idNumber, errorMsg: '信息不完整！' });
        }

        dal.verifyIdentity(req.body.name, req.body.idNumber, function (err, code) {
            if (err) return next(err);
            var errorMsg;
            switch (code) {
                case 0:
                    dal.createUser(req.body.openId, req.body.name, function (err) {
                        if (err) return next(err);
                        req.session.openId = req.body.openId;
                        res.redirect("/");
                    });
                    break;
                case 1:
                    errorMsg = '姓名或身份证号无效！';
                    break;
                case 2:
                    errorMsg = '该身份已被使用！';
                    break;
            }
            if (errorMsg) {
                res.render('sign/verify', { title: '验证', openId: req.body.openId, name: req.body.name, idNumber: req.body.idNumber, errorMsg: errorMsg });
            }
        });
    });
}
