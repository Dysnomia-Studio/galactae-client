const mapPrevMouse = [0,0];

class map {
	/**
	 * Handle mobile touch and bind it to mouse events
	 */
	static touchHandler(event) {
		const touch = event.changedTouches[0];

		const simulatedEvent = document.createEvent('MouseEvent');
		simulatedEvent.initMouseEvent({
			touchstart: 'mousedown',
			touchmove: 'mousemove',
			touchend: 'mouseup',
		}[event.type], true, true, window, 1,
		touch.screenX, touch.screenY,
		touch.clientX, touch.clientY, false,
		false, false, false, 0, null);

		touch.target.dispatchEvent(simulatedEvent);
		event.preventDefault();
	}

	/**
	 * Map init
	 *
	 * @param	  {string}  address  The address
	 */
	static init(address) {
		map.currentMap = (map.currentMap === undefined)?'global':map.currentMap;
		map.currentAddress = (map.currentAddress === undefined)?address:map.currentAddress;

		map.xmlhttp	= (map.xmlhttp === undefined)?[]:map.xmlhttp;
		map.xmlDoc	 = (map.xmlDoc === undefined)?[]:map.xmlDoc;

		map.zoom = 1;

		map.planetData = (map.planetData === undefined) ? [] : map.planetData;

		map.oldPos = [0,0];

		if(!map.influenceZones) {
			map.influenceZones = {};
		}

		if(!map.points) {
			map.points = [];
		}

		/**
		 * Load XML
		 */
		map.focusAddress(address);

		/**
		 * Global Map Events
		 **/
		document.getElementById('map-back').addEventListener('click', function() {
			map.openGlobalMap(map.currentAddress);
		});

		/**
		 * Move & zoom
		 */
		'touchstart touchmove touchend touchcancel'.split(' ').forEach(function(e) {
			document.getElementById('map-global').addEventListener(e, function(event) {
				if(map.scaling) {
					return;
				}

				map.touchHandler(event);
			});
		});

		document.getElementById('map-global').addEventListener('touchstart', function(e) {
			mapPrevMouse[0] = e.pageX;
			mapPrevMouse[1] = e.pageY;
		});
		document.getElementById('map-global').addEventListener('mousemove', function(e) {
			window.cancelAnimationFrame(map.frameId);

			map.frameId =  window.requestAnimationFrame(() => {
				if(ui.mouseStatus[1] === 1) {
					map.moveUI([(e.pageX - mapPrevMouse[0]),
						(e.pageY - mapPrevMouse[1])], true);
				}
				mapPrevMouse[0] = e.pageX;
				mapPrevMouse[1] = e.pageY;

				if(e.target.id.split('-').length === 3) {
					document.getElementById('map-address').style.left = e.pageX + 'px';
					document.getElementById('map-address').style.top = (e.pageY - 30) + 'px';

					document.getElementById('map-address').innerText = e.target.id;

					ui.show('#map-address');
				} else {
					ui.hide('#map-address');
				}
			});
		});

		const mousewheelevt=(/Firefox/i.test(navigator.userAgent))?'DOMMouseScroll' :'mousewheel'; // Because firefox doesn't know the "mousewheel" event ...
		document.getElementById('map-global').addEventListener(mousewheelevt, function(e) {
			let coef = -MAP_ZOOM_COEF; // Scroll down
			if (e.wheelDelta > 0 || e.detail < 0) {
				coef = MAP_ZOOM_COEF; // Scroll up
			}

			map.makeZoom(coef);
		});

		document.getElementById('map-global').addEventListener('touchstart', function(e) {
			if(e.touches.length === 2 && !map.scaling) {
				map.scaling = true;

				map.dist = Math.hypot(
					e.touches[0].pageX - e.touches[1].pageX,
					e.touches[0].pageY - e.touches[1].pageY);
			} else {
				map.scaling = false;
			}
		});
		document.getElementById('map-global').addEventListener('touchmove', function(e) {
			if(map.scaling) {
				const newDist = Math.hypot(
					e.touches[0].pageX - e.touches[1].pageX,
					e.touches[0].pageY - e.touches[1].pageY);


				let coef = (map.dist / newDist) - 1;
				if(coef > MAP_ZOOM_COEF_MOBILE_MAX) {
					coef = MAP_ZOOM_COEF_MOBILE_MAX;
				}
				if(coef < -MAP_ZOOM_COEF_MOBILE_MAX) {
					coef = -MAP_ZOOM_COEF_MOBILE_MAX;
				}
				if(coef === 0) {
					return;
				}

				map.makeZoom(-coef);

				map.dist = newDist;
			}
		});
		document.getElementById('map-global').addEventListener('touchend', function(e) {
			map.scaling = false;
		});

		document.getElementById('map-focus').addEventListener('click', function() {
			map.focusAddress(map.currentAddress = planetData.address);
		});

		document.getElementById('planet-other-returnToCurrent').addEventListener('click', function() {
			map.closeTab();
		});

		document.getElementById('planet-other-returnToSystem').addEventListener('click', function() {
			// On cache le chat et memorise son statut pour plus tard
			ui.mapChat = (document.getElementById('hud-chat').style.display === 'block');
			ui.closeTab('#hud-chat',false);
			ui.chat = false;

			ui.show('#hud-map');
		});

		loadScreen.complete('maps');
	}

