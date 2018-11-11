let loadStatus = 0;
let loadStatusArr = {
	"settings": false,
	"server": false,
	"planet": false,
	"units": false,
	"player": false,
	"fleet": false,
	"maps": false,
	"load": false,
	"service-worker": false,
};
let loadEnd = 11;
// 1 -> Server Connection
// 2 -> Planet Data Recieving
// 3 -> Planet Back
// 4 -> Units data
// 5 -> Player data
// 6 -> Player data (2)
// 7 -> Settings
// 8 -> Map
// 9 -> Fleet list
// 10 -> Window load event
// 11 -> Service worker

class loadScreen {
	/**
	 * Notify loader that we loaded a new part of the game
	 *
	 * @param      {string}  title   Part loaded
	 */
	static complete(title="") {
		if(++loadStatus>loadEnd) { return; } // Not needed if loading is already hided

		if(loadStatus==loadEnd) {
			setTimeout(function() {
				ui.hide('#loading-overlay');
			},100); // Mini timeout to avoid graphical bugs
		}

		// Loading texts
		if(title != "") {
			loadStatusArr[title] = true;

			for(let i in loadStatusArr) {
				if(loadStatusArr[i] == true) { continue; }

				ui.hide('.loading-overlay-bar-secondary');
				if(i=="pictures") {
					ui.show('.loading-overlay-bar-secondary');
				}

				if(translate.load[i] !== undefined) {
					document.getElementById('loading-overlay-desc').innerHTML = translate.load[i];
				}
				break;
			}

			let percentage = Math.round(loadStatus/loadEnd*100);
			let DOMElts = document.querySelectorAll('.loading-overlay-bar-primary .loading-overlay-bar-value');
			for(let i=0; i<DOMElts.length; i++) {
				DOMElts[i].innerText = percentage + "%";
			}
			DOMElts = document.querySelectorAll('.loading-overlay-bar-primary .loading-overlay-bar-content');
			for(let i=0; i<DOMElts.length; i++) {
				DOMElts[i].style.width = percentage + "%";
			}
		}
	}
}

ready(function() {
	// Basic Security (ClientSide)
	if(!existCookie('galactae-account-username') || !existCookie('galactae-account-id')) { //Why are you here ?!
		kick("not-connected");
	}

	document.getElementById('loading-overlay-desc').innerHTML = translate.load["server"];

	// Load settings
	settings.init();

	// On affiche la page de chargement
	ui.show('#loading-overlay');

	// On se connecte au serveur node et on verifie l'identité du client ( Serveur )
	webSockets.createConnection();

	console.log("%c" + translate.messages["selfXSSWarn"],'font-size: 2em; font-weight: bold; color: red;');

	// Service worker
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register(cdnURL + 'service-worker.js').then(function(registration) {
			// Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope);

			let serviceWorker;

	        if (registration.installing) {
	            serviceWorker = registration.installing;
	        } else if (registration.waiting) {
	            serviceWorker = registration.waiting;
	        } else if (registration.active) {
	            serviceWorker = registration.active;
	        }

	        if (serviceWorker) {
	            console.log(serviceWorker.state);
	            serviceWorker.addEventListener('statechange', function (e) {
	                console.log(e.target.state);

	                if(navigator.serviceWorker.controller !== null) {
	                	console.log("sending change status to sw");
						loadScreen.complete("service-worker");
						navigator.serviceWorker.controller.postMessage({ change: $('#game-version').text() !== localStorage.gameVersion });
						localStorage.gameVersion = $('#game-version').text();
	                } else {
	                	console.log(null);
	                }
	            });

            	if(navigator.serviceWorker.controller !== null) {
                	console.log("sending change status to sw");
					loadScreen.complete("service-worker");
					navigator.serviceWorker.controller.postMessage({ change: $('#game-version').text() !== localStorage.gameVersion });
					localStorage.gameVersion = $('#game-version').text();
                } else {
	                	console.log(null);
	            }
	        }
		}, function(err) {
			// registration failed :(
			console.log('ServiceWorker registration failed: ', err);
			loadScreen.complete("service-worker");
		});
	} else {
		loadScreen.complete("service-worker"); // On valide le service worker si le navigateur ne supporte pas cette fonctionnalité
	}
});

window.addEventListener('load', function() { loadScreen.complete('load'); });