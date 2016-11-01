import request from 'superagent';

let itemsAPI = {
    getAllItems(callback) {
        request
            .get('http://localhost:3000/hn/topstories')
            .end( (err,response) => {
                if(err)
                    throw err;
                else {
                    callback(err, response.body);
                }
            })
    },
    storeItemStatus(id,status,callback) {  // status is either "seen" or "read"
        request
            .put("http://localhost:3000/itemStatuses/" + id)
            .set('Content-Type', 'text/plain')
            .send(status)
            .end( (err,response) => {
                if(err)
                    throw err;
                else {
                    console.log('STATUS STORED');
                    callback(err, response.body);
                }
            })
    }
};

export default itemsAPI;