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

/*
Quizmaster
*/

//Start quiz
app.post('/', function(req, res, next) {
    const Quiz = mongoose.model('Quiz');
    const QuizMaster = mongoose.model('QuizMaster');

    QuizMaster.findOne({_id: req.body.quizmasterid}, function (err, quizMaster) {
        if (err) {
            res.send(err);
        }
        else {
            console.log(quizMaster);
            if (quizMaster != null) {
                var quiz = new Quiz({password: createRandomString(8), quizMasterID: req.body.quizmasterid, status: 1});
                quiz.save(function (err, char) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(quizMaster);
                        console.log("The're is a new quiz created");
                    }

                });
            }
            else{
                res.send("There is quizmaster wo not exists")
            }
        }
    });
});


//Get teams appliances
app.get('/:quizId/teams', function(req, res, next){
    //Todo  informatie van teams krijgen
    const Team = mongoose.model('Team');

    Team.find({quizID: req.params.quizId}, function (err, teams){
        if(err){
            res.send(err);
        }
        else{
            console.log(teams.length);
            if(teams.length <= 0){
                res.send("The're are nog teams for this quiz")
            }

            else{
                console.log(teams);
                res.send(teams);
            }
        }
    });
});


//Get teams appliances
app.get('/:quizId/team/:teamId', function(req, res, next){
    //Todo  informatie van team krijgen
    res.send("get informatie van quiz " +req.params.quizId+ " voor team: "+ req.params.teamId);
});


//Create Round
app.post('/:quizId/round', function(req, res, next){
    const Quiz = mongoose.model('Quiz');
    const Category = mongoose.model('Category');

    Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
        if (err) {
            res.send(err);
        }
        else if(quiz != null) {
            Category.findOne({_id: req.body.categoryId}, function (err, category) {
                if (err) {
                    res.send(err);
                }
                else {
                    if(category !=null) {
                        //todo Controleren of categorie niet al is voorgekomen.
                        quiz.rounds.push({roundNumber: (quiz.rounds.length + 1), categoryID: req.body.categoryId});

                        quiz.save(function (err, char) {
                            if (err) {
                                res.send(err);
                            }
                            else {
                                res.send("There is a Round add to quiz");
                            }
                        });
                    }
                    else{
                        res.send("There is no category");
                    }
                }
            })
        }
        else{
            res.send("There go something wrong. Try again!!");
        }
    });

});


//Create Round Question
app.post('/:quizId/round/:roundId/question/', function(req, res, next){
    const Quiz = mongoose.model('Quiz');
    res.send("Set nieuwe vraag voor quiz "+req.params.quizId+" in ronde "+req.params.roundId+" en vraag  "+req.body.QuestionId+" ");
    Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
        if (err) {
            res.send(err);
        }
        else if(quiz != null) {
            //todo kijken of vraag niet al geweest is.
            //is het mogelijk om vragen in vorige ronde toe te voegen?
            if(quiz.rounds.length <= req.params.roundId) {
                quiz.rounds[(req.params.roundId - 1)].playedQuestions.push({
                    questionNumber: req.body.questionNumber,
                    questionID: req.body.questionId
                });
                quiz.save(function (err, char) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.send("There is a question add to quiz/round " + req.params.roundId);
                    }
                });
            }
        }
        else
        {
            res.send("error")
        }
    })
});


// Get round question team answers
app.get('/:quizId/round/:roundId/question/:QuestionId/teamanswer',function(req, res, next) {
    //todo subitems??
    const Quiz = mongoose.model('Quiz');
    res.send("Set nieuwe vraag voor quiz "+req.params.quizId+" in ronde "+req.params.roundId+" en vraag  "+req.body.QuestionId+" ");
    Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
        if (err) {
            res.send(err);
        }
        else if(quiz != null) {
            //todo kijken of vraag niet al geweest is.
            //is het mogelijk om vragen in vorige ronde toe te voegen?
            if(quiz.rounds[(req.params.roundId - 1)]) {
            }
            else{
                res.send("error")
            }
        }
        else
        {
            res.send("error")
        }
    });
    res.send("vraag van quiz " + req.params.quizId + " in ronde " + req.params.roundId + " en vraag  " + req.params.QuestionId + " als antwoord " + req.body.answer +" van "+ req.body.teamId);


});


//Accept/Deny team answer
app.put('/:quizId/round/:roundId/question/:QuestionId/teamanswer/:teamId',function(req, res){
    //todo subitems??
    res.send("vraag van quiz "+req.params.quizId+" in ronde "+req.params.roundId+" en vraag  "+req.params.QuestionId+" voor "+req.params.teamId + " is " + req.body.approved);
});


//Get round question info
app.get('/:quizId/round/:roundId/question/:QuestionId', function(req, res, next){
    //todo Wat wil je hier precies krijgen???
    res.send("Get vraag van quiz "+req.params.quizId+" in ronde "+req.params.roundId+" en vraag  "+req.params.QuestionId+" ");
});

//Get information from quiz en one team
app.get('/:quizId/team/:teamId', function(req, res, next){
    //todo Wat wil je hier precies krijgen???
    res.send("get informatie van quiz " +req.params.quizId+"en team"+req.params.teamId);
});




//Close quiz
app.put('/close/:quizId',function(req, res) {
    const Quiz = mongoose.model('Quiz');

    Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
        if (err) {
            res.send(err);
        }
        else if (quiz != null) {
            quiz.update({status : 4});
            //todo status 4?
            quiz.save(function (err, char) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send("The quiz is ended");
                }
            });
        }
        else {
            res.send("There go something wrong. Try again!! The quiz is still open");
        }
    });
});


/*

Scorebord
 */
//Scoreboard app
app.get('/:quizId', function(req, res, next){
    res.send("get informatie van quiz " +req.params.quizId);
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

function createRandomString(characters){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < characters; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = app;