	static makeZoom(coef) {
		coef = parseFloat(parseFloat(coef).toFixed(2));
		const oldZoom = 0 + map.zoom;
		map.zoom += coef;

		if(map.zoom < MAP_MIN_ZOOM || map.zoom > MAP_MAX_ZOOM) {
			map.zoom -= coef;
			return;
		}

		window.cancelAnimationFrame(map.zoomFrameId);

		map.zoomFrameId =  window.requestAnimationFrame(() => {
			const mapElt = document.getElementById('map-global');

			mapElt.style.zoom = map.zoom;
			mapElt.style.MozTransform = 'scale(' + map.zoom + ')';

			map.oldPos[0] = map.oldPos[0] - (1/oldZoom * mapPrevMouse[0]) + (1/map.zoom * mapPrevMouse[0]);
			map.oldPos[1] = map.oldPos[1] - (1/oldZoom * mapPrevMouse[1]) + (1/map.zoom * mapPrevMouse[1]);

			mapElt.style.left =  Math.round(map.oldPos[0]) + 'px';
			mapElt.style.top =  Math.round(map.oldPos[1]) + 'px';

			map.updateSectorVisibility();
		});
	}

	static updateSectorVisibility() {
		const pos = ui.position('#map-global');

		if(pos.left === 0 && pos.top === 0) {
			return;
		}

		const width = document.documentElement.clientWidth * 1.5 / map.zoom;
		const height = document.documentElement.clientHeight * 1.5 / map.zoom;

		const realLeft = MAP_SIZE_WIDTH + pos.left + width / 2;
		const realTop = MAP_SIZE_HEIGHT + pos.top + height / 2;

		const cellSizeX = MAP_SIZE_WIDTH / 100;
		const cellSizeY = MAP_SIZE_HEIGHT / 100;

		for(const group of document.getElementById('map-global').children) {
			let x = group.getAttribute('x');
			let y = group.getAttribute('y');

			if(!x || !y) {
				continue;
			}

			x = MAP_SIZE_WIDTH - parseInt(x, 10) * cellSizeX;
			y = MAP_SIZE_HEIGHT - parseInt(y, 10) * cellSizeY;

			const xDiff = Math.abs(x - realLeft);
			const xDiff2 = Math.abs((x + cellSizeX) - realLeft);
			const yDiff = Math.abs(y - realTop);
			const yDiff2 = Math.abs((y + cellSizeY) - realTop);

			if((xDiff <= width || xDiff2 <= width) && (yDiff <= height ||yDiff2 <= height)) {
				group.style.display = 'block';
			} else {
				group.style.display = 'none';
			}
		}
	}

