// Stars: 4.8 to 12 em
// in XML from 0 to 37
const STAR_SIZE_BASE = 4;
const STAR_SIZE_COEF = 2 / 37;
const STAR_ECART = 2.25;

// Planets: 4 to 15 em
const PLANET_SIZE_BASE = 3 / 2;
const PLANET_SIZE_COEF = 9 / 14;
const PLANET_ECART = 2.5;

const MAP_SIZE_HEIGHT = 40000;
const MAP_SIZE_WIDTH = 50000;

const MAP_STAR_SIZE_BASE = 5;
const MAP_STAR_SIZE_RATIO = 0.08;

let mapPrevMouse = [0,0];

class map {
	static touchHandler(event) {
		let touch = event.changedTouches[0];

		let simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent({
			touchstart: "mousedown",
			touchmove: "mousemove",
			touchend: "mouseup"
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
		map.currentMap = (map.currentMap === undefined)?"global":map.currentMap;
		map.currentAddress = (map.currentAddress === undefined)?address:map.currentAddress;
		
		map.xmlhttp	= (map.xmlhttp === undefined)?[]:map.xmlhttp;
		map.xmlDoc	 = (map.xmlDoc === undefined)?[]:map.xmlDoc;

		map.zoom = 1;

		map.planetData = (map.planetData === undefined) ? [] : map.planetData;

		/**
		 * Load XML
		 */
		map.focusAddress(map.currentAddress);

		/**
		 * Global Map Events
		 **/
		$('#map-back').click(function() {
			map.openGlobalMap(map.currentAddress);
		});

		/**
		 * Move & zoom
		 */
		$("#map-global").on('touchstart touchmove touchend touchcancel', function(e) {
			map.touchHandler(e);
		});

		$("#map-global").on('touchstart', function(e) {
			mapPrevMouse[0] = e.pageX;
			mapPrevMouse[1] = e.pageY;
		});
		$("#map-global").mousemove(function(e) {
			if(ui.mouseStatus[1]==1) {
				map.moveUI([(e.pageX - mapPrevMouse[0]),
								(e.pageY - mapPrevMouse[1])], true);
			}
			mapPrevMouse[0] = e.pageX;
			mapPrevMouse[1] = e.pageY;
		});

		let mousewheelevt=(/Firefox/i.test(navigator.userAgent))?'DOMMouseScroll' :'mousewheel'; // Because firefox doesn't know the "mousewheel" event ...
		$('#map-global').on(mousewheelevt, function(e) {
			let coef = -0.03; // Scroll down
			if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
				coef = 0.03; // Scroll up
			}

			map.makeZoom(coef);
		});

		$('#map-global').on('touchstart', function(e) {
			if(e.originalEvent.touches.length == 2 && !map.scaling) {
				map.scaling = true;

				map.dist = Math.hypot(
					e.touches[0].pageX - e.touches[1].pageX,
					e.touches[0].pageY - e.touches[1].pageY);
			} else {
				map.scaling = false;
			}
		});
		$('#map-global').on('touchmove', function(e) {
			if(map.scaling) {
				let newDist = Math.hypot(
					e.touches[0].pageX - e.touches[1].pageX,
					e.touches[0].pageY - e.touches[1].pageY);


				let coef = (map.dist / newDist) - 1;
				if(coef > 0.05) { coef = 0.05; }
				if(coef < -0.05) { coef = -0.05; }
				if(coef == 0) { return; }

				map.makeZoom(coef);

				map.dist = newDist;
			}
		});
		$('#map-global').on('touchend', function(e) {
			map.scaling = false;
		});

		$('#map-focus').on('click', function() {
			map.focusAddress(map.currentAddress = planetData.address);
		});

		document.getElementById('planet-other-returnToCurrent').addEventListener('click', function() {
			map.closeTab();
		});

		document.getElementById('planet-other-returnToSystem').addEventListener('click', function() {
			// On cache le chat et memorise son statut pour plus tard	
			ui.mapChat = ($("#hud-chat").css('display')=="block");
			ui.closeTab("#hud-chat",false);
			ui.chat = false;

			ui.show('#hud-map');
		});

		loadScreen.complete("maps");
	}

	static makeZoom(coef) {
			coef = parseFloat(parseFloat(coef).toFixed(2));
			map.zoom += coef;
			if(map.zoom < 0.75) { map.zoom -= coef; return; }
			if(map.zoom > 1.75) { map.zoom -= coef; return; }

			let pos = $("#map-global").position();
			pos.left = pos.left + mapPrevMouse[0] - mapPrevMouse[0]*((map.zoom)/(map.zoom - coef));
			pos.top = pos.top + mapPrevMouse[1] - mapPrevMouse[1]*((map.zoom)/(map.zoom - coef));
			$("#map-global").css("left",pos.left);
			$("#map-global").css("top" ,pos.top );
					
			$('#map-global').width($('#map-global').width() * map.zoom / (map.zoom - coef));
			$('#map-global').height($('#map-global').height() * map.zoom / (map.zoom - coef));

			$('#map-global').css('zoom',map.zoom);
			$('#map-global').css('-moz-transform','scale(' + map.zoom + ')');
	}

	/**
	 * Move the ui
	 *
	 * @param	  {2D vector}  pos	 The position
	 */
	static moveUI(pos, diff=false) {
		let oldPos = $("#map-global").position();
		if(diff) {
			oldPos = [oldPos.left, oldPos.top];

			pos[0] += oldPos[0];
			pos[1] += oldPos[1];
		}

		if(parseInt(pos[0]) > 0) {
			pos[0] = 0;
		}
		if(parseInt(pos[1]) > 0) {
			pos[1] = 0;
		}
		if(parseInt(pos[0]) < ($(document).width()-MAP_SIZE_WIDTH*map.zoom)) {
			pos[0] = $(document).width()-MAP_SIZE_WIDTH*map.zoom;
		}
		if(parseInt(pos[1]) < ($(document).height()-MAP_SIZE_HEIGHT*map.zoom)) {
			pos[1] = $(document).height()-MAP_SIZE_HEIGHT*map.zoom;
		}

		let translated = false;
		function stepMove() {
			if(!translated) {
				$("#map-global").css({
					"transform": "translate(" + (pos[0] - oldPos[0]) + "px, " + (pos[1] - oldPos[1]) + "px)"
				});

				translated = true;

				window.requestAnimationFrame(stepMove);
			} else {
				$("#map-global").css({
					left: pos[0],
					top: pos[1]
				});

				$("#map-global").css({
					"transform": ""
				});
			}
		}
		window.requestAnimationFrame(stepMove);

		//@ADD: display none/block on sectors

		// At borders ?
		let coords = [];
		coords[0] = Math.floor(($(document).width()/2 - pos[0])/MAP_SIZE_WIDTH*10);
		coords[1] = Math.floor(($(document).height()/2 - pos[1])/MAP_SIZE_HEIGHT*10);

		let topDist = pos[0]%(MAP_SIZE_HEIGHT/10);
		let bottomDist = pos[0]%(MAP_SIZE_HEIGHT/10) + (MAP_SIZE_HEIGHT/10);
		let leftDist = pos[1]%(MAP_SIZE_WIDTH/10);
		let rightDist = pos[1]%(MAP_SIZE_WIDTH/10) + (MAP_SIZE_WIDTH/10);

		let top =  coords[0] == 0 || (topDist * 1.5 < $(document).height());
		let bottom = coords[0] == 9 || (bottomDist * 1.5 < $(document).height());
		let left = coords[1] == 0 || (leftDist * 1.5 < $(document).height());
		let right = coords[1] == 9 || (rightDist * 1.5 < $(document).height());

		/**
		 * Load all needed xml
		 */
		if(!top) {
			if(!left) { // Haut gauche
				map.loadXML((coords[0]-1) + "-" + (coords[1]-1));
			}
			// Haut
			map.loadXML((coords[0]-1) + "-" + (coords[1]));
			if(!right) { // Haut droite
				map.loadXML((coords[0]-1) + "-" + (coords[1]+1));
			}
		}

		if(!left) { // Gauche
			map.loadXML((coords[0]) + "-" + (coords[1]-1));
		}

		if(!right) { // Droite
			map.loadXML((coords[0]) + "-" + (coords[1]+1));
		}

		if(!bottom) {
			if(!left) { // Bas gauche
				map.loadXML((coords[0]+1) + "-" + (coords[1]-1));
			}
			// Bas
			map.loadXML((coords[0]+1) + "-" + (coords[1]));
			if(!right) { // Bas droite
				map.loadXML((coords[0]+1) + "-" + (coords[1]+1));
			}
		}
	}

	/**
	 * Loads a map.
	 *
	 * @param	  {string}  sector  The sector
	 */
	static loadMap(sector,callback) {
		if($(document).width() > 1920) { // 4K Only loader, it's slow, but needed to make game working
			map.loadMapAndNeighborhood(sector,callback);
		} else { // Full HD and lower screens
			map.loadXML(sector,callback);
		}
	}

	/**
	 * Loads a map and neighborhood.
	 *
	 * @param	  {string}  sector  The sector
	 */
	static loadMapAndNeighborhood(sector,callback) {
		let coords = sector.split('-'); 

		// At borders ?
		coords[0] = parseInt(coords[0]);
		coords[1] = parseInt(coords[1]);
		let top = coords[0] == 0;
		let bottom = coords[0] == 9;
		let left = coords[1] == 0;
		let right = coords[1] == 9;

		/**
		 * Load all needed xml
		 */
		map.loadXML(sector,callback);

		if(!top) {
			if(!left) { // Haut gauche
				map.loadXML((coords[0]-1) + "-" + (coords[1]-1),callback);
			}
			// Haut
			map.loadXML((coords[0]-1) + "-" + (coords[1]),callback);
			if(!right) { // Haut droite
				map.loadXML((coords[0]-1) + "-" + (coords[1]+1),callback);
			}
		}

		if(!left) { // Gauche
			map.loadXML((coords[0]) + "-" + (coords[1]-1),callback);
		}

		if(!right) { // Droite
			map.loadXML((coords[0]) + "-" + (coords[1]+1),callback);
		}

		if(!bottom) {
			if(!left) { // Bas gauche
				map.loadXML((coords[0]+1) + "-" + (coords[1]-1),callback);
			}
			// Bas
			map.loadXML((coords[0]+1) + "-" + (coords[1]),callback);
			if(!right) { // Bas droite
				map.loadXML((coords[0]+1) + "-" + (coords[1]+1),callback);
			}
		}
	}

	/**
	 * Loads a xml.
	 *
	 * @param	  {string}  sector  The sector
	 */
	static loadXML(sector, callback) {
		if(map.xmlhttp === undefined) { map.xmlhttp = []; }
		if(map.xmlDoc === undefined) { map.xmlDoc = []; }
		if(map.xmlDoc[sector] !== undefined && callback) { 
			callback();
			return;
		} // Already loaded

		let toSend = map.xmlhttp[sector] === undefined;
		if(toSend) {
			if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
				map.xmlhttp[sector] = new XMLHttpRequest();
			} else { // code for IE6, IE5
				map.xmlhttp[sector] = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}

		map.xmlhttp[sector].addEventListener('readystatechange',function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				if (this.status === 200) {
					map.xmlDoc[sector] = new DOMParser().parseFromString(map.xmlhttp[sector].responseText,'text/xml');
					map.drawSector(sector);
					if(callback !== undefined) {
						callback();
					}
				} else {
					map.xmlDoc[sector] = "";
					console.log('ERROR: CANNOT LOAD MAP OF SECTOR ' + sector);
				}
			}
		});

