
const WebSocket = require('ws')
// let socket = new WebSocket('ws://dev.chatur.ai/websocket');
let socket = new WebSocket('ws://localhost:3000/websocket');

//note messageCount is incremented with every message
//but it can works even if you didn't change it
let messagesCount = 1;

// listen to messages passed to this socket
socket.onmessage = function(e) {

    let response = JSON.parse(e.data);
    console.log('response', response);

    // you have to pong back if you need to keep the connection alive
    // each ping from server need a 'pong' back
    if (response.msg == 'ping') {
        console.log('pong!');
        socket.send(JSON.stringify({
            msg: 'pong'
        }));
        return;
    }

    // here you receive messages from server //notive the event name is: 'stream-room-messages'
    if (response.msg === 'changed' && response.collection === 'stream-room-messages') {
        console.log('msg received ', response.fields.args[0].msg, 'timestamp ', response.fields.args[0].ts.$date, 'from ' + response.fields.args[0].u.name);
        return;
    }

    // receive all messages which will only succeed if you already have messages
    // in the room (or in case you send the first message immediately you can listen for history correctly)
    if (response.msg === 'result' && response.result) {
        if (response.result.messages) {
            let allMsgs = response.result.messages;
            console.log('-----previous msgs---------------');
            allMsgs.map(x => console.log(x))
            console.log('---------------------------------')
        }
    }
}

//////////////////////////////////////////////
// steps to achieve the connection to the rocket chat real time api through WebSocket


//1 connect
let connectObject = {
    msg: 'connect',
    version: '1',
    support: ['1', 'pre2', 'pre1']
}

setTimeout(() => {
    socket.send(JSON.stringify(connectObject));
}, 300);

var login = {
    "msg": "method",
    "method": "login",
    "id": "42",
    "params": [{
        "user": {
            "email": "sudhir@sambandha.social"
        },
        "password": {
            "digest": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
            "algorithm": "sha-256"
        }
    }]
};

// var setusername = {"msg":"method","id":"7","method":"setUsername","params":["karthyks"]}
setTimeout(() => {
    socket.send(JSON.stringify(login));
    // setUsername();
}, 500);
// function setUsername() {
//     setTimeout(() => {
//         socket.send(JSON.stringify(setusername));
//     }, 4000);
// }
var getSubsc = {"msg":"method","method":"deliverMessages","params":["GENERAL"],"id":"11"};

setTimeout(() => {
    console.log('get subscripton');
    socket.send(JSON.stringify(getSubsc))
}, 2000);