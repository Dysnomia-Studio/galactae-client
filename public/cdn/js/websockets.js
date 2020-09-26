let socket;

class webSockets {
	static createConnection() {
		//Connect to the server
		socket = io.connect(gameServer, {secure: true, 'connect timeout': 10000, transports: ['websocket'] });

		//Catch connection errors (like server offline, or network issues)
		const connectError = () => {
			kick('CONNECT_LOSS', 10000, true);

			if(ui.research) {
				ui.show('#hud-research');
			}
		};
		socket.on('connect_failed', connectError);
		socket.on('connect_error', connectError);

		socket.on('connect', function() {
			if(connectTimeout === undefined) {
				connectTimeout = -1;
			}
			if(connectTimeout !== -1) {
				clearTimeout(connectTimeout);
				connectTimeout = -1;
			}

			socket.emit('game-connect', webSockets.getUserData());
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
		socket.on('map-influence-zones', (data) => {
			map.influenceZones = data;
			InfluenceZones.drawInfluenceZones();
		});

		//Sync the units data
		socket.on('units-recieve-data',function(data) {
			units.refresh(data);
			loadScreen.complete('units');
		});

		//Sync the fleet data
		socket.on('fleet-recieve-data',function(data) {
			for(const fleet of data.FleetList) {
				fleet.name = (fleetTranslate[fleet.name])?fleetTranslate[fleet.name]:fleet.name;
				if(fleet.endMoveTime !== null) {
					fleet.endMoveTime = new Date(fleet.endMoveTime);
				}

				const index = units.fleetList.map((elt) => elt.id).indexOf(fleet.id);
				if(index !== -1) {
					units.fleetList.splice(index, 1);
				}

				units.fleetList.push(fleet);
			}

			units.fleetList = units.fleetList.filter((elt) => elt.position === planetData.address || elt.motherPlanetAddress === planetData.address);

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

		// Sync the player data
		socket.on('player-recieve-data',function(data) {
			for(const key in data) {
				userData[key] = data[key];

				if(key==='research') {
					research.drawPanel();
					units.refresh(units.list); // Because type creation is disabled when no research && we need research to draw mines
					planetUI.InfoPopupDrawUpdate();
				}
			}
			planetUI.MiscDrawUpdate();
			loadScreen.complete('player');
		});

		// Sync the player reports
		socket.on('player-report-list', (reports) => {
			Reports.init(reports);
		});
		socket.on('player-report-full', (report) => {
			Reports.cache[report.battleLog_id] = report;
			Reports.displayReport(report.battleLog_id);
		});

		// Sync the alliance details
		socket.on('player-alliance-data', (alliance) => {
			Alliances.updateDetails(alliance);
		});

		socket.on('player-search-results', (alliances) => {
			Alliances.searchResults = alliances;
			Alliances.updateSearchResults();
		});

		// Sync the conquest list
		socket.on('player-conquest-list', (conquestList) => {
			Conquest.init(conquestList);
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
			Tutorials.newTutorial(tutorial);
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

		window.addEventListener('error', function(event) {
			if(!event.error) {
				event.error = {};
			}

			socket.emit('client-error', {
				...webSockets.getUserData(),
				errorName: event.error.name,
				errorMessage: event.error.message,
				errorStack: event.error.stack,
			});
		});

		loadScreen.complete('server');
	}

	static getUserData() {
		return {
			username: userData.username,
			id: userData.id,
			pid: userData.pid,
		};
	}
}
