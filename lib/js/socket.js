var socket = io.connect('https://'+serverip+':34269', {secure: true});

$(document).ready(function(){
	var resourcesinterval = -1;
	socket.emit('ask-planet-info', { planet: (getParameterByName("pid"))?getParameterByName("pid"):"-1",user: userData.id, RandomToken: userData.RandomToken });
	socket.on('recieve-planet-info', function (data) {
		if(data.RandomToken==userData.RandomToken) {
			planetContent = data.data; 
			refreshPlanetInfos(true,true);
			if(resourcesinterval==-1) {
				resourcesinterval = setInterval(ClientsideResourcesUpdate,2000);
			}
		}

		CloseLoadingOverlay();
	});
	socket.on('answer-to-client', function(data) {
		if(data.RandomToken==userData.RandomToken) {
			drawMessage(data.message);
		}
	});
	$(window).on("beforeunload", function() {
		socket.emit("chat-disconnect",userData.name);
	});
});