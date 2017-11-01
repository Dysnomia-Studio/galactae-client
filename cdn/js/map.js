// Stars: 8 to 35 em
var STAR_SIZE_BASE = 8;

// Planets: 4 to 15 em
var PLANET_SIZE_BASE = 3;
var PLANET_SIZE_COEF = 9 / 7;

var QUADRANT_SECTOR_COUNT = [20,13,16,20];

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
			map.openQuadrantMap($(this).attr('id').split('-')[3]);
		});

		loadScreen.complete();
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

		/* Empty HTML to avoid bugs */
		if(map.currentMap!="quadrant") {
			$('#hud-map-quadrant-current').html('');
			$('#hud-map-quadrant-others').html('');
		}
		if(map.currentMap!="sector") {
			$('#hud-map-sector').html('');
		}
		if(map.currentMap!="system") {
			$('#hud-map-system-solarFront').html('');
		}		

		/* Show back button */
		$('#hud-map-back').css('display','block');
	}

	static openSolarSystemMap(address) { // CSS inspired by work of Julian Garnier - codepen.io/juliangarnier/pen/idhuG
		// Check Address
		if(typeof(address) != "string" || address.split("-").length != 3) {
			console.log('INVALID ADRESS FORMAT !');
			return;
		}

		// Get XML
		var systemXML = $(map.xmlDoc).find("system#" + address)[0];
		map.currentMap = "system";

		$('#hud-map-system-solarFront').html("");

		var stars = [];
		var starsXML = $(systemXML).find("star");
		for(var i=0; i< starsXML.length; i++) {
			stars[i] = {};
			stars[i].address = $(starsXML[i]).attr('id');
			stars[i].size    = $(starsXML[i]).attr('size');
			stars[i].type    = $(starsXML[i]).attr('type');
		}

		var planets = [];
		var planetsXML = $(systemXML).find("planet");
		for(var i=0; i< planetsXML.length; i++) {
			planets[i] = {};
			planets[i].address = $(planetsXML[i]).attr('id');
			planets[i].size    = $(planetsXML[i]).attr('size');
			planets[i].type    = $(planetsXML[i]).attr('type');
			planets[i].gtype   = $(planetsXML[i]).attr('gtype');
		}

		
		// !! Percentage of solar system size !! \\
		var firstPlanet = 0;

		// Star position
		if(stars.length > 1) { // If multiple stars
			// Classons les etoiles et placons les sur leurs orbites
			var orbitSize = [];

		    if(stars.length == 2) { // 2 etoiles
				// Si c'est les memes gTypes (naine et naine OU geante et geante), et on exclue les supergeantes
				if(stars[0].type.substr(-5) === stars[1].type.substr(-5) && 
					stars[0].type.substr(-10) !== "SuperGiant" && 
					stars[1].type.substr(-10) !== "SuperGiant") {

					orbitSize[0] = orbitSize[1] = 8;
					firstPlanet = 20;
				} else { // Si ce sont des etoiles differentes
					// Sort by size 
				    stars.sort(function(a,b) {
				    	if(a.size == b.size) {
				    		return 0;
				    	} else if(a.size > b.size) {
				    		return -1;
				    	} 
				    	return 1;
				    });

				    // On place la premiere en 0
				    orbitSize[0] = 0;

				    // et la seconde en orbite
				    orbitSize[1] = 15;

				    // enfin la position de la premiere planete en orbite autour
				    firstPlanet = 28;
				}
			} else { // 3 etoiles
				// On cherche si les 3 sont du meme gType
				
				// sinon si 2 sont du meme type, qui est plus gros que la 3e

				// sinon si 2 sont du meme type, qui est plus petit que la 3e

				// sinon on sort par taille
			}

			// Enfin on genere les étoiles à leur place
			for(var i=0; i<stars.length; i++) {
				// Create DOM
				$("#hud-map-system-solarFront").append("<div class=\"star " + stars[i].type + "\" id=\"" + stars[i].address + "\"></div>");

				// Set Size
				$("#" + stars[i].address).css("font-size","" + (STAR_SIZE_BASE + parseFloat(stars[i].size)) + "em");

				// Set Orbit, star position and anim duration
				
				/* Orbit */
				$("#" + stars[i].address).css("height","" + orbitSize[i] + "vh");
				$("#" + stars[i].address).css("width","" + orbitSize[i] + "vw");

				$("#" + stars[i].address).css("margin-top","-" + (orbitSize[i]/2) + "vh");
				$("#" + stars[i].address).css("margin-left","-" + (orbitSize[i]/2) + "vw");

				/* Star Pos */
				var orbitDuration = orbitSize[i] * 36; // in seconds
				var posAng = (Date.now()%orbitDuration)/orbitDuration * (2* Math.PI); // in radians
				
				$("#" + stars[i].address + " .pos").css("top","calc(50% + (" + (orbitSize[i]/2) + "vh * " + Math.sin(posAng) + "))");
				$("#" + stars[i].address + " .pos").css("left","calc(50% + (" + (orbitSize[i]/2) + "vw * " + Math.cos(posAng) + "))");
			}
		} else { 
			// Only a star
			$("#hud-map-system-solarFront").append("<div class=\"star " + stars[0].type + "\" id=\"" + stars[0].address + "\"></div>");

			// Set Size
			$("#" + stars[0].address).css("font-size","" + (STAR_SIZE_BASE + parseFloat(stars[0].size)) + "em");

			firstPlanet = 12;
		}

		// For each Planet
		for(var i=0; i<planets.length; i++) {
			// Create DOM
			$("#hud-map-system-solarFront").append('<div class="orbit" id="' + planets[i].address + '"><div class="pos"></div></div>');
			$("#" + planets[i].address + " .pos .planet").append('<dl class="infos">' +
						'<dt></dt>' + // @ADD: Name
						'<dd></dd>' + // @ADD: Player & Address
				'</dl>');

			// Set Size
			$("#" + planets[i].address).css("font-size","" + (PLANET_SIZE_BASE + parseFloat(planets[i].size)*PLANET_SIZE_COEF) + "em");

			// Set Orbit, planet position and anim duration
			// !! Percentage of solar system size !! \\
			var orbitSize = firstPlanet + 5 + (i)*((95 - firstPlanet)/((planets.length * 0.5) + 1));

			// Anim duration
			var orbitDuration = orbitSize * 36; // in seconds
			$("#" + planets[i].address).css("animation-duration","" + orbitDuration + "s");
			$("#" + planets[i].address + " .pos").css("animation-duration","" + orbitDuration + "s");
			$("#" + planets[i].address + " .pos .planet").css("animation-duration","" + orbitDuration + "s");

			/* Orbit */
			$("#" + planets[i].address).css("height","" + orbitSize + "vh");
			$("#" + planets[i].address).css("width","" + orbitSize + "vh");

			$("#" + planets[i].address).css("margin-top","-" + (orbitSize/2) + "vh");
			$("#" + planets[i].address).css("margin-left","-" + (orbitSize/2) + "vh");

			/* Planet Pos */
			var posAng = (Date.now()%orbitDuration)/orbitDuration * (2* Math.PI); // in radians
			
			$("#" + planets[i].address + " .pos").css("top","calc(50% + (" + (orbitSize/2) + "vh * " + Math.sin(posAng) + "))");
			$("#" + planets[i].address + " .pos").css("left","calc(50% + (" + (orbitSize/2) + "vh * " + Math.cos(posAng) + "))");

			/* Planet Img */
			$("#" + planets[i].address + " .pos").append("<div class=\"planet\"></div>");
			$("#" + planets[i].address + " .pos .planet").css("background-image","url("+cdnURL+"/img/planets/front/" + planets[i].type + ".jpg)")

			/* Shadow Anim */
			$.keyframe.define([{
				name: "planetShadow-" + planets[i].address,
				'0%': { "box-shadow": "inset -12px 0 5px rgba(0, 0, 0, 0.5)"},
				'25%': { "box-shadow": "inset 0 0 2px rgba(0, 0, 0, 0.5)"}, // Haut
				'25.01%': { "box-shadow": "inset 0 0 2px rgba(0, 0, 0, 0.5)"}, // Haut
				'50%': { "box-shadow": "inset 12px 0 5px rgba(0, 0, 0, 0.5)"},
				'75%': { "box-shadow": "inset 50px -15px 40px rgba(0, 0, 0, 0.5)"}, // Bas
				'75.01%': { "box-shadow": "inset -50px -15px 40px rgba(0, 0, 0, 0.5)"}, // Bas
				'100%': { "box-shadow": "inset -12px 0 5px rgba(0, 0, 0, 0.5)"},
			}]);

			/* Set shadow anim */
			$("#" + planets[i].address + " .pos .planet").css("animation-name","planetShadow-" + planets[i].address);

			/* Place shadow anim */
			var currShadow = (posAng/(2*Math.PI))*orbitDuration - orbitDuration;
			$("#" + planets[i].address + " .pos .planet").css("animation-delay","" + currShadow + "s");

			$("#" + planets[i].address + " .pos .planet").css("animation-duration","" + orbitDuration + "s");


			// @ADD: Rings & Moons
		}		

		// Back button
		$('#hud-map-back').text(translate['map']['BACK_SECTOR']);

		// Toggle Maps
		map.hideAllMaps();
		map.currentAddress = address;
		$('#hud-map-system').css('display','block');

		$("#hud-map-system").removeClass('view-2D opening').addClass("view-3D").delay(2000).queue(function() {
			$(this).removeClass('hide-UI').addClass("set-speed");
			$(this).dequeue();
		});
	}

	static openSectorMap(address) {
		// Check Address
		if(typeof(address) != "string" || address.split("-").length != 2) {
			console.log('INVALID ADRESS FORMAT !');
			return;
		}

		// Get XML
		var sectorXML = $(map.xmlDoc).find("sector#" + address)[0];
		map.currentMap = "sector";

		var systemList = $(sectorXML).find("system");

		// Generate Content
		var content = "";

		for(var i=0; i<systemList.length; i++) {
			var starList = $(systemList[i]).find("star");
			var starBType = "";
			var starBSize = 0;

			for(var currStar=0; currStar<starList.length; currStar++) {
				if($(starList[currStar]).attr('size') > starBSize) {
					starBType = $(starList[currStar]).attr('type');
					starBSize = $(starList[currStar]).attr('size');
				}
			}

			content += '<span id="' + $(systemList[i]).attr('id') + '" class="sector-subsystem ' + starBType + '" ';

			content += 'style="left: ' + $(systemList[i]).attr('x') + '%; top: ' + $(systemList[i]).attr('y') + '%;"></span>';
		}

		$('#hud-map-sector').html(content);

		// Events
		$('.sector-subsystem').click(function() {
			map.openSolarSystemMap($(this).attr('id'));
		});

		// Back button
		$('#hud-map-back').text(translate['map']['BACK_QUADRANT']);

		// Toggle Maps
		map.hideAllMaps();
		map.currentAddress = address;
		$('#hud-map-sector').css('display','block');
	}

	static openQuadrantMap(address) {
		// Check Address
		if(typeof(address) != "string" || address.split("-").length != 1) {
			console.log('INVALID ADRESS FORMAT !');
			return;
		}

		address = parseInt(address);

		// Get XML
		var quadrantXML = $(map.xmlDoc).find("quadrant#" + address)[0];
		map.currentMap = "quadrant";

		$('#hud-map-quadrant-current').html("");
		$('#hud-map-quadrant-current').removeClass("quadrant-current-left quadrant-current-top quadrant-current-right quadrant-current-bottom");

		// Generate sectors
		for(var i=0; i<QUADRANT_SECTOR_COUNT[address]; i++) {
			$('#hud-map-quadrant-current').append('<div class="quadrant-subsector" id="' + address + '-' + i + '"></div>');

			var lines = [];

			var baseleft = 0;
			var basetop = 0;

			var multleft = 0;
			var multtop = 0;

			// Positionning
			switch(address) {
				case 0: // Top left
					lines = [5,5,5,5];

					baseleft = 86.5;;
					basetop = 85;

					multleft = -13.5;
					multtop = -15;

					$('#hud-map-quadrant-current').addClass("quadrant-current-top quadrant-current-left");
					break;
				case 1: // Top right
					lines = [4,4,3,2];

					baseleft = 0;
					basetop = 85;
	
					multleft = 13.5;
					multtop = -15;

					$('#hud-map-quadrant-current').addClass("quadrant-current-top quadrant-current-right");
					break;
				case 2: // Bottom left
					lines = [4,4,4,3,1];

					baseleft = 86.5;
					basetop = 0;
	
					multleft = -13.5;
					multtop = 15;

					$('#hud-map-quadrant-current').addClass("quadrant-current-bottom quadrant-current-left");
					break;
				case 3: // Bottom right
					lines = [4,4,4,4,4];

					baseleft = 0;
					basetop = 0;
	
					multleft = 13.5;
					multtop = 15;

					$('#hud-map-quadrant-current').addClass("quadrant-current-bottom quadrant-current-right");
					break;
				default:
					return;
			}

			var mod = i;
			var it = 0;
			while(mod>=lines[it]) {
				mod -= lines[it];
				it ++;
			}

			var left = baseleft + (mod*multleft);
			var top  = basetop + (it*multtop);
			
			$('#' + address + '-' + i).css('left',"" + left + "%");

			$('#' + address + '-' + i).css('top',"" + top + "%");
		}

		// Background position
		// & Quadrants position
		var othersQuadrants = "";
		
		switch(address) {
			case 0: // Top left
				$('#hud-map-quadrant').css('background-position','  0%   0%');

				$('#hud-map-quadrant-current').css('width', 'calc(82vw - 2px)');
				$('#hud-map-quadrant-current').css('height','calc(45vw - 2px)');

				othersQuadrants += '<div class="quadrant-other quadrant-other-left quadrant-other-bottom" id="2" style="width: calc(82vw - 1px); height: calc(100vh - 45vw - 1px);"></div>';
				othersQuadrants += '<div class="quadrant-other quadrant-other-right quadrant-other-bottom" id="3" style="width: calc(18vw - 1px); height: calc(100vh - 45vw - 1px);"></div>';
				othersQuadrants += '<div class="quadrant-other quadrant-other-right quadrant-other-top" id="1" style="width: calc(18vw - 1px); height: calc(45vw - 1px);"></div>';
				break;
			case 1: // Top right
			    $('#hud-map-quadrant').css('background-position','100%   0%');

				$('#hud-map-quadrant-current').css('width', '84.5vw');
				$('#hud-map-quadrant-current').css('height','calc(45vw - 2px)');

				othersQuadrants += '<div class="quadrant-other quadrant-other-right quadrant-other-bottom" id="3" style="width: calc(84.5vw - 1px); height: calc(100vh - 45vw - 1px);"></div>';
				othersQuadrants += '<div class="quadrant-other quadrant-other-left quadrant-other-bottom" id="2" style="width: calc(15.5vw - 1px); height: calc(100vh - 45vw - 1px);"></div>';
				othersQuadrants += '<div class="quadrant-other quadrant-other-left quadrant-other-top" id="0" style="width: calc(15.5vw - 1px); height: calc(45vw - 1px);"></div>';
				break;
			case 2: // Bottom left
			    $('#hud-map-quadrant').css('background-position','  0% 100%');

				$('#hud-map-quadrant-current').css('width', 'calc(82vw - 2px)');
				$('#hud-map-quadrant-current').css('height','calc(50vw - 10vh)');

				othersQuadrants += '<div class="quadrant-other quadrant-other-left quadrant-other-top" id="0" style="width: calc(82vw - 1px); height: calc(100vh - 50vw + 10vh);"></div>';
				othersQuadrants += '<div class="quadrant-other quadrant-other-right quadrant-other-top" id="1" style="width: 18vw; height: calc(100vh - 50vw + 10vh);"></div>';
				othersQuadrants += '<div class="quadrant-other quadrant-other-right quadrant-other-bottom" id="3" style="width: 18vw; height: calc(50vw - 10vh - 1px);"></div>';
				break;
			case 3: // Bottom right
			    $('#hud-map-quadrant').css('background-position','100% 100%');

				$('#hud-map-quadrant-current').css('width', '84.5vw');
				$('#hud-map-quadrant-current').css('height','calc(50vw - 10vh)');

				othersQuadrants += '<div class="quadrant-other quadrant-other-right quadrant-other-top" id="1" style="width: calc(84.5vw - 1px); height: calc(100vh - 50vw + 10vh);"></div>';
				othersQuadrants += '<div class="quadrant-other quadrant-other-left quadrant-other-top" id="0" style="width: 15.5vw; height: calc(100vh - 50vw + 10vh);"></div>';
				othersQuadrants += '<div class="quadrant-other quadrant-other-left quadrant-other-bottom" id="2" style="width: 15.5vw; height: calc(50vw - 10vh - 1px);"></div>';
				break;
			default:
				return;
		}

		$('#hud-map-quadrant-others').html(othersQuadrants);

		// Open sector
		$('.quadrant-subsector').click(function() {
			map.openSectorMap($(this).attr('id'));
		});

		$('.quadrant-other').click(function() {
			map.openQuadrantMap($(this).attr('id'));
		});

		// Back button
		$('#hud-map-back').text(translate['map']['BACK_GALAXY']);

		// Toggle Maps
		map.hideAllMaps();
		map.currentAddress = ""+address;
		$('#hud-map-quadrant').css('display','block');
	}

	static openGalacticMap() {
		map.currentMap = "galaxy";

		// Toggle Maps
		map.hideAllMaps();
		map.currentAddress = "";

		// Back button
		$('#hud-map-back').css('display','none');

		$('#hud-map-galaxy').css('display','block');
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