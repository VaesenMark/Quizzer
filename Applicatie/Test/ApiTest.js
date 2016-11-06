var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../Server/app');
var agent = supertest.agent(app);
//Todo test is afhaneklijk van de databse

const quizMasterID = 2;
const quizID = 1;
const round = 1;
const questionNumber = 1;


describe('sign in functionality for quizmaster', function () {
    it('should refuse empty submissions', function (done) {
        agent
            .post('/quizmaster/Login')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('Quizmaster have given the wrong userName or Password');
                done();
            });
    });
    it('should refuse a QuizMaster', function (done) {
        agent
            .post('/quizmaster/Login')
            .set('Content-Type', 'application/json')
            .send({username: "Mark", password: "Hoi"})
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body._id).to.equal(2);
                expect(res.body.username).to.equal("Mark");
                expect(res.body.password).to.equal("Hoi");

                done();
            });
    });

});

describe('Get quiz for quizmaster', function () {
    it('No Quizzen', function (done) {
        agent
            .get('/quizmaster/0/quiz')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Create a new quiz");
                done();
            });
    });
    it('No Quizzen', function (done) {
        agent
            .get('/quizmaster/1/quiz')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('message');
                //todo exacte resultaten
                done();
            });
    });

});