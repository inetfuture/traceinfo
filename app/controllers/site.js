module.exports = function (app, mongoose, auth) {
	var Info = mongoose.model('Info');
    app.get('/', auth.requiresLogin, function (req, res, next) {
		Info.find({}, function (err, docs){
			res.render('site/index', { title: '首页', infos: docs });
		});
    });
};
