var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();

var quizmaster = require('./Routes/quizmaster');
var scorebord = require('./Routes/scorebord');
var team = require('./Routes/team');
var quiz = require('./Routes/quiz');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/quizmaster', quizmaster);
app.use('/scorebord', scorebord);
app.use('/team', team);
app.use('/quiz', quiz);
app.listen(3000);