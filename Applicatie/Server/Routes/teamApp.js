var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Team login
//The team can be signed in to play the quiz
//Submit team name
app.post('/login', function(req, res, next){
    if(req.body.username === req.body.password){
        res.send("Gebruiker: "+req.body.username+" is ingelogd");
    }
    else{
        res.send("Gebruiker heeft het verkeerde wachtwoord opgegeven");
    }
});


//Change team name after error
app.put('/team/:teamId', function(req, res, next){
    res.send("team met id "+req.params.teamId + "heeft nu als teamnaam "+req.body.teamname);
});


app.get('/logout', function(req, res, next){
    res.send("Gebruiker is uitgelogd");
});

module.exports = app, router;