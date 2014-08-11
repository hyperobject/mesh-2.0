var WebSocketServer = require('ws').Server;

var config = {
	port: process.argv[2] ? process.argv[2] : 4354
}

var wss = new WebSocketServer({
	port: config.port
});

var parties = [];
var partyAny = null;

wss.on('connection', function(ws) {
	console.log("Incoming connection..");
	
	var myParty = null;
	
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
		} else if(message.type == "set") {
			routeMessage({
				type: "set",
				varName: message.varName,
				value: message.value
			}, ws);
		} else if(message.type == "partyCreate") {
			if(!myParty) {
				var party = {
					name: message.name,
					participants: [ws]
				}
				
				myParty = party;
				parties.push(party);
			}
		} else if(message.type == "partyJoin") {
			if(!myParty) {
				for(var i = 0; i < parties.length; ++i) {
					if(parties[i].name == message.name) {
						parties[i].participants.push(ws);
						myParty = parties[i];
						parties.splice(i, 0);
						routeMessage({
							type: "partyFull"
						});
						break;
					}
				}
				// TODO: error handling
			}
		} else if(message.type == "partyAny") {
			if(partyAny) {
				myparty = { participants: [partyAny, ws] };
				partyAny.emit('match', myparty);
			} else {
				partyAny = ws; 
			}
	 	}
		
	});
	
	ws.on('match', function(party) {
		myparty = party;
		routeMessage({
			type: "partyFull"
		})
	})
})