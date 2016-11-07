const mongoose = require('mongoose');
require('./MongooseModels/connection');
require('./MongooseModels/Team');
require('./MongooseModels/Category');
require('./MongooseModels/Question');
require('./MongooseModels/QuizMaster');
require('./MongooseModels/Quiz');
mongoose.Promise = global.Promise;

var express = require('express');

var sessionParser = require('express-session')({
    secret:"secret",
    resave: true,
    saveUninitialized: true
});

var cors = require('cors');

var ws = require('ws');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');

var app = express();


var httpServer = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Cookie');
    next();
});


app.use(sessionParser);


function acceptOrRefuseConnection(info) {
    return true;
}

// var quizmaster = require('./Routes/quizmaster');
// var scorebord = require('./Routes/scorebord');
// var team = require('./Routes/team');
// var quiz = require('./Routes/quiz');
// app.use('/quizmaster', quizmaster);
// app.use('/scorebord', scorebord);
// app.use('/team', team);
// app.use('/quiz', quiz);







app.put('/quiz/:quizID/round/close', function(req, res, next) {
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
                                console.log(teamScore.teamID, teamAnswer.teamID)
                                if (teamScore.teamID == teamAnswer.teamID) {
                                    exist = true;
                                    if(teamAnswer.approved){
                                        console.log("test");
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
                                console.log(teamscore);
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

                        console.log(place, points);
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
app.get('/quiz', function(req, res, next) {
    try {
        const Quiz = mongoose.model('Quiz');

        Quiz.find({_id}, function (err, quizzes) {
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





///------- toegevoegd --------

app.put('/quiz/:quizID/team/:teamID', function(req, res, next) {
    //todo er zijn al 6 teams
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

app.get('/quiz/:quizID/round/:roundNumber/question/:questionNumber', function(req, res, next) {
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

app.get('/quiz/:quizID/teams', function(req, res, next) {
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
                                console.log("_____________________________________")
                                console.log(teams);
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



// ------ Quiz Routes ------

//Start quiz
app.post('/quiz', function(req, res, next) {
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
                    console.log(quizMaster);
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

//Get teams appliances
app.get('/quiz/:quizId/teams', function(req, res, next){
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
                    console.log(teams.length);
                    if (teams.length <= 0) {
                        res.status(400);
                        res.json({message: "The're are no teams signed in for this quiz"});
                    }
                    else {
                        res.status(200)
                        console.log(teams);
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

//Create Round
app.post('/quiz/:quizID/round', function(req, res, next){
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
app.post('/quiz/:quizId/round/:roundNumber/question', function(req, res, next){
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

app.get('/quiz/:quizID/categories', function(req, res, next) {
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
app.get('/quiz/:quizId/round/:roundNumber/questions', function(req, res, next){
    console.log('ttttttttttttt');
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
app.get('/quiz/:quizId/categories', function(req, res, next){
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
app.get('/quiz/:quizId/round/:roundNumber/question/:questionNumber/teamanswer',function(req, res, next) {
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
app.put('/quiz/:quizId/round/:roundNumber/question/:questionNumber/team/:teamId',function(req, res){
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
app.put('/quiz/close',function(req, res) {
    try {
        const Quiz = mongoose.model('Quiz');

        Quiz.findOne({_id: req.body.quizID, quizMasterID: req.body.quizMasterID}, function (err, quiz) {
            console.log(req.body.quizID, req.body.quizMasterID)
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
app.get('/quiz/:quizId', function(req, res, next) {
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
app.post('/quiz/:quizId/round/:roundNumber/question/:questionNumber/teamanswer/:teamId',function(req, res, next) {
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
                    // TODO check if team has already submitted a question
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



// ------ Quizmaster Routes ------

//Quizmaster login
app.post('/quizmaster/login', function(req, res, next){
    try {
        const QuizMaster = mongoose.model('QuizMaster');
        QuizMaster.findOne({username: req.body.username, password: req.body.password}, function (err, quizMaster) {
            try {
                if (err || quizMaster == null) {
                    res.status(400);
                    res.json({message: "Quizmaster have given the wrong userName or Password"})
                }
                else {
                    res.status(200);
                    res.json(quizMaster);
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

app.get('/quizmaster/:quizmasterID/quiz',  function(req, res, next){
    try {
        const Quiz = mongoose.model('Quiz');
        Quiz.find({quizMasterID: req.params.quizmasterID, status: {$lt: 4}}, function (err, quiz) {
            try {

                if (err) {
                    res.status(500);
                    res.json({message: err})
                }
                else if (quiz.length > 1) {
                    res.status(200);
                    res.json({message: quiz})
                }
                else {
                    res.status(400);
                    res.json({message: "Create a new quiz"});
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

//quizmaster logout
app.get('/quizmaster/logout', function(req, res, next){
    res.send("Gebruiker is uitgelogd");
});

function createRandomString(characters){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < characters; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}



// ------ Team Routes ------

// Team login:
// -create team
// -create session
// -notify quizmaster
app.post('/team/login', function(req, res, next) {
    try {
        const Quiz = mongoose.model('Quiz');
        const Team = mongoose.model('Team');

        // Find the quiz that has the inserted password and is accepting team appliances(status 1)
        Quiz.findOne(
            {
                password: req.body.password,
                status: 2
            },
            function (err, quiz) {
                try {
                    if(err) {
                        throw new Error(err);
                    }
                    if(quiz === null) {
                        // Password not found
                        res.status(403);
                        res.json({message: "Invalid password"});
                        return;
                    }

                    // Check if teamname is already in use in the quiz
                    Team.count(
                        {
                            teamName: req.body.teamName,
                            quizID: quiz._id
                        },
                        function (err, count) {
                            try {
                                if(err) {
                                    throw new Error(err);
                                }
                                if (count > 0) {
                                    // Another team has the teamname in use
                                    res.status(400);
                                    res.json({message: "Teamname is already in use"});
                                    return;
                                }

                                // All checks validated, create team, set TeamID in session and nofity the quizmaster of the team-application
                                const team = new Team({
                                    teamName: req.body.teamName,
                                    roundPoints: 0,
                                    approved: false,
                                    quizID: quiz._id
                                });

                                team.save(function (err, team) {
                                    try {
                                        if (err) {
                                            throw new Error(err);
                                        }
                                        // req.session.teamId = team._id;
                                        // req.session.quizId = quiz._id;
                                        console.log('aaaaaaa');



                                        res.json({message: "Team successfully logged in. Waiting for the quizmaster to approve it", teamId : team._id, quizId: quiz._id});
                                    }
                                    catch(exception) {
                                        console.log(exception);
                                        res.status(500);
                                        res.json({message: "A server error occured"});
                                    }
                                });
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


// Get team
app.get('/team/:teamId', function(req, res, next) {
    try {
        const Team = mongoose.model('Team');
        Team.findOne(
            {
                _id: req.params.teamId
            },
            function(err, team) {
                try {
                    if (err) {
                        throw new Error(err);
                    }
                    if(!team) {
                        res.status(404);
                        res.json({message: "Team not found"});
                        return;
                    }

                    res.json(team);
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


// Edit team
app.put('/team/:teamId', function(req, res, next) {
    console.log('teamname', req.body.teamName);
    console.log('roundPoints', req.body.roundPoints);
    console.log('approved', req.body.approved);
    console.log('quizID', req.body.quizID);
    try {
        const Team = mongoose.model('Team');
        Team.update(
            {_id: req.params.teamId},
            {
                $set: {
                    teamName: req.body.teamName,
                    roundPoints: req.body.roundPoints,
                    approved: req.body.approved,
                    quizID: req.body.quizID
                }
            },
            function (err, data) {
                try {
                    if (err) {
                        throw new Error(err);
                    }
                    if(data.nModified < 1) {
                        res.status(404);
                        res.json({message: "Team not found"});
                    }
                    res.json({message: "Teamname changed. Waiting for the quizmaster to approve it", teamId: req.params.teamId, quizId: req.body.quizID});
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

// Get question
app.get('/question/:questionId', function(req, res, next) {
    console.log('1');
    try {
        const Question = mongoose.model('Question');
        Question.findOne(
            {
                _id: req.params.questionId
            },
            function(err, question) {
                console.log('2',question);
                try {
                    if (err) {
                        throw new Error(err);
                    }
                    if(!question) {
                        res.status(404);
                        res.json({message: "Question not found"});
                        return;
                    }
                    res.json(question);
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


// Logout
app.post('/team/logout', function(req, res, next) {
    try {
        if (req.session.teamID) {
            req.session.destroy(function (err) {
                try {
                    if (err) {
                        throw new Error(err);
                    }
                    res.json({message: "You are now logged out"});
                }
                catch (exception) {
                    console.log(exception);
                    res.status(500);
                    res.json({message: "A server error occured"});
                }
            })
        }
        else {
            res.status(403);
            res.json({message: "You need to be logged in to perform this action"});
        }
    }
    catch(exception) {
        console.log(exception);
        res.status(500);
        res.json({message: "A server error occured"});
    }
});


// ------ Scoreboard Routes ------

app.use(function(req, res, next) {
    console.log(req.path , res);
    next();
});


app.get('/scoreboard/scoreboardAnswers/:quizId', function(req, res, next) {
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
app.get('/scoreboard/quizOverview/:quizId', function(req, res, next) {
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

// --
//Team routes(Weet niet of die er al was)
app.get('/team', function(req, res, next) {
    try {
        const Team = mongoose.model('Team');

        // Get the quiz
        Team.find({}, function (err, teams) {
            try {
                if (err) {
                    res.status(500);
                    res.json({message: err})
                }
                else {
                    if (teams === null) {
                        res.status(404);
                        res.json({message: "No Team found"})
                    }
                    else {
                        res.status(200);
                        res.json(teams);
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

httpServer.listen( 3000,
    function() {
        console.log("The Server is lisening on port 3000.")
    });


module.exports = httpServer;

require('./websockets');