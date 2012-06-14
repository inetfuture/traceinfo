module.exports = function (app, mongoose, auth) {
    app.get('/', auth.requiresLogin, function (req, res, next) {
        res.render('site/index', { title: '首页' });
    });
};