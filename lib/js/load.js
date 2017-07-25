var loadStatus = 0;
var loadEnd = 2;
// 1 -> Server Connection
// 2 -> Planet Data Recieving

class loadScreen {
	static show() {
		$('#loading-overlay').show();
	}

	static complete() {
		if(loadStatus>=loadEnd) { return; } // Not needed if loading is already hided
		loadStatus++;

		if(loadStatus==loadEnd) {
			this.hide();
		}
	}

	static hide() {
		$('#loading-overlay').hide();
	}
}


$(document).ready(function() {
	// Basic Security ( ClientSide )
	if(!existCookie('galactae-account-username') || !existCookie('galactae-account-id')) { //Why are you here ?!
		kick("not-connected");
	}
	// On affiche la page de chargement
	loadScreen.show();

	// On se connecte au serveur node et on verifie l'identité du client ( Serveur )
	webSockets.createConnection();
});