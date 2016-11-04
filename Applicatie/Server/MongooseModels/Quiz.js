const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const teamAnswerSchema = new mongoose.Schema({
    teamID: {
        type: Number,
        ref: 'Team',
        min: 1
    },
    answer: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        required: true
    },
    _id: false
});
teamAnswerSchema.index({ teamID: 1, type: -1 });


const playedQuestionSchema = new mongoose.Schema({
    questionNumber: {
        type: Number,
        required: true,
        min: 1
    },
    questionID: {
        type: Number,
        ref: 'Question',
        required: true,
    },
    teamAnswers: [teamAnswerSchema],
    _id: false
});
playedQuestionSchema.index({ questionNumber: 1, type: -1 });


const roundSchema = new mongoose.Schema({
    roundNumber: {
        type: Number,
        required: true,
        min: 1
    },
    categoryID: {
        type: Number,
        ref: 'Category',
        required: true,
        min: 1
    },
    playedQuestions: [playedQuestionSchema],
    _id: false
});
roundSchema.index({ roundNumber: 1, type: -1 });


const quizSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    quizMasterID: {
        type: Number,
        ref: 'QuizMaster',
        required: true,
        min: 1
    },
    status: {
        type: Number,
        required: true,
        min: 1
    },
    rounds: [roundSchema]
});

quizSchema.plugin(autoIncrement.plugin, {
    model: 'Quiz',
    startAt: 1
});
mongoose.model('Quiz', quizSchema);
