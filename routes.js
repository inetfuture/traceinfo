var sign = require('./controllers/sign.js');
var site = require('./controllers/site.js');

exports = module.exports = function(app) {
    app.get('/login', sign.login);
    app.post('/login', sign.login);
    app.get('/verify', sign.verify);
    app.post('/verify', sign.verify);

    app.all(/\/.*/, function (req, res, next) {
        if (req.session.openId == null) {
            res.redirect('/login');
        } else {
            next();
        }
    });

    app.get('index', site.index);
}

