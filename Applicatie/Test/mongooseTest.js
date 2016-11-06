var expect = require('chai').expect;

const mongoose = require('mongoose');


require('../Server/MongooseModels/connection');
var Category = require('../Server/MongooseModels/Category');
var Question = require('../Server/MongooseModels/Question');
var Quiz = require('../Server/MongooseModels/Quiz');
var QuizMaster = require('../Server/MongooseModels/QuizMaster');
var Team = require('../Server/MongooseModels/Team');
mongoose.Promise = global.Promise;

describe('quizMaster', function() {
    it('check if i will get an error if i have no username', function(done) {
        //1. set up the model in a way the validation should fail
        var qm = new QuizMaster({password: 'Hoi' });

        qm.validate(function(err) {
            expect(err.errors.username).to.exist;
            done();
        });
    });

    it('check if i will get an error if i have no password', function(done) {
        //1. set up the model in a way the validation should fail
        var qm = new QuizMaster({ username: 'Mark' });
        qm.validate(function(err) {
            expect(err.errors.password).to.exist;
            done();
        });
    });
    it('check if i will go good with a username and password', function(done) {
        //1. set up the model in a way the validation should fail
        var qm = new QuizMaster({ username: 'Dennis', password: 'Hoi' });
        qm.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });

});



describe('Team', function() {
    it('check if i will get an error if i have no teamName', function(done) {
        //1. set up the model in a way the validation should fail
        var t = new Team({_id: 1,roundPoints: 0, approved: false, quizID: 1 });
        t.validate(function(err) {
            expect(err.errors.teamName).to.exist;
            done();
        });
    });
    it('check if i will get an error if i have no roundPoints', function(done) {
        //1. set up the model in a way the validation should fail
        var t = new Team({_id: 1, teamName: 'Dronkenlappen', approved: false, quizID: 1 });
        t.validate(function(err) {
            expect(err.errors.roundPoints).to.exist;
            done();
        });
    });
    it('check if i will get an error if i have no approved', function(done) {
        //1. set up the model in a way the validation should fail
        var t = new Team({teamName: 'Dronkenlappen', roundPoints: 0, quizID: 1 });
        t.validate(function(err) {
            expect(err.errors.approved).to.exist;
            done();
        });
    });
    it('check if i will get an error if i have no quizID', function(done) {
        //1. set up the model in a way the validation should fail
        var t = new Team({teamName: 'Dronkenlappen',roundPoints: 0, approved: false });
        t.validate(function(err) {
            expect(err.errors.quizID).to.exist;
            done();
        });
    });
    it('check if i will get no error on a Correct team', function(done) {
        //1. set up the model in a way the validation should fail
        var t = new Team({teamName: 'Dronkenlappen',roundPoints: 0, approved: false, quizID: 1  });
        t.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });
});

describe('Question', function() {
    it('check if i will get an error if i have no question', function(done) {
        //1. set up the model in a way the validation should fail
        var t = new Question({ answer: 'red', category: 'Films' });
        t.validate(function(err) {
            expect(err.errors.question).to.exist;
            done();
        });
    });
    it('check if i will get an error if i have no roundPoints', function(done) {
        //1. set up the model in a way the validation should fail
        var t = new Question({ question: 'what color is a firetruck?', category: 'Films' });
        t.validate(function(err) {
            expect(err.errors.answer).to.exist;
            done();
        });
    });
    it('check if i will get an error if i have no approved', function(done) {
        //1. set up the model in a way the validation should fail
        var t = new Question({ question: 'what color is a firetruck?', answer: 'red' });
        t.validate(function(err) {
            expect(err.errors.category).to.exist;
            done();
        });
    });
    it('check if i will get no error on a Correct Question', function(done) {
        //1. set up the model in a way the validation should fail
        var t = new Question({ question: 'what color is a firetruck?', answer: 'red', category: 'Films' });
        t.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });
});

describe('Category', function() {
    it('check if i will get an error if i have no username', function(done) {
        //1. set up the model in a way the validation should fail
        var category = new Category({  });;

        category.validate(function(err) {
            expect(err.errors.categoryName).to.exist;
            done();
        });
    });


    it('check if i will go good with a username and password', function(done) {
        //1. set up the model in a way the validation should fail
        var category = new Category({ categoryName: 'Films' });
        category.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });

});

