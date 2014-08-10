var WebSocketServer = require('ws').Server;

var config = {
	port: process.argv[2] ? process.argv[2] : 4354
}

var wss = new WebSocketServer({
	port: config.port
});

wss.on('connection', function(ws) {
	console.log("Incoming connection..");
	
	ws.on('message', function(message) {
		message = JSON.parse(message);
		console.log(message);
		
	});
	
})