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

teamSchema.plugin(autoIncrement.plugin, {
    model: 'Team',
    startAt: 1
});
mongoose.model('Team', teamSchema);
