'use strict';
var debug = require('debug')('my express app');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dataJ = require('./data/data.json');
var axios = require('axios');
var cors = require('cors');
const { check } = require('express-validator');

var corsOptions = {
    origin: /\.nocodeapi\.com$/,
    optionsSuccessStatus: 200
}

const helmet = require('helmet');


require('dotenv').config();

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/routes', routes);

app.get('/', function (req, res) {    
    res.render('index', {
        title: 'Madskillz Trade Geniuses',
        head: 'Forex rates',
        source: dataJ['source'],
        target: dataJ['target']
    });    
});

app.get('/handler', cors(corsOptions), [
    check('baseSource').isLength({ max: 3 }),
    check('quoteTarget').isLength({ max: 3 })
    ], async (req, res) => {
    try {
        const dat = req.query;
        const api_url = process.env.API_URL;
        const response = await axios.get(api_url + 'source=' + dat.baseSource + '&target=' + dat.quoteTarget);
        var timestamp = response.data.timestamp;
        var date = new Date(timestamp);
        res.render('handler', {
            title: 'Madskillz Trade Geniuses',
            head: 'Forex rates results:',
            baseSource: JSON.stringify(dat.baseSource),
            timestamp: +date.getDate()+
                "/"+(date.getMonth()+1)+
                "/"+date.getFullYear()+
                " "+date.getHours()+
                ":"+date.getMinutes()+
                ":" + date.getSeconds(),
            rates: JSON.stringify(response.data.rates)
        })
    }
    catch (err) {
        console.log(err)
    }
})

app.get('*', (req, res) => {
    res.status(500).json({ message: "error" })
})

app.get('/data/api.json', function (req, res) {
    res.render(res.json);    
    console.log('i got json!');
});

app.get("");

    // catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

module.exports = ('app.js');

