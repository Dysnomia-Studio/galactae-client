// Stars: 8 to 35 em
var STAR_SIZE_BASE = 8;
var STAR_SIZE_COEF = 27;

// Planets: 4 to 15 em
var PLANET_SIZE_BASE = 4;
var PLANET_SIZE_COEF = 11; 

class map {
	static init() {
		map.currentMap = "";
		map.currentAddress = "";

		/**
		 * Load XML
		 */
		if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
			map.xmlhttp=new XMLHttpRequest();
		} else { // code for IE6, IE5
			map.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}

		map.xmlhttp.onreadystatechange = function() {
			if (this.readyState === XMLHttpRequest.DONE) {
				if (this.status === 200) {
					map.xmlDoc = new DOMParser().parseFromString(map.xmlhttp.responseText,'text/xml');
				} else {
					map.xmlDoc = "";
					console.log('ERROR: CANNOT LOAD MAP');
				}
			}
		}

		map.xmlhttp.open("GET",cdnURL + "/maps/" + serverName + ".xml", true);
		map.xmlhttp.send();

		/**
		 * Global Map Events
		 **/
		$('#hud-map-back').click(function() {
			map.backToParent();
		});

		/**
		 * Galaxy Map Events
		 */
		$('#hud-map-galaxy .select-quadrant').click(function() {
			map.currentAddress = $(this).attr('id').split('-')[3];
			map.openQuadrantMap();
		});
	}

	static openTab() {
		$("#hud-map").css('display','block');
		ui.closeTab("#hud-research",false); /* A no-bug fix */
		$("#research-button").css('display','none');
		ui.map = true;

		// On cache le chat et memorise son statut pour plus tard	
		ui.mapChat = ($("#hud-chat").css('display')=="block");
		ui.closeTab("#hud-chat",false);
		ui.chat = false;
	}

	static closeTab() {
		ui.closeTab("#hud-map",false);
		$("#research-button").css('display','block');
		ui.map = false;

		// Re-affichage du chat si necessaire
		if(!ui.chat) {
			$("#hud-chat").css('display',(ui.mapChat)?"block":"none");
			ui.chat = ui.mapChat;
		}
	}

	static hideAllMaps() {
		/* Hide all maps */
		$('#hud-map-galaxy').css('display','none');
		$('#hud-map-quadrant').css('display','none');
		$('#hud-map-sector').css('display','none');
		$('#hud-map-system').css('display','none');

		/* Show back button */
		$('#hud-map-back').css('display','block');
	}

	static openSolarSystemMap(address) { // CSS inspired by work of Julian Garnier - codepen.io/juliangarnier/pen/idhuG
		var systemXML = $(map.xmlDoc).find("system#" + address)[0];
		map.currentMap = "system";

		$('#hud-map-system-solarFront').html("");

		var stars = [];
		var starsXML = $(systemXML).find("star");
		for(var i=0; i< starsXML.length; i++) {
			stars[i].address = starsXML[i].attr('id');
			stars[i].size    = starsXML[i].attr('size');
		}

		var planets = [];
		var planetsXML = $(systemXML).find("planet");
		for(var i=0; i< planetsXML.length; i++) {
			planets[i].address = planetsXML[i].attr('id');
			planets[i].size    = planetsXML[i].attr('size');
		}

		console.info(stars);
		console.info(planets);

		var prevOrbit = 0;

		// For each Star
		for(var i=0; i<stars.length; i++) {
			// Create DOM
			$("#hud-map-system-solarFront").append("<div class=\"star\" id=\"" + stars[i].address + "\"></div>");

			// Set Size
			$("#" + stars[i].address).css("font-size","" + (STAR_SIZE_BASE + stars[i].size*STAR_SIZE_COEF) + "em");

			// Set Orbit, planet position and anim duration
			// !! Percentage of solar system size !! \\
			var orbitSize = 0;
			if(stars.length > 1) { // Only one star
				orbitSize = 0; // @ADD: Calculation of Orbit size
			} 

			var orbitDuration = orbitSize * 36; // in seconds

			var pos = (Date.now()%orbitDuration)/orbitDuration * (2* Math.PI); // in radians

			// @ADD: Orbit placement, star placement 
		}

		// For each Planet
		for(var i=0; i<planets.length; i++) {
			// Create DOM
			$("#hud-map-system-solarFront").append("<div class=\"planet\" id=\"" + planets.address + "\"></div>");

			// Set Size
			$("#" + planet.address).css("font-size","" + (PLANET_SIZE_BASE + planets.size*PLANET_SIZE_COEF) + "em");

			// Set Orbit, planet position and anim duration
			// !! Percentage of solar system size !! \\
			var orbitSize = 0; // @ADD: Calculation of Orbit size

			var orbitDuration = orbitSize * 36; // in seconds

			var pos = (Date.now()%orbitDuration)/orbitDuration * (2* Math.PI); // in radians

			// @ADD: Orbit placement, planet placement

			// @ADD: Rings & Moons
		}		

		// Back button
		$('#hud-map-back').text(translate['map']['BACK_SECTOR']);

		// Toggle Maps
		map.hideAllMaps();
		$('#hud-map-system').css('display','block');

		$("#hud-map-system").removeClass('view-2D opening').addClass("view-3D").delay(2000).queue(function() {
			$(this).removeClass('hide-UI').addClass("set-speed");
			$(this).dequeue();
		});
	}

	static openSectorMap(address) {
		var sectorXML = $(map.xmlDoc).find("sector#" + address)[0];
		map.currentMap = "sector";

		$('#hud-map-back').text(translate['map']['BACK_QUADRANT']);

		// Toggle Maps
		map.hideAllMaps();
		$('#hud-map-sector').css('display','block');
	}

	static openQuadrantMap(address) {
		var quadrantXML = $(map.xmlDoc).find("quadrant#" + address)[0];
		map.currentMap = "quadrant";

		$('#hud-map-back').text(translate['map']['BACK_GALAXY']);

		// Toggle Maps
		map.hideAllMaps();
		$('#hud-map-quadrant').css('display','block');
	}

	static openGalacticMap() {
		map.currentMap = "galaxy";

		// Toggle Maps
		map.hideAllMaps();
		$('#hud-map-galaxy').css('display','block');
		$('#hud-map-back').css('display','none');
	}

	static backToParent() {
		var currAddressParts = map.currentAddress.split('-');

		switch(map.currentMap) {
			case "system":
				map.openSectorMap(currAddressParts[0] + '-' + currAddressParts[1]);
				break;
			case "sector":
				map.openQuadrantMap(currAddressParts[0]);
				break;
			case "quadrant":
				map.openGalacticMap();
				break;
			default:
				// Do nothing
		}
	}
}