var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/:quizId/team/:teamnaam', function(req, res, next){
    res.send("Voor quiz met id: " +req.params.quizId +" is teamnaam "+req.params.teamnaam+" toegevoegd");
});

app.get('/:quizId/', function(req, res, next){
    res.send("get informatie van quiz " +req.params.quizId);
});

app.get('/:quizId/team/:teamId', function(req, res, next){
    res.send("get informatie van quiz " +req.params.quizId+ " voor team: "+ req.params.teamId);
});


app.get('/:quizId/team/:teamnaam', function(req, res, next){
    res.send("Voor quiz met id: " +req.params.quizId +" is teamnaam "+req.params.teamnaam+" toegevoegd");
});

app.get('/:quizId/round/:roundId/question/:QuestionId', function(req, res, next){
    res.send("Get vraag van quiz "+req.params.quizId+" in ronde "+req.params.roundId+" en vraag  "+req.params.QuestionId+" ");
});

app.put('/:quizId/round/:roundId/question/:QuestionId/teamanswer/:answer',function(req, res){
    res.send("vraag van quiz "+req.params.quizId+" in ronde "+req.params.roundId+" en vraag  "+req.params.QuestionId+" als antwoord "+req.params.answer);
});

 app.post('/:quizId/round/:roundId/question/:QuestionId/teamanswer/:answer',function(req, res, next) {
 res.send("vraag van quiz35 " + req.params.quizId + " in ronde " + req.params.roundId + " en vraag  " + req.params.QuestionId + " als antwoord " + req.params.answer);
 });

 app.get('/:quizId/round/:roundId/question/:QuestionId/teamanswer/:answer',function(req, res, next) {
 res.send("vraag van quiz " + req.params.quizId + " in ronde " + req.params.roundId + " en vraag  " + req.params.QuestionId + " als antwoord" + req.params.answer);
 });


module.exports = app, router;