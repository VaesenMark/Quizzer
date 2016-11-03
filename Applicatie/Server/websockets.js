var app = require('./app');
var express = require('express');
var router = express.Router();

var ns = 1;

const expressWs = require('express-ws')(app);

router.ws('/', function(ws, req) {
    console.log('connected');
    req.session.blaat = ns;
    ns++;
    ws.on('message', function(msg) {

        for(let client of expressWs.getWss().clients) {
            console.log("session blaat: ", client.upgradeReq.session.blaat);
        }
        console.log("clientlength: ", expressWs.getWss().clients.length);

        ws.send(msg);
    });
});

function newTeamCreated() {
    for(let client of expressWs.getWss().clients) {
        console.log("session blaat: ", client.upgradeReq.session.blaat);
    }
}

module.exports = {router, newTeamCreated};
