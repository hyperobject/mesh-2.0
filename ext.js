(function(ext) {
	ext.incomingBroadcasts = {};
	
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
	
	var descriptor = {
		blocks: [
			['w', 'connect to mesh server %s port %n', 'connect', 'localhost', 4354],
			
			[' ', 'broadcast %s', 'broadcast', 'message 1'],
			['h', 'when I receive %s', 'whenIReceive', 'message 1']
		]
	};
	
	ScratchExtensions.register('Mesh', descriptor, ext);
})({});