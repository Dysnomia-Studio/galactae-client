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
	}
}