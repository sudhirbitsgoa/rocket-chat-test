var RocketChatApi = require('rocketchat').RocketChatApi;
var RocketChatClient = require('rocketchat').RocketChatClient;

var rocketChatClient = new RocketChatClient({
	protocol: 'http',
	port: '3000'
});

// RocketChatApi.login('sudhirbitsgoa', 'password', function (err, body) {
// 	console.log('the user is %', err, body);
// });

// rocketChatClient.authentication.login('sudhirbitsgoa', 'password', function (err, body) {
// 	console.log('the user is %', err, body);
// });

rocketChatClient.users.validateSMS({
	token: '735762',
	contact: '7989562047',
	username: '7989562047'
}, (err, body) => {
	console.log('the body', err, body);
});