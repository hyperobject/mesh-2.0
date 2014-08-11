var WebSocketServer = require('ws').Server;

var config = {
	port: process.argv[2] ? process.argv[2] : 4354
}

var wss = new WebSocketServer({
	port: config.port
});

wss.on('connection', function(ws) {
	console.log("Incoming connection..");
	
	function routeMessage(msg, excluding) {
		// TODO: setup grouping
		
		var data = JSON.stringify(msg);
		
		for(var i in wss.clients)
			if(wss.clients[i] != excluding)
				wss.clients[i].send(data);
	}
	
	ws.on('message', function(message) {
		message = JSON.parse(message);
		console.log(message);
		
		if(message.type == "broadcast") {
			routeMessage({
				type: "broadcast",
				message: message.message
			}, ws);
		}
	});
	
})