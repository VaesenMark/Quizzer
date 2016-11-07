const mongoose = require('mongoose');
require('../MongooseModels/connection');
require('../MongooseModels/Team');
require('../MongooseModels/Category');
require('../MongooseModels/Question');
require('../MongooseModels/QuizMaster');
require('../MongooseModels/Quiz');


var express = require('express');
var fs = require('fs');
var app = express();

// ------ Quizmaster Routes ------

//Quizmaster login
app.post('/login', function(req, res, next){
    try {
        const QuizMaster = mongoose.model('QuizMaster');
        QuizMaster.findOne({username: req.body.username, password: req.body.password}, function (err, quizMaster) {
            try {
                if (err || quizMaster == null) {
                    res.status(400);
                    res.json({message: "Quizmaster have given the wrong userName or Password"})
                }
                else {
                    res.status(200);
                    res.json(quizMaster);
                }
            }
            catch (exception) {
                console.log(exception);
                res.status(500);
                res.json({message: "A server error occured"});
            }
        });
    }
    catch (exception) {
        console.log(exception);
        res.status(500);
        res.json({message: "A server error occured"});
    }
});

app.get('/:quizmasterID/quiz',  function(req, res, next){
    try {
        const Quiz = mongoose.model('Quiz');
        Quiz.find({quizMasterID: req.params.quizmasterID, status: {$lt: 4}}, function (err, quiz) {
            try {

                if (err) {
                    res.status(500);
                    res.json({message: err})
                }
                else if (quiz.length > 1) {
                    res.status(200);
                    res.json({message: quiz})
                }
                else {
                    res.status(400);
                    res.json({message: "Create a new quiz"});
                }
            }
            catch (exception) {
                console.log(exception);
                res.status(500);
                res.json({message: "A server error occured"});
            }

        });
    }
    catch (exception) {
        console.log(exception);
        res.status(500);
        res.json({message: "A server error occured"});
    }
});

//quizmaster logout
app.get('/logout', function(req, res, next){
    res.send("Gebruiker is uitgelogd");
});



module.exports = app;