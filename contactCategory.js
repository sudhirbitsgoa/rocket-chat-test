// steps for the admin accept invitation
/*
    1. login admin
    2. create category
*/


const WebSocket = require('ws')
let socket = new WebSocket('ws://localhost:3000/websocket');

//note messageCount is incremented with every message
//but it can works even if you didn't change it
let messagesCount = 10;
let timeCount = 1000;
let loggedInUId;
// listen to messages passed to this socket
socket.onmessage = function(e) {

    let response = JSON.parse(e.data);
    console.log('response %j', response);

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
            allMsgs.map(x => console.log('%j', x))
            console.log('---------------------------------')
        }
        if (response.result.rid) {
            roomId = response.result.rid;
            console.log('room response', response.result)
        }
        if(response.result.token) {
            loggedInUId = response.result.id;
            console.log('the logged in Userid ', loggedInUId);
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
}, timeCount);

setTimeout(() => {
    timeCount = timeCount + 500;
    let login = {
        "msg": "method",
        "method": "login",
        "id": "42",
        "params": [{
            "user": {
                "email": "sudhirbitsgoa@gmail.com"
            },
            "password": {
                "digest": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
                "algorithm": "sha-256"
            }
        }]
    };
    socket.send(JSON.stringify(login));
}, timeCount);
setTimeout(() => {
    var getCategories = {"msg":"method","method":"getContactCategory","params":[],"id":(messagesCount++).toString()};
    timeCount = timeCount + 500;
    socket.send(JSON.stringify(getCategories));
}, timeCount+2000)
//2 create category
// var roomName = 'Public'+Math.random();
setTimeout(() => {
    var createRoom = {"msg":"method","method":"createContactCategory","params":[roomName,{add: ['wd4dJHNpWpaugWEbB', 'iusPnrTNeeHgAdWgM', 'ws48dWz6XNJ8pmKKT'], remove: ['4']}],"id":(messagesCount++).toString()};
    timeCount = timeCount + 500;
    socket.send(JSON.stringify(createRoom));
}, timeCount+1000);


setTimeout(() => {
    var createRoom = {"msg":"method","method":"createContactCategory","params":[roomName,{add: [], remove: ['2', '3']}],"id":(messagesCount++).toString()};
    timeCount = timeCount + 500;
    socket.send(JSON.stringify(createRoom));
}, timeCount+2000);

setTimeout(() => {
    var getCategories = {"msg":"method","method":"getContactCategory","params":[],"id":(messagesCount++).toString()};
    timeCount = timeCount + 500;
    socket.send(JSON.stringify(getCategories));
}, timeCount+4000)