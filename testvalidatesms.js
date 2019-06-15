var RocketChatApi = require('rocketchat').RocketChatApi;
var RocketChatClient = require('rocketchat').RocketChatClient;

var rocketChatClient = new RocketChatClient({
	protocol: 'http',
	// host: '35.200.136.212',
	port: '3000'
});

// RocketChatApi.login('sudhirbitsgoa', 'password', function (err, body) {
// 	console.log('the user is %', err, body);
// });

// rocketChatClient.authentication.login('sudhirbitsgoa', 'password', function (err, body) {
// 	console.log('the user is %', err, body);
// });

// POST: /api/v1/users.register
// rocketChatClient.users.register({
// 	// name: Math.random() + "Sudhir",
// 	contact: '+917989562047'
// }, (e,b) => {
// 	console.log('the registraion is success', e, b);
// 	// POST: /api/v1/users.verifyToken
// 	// rocketChatClient.users.validateSMS({
// 	// 	token: '796175',
// 	// 	contact: '7989562047',
// 	// 	// username: '7989562047'
// 	// }, (err, body) => {
// 	// 	console.log('the body', err, body);
// 	// });
// })

rocketChatClient.users.validateSMS({
	token: '434194',
	contact: '+917989562047'
}, (err, body) => {
	console.log('the body', err, body);
});