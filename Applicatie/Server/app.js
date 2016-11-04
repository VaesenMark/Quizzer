var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

const mongoose = require('mongoose');
require('./MongooseModels/connection');
require('./MongooseModels/Team');
require('./MongooseModels/Category');
require('./MongooseModels/Question');
require('./MongooseModels/QuizMaster');
require('./MongooseModels/Quiz');


var expressSession = require('express-session');
var SESSION_SECRET = "ThisIsACoolSecret!@#$%";

var cors = require('cors');

var app = express();

const expressWs = require('express-ws')(app);

// TEMPORARY
var path = require('path');
app.use(express.static(path.join(__dirname, 'client-side')));

app.use(expressSession({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

// var quizmaster = require('./Routes/quizmaster');
// var scorebord = require('./Routes/scorebord');
// var team = require('./Routes/team');
// var quiz = require('./Routes/quiz');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use('/quizmaster', quizmaster);
// app.use('/scorebord', scorebord);
// app.use('/team', team);
// app.use('/quiz', quiz);



// ------ Quiz Routes ------

//Start quiz
app.post('/quiz', function(req, res, next) {
    const Quiz = mongoose.model('Quiz');
    const QuizMaster = mongoose.model('QuizMaster');

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
app.get('/quiz/:quizId/teams', function(req, res, next){
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
app.post('/quiz/:quizID/round', function(req, res, next){
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
app.post('/quiz/:quizId/round/:roundNumber/question', function(req, res, next){
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
                                res.json({message: "There is a question add to quiz/round " + req.params.roundNumber});
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

app.get('/quiz/:quizID/categories', function(req, res, next) {
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
app.get('/quiz/:quizId/round/:roundNumber/questions', function(req, res, next){
    try {
        console.log(req.params.quizId, req.params.roundNumber);
        const Quiz = mongoose.model('Quiz');
        const Category = mongoose.model('Category');
        const Question = mongoose.model('Question');
        Quiz.findOne({_id: req.params.quizId}, function (err, quiz) {
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
app.get('/quiz/:quizId/categories', function(req, res, next){
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
app.get('/quiz/:quizId/round/:roundNumber/question/:questionNumber/teamanswer',function(req, res, next) {
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
app.put('/quiz/:quizId/round/:roundNumber/question/:questionNumber/teamanswer/:teamId',function(req, res){
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

//Close quiz
app.put('/quiz/close/:quizId',function(req, res) {
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

// ??
//Scoreboard app
app.get('/quiz/:quizId', function(req, res, next){
    res.send("get informatie van quiz " +req.params.quizId);
});

//Submit answer
app.post('/quiz/:quizId/round/:roundNumber/question/:questionNumber/teamanswer/:teamId',function(req, res, next) {
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
                    quiz.rounds.find(x => x.roundNumber == req.params.roundNumber)
                        .playedQuestions.find(x => x.questionNumber == req.params.questionNumber)
                        .teamAnswers.push({teamID: req.params.teamId, answer: req.body.answer, approved: false});

                    quiz.save(function (err, quiz) {
                        try {
                            if (err) {
                                throw new Error(err);
                            }
                            res.json({message: "Question inserted"});
                            // TODO notify quizmaster
                            answerSubmitted(quiz._id);
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
app.put('/quiz/:quizId/round/:roundNumber/question/:questionNumber/teamanswer/:teamId',function(req, res, next) {
    res.send("vraag van quiz35 " + req.params.quizId + " in ronde " + req.params.roundNumber + " en vraag  " + req.params.questionNumber + " heeft nu antwoord " + req.body.answer+" van team "+ req.params.teamId);
});



// ------ Quizmaster Routes ------

//Quizmaster login
app.post('/quizmaster/login', function(req, res, next){
    const QuizMaster = mongoose.model('QuizMaster');
    console.log(req.body.username);
    QuizMaster.findOne({username: req.body.username, password: req.body.password}, function (err, quizMaster) {
        if (err || quizMaster == null) {
            res.status(400);
            res.json({message: "Quizmaster have given the wrong userName or Password"})
        }
        else {
            console.log(quizMaster);
            res.status(200);
            res.json(quizMaster);
        }

    });
});

app.get('/quizmaster/:quizmasterID/quiz',  function(req, res, next){
    const Quiz = mongoose.model('Quiz');
    Quiz.find({quizMasterID: req.params.quizmasterID, status: {
        $lt: 4
    }}, function (err, quiz) {
        if(err){
            res.status(500);
            res.json({message: err})
        }
        else{
            res.status(200);
            res.json({message: quiz})
        }

    });
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
                status: 1
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
                                        req.session.teamId = team._id;
                                        req.session.quizId = quiz._id;
                                        res.json({message: "Team successfully logged in. Waiting for the quizmaster to approve it", teamId : team._id, quizId: quiz._id});
                                        //TODO test notify quizmaster
                                        // websocket.newTeamCreated(quiz._id);
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

app.post('/scoreboard/login', function(req, res, next){
    if(req.body.username === req.body.password){
        res.send("Scorebord: "+req.body.username+" is ingelogd");
    }
    else{
        res.send("Gebruiker heeft het verkeerde wachtwoord opgegeven");
    }
});


app.get('/scoreboard/logout', function(req, res, next){
    res.send("Gebruiker is uitgelogd");
});




// ------ Websockets ------

let ns = 1;

app.ws('/', function(ws, req) {
    console.log('connected');
    req.session.blaat = ns;
    ns++;
    ws.on('message', function(msg) {

        for(let client of expressWs.getWss().clients) {
            console.log("session blaat: ", client.upgradeReq.session.blaat);
        }
        console.log("clientlength: ", expressWs.getWss().clients.length);

        ws.send(msg);
    });
});

function newTeamCreated(quizId) {
    // Notify quizmaster to get new list of team appliances
    for(let client of expressWs.getWss().clients) {
        if(client.upgradeReq.session.quizMasterId && client.upgradeReq.session.quizId == quizId) {
            client.send({message: "NewTeamAppliance"});
        }
    }
}

function teamApplianceJudged(teamId, accepted) {
    // team id mogelijk?
    // Notify team of judgement
    let message;
    if(accepted) {
        message = "ApplianceAccepted";
    }
    else {
        message = "ApplianceDenied";
    }
    for(let client of expressWs.getWss().clients) {
        if(client.upgradeReq.session.teamId == teamId) {
            client.send({message: message});
        }
    }
}

function roundStarted(roundNumber, quizId) {
    // Nofity team to go to first question
    for(let client of expressWs.getWss().clients) {
        if(client.upgradeReq.session.teamId && client.upgradeReq.session.quizId == quizId) {
            client.send({message: "RoundStarted", roundNumber: roundNumber});
        }
    }
}

function answerSubmitted(quizId) {
    // Nofity quizmaster to retreive all new answers
    for(let client of expressWs.getWss().clients) {
        if(client.upgradeReq.session.quizmasterId && client.upgradeReq.session.quizId == quizId) {
            client.send({message: "RetreiveAllAnswers"});
        }
    }
}

function questionClosed(quizId, questionNumber) {
    // Notify team of closed question
    for(let client of expressWs.getWss().clients) {
        if(client.upgradeReq.session.teamId && client.upgradeReq.session.quizId == quizId) {
            client.send({message: "QuestionClosed"});
        }
    }
}

function questionStarted(quizId, questionNumber) {
    // Notify team of started question
    for(let client of expressWs.getWss().clients) {
        if(client.upgradeReq.session.teamId && client.upgradeReq.session.quizId == quizId) {
            client.send({message: "QuestionStarted", questionNumber: questionNumber});
        }
    }
}

function answerJudged(quizId, questionId, accepted) {
    // Notify team of judged answer
    let message;
    if(accepted) {
        message = "answerAccepted"
    }
    else {
        message = "answerDenied";
    }
    for(let client of expressWs.getWss().clients) {
        if(client.upgradeReq.session.teamId && client.upgradeReq.session.quizId == quizId && client.upgradeReq.session.questionId == questionId) {
            client.send({message: message});
        }
    }
}

function quizEnded(quizId) {
    // Notify all teams connected to quiz
    for(let client of expressWs.getWss().clients) {
        if(client.upgradeReq.session.teamId && client.upgradeReq.session.quizId == quizId) {
            client.send({message: "QuizClosed"});
        }
    }
}


app.listen(3000);
