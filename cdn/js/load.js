var loadStatus = 0;
var loadEnd = 9;
// 1 -> Server Connection
// 2 -> Planet Data Recieving
// 3 -> Planet Back
// 4 -> Units data
// 5 -> Player data
// 6 -> Settings
// 7 -> Preload Pictures
// 8 -> Map
// 9 -> Fleet list

class loadScreen {
	static show() {
		$('#loading-overlay').show();
	}

	static complete() {
		if(++loadStatus>loadEnd) { return; } // Not needed if loading is already hided

		if(loadStatus==loadEnd) {
			setTimeout(function() {
				loadScreen.hide();
			},100); // Mini timeout to avoid graphical bugs
		}
	}

	static hide() {
		$('#loading-overlay').hide();
	}

	static picturePreload() {
		var picList = [
			// Research
			//cdnURL + 'img/ui/research.png', Disabled because already preloaded in HUD
			// Buildings
			cdnURL + 'img/buildings/arrow.png',
			// Misc UI
			cdnURL + 'img/ui/hud-top.png',
			cdnURL + 'img/ui/hud-bottom-left.png',
			cdnURL + 'img/ui/hud-bottom-right.png',
			cdnURL + 'img/ui/hud-chat.png',
			cdnURL + 'img/ui/chat-voice.png',
			cdnURL + 'img/ui/build-panel.png',
			cdnURL + 'img/ui/window.png',

			// HUD TOP
			cdnURL + 'img/ui/population.png',
			cdnURL + 'img/ui/research.png',
			cdnURL + 'img/ui/moral.png',
			cdnURL + 'img/ui/electricity.png',
			cdnURL + 'img/ui/money.png',
			cdnURL + 'img/ui/minerals.png',

			cdnURL + 'img/ui/settings.png',
			// HUD BOTTOM LEFT
			cdnURL + 'img/ui/map.png',
			cdnURL + 'img/ui/researchs.png',
			cdnURL + 'img/ui/units.png',
			cdnURL + 'img/ui/fleets.png',
			cdnURL + 'img/ui/radar.png',
			cdnURL + 'img/ui/ally.png',
			cdnURL + 'img/ui/rapports.png',
			// HUD BOTTOM RIGHT
			cdnURL + 'img/ui/quests.png',
			cdnURL + 'img/ui/trade.png',
			cdnURL + 'img/ui/ranks.png',
			cdnURL + 'img/ui/profil.png',
			cdnURL + 'img/ui/messages.png',
			cdnURL + 'img/ui/chat.png',
			
			// Map
			cdnURL + 'img/map/galaxy.jpg',
		];

		// Buildings
		for(var i=0; i<buildingsNames.length; i++) {
			// Icon
			picList.push(cdnURL + "img/buildings/icons/" + buildingsNames[i] + '.png');
			// Panel picture
			picList.push(cdnURL + "img/buildings/desc/" + buildingsNames[i] + '.jpg');
		}

		// Planets
		var backPlanetList = [0];
		for(var i in backPlanetList) {
			picList.push(cdnURL + "img/planets/back/" + backPlanetList[i] + '.png')
		}
		var frontPlanetList = [0,1,
			101,102,103,104,105,106,107,108,109,110,111,112,
			501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,
			901,42,
			1000,1001];
		for(var i in frontPlanetList) {
			picList.push(cdnURL + "img/planets/front/" + frontPlanetList[i] + '.jpg')
		}
		var haloPlanetList = [];
		for(var i in haloPlanetList) {
			picList.push(cdnURL + "img/planets/halo/" + haloPlanetList[i] + '.png')
		}

		var count = 0;

		for (var i=0; i < picList.length; i++) {
			(function (img, src) {
				img.onload = function () {
					if (++count == picList.length) {
						loadScreen.complete()
					}
				};

				// Use the following callback methods to debug
				// in case of an unexpected behavior.
				img.onerror = function () {};
				img.onabort = function () {};

				img.src = src;
			} (new Image(), picList[i]));
		}
	}
}

$(window).on( "load",function() {
	// Basic Security ( ClientSide )
	if(!existCookie('galactae-account-username') || !existCookie('galactae-account-id')) { //Why are you here ?!
		kick("not-connected");
	}
	// On affiche la page de chargement
	loadScreen.show();

	// Prechargement des images
	loadScreen.picturePreload();

	// Chargement de la map
	map.init();

	// On se connecte au serveur node et on verifie l'identité du client ( Serveur )
	webSockets.createConnection();
});