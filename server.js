// server.js (Express 4.0)

// modules =================================================
var main                = require('./app/routes/main');
var express             = require('express');
var http                = require('http');
var path                = require('path');
var morgan              = require('morgan');
var bodyParser          = require('body-parser');
var methodOverride      = require('method-override');
var app                 = express();

// configuration ===========================================
app.set('port', process.env.PORT || 8888);
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));

app.get('/', main.index);
app.get('/about', main.about);
app.post('/api/summarize', main.summarize);
app.post('/api/classify', main.classify);
app.post('/api/classifybysubtopics', main.classifybysubtopics);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
