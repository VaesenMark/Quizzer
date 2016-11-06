const httpServer = require('./app');
var ws = require('ws');

var wss = new ws.Server({server: httpServer});

wss.on("connection", function connection(req) {
    console.log('connected');


    req.on('message', function(msg) {
        console.log("MESSAGE", msg);

        msg = JSON.parse(msg);

        switch(msg.messageType) {

            // Quizmaster App
            case "TeamApplianceJudged":
                // Quizmaster closes the question, notidy the team of it
                console.log('schaap4');
                for(let client of wss.clients) {
                    console.log('bla');
                    client.sendJSON({
                        messageType: "TeamApplianceJudged",
                        teamId: msg.teamId,
                        accepted: msg.accepted
                    });
                }
                break;

            case "CloseQuestion":
                // Quizmaster closes the quest, notidy the team of it
                console.log('schaap');
                for(let client of wss.clients) {
                    client.sendJSON({
                        messageType: "QuestionClosed",
                        quizId: msg.quizId
                    });
                }
                break;
            case "AnswerAccepted":
                // Quizmaster accepts the answer, notify team of it
                console.log('schaap2');
                for(let client of wss.clients) {
                    client.sendJSON({
                        messageType: "AnswerAccepted",
                        teamId: msg.teamId
                    });
                }
                break;
            case "QuestionStarted":
                // Quizmaster accepts the answer, notify team of it
                console.log('schaap2');
                for(let client of wss.clients) {
                    client.sendJSON({
                        messageType: "QuestionStarted",
                        quizId: msg.quizId,
                        questionNumber: msg.questionNumber,
                        roundNumber: msg.roundNumber,
                        questionId: msg.questionId
                    });
                }
                break;


            // TeamApp
            case "TeamLoggedIn":
                // Team logged in, notify quizmaster of it
                console.log('schaap3');
                for(let client of wss.clients) {
                    client.sendJSON({
                        messageType: "NewTeamAppliance",
                        quizId: msg.quizId
                    });
                }
                break;
            case "AnswerSubmitted":
                // Team subitted answer, notify quizmaster of it
                console.log('schaap8');
                for(let client of wss.clients) {
                    client.sendJSON({
                        messageType: "AnswerSubmitted",
                        quizId: msg.quizId,
                        roundNumber: msg.roundNumber,
                        questionNumber: msg.questionNumber
                    });
                }
                break;




            default:

        }
    });

    req.sendJSON = function(data) {
        var jsonStr = JSON.stringify(data);
        this.send(jsonStr);
    };
});