var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var config = require('./config');
var auth = require('./util/authorization');

var app = express.createServer();
app.configure(function () {
    app.set('views', __dirname + '/app/views');
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

// view helpers
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
    var errorMsg = 'Server Side Error';
    var accept = req.header('Accept');
    if (accept.indexOf('json') != -1) {
        res.send('{ err: "' + errorMsg + '" }');
    } else if (accept.indexOf('javascript') != -1) {
        res.send('alert("' + errorMsg + '")');
    } else {
        res.send(errorMsg);
    }
});

mongoose.connect(config.conString);

var modelsPath = __dirname + '/app/models'
var modelFiles = fs.readdirSync(modelsPath)
modelFiles.forEach(function (file) {
    require(modelsPath + '/' + file)(mongoose)
})

var controllersPath = __dirname + '/app/controllers'
var controllerFiles = fs.readdirSync(controllersPath)
controllerFiles.forEach(function (file) {
    require(controllersPath + '/' + file)(app, mongoose, auth)
})

app.listen(config.port, function () {
    console.log("TraceInfo server listening on port %d in %s mode", app.address().port, app.settings.env);
});