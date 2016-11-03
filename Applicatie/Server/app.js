var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

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




// var websocketRouter = require('./websockets');
// app.use('/', websocketRouter);


var ns = 1;

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



app.listen(3000);