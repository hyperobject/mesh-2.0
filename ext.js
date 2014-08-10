(function(ext) {
	ext._shutdown = function() {
	
	};
	
	ext._getStatus = function() {
		return {status: 2, msg: 'Ready'};
	};
	
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
		}
		
		ext.socket.onclose = function(e) {
			ext.isOpen = false;
		}
		
		ext.socket.onerror = function(e) {
			ext.isOpen = false;
		}
	}
	
	var descriptor = {
		blocks: [
			['w', 'connect to mesh server %s port %n', 'connect', 'localhost', 4354]
		]
	};
	
	ScratchExtensions.register('Mesh', descriptor, ext);
});