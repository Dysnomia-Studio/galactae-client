class map {
	static init() {
		map.currentMap = "";
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