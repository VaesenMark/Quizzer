var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.post('/login', function(req, res, next){
    if(req.body.username === req.body.password){
        res.send("Gebruiker: "+req.body.username+" is ingelogd");
    }
    else{
        res.send("Gebruiker heeft het verkeerde wachtwoord opgegeven");
    }
});

app.post('/team/:teamId/naam/:teamnaam', function(req, res, next){
    res.send("team met id "+req.params.teamId + "heeft nu als teamnaam "+req.params.teamNaam);
});



router.route('/quiz/:quizId/round/:roundId/question/:QuestionId/teamanswer/:answer')
    .post(function(req, res, next) {
        res.send("vraag van quiz35 " + req.params.quizId + " in ronde " + req.params.roundId + " en vraag  " + req.params.QuestionId + " als antwoord" + req.params.answer);
    })
    .get(function(req, res, next) {
        res.send("vraag van quiz " + req.params.quizId + " in ronde " + req.params.roundId + " en vraag  " + req.params.QuestionId + " als antwoord" + req.params.answer);
    });


app.get('/logout', function(req, res, next){
    res.send("Gebruiker is uitgelogd");
});

module.exports = app, router;