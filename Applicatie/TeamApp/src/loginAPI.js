import request from 'superagent';

let loginAPI = {
    login(password, teamname, callback) {
        request
            .post('http://localhost:3000/team/login')
            .send({ password: password, teamName: teamname })
            .set('Content-Type', 'application/json')
            .end( (err,response) => {
                if(err)
                    throw err;
                else {
                    callback(err, response.body);
                }
            })
    }
};

export default loginAPI;