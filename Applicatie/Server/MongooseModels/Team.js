const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    roundPoints: {
        type: Number,
        required: true,
        min: 0
    },
    approved: {
        type: Boolean,
        required: true
    },
    quizID: {
        type: Number,
        ref: 'Quiz',
        required: true,
        min: 1
    }
});

teamSchema.statics.login = function (password, cb) {
    const Quiz = mongoose.model('Quiz');
    Quiz.count({password: password, status: 1}, function (err, count) {
        if(err) {
            console.log(err);
        }
        else {
            if(count>0){
                cb(err, true);
            }
            else {
                cb(err, false);
            }
        }
    });
};

teamSchema.statics.teamNameAlreadyExists = function (quizID, teamName, cb) {
    const Team = mongoose.model('Team');
    Team.count({quizID: quizID, teamName: teamName}, function (err, count) {
        if(err) {
            console.log(err);
        }
        else {
            if(count>0){
                cb(err, true);
            }
            else {
                cb(err, false);
            }
        }
    });
};

teamSchema.plugin(autoIncrement.plugin, {
    model: 'Team',
    startAt: 1
});

module.exports = mongoose.model('Team', teamSchema);
