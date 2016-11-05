const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const quizMasterSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
quizMasterSchema.plugin(autoIncrement.plugin, {
    model: 'QuizMaster',
    startAt: 1
});

module.exports = mongoose.model('QuizMaster', quizMasterSchema);
