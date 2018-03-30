class settings {
	static init() {
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
}