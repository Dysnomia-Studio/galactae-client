class map {
	static init() {
		map.currentMap = "";

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

		map.xmlhttp.open("GET",cdnURL + "/map.xml",false);
        map.xmlhttp.send();
	}

	static openTab() {
		$("#hud-map").css('display','block');
		ui.closeTab("#hud-research",false); /* A no-bug fix */
		$("#research-button").css('display','none');
		ui.map = true;

		var address = planetData.address.split("-");

		switch(map.currentMap) {
			case "galaxy":
				map.openGalacticMap();
				break;
			case "system":
				map.openSystemMap(address[0]);
				break;
			default:	
				map.currentMap = "solar";
				map.openSolarSystemMap(address[0],address[1]);
		}
	}

	static closeTab() {
		ui.closeTab("#hud-map",false);
		$("#research-button").css('display','block');
		ui.map = false;
	}

	static openSolarSystemMap(systemAddress,solarAddress) {

	}

	static openSystemMap(systemAddress) {

	}

	static openGalacticMap() {

	}
}