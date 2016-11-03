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


app.get('/:quizmasterId/quiz',  function(req, res, next){
    const Quiz = mongoose.model('Quiz');
    Quiz.find({quizMasterID: req.params.quizmasterId, status: {
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


app.get('/categories', function(req, res, next) {
    const Category = mongoose.model('Category');
    Category.find({},function(err, categories){
        if (err) {
            res.status(400);
            res.json({message: "Quizmaster heeft het verkeerde wachtwoord opgegeven"})
        }
        else {
                res.status(200);
                res.json(categories)

        }
    });
});

//quizmaster logout
app.get('/logout', function(req, res, next){
    res.send("Gebruiker is uitgelogd");
});

module.exports = app;