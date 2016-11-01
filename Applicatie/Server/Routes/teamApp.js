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
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Team login
//The team can be signed in to play the quiz
//Submit team name
app.post('/login', function(req, res, next){
    const Quiz = mongoose.model('Quiz');
    const Team = mongoose.model('Team');

    // Find quiz that has the inserted password and is accepting team appliances
    Quiz.findOne({password: req.body.password, status: 1}, function (err, quiz) {
        if (err) {
            console.log(err);
            console.log('Incorrect password');
        }
        else {
            console.log('quizID', quiz._id);
            // Check if teamname is already in use in the quiz
            Team.count({teamName: req.body.teamName, quizID: quiz._id}, function (err, count) {
                const Team = mongoose.model('Team');
                if(err) {
                    console.log(err);
                }
                else {
                    if(count>0){
                        console.log('Teamname is already in use');
                    }
                    else {
                        console.log(quiz.quizID);
                        // All checks validated, create team and set teamID session
                        var team = new Team({ teamName: 'The Marks', roundPoints: 0, approved: false, quizID: quiz._id });

                        team.save(function (err, char) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log('Team successfully logged in');
                            }
                        });

                    }
                }
            });
        }
    });


    // Team.login(req.body.password, function(err, result) {
    //     if(err) {
    //         console.log(err);
    //     }
    //     else {
    //         if(result === false) {
    //             console.log('Password doesnt match with a quiz');
    //         }
    //         else {
    //             Quiz.findOne({password: req.body.password, teamName: teamName}, function (err, count) {
    //                 if(err) {
    //                     console.log(err);
    //                 }
    //                 else {
    //                     if(count>0){
    //                         cb(err, true);
    //                     }
    //                     else {
    //                         cb(err, false);
    //                     }
    //                 }
    //             });
    //             const Quiz = mongoose.model('Quiz');
    //             Team.teamNameAlreadyExists(1, req.body.teamName, function(err, result) {
    //                 const team = new Team({ teamName: req.body.teamName, roundPoints: 0, approved: false, quizID: 1 });
    //
    //                 team.save(function (err, char) {
    //                     if (err) {
    //                         console.log(err);
    //                     }
    //                     else {
    //                         console.log('login success');
    //                     }
    //                 });
    //             });
    //         }
    //     }
    // });
});


//Change team name after error
app.put('/team/:teamId', function(req, res, next){
    res.send("team met id "+req.params.teamId + "heeft nu als teamnaam "+req.body.teamname);
});


app.get('/logout', function(req, res, next){
    res.send("Gebruiker is uitgelogd");
});

module.exports = app, router;