class map {
	static init() {
		map.currentMap = "";

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
         * Galaxy Map Events
         */
		$('#hud-map-galaxy .select-quadrant').click(function() {
			map.openQuadrantMap($(this).attr('id').split('-')[3]);
		});
	}

	static openTab() {
		$("#hud-map").css('display','block');
		ui.closeTab("#hud-research",false); /* A no-bug fix */
		$("#research-button").css('display','none');
		ui.map = true;

		map.hideAllMaps();

		switch(map.currentMap) {
			case "galaxy":
				map.openGalacticMap();
				break;
			case "quadrant":
				map.openQuadrantMap(address);
				break;
			case "sector":
				map.openSectorMap(address);
				break;
			default:	
				map.currentMap = "solar";
				map.openSolarSystemMap(address);
		}
	}

	static closeTab() {
		ui.closeTab("#hud-map",false);
		$("#research-button").css('display','block');
		ui.map = false;
	}

	static hideAllMaps() {
		/* Hide all maps */
		$('hud-map-galaxy').style('display','none');
		$('hud-map-quadrant').style('display','none');
		$('hud-map-sector').style('display','none');
		$('hud-map-system').style('display','none');
	}

	static openSolarSystemMap(address) {
		var systemXML = $(map.xmlDoc).find("system#" + address)[0];

		// Toggle Maps
		map.hideAllMaps();
		$('hud-map-system').style('display','block');
	}

	static openSectorMap(address) {
		var sectorXML = $(map.xmlDoc).find("sector#" + address)[0];

		// Toggle Maps
		map.hideAllMaps();
		$('hud-map-sector').style('display','block');
	}

	static openQuadrantMap(address) {
		var quadrantXML = $(map.xmlDoc).find("quadrant#" + address)[0];

		// Toggle Maps
		map.hideAllMaps();
		$('hud-map-quadrant').style('display','block');
	}

	static openGalacticMap() {
		// Toggle Maps
		map.hideAllMaps();
		$('hud-map-galaxy').style('display','block');
	}
}