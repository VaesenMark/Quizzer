import request from 'superagent';
import {store} from './index';

let teamAppAPI = {
    getScoreBoardOverview(quizId, callback) {
        request
            .get(`http://localhost:3000/scoreboard/quizOverview/${quizId}`)
            .withCredentials()
            .end( (err,response) => {
                if(err) {
                    console.log(err);
                }
                else {
                    callback(null, response.body);
                }
            })
    },
    getQuiz(quizId, callback) {
        request
            .get(`http://localhost:3000/quiz/${quizId}`)
            .withCredentials()
            .end( (err,response) => {
                if(err) {
                    console.log(err);
                }
                else {
                    callback(null, response.body);
                }
            })
    },
    getScoreboardAnswers(quizId, callback) {
        request
            .get(`http://localhost:3000/scoreboard/scoreboardAnswers/${quizId}`)
            .withCredentials()
            .end( (err,response) => {
                if(err) {
                    console.log(err);
                }
                else {
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
                    callback(err, response.body);
                }
            })
    },
    getTeams(callback) {
        request
            .get(`http://localhost:3000/team`)
            .withCredentials()
            .end( (err,response) => {
                if(err) {
                    console.log(err);
                }
                else {
                    callback(err, response.body);
                }
            })
    },
};

export default teamAppAPI;