describe('Quiz', function() {
    it('check if i will get no error on a Correct team', function(done) {
        //1. set up the model in a way the validation should fail
        var quiz = new Quiz({ password: 'asd1', quizMasterID: 1, status: "1"  });
        quiz.rounds.push({ roundNumber: 1, categoryID: 1 });
        quiz.rounds[0].playedQuestions.push({ questionNumber: 1, questionID: 1 });
        quiz.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });
    it('check if i will get an error if i have no password', function(done) {
        //1. set up the model in a way the validation should fail
        var quiz = new Quiz({ quizMasterID: 1, status: "1"  });
        quiz.rounds.push({ roundNumber: 1, categoryID: 1 });
        quiz.rounds[0].playedQuestions.push({ questionNumber: 1, questionID: 1 });
        quiz.validate(function(err) {
            expect(err.errors.password).to.exist;
            done();
        });
    });
    it('check if i will get an error if i have no quizMasterID', function(done) {
        //1. set up the model in a way the validation should fail
        var quiz = new Quiz({ password: 'asd1', status: "1"  });
        quiz.rounds.push({ roundNumber: 1, categoryID: 1 });
        quiz.rounds[0].playedQuestions.push({ questionNumber: 1, questionID: 1 });
        quiz.validate(function(err) {
            expect(err.errors.quizMasterID).to.exist;
            done();
        });
    });
    it('check if i will get an error if i have no status', function(done) {
        //1. set up the model in a way the validation should fail
        var quiz = new Quiz({ password: 'asd1', quizMasterID: 1 });
        quiz.rounds.push({ roundNumber: 1, categoryID: 1 });
        quiz.rounds[0].playedQuestions.push({ questionNumber: 1, questionID: 1 });
        quiz.validate(function(err) {
            expect(err.errors.status).to.exist;
            done();
        });
    });
    it('check if i will get an error if i have no roundNumber in Rounds', function(done) {
        //1. set up the model in a way the validation should fail
        var quiz = new Quiz({ password: 'asd1', quizMasterID: 1, status: "1"  });
        quiz.rounds.push({ categoryID: 1 });
        quiz.rounds[0].playedQuestions.push({ questionNumber: 1, questionID: 1 });
        quiz.rounds[0].validate(function(err) {
            expect(err.errors).to.exist;
            done();
        });
    });
    it('check if i will get an error if i have no categoryID in Rounds', function(done) {
        //1. set up the model in a way the validation should fail
        var quiz = new Quiz({ password: 'asd1', quizMasterID: 1, status: "1"  });
        quiz.rounds.push({ roundNumber: 1 });
        quiz.rounds[0].playedQuestions.push({ questionNumber: 1, questionID: 1 });
        quiz.rounds[0].validate(function(err) {
            expect(err.errors).to.exist;
            done();
        });
    });
    it('check if i will get no error if i have no rounds in question', function(done) {
        //1. set up the model in a way the validation should fail
        var quiz = new Quiz({password: 'asd1', quizMasterID: 1, status: "1"});
        quiz.validate(function(err){
            expect(err).to.not.exist;
        })
        done();
    });
    it('check if i will get no error if i have no playedQuestions in quiz.rounds', function(done) {
        //1. set up the model in a way the validation should fail
        var quiz = new Quiz({ password: 'asd1', quizMasterID: 1, status: "1"  });
        quiz.rounds.push({ roundNumber: 1, categoryID: 1 });
        quiz.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });
    it('check if i will get an error if i have no questionNumber in playedquestions', function(done) {
        //1. set up the model in a way the validation should fail
        var quiz = new Quiz({ password: 'asd1', quizMasterID: 1, status: "1"  });
        quiz.rounds.push({ roundNumber: 1 });
        quiz.rounds[0].playedQuestions.push({ questionID: 1 });
        quiz.rounds[0].validate(function(err) {
            expect(err.errors).to.exist;
            done();
        });
    });
    it('check if i will get an error if i have no questionNumber in questionID', function(done) {
        //1. set up the model in a way the validation should fail
        var quiz = new Quiz({ password: 'asd1', quizMasterID: 1, status: "1"  });
        quiz.rounds.push({ roundNumber: 1 });
        quiz.rounds[0].playedQuestions.push({ questionNumber: 1 });
        quiz.rounds[0].validate(function(err) {
            expect(err.errors).to.exist;
            done();
        });
    });
});