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
// let chatToken = generateHash(17);
// let chatRoomId = generateHash(17);

// let subId = generateHash(17);
// let roomSubId = generateHash(17);
// let streamLivechatchatRoomId = generateHash(17);
// let steamNotifyRoomSubId = generateHash(17);

let name = 'sudhir';
let email = 'sudhirbitsgoa@gmail.com';
let guestName = 'guest';


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


// registration with contact
let registerObj = {
    msg: 'method',
    method: 'registerUser',
    params: [{
        name: 'contacttest',
        // email: 'samuel1@sam.com',
        contact: '7989562047',
        department: null,
        pass: "password",
        'confirm-pass': "password"
    }],
    id: String(messagesCount++),
};

setTimeout(() => {
    socket.send(JSON.stringify(registerObjEmail));
}, 2000);

let registerObjEmail = {
    msg: 'method',
    method: 'registerUser',
    params: [{
        name: 'emailtest',
        email: 'sudhir@sambandha.social',
        department: null,
        pass: "password",
        'confirm-pass': "password"
    }],
    id: String(messagesCount++),
};

// setTimeout(() => {
//     socket.send(JSON.stringify(registerObjEmail));
// }, 6000);