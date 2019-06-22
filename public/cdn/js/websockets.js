let socket;

class webSockets {
	static createConnection() {
		//Connect to the server
		socket = io.connect(gameServer, {secure: true, 'connect timeout': 10000, transports: ['websocket'] });

		//Catch connection errors (like server offline)
		socket.on('connect_failed', function(){
			kick('CONNECT_LOSS',10000,true);

			if(ui.research) {
				ui.show('#hud-research');
			}
		});
		socket.on('connect_error', function(){
			kick('CONNECT_LOSS',10000,true);

			if(ui.research) {
				ui.show('#hud-research');
			}
		});
		socket.on('connect', function() {
			if(connectTimeout === undefined) {
				connectTimeout = -1;
			}
			if(connectTimeout !== -1) {
				clearTimeout(connectTimeout);
				connectTimeout = -1;
			}

			socket.emit('game-connect', userData);
		});

		//Sync the planet data
		socket.on('planet-recieve-data',function(data) {
			planetUI.refresh(data);
			if(userData.research !== undefined) {
				research.drawPanel();
			}
			loadScreen.complete('planet');
		});
		socket.on('map-recieve-data',function(data) {
			const system = data.systemAddress;

			map.planetData[data.systemAddress] = data;
			delete map.planetData[data.systemAddress].systemAddress;

			map.openSolarSystemMap(system);
		});

		//Sync the units data
		socket.on('units-recieve-data',function(data) {
			units.refresh(data);
			loadScreen.complete('units');
		});

		//Sync the fleet data
		socket.on('fleet-recieve-data',function(data) {
			units.fleetList = units.fleetList.filter((fleet) => fleet.motherPlanetId !== data.pid);

			for(const fleet of data.FleetList) {
				fleet.name = (fleetTranslate[fleet.name])?fleetTranslate[fleet.name]:fleet.name;

				units.fleetList.push(fleet);
			}

			units.regenerateSelectFleetLists();
			units.refresh(units.list);
			loadScreen.complete('fleet');
		});

		// Sync the tactics
		socket.on('tactics-recieve-data', (data) => {
			tactics.tacticList = data;
			tactics.drawList();
			loadScreen.complete('tactics');
		});

		//Sync the player data
		socket.on('player-recieve-data',function(data) {
			for(const key in data) {
				userData[key] = data[key];

				if(key==='research') {
					research.drawPanel();
					units.refresh(units.list); // Because type creation is disabled when no research && we need research to draw mines
				}
			}
			planetUI.MiscDrawUpdate();
			loadScreen.complete('player');
		});

		//Launch the chat
		chat.init();

		socket.on('server-mute', function(data) {
			chat.sm('<span style="color: #438dce;">' + translate.messages.CHAT_MUTED + ' ' + getStringTime(data.muteTime) + ' ' + translate.messages.HAT_MUTED_REASON + ' :</span> ' + ' ' + data.message);
		});
		socket.on('server-unmute', function() {
			chat.sm('<span style="color: #438dce;">' + translate.messages.CHAT_UNMUTED +'</span>');
		});

		// Alerts
		socket.on('server-alert', function(message) {
			ui.drawMessage(message);
		});
		socket.on('server-general-alert', function(message) {
			ui.drawMessage(message);
			chat.sm('<span style="color: #438dce;">' + translate.messages.SYSTEM_MESSAGE +'</span> ' + ' ' + message);
		});
		socket.on('notification', function(data) {
			notifications.notify(data.type, data.args);
		});
		socket.on('tutorial', (tutorial) => {
			TutorialsUI.newTutorial(tutorial);
		});

		// Daily bonus !
		socket.on('day-bonus', function(data) {
			ui.dailyBonus(data.days,data.best);
		});

		// Disconnect Events
		socket.on('server-kick', function(msg) {
			chat.sm('KICK');
			kick(msg);
		});
		socket.on('server-maintenance', function() {
			kick('MAINTENANCE');
		});
		socket.on('server-reboot', function() {
			kick('RESTARTING_SERVER');
		});
		window.addEventListener('beforeunload', function() {
			socket.emit('game-disconnect',{username: userData.username, id: userData.id, pid: userData.pid});
		});

		loadScreen.complete('server');
	}

}