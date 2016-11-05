import request from 'superagent';
import {store} from './index';

let teamAppAPI = {
    getQuiz(quizId, callback) {
        request
            .get(`http://localhost:3000/quiz/${quizId}`)
            .withCredentials()
            .end( (err,response) => {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log('response getQuiz', response);
                    callback(null, response.body);
                }
            })
    },
    getScoreboardAnswers(callback) {
        request
            .get(`http://localhost:3000/scoreboardAnswers`)
            .withCredentials()
            .send({ quizId: store.getState().base.quizId, roundNumber: store.getState().base.roundNumber, questionNumber: store.getState().base.questionNumber })
            .end( (err,response) => {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log('response getScoreBoardAnswers', response);
                    callback(err, response.body);
                }
            })
    },
    getQuizes(callback) {
        request
            .get(`http://localhost:3000/quiz`)
            .withCredentials()
            .end( (err,response) => {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log('response getQuizes', response);
                    callback(err, response.body);
                }
            })
    },
};

export default teamAppAPI;