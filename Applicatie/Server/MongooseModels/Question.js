const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const questionSchema = new mongoose.Schema({
        question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
});

questionSchema.plugin(autoIncrement.plugin, {
    model: 'Question',
    startAt: 1
});
module.exports = mongoose.model('Question', questionSchema);