		if(toSend) {
			map.xmlhttp[sector].open("GET",cdnURL + "/maps/" + serverName + "/" + sector + ".xml", true);
			map.xmlhttp[sector].send();
		}
	}

	/**
	 * Opens map tab.
	 */
	static openTab() {
		ui.show('#hud-map');
		ui.closeTab("#hud-research",false); /* A no-bug fix */
		ui.map = true;

		// On cache le chat et memorise son statut pour plus tard	
		ui.mapChat = ($("#hud-chat").css('display')=="block");
		ui.closeTab("#hud-chat",false);
		ui.chat = false;
	}

	/**
	 * Closes map tab.
	 */
	static closeTab() {
		// Reset planet view
		ui.show("#hud-top");
		ui.show('#planet-current');
		ui.hide('#planet-other');
		planetBack.init(planetData.planetType);

		// Close tab
		ui.closeTab("#hud-map");
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
		ui.hide('#map-system');

		ui.show("#hud-map");

		/* Empty HTML to avoid bugs */
		if(map.currentMap!="system") {
			document.getElementById('map-system-solarFront').innerHTML = "";
		}
	}

	/**
	 * Opens a solar system map.
	 *
	 * @param	  {string}  address  The address
	 */
	static openSolarSystemMap(address) { // CSS inspired by work of Julian Garnier - codepen.io/juliangarnier/pen/idhuG
		// Check Address
		if(typeof(address) != "string" || address.split("-").length != 3) {
			console.log('INVALID ADRESS FORMAT !');
			return;
		}

		let sector = address.split('-');
		sector = [sector[0],sector[1]].join("-");

		map.currentMap = "system";
		$('#map-system-solarFront').html("");

		// Parse XML
		let systemXML = $(map.xmlDoc[sector]).find("sy#" + address)[0];

		let stars = [];
		let starsXML = $(systemXML).find("st");
		for(let i=0; i< starsXML.length; i++) {
			stars[i] = {};
			stars[i].address = $(starsXML[i]).attr('id');
			stars[i].size	= (STAR_SIZE_BASE + STAR_SIZE_COEF * parseFloat($(starsXML[i]).attr('sz')));
			stars[i].type	= $(starsXML[i]).attr('t');
		}

		let planets = [];
		let planetsXML = $(systemXML).find("p");
		for(let i=0; i< planetsXML.length; i++) {
			planets[i] = {};
			planets[i].address = $(planetsXML[i]).attr('id');
			planets[i].size	= $(planetsXML[i]).attr('sz');
			planets[i].type	= $(planetsXML[i]).attr('t');
			planets[i].gtype   = $(planetsXML[i]).attr('gt');
		}

		/**
		 * Stars drawing
		 */
		let firstPlanet = 0; // let needed to know where to place the planets
		let orbitSize = [];

		// Sort by size 
		stars.sort(function(a,b) {
			if(a.size == b.size) {
				return 0;
			} else if(a.size > b.size) {
				return -1;
			} 
			return 1;
		});
		
		// Calc star positions for ...
		if(stars.length == 1) { // one star
			orbitSize[0] = 0;

			firstPlanet = stars[0].size * STAR_ECART;
		} else if(stars.length == 2) { // two stars
			// Si c'est les memes gTypes (naine et naine OU geante et geante), et on exclue les supergeantes
			if(stars[0].type.substr(-5) === stars[1].type.substr(-5) && 
				stars[0].type.substr(-10) !== "SuperGiant" && 
				stars[1].type.substr(-10) !== "SuperGiant") {

				orbitSize[0] = orbitSize[1] = (stars[0].size + stars[1].size)/2 * STAR_ECART;
			} else {
				orbitSize[0] = 0;

				orbitSize[1] = stars[0].size * STAR_ECART + stars[1].size * STAR_ECART/2;
			}

			firstPlanet =  orbitSize[1] + stars[1].size * STAR_ECART/2;
		} else { // 3 stars
			if(stars[0].type.substr(-5) !== stars[1].type.substr(-5) && 
				stars[1].type.substr(-5) === stars[2].type.substr(-5) &&
				stars[1].type.substr(-10) !== "SuperGiant" && 
				stars[2].type.substr(-10) !== "SuperGiant") { // Same 2 lasts stars
				
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
			if(orbitSize[i]==0) {
				// Create DOM
				$("#map-system-solarFront").append("<div class=\"star " + stars[i].type + "\" id=\"" + stars[i].address + "\"></div>");
			} else {
				$("#map-system-solarFront").append('<div class="orbit" id="' + stars[i].address + '"><div class="pos"><div class="star ' + stars[i].type + '" ></div></div></div>');	

				orbitSize[i] = Math.round(orbitSize[i] * 100)/100;

				// Set Orbit, star position and anim duration

				// Anim duration
				let orbitDuration = orbitSize[i] * 36; // in seconds
				orbitDuration = Math.round(orbitDuration * 100)/100;

				$("#" + stars[i].address).css("animation-duration",orbitDuration + "s");
				$("#" + stars[i].address + " .pos").css("animation-duration",orbitDuration + "s");

				// Multiple stars on same orbit
				if(stars.length == 3 && orbitSize[0] == orbitSize[1] && orbitSize[0] == orbitSize[2]) {
					$("#" + stars[i].address).css("animation-delay","-" + i*orbitDuration/3 + "s");
					$("#" + stars[i].address + " .pos").css("animation-delay","-" + i*orbitDuration/3 + "s");
				} else if((i==1 && orbitSize[0] == orbitSize[1]) ||(i==2 && orbitSize[1] == orbitSize[2])) {
					$("#" + stars[i].address).css("animation-delay","-" + i*orbitDuration/2 + "s");
					$("#" + stars[i].address + " .pos").css("animation-delay","-" + i*orbitDuration/2 + "s");
				}

				/* Orbit */
				$("#" + stars[i].address).css("height",orbitSize[i] + "vh");
				$("#" + stars[i].address).css("width",orbitSize[i] + "vh");

				$("#" + stars[i].address).css("margin-top","-" + (orbitSize[i]/2) + "vh");
				$("#" + stars[i].address).css("margin-left","-" + (orbitSize[i]/2) + "vh");

				/* Star Pos */
				let posAng = (((Date.now() + planet.deltaNow)/1000)%orbitDuration)/orbitDuration * (2* Math.PI); // in radians
				
				$("#" + stars[i].address + " .pos").css("top","calc(50% + " + (orbitSize[i]/2) * Math.sin((2* Math.PI) - posAng) + "vh)");
				$("#" + stars[i].address + " .pos").css("left","calc(50% + " + (orbitSize[i]/2) * Math.cos((2* Math.PI) - posAng) + "vh)");
			}

			// Set Size
			$("#" + stars[i].address).css("font-size", stars[i].size + "vh");
		}

		/**
		 * Planets creation
		 */
		orbitSize = firstPlanet;
		for(let i=0; i<planets.length; i++) {
			// Create DOM
			$("#map-system-solarFront").append('<div class="orbit" id="' + planets[i].address + '"><div class="pos"></div></div>');

			// Set Size
			let size = PLANET_SIZE_BASE + parseFloat(planets[i].size)*PLANET_SIZE_COEF;
			$("#" + planets[i].address).css("font-size", size + "vh");

			if(i==0) {
				orbitSize += size * PLANET_ECART/2;
			} else {
				orbitSize += (PLANET_SIZE_BASE + parseFloat(planets[i - 1].size)*PLANET_SIZE_COEF) * PLANET_ECART/2 + size * PLANET_ECART/2;
			}
			orbitSize = Math.round(orbitSize * 100)/100;

			// Anim duration
			let orbitDuration = (2 + orbitSize) * 100;
			orbitDuration = Math.round(orbitDuration * 100)/100;

			$("#" + planets[i].address).css("animation-duration", orbitDuration + "s");
			$("#" + planets[i].address + " .pos").css("animation-duration", orbitDuration + "s");

			/* Orbit */
			$("#" + planets[i].address).css("height", orbitSize + "vh");
			$("#" + planets[i].address).css("width", orbitSize + "vh");

			$("#" + planets[i].address).css("margin-top","-" + (orbitSize/2) + "vh");
			$("#" + planets[i].address).css("margin-left","-" + (orbitSize/2) + "vh");

			/* Planet Pos */
			let posAng = (((Date.now() + planet.deltaNow)/1000)%orbitDuration)/orbitDuration * (2* Math.PI); // in radians
			
			$("#" + planets[i].address + " .pos").css("top","calc(50% + " + (Math.sin((2* Math.PI) - posAng) * orbitSize/2) + "vh)");
			$("#" + planets[i].address + " .pos").css("left","calc(50% + " + (Math.cos((2* Math.PI) - posAng) * orbitSize/2) + "vh)");

			/* Planet Img */
			$("#" + planets[i].address + " .pos").append("<div class=\"planet\"></div>");
			$("#" + planets[i].address + " .pos .planet").css("background-image","url("+cdnURL+"/img/planets/front/" + planets[i].type + ".jpg)");

			/* Set & Place shadow anim */
			$("#" + planets[i].address + " .pos .planet").css("animation-name","planetShadow");

			let currShadow = (posAng/(2*Math.PI))*orbitDuration - orbitDuration;
			$("#" + planets[i].address + " .pos .planet").css("animation-delay", currShadow + "s");

			$("#" + planets[i].address + " .pos .planet").css("animation-duration", orbitDuration + "s");


			// @ADD: Rings & Moons
		}	

		// View info
		function viewInfo(e) {
			if($(this).parent().parent().hasClass('orbit')) {
				units.planetTarget = $(this).parent().parent().attr('id');
			} else {
				units.planetTarget = $(this).attr('id'); // Center star
			}
			
			let system = units.planetTarget.split('-');
			system.pop();
			system = system.join('-');

			if(map.planetData[system][units.planetTarget].ownerName === null) { 
				$('#map-planet-menu-planetname').text("");
				$('#map-planet-menu-username').text("");

				ui.hide('#map-planet-menu img');
				ui.show('#map-planet-menu-infos');
				ui.show('#map-planet-menu-move');

			} else { // Player planet
				ui.show('#map-planet-menu img');

				$('#map-planet-menu-planetname').text(map.planetData[system][units.planetTarget].name);
				$('#map-planet-menu-username').text("(" + map.planetData[system][units.planetTarget].ownerName + ")");
			}

			$('#map-planet-menu').css({
				"left": e.pageX,
				"top":  e.pageY,
			});
			ui.show('#map-planet-menu');
		}
		$('#map-system .planet').click(viewInfo);
		$('#map-system .star').click(viewInfo);

		$(document).click(function(e) {
			if(!$(e.target).hasClass("planet") && !$(e.target).hasClass("pos") && !$(e.target).hasClass("star")) {
				ui.hide('#map-planet-menu');
			}
		});
		$('#map-planet-menu img').click(function(e) {
			switch(e.target.id) {
				case "map-planet-menu-infos":
					planet.openOtherPlanetPanel();
					break;
				case "map-planet-menu-move":
					units.openMovePanel(2);
					break;
				case "map-planet-menu-attack":
					units.openMovePanel(1);
					break;
				case "map-planet-menu-defend":
					units.openMovePanel(0);
					break;
				case "map-planet-menu-spy":
					units.openMovePanel(3);
					break;
				case "map-planet-menu-trade":
					trade.openPlanetPanel();
					break;
			}

			ui.hide('#map-planet-menu');
		});
		$('#map-move-panel-close').click(function() {
			ui.hide('#map-move-panel');
		});

		// Back button
		ui.show('#map-back');
		ui.hide('#map-focus');

		// Toggle Maps
		map.resetMaps();
		map.currentAddress = address;
		ui.show('#map-system');

		// @ADD: depends on config
		$("#map-system").removeClass('view-2D opening').addClass("view-3D").delay(2000).queue(function() {
			$(this).removeClass('hide-UI').addClass("set-speed");
			$(this).dequeue();
		});
	}

	/**
	 * Draws a sector.
	 *
	 * @param	  {string}  sector  The sector
	 */
	static drawSector(sector) {
		// Stop if already created
		if($('#' + sector + '-1').length == 1) { return; }

		// Get XML
		let sectorXML = $(map.xmlDoc[sector])[0];
		let systemList = $(sectorXML).find("sy");

		function makeSVGElt(tagName, args) {
			var el= document.createElementNS('http://www.w3.org/2000/svg', tagName);
			for (let i in args) {
				el.setAttribute(i, args[i]);
			}
			return el;
		}

		// Generate Content
		for(let i=0; i<systemList.length; i++) {
			let starList = $(systemList[i]).find("st");
			let starBType = "";
			let starBSize = 0;

			for(let currStar=0; currStar<starList.length; currStar++) {
				if($(starList[currStar]).attr('sz') > starBSize) {
					starBType = $(starList[currStar]).attr('t');
					starBSize = $(starList[currStar]).attr('sz');
				}
			}

			var circle = makeSVGElt('circle', {
				id: $(systemList[i]).attr("id"), 
				cx: Math.round(parseFloat($(systemList[i]).attr('x')/10) * MAP_SIZE_WIDTH), 
				cy: Math.round(parseFloat($(systemList[i]).attr('y')/10) * MAP_SIZE_HEIGHT), 
				r: Math.round(MAP_STAR_SIZE_BASE + starBSize * MAP_STAR_SIZE_RATIO), 
				fill: 'url(#' + starBType + ')'});
			document.getElementById('map-global').appendChild(circle);

			// Events
			$('#' + $(systemList[i]).attr("id")).click(function() {
				socket.emit("system-ask-mapData", { 
					id: userData.id,
					username: userData.username,
					systemAddress: $(this).attr('id')
				});
			});	
		}
	}

	/**
	 * Focus an adress
	 *
	 * @param	  {string}  address  The address
	 */
	static focusAddress(address) {
		if(typeof(address) != "string" || address.split("-").length < 2) {
			console.log('INVALID ADRESS FORMAT !');
			return;
		}

		let coords = address.split('-');
		let sector = coords[0] + "-" + coords[1];
		let system = [coords[0],coords[1],coords[2]].join("-");

		map.loadXML(sector, function() {
			let systemXML = $(map.xmlDoc[sector]).find("sy#" + system)[0];
			let newX = $(document).width()/2 - (MAP_SIZE_WIDTH * $(systemXML).attr("x")/10); // /10 = *10 / 100
			let newY = $(document).height()/2 - (MAP_SIZE_HEIGHT * $(systemXML).attr("y")/10);

			map.moveUI([newX, newY]);
		});
	}

	/**
	 * Opens a global map.
	 *
	 * @param	  {string}  address  The address
	 */
	static openGlobalMap(address) {
		map.currentMap = "sector";

		map.focusAddress(address);

		// Back button
		ui.hide('#map-back');
		ui.show('#map-focus');

		// Toggle Maps
		map.resetMaps();
		map.currentAddress = address;
		ui.show('#map-global');
	}


	static getPlanetCoords(angle, diameter) {
		return [
			0.5*diameter*Math.cos(angle),
			0.5*diameter*Math.sin(angle),
		]; // Aucun besoin de constantes (50% + ... ) étant donné qu'on les soustrait
	}

	static getPlanetDistance(from, to, when) {
		let angleDepart = (2* Math.PI) - (when%from.orbitDuration / from.orbitDuration) * (2* Math.PI);
		let anglArrivee = (2* Math.PI) - (when%to.orbitDuration / to.orbitDuration) * (2* Math.PI);

		let coordsDepart = map.getPlanetCoords(angleDepart, from.orbitDist);
		let coordsArrivee = map.getPlanetCoords(anglArrivee, to.orbitDist);

		return Math.sqrt(
			Math.pow(coordsDepart[0] - coordsArrivee[0],2) + 
			Math.pow(coordsDepart[1] - coordsArrivee[1],2)
		);
	}
}