var express = require('express');
var fs = require('fs');
var app = express();

// ------ Scoreboard Routes ------

app.use(function(req, res, next) {
    console.log(req.path , res);
    next();
});


app.get('/scoreboardAnswers/:quizId', function(req, res, next) {
    try {
        const Team = mongoose.model('Team');
        const Quiz = mongoose.model('Quiz');

        // Find all teams of the quizId
        Team.find(
            {
                quizID: req.params.quizId
            },
            function(err, teams) {
                try {
                    if (err) {
                        throw new Error(err);
                    }
                    if(!teams) {
                        res.status(404);
                        res.json({message: "Team not found"});
                        return;
                    }

                    // Get the quiz to get the needed answers
                    Quiz.findOne(
                        {
                            _id: req.params.quizId
                        },
                        function(err, quiz) {
                            try {
                                if (err) {
                                    throw new Error(err);
                                }
                                if(!quiz) {
                                    res.status(404);
                                    res.json({message: "Team not found"});
                                    return;
                                }

                                // Combine team with answers
                                const lastRound = quiz.rounds.slice(-1)[0];
                                const lastQuestion = lastRound.playedQuestions.slice(-1)[0];
                                let answers = lastQuestion.teamAnswers;
                                console.log(answers);
                                let combinedObject = [];
                                for(let teamObj of teams) {
                                    for(let answerObj of answers) {
                                        if (teamObj._id == answerObj.teamID) {
                                            combinedObject.push({teamId: teamObj._id, teamName: teamObj.teamName, answer: answerObj.answer, approved: answerObj.approved})
                                        }
                                    }
                                }
                                console.log(combinedObject);
                                res.json(combinedObject);
                            }
                            catch(exception) {
                                console.log(exception);
                                res.status(500);
                                res.json({message: "A server error occured"});
                            }
                        }
                    );
                }
                catch(exception) {
                    console.log(exception);
                    res.status(500);
                    res.json({message: "A server error occured"});
                }
            }
        );
    }
    catch(exception) {
        console.log(exception);
        res.status(500);
        res.json({message: "A server error occured"});
    }
});



//Get scoreboard overview
app.get('/quizOverview/:quizId', function(req, res, next) {
    try {
        const Quiz = mongoose.model('Quiz');
        const Question = mongoose.model('Question');
        const Category = mongoose.model('Category');

        // Get the quiz
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
                        const lastRound = quiz.rounds.slice(-1)[0];
                        const lastQuestion = lastRound.playedQuestions.slice(-1)[0];

                        // Get question string
                        Question.findOne({_id: lastQuestion.questionID}, function (err, question) {
                            try {
                                if (err) {
                                    res.status(500);
                                    res.json({message: err})
                                }
                                else {
                                    if (question === null) {
                                        res.status(404);
                                        res.json({message: "No question found"})
                                    }
                                    else {

                                        // Get category string
                                        Category.findOne({_id: lastRound.categoryID}, function (err, category) {
                                            try {
                                                if (err) {
                                                    res.status(500);
                                                    res.json({message: err})
                                                }
                                                else {
                                                    if (category === null) {
                                                        res.status(404);
                                                        res.json({message: "No category found"})
                                                    }
                                                    else {
                                                        let quizInfo = {};
                                                        quizInfo.quizId = quiz._id;
                                                        quizInfo.password = quiz.password;
                                                        quizInfo.quizMasterId = quiz.quizMasterID;
                                                        quizInfo.roundNumber = lastRound.roundNumber;
                                                        quizInfo.questionNumber = lastQuestion.questionNumber;
                                                        quizInfo.question = question.question;
                                                        quizInfo.category = category.categoryName;
                                                        quizInfo.password = quiz.password;
                                                        res.status(200);
                                                        res.json(quizInfo);
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



module.exports = app;