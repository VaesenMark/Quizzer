const mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*
Quizmaster
*/

//Start quiz
app.get('/', function(req, res, next){
    res.send("De quiz met id: " +req.body.quizId +" is gestart ");
});

//Get teams appliances
app.get('/:quizId/teams', function(req, res, next){
    res.send("Voor quiz met id: " +req.params.quizId +" alle teams ophalen ");
});


//Get teams appliances
app.get('/:quizId/team/:teamId', function(req, res, next){
    res.send("get informatie van quiz " +req.params.quizId+ " voor team: "+ req.params.teamId);
});


//Create Round
app.get('/:quizId/round', function(req, res, next){
    res.send("nieuwe ronde voor quiz " +req.params.quizId);
});

//Create Round Question
app.post('/:quizId/round/:roundId/question/', function(req, res, next){
    res.send("Set nieuwe vraag voor quiz "+req.params.quizId+" in ronde "+req.params.roundId+" en vraag  "+req.body.QuestionId+" ");
});

//Get round question info
app.get('/:quizId/round/:roundId/question/:QuestionId', function(req, res, next){
    res.send("Get vraag van quiz "+req.params.quizId+" in ronde "+req.params.roundId+" en vraag  "+req.params.QuestionId+" ");
});

// Get round question team answers
app.get('/:quizId/round/:roundId/question/:QuestionId/teamanswer',function(req, res, next) {
    res.send("vraag van quiz " + req.params.quizId + " in ronde " + req.params.roundId + " en vraag  " + req.params.QuestionId + " als antwoord " + req.body.answer +" van "+ req.body.teamId);
});


//Accept/Deny team answer
app.put('/:quizId/round/:roundId/question/:QuestionId/teamanswer/:teamId',function(req, res){
    res.send("vraag van quiz "+req.params.quizId+" in ronde "+req.params.roundId+" en vraag  "+req.params.QuestionId+" voor "+req.params.teamId + " is " + req.body.approved);
});

//Scoreboard app
app.get('/:quizId', function(req, res, next){
    res.send("get informatie van quiz " +req.params.quizId);
});

//Get information from quiz en one team
app.get('/:quizId/team/:teamId', function(req, res, next){
    res.send("get informatie van quiz " +req.params.quizId+"en team"+req.params.teamId);
});

//Close quiz
app.put('/:quizId',function(req, res){
    res.send("quiz "+req.body.approved+ " is gesloten");
});



/*

TeamApp
 */

//Submit answer
app.post('/:quizId/round/:roundId/question/:QuestionId/teamanswer/:tgeamId',function(req, res, next) {
    res.send("vraag van quiz35 " + req.params.quizId + " in ronde " + req.params.roundId + " en vraag  " + req.params.QuestionId + " als antwoord " + req.body.answer+" van team "+ req.params.teamId);
});

//Change answer
app.put('/:quizId/round/:roundId/question/:QuestionId/teamanswer/:tgeamId',function(req, res, next) {
    res.send("vraag van quiz35 " + req.params.quizId + " in ronde " + req.params.roundId + " en vraag  " + req.params.QuestionId + " heeft nu antwoord " + req.body.answer+" van team "+ req.params.teamId);
});

module.exports = app, router;