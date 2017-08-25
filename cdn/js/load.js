var loadStatus = 0;
var loadEnd = 7;
// 1 -> Server Connection
// 2 -> Planet Data Recieving
// 3 -> Planet Back
// 4 -> Units data
// 5 -> Player data
// 6 -> Settings
// 7 -> Preload Pictures
// 8 -> Map
class loadScreen {
	static show() {
		$('#loading-overlay').show();
	}

	static complete() {
		if(loadStatus>=loadEnd) { return; } // Not needed if loading is already hided
		loadStatus++;

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
			cdnURL + 'img/ui/research.png',
			// Buildings
			cdnURL + 'img/buildings/arrow.png',
			cdnURL + 'img/buildings/tabs/space-tab.png',
			// UI
			cdnURL + 'img/ui/hud-top.png',
			cdnURL + 'img/ui/chat-voice.png',

			cdnURL + 'img/ui/build-panel.png',

			cdnURL + 'img/ui/population.png',
			cdnURL + 'img/ui/research.png',
			cdnURL + 'img/ui/moral.png',
			cdnURL + 'img/ui/electricity.png',
			cdnURL + 'img/ui/money.png',
			cdnURL + 'img/ui/minerals.png',

			cdnURL + 'img/ui/settings.png',
			// Map
			cdnURL + 'img/map/galaxy.jpg',
		];

		// Buildings
		for(var i=0; i<buildingsNames.length; i++) {
			// Icon
			picList.push(cdnURL + "img/buildings/icons/" + buildingsNames[i] + '1.png')
			// Panel picture
			picList.push(cdnURL + "img/buildings/desc/" + buildingsNames[i] + '.jpg')
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