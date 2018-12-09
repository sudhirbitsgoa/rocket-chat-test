// steps for the admin accept invitation
/*
    1. login admin
    2. create room
    3. logout admin
    4. login user
    5. join room
    6. get subscriptions for user and user should not be get subscriptions
    7. login admin 
    8. approve the join room
    7. user get subscriptions
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

//2 create room
var roomName = 'Public'+Math.random();
var roomId;
setTimeout(() => {
    var createRoom = {"msg":"method","method":"createChannel","params":[roomName,[],false,{},{"broadcast":false,"encrypted":false}],"id":(messagesCount++).toString()};
    timeCount = timeCount + 500;
    socket.send(JSON.stringify(createRoom));
}, timeCount);

//3 logout
setTimeout(() => {
    var logOut = {"msg":"method","method":"logout","params":[],"id":(messagesCount++).toString()}
    timeCount = timeCount + 500;
    socket.send(JSON.stringify(logOut));
}, timeCount+500);

//4 user login
setTimeout(() => {
    timeCount = timeCount+500;
    let login = {
        "msg": "method",
        "method": "login",
        "id": (messagesCount++).toString(),
        "params": [{
            "user": {
                "email": "vineesha@gmail.com"
            },
            "password": {
                "digest": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
                "algorithm": "sha-256"
            }
        }]
    };
    socket.send(JSON.stringify(login));
    joinRoomRequest();
}, timeCount+500);


// 5. join room
function joinRoomRequest() {
    setTimeout(() => {
        timeCount = timeCount+1000;
        var joinRoom = {"msg":"method","method":"joinRoom","params":[roomId,null],"id":(messagesCount++).toString()};
        console.log('join room', JSON.stringify(joinRoom));
        socket.send(JSON.stringify(joinRoom));
        getSubscriptions();
    }, timeCount+500);
}

function getSubscriptions() {
    setTimeout(() => {
        timeCount = timeCount+500;
        var getSubsc = {"msg":"method","method":"subscriptions/get","params":[{"$date":Date.now()}],"id":(messagesCount++).toString()};
        socket.send(JSON.stringify(getSubsc));
        logoutUser();
    }, timeCount+500);
}

// 7 logout
function logoutUser() {
    setTimeout(() => {
        var logOut = {"msg":"method","method":"logout","params":[],"id":(messagesCount++).toString()}
        timeCount = timeCount + 500;
        socket.send(JSON.stringify(logOut));
        adminLogin();
    }, timeCount+500);
}

let userId;

// admin login
function adminLogin() {
    setTimeout(() => {
        userId = loggedInUId;
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
        approveUserToJoinRoom();
    }, timeCount+500);
}

function approveUserToJoinRoom() {
    setTimeout(() => {
        timeCount = timeCount+1000;
        var joinRoom = {"msg":"method","method":"approveUserToJoinRoom","params":[roomId, userId],"id":(messagesCount++).toString()};
        console.log('approveUserToJoinRoom', JSON.stringify(joinRoom));
        socket.send(JSON.stringify(joinRoom));
        logoutAdmin();
    }, timeCount+500);
}

function logoutAdmin() {
    setTimeout(() => {
        var logOut = {"msg":"method","method":"logout","params":[],"id":(messagesCount++).toString()}
        timeCount = timeCount + 500;
        socket.send(JSON.stringify(logOut));
        userlogin2();
    }, timeCount+500);
}

function userlogin2() {
    setTimeout(() => {
        timeCount = timeCount+500;
        let login = {
            "msg": "method",
            "method": "login",
            "id": (messagesCount++).toString(),
            "params": [{
                "user": {
                    "email": "vineesha@gmail.com"
                },
                "password": {
                    "digest": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
                    "algorithm": "sha-256"
                }
            }]
        };
        socket.send(JSON.stringify(login));
        getSubscriptions2();
    }, timeCount+500);
}

function getSubscriptions2() {
    setTimeout(() => {
        timeCount = timeCount+500;
        console.log('the get subscri')
        var getSubsc = {"msg":"method","method":"subscriptions/get","params":[{"$date":Date.now()}],"id":(messagesCount++).toString()};
        socket.send(JSON.stringify(getSubsc));
        //logoutUser();
    }, timeCount+500);
}