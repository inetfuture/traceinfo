var dal = require('../dal');
exports.login = function (req, res, next) {
    var method = req.method.toLowerCase();
    if (method === 'get') {
        req.session.openId = null;
        res.render('sign/login', { title: '登录', qqCallback: req.query.qqCallback });
        return;
    }
    if (method === 'post') {
        if (req.body.openId) {
            dal.checkOpenId(req.body.openId, function (err, isVerified) {
                if (err) return next(err);
                var redirectUrl = '';
                if (isVerified) {
                    req.session.openId = req.body.openId;
                    redirectUrl = '/';
                } else {
                    redirectUrl = 'sign/verify';
                    req.session.tempOpenId = req.body.openId;
                }
                res.send('window.location.href = "' + redirectUrl + '"');
                return;
            });
        }
    }
};

exports.verify = function (req, res, next) {
    var method = req.method.toLowerCase();
    if (method === 'get') {
        if (req.session.tempOpenId) {
            res.render('sign/verify', { title: '验证', openId: req.session.tempOpenId });
            req.session.tempOpenId = null;
            return;
        } else {
            res.redirect('/');
            return;
        }
    }
    if (method === 'post') {
        dal.verifyIdentity(req.body.name, req.body.idNumber, function (err, isValid) {
            if (err) return next(err);
            if (isValid) {
                dal.createUser(req.body.openId, req.body.name, function (err) {
                    if (err) return next(err);
                    req.session.openId = req.body.openId;
                    res.redirect("/");
                    return;
                });
            } else {
                res.render('sign/verify', { title: '验证', openId: req.body.openId, name: req.body.name, idNumber: req.body.idNumber, err: '未找到相符记录，验证失败！' });
                return;
            }
        });
    }

};