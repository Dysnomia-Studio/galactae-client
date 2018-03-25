// Stars: 4.8 to 12 em
// in XML from 0 to 37
var STAR_SIZE_BASE = 4;
var STAR_SIZE_COEF = 2 / 37;
var STAR_ECART = 2.25;

// Planets: 4 to 15 em
var PLANET_SIZE_BASE = 3 / 2;
var PLANET_SIZE_COEF = 9 / 14;
var PLANET_ECART = 2.5;

var MAP_SIZE_HEIGHT = 40000;
var MAP_SIZE_WIDTH = 50000;

var mapPrevMouse = [0,0];

class map {
	static touchHandler(event) {
		var touch = event.changedTouches[0];

		var simulatedEvent = document.createEvent("MouseEvent");
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

		var currentSector = map.currentAddress.split('-');
		currentSector = [currentSector[0],currentSector[1]].join("-");

		/**
		 * Load XML
		 */
		map.focusAddress(map.currentAddress);

		/**
		 * Global Map Events
		 **/
		$('#hud-map-back').click(function() {
			map.openGlobalMap(map.currentAddress);
		});

		/**
		 * Move & zoom
		 */
		$("#hud-map-global").on('touchstart touchmove touchend touchcancel', function(e) {
			map.touchHandler(e);
		});

		$("#hud-map-global").on('touchstart', function(e) {
			mapPrevMouse[0] = e.pageX;
			mapPrevMouse[1] = e.pageY;
		});
		$("#hud-map-global").mousemove(function(e) {
			if(ui.mouseStatus[1]==1) {
				var pos = $("#hud-map-global").position();
				map.moveUI([(e.pageX - mapPrevMouse[0]),
								(e.pageY - mapPrevMouse[1])], true);
			}
			mapPrevMouse[0] = e.pageX;
			mapPrevMouse[1] = e.pageY;
		});

		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))?'DOMMouseScroll' :'mousewheel'; // Because firefox doesn't know the "mousewheel" event ...
		$('#hud-map-global').on(mousewheelevt, function(e){
			if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
				var coef = 0.03; // Scroll up
			} else {			
				var coef = -0.03; // Scroll down
			}

			map.zoom += coef;
			if(map.zoom < 0.5) { map.zoom -= coef; return; }
			if(map.zoom > 1.75) { map.zoom -= coef; return; }

			var pos = $("#hud-map-global").position();
			pos.left = ((pos.left - mapPrevMouse[0])/(map.zoom - coef) * map.zoom) + mapPrevMouse[0];
			pos.top = ((pos.top - mapPrevMouse[1])/(map.zoom - coef) * map.zoom) + mapPrevMouse[1];
			$("#hud-map-global").css("left",pos.left);
			$("#hud-map-global").css("top" ,pos.top );
					
			$('#hud-map-global').css('zoom',map.zoom);
			$('#hud-map-global').css('-moz-transform','scale(' + map.zoom + ')');
		});
		$('#hud-map-focus').on('click', function() {
			map.focusAddress(map.currentAddress = planetData.address);
		});

		loadScreen.complete("maps");
	}

	/**
	 * Move the ui
	 *
	 * @param	  {2D vector}  pos	 The position
	 */
	static moveUI(pos, diff=false) {
		if(diff) {
			var oldPos = $("#hud-map-global").position();
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

		$("#hud-map-global").css({
			left: pos[0],
			top: pos[1]
		});

		// At borders ?
		var coords = map.currentAddress.split('-');
		coords[0] = parseInt(coords[0]);
		coords[1] = parseInt(coords[1]);

		var topDist = pos[0]%(MAP_SIZE_HEIGHT/10);
		var bottomDist = pos[0]%(MAP_SIZE_HEIGHT/10) + (MAP_SIZE_HEIGHT/10);
		var leftDist = pos[1]%(MAP_SIZE_WIDTH/10);
		var rightDist = pos[1]%(MAP_SIZE_WIDTH/10) + (MAP_SIZE_WIDTH/10);

		var top =  coords[0] == 0 || (topDist > $(document).height() * 1.5);
		var bottom = coords[0] == 9 || (bottomDist > $(document).height() * 1.5);
		var left = coords[1] == 0 || (leftDist > $(document).height() * 1.5);
		var right = coords[1] == 9 || (rightDist > $(document).height() * 1.5);

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
		var coords = sector.split('-'); 

		// At borders ?
		coords[0] = parseInt(coords[0]);
		coords[1] = parseInt(coords[1]);
		var top = coords[0] == 0;
		var bottom = coords[0] == 9;
		var left = coords[1] == 0;
		var right = coords[1] == 9;

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
		if(map.xmlhttp[sector] !== undefined) { return; } // Already loaded or loading
		if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
			map.xmlhttp[sector] = new XMLHttpRequest();
		} else { // code for IE6, IE5
			map.xmlhttp[sector] = new ActiveXObject("Microsoft.XMLHTTP");
		}

		map.xmlhttp[sector].onreadystatechange = function() {
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
		};

		map.xmlhttp[sector].open("GET",cdnURL + "/maps/" + serverName + "/" + sector + ".xml", true);
		map.xmlhttp[sector].send();
	}

	/**
	 * Opens map tab.
	 */
	static openTab() {
		$("#hud-map").css('display','block');
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
		$('#planet-current').css('display','block');
		$('#planet-other').css('display','none');
		planetBack.init(planetData.planetType);

		// Close tab
		ui.closeTab("#hud-map");
		ui.map = false;

		// Draw chat if needed
		if(!ui.chat) {
			$("#hud-chat").css('display',(ui.mapChat)?"block":"none");
			ui.chat = ui.mapChat;
		}
	}

	/**
	 * Reset maps display
	 */
	static resetMaps() {
		/* Hide all maps */
		$('#hud-map-global').css('display','none');
		$('#hud-map-system').css('display','none');

		$("#hud-map").css('display','block');

		/* Empty HTML to avoid bugs */
		if(map.currentMap!="system") {
			$('#hud-map-system-solarFront').html('');
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

		var sector = address.split('-');
		sector = [sector[0],sector[1]].join("-");

		map.currentMap = "system";
		$('#hud-map-system-solarFront').html("");

		// Parse XML
		var systemXML = $(map.xmlDoc[sector]).find("sy#" + address)[0];

		var stars = [];
		var starsXML = $(systemXML).find("st");
		for(var i=0; i< starsXML.length; i++) {
			stars[i] = {};
			stars[i].address = $(starsXML[i]).attr('id');
			stars[i].size	= (STAR_SIZE_BASE + STAR_SIZE_COEF * parseFloat($(starsXML[i]).attr('sz')));
			stars[i].type	= $(starsXML[i]).attr('t');
		}

		var planets = [];
		var planetsXML = $(systemXML).find("p");
		for(var i=0; i< planetsXML.length; i++) {
			planets[i] = {};
			planets[i].address = $(planetsXML[i]).attr('id');
			planets[i].size	= $(planetsXML[i]).attr('sz');
			planets[i].type	= $(planetsXML[i]).attr('t');
			planets[i].gtype   = $(planetsXML[i]).attr('gt');
		}

		/**
		 * Stars drawing
		 */
		var firstPlanet = 0; // var needed to know where to place the planets
		var orbitSize = [];

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
		for(var i=0; i<stars.length; i++) {
			if(orbitSize[i]==0) {
				// Create DOM
				$("#hud-map-system-solarFront").append("<div class=\"star " + stars[i].type + "\" id=\"" + stars[i].address + "\"></div>");
			} else {
				$("#hud-map-system-solarFront").append('<div class="orbit" id="' + stars[i].address + '"><div class="pos"><div class="star ' + stars[i].type + '" ></div></div></div>');	

				// Set Orbit, star position and anim duration

				// Anim duration
				var orbitDuration = orbitSize[i] * 36; // in seconds
				$("#" + stars[i].address).css("animation-duration","" + orbitDuration + "s");
				$("#" + stars[i].address + " .pos").css("animation-duration","" + orbitDuration + "s");

				// Multiple stars on same orbit
				if(stars.length == 3 && orbitSize[0] == orbitSize[1] && orbitSize[0] == orbitSize[2]) {
					$("#" + stars[i].address).css("animation-delay","-" + i*orbitDuration/3 + "s");
					$("#" + stars[i].address + " .pos").css("animation-delay","-" + i*orbitDuration/3 + "s");
				} else if((i==1 && orbitSize[0] == orbitSize[1]) ||(i==2 && orbitSize[1] == orbitSize[2])) {
					$("#" + stars[i].address).css("animation-delay","-" + i*orbitDuration/2 + "s");
					$("#" + stars[i].address + " .pos").css("animation-delay","-" + i*orbitDuration/2 + "s");
				}

				/* Orbit */
				$("#" + stars[i].address).css("height","" +orbitSize[i] + "vh");
				$("#" + stars[i].address).css("width","" + orbitSize[i] + "vh");

				$("#" + stars[i].address).css("margin-top","-" + (orbitSize[i]/2) + "vh");
				$("#" + stars[i].address).css("margin-left","-" + (orbitSize[i]/2) + "vh");

				/* Star Pos */
				var orbitDuration = orbitSize[i] * 36; // in seconds
				var posAng = (Date.now()%orbitDuration)/orbitDuration * (2* Math.PI); // in radians
				
				$("#" + stars[i].address + " .pos").css("top","calc(50% + (" + (orbitSize[i]/2) + "vh * " + Math.sin(posAng) + "))");
				$("#" + stars[i].address + " .pos").css("left","calc(50% + (" + (orbitSize[i]/2) + "vh * " + Math.cos(posAng) + "))");
			}

			// Set Size
			$("#" + stars[i].address).css("font-size","" + stars[i].size + "vh");
		}

		/**
		 * Planets creation
		 */
		orbitSize = firstPlanet;
		for(var i=0; i<planets.length; i++) {
			// Create DOM
			$("#hud-map-system-solarFront").append('<div class="orbit" id="' + planets[i].address + '"><div class="pos"></div></div>');
			// @ADD: Menu

			// Set Size
			var size = PLANET_SIZE_BASE + parseFloat(planets[i].size)*PLANET_SIZE_COEF;
			$("#" + planets[i].address).css("font-size","" + size + "vh");

			if(i==0) {
				orbitSize += size * PLANET_ECART/2;
			} else {
				orbitSize += (PLANET_SIZE_BASE + parseFloat(planets[i - 1].size)*PLANET_SIZE_COEF) * PLANET_ECART/2 + size * PLANET_ECART/2;
			}

			// Anim duration
			var orbitDuration = (2 + orbitSize) * 100;
			$("#" + planets[i].address).css("animation-duration","" + orbitDuration + "s");
			$("#" + planets[i].address + " .pos").css("animation-duration","" + orbitDuration + "s");
			$("#" + planets[i].address + " .pos .planet").css("animation-duration","" + orbitDuration + "s");

			/* Orbit */
			$("#" + planets[i].address).css("height", orbitSize + "vh");
			$("#" + planets[i].address).css("width", orbitSize + "vh");

			$("#" + planets[i].address).css("margin-top","-" + (orbitSize/2) + "vh");
			$("#" + planets[i].address).css("margin-left","-" + (orbitSize/2) + "vh");

			/* Planet Pos */
			var posAng = (Date.now()%orbitDuration)/orbitDuration * (2* Math.PI); // in radians
			
			$("#" + planets[i].address + " .pos").css("top","calc(50% + (" + Math.sin(posAng) + " * 0.5 * (" + orbitSize + "vh)))");
			$("#" + planets[i].address + " .pos").css("left","calc(50% + (" + Math.cos(posAng) + " * 0.5 * (" + orbitSize + "vh)))");

			/* Planet Img */
			$("#" + planets[i].address + " .pos").append("<div class=\"planet\"></div>");
			$("#" + planets[i].address + " .pos .planet").css("background-image","url("+cdnURL+"/img/planets/front/" + planets[i].type + ".jpg)")

			/* Set & Place shadow anim */
			$("#" + planets[i].address + " .pos .planet").css("animation-name","planetShadow");

			var currShadow = (posAng/(2*Math.PI))*orbitDuration - orbitDuration;
			$("#" + planets[i].address + " .pos .planet").css("animation-delay","" + currShadow + "s");

			$("#" + planets[i].address + " .pos .planet").css("animation-duration","" + orbitDuration + "s");


			// @ADD: Rings & Moons
		}	

		// View info
		$('#hud-map-system .planet').click(function() {
			socket.emit("planet-ask-mapData", { 
				id: userData.id,
				username: userData.username,
				pAddress: $(this).parent().parent().attr('id')
			});
		});

		// Back button
		$('#hud-map-back').css('display','block');
		$('#hud-map-focus').css('display','none');

		// Toggle Maps
		map.resetMaps();
		map.currentAddress = address;
		$('#hud-map-system').css('display','block');

		$("#hud-map-system").removeClass('view-2D opening').addClass("view-3D").delay(2000).queue(function() {
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
		$("#sect-" + sector).remove();

		// Get XML
		var sectorXML = $(map.xmlDoc[sector])[0];
		var systemList = $(sectorXML).find("sy");

		// Generate Content
		var content = "<div id='sect-" + sector + "'>";

		for(var i=0; i<systemList.length; i++) {
			var starList = $(systemList[i]).find("st");
			var starBType = "";
			var starBSize = 0;

			for(var currStar=0; currStar<starList.length; currStar++) {
				if($(starList[currStar]).attr('sz') > starBSize) {
					starBType = $(starList[currStar]).attr('t');
					starBSize = $(starList[currStar]).attr('sz');
				}
			}

			content += '<span id="' + $(systemList[i]).attr('id') + '" class="sector-subsystem ' + starBType + '" ';

			content += 'style="left: ' + (parseFloat($(systemList[i]).attr('x')) * 10) + '%; top: ' + (parseFloat($(systemList[i]).attr('y')) * 10) + '%;"></span>';
		}

		content += "</div>";

		$('#hud-map-global').append(content);

		// Events
		$('#sect-' + sector + ' .sector-subsystem').click(function() {
			map.openSolarSystemMap($(this).attr('id'));
		});
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
		
		var coords = address.split('-');
		var sector = coords[0] + "-" + coords[1];
		var system = [coords[0],coords[1],coords[2]].join("-");

		if(map.xmlDoc[sector] === undefined) {
			map.loadMap(sector, function() {
				var systemXML = $(map.xmlDoc[sector]).find("sy#" + system)[0];
				var newX = $(document).width()/2 - (MAP_SIZE_WIDTH * $(systemXML).attr("x")/10); // /10 = *10 / 100
				var newY = $(document).height()/2 - (MAP_SIZE_HEIGHT * $(systemXML).attr("y")/10);

				map.moveUI([newX, newY]);
			});
		} else {
			var systemXML = $(map.xmlDoc[sector]).find("sy#" + system)[0];
			var newX = $(document).width()/2 - (MAP_SIZE_WIDTH * $(systemXML).attr("x")/10); // /10 = *10 / 100
			var newY = $(document).height()/2 - (MAP_SIZE_HEIGHT * $(systemXML).attr("y")/10);

			map.moveUI([newX, newY]);
		}
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
		$('#hud-map-back').css('display','none');
		$('#hud-map-focus').css('display','block');

		// Toggle Maps
		map.resetMaps();
		map.currentAddress = address;
		$('#hud-map-global').css('display','block');
	}

	static openPlanetInfos(pData) {
		if(typeof(address) != "string" || address.split("-").length != 4) {
			console.log('INVALID ADRESS FORMAT !');
			return;
		}
		map.currentMap = "planet";

		// Set background
		planetBack.init(pData.planetType);

		// Set informations


		// Toggle Maps
		map.resetMaps();

		$("#hud-map").css('display','none');

		$('#planet-current').css('display','none');
		$('#planet-other').css('display','block');
	}
}