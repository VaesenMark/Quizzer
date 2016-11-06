import request from 'superagent';
import {store} from './index';

let teamAppAPI = {
    login(password, teamname, callback) {
        // if(store.getState().base.teamId) {
        //     console.log('updating team');
        //     request
        //         .get(`http://localhost:3000/team/${store.getState().base.teamId}`)
        //         .withCredentials()
        //         .send({password: password, teamName: teamname})
        //         .end((err, response) => {
        //             console.log('get result cleitn',response);
        //             if (err) {
        //                 console.log(err);
        //                 // callback(null, response.body);
        //             }
        //             else {
        //                 console.log('start put');
        //                 request
        //                     .put(`http://localhost:3000/team/${store.getState().base.teamId}`)
        //                     .withCredentials()
        //                     .send({teamName: response.teamName, roundPoints: response.roundPoints, approved: response.approved})
        //                     .end((err, response) => {
        //                         console.log('put result cleitn',response);
        //                         if (err) {
        //                             console.log(err);
        //                         }
        //                         else {
        //                             callback(err, response.body);
        //                         }
        //                     });
        //             }
        //         });
        // }
        // else {
        //     console.log('new team');
        request
            .post('http://localhost:3000/team/login')
            .withCredentials()
            .send({ password: password, teamName: teamname })
            .end( (err,response) => {
                if(err) {
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
        console.log('ques2',questionId);
        request
            .get(`http://localhost:3000/question/${questionId}`)
            // .set('Content-Type', 'application/json')
            .end( (err,response) => {
                console.log('err opvragen question', err);
                console.log('klaar binnenhalen question', response);
                if(err) {

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
                console.log('err', err);
                console.log('response', response);
                if(err) {
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