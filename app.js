var express = require('express');
var config = require('./config').config;
var routes = require('./routes');

var app = module.exports = express.createServer();
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: true });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'TraceInfo' }));
});
app.configure('development', function () {
    app.use(express.static(__dirname + '/public'));
});
app.configure('production', function () {
    var oneDay = 24 * 3600 * 1000;
    app.use(express.static(__dirname + '/public', { maxAge: oneDay }));
});

app.helpers({
    config: config
});
app.dynamicHelpers({
    headContents: function () {
        return [];
    }
});

app.error(function (err, req, res) {
    console.log(err);
    var accept = req.header('Accept');
    if (accept.indexOf('json') != -1) {
        res.send('{ err: "Server Side Error" }');
    } else if (accept.indexOf('javascript') != -1) {
        res.send('alert("Server Side Error!")');
    } else {
        res.send('Server Side Error!');
    }
});
console.log('hah');
routes(app);

app.listen(config.port, function () {
	console.log("TraceInfo server listening on port %d in %s mode", app.address().port, app.settings.env);
});