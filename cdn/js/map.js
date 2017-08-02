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
		$('hud-map-back').css('display','block');
	}

	static openSolarSystemMap(address) {
		var systemXML = $(map.xmlDoc).find("system#" + address)[0];
		map.currentMap = "system";

		// Toggle Maps
		map.hideAllMaps();
		$('#hud-map-system').css('display','block');
	}

	static openSectorMap(address) {
		var sectorXML = $(map.xmlDoc).find("sector#" + address)[0];
		map.currentMap = "sector";

		// Toggle Maps
		map.hideAllMaps();
		$('#hud-map-sector').css('display','block');
	}

	static openQuadrantMap(address) {
		var quadrantXML = $(map.xmlDoc).find("quadrant#" + address)[0];
		map.currentMap = "quadrant";

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