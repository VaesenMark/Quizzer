const mongoose = require('mongoose');
require('./MongooseModels/connection');
require('./MongooseModels/Team');
require('./MongooseModels/Category');
require('./MongooseModels/Question');
require('./MongooseModels/QuizMaster');
require('./MongooseModels/Quiz');
mongoose.Promise = global.Promise;
var questions = require('./questions');

const Question = mongoose.model('Question');

Question.create(questions,function(err){
    if(err) return console.log(err);
    console.log("gelukt");
});



const Category = mongoose.model('Category');


var category = new Category({ categoryName: 'Films' });


category.save(function (err, char) {
    if (err) {
        console.log(err);
        mongoose.connection.close();
    }
    else {
        mongoose.connection.close();
    }
});


// const Question = mongoose.model('Question');
//
// var question = new Question({ question: 'what color is a firetruck?', answer: 'red', category: 'Films' });
//
//
// question.save(function (err, char) {
//     if (err) {
//         console.log(err);
//         mongoose.connection.close();
//     }
//     else {
//         mongoose.connection.close();
//     }
// });


const QuizMaster = mongoose.model('QuizMaster');


var quizmaster = new QuizMaster({ username: 'Mark', password: 'Hoi' });


quizmaster.save(function (err, char) {
    if (err) {
        console.log(err);
        mongoose.connection.close();
    }
    else {
        mongoose.connection.close();
    }
});


const Quiz = mongoose.model('Quiz');


var quiz = new Quiz({ password: 'asd1', quizMasterID: 1, status: "1"  });

quiz.rounds.push({ roundNumber: 1, categoryID: 1 });
// quiz.rounds.push({ roundNumber: 2, categoryID: 2 });
//
quiz.rounds[0].playedQuestions.push({ questionNumber: 1, questionID: 1 });

// quiz.rounds[0].playedQuestions[0].teamAnswers.push({ teamID: 1, answer: 'Red', approved: false });

quiz.save(function (err, char) {
    if (err) {
        console.log(err);
        mongoose.connection.close();
    }
    else {
        mongoose.connection.close();
    }
});





const Team = mongoose.model('Team');


var team = new Team({ teamName: 'Team Mark', roundPoints: 0, approved: false, quizID: 1 });


team.save(function (err, char) {
    if (err) {
        console.log(err);
        mongoose.connection.close();
    }
    else {
        mongoose.connection.close();
    }
});

// Team.login('asd1', function(err, data) {
//     if (err) {
//         console.log(err);
//         mongoose.connection.close();
//     }
//     else {
//         console.log(data);
//         mongoose.connection.close();
//     }
// });



