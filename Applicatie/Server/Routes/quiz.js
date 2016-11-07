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


app.put('/:quizID/round/close', function(req, res, next) {
    const Quiz = mongoose.model('Quiz');
    const Team = mongoose.model('Team');
    Quiz.findOne({_id: req.params.quizID}, function (err, quiz) {
        try {
            if (err) {
                res.status(500);
                res.json({message: err})
            }
            else {
                if (!quiz) {
                    res.status(404);
                    res.json({message: "No quizzes found"})
                }
                else {
                    let teamScores = [];
                    let playedquestions = quiz.rounds[(quiz.rounds.length - 1)].playedQuestions;
                    playedquestions.forEach(function (playedQuestion) {
                        playedQuestion.teamAnswers.forEach(function (teamAnswer) {
                            let exist = false;
                            teamScores.forEach(function (teamScore) {
                                if (teamScore.teamID == teamAnswer.teamID) {
                                    exist = true;
                                    if(teamAnswer.approved){
                                        teamScore.points=teamScore.points+1;
                                    }
                                }
                            });
                            if (!exist) {
                                var point = 0
                                if(teamAnswer.approved) {
                                    point = 1;
                                }
                                var teamscore = {teamID: teamAnswer.teamID,points: point};
                                teamScores.push(teamscore);
                            }
                        });
                    });
                    teamScores.sort(function(a, b){return b-a});
                    let place = 1;
                    var error = null;
                    teamScores.forEach(function (teamscore) {
                        let points = 0.1;
                        if(place == 1){
                            points = 4;
                        }
                        else if(place == 2){
                            points = 2;
                        }
                        else if(place == 3){
                            points = 1;
                        }

                        place++;
                        Team.findOne({_id: teamscore.teamID}, function (err, team) {
                            if (err) {
                                res.status(500);
                                res.json({message: err})
                            }
                            else {
                                if (!team) {
                                    res.status(404);
                                    res.json({message: "No quizzes found"})
                                }
                                else {
                                    team.roundPoints += points;
                                    team.save(function (err, char) {
                                        if (err) {
                                            error = err;
                                        }
                                        else {
                                        }
                                    });
                                }
                            }
                        })
                    })
                    if(error){
                        res.status(500);
                        res.json({message: error});
                    }
                    else{
                        res.status(200);
                        res.json({message: "points are changed"});
                    }
                }
            }
        }
        catch (exception) {
            console.log(exception);
            res.status(500);
            res.json({message: "A server error occured"});
        }
    });
});

