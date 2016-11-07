const mongoose = require('mongoose');
require('../MongooseModels/connection');
require('../MongooseModels/Team');
require('../MongooseModels/Quiz');
// const websocket = require('../websockets');

var express = require('express');
var fs = require('fs');

var app = express();

// ------ Team Routes ------

// Team login:
// -create team
// -create session
// -notify quizmaster
// --
//Team routes(Weet niet of die er al was)
app.get('/', function(req, res, next) {
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

    app.post('/login', function(req, res, next) {
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
                        if (err) {
                            throw new Error(err);
                        }
                        if (quiz === null) {
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
                                    if (err) {
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


                                            res.json({
                                                message: "Team successfully logged in. Waiting for the quizmaster to approve it",
                                                teamId: team._id,
                                                quizId: quiz._id
                                            });
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
                            }
                        );
                    }
                    catch (exception) {
                        console.log(exception);
                        res.status(500);
                        res.json({message: "A server error occured"});
                    }

                }
            );
        }
        catch (exception) {
            console.log(exception);
            res.status(500);
            res.json({message: "A server error occured"});
        }
    });


// Get team
app.get('/:teamId', function(req, res, next) {
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
app.put('/:teamId', function(req, res, next) {
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




// Logout
app.post('/logout', function(req, res, next) {
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




module.exports = app;