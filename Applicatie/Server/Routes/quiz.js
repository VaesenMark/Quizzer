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


/*
Quizmaster
*/
//todo id aanpassen naar ID en overal zo houden

//Start quiz
app.post('/', function(req, res, next) {
    const Quiz = mongoose.model('Quiz');
    const QuizMaster = mongoose.model('QuizMaster');
console.log(req.body.quizMasterID);
    QuizMaster.findOne({_id: req.body.quizMasterID}, function (err, quizMaster) {
        if (err) {
            res.status(500);
            res.json({message: err})
        }
        else {
            console.log(quizMaster);
            if (quizMaster != null) {
                var quiz = new Quiz({password: createRandomString(8), quizMasterID: req.body.quizMasterID, status: 1});
                quiz.save(function (err, char) {
                    if (err) {
                        res.status(500);
                        res.json({message: err})
                    }
                    else {
                        res.status(200);
                        res.json({message: "The're is a new quiz created"})
                    }

                });
            }
            else{
                res.status(400);
                res.json({message:"There is quizmaster wo not exists"})
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
            res.status(500)
            res.json({message: err});
        }
        else{
            console.log(teams.length);
            if(teams.length <= 0){
                res.status(200);
                res.json({message: "The're are no teams signed in for this quiz"});
            }
            else{
                res.status(404)
                res.json({message:teams});
            }
        }
    });
});



//Create Round
app.post('/:quizID/round', function(req, res, next){
    const Quiz = mongoose.model('Quiz');
    const Category = mongoose.model('Category');

    Quiz.findOne({_id: req.params.quizID}, function (err, quiz) {
        if (err) {
            res.status(500);
            res.json({message: err});
        }
        else if(quiz != null) {
            // Check if entered categoryId exists
            Category.findOne({_id: req.body.categoryID}, function (err, category) {
                if (err) {
                    res.status(500);
                    res.json({message: err});
                }
                else {
                    if(category != null) {
                        console.log("test",req.body.categoryID, !quiz.rounds.find(x => x.categoryID == req.body.categoryID));
                        //todo Controleren of categorie niet al is voorgekomen.
                        if (!quiz.rounds.find(x => x.categoryID == req.body.categoryID)) {
                            console.log(category,quiz);
                            quiz.rounds.push({roundNumber: (quiz.rounds.length + 1), categoryID: req.body.categoryID});

                            quiz.save(function (err, char) {
                                if (err) {
                                    res.status(500);
                                    res.json({message: err});
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
app.post('/:quizId/round/:roundNumber/question', function(req, res, next){
    const Quiz = mongoose.model('Quiz');
    Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
        if (err) {
            res.status(400);
            res.json({message: err});
        }
        else if(quiz != null) {
            //todo kijken of vraag bij de categorie hoort
            //is het mogelijk om vragen in vorige ronde toe te voegen?
            if(quiz.rounds.length == req.params.roundNumber) {
                let round = quiz.rounds.find(x => x.roundNumber == req.params.roundNumber);
                var questionNumber = round.playedQuestions.length +1;
                if(questionNumber <= 12) {

                    if (round.playedQuestions.length == 0 ||round.playedQuestions.find(x => x.questionID !== req.body.categoryID)) {
console.log(parseInt(req.body.questionID));
                        round.playedQuestions.push({
                            questionNumber: questionNumber,
                            question: req.body.question
                        });
                        console.log(round);
                        quiz.save(function (err, char) {
                            if (err) {
                                res.status(500);
                                res.json({message: err})
                            }
                            else {
                                res.status(200);
                                res.json({message: "There is a question add to quiz/round " + req.params.roundNumber, questionNumber: questionNumber});
                            }
                        });
                    }
                    else{
                        res.status(404);
                        res.json({message:"This Question is played in this round "});
                    }
                }

                else{
                    res.status(404);
                    res.json({message:"There are 12 questions in this round "});
                }
            }
            else
            {
                res.status(400)
                res.json({message: "U are not in the recent round"})

            }
        }
        else
        {
            console.log("err");
            res.status(500)
            res.json({message: "error"})

        }
    });
});

app.get('/:quizID/categories', function(req, res, next) {
    //todo eruit filteren de categoriën die al zijn gekozen
    const Category = mongoose.model('Category');
    const Quiz = mongoose.model('Quiz');
    Category.find({}, function (err, categories) {
        if (categories != null) {
            let notUsedCategories = '';
            Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
                if (err) {
                    res.status(500);
                    res.json({message: "A server error occured"});
                }
                else {
                    if (err) {
                        res.status(500);
                        res.json({message: "A server error occured"});
                    }
                    else {
                        res.status(200);
                        res.json(categories)

                    }
                }
            });
        }
    });
});

//Get Round Question
app.get('/:quizId/round/:roundNumber/questions', function(req, res, next){
    try {
        console.log(req.params.quizId, req.params.roundNumber);
        const Quiz = mongoose.model('Quiz');
        const Category = mongoose.model('Category');
        const Question = mongoose.model('Question');
        Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
            console.log(quiz);
            if (err) {
                res.status(400);
                res.json({message:err});
            }
            else if (quiz != null) {
                var categoryId = quiz.rounds.find(x => x.roundNumber == req.params.roundNumber).categoryID;
                Category.findOne({_id: categoryId}, function (err, categorie) {
                    if (err) {
                        res.status(400);
                        res.json({message:err});
                    }
                    else {

                        Question.find({category: categorie.categoryName}, function (err, questions) {
                            if (err) {
                                res.status(400)
                                res.json({message: err});
                            }
                            else {
                                res.status(200);
                                res.json({message: questions});
                            }
                        });
                    }
                });

            }
            else {
                res.status(400);
                res.json({message: "There is no quiz"});
            }
        });
    }
    catch (exception) {
        res.status(500);
        res.json({message: "A server error occured"});
    }

});


//Get Quiz Categories that aren't play
app.get('/:quizId/categories', function(req, res, next){
    try {
        const Quiz = mongoose.model('Quiz');
        const Category = mongoose.model('Category');
        Category.find({}, function (err, categorie) {
            if (err) {
                res.status(400)
                res.json({message:err});
            }
            else if (categorie != null) {
                res.status(200);
                res.json({message: categorie});
            }
            else {
                res.status(400);
                res.json({message: "There is no quiz"});
            }
        });
    }
    catch (exception) {
        console.log(exception);
        res.status(500);
        res.json({message: "A server error occured"});
    }

});

// Get round question team answers
//    res.send("Set nieuwe vraag voor quiz "+req.params.quizId+" in ronde "+req.params.roundNumber+" en vraag  "+req.body.questionNumber+" ");
app.get('/:quizId/round/:roundNumber/question/:questionNumber/teamanswer',function(req, res, next) {
    const Quiz = mongoose.model('Quiz');

    Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
        if (err) {
            res.status(500);
            res.json({message: "A server error occured"});
        }
        else if(quiz != null) {
            try {
                var round = quiz.rounds.find(x => x.roundNumber == req.params.roundNumber);
                console.log(quiz, req.params.roundNumber);
                if (round != null) {
                    const playedQuestions = round.playedQuestions.find(x=> x.questionID == req.params.questionNumber);
                    res.status(200);
                    res.json({result: playedQuestions.teamAnswers})

                }
                else{
                    res.status(400);
                    res.json({message: "This round is not being created"})
                }
            }
            catch (exception) {
                console.log(exception);
                res.status(500);
                res.json({message: "A server error occured"});
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
app.put('/:quizId/round/:roundNumber/question/:questionNumber/teamanswer/:teamId',function(req, res){
    //todo subitems??
    try {
        const Quiz = mongoose.model('Quiz');
        Quiz.findOne(
            {
                _id: req.params.quizId
            },
            function (err, quiz) {
                if (err) {
                    res.send(err);
                }
                else {
                    const teamAnswers = quiz.rounds.find(x => x.roundNumber == req.params.roundNumber)
                        .playedQuestions.find(x => x.questionNumber == req.params.questionNumber)
                        .teamAnswers.find(x=> x.teamID == req.params.teamId);
                    teamAnswers.approved = req.body.approved;
                    quiz.save(function (err, char) {
                        try {
                            if (err) {
                                res.status(400);
                                res.json({message: "The answers is not being controled by the quizmaster", err})
                            }
                            else {
                                res.status(200);
                                res.json({message: "The answers is being checked by the quizmaster"})
                            }
                        }
                        catch (exception) {
                            console.log(exception);
                            res.status(500);
                            res.json({message: "A server error occured"});
                        }
                    });
                }
            })
    }
    catch (exception) {
            console.log(exception);
            res.status(500);
            res.json({message: "A server error occured"});
        }
    });

//todo weggooien?
/*
//Get round question info
app.get('/:quizId/round/:roundNumber/question/:questionNumber', function(req, res, next){
    //todo Wat wil je hier precies krijgen???
    res.send("Get vraag van quiz "+req.params.quizId+" in ronde "+req.params.roundNumber+" en vraag  "+req.params.questionNumber+" ");
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
app.post('/:quizId/round/:roundNumber/question/:questionNumber/teamanswer/:teamId',function(req, res, next) {
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

    res.send("vraag van quiz35 " + req.params.quizId + " in ronde " + req.params.roundNumber + " en vraag  " + req.params.questionNumber + " als antwoord " + req.body.answer+" van team "+ req.params.teamId);
});

//Change answer
app.put('/:quizId/round/:roundNumber/question/:questionNumber/teamanswer/:teamId',function(req, res, next) {
    res.send("vraag van quiz35 " + req.params.quizId + " in ronde " + req.params.roundNumber + " en vraag  " + req.params.questionNumber + " heeft nu antwoord " + req.body.answer+" van team "+ req.params.teamId);
});

function createRandomString(characters){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < characters; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = app;