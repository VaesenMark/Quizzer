import request from 'superagent';

let loginAPI = {
    login(password, teamname, callback) {
        request
            .post('http://localhost:3000/team/login')
            .send({ password: password, teamName: teamname })
            .set('Content-Type', 'application/json')
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
    }
};

export default loginAPI;