var loadStatus = 0;
var loadStatusArr = {
	"settings": false,
	"server": false,
	"planet": false,
	"units": false,
	"player": false,
	"fleet": false,
	"maps": false,
	"pictures": false,
};
var loadEnd = 12;
// 1 -> Server Connection
// 2 -> Planet Data Recieving
// 3 -> Planet Back (Planet)
// 4 -> Planet Back (Player 1)
// 5 -> Planet Back (Player 2)
// 6 -> Units data
// 7 -> Player data
// 8 -> Player data (2)
// 9 -> Settings
// 10 -> Preload Pictures
// 11 -> Map
// 12 -> Fleet list

class loadScreen {
	static show() {
		$('#loading-overlay').show();
	}

	static complete(title="") {
		if(++loadStatus>loadEnd) { return; } // Not needed if loading is already hided

		if(loadStatus==loadEnd) {
			setTimeout(function() {
				loadScreen.hide();
			},100); // Mini timeout to avoid graphical bugs
		}

		// Loading texts
		if(title != "") {
			loadStatusArr[title] = true;

			for(var i in loadStatusArr) {
				if(loadStatusArr[i] == true) { continue; }

				$(".loading-overlay-bar-secondary").css('display','none');
				if(i=="pictures") {
					$(".loading-overlay-bar-secondary").css('display','block');
				}

				if(translate['load'][i] !== undefined) {
					$('#loading-overlay-desc').html(translate['load'][i]);
				}
				break;
			}

			var percentage = Math.round(loadStatus/loadEnd*100);
			$(".loading-overlay-bar-primary .loading-overlay-bar-value").text(percentage + "%");
			$(".loading-overlay-bar-primary .loading-overlay-bar-content").css("width", percentage + "%");
		}
	}

	static hide() {
		$('#loading-overlay').hide();
	}

	static picturePreload() {
		var picList = [
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
			cdnURL + 'img/ui/moral.png',
			cdnURL + 'img/ui/money.png',
			cdnURL + 'img/ui/minerals.png',

			// HUD BOTTOM
			cdnURL + 'img/ui/fleets.png',
		];

		// Buildings
		for(var i=0; i<buildingsNames.length; i++) {
			// Panel picture
			picList.push(cdnURL + "img/buildings/desc/" + buildingsNames[i] + '.jpg');
		}

		// Planets
		var backPlanetList = [0];
		for(var i in backPlanetList) {
			picList.push(cdnURL + "img/planets/back/" + backPlanetList[i] + '.png')
		}
		var frontPlanetList = [0,1,2,3,4,
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
					$(".loading-overlay-bar-secondary .loading-overlay-bar-value").text((++count) + "/" + picList.length);
					$(".loading-overlay-bar-secondary .loading-overlay-bar-content").css("width", Math.round(count/picList.length*100) + "%");
					if (count == picList.length) {
						loadScreen.complete('pictures');
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

$(document).ready(function() {
	// Basic Security (ClientSide)
	if(!existCookie('galactae-account-username') || !existCookie('galactae-account-id')) { //Why are you here ?!
		kick("not-connected");
	}

	$('#loading-overlay-desc').html(translate['load']["server"]);

	// Load settings
	settings.init();

	// On affiche la page de chargement
	loadScreen.show();

	// Prechargement des images
	loadScreen.picturePreload();

	// On se connecte au serveur node et on verifie l'identité du client ( Serveur )
	webSockets.createConnection();

	console.log("%c" + translate["messages"]["selfXSSWarn"],'font-size: 2em; font-weight: bold; color: red;');
});