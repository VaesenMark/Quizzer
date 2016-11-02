const mongoose = require('mongoose');
require('../MongooseModels/connection');
require('../MongooseModels/Team');
require('../MongooseModels/Category');
require('../MongooseModels/Question');
require('../MongooseModels/QuizMaster');
require('../MongooseModels/Quiz');

var express = require('express');
var bodyParser = require('body-parser');

var fs = require('fs');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use(function(req, res, next) {
    console.log(req.path , res);
    next();
});

//Quizmaster login
app.post('/login', function(req, res, next){
    const QuizMaster = mongoose.model('QuizMaster');
    console.log(req.body);
    console.log("_______________________________________________");
    QuizMaster.findOne({username: req.body.username, password: req.body.password}, function (err, quizMaster) {
        if (err) {
            res.status(400);
            res.json({message: "Quizmaster heeft het verkeerde wachtwoord opgegeven"})
        }
        else {
            if(quizMaster == null) {
                res.status(400);
                res.json({message: "Quizmaster heeft het verkeerde wachtwoord opgegeven"})
            }
            else{
            console.log(quizMaster);
            res.status(200);
            res.json(quizMaster);
            }
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