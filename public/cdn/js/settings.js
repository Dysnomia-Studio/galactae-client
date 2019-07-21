class settings {
	/**
	 * Initialize setting variables
	 */
	static init() {
		this.settingsList = {
			general: {
				language: {
					default: 'en',
					type: 'select',
					choices: {
						'fr': 'Francais',
						'en': 'English',
						/*'ru': 'Русский',
						'de': 'Deutsch',*/
					}
				},
				/*deskNotifications: {
					default: true,
					type: 'checkbox'
				}*/
			},
			graphical: {
				planetRotation: {
					default: true,
					type: 'checkbox'
				},
				/*animationLvl: {
					default: 'high', // @ADD: auto-detect
					type: 'select',
					choices: [
						'high',
						'medium',
						'low'
					]
				},*/
				map3D: {
					default: true,
					type: 'checkbox'
				}
			},
			sounds: {
				soundLvl: {
					default: 100,
					type: 'slider',
					min: 0,
					max: 100
				},
				musicLvl: {
					default: 100,
					type: 'slider',
					min: 0,
					max: 100
				},
				escape: {
					default: true,
					type: 'checkbox'
				},
				privateMessage: {
					default: true,
					type: 'checkbox'
				},
			},
			keyboard: {
				escape: {
					default: KEYBOARD.ESC,
					type: 'keyboard'
				},
				nextPlanet: {
					default: KEYBOARD.RARROW,
					type: 'keyboard'
				},
				prevPlanet: {
					default: KEYBOARD.LARROW,
					type: 'keyboard'
				}
			}
		};

		// Mobile low settings mode
		if(isMobileBrowser()) {
			this.settingsList.graphical.planetRotation.default = false;
		}

		this.initUI();

		loadScreen.complete('settings');
	}
	/**
	 * Loads setting ui and add events
	 */
	static loadUI() {
		document.getElementById('hud-settings').addEventListener('click', function () {
			if(ui.settingsMenu) {
				settings.closeUI();
			} else {
				ui.show('#settings-menu');
				ui.settingsMenu = true;
			}
		});
		document.getElementById('settings-menu-cancel').addEventListener('click', () => {
			settings.closeUI();
		});
		document.getElementById('settings-menu-save').addEventListener('click', () => {
			this.saveSettings();
		});

		this.initUI();
	}

	static closeUI() {
		this.initUI();
		ui.closeTab('#settings-menu');
		ui.settingsMenu = false;
	}

	static generateMenu() {
		const menu = document.getElementById('settings-menu-choice');
		while(menu.firstChild) {
			menu.removeChild(menu.firstChild);
		}

		let first = false;
		for(const settingsCategory in this.settingsList) {
			const menuElt = document.createElement('li');
			menuElt.innerText = translate['settings']['menu'][settingsCategory];
			menuElt.id = 'settings-menu-' + settingsCategory;

			if(!first) {
				menuElt.classList.add('ul-choice-line-li-active');
				first = true;
			}

			menu.appendChild(menuElt);

			menuElt.addEventListener('click', () => {
				ui.toggleClass('#settings-menu-choice .ul-choice-line-li-active', 'ul-choice-line-li-active', menuElt);

				ui.toggleClass('#settings-menu-panes .settings-pane-active',
					'settings-pane-active',
					document.getElementById(menuElt.id.replace('settings-menu', 'settings-pane'))
				);
			});
		}
	}

	static generateSettingElement(settingsCategory, currSetting) {
		const settingData = this.settingsList[settingsCategory][currSetting];
		let settingElt;

		switch(settingData.type) {
			case 'select':
				settingElt = document.createElement('select');
				settingElt.classList.add('ui-small-select');

				for(const option in settingData.choices) {
					const optionElt = document.createElement('option');
					optionElt.value = option;
					optionElt.innerText = settingData.choices[option];

					if(this.get(settingsCategory + '_' + currSetting) === option) {
						optionElt.selected = true;
					}

					settingElt.appendChild(optionElt);
				}
				break;

			case 'checkbox':
				settingElt = document.createElement('input');
				settingElt.classList.add('ui-small-input');
				settingElt.type = 'checkbox';
				settingElt.checked = this.get(settingsCategory + '_' + currSetting);
				break;

			case 'slider':
				settingElt = document.createElement('input');
				settingElt.classList.add('ui-small-input');
				settingElt.type = 'range';
				settingElt.setAttribute('min', settingData.min);
				settingElt.setAttribute('max', settingData.max);
				settingElt.value = this.get(settingsCategory + '_' + currSetting);
				break;

			case 'keyboard':
				settingElt = document.createElement('input');
				settingElt.classList.add('ui-small-input');
				settingElt.type = 'keyboard';
				settingElt.value = keyboardMap[this.get(settingsCategory + '_' + currSetting)];
				settingElt.addEventListener('keydown', (event) => {
					event.preventDefault();
					settingElt.value = keyboardMap[event.keyCode];
					settingElt.setAttribute('keyCode', event.keyCode);
				});
				break;

			default:
				settingElt = document.createElement('span');
		}

		settingElt.id = 'settings-' + settingsCategory + '-' + currSetting + '-value';

		return settingElt;
	}

	static generatePanelContent(settingsCategory) {
		const paneContent = document.createElement('table');

		for(const currSetting in this.settingsList[settingsCategory]) {
			const paneLine = document.createElement('tr');

			// Left column
			const lineTitle = document.createElement('td');
			lineTitle.innerText = translate['settings'][settingsCategory][currSetting];

			// Right column
			const lineContent = document.createElement('td');
			const settingElement = this.generateSettingElement(settingsCategory, currSetting);
			lineContent.appendChild(settingElement);

			// Append elements
			paneLine.appendChild(lineTitle);
			paneLine.appendChild(lineContent);
			paneContent.appendChild(paneLine);
		}

		return paneContent;
	}

	static generatePanels() {
		const panes = document.getElementById('settings-menu-panes');
		while(panes.firstChild) {
			panes.removeChild(panes.firstChild);
		}

		let first = false;
		for(const settingsCategory in this.settingsList) {
			const pane = document.createElement('li');

			const paneContent = this.generatePanelContent(settingsCategory);
			pane.appendChild(paneContent);

			pane.id = 'settings-pane-' + settingsCategory;
			pane.classList.add('settings-pane');

			if(!first) {
				pane.classList.add('settings-pane-active');
				first = true;
			}

			panes.appendChild(pane);
		}
	}

	static initUI() {
		settings.generateMenu();
		settings.generatePanels();
	}

	static saveSettings() {
		for(const settingsCategory in this.settingsList) {
			for(const currSetting in this.settingsList[settingsCategory]) {
				const currSettingElt = document.getElementById('settings-' + settingsCategory + '-' + currSetting + '-value');

				switch(this.settingsList[settingsCategory][currSetting].type) {
					case 'select':
						this.set(
							settingsCategory + '_' + currSetting,
							currSettingElt.options[currSettingElt.selectedIndex].value
						);
						break;

					case 'checkbox':
						this.set(
							settingsCategory + '_' + currSetting,
							currSettingElt.checked
						);
						break;

					case 'slider':
						this.set(
							settingsCategory + '_' + currSetting,
							currSettingElt.value
						);
						break;

					case 'keyboard':
						this.set(
							settingsCategory + '_' + currSetting,
							currSettingElt.keyCode
						);
						break;

					default:
						continue;
				}
			}
		}

		loadScreen.reset();
		window.location.reload();
	}

	/**
	 * Get a setting value
	 *
	 * @param      {string}             settingName  The setting name
	 * @return     {?}  The setting value
	 */
	static get(settingName) {
		let val = getCookie('galactae_settings_' + settingName);
		if(val !== '') {
			if(val === 'true') { val = true; }
			if(val === 'false') { val = false; }
			return val;
		}

		const words = settingName.split('_');
		val = this.settingsList;
		for(const i in words) {
			if(val[words[i]] === undefined) { console.error('ERROR: Invalid setting name - ' + settingName); return ''; }
			val = val[words[i]];
		}

		return val.default;
	}
	/**
	 * Set setting value
	 *
	 * @param      {string}  settingName  The setting name
	 * @param      {?}  value        The value
	 */
	static set(settingName, value) {
		setCookie('galactae_settings_' + settingName, value, 365); //@ADD: Time depends on remember me
	}
	/**
	 * Test if a setting has a value
	 *
	 * @param      {string}  settingName  The setting name
	 * @param      {?}  value        The value
	 * @return     {boolean}  True if same, false otherwise
	 */
	static test(settingName, value) {
		return this.get(settingName) === value;
	}
}