//Get quizzes
app.get('/', function(req, res, next) {
    try {
        const Quiz = mongoose.model('Quiz');

        Quiz.find({}, function (err, quizzes) {
            try {
                if (err) {
                    res.status(500);
                    res.json({message: err})
                }
                else {
                    if (!quizzes) {
                        res.status(404);
                        res.json({message: "No quizzes found"})
                    }
                    else {
                        res.status(200);
                        res.json(quizzes);
                    }
                }
            }
            catch (exception) {
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
});

//Start quiz
app.post('/', function(req, res, next) {
    try {
        const Quiz = mongoose.model('Quiz');
        const QuizMaster = mongoose.model('QuizMaster');

        QuizMaster.findOne({_id: req.body.quizMasterID}, function (err, quizMaster) {
            try {
                if (err) {
                    res.status(500);
                    res.json({message: err})
                }
                else {
                    if (quizMaster) {
                        var quiz = new Quiz({
                            password: createRandomString(8),
                            quizMasterID: req.body.quizMasterID,
                            status: 1
                        });
                        quiz.save(function (err, char) {
                            try {
                                if (err) {
                                    res.status(500);
                                    res.json({message: err})
                                }
                                else {
                                    res.status(200);
                                    res.json({message: "The're is a new quiz created"})
                                }
                            }
                            catch (exception) {
                                console.log(exception);
                                res.status(500);
                                res.json({message: "A server error occured"});
                            }

                        });
                    }
                    else {
                        res.status(400);
                        res.json({message: "There is quizmaster wo not exists"})
                    }
                }
            }
            catch (exception) {
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
});

app.get('/:quizID/teams', function(req, res, next) {
    try {
        const Quiz = mongoose.model('Quiz');
        const Team = mongoose.model('Team');
        Quiz.findOne({_id: req.params.quizID}, function (err, quiz) {
            try {
                if (err) {
                    res.status(500);
                    res.json({message: err});
                }
                else {

                    if (quiz.status == 1) {
                        quiz.status = 2;
                    }
                    quiz.save(function (err, char) {
                        if (err) {

                            res.status(500);
                            res.json({message: err})
                        }
                        Team.find({quizID: req.params.quizID}, function (err, teams) {
                            try {
                                if (err) {
                                    res.status(500);
                                    res.json({message: err});
                                }
                                else if (teams != null) {
                                    res.status(200);
                                    res.json({teams: teams})
                                }
                                else {
                                    res.status(400);
                                    res.json({message: "there are no teams for this quiz"})
                                }
                            }
                            catch (exception) {
                                console.log(exception);
                                res.status(500);
                                res.json({message: "A server error occured"});
                            }
                        })
                    });
                }
            }
            catch (exception) {
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
});

//Get teams appliances
app.get('/:quizId/teams', function(req, res, next){
    try {
        //Todo  informatie van teams krijgen
        const Team = mongoose.model('Team');

        Team.find({quizID: req.params.quizId}, function (err, teams) {
            try {
                if (err) {
                    res.status(500)
                    res.json({message: err});
                }
                else {
                    if (teams.length <= 0) {
                        res.status(400);
                        res.json({message: "The're are no teams signed in for this quiz"});
                    }
                    else {
                        res.status(200)
                        res.json({teams: teams});
                    }
                }
            }
            catch (exception) {
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
});

app.put('/:quizID/team/:teamID', function(req, res, next) {
    try {
        const Team = mongoose.model('Team');
        Team.find({quizID: req.params.quizID, approved: true}, function (err, team) {
            try {
                if (err) {
                    res.status(500);
                    res.json({message: err});
                }
                else if (team.length >= 6) {
                    res.status(400);
                    res.json({message: "There are 6 team in this quiz"});
                }
                else {
                    Team.findOne({_id: req.params.teamID}, function (err, team) {
                        try {
                            if (err) {
                                res.status(500);
                                res.json({message: err});
                            }
                            else {
                                if (team.quizID == req.params.quizID) {
                                    team.approved = true;
                                    team.update({approved: true});
                                    team.save(function (err, char) {
                                        if (err) {

                                            res.status(500);
                                            res.json({message: err})
                                        }
                                        else {
                                            res.status(200);
                                            res.json({message: "Team accepted"});
                                        }
                                    });
                                }
                                else {
                                    res.status(500);
                                    res.json({message: "This is the wrong team by the wrong quiz"});
                                }

                            }
                        }
                        catch (exception) {
                            console.log(exception);
                            res.status(500);
                            res.json({message: "A server error occured"});
                        }
                    });
                }
            }
            catch (exception) {
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
});

app.get('/:quizID/round/:roundNumber/question/:questionNumber', function(req, res, next) {
    try {
        const Quiz = mongoose.model('Quiz');
        Quiz.findOne({_id: req.params.quizID}, function (err, quiz) {
            try {
                if (err) {
                    res.status(500);
                    res.json({message: err});
                }
                else if (quiz != null) {
                    let round = quiz.rounds.find(x => x.roundNumber == req.params.roundNumber);
                    var result = round.playedQuestions.find(x=> x.questionNumber == req.params.questionNumber).teamAnswers;

                    res.status(200);
                    res.json({answers: result})
                }

                else {
                    res.status(500);
                    res.json({message: "error on the server"});
                }
            }
            catch (exception) {
                console.log(exception);
                res.status(500);
                res.json({message: "A server error occured"});
            }
        });
    }
    catch
        (exception) {
        console.log(exception);
        res.status(500);
        res.json({message: "A server error occured"});
    }
});


//Create Round
app.post('/:quizID/round', function(req, res, next){
    try {
        const Quiz = mongoose.model('Quiz');
        const Category = mongoose.model('Category');

        Quiz.findOne({_id: req.params.quizID}, function (err, quiz) {
            try {
                if (err) {
                    res.status(500);
                    res.json({message: err});
                }
                else if (quiz != null) {
                    // Check if entered categoryId exists
                    Category.findOne({_id: req.body.categoryID}, function (err, category) {
                        try {
                            if (err) {
                                res.status(500);
                                res.json({message: err});
                            }
                            else {
                                if (category != null) {
                                    if (!quiz.rounds.find(x => x.categoryID == req.body.categoryID)) {
                                        quiz.rounds.push({
                                            roundNumber: (quiz.rounds.length + 1),
                                            categoryID: req.body.categoryID
                                        });
                                        quiz.save(function (err, char) {
                                            try {
                                                if (err) {
                                                    res.status(500);
                                                    res.json({message: err});
                                                }
                                                else {
                                                    res.status(200);
                                                    res.json({
                                                        message: "There is a Round add to quiz",
                                                        roundNumber: quiz.rounds.length
                                                    });
                                                }
                                            }
                                            catch (exception) {
                                                console.log(exception);
                                                res.status(500);
                                                res.json({message: "A server error occured"});
                                            }
                                        });
                                    }
                                    else {
                                        res.status(400);
                                        res.json({message: "This category is al being use for this quiz"});
                                    }
                                }
                                else {
                                    res.status(404);
                                    res.json({message: "There is no category"});
                                }
                            }
                        }
                        catch (exception) {
                            console.log(exception);
                            res.status(500);
                            res.json({message: "A server error occured"});
                        }
                    })
                }
                else {
                    res.json({message: "The quiz can't be found"});
                    res.status(404);
                }
            }
            catch (exception) {
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
});


//Create Round Question
app.post('/:quizId/round/:roundNumber/question', function(req, res, next){
    try {
        const Quiz = mongoose.model('Quiz');
        Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
            try {
                if (err) {
                    res.status(400);
                    res.json({message: err});
                }
                else if (quiz != null) {
                    //todo kijken of vraag bij de categorie hoort
                    if (quiz.rounds.length == req.params.roundNumber) {
                        let round = quiz.rounds.find(x => x.roundNumber == req.params.roundNumber);
                        var questionNumber = round.playedQuestions.length + 1;
                        if (questionNumber <= 12) {
                            if (round.playedQuestions.length == 0 || round.playedQuestions.find(x => x.questionID != req.body.categoryID)) {
                                round.playedQuestions.push({
                                    questionNumber: questionNumber,
                                    questionID: parseInt(req.body.questionID)
                                });
                                quiz.save(function (err, char) {
                                    try {
                                        if (err) {
                                            res.status(500);
                                            res.json({message: err})
                                        }
                                        else {
                                            res.status(200);
                                            res.json({
                                                message: "There is a question add to quiz/round " + req.params.roundNumber,
                                                questionNumber: questionNumber
                                            });
                                        }
                                    }
                                    catch (exception) {
                                        console.log(exception);
                                        res.status(500);
                                        res.json({message: "A server error occured"});
                                    }
                                });
                            }
                            else {
                                res.status(404);
                                res.json({message: "This Question is played in this round "});
                            }
                        }

                        else {
                            res.status(404);
                            res.json({message: "There are 12 questions in this round "});
                        }
                    }
                    else {
                        res.status(400)
                        res.json({message: "U are not in the recent round"})

                    }
                }
                else {
                    res.status(500)
                    res.json({message: "error"})

                }
            }
            catch (exception) {
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
});

app.get('/:quizID/categories', function(req, res, next) {
    try {
        const Category = mongoose.model('Category');
        const Quiz = mongoose.model('Quiz');
        Category.find({}, function (err, categories) {
            try {
                if (err) {
                    res.status(500);
                    res.json({message: "A server error occured"});
                }
                else {
                    if (categories != null) {
                        let notUsedCategories = [];
                        let newCategories = [];
                        Quiz.findOne({_id: req.params.quizID}, function (err, quiz) {
                            try {
                                if (err) {
                                    res.status(500);
                                    res.json({message: "A server error occured"});
                                }
                                else {
                                    quiz.status = 3;
                                    quiz.save(function (err, char) {
                                        try {
                                            if (err) {
                                                res.status(400);
                                                res.json({
                                                    message: "The answers is not being controled by the quizmaster", err})
                                            }
                                            else{
                                                let rounds = quiz.rounds;
                                                rounds.forEach(function (round) {
                                                    notUsedCategories.push(round.categoryID)
                                                });
                                                categories.forEach(function (categorie) {
                                                    let id = categorie._id
                                                    if (!notUsedCategories.includes(id)) {
                                                        newCategories.push(categorie);
                                                    }
                                                });

                                                res.status(200);
                                                res.json(newCategories)
                                            }
                                        }
                                        catch (exception) {
                                            console.log(exception);
                                            res.status(500);
                                            res.json({message: "A server error occured"});
                                        }
                                    });
                                }
                            }
                            catch (exception) {
                                console.log(exception);
                                res.status(500);
                                res.json({message: "A server error occured"});
                            }
                        });
                    }
                }
            }
            catch (exception) {
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
});

//Get Round Question
app.get('/:quizId/round/:roundNumber/questions', function(req, res, next){
    try {
        const Quiz = mongoose.model('Quiz');
        const Category = mongoose.model('Category');
        const Question = mongoose.model('Question');
        Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
            try {
                if (err) {
                    res.status(400);
                    res.json({message: err});
                }
                else if (quiz) {
                    var round = quiz.rounds.find(x => x.roundNumber == req.params.roundNumber);
                    var categoryId = round.categoryID;
                    Category.findOne({_id: categoryId}, function (err, category) {
                        try {
                            if (err) {
                                res.status(400);
                                res.json({message: err});
                            }
                            else {
                                Question.find({category: category.categoryName}, function (err, questions) {
                                    try {
                                        if (err) {
                                            res.status(400)
                                            res.json({message: err});
                                        }
                                        else {
                                            var playedQuestions = round.playedQuestions;
                                            var questionsID = [];
                                            playedQuestions.forEach(function (playedQuestion) {
                                                questionsID.push(playedQuestion.questionID)
                                            })
                                            var newQuestions = [];
                                            questions.forEach(function (question) {
                                                let id = question._id
                                                if (!questionsID.includes(id)) {
                                                    newQuestions.push(question);
                                                }
                                                else {
                                                    //todo else?
                                                }
                                            });
                                            quiz.save(function (err, char) {
                                                try {
                                                    if (err) {
                                                        res.status(400);
                                                        res.json({
                                                            message: "The answers is not being controled by the quizmaster",
                                                            err
                                                        })
                                                    }
                                                    else {
                                                        res.status(200);
                                                        res.json({message: newQuestions});
                                                    }
                                                }
                                                catch (exception) {
                                                    console.log(exception);
                                                    res.status(500);
                                                    res.json({message: "A server error occured"});
                                                }
                                            });
                                        }
                                    }
                                    catch (exception) {
                                        console.log(exception);
                                        res.status(500);
                                        res.json({message: "A server error occured"});
                                    }
                                });
                            }
                        }
                        catch (exception) {
                            console.log(exception);
                            res.status(500);
                            res.json({message: "A server error occured"});
                        }
                    });

                }
                else {
                    res.status(400);
                    res.json({message: "There is no quiz"});
                }
            }
            catch (exception) {
                console.log(exception);
                res.status(500);
                res.json({message: "A server error occured"});
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
    // TODO ONGEBRUIKTE URL?
    try {
        const Quiz = mongoose.model('Quiz');
        const Category = mongoose.model('Category');
        Category.find({}, function (err, categorie) {
            try {
                if (err) {
                    res.status(400)
                    res.json({message: err});
                }
                else if (categorie != null) {
                    res.status(200);
                    res.json({message: categorie});
                }
                else {
                    res.status(400);
                    res.json({message: "There is no quiz"});
                }
            }
            catch (exception) {
                console.log(exception);
                res.status(500);
                res.json({message: "A server error occured"});
            }
        });
    }
    catch (exception) {
        res.status(500);
        res.json({message: "A server error occured"});
    }

});

// Get round question team answers
//    res.send("Set nieuwe vraag voor quiz "+req.params.quizId+" in ronde "+req.params.roundNumber+" en vraag  "+req.body.questionNumber+" ");
app.get('/:quizId/round/:roundNumber/question/:questionNumber/teamanswer',function(req, res, next) {
    try {
        const Quiz = mongoose.model('Quiz');

        Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
            try {
                if (err) {
                    res.status(500);
                    res.json({message: "A server error occured"});
                }
                else if (quiz != null) {
                    try {
                        var round = quiz.rounds.find(x => x.roundNumber == req.params.roundNumber);
                        if (round != null) {
                            const playedQuestions = round.playedQuestions.find(x=> x.questionID == req.params.questionNumber);
                            res.status(200);
                            res.json({result: playedQuestions.teamAnswers})

                        }
                        else {
                            res.status(400);
                            res.json({message: "This round is not being created"})
                        }
                    }
                    catch (exception) {
                        res.status(500);
                        res.json({message: "A server error occured"});
                    }

                }
                else {
                    res.status(404);
                    res.json({message: "The're no quiz"});
                }
            }
            catch (exception) {
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

});

//Accept team answer
app.put('/:quizId/round/:roundNumber/question/:questionNumber/team/:teamId',function(req, res){
    try {
        const Quiz = mongoose.model('Quiz');
        Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
            try {
                if (err) {
                    res.send(err);
                }
                else {
                    const teamAnswers = quiz.rounds.find(x => x.roundNumber == req.params.roundNumber)
                        .playedQuestions.find(x => x.questionNumber == req.params.questionNumber)
                        .teamAnswers.find(x=> x.teamID == req.params.teamId);
                    teamAnswers.approved = true;
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
                            res.status(500);
                            res.json({message: "A server error occured"});
                        }
                    });
                }
            }
            catch (exception) {
                console.log(exception);
                res.status(500);
                res.json({message: "A server error occured"});
            }
        })
    }
    catch (exception) {
        res.status(500);
        res.json({message: "A server error occured"});
    }
});

//Close quiz
app.put('/close',function(req, res) {
    try {
        const Quiz = mongoose.model('Quiz');

        Quiz.findOne({_id: req.body.quizID, quizMasterID: req.body.quizMasterID}, function (err, quiz) {
            try {
                if (err) {
                    res.send(err);
                }
                else if (quiz != null) {
                    quiz.status = 4;
                    quiz.save(function (err, char) {
                        try {
                            if (err) {
                                res.status(500);
                                res.json({message: err});
                            }
                            else {
                                res.status(200)
                                res.json({message: "The quiz is ended"});
                            }
                        }
                        catch (exception) {
                            console.log(exception);
                            res.status(500);
                            res.json({message: "A server error occured"});
                        }
                    });
                }
                else {
                    res.status(404);
                    res.json({message: "There go something wrong. Try again!! The quiz is still open"})
                }
            }
            catch (exception) {
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
});


//Get quiz
app.get('/:quizId', function(req, res, next) {
    try {
        const Quiz = mongoose.model('Quiz');

        Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
            try {
                if (err) {
                    res.status(500);
                    res.json({message: err})
                }
                else {
                    if (quiz === null) {
                        res.status(404);
                        res.json({message: "No quiz found"})
                    }
                    else {
                        res.status(200);
                        res.json(quiz);
                    }
                }
            }
            catch (exception) {
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
});

//Submit answer
app.post('/:quizId/round/:roundNumber/question/:questionNumber/teamanswer/:teamId',function(req, res, next) {
    try {
        const Quiz = mongoose.model('Quiz');
        Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
                try {
                    if (err) {
                        throw new Error(err);
                    }
                    if (quiz == null) {
                        res.status(404);
                        res.json({message: "Unknown quiz"});
                        return;
                    }
                    // check if team has already submitted a question, and uptdate then
                    let existingAnswer = quiz.rounds.find(x => x.roundNumber == req.params.roundNumber)
                        .playedQuestions.find(x => x.questionNumber == req.params.questionNumber)
                        .teamAnswers.find(x => x.teamID == req.params.teamId);
                    if(existingAnswer) {
                        existingAnswer.answer = req.body.answer;
                        quiz.save(function (err, quiz) {
                            try {
                                if (err) {
                                    throw new Error(err);
                                }

                                res.json({message: "Answer submitted"});
                            }
                            catch(exception) {
                                console.log(exception);
                                res.status(500);
                                res.json({message: "A server error occured"});
                            }
                        });
                    }
                    else {
                        quiz.rounds.find(x => x.roundNumber == req.params.roundNumber)
                            .playedQuestions.find(x => x.questionNumber == req.params.questionNumber)
                            .teamAnswers.push({teamID: req.params.teamId, answer: req.body.answer, approved: false});

                        quiz.save(function (err, quiz) {
                            try {
                                if (err) {
                                    throw new Error(err);
                                }

                                res.json({message: "Answer submitted"});
                            }
                            catch(exception) {
                                console.log(exception);
                                res.status(500);
                                res.json({message: "A server error occured"});
                            }
                        });
                    }
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


});

function createRandomString(characters){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < characters; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = app;