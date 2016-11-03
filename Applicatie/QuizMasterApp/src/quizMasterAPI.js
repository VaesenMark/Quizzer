import request from 'superagent';

let quizMasterAPI = {
    getLogin(username, password,callback) {
        request
            .post('http://localhost:3000/quizmaster/login')
            .send({username: username, password: password})
            .end( (err,response) => {
                console.log(response.body);
                callback(err, response.body);
            })
    }
};

export default quizMasterAPI