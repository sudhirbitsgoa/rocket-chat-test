/*
Rocket Chat Real Time API Custom Client


even though this code works great I don't know what exactly each event we listen for is doing
you can go back to rocket chat real time api for further declarations

we were able to write this code after we test real normal use case of livechat in a web page
and we listen for WebSocket connection inside the browser Network tab(by filtering ws(WebSocket) connections)
*/

const WebSocket = require('ws')
let socket = new WebSocket('ws://localhost:3000/websocket');

//note messageCount is incremented with every message
//but it can works even if you didn't change it
let messagesCount = 1;

// the variables chatToken and chatRoomId are very important
// and they are the identifier to the room(the whole chat) you are using
// if you want to get access to the chat again you need these two variables tokens
let chatToken = generateHash(17);


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
}, 1000)

//////////////////////////////////////////////

//2 getInitialData
let getInitialDataObject = {
    msg: 'method',
    method: 'livechat:getInitialData',
    params: [String(chatToken), null],
    id: String(messagesCount++),
}

setTimeout(() => {
    socket.send(JSON.stringify(getInitialDataObject));
}, 2000)


setTimeout(() => {
	// loginUser();
}, 4000)

function loginUser() {
    var login = {
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
    }
    setTimeout(() => {
        socket.send(JSON.stringify(login));
        createGroup();
    }, 500);
}

function createGroup() {
    console.log('create private group called');
    var method = {
        "msg": "method",
        "method": "createPrivateGroup",
        "id": String(messagesCount++),
        "params": [
            "channel-name16"+Math.random()
        ]
    };
    setTimeout(() => {
        socket.send(JSON.stringify(method));
        otherUserlogin();
    }, 2000);
}

var RocketChatApi = require('rocketchat').RocketChatApi;
var RocketChatClient = require('rocketchat').RocketChatClient;

var rocketChatClient = new RocketChatClient({
	protocol: 'http',
	port: '3000'
});

rocketChatClient.authentication.login('vineesha@gmail.com', 'password', function (err, body) {
    console.log('the user is %', err, body);
    const userId = body.data.userId;
    // once you get this userId do get call
    // http://localhost:3000/api/v1/rooms.joinRoom/neF773jK6QdEx4TG6 // the id is roomId
    // x-auth-token: vcvWY0SVojyWsltlPp_Y0YJAg7PGoTk9JqV3e5cmkaY
    // x-user-id: ws48dWz6XNJ8pmKKT
    // content-type: application/json
});

function generateHash(targetLength) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < targetLength; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}