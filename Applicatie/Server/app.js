const mongoose = require('mongoose');
require('./MongooseModels/connection');
require('./MongooseModels/Team');
require('./MongooseModels/Category');
require('./MongooseModels/Question');
require('./MongooseModels/QuizMaster');
require('./MongooseModels/Quiz');
mongoose.Promise = global.Promise;

var express = require('express');

var sessionParser = require('express-session')({
    secret:"secret",
    resave: true,
    saveUninitialized: true
});

var cors = require('cors');

var ws = require('ws');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');

var app = express();


var httpServer = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Cookie');
    next();
});


app.use(sessionParser);


var quizmaster = require('./Routes/quizmaster');
var scoreboard = require('./Routes/scorebord');
var team = require('./Routes/team');
var quiz = require('./Routes/quiz');
app.use('/quizmaster', quizmaster);
app.use('/scoreboard', scoreboard);
app.use('/team', team);
app.use('/quiz', quiz);

// Get question
app.get('/question/:questionId', function(req, res, next) {
    console.log('1');
    try {
        const Question = mongoose.model('Question');
        Question.findOne(
            {
                _id: req.params.questionId
            },
            function(err, question) {
                console.log('2',question);
                try {
                    if (err) {
                        throw new Error(err);
                    }
                    if(!question) {
                        res.status(404);
                        res.json({message: "Question not found"});
                        return;
                    }
                    res.json(question);
                }
                catch(exception) {
                    console.log(exception);
                    res.status(500);
                    res.json({message: "A server error occured"});
                }
            }
        );
    }
    catch(exception) {
        console.log(exception);
        res.status(500);
        res.json({message: "A server error occured"});
    }
});

httpServer.listen( 3000,
    function() {
        console.log("The Server is lisening on port 3000.")
    });


module.exports = httpServer;

require('./websockets');