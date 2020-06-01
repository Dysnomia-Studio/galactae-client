class Trading extends _Trading {
	static init(tradingList) {
		console.log(tradingList);
	}

	static loadUI() {
		document.getElementById('trading-close').addEventListener('click', () => {
			ui.hide('#trading-panel');
		});

		// Menu
		ui.bindChoiceLine('#trading-panel .ul-choice-line', [
			'trading-panel-public',
			'trading-panel-request',
			'trading-panel-ongoing',
			'trading-panel-ended',
		]);
	}

	static openPlanetPanel() {

	}
}