var socket;

class webSockets {
	static createConnection() {
		//Connect to the server
		socket = io.connect('https://'+gameServer+':'+gameServerPort, {secure: true, 'connect timeout': 5000 });

		//Catch connection errors ( like server offline )
		socket.on('connect_failed', function(){
			kick("La connexion au serveur n'a pas pu s'etablir.");
		});
		socket.on('connect_error', function(){
			kick("La connexion au serveur n'a pas pu s'etablir.");
		});

		//Now say to the server we're on
		socket.emit("game-connect", userData);

		//Sync the planet data
		socket.on('recieve-planet-info',function(data) { 
			loadScreen.complete();
			planet.refresh(data) });
		planet.sync();

		//Launch the chat		
		chat.launch();

		// Alerts
		socket.on('server-alert', function(data) {
			if(auth(data.id)) {
				drawMessage(data.message);
			}
		});
		socket.on('server-general-alert', function(message) {
			drawMessage(message);
		});

		// Disconnect Events
		socket.on('server-kick', function(data) {
			if(auth(data.id)) {
				kick("kicked from game");
			}
		});
		socket.on('server-maintenance', function() {
			kick("Maintenance du serveur de jeu");
		});
		socket.on('server-reboot', function() {
			kick("Redemarrage du serveur de jeu");
		});
		$(window).on("beforeunload", function() {
			socket.emit("game-disconnect",{username: userData.username, id: userData.id});
		});

		loadScreen.complete();
	}

}