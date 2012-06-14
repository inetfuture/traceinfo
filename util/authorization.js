exports.requiresLogin = function (req, res, next) {
    if (!req.session.auth) {
        res.redirect('/login');
        return;
    }
    next();
};
