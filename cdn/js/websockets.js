var socket;

class webSockets {
	static createConnection() {
		//Connect to the server
		socket = io.connect('https://'+gameServer, {secure: true, 'connect timeout': 10000 });

		//Catch connection errors ( like server offline )
		socket.on('connect_failed', function(){
			kick("CONNECT_LOSS",10000,true);
			
			if(ui.research) {
				$("#hud-research").css('display','block');
			}
		});
		socket.on('connect_error', function(){
			kick("CONNECT_LOSS",10000,true);

			if(ui.research) {
				$("#hud-research").css('display','block');
			}
		});
		socket.on('connect', function() {
			if(connectTimeout==undefined) {
				connectTimeout = -1;
			}
			if(connectTimeout!=-1) {
				clearTimeout(connectTimeout);
				connectTimeout = -1;
			}

			socket.emit("game-connect", userData);
		});
		
		//Sync the planet data
		socket.on('planet-recieve-data',function(data) { 
			loadScreen.complete();
			planet.refresh(data);
		});

		//Sync the units data
		socket.on('units-recieve-data',function(data) { 
			loadScreen.complete();
			units.refresh(data);
		});

		//Sync the player data
		socket.on('player-recieve-data',function(data) {
			for(var key in data) {
				userData[key] = data[key];

				if(key=="research") {
					research.drawPanel();
				}
			}
			planet.MiscDrawUpdate();
			loadScreen.complete();
		});

		//Launch the chat		
		chat.launch();

		// Alerts
		socket.on('server-alert', function(message) {
			ui.drawMessage(message);
		});
		socket.on('server-general-alert', function(message) {
			ui.drawMessage(message);
			chat.sm("<span style=\"color: #438dce;\">" + messageList['SYSTEM_MESSAGE'] +"</span> " + " " + message);
		});

		// Daily bonus !
		socket.on('day-bonus', function(data) {
			ui.dailyBonus(data.days,data.best);
		});

		// Disconnect Events
		socket.on('server-kick', function(msg) {
			chat.sm("KICK");
			kick(msg);
		});
		socket.on('server-maintenance', function() {
			kick("MAINTENANCE");
		});
		socket.on('server-reboot', function() {
			kick("REBOOT");
		});
		$(window).on("beforeunload", function() {
			socket.emit("game-disconnect",{username: userData.username, id: userData.id, pid: userData.pid});
		});

		loadScreen.complete();
	}

}