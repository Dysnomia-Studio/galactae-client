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

class loadScreen {
	static reset() {
		loadStatusArr = {
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
		loadScreen.complete();
		ui.show('#loading-overlay');
	}

	/**
	 * Notify loader that we loaded a new part of the game
	 *
	 * @param      {string}  title   Part loaded
	 */
	static complete(title="") {
		let loadCount = 0;
		let loadMax = 0;
		for(let i in loadStatusArr) {
			if(loadStatusArr[i]) { loadCount++; }
			loadMax++;
		}

		if(loadCount === loadMax) { return; } // Not needed if loading is already hided

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

			let percentage = Math.round(loadCount/loadMax*100);
			let DOMElts = document.querySelectorAll('.loading-overlay-bar-primary .loading-overlay-bar-value');
			for(let i=0; i<DOMElts.length; i++) {
				DOMElts[i].innerText = percentage + "%";
			}
			DOMElts = document.querySelectorAll('.loading-overlay-bar-primary .loading-overlay-bar-content');
			for(let i=0; i<DOMElts.length; i++) {
				DOMElts[i].style.width = percentage + "%";
			}
		}

		if(loadCount === loadMax - 1) {
			setTimeout(function() {
				ui.hide('#loading-overlay');
			},100); // Mini timeout to avoid graphical bugs
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
		navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
			// Registration was successful
			console.log('[SW] Registration successful with scope: ', registration.scope);

			let serviceWorker;

	        if (registration.installing) {
	            serviceWorker = registration.installing;
	        } else if (registration.waiting) {
	            serviceWorker = registration.waiting;
	        } else if (registration.active) {
	            serviceWorker = registration.active;
	        }

	        if (serviceWorker) {
	            serviceWorker.addEventListener('statechange', function (e) {
	                if(navigator.serviceWorker.controller !== null) {
						loadScreen.complete("service-worker");
						navigator.serviceWorker.controller.postMessage({ change: $('#game-version').text() !== localStorage.gameVersion });
						localStorage.gameVersion = $('#game-version').text();
	                }
	            });

                if(navigator.serviceWorker.controller !== null) {
					loadScreen.complete("service-worker");
					navigator.serviceWorker.controller.postMessage({ change: $('#game-version').text() !== localStorage.gameVersion });
					localStorage.gameVersion = $('#game-version').text();
                }
	        }
		}, function(err) {
			// registration failed :(
			console.log('[SW] Registration failed: ', err);
			loadScreen.complete("service-worker");
		});
	} else {
		loadScreen.complete("service-worker"); // On valide le service worker si le navigateur ne supporte pas cette fonctionnalité
	}
});

window.addEventListener('load', function() { loadScreen.complete('load'); });