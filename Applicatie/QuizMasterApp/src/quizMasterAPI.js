import request from 'superagent';
import {store} from './index';

let quizMasterAPI = {
    getLogin(username, password,callback) {
        request
            .post('http://localhost:3000/quizmaster/login')
            .send({username: username, password: password})
            .end( (err,response) => {
                callback(err, response.body);
            })
    },
    getQuiz(id,callback) {
        request
            .get('http://localhost:3000/quizmaster/'+id+'/quiz')
            .end( (err,response) => {
                console.log(response.body);
                callback(err, response.body.message);
            })
    },
    getTeams(id,callback){
        console.log("id", id);
        request
            .get('http://localhost:3000/quiz/'+id+'/teams')
            .end( (err,response) => {

                callback(err, response.body.teams);
            })
    },
    getCategories(id,callback) {
        request
            .get('http://localhost:3000/quiz/'+id+'/categories')
            .end( (err,response) => {
                console.log('apie',response.body);
                callback(err, response.body);
            })
    },
    getQuestions(quizID, roundID,callback) {
        request
            .get('http://localhost:3000/quiz/'+quizID+'/round/'+roundID+'/questions')
            .end( (err,response) => {
                console.log('yyyp',response);
                callback(err, response.body.message);
            })
    },
    addQuiz(quizMasterID,callback) {
        request
            .post('http://localhost:3000/quiz')
            .send({quizMasterID: quizMasterID})
            .end( (err,response) => {
                callback(err, response.body.message);
            })
    },
    getPlayedQuestionsAnswers(quizID, roundNumber, questionNumber, callback){
        request
            .get('http://localhost:3000/quiz/'+quizID+'/round/'+roundNumber+'/question/'+questionNumber)
            .end( (err,response) => {
                console.log(response);
                callback(err, response.body);
            })
    },
    setnewRound(quizID, category,callback){
        request
            .post('http://localhost:3000/quiz/'+quizID+'/round')
            .send({categoryID: category._id})
            .end( (err,response) => {
                console.log('rnd', response);
                callback(err, response.body);
            })
    },
        addQuestion(quizID, roundNumber, questionID, callback){
            request
                .post('http://localhost:3000/quiz/'+quizID+'/round/'+roundNumber+'/question')
                .send({questionID: questionID})
                .end( (err,response) => {
                    callback(err, response.body);
                })
        },
    approveTeam(quizID,teamID, callback){
        request
            .put('http://localhost:3000/quiz/'+quizID+'/team/'+teamID)
            .end( (err,response) => {
                console.log(err, response.body);
                callback(err, response.body);
            })
    },
    approveTeamAnswer(teamId, callback){
        request
            .put(`http://localhost:3000/quiz/${store.getState().MainState.quizItem._id}/round/${store.getState().RoundState.roundNumber}/question/${store.getState().QuestionsState.questionNumber}/team/${teamId}`)
            .end( (err,response) => {
                console.log('tttt',err);
                console.log('tttt2',response);
                callback(err, response.body);
            })
    },
    closeQuiz(quizID, quizMasterID, callback){
        request
            .put('http://localhost:3000/quiz/close')
            .send({quizID: quizID, quizMasterID: quizMasterID })
            .end( (err,response) => {
                console.log(response, quizMasterID);
                callback(err, response.body);
            })
    },
    endRound(quizID){
        request
            .put('http://localhost:3000/quiz/'+quizID+'/round/close')
            .end( (err,response) => {
                callback(err, response.body);
            })
    }
};

export default quizMasterAPI