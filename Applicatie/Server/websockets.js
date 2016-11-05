// var app = require('./app');
// var express = require('express');
// var router = express.Router();
//
// var ns = 1;
//
// const expressWs = require('express-ws')(app);
//
// router.ws('/', function(ws, req) {
//     console.log('connected');
//     req.session.blaat = ns;
//     ns++;
//     ws.on('message', function(msg) {
//
//         for(let client of expressWs.getWss().clients) {
//             console.log("session blaat: ", client.upgradeReq.session.blaat);
//         }
//         console.log("clientlength: ", expressWs.getWss().clients.length);
//
//         ws.send(msg);
//     });
// });
//
// function newTeamAppliance(quizId) {
//     // Notify quizmaster to get new list of team appliances
//     for(let client of expressWs.getWss().clients) {
//         if(client.upgradeReq.session.quizMasterId && client.upgradeReq.session.quizId == quizId) {
//             client.send({message: "NewTeamAppliance"});
//         }
//     }
// }
//
// function judgeTeamAppliance(teamId, message) {
//     // team id mogelijk?
//     // Notify team of judgement
//     for(let client of expressWs.getWss().clients) {
//         if(client.upgradeReq.session.teamId) {
//             client.send({message: message});
//         }
//     }
//
// }
//
// module.exports = {router, newTeamAppliance};
