module.exports = function(app) {
    app.get('/', function(req, res, next) {
        res.render('site/index', { title: '首页' });
    });
};