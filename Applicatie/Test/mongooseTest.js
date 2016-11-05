var expect = require('chai').expect;

var Team = require('../Server/MongooseModels/Team');
var QuizMaster = require('../Server/MongooseModels/QuizMaster');


describe('quizMaster', function() {
    it('check if i will get an error if i have no username', function(done) {
        //1. set up the model in a way the validation should fail
        var qm = new QuizMaster({ password: 'Hoi' });
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
});

describe('Team', function() {
    it('check if i will get an error if i have no teamName', function(done) {
        //1. set up the model in a way the validation should fail
        var t = new Team({roundPoints: 0, approved: false, quizID: 1 });
        t.validate(function(err) {
            expect(err.errors.teamName).to.exist;
            done();
        });
    });
    it('check if i will get an error if i have no roundPoints', function(done) {
        //1. set up the model in a way the validation should fail
        var t = new Team({ teamName: 'Dronkenlappen', approved: false, quizID: 1 });
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
});
