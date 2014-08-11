(function(ext) {
	ext.incomingBroadcasts = {};
	ext.vars = {};
	
	ext._shutdown = function() {
	
	};
	
	ext._getStatus = function() {
		return {status: 2, msg: 'Ready'};
	};
	
	ext.send = function(msg) {
		if(ext.isOpen) {
			ext.socket.send(JSON.stringify(msg));
		}
	}
	
	ext.connect = function(host, port, callback) {
		ext.socket = new WebSocket("ws://"+host+":"+port+"/", "mesh");
		ext.isOpen = false;
		
		ext.socket.onopen = function(e) {
			ext.isOpen = true;
			callback();
		}
		
		ext.socket.onmessage = function(e) {
			var message = JSON.parse(e.data);
			console.log(message);
			
			if(message.type == "broadcast") {
				ext.incomingBroadcasts[message.message] = true;
			} else if(message.type == "set") {
				ext.vars[message.varName] = message.value;
			}
		}
		
		ext.socket.onclose = function(e) {
			ext.isOpen = false;
		}
		
		ext.socket.onerror = function(e) {
			ext.isOpen = false;
		}
	}
	
	ext.broadcast = function(message) {
		ext.send({
			type: "broadcast",
			message: message
		});
	}
	
	ext.whenIReceive = function(message) {
		if(ext.incomingBroadcasts[message]) {
			ext.incomingBroadcasts[message] = false;
			return true;
		} 
		
		return false;
	}
	
	ext.var = function(varName) {
		return ext.vars[varName] || "";
	}
	
	ext.setVar = function(varName, value) {
		ext.send({
			type: "set",
			varName: varName,
			value: value
		});
	}
	
	var descriptor = {
		blocks: [
			['w', 'connect to mesh server %s port %n', 'connect', 'localhost', 4354],
			
			[' ', 'broadcast %s', 'broadcast', 'message 1'],
			['h', 'when I receive %s', 'whenIReceive', 'message 1'],
			
			['r', 'value of %s', 'var', 'score'],
			[' ', 'set %s to %s', 'setVar', 'score', '10']
		]
	};
	
	ScratchExtensions.register('Mesh', descriptor, ext);
})({});