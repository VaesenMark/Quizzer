import request from 'superagent';

let quizMasterAPI = {
    getLogin(username, password,callback) {
        request
            .post('http://localhost:3000/quizMaster/login')
            .send('username', username)
            .send('password', password)
            .end( (err,response) => {
                if(err)
                    throw err;
                else {
                    callback(err, response.body);
                }
            })
    }
};

export default quizMasterAPI