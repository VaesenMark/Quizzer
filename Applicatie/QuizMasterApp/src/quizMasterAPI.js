import request from 'superagent';

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
                callback(err, response.body);
            })
    },
    getQuestions(quizID, roundID,callback) {
        request
            .get('http://localhost:3000/quiz/'+quizID+'/round/'+roundID+'/questions')
            .end( (err,response) => {
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
    approveTeam(quizID,teamID){
        request
            .post('http://localhost:3000/quiz/'+quizID+'/team/'+teamID)
            .end( (err,response) => {
                callback(err, response.body);
            })
    },
    approveTeamAnswer(quizID,roundNumber,questionNumber,teamID){
        request
            .put('http://localhost:3000/quiz/'+quizID+'/round/'+roundNumber+'/questionnumber/'+questionNumber+"/team/"+teamID)
            .end( (err,response) => {
                callback(err, response.body);
            })
    }
};

export default quizMasterAPI