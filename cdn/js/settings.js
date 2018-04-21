class settings {
	static init() {
		this.settingsList = {
			general: {
				language: { 
					default: "", // @ADD: Langue actuelle du jeu
					type: "select",
					choices: [
						"fr",
						"en",
						"ru",
						"de"
					]
				},
				deskNotifications: {
					default: true,
					type: "checkbox"
				}
			},
			graphical: {
				planetRotation: {
					default: true,
					type: "checkbox"
				},
				animationLvl: {
					default: "high", // @ADD: auto-detect
					type: "select",
					choices: [
						"high",
						"medium",
						"low"
					]
				},
				map3D: {
					default: true,
					type: "checkbox"
				}
			},
			sounds: {
				soundLvl: {
					default: 100,
					type: "slider",
					min: 0,
					max: 100
				},
				musicLvl: {
					default: 100,
					type: "slider",
					min: 0,
					max: 100
				},
				escape: {
					default: true,
					type: "checkbox"
				},
				privateMessage: {
					default: true,
					type: "checkbox"
				},
			},
			keyboard: {
				escape: {
					default: KEYBOARD.ESC,
					type: "keyboard"
				},
				nextPlanet: {
					default: KEYBOARD.LARROW,
					type: "keyboard"
				},
				prevPlanet: {
					default: KEYBOARD.RARROW,
					type: "keyboard"
				}
			}
		};

		loadScreen.complete("settings");
	}
	static loadUI() {
		$("#hud-settings").click(function () {
			if(ui.menu) {
				ui.closeTab("#settings-menu");
			} else {
				$("#settings-menu").css('display','block');
			}
			ui.menu = !(ui.menu);
		});
		$(document).click(function(e) {
			if(ui.menu && e.target.id != "settings-menu" && e.target.id != "hud-settings") {
				ui.closeTab("#settings-menu", false);
				ui.menu = !(ui.menu);
			}
		});
	}
	static get(settingName) {
		
	}
}