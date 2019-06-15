// steps for the admin accept invitation
/*
    1. login admin
    2. create category
*/


const WebSocket = require('ws')
let socket = new WebSocket('ws://35.200.136.212:80/websocket');

//note messageCount is incremented with every message
//but it can works even if you didn't change it
let messagesCount = 10;
let timeCount = 1000;
let loggedInUId;
let contactId;
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
        if (response.result.contacts) {
            contactId = response.result.contacts[0];
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
        "id": (messagesCount++).toString(),
        "params": [{
            "user": {
                "email": "sudhir@chaturai.com"
            },
            "password": {
                "digest": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
                "algorithm": "sha-256"
            }
        }]
    };
    socket.send(JSON.stringify(login));
    getOtherUser()
}, timeCount);
// getOtherUser();
function getOtherUser() {
    setTimeout(() => {
        let vinUserId = loggedInUId;
        timeCount = timeCount+500;
        let login = {
            "msg": "method",
            "method": "login",
            "id": (messagesCount++).toString(),
            "params": [{
                "user": {
                    "email": "sudhir@chaturai.com"
                },
                "password": {
                    "digest": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
                    "algorithm": "sha-256"
                }
            }]
        };
        socket.send(JSON.stringify(login));
        // addToContacts(vinUserId);
        getContacts()
    }, timeCount+500);
}

function addToContacts(vinUserId) {
    setTimeout(() => {
        var createContact = {"msg":"method","method":"addRocketChatUsersAsContact","params":[[vinUserId]], "id":(messagesCount++).toString()};
        timeCount = timeCount + 500;
        socket.send(JSON.stringify(createContact));
        getContacts();
    }, timeCount+1000);
}

function getContacts() {
    console.log('get contacts triggered');
    var getContacts = {"msg":"method","method":"getContacts","params":[], "id":(messagesCount++).toString()};
    timeCount = timeCount + 500;
    socket.send(JSON.stringify(getContacts));
    // setTimeout(blockContacts, 2000)
}

function blockContacts() {
    var blockcontacts = { "msg": "method", "method": "blockContacts", "params": [[contactId]], "id": (messagesCount++).toString() };
    timeCount = timeCount + 500;
    socket.send(JSON.stringify(blockcontacts));
    // setTimeout(unblockContacts, 2000)
}


// function unblockContacts() {
//     var unblockCnts = { "msg": "method", "method": "unblockContacts", "params": [[contactId]], "id": (messagesCount++).toString() };
//     socket.send(JSON.stringify(unblockCnts));
// }