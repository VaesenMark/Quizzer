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
//todo id aanpassen naar ID en overal zo houden

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
                res.send("The're are no teams signed in for this quiz")
            }
            else{
                res.send(teams);
            }
        }
    });
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
            // Check if entered categoryId exists
            Category.findOne({_id: req.body.categoryId}, function (err, category) {
                if (err) {
                    res.send(err);
                }
                else {
                    if(category !=null) {
                        //todo Controleren of categorie niet al is voorgekomen.
                        if (quiz.rounds.find(x => x.categoryID === req.body.categoryId)) {
                            quiz.rounds.push({roundNumber: (quiz.rounds.length + 1), categoryID: req.body.categoryId});

                            quiz.save(function (err, char) {
                                if (err) {
                                    res.send(err);
                                }
                                else {
                                    res.status(200);
                                    res.json({message: "There is a Round add to quiz"});
                                }
                            });
                        }
                        else{
                            res.status(400);
                            res.json({message: "This category is al being use for this quiz"});
                        }
                    }
                    else{
                        res.status(404);
                        res.json({message: "There is no category"});
                    }
                }
            })
        }
        else{
            res.json({message: "The quiz can't be found"});
            res.status(404);
        }
    });

});


//Create Round Question
app.post('/:quizId/round/:roundId/question', function(req, res, next){
    const Quiz = mongoose.model('Quiz');
    Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
        if (err) {
            res.send(err);
        }
        else if(quiz != null) {
            //todo kijken of vraag niet al geweest is.
            //todo kijken of vraag bij de categorie hoort
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


//Get Round Question
app.get('/:quizId/round/:roundId/questions', function(req, res, next){
    const Quiz = mongoose.model('Quiz');
    const Category = mongoose.model('Category');
    const Question = mongoose.model('Question');
    Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
        if (err) {
            res.status(400)
            res.send(err);
        }
        else if (quiz != null) {
            var categoryId = quiz.rounds.find(x => x.roundNumber == req.params.roundId).categoryID;
            Category.findOne({_id: categoryId}, function (err, categorie) {
                if (err) {
                    res.status(400)
                    res.send(err);
                }
                else{

                    Question.find({category: categorie.categoryName}, function (err, questions) {
                        if (err) {
                            res.status(400)
                            res.send(err);
                        }
                        else {
                            console.log(questions);
                            res.status(200);
                            res.send(questions);
                        }
                    });
                }
            });

        }
        else{
            res.status(400);
            res.send(35);
        }
    });

});



// Get round question team answers
//    res.send("Set nieuwe vraag voor quiz "+req.params.quizId+" in ronde "+req.params.roundId+" en vraag  "+req.body.QuestionId+" ");
app.get('/:quizId/round/:roundId/question/:QuestionId/teamanswer',function(req, res, next) {
    const Quiz = mongoose.model('Quiz');

    Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
        if (err) {
            res.send(err);
        }
        else if(quiz != null) {
            var round = quiz.rounds.find(x => x.roundNumber == req.params.roundId);
            console.log(quiz, req.params.roundId);
            if(round != null) {
                const playedQuestions = round.playedQuestions.find(x=> x.questionID == req.params.QuestionId);
                res.json({result: playedQuestions.teamAnswers})
            }
            else{
                res.status(400);
                res.json({message: "This round is not being created"})
            }
        }
        else
        {
            res.status(404);
            res.json({message: "The're no quiz"});
        }
    });


});


//Accept/Deny team answer
app.put('/:quizId/round/:roundId/question/:QuestionId/teamanswer/:teamId',function(req, res){
    //todo subitems??
    const Quiz = mongoose.model('Quiz');
    Quiz.findOne(
        {
            _id: req.params.quizId
        },
        function (err, quiz) {
            if(err){
                res.send(err);
            }
            else{
                const teamAnswers = quiz.rounds.find(x => x.roundNumber == req.params.roundId)
                    .playedQuestions.find(x => x.questionNumber == req.params.QuestionId)
                    .teamAnswers.find(x=> x.teamID == req.params.teamId);
                teamAnswers.approved = req.body.approved;
                quiz.save(function (err, char) {
                    if (err) {
                        res.status(400);
                        res.json({message: "The answers is not being controled by the quizmaster",err})
                    }
                    else {
                        res.status(200);
                        res.json({message: "The answers is being checked by the quizmaster"})
                    }
                });
            }
        });
    });

//todo weggooien?
/*
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
*/



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
app.post('/:quizId/round/:roundId/question/:QuestionId/teamanswer/:teamId',function(req, res, next) {
    try {
        const Quiz = mongoose.model('Quiz');
        Quiz.findOne(
            {
                _id: req.params.quizId
            },
            function (err, quiz) {
                try {
                    if (err) {
                        throw new Error(err);
                    }
                    if (quiz === null) {
                        res.status(404);
                        res.json({message: "Unknown quiz"});
                        return;
                    }

                    // TODO check if team has already submitted a question
                    quiz.rounds.find(x => x.roundNumber === 1)
                        .playedQuestions.find(x => x.questionNumber === 1)
                        .teamAnswers.push({teamID: 2, answer: "Blue", approved: false});

                    quiz.save(function (err, quiz) {
                        try {
                            if (err) {
                                throw new Error(err);
                            }
                            res.json({message: "Question inserted"});
                            // TODO notify quizmaster
                        }
                        catch(exception) {
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
            }
        )
    }
    catch(exception) {
        console.log(exception);
        res.status(500);
        res.json({message: "A server error occured"});
    }

    res.send("vraag van quiz35 " + req.params.quizId + " in ronde " + req.params.roundId + " en vraag  " + req.params.QuestionId + " als antwoord " + req.body.answer+" van team "+ req.params.teamId);
});

//Change answer
app.put('/:quizId/round/:roundId/question/:QuestionId/teamanswer/:teamId',function(req, res, next) {
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