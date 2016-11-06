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
    it('Get quizzen', function (done) {
        agent
            .get('/quizmaster/2/quiz')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('message');
                expect(res.body.message[0]._id).to.equal(2);
                expect(res.body.message[0].password).to.equal('oc8rx8w5');
                expect(res.body.message[0].quizMasterID).to.equal(2);
                expect(res.body.message[0].status).to.equal(3);
                done();
            });
    });

});

describe('Get information of one quiz', function () {
    it('Get quiz with an incoorect QuizID', function (done) {
        agent
            .get('/quiz/0')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("No quiz found");
                done();
            });
    });
    it('Get quiz with a correct ID', function (done) {
        agent
            .get('/quiz/2')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body._id).to.equal(2);
                expect(res.body.password).to.equal('oc8rx8w5');
                expect(res.body.quizMasterID).to.equal(2);
                expect(res.body.status).to.equal(3);
                done();
            });
    });

});

describe('Get question', function () {
    it('Get quiz with an incorrect QuestionID', function (done) {
        agent
            .get('/question/0')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Question not found");
                done();
            });
    });
    it('Get quiz with an correct QuestionID', function (done) {
        agent
            .get('/question/1')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body._id).to.equal(1);
                expect(res.body.question).to.equal('what color is a firetruck?');
                expect(res.body.answer).to.equal('red');
                expect(res.body.category).to.equal('Films');
                done();
            });
    });

});

describe('Get question', function () {
    it('Get quiz with an incorrect QuestionID', function (done) {
        agent
            .get('/question/0')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Question not found");
                done();
            });
    });
    it('Get quiz with an correct QuestionID', function (done) {
        agent
            .get('/question/1')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body._id).to.equal(1);
                expect(res.body.question).to.equal('what color is a firetruck?');
                expect(res.body.answer).to.equal('red');
                expect(res.body.category).to.equal('Films');
                done();
            });
    });

});

describe('Get team', function () {
    it('Get team with an incorrect teamID', function (done) {
        agent
            .get('/team/0')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("Team not found");
                done();
            });
    });
    it('Get team with an correct teamID', function (done) {
        agent
            .get('/team/1')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body._id).to.equal(1);
                expect(res.body.teamName).to.equal('Test');
                expect(res.body.roundPoints).to.equal(0);
                expect(res.body.approved).to.equal(true);
                expect(res.body.quizID).to.equal(16);
                done();
            });
    });

});

describe('close Quiz', function () {
    it('close a unexisting quiz', function (done) {
        agent
            .put('/quiz/close/0')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("There go something wrong. Try again!! The quiz is still open");
                done();
            });
    });
    it('close a existing quiz', function (done) {
        agent
            .put('/quiz/close/1')
            .set('Content-Type', 'application/json')
            .send()
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                console.log(res.body);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal("The quiz is ended");
                done();
            });
    });
});