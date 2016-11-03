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
        console.log(id);
        request
            .get('http://localhost:3000/quizmaster/'+id+'/quiz')
            .end( (err,response) => {
                callback(err, response.body.message);
            })
    },
    getCategories(id,callback) {
        console.log(id);
        request
            .get('http://localhost:3000/quiz/'+id+'/categories')
            .end( (err,response) => {
                callback(err, response.body.message);
            })
    },
    getQuestions(quizID, roundID,callback) {
        request
            .get('http://localhost:3000/quiz/'+quizID+'/round/'+roundID+'/questions')
            .end( (err,response) => {
                callback(err, response.body.message);
            })
    }
};

export default quizMasterAPI