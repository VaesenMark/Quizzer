var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

var quizmaster = require('./Routes/quizmaster');
var scorebord = require('./Routes/scorebord');
var team = require('./Routes/team');
var quiz = require('./Routes/quiz');

app.use(function(req, res, next) {
    // Allow cross domain requests.
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Cookie');
    next();
});

app.use(function(req, res, next) {
    console.log(req.path , res);
    next();
});

app.use(session({resave: true, saveUninitialized: true, secret: "asdfasdfsdf"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/quizmaster', quizmaster);
app.use('/scorebord', scorebord);
app.use('/team', team);
app.use('/quiz', quiz);
app.listen(3000);