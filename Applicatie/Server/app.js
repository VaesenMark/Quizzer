var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');


var expressSession = require('express-session');
var SESSION_SECRET = "ThisIsACoolSecret!@#$%";

var cors = require('cors');

var app = express();
var apiRouter = express.Router();

const expressWs = require('express-ws')(app);

// TEMPORARY
var path = require('path');
app.use(express.static(path.join(__dirname, 'client-side')));

app.use(expressSession({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

var quizmaster = require('./Routes/quizmaster');
var scorebord = require('./Routes/scorebord');
var team = require('./Routes/team');
var quiz = require('./Routes/quiz');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/quizmaster', quizmaster);
app.use('/scorebord', scorebord);
app.use('/team', team);
app.use('/quiz', quiz);




let ns = 1;

app.ws('/', function(ws, req) {
    console.log('connected');
    req.session.blaat = ns;
    ns++;
    ws.on('message', function (msg) {
    })
})
// var ns = 1;

        function newTeamCreated(quizId) {
            // Notify quizmaster to get new list of team appliances
            for (let client of expressWs.getWss().clients) {
                if (client.upgradeReq.session.quizMasterId && client.upgradeReq.session.quizId == quizId) {
                    client.send({message: "NewTeamAppliance"});
                }
            }
        }

        function teamApplianceJudged(teamId, accepted) {
            // team id mogelijk?
            // Notify team of judgement
            let message;
            if (accepted) {
                message = "ApplianceAccepted";
            }
            else {
                message = "ApplianceDenied";
            }
            for (let client of expressWs.getWss().clients) {
                if (client.upgradeReq.session.teamId == teamId) {
                    client.send({message: message});
                }
            }
        }

        function roundStarted(roundNumber, quizId) {
            // Nofity team to go to first question
            for (let client of expressWs.getWss().clients) {
                if (client.upgradeReq.session.teamId && client.upgradeReq.session.quizId == quizId) {
                    client.send({message: "RoundStarted", roundNumber: roundNumber});
                }
            }
        }

        function answerSubmitted(quizId) {
            // Nofity quizmaster to retreive all new answers
            for (let client of expressWs.getWss().clients) {
                if (client.upgradeReq.session.quizmasterId && client.upgradeReq.session.quizId == quizId) {
                    client.send({message: "RetreiveAllAnswers"});
                }
            }
        }

        function questionClosed(quizId, questionNumber) {
            // Notify team of closed question
            for (let client of expressWs.getWss().clients) {
                if (client.upgradeReq.session.teamId && client.upgradeReq.session.quizId == quizId) {
                    client.send({message: "QuestionClosed"});
                }
            }
        }

        function questionStarted(quizId, questionNumber) {
            // Notify team of started question
            for (let client of expressWs.getWss().clients) {
                if (client.upgradeReq.session.teamId && client.upgradeReq.session.quizId == quizId) {
                    client.send({message: "QuestionStarted", questionNumber: questionNumber});
                }
            }
        }

        function answerJudged(quizId, questionId, accepted) {
            // Notify team of judged answer
            let message;
            if (accepted) {
                message = "answerAccepted"
            }
            else {
                message = "answerDenied";
            }
            for (let client of expressWs.getWss().clients) {
                if (client.upgradeReq.session.teamId && client.upgradeReq.session.quizId == quizId && client.upgradeReq.session.questionId == questionId) {
                    client.send({message: message});
                }
            }
        }

        function quizEnded(quizId) {
            // Notify all teams connected to quiz
            for (let client of expressWs.getWss().clients) {
                if (client.upgradeReq.session.teamId && client.upgradeReq.session.quizId == quizId) {
                    client.send({message: "QuizClosed"});
                }
            }
        }


app.listen(3000);
