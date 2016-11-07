import request from 'superagent';
import {store} from './index';

let teamAppAPI = {
    login(password, teamname, callback) {
        request
            .post('http://localhost:3000/team/login')
            .withCredentials()
            .send({ password: password, teamName: teamname })
            .end( (err,response) => {
                if(err) {
                    console.log(err);
                    if(err.status === 403 || err.status === 500) {
                        callback(null, response.body);
                    }
                    else {
                        callback(err, response.body);
                    }
                }
                else {
                    callback(null, response.body);
                }
            })

    },
    getQuestion(questionId, callback) {
        request
            .get(`http://localhost:3000/question/${questionId}`)
            // .set('Content-Type', 'application/json')
            .end( (err,response) => {
                if(err) {
                    console.log(err);
                    if(err.status === 403 || err.status === 500) {
                        callback(null, response.body);
                    }
                    else {
                        callback(err, response.body);
                    }
                }
                else {
                    callback(null, response.body);
                }
            })
    },
    submitAnswer(answer, callback) {
        request
            .post(`http://localhost:3000/quiz/${store.getState().base.quizId}/round/${store.getState().base.roundNumber}/question/${store.getState().base.questionNumber}/teamanswer/${store.getState().base.teamId}`)
            .withCredentials()
            .send({ answer: answer })
            .set('Content-Type', 'application/json')
            .end( (err,response) => {
                if(err) {
                    console.log(err);
                    if(err.status === 404 || err.status === 500) {
                        callback(null, response.body);
                    }
                    else {
                        callback(err, response.body);
                    }
                }
                else {
                    callback(null, response.body);
                }
            })
    }
};

export default teamAppAPI;