	/**
	 * Move the ui
	 *
	 * @param	  {2D vector}  pos	 The position
	 */
	static moveUI(pos, diff=false) {
		if(Number.isNaN(pos[0]) || Number.isNaN(pos[1])) {
			return;
		}

		if(diff) {
			pos[0] += map.oldPos[0];
			pos[1] += map.oldPos[1];
		}

		if(parseInt(pos[0]) > 0) {
			pos[0] = 0;
		}
		if(parseInt(pos[1]) > 0) {
			pos[1] = 0;
		}

		if(pos[0] === map.oldPos[0] && pos[1] === map.oldPos[1]) {
			return;
		}

		map.oldPos = pos;

		document.getElementById('map-global').style.left = pos[0] + 'px';
		document.getElementById('map-global').style.top = pos[1] + 'px';

		map.updateSectorVisibility();

		// At borders ?
		const coords = [];
		coords[0] = Math.floor((document.documentElement.clientWidth/2 - pos[0])/MAP_SIZE_WIDTH*10);
		coords[1] = Math.floor((document.documentElement.clientHeight/2 - pos[1])/MAP_SIZE_HEIGHT*10);

		map.loadMapAndNeighborhood(coords[0] + '-' + coords[1]);

		// @TODO: ability to disable this with some settings
		if(document.documentElement.clientWidth < MAP_BG_WIDTH || document.documentElement.clientHeight < MAP_BG_HEIGHT) {
			document.getElementById('hud-map').style.backgroundPositionX = ((MAP_BG_WIDTH - document.documentElement.clientWidth)/MAP_SIZE_WIDTH*(pos[0]) )+ 'px';
			document.getElementById('hud-map').style.backgroundPositionY = ((MAP_BG_HEIGHT - document.documentElement.clientHeight)/MAP_SIZE_HEIGHT*(pos[1])) + 'px';
		}
	}

	/**
	 * Loads a map and neighborhood.
	 *
	 * @param	  {string}  sector  The sector
	 */
	static loadMapAndNeighborhood(sector,callback) {
		const coords = sector.split('-');

		// At borders ?
		coords[0] = parseInt(coords[0]);
		coords[1] = parseInt(coords[1]);
		const top = coords[0] === 0;
		const bottom = coords[0] === 9;
		const left = coords[1] === 0;
		const right = coords[1] === 9;

		/**
		 * Load all needed xml
		 */
		map.loadXML(sector,callback);

		if(!top) {
			if(!left) { // Haut gauche
				map.loadXML((coords[0]-1) + '-' + (coords[1]-1),callback);
			}
			// Haut
			map.loadXML((coords[0]-1) + '-' + (coords[1]),callback);
			if(!right) { // Haut droite
				map.loadXML((coords[0]-1) + '-' + (coords[1]+1),callback);
			}
		}

		if(!left) { // Gauche
			map.loadXML((coords[0]) + '-' + (coords[1]-1),callback);
		}

		if(!right) { // Droite
			map.loadXML((coords[0]) + '-' + (coords[1]+1),callback);
		}

		if(!bottom) {
			if(!left) { // Bas gauche
				map.loadXML((coords[0]+1) + '-' + (coords[1]-1),callback);
			}
			// Bas
			map.loadXML((coords[0]+1) + '-' + (coords[1]),callback);
			if(!right) { // Bas droite
				map.loadXML((coords[0]+1) + '-' + (coords[1]+1),callback);
			}
		}
	}

	/**
	 * Loads a xml.
	 *
	 * @param	  {string}  sector  The sector
	 */
	static loadXML(sector, callback) {
		if(typeof map.xmlDoc[sector] !== 'undefined' && callback) {
			callback();
			return;
		} // Already loaded

		const toSend = typeof map.xmlhttp[sector] === 'undefined';
		if(toSend) {
			if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
				map.xmlhttp[sector] = new XMLHttpRequest();
			} else { // code for IE6, IE5
				map.xmlhttp[sector] = new ActiveXObject('Microsoft.XMLHTTP');
			}
		}

		map.xmlhttp[sector].addEventListener('readystatechange',function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				if (this.status === HTTP.OK) {
					map.xmlDoc[sector] = new DOMParser().parseFromString(map.xmlhttp[sector].responseText,'text/xml');
					map.drawSector(sector);
					if(typeof callback !== 'undefined') {
						callback();
					}
				} else {
					delete map.xmlDoc[sector];
					console.trace('');
					console.error('ERROR: CANNOT LOAD MAP OF SECTOR ' + sector);
				}
			}
		});

		if(toSend && sector !== '') {
			map.xmlhttp[sector].open('GET','cdn/maps/' + serverName + '/' + sector + '.xml', true);
			map.xmlhttp[sector].send();
		}
	}

	/**
	 * Opens map tab.
	 */
	static openTab() {
		ui.show('#hud-map');
		ui.closeTab('#hud-research',false); /* A no-bug fix */
		ui.map = true;

		// On cache le chat et memorise son statut pour plus tard
		ui.mapChat = (document.getElementById('hud-chat').style.display === 'block');
		ui.closeTab('#hud-chat',false);
		ui.chat = false;

		// On demande la mise à jour des zones d'influence au serveur
		socket.emit('global-ask-influenceData', webSockets.getUserData());
	}

	/**
	 * Closes map tab.
	 */
	static closeTab() {
		// Reset planet view
		ui.show('#hud-top');
		ui.show('#planet-current');
		ui.hide('#planet-other');
		planetBack.init(planetData.planetType);

		// Close tab
		ui.closeTab('#hud-map');
		ui.map = false;

		// Draw chat if needed
		if(!ui.chat) {
			if(ui.mapChat) {
				ui.show('#hud-chat');
			}
			ui.chat = ui.mapChat;
		}

		ui.updateBottom();
	}

	/**
	 * Reset maps display
	 */
	static resetMaps() {
		/* Hide all maps */
		ui.hide('#map-global');
		ui.hide('#map-global-legend');
		ui.hide('#map-address');
		ui.hide('#map-system');

		ui.show('#hud-map');

		/* Empty HTML to avoid bugs */
		if(map.currentMap !== 'system') {
			document.getElementById('map-system-solarFront').innerHTML = '';
		}
	}

	// View info
	static viewPlanetInfo(e) {
		if(ui.hasClass(this.parentNode.parentNode, 'orbit')) {
			units.planetTarget = this.parentNode.parentNode.id;
		} else {
			units.planetTarget = this.id.split('liste_').join(''); // Center star or bottom bar
		}

		const system = GameMap.getSystemFromAdress(units.planetTarget);

		if(map.planetData[system][units.planetTarget].ownerName === null) {
			document.getElementById('map-planet-menu-planetname').innerText = '';
			document.getElementById('map-planet-menu-username').innerText = '';
		} else { // Player planet
			document.getElementById('map-planet-menu-planetname').innerText = map.planetData[system][units.planetTarget].name;
			document.getElementById('map-planet-menu-username').innerText = '(' + map.planetData[system][units.planetTarget].ownerName + ')';
		}

		ui.show('#map-planet-menu img');

		document.getElementById('map-planet-menu').style.left = e.pageX + 'px';
		document.getElementById('map-planet-menu').style.top = e.pageY + 'px';

		ui.show('#map-planet-menu');
	}

	static parseSystemXML(address) {
		const sector = GameMap.getSectorFromAdress(address);

		const systemXML = map.xmlDoc[sector].querySelector('sy[id="' + address + '"]');

		const stars = [];
		const starsXML = systemXML.querySelectorAll('st');
		for(let i=0; i< starsXML.length; i++) {
			stars[i] = {};
			stars[i].address = starsXML[i].id;
			stars[i].size	= (STAR_SIZE_BASE + STAR_SIZE_COEF * parseFloat(starsXML[i].getAttribute('sz')));
			stars[i].type	= starsXML[i].getAttribute('t');
		}

		const planets = [];
		const planetsXML = systemXML.querySelectorAll('p');
		for(let i=0; i< planetsXML.length; i++) {
			planets[i] = {};
			planets[i].address = planetsXML[i].id;
			planets[i].size	= planetsXML[i].getAttribute('sz');
			planets[i].type	= planetsXML[i].getAttribute('t');
			planets[i].gtype   = planetsXML[i].getAttribute('gt');
		}

		return [stars, planets];
	}

	static declareSolarSystemEvents() {
		document.querySelectorAll('#map-system .planet').forEach((elt) => {
			elt.addEventListener('click', map.viewPlanetInfo);
		});
		document.querySelectorAll('#map-system .star').forEach((elt) => {
			elt.addEventListener('click', map.viewPlanetInfo);
		});

		document.addEventListener('click', (e) => {
			if(!ui.hasClass(e.target, 'planet') && !ui.hasClass(e.target, 'pos') && !ui.hasClass(e.target, 'star')) {
				ui.hide('#map-planet-menu');
			}
		});
		document.querySelectorAll('#map-planet-menu img').forEach((elt) => {
			elt.addEventListener('click', (e) => {
				switch(e.target.id) {
					case 'map-planet-menu-infos':
						planetUI.openOtherPlanetPanel();
						break;
					case 'map-planet-menu-move':
						units.openMovePanel(FLEET_MOVE_TYPE.MOVE);
						break;
					case 'map-planet-menu-attack':
						units.openMovePanel(FLEET_MOVE_TYPE.ATTACK);
						break;
					case 'map-planet-menu-defend':
						units.openMovePanel(FLEET_MOVE_TYPE.DEFEND);
						break;
					case 'map-planet-menu-spy':
						units.openMovePanel(FLEET_MOVE_TYPE.SPY);
						break;
					case 'map-planet-menu-trade':
						trade.openPlanetPanel();
						break;
				}

				ui.hide('#map-planet-menu');
			});
		});
		document.getElementById('map-move-panel-close').addEventListener('click', () => {
			ui.hide('#map-move-panel');
		});
	}

	/**
	 * Opens a solar system map.
	 *
	 * @param	  {string}  address  The address
	 */
	static openSolarSystemMap(address) { // CSS inspired by work of Julian Garnier - codepen.io/juliangarnier/pen/idhuG
		// Check Address
		if(typeof(address) !== 'string' || address.split('-').length !== 3) {
			console.error('INVALID ADRESS FORMAT !');
			return;
		}

		map.currentMap = 'system';
		document.getElementById('map-system-solarFront').innerHTML = '';
		document.getElementById('map-system-solarFront-list').innerHTML = '';

		// Parse XML
		const [stars, planets] = map.parseSystemXML(address);

		/**
		 * Stars drawing
		 */
		let firstPlanet = 0; // let needed to know where to place the planets
		let orbitSize = [];

		// Sort by size
		stars.sort(function(a,b) {
			if(a.size === b.size) {
				return 0;
			} else if(a.size > b.size) {
				return -1;
			}
			return 1;
		});

		// Calc star positions for ...
		if(stars.length === 1) { // one star
			orbitSize[0] = 0;

			firstPlanet = stars[0].size * STAR_ECART;
		} else if(stars.length === 2) { // two stars
			// Si c'est les memes gTypes (naine et naine OU geante et geante), et on exclue les supergeantes
			if(stars[0].type.substr(-5) === stars[1].type.substr(-5) &&
				stars[0].type.substr(-10) !== 'SuperGiant' &&
				stars[1].type.substr(-10) !== 'SuperGiant') {

				orbitSize[0] = orbitSize[1] = (stars[0].size + stars[1].size)/2 * STAR_ECART;
			} else {
				orbitSize[0] = 0;

				orbitSize[1] = stars[0].size * STAR_ECART + stars[1].size * STAR_ECART/2;
			}

			firstPlanet =  orbitSize[1] + stars[1].size * STAR_ECART/2;
		} else { // 3 stars
			if(stars[0].type.substr(-5) !== stars[1].type.substr(-5) &&
				stars[1].type.substr(-5) === stars[2].type.substr(-5) &&
				stars[1].type.substr(-10) !== 'SuperGiant' &&
				stars[2].type.substr(-10) !== 'SuperGiant') { // Same 2 lasts stars

				orbitSize[0] = 0;

				orbitSize[1] = orbitSize[2] = stars[0].size * STAR_ECART + (stars[1].size + stars[2].size)/2 * STAR_ECART;

			} else { // Sort by size or same 2 first stars or same 3 stars
				if(stars[0].size - stars[1].size < 1) { // If 2 biggers are almost same size
					orbitSize[0] = orbitSize[1] = (stars[0].size + stars[1].size)/2 * STAR_ECART;

					orbitSize[2] = 2 * orbitSize[1] + stars[2].size/2 * STAR_ECART;
				} else { // If one is bigger than 2 others
					orbitSize[0] = 0;

					orbitSize[1] = orbitSize[2] = stars[0].size * STAR_ECART + (stars[1].size + stars[2].size)/2 * STAR_ECART;
				}
			}

			firstPlanet =  orbitSize[2] + stars[1].size * STAR_ECART/2;
		}

		// Then, we place it in HTML
		for(let i=0; i<stars.length; i++) {
			if(orbitSize[i] === 0) {
				// Create DOM
				document.getElementById('map-system-solarFront').innerHTML += '<div class="star ' + stars[i].type + '" id="' + stars[i].address + '"></div>';
			} else {
				document.getElementById('map-system-solarFront').innerHTML += '<div class="orbit" id="' + stars[i].address + '"><div class="pos"><div class="star ' + stars[i].type + '" ></div></div></div>';

				orbitSize[i] = Math.round(orbitSize[i] * 100)/100;

				// Set Orbit, star position and anim duration

				// Anim duration
				let orbitDuration = orbitSize[i] * 36; // in seconds
				orbitDuration = Math.round(orbitDuration * 100)/100;

				document.getElementById(stars[i].address).style.animationDuration = orbitDuration + 's';
				document.querySelector('div[id="' + stars[i].address + '"] .pos').style.animationDuration = orbitDuration + 's';

				// Multiple stars on same orbit
				if(stars.length === 3 && orbitSize[0] === orbitSize[1] && orbitSize[0] === orbitSize[2]) {
					document.getElementById(stars[i].address).style.animationDelay = '-' + i*orbitDuration/3 + 's';
					document.querySelector('div[id="' + stars[i].address + '"] .pos').style.animationDelay = '-' + i*orbitDuration/3 + 's';
				} else if((i === 1 && orbitSize[0] === orbitSize[1]) ||(i === 2 && orbitSize[1] === orbitSize[2])) {
					document.getElementById(stars[i].address).style.animationDelay = '-' + i*orbitDuration/2 + 's';
					document.querySelector('div[id="' + stars[i].address + '"] .pos').style.animationDelay = '-' + i*orbitDuration/2 + 's';
				}

				/* Orbit */
				document.getElementById(stars[i].address).style.height = orbitSize[i] + 'vh';
				document.getElementById(stars[i].address).style.width = orbitSize[i] + 'vh';

				document.getElementById(stars[i].address).style.marginTop = '-' + (orbitSize[i]/2) + 'vh';
				document.getElementById(stars[i].address).style.marginLeft = '-' + (orbitSize[i]/2) + 'vh';

				/* Star Pos */
				const posAng = (((Date.now() + planetUI.deltaNow)/1000)%orbitDuration)/orbitDuration * (2* Math.PI); // in radians

				document.querySelector('div[id="' + stars[i].address + '"] .pos').style.top = 'calc(50% + ' + (orbitSize[i]/2) * Math.sin((2* Math.PI) - posAng) + 'vh)';
				document.querySelector('div[id="' + stars[i].address + '"] .pos').style.left = 'calc(50% + ' + (orbitSize[i]/2) * Math.cos((2* Math.PI) - posAng) + 'vh)';
			}

			// Add it to stars/planet list
			document.getElementById('map-system-solarFront-list').innerHTML += '<div class="star ' + stars[i].type + '" id="liste_' + stars[i].address + '"><div class="name">' + stars[i].address + '</div></div>';
			const position = i/(stars.length + planets.length - 1);
			document.getElementById('liste_' + stars[i].address).style.left = Math.round(5 + position * 90) + '%';

			// Set Size
			document.getElementById(stars[i].address).style.fontSize = stars[i].size + 'vh';
			document.getElementById('liste_' + stars[i].address).style.fontSize = stars[i].size + 'vh';
			document.querySelector('#liste_' + stars[i].address + ' .name').style.top = (6 + stars[i].size/2) + 'vh';
		}

		/**
		 * Planets creation
		 */
		orbitSize = firstPlanet;
		for(let i=0; i<planets.length; i++) {
			// Create DOM
			document.getElementById('map-system-solarFront').innerHTML += '<div class="orbit" id="' + planets[i].address + '"><div class="pos"></div></div>';

			// Set Size
			const size = PLANET_SIZE_BASE + parseFloat(planets[i].size)*PLANET_SIZE_COEF;
			document.getElementById(planets[i].address).style.fontSize = size + 'vh';

			if(i === 0) {
				orbitSize += size * PLANET_ECART/2;
			} else {
				orbitSize += (PLANET_SIZE_BASE + parseFloat(planets[i - 1].size)*PLANET_SIZE_COEF) * PLANET_ECART/2 + size * PLANET_ECART/2;
			}
			orbitSize = Math.round(orbitSize * 100)/100;

			// Anim duration
			let orbitDuration = (2 + orbitSize) * 100;
			orbitDuration = Math.round(orbitDuration * 100)/100;

			document.getElementById(planets[i].address).style.animationDuration = orbitDuration + 's';
			document.querySelector('div[id="' + planets[i].address + '"] .pos').style.animationDuration = orbitDuration + 's';

			/* Orbit */
			document.getElementById(planets[i].address).style.height = orbitSize + 'vh';
			document.getElementById(planets[i].address).style.width = orbitSize + 'vh';

			document.getElementById(planets[i].address).style.marginTop ='-' + (orbitSize/2) + 'vh';
			document.getElementById(planets[i].address).style.marginLeft ='-' + (orbitSize/2) + 'vh';

			/* Planet Pos */
			const posAng = (((Date.now() + planetUI.deltaNow)/1000)%orbitDuration)/orbitDuration * (2* Math.PI); // in radians

			document.querySelector('div[id="' + planets[i].address + '"] .pos').style.top = 'calc(50% + ' + (Math.sin((2* Math.PI) - posAng) * orbitSize/2) + 'vh)';
			document.querySelector('div[id="' + planets[i].address + '"] .pos').style.left = 'calc(50% + ' + (Math.cos((2* Math.PI) - posAng) * orbitSize/2) + 'vh)';

			/* Planet Img */
			document.querySelector('div[id="' + planets[i].address + '"] .pos').innerHTML += '<div class="planet"></div>';
			document.querySelector('div[id="' + planets[i].address + '"] .pos .planet').style.backgroundImage = 'url('+cdnURL+'/img/planets/front/' + planets[i].type + '.jpg)';

			/* Set & Place shadow anim */
			document.querySelector('div[id="' + planets[i].address + '"] .pos .planet').style.animationName = 'planetShadow';

			const currShadow = (posAng/(2*Math.PI))*orbitDuration - orbitDuration;
			document.querySelector('div[id="' + planets[i].address + '"] .pos .planet').style.animationDelay = currShadow + 's';

			document.querySelector('div[id="' + planets[i].address + '"] .pos .planet').style.animationDuration = orbitDuration + 's';

			// @TODO: Rings & Moons

			// Add it to stars/planet list
			const name = (map.planetData[address] && map.planetData[address][planets[i].address] && map.planetData[address][planets[i].address].name) ? map.planetData[address][planets[i].address].name : planets[i].address;
			document.getElementById('map-system-solarFront-list').innerHTML += '<div class="planet" id="liste_' + planets[i].address + '"><div class="name">' + name + '</div></div>';
			document.getElementById('liste_' + planets[i].address).style.backgroundImage = 'url('+cdnURL+'/img/planets/front/' + planets[i].type + '.jpg)';
			const position = (stars.length + i)/(stars.length + planets.length - 1);
			document.getElementById('liste_' + planets[i].address).style.left = Math.round(5 + position * 90) + '%';
			document.getElementById('liste_' + planets[i].address).style.fontSize = size + 'vh';
			document.querySelector('#liste_' + planets[i].address + ' .name').style.top = (6 + size/2) + 'vh';
		}

		map.declareSolarSystemEvents();

		// Back button
		ui.show('#map-back');
		ui.hide('#map-focus');

		// Toggle Maps
		map.resetMaps();
		map.currentAddress = address;
		ui.show('#map-system');

		// 3D/2D View depending on settings
		document.getElementById('map-system').classList.remove('view-2D');
		document.getElementById('map-system').classList.remove('view-3D');

		let view = 'view-2D';
		if(settings.get('graphical_map3D')) {
			view = 'view-3D';
		}
		document.getElementById('map-system').classList.add(view);
	}

	/**
	 * Draws a sector.
	 *
	 * @param	  {string}  sector  The sector
	 */
	static drawSector(sector) {
		// Stop if already created
		if(document.getElementById(sector + '-1') !== null) {
			return;
		}

		// Get XML
		const systemList = map.xmlDoc[sector].querySelectorAll('sy');

		// Generate Content
		for(let i=0; i<systemList.length; i++) {
			const starList = systemList[i].querySelectorAll('st');
			let starBType = '';
			let starBSize = 0;

			for(let currStar=0; currStar<starList.length; currStar++) {
				if(starList[currStar].getAttribute('sz') > starBSize) {
					starBType = starList[currStar].getAttribute('t');
					starBSize = starList[currStar].getAttribute('sz');
				}
			}

			const x = Math.floor(systemList[i].getAttribute('x') * 10);
			const y = Math.floor(systemList[i].getAttribute('y') * 10);

			// Draw current planet circle under planet
			const sectorAddress = x + '-' + y;
			let sector = document.getElementById(sectorAddress);
			if(!sector) {
				sector = ui.createSVGElt('g', {
					id: sectorAddress,
				});
				sector.setAttribute('x', sectorAddress.split('-')[0]);
				sector.setAttribute('y', sectorAddress.split('-')[1]);
				document.getElementById('map-global').appendChild(sector);
			}

			const cx = Math.round(parseFloat(systemList[i].getAttribute('x')/10) * MAP_SIZE_WIDTH);
			const cy = Math.round(parseFloat(systemList[i].getAttribute('y')/10) * MAP_SIZE_HEIGHT);

			map.points.push([cx, cy]);

			// Draw planet
			const circle = ui.createSVGElt('circle', {
				id: systemList[i].id,
				cx,
				cy,
				r: Math.round(MAP_STAR_SIZE_BASE + starBSize * MAP_STAR_SIZE_RATIO),
				fill: 'url(#' + starBType + ')'});
			sector.appendChild(circle);

			//@TODO: Generate other visual helps (including all planets of current player)

			// Events
			document.getElementById(systemList[i].id).addEventListener('click', function() {
				socket.emit('system-ask-mapData', {
					...webSockets.getUserData(),
					systemAddress: this.id,
				});
			});
		}

		map.updateSectorVisibility();

		InfluenceZones.drawInfluenceZones();
	}

	/**
	 * Focus an adress
	 *
	 * @param	  {string}  address  The address
	 */
	static focusAddress(address) {
		if(typeof(address) !== 'string' || address.split('-').length < 2) {
			console.error('INVALID ADRESS FORMAT !');
			return;
		}

		const sector = GameMap.getSectorFromAdress(address);
		const system = GameMap.getSystemFromAdress(address);

		map.loadXML(sector, function() {
			const systemXML = map.xmlDoc[sector].getElementById(system);
			const newX = (1/map.zoom)*document.documentElement.clientWidth/2 - (MAP_SIZE_WIDTH * systemXML.getAttribute('x')/10); // /10 = *10 / 100
			const newY = (1/map.zoom)*document.documentElement.clientHeight/2 - (MAP_SIZE_HEIGHT * systemXML.getAttribute('y')/10);

			map.moveUI([newX, newY]);
		});
	}

	/**
	 * Opens a global map.
	 *
	 * @param	  {string}  address  The address
	 */
	static openGlobalMap(address) {
		map.currentMap = 'sector';

		map.focusAddress(address);

		// Back button
		ui.hide('#map-back');
		ui.show('#map-focus');

		// Toggle Maps
		map.resetMaps();
		map.currentAddress = address;
		ui.show('#map-global');
		ui.show('#map-global-legend');
	}
}
