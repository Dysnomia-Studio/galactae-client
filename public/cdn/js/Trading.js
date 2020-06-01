class Trading extends _Trading {
	static init(tradingList) {
		console.log(tradingList);
	}

	static loadUI() {
		document.getElementById('trading-close').addEventListener('click', () => {
			ui.hide('#trading-panel');
		});

		// Menu
		// @TODO: refacto to group up with fleet tabs
		document.querySelectorAll('#trading-panel .ul-choice-line li').forEach(function(elt) {
			elt.addEventListener('click', () => {
				ui.toggleClass('#trading-panel .ul-choice-line .ul-choice-line-li-active', 'ul-choice-line-li-active', elt);

				const buttonList = [
					'trading-panel-public',
					'trading-panel-request',
					'trading-panel-ongoing',
					'trading-panel-ended',
				];

				for(const buttonName of buttonList) {
					if(elt.id === buttonName + '-button') {
						ui.show('#' + buttonName);
					} else {
						ui.hide('#' + buttonName);
					}
				}
			});
		});
	}

	static openPlanetPanel() {

	}
}