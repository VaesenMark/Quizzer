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

//Quizmaster login
app.post('/login', function(req, res, next){
    const QuizMaster = mongoose.model('QuizMaster');
    console.log(req.body.username);
    QuizMaster.findOne({username: req.body.username, password: req.body.password}, function (err, quizMaster) {
        if (err || quizMaster == null) {
            res.status(400);
            res.json({message: "Quizmaster have given the wrong userName or Password"})
        }
        else {
            console.log(quizMaster);
            res.status(200);
            res.json(quizMaster);
        }

    });
});

app.get('/:quizmasterID/quiz',  function(req, res, next){
    const Quiz = mongoose.model('Quiz');
    Quiz.find({quizMasterID: req.params.quizmasterID, status: {
        $lt: 4
    }}, function (err, quiz) {
        if(err){
            res.status(500);
            res.json({message: err})
        }
        else{
            res.status(200);
            res.json({message: quiz})
        }

    });
});


//quizmaster logout
app.get('/logout', function(req, res, next){
    res.send("Gebruiker is uitgelogd");
});

module.exports = app;