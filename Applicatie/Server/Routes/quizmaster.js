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
    if(req.body.username === req.body.password){
        res.send("Quizmaster: "+req.body.username+" is ingelogd");
    }
    else{
        res.send("Quizmaster heeft het verkeerde wachtwoord opgegeven");
    }
});

//quizmaster logout
app.get('/logout', function(req, res, next){
    res.send("Gebruiker is uitgelogd");
});

module.exports = app;