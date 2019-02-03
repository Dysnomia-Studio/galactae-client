let preventFleetHUDClosing = false;
let preventUnitBuildPanelClose = false;

class units {
	/**
	 * Ask units from server
	 */
	static sync() {
		const data = userData;
		data.planet = planetData._id;
		socket.emit('units-ask-data', data);
	}

	/**
	 * Get units from server
	 *
	 * @param      {Array}  data    Unit list
	 */
	static refresh(data) {
		units.list = data;

		for(let i=0; i<units.list.length; i++) {
			if(units.list[i]._id.substr(0, 'SHIP_WEP_MINES'.length) === 'SHIP_WEP_MINES') {
				units.list.splice(i, 1);
				i--;
			}
		}

		// Mines
		if(research.isSearched(shipResearchDependencies['SHIP_WEP_MINES'])) {
			units.list.push({
				_id: 'SHIP_WEP_MINES',
				name: fleetTranslate['SHIP_WEP_MINES'],
				note: 0, // @ADD: Note
				cost: shipCosts['SHIP_WEP_MINES'],
				shipShape: 'SHIP_WEP_MINES',
				shipType: 'SHIP_DEF',
			});
		}
		if(research.isSearched(shipResearchDependencies['SHIP_WEP_MINES_IEM'])) {
			units.list.push({
				_id: 'SHIP_WEP_MINES_IEM',
				name: fleetTranslate['SHIP_WEP_MINES_IEM'],
				note: 0, // @ADD: Note
				cost: shipCosts['SHIP_WEP_MINES_IEM'],
				shipShape: 'SHIP_WEP_MINES_IEM',
				shipType: 'SHIP_DEF',
			});
		}
		if(research.isSearched(shipResearchDependencies['SHIP_WEP_MINES_NUKE'])) {
			units.list.push({
				_id: 'SHIP_WEP_MINES_NUKE',
				name: fleetTranslate['SHIP_WEP_MINES_NUKE'],
				note: 0, // @ADD: Note
				cost: shipCosts['SHIP_WEP_MINES_NUKE'],
				shipShape: 'SHIP_WEP_MINES_NUKE',
				shipType: 'SHIP_DEF',
			});
		}

		units.fname = '';
		units.currUnit = -1;
		units.fleetList = units.fleetList || {};

		units.sortTypes = 'name';

		units.currFleet = '';
		units.fleetTimes = [];
		units.fleetFuel  = [];

		units.planetTarget = '';

		units.drawMain();
		units.drawFleetLists();
	}

	/**
	 * UI events & load for units tabs
	 */
	static loadUI() {
		units.lastType = 'SHIP_ALL';

		// Fleet panels close events
		document.getElementById('fleet-close').addEventListener('click', function() {
			if(preventFleetHUDClosing) { return; }
			if(units.unitPanelTimeout !== -1) {
				clearTimeout(units.unitPanelTimeout);
				units.unitPanelTimeout = -1;
			}

			ui.closeTab('#hud-fleet');
			ui.fleet = false;
		});
		document.getElementById('fleet-type-create-close').addEventListener('click', function() {
			preventFleetHUDClosing = false;
			ui.closeTab('#fleet-type-create');
		});
		document.getElementById('fleet-ship-build-close').addEventListener('click', function() {
			if(preventUnitBuildPanelClose) { return; }
			preventFleetHUDClosing = false;
			ui.closeTab('#fleet-ship-build');
		});
		// Fleet Menu
		document.querySelectorAll('.fleet-ul1 li').forEach(function(elt) {
			elt.addEventListener('click', function() {
				if(preventFleetHUDClosing) { return; }

				ui.toggleClass('.fleet-ul1 .ul-choice-line-li-active', 'ul-choice-line-li-active', this);

				if(this.id === 'fleet-build-button') {
					ui.show('#fleet-build');
				} else {
					ui.hide('#fleet-build');
				}

				if(this.id === 'fleet-orbit-button') {
					ui.show('#fleet-orbit');
				} else {
					ui.hide('#fleet-orbit');
				}

				if(this.id === 'fleet-move-button') {
					ui.show('#fleet-move');
				} else {
					ui.hide('#fleet-move');
				}

				if(this.id === 'fleet-out-button') {
					ui.show('#fleet-out');
				} else {
					ui.hide('#fleet-out');
				}

				ui.updateBottom();
			});
		});

		// Fleet submenus
		document.querySelectorAll('#fleet-build-choice li').forEach(function(e) {
			e.addEventListener('click', function() {
				if(preventFleetHUDClosing) { return; }

				ui.toggleClass('#fleet-build-choice .ul-choice-line-li-active', 'ul-choice-line-li-active', this);

				units.drawMain(this.getAttribute('shipType'));
			});
		});

		// Type create
		document.getElementById('fleet-type-create-form').addEventListener('submit', function(e) {
			e.preventDefault();
			units.createNewType();
		});

		document.getElementById('fleet-build-create').addEventListener('click', function() {
			if(preventFleetHUDClosing) { return; }

			units.drawCreateTypePanel();
		});
		// Type copy
		document.getElementById('fleet-build-type-copy').addEventListener('click', function() {
			if(preventFleetHUDClosing) { return; }

			units.drawCreateTypePanel();
		});
		// Type delete
		document.getElementById('fleet-build-type-delete').addEventListener('click', function() {
			if(preventFleetHUDClosing) { return; }

			ui.show('#fleet-typeDelete-panel');
			preventFleetHUDClosing = true;
		});
		document.getElementById('fleet-typeDelete-yes').addEventListener('click', function() {
			socket.emit('unit-type-delete', {
				id: userData.id,
				username: userData.username,
				unit: units.list[units.currUnit]._id
			});
			ui.hide('#fleet-typeDelete-panel');
			preventFleetHUDClosing = false;
		});
		document.getElementById('fleet-typeDelete-no').addEventListener('click', function() {
			ui.hide('#fleet-typeDelete-panel');
			preventFleetHUDClosing = false;
		});
		// Type rename
		document.getElementById('fleet-build-rename').addEventListener('click', function() {
			if(preventFleetHUDClosing) { return; }

			const oldName = units.list[units.currUnit].name;
			document.getElementById('fleet-type-rename-name').innerText = oldName;
			document.getElementById('fleet-type-rename-newName').value = oldName;

			ui.show('#fleet-type-rename');
			preventFleetHUDClosing = true;
		});
		document.getElementById('fleet-type-rename-submit').addEventListener('click', function() {
			if(document.getElementById('fleet-type-rename-newName').value === '') { return; }

			socket.emit('unit-type-rename', {
				id: userData.id,
				username: userData.username,
				shipId: units.list[units.currUnit]._id,
				shipNewName: document.getElementById('fleet-type-rename-newName').value
			});
			ui.hide('#fleet-type-rename');
			preventFleetHUDClosing = false;
		});
		document.getElementById('fleet-type-rename-close').addEventListener('click', function() {
			ui.hide('#fleet-type-rename');
			preventFleetHUDClosing = false;
		});
		// Nouveau tri
		document.querySelectorAll('#fleet-build-list thead tr th').forEach(function(e) {
			e.addEventListener('click', function() {
				let name = this.id.split('-')[4];

				if(name === units.sortTypes) {
					name += '-desc';
				}

				units.sortTypes = name;

				units.drawMain();
			});
		});

		// Fleet build
		document.getElementById('fleet-build-openPanel').addEventListener('click', function() {
			if(preventFleetHUDClosing) { return; }

			preventFleetHUDClosing = true;
			units.drawBuildPanel();
		});
		document.getElementById('fleet-newFleet-submit').addEventListener('click', function() {
			units.validFleetName();
		});

		document.getElementById('fleet-ship-build-upgrade').addEventListener('click', function() {
			units.askUnitBuild();
		});

		// Change informations with buttons
		document.querySelectorAll('#fleet-build-buttons img').forEach(function(e) {
			e.addEventListener('mouseenter', function() {
				switch(this.id) {
				case 'fleet-build-openPanel':
				case 'fleet-build-type-copy':
				case 'fleet-build-type-delete':
					document.getElementById('fleet-build-desc').innerText = fleetTranslate[this.id];
					break;
				default:
					// do nothing here
				}
			});
		});

		// Fleet counter
		document.getElementById('fleet-ship-build-count').addEventListener('keypress', function(event) {
			if (event.which !== KEYBOARD.BACKSPACE &&
					event.which !== KEYBOARD.NOKEY &&
					(event.which < KEYBOARD.DIGIT0 || event.which > KEYBOARD.DIGIT9) &&
					(event.which < KEYBOARD.NUMPAD0 || event.which > KEYBOARD.NUMPAD9)) {

				return false;
			}
		});

		document.getElementById('fleet-ship-build-count').addEventListener('input', function() {
			units.updateCount(parseInt(this.value));
		});

		document.getElementById('fleet-ship-build-fleetSelect').addEventListener('change', function() {
			let fleetSelect = document.getElementById('fleet-ship-build-fleetSelect');
			fleetSelect = fleetSelect.options[fleetSelect.selectedIndex].id;

			if(parseInt(fleetSelect) === -1) {
				units.drawNewFleetPanel();
			}
		});

		// Move
		document.getElementById('map-move-panel-move').addEventListener('click', function() {
			switch(units.moveType) {
			case 2:
				socket.emit('fleet-move', {
					id: userData.id,
					username: userData.username,
					fleetId: units.currFleet,
					destination: units.planetTarget,
				});
				ui.hide('#map-move-panel');
				break;
			default:
				ui.drawMessage(translate['messages']['DISABLED_FUNCTIONALIY']);
			}
		});
	}

	/**
	 * Gets the unit data.
	 *
	 * @param      {<type>}  id      Unit id
	 * @return     {Object}  The unit data.
	 */
	static getUnitData(id) {
		for(let i=0; i<units.list.length; i++) {
			if(units.list[i]._id === id) {
				return units.list[i];
			}
		}

		return {};
	}

	/**
	 * Gets the unit name.
	 *
	 * @param      {<type>}  id      Unit id
	 * @return     {string}  The unit name.
	 */
	static getUnitName(id) {
		const currUnit = units.getUnitData(id);

		if(currUnit.name !== undefined) {
			return currUnit.name;
		}

		return '';
	}

	/**
	 * Gets the fleet data.
	 *
	 * @param      {<type>}  id      Fleet id
	 * @return     {Object}  The fleet data.
	 */
	static getFleetData(id) {
		for(let i=0; i<units.fleetList.length; i++) {
			if(units.fleetList[i]._id === id) {
				return units.fleetList[i];
			}
		}

		return {};
	}

	/**
	 * Gets the fleet name.
	 *
	 * @param      {<type>}  id      Fleet id
	 * @return     {string}  The fleet name.
	 */
	static getFleetName(id) {
		let name = units.getFleetData(id).name;
		if(name === undefined) { name = ''; }
		if(name === 'SHIP_DEF') { return fleetTranslate[name]; }

		return name;
	}

	/**
	 * Draw mail UI
	 *
	 * @param      {string}  type    Unit type filter
	 */
	static drawMain(type='') {
		if(type === '') {
			type = units.lastType;
		} else {
			units.lastType = type;
		}

		// Sort
		const oldCurr = units.list[units.currUnit];
		units.list.sort(function(a,b) {
			const desc = units.sortTypes.split('-').length - 1;
			const sort = units.sortTypes.split('-')[0];

			let Na = a[sort];
			let Nb = b[sort];

			if(!Number.isInteger(Na)) {
				if(fleetTranslate[Na] !== undefined) {
					Na = fleetTranslate[Na];
				}
				if(fleetTranslate[Nb] !== undefined) {
					Nb = fleetTranslate[Nb];
				}

				Na = Na.toLowerCase();
				Nb = Nb.toLowerCase();
			} else {
				Na = a[sort];
				Nb = b[sort];
			}

			if(Na > Nb) {
				if(desc) {
					return -1;
				}
				return 1;
			}

			if(Na === Nb) {
				return 0;
			}

			if(desc) {
				return 1;
			}
			return -1;
		});

		for(let i=0; i<units.list; i++) {
			if(units.list[i]._id === oldCurr._id) {
				units.currUnit = i;
				break;
			}
		}

		let unitCount = 0;

		if(units.list.length !== 0) {
			ui.hide('#fleet-build-list-empty');

			let content = '';
			let active = true;
			for(let i=0; i<units.list.length; i++) {
				if(type === 'SHIP_ALL' || type === units.list[i].shipType) {
					if(active) {
						content+= '<tr id="'+ i +'" class="fleet-build-list-active">';
						active = false;
					} else {
						content+= '<tr id="'+ i +'">';
					}

					content += '<td>' + units.list[i].name + '</td><td>' + fleetTranslate[units.list[i].shipType] + '</td><td>' + fleetTranslate[units.list[i].shipShape] + '</td><td>' + units.list[i].note + '</td></tr>';
					unitCount++;
				}
			}

			let DOMElts = document.querySelectorAll('#fleet-build-list tbody');
			for(let i=0; i<DOMElts.length; i++) {
				DOMElts[i].innerHTML = content;
			}
			units.selectUnit();

			ui.show('#fleet-build-list','inline-block');

			ui.show('#fleet-build-stat');
			ui.show('#fleet-build-message');
			ui.show('#fleet-build-buttons');

			document.getElementById('fleet-build-message').innerHTML = '';

			// Time left
			if(units.unitPanelTimeout !== -1) {
				clearTimeout(units.unitPanelTimeout);
				units.unitPanelTimeout = -1;
			}

			if(planetData.unitBuildingEndTime > (Date.now() + planetUI.deltaNow)) { // An unit is building
				const dateNow = new Date();
				const dateEnd = new Date(planetData.unitBuildingEndTime + planetUI.deltaNow);
				const dateTom = new Date(Date.now() + TIME.DAY_TO_MS);

				if(dateNow.toLocaleDateString() === dateEnd.toLocaleDateString()) { // Same day
					document.getElementById('fleet-build-message').innerHTML = '<em>' + planetData.unitBuildingCount + '</em> ' + translate.messages['UNIT_CURR_BUILD_01'] +
						' <em>' +	units.getUnitName(planetData.unitBuildingID) + '</em> ' +
						translate.messages['UNIT_CURR_BUILD_02'] +
						' <em>' + units.getFleetName(planetData.unitBuildingFleetID) + '</em>. ' +
						translate.messages['BUILD_FINISH_TODAY_AT'] + ' <em>' + dateEnd.toLocaleTimeString() + '</em>';
				} else if(dateTom.toLocaleDateString() === dateEnd.toLocaleDateString()) { // Tomorrow
					document.getElementById('fleet-build-message').innerHTML = '<em>' + planetData.unitBuildingCount + '</em> ' + translate.messages['UNIT_CURR_BUILD_01'] +
						' <em>' +	units.getUnitName(planetData.unitBuildingID) + '</em> ' +
						translate.messages['UNIT_CURR_BUILD_02'] +
						' <em>' + units.getFleetName(planetData.unitBuildingFleetID) + '</em>. ' +
						translate.messages['BUILD_FINISH_TOMORROW_AT'] + ' <em>' + dateEnd.toLocaleTimeString() + '</em>';
				} else {
					document.getElementById('fleet-build-message').innerHTML = '<em>' + planetData.unitBuildingCount + '</em> ' + translate.messages['UNIT_CURR_BUILD_01'] +
						' <em>' +	units.getUnitName(planetData.unitBuildingID) + '</em> ' +
						translate.messages['UNIT_CURR_BUILD_02'] +
						' <em>' + units.getFleetName(planetData.unitBuildingFleetID) + '</em>. ' +
						translate.messages['BUILD_FINISH_THE'] + ' <em>' + dateEnd.toLocaleDateString() + '</em> ' + translate.messages['BUILD_FINISH_AT'] + ' <em>' + dateEnd.toLocaleTimeString() + '</em>';
				}

				if(dateNow.toLocaleDateString() !== dateEnd.toLocaleDateString()) {
					units.unitPanelTimeout = setTimeout(function() {
						units.drawMain();
					},(((TIME.DAY_TO_HOUR - dateNow.getHours())*TIME.HOUR_TO_MINUTES + (TIME.HOUR_TO_MINUTES - dateNow.getMinutes()))*TIME.MINUTES_TO_SECONDS + ((TIME.MINUTES_TO_SECONDS + TIME.SECOND_MARGIN) - dateNow.getSeconds()))*TIME.SECONDS_TO_MS); // Refresh at 00:00:05
				} else {
					units.unitPanelTimeout = setTimeout(function() {
						planetUI.sync();
					},(((dateEnd.getHours() - dateNow.getHours())*TIME.HOUR_TO_MINUTES + (dateEnd.getMinutes() - dateNow.getMinutes()))*TIME.MINUTES_TO_SECONDS + (dateEnd.getSeconds() + TIME.SECOND_MARGIN - dateNow.getSeconds()))*TIME.SECONDS_TO_MS); // Refresh 5 sec after end
				}
			}

			// Fleet Build
			DOMElts = document.querySelectorAll('#fleet-build-list tbody tr');
			for(let i=0; i<DOMElts.length; i++) {
				DOMElts[i].addEventListener('click', function() {
					if(preventFleetHUDClosing) { return; }

					ui.toggleClass('#fleet-build-list .fleet-build-list-active', 'fleet-build-list-active', this);

					// Select unit
					units.selectUnit(this.id);
				});
			}
		}

		// Check if we can create fleet
		let disabledButton = true;
		for(let i=0; i<unitTypes.length; i++) {
			for(const index in shipShapesDetails[unitTypes[i]]) {
				if(shipResearchDependencies[index] === undefined || research.isSearched(shipResearchDependencies[index])) {
					disabledButton = false;
					break;
				}
			}
			if(!disabledButton) { break; }
		}
		if(disabledButton) {
			ui.hide('#fleet-build-create');
		} else {
			ui.show('#fleet-build-create');
		}

		if(unitCount === 0) {
			ui.hide('#fleet-build-list');

			ui.hide('#fleet-build-stat');
			ui.hide('#fleet-build-message');
			ui.hide('#fleet-build-buttons');

			ui.show('#fleet-build-list-empty','inline-block');
		}
	}

	/**
	 * Draw the panel to create a new fleet
	 */
	static drawNewFleetPanel() {
		document.getElementById('fleet-newFleet-name').value = '';
		ui.show('#fleet-newFleet-panel');
		document.getElementById('fleet-newFleet-name').addEventListener('keypress', function(e) {
			if(e.which === KEYBOARD.ENTER) {
				units.validFleetName();
			}
		});
		preventUnitBuildPanelClose = true;
	}

	/**
	 * Check if a fleet exists by its name
	 *
	 * @param      {<type>}   fname   Fleet name
	 * @return     {boolean}  { description_of_the_return_value }
	 */
	static fleetExists(fname) {
		for(const i in units.fleetList) {
			if(units.fleetList[i].name === fname) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Check if a fleet name is valid
	 */
	static validFleetName() {
		const fname = document.getElementById('fleet-newFleet-name').value;

		if(fname === '') { return; }
		if(units.fleetExists(fname)) { return; }

		units.fname = fname;
		document.querySelector('#fleet-ship-build-fleetSelect option[id="-1"]').innerText = units.fname;
		ui.hide('#fleet-newFleet-panel');
		preventUnitBuildPanelClose = false;
	}

	/**
	 * Recalculate unit build cost
	 */
	static updateBuildCost() {
		const costs = [
			'fleet-ship-build-cost-aluminium-val',
			'fleet-ship-build-cost-iron-val',
			'fleet-ship-build-cost-titanium-val',
			'fleet-ship-build-cost-copper-val',
			'fleet-ship-build-cost-time-val',
			'fleet-ship-build-cost-population-val',
		];

		const currUnit = units.list[units.currUnit];
		let count = parseInt(document.getElementById('fleet-ship-build-count').value);

		if(document.getElementById('fleet-ship-build-count').value === '' || count < 1) { count = 1; }

		for(const i in costs) {
			if(currUnit.cost[i] === 0) {
				ui.hide('#' + costs[i].substring(0,costs[i].length-4));
				continue;
			}
			ui.show('#' + costs[i].substring(0,costs[i].length-4));

			if(costs[i] !== 'fleet-ship-build-cost-time-val') {
				document.getElementById(costs[i]).innerText = GetBetterUnit(Math.round(count * parseFloat(currUnit.cost[i])));
			} else {
				document.getElementById(costs[i]).innerText = getStringTime(count * parseFloat(currUnit.cost[i]) * (1 - buildLvlUnitBuildingSpeedBonus * planetData.Buildings[7]));
			}
		}
	}

	/**
	 * Gets the maximum ships can be build
	 *
	 * @return     {number}  The maximum ships.
	 */
	static getMaxShips() {
		const currUnit = units.list[units.currUnit];
		const transitionTable = [3,2,5,4];
		let max = Math.floor(planetData.resources[3] / currUnit.cost[0]); // 3 = transitionTable[0]

		for(let i=1; i<4; i++) {
			const currMax = Math.floor(planetData.resources[transitionTable[i]] / currUnit.cost[i]);
			if(currMax < max) {
				max = currMax;
			}
		}

		if(Math.floor(habProd/currUnit.cost[4]) < max) {
			max = Math.floor(habProd/currUnit.cost[4]);
		}

		return max;
	}

	/**
	 * Update event when unit build count changes
	 *
	 * @param      {number}  count   Unit count
	 */
	static updateCount(count) {
		const max = units.getMaxShips();
		if(count > max) {
			document.getElementById('fleet-ship-build-count').value = max;
		}

		units.updateBuildCost();
	}

	/**
	 * Regenerate the fleet list (select in unit build UI)
	 */
	static regenerateBuildFleetList() {
		units.fleetTimers = units.fleetTimers || [];
		for(let i=0; i<units.fleetTimers.length; i++) {
			clearTimeout(units.fleetTimers[i]);
		}
		units.fleetTimers = [];
		let u = 0;
		for(let i=0; i<units.fleetList.length; i++) {
			if(units.fleetList[i].endMoveTime > 0) {
				units.fleetTimers[u] = setTimeout(function() {
					units.sync();
				}, units.fleetList[i].endMoveTime-Date.now()+planetUI.deltaNow+ TIME.SECOND_MARGIN * TIME.SECONDS_TO_MS); // Wait 5 sec

				u++;
			}
		}

		// Fleet list
		document.getElementById('fleet-ship-build-fleetSelect').innerHTML = unitBuildSelectHeader;
		for(let i=0; i<units.fleetList.length; i++) {
			if(units.fleetList[i].name === 'SHIP_DEF' || units.fleetList[i].name === fleetTranslate['SHIP_DEF']) { continue; } // Def fleet
			if(units.fleetList[i].position !== planetData.address || units.fleetList[i].orbitPosition !== 0) { continue; } // Moving/Out fleets

			document.getElementById('fleet-ship-build-fleetSelect').innerHTML =
					document.getElementById('fleet-ship-build-fleetSelect').innerHTML + '<option id="' + i + '">' + units.fleetList[i].name + '</option>';
		}
		document.getElementById('fleet-ship-build-fleetSelect').innerHTML =
				document.getElementById('fleet-ship-build-fleetSelect').innerHTML + unitBuildSelectNew;
	}

	/**
	 * Draws the unit build panel
	 */
	static drawBuildPanel() {
		if(units.currUnit === -1 || units.list[units.currUnit] === undefined) { return; }
		ui.show('#fleet-ship-build-fleetSelect');

		units.fname = '';
		const currUnit = units.list[units.currUnit];

		// Name
		document.getElementById('fleet-ship-build-name').innerText = currUnit.name;

		// Costs
		units.updateBuildCost();

		// Count
		document.getElementById('fleet-ship-build-count').value = '';
		document.getElementById('fleet-ship-build-count').setAttribute('placeholder','Max: ' + units.getMaxShips());

		units.regenerateBuildFleetList();

		if(units.list[units.currUnit].shipType === 'SHIP_DEF') {
			ui.hide('#fleet-ship-build-fleetSelect');
		}

		document.getElementById('fleet-ship-build-count').addEventListener('keypress', function(e) {
			if(e.which === KEYBOARD.ENTER) {
				units.askUnitBuild();
			}
		});

		// Draw panel
		ui.show('#fleet-ship-build');
	}

	/**
	 * Ask to build an unit - Event on build button click
	 */
	static askUnitBuild() {
		const count = parseInt(document.getElementById('fleet-ship-build-count').value);
		let fleet = document.getElementById('fleet-ship-build-fleetSelect');
		fleet = parseInt(fleet.options[fleet.selectedIndex].id);

		if(Number.isNaN(fleet) || fleet === undefined || (fleet === -2 && units.list[units.currUnit].shipType !== 'SHIP_DEF')) { return; }
		if(Number.isNaN(count) || count === undefined || units.currUnit === -1) { return; }
		if(preventUnitBuildPanelClose) { return; }

		const unit = {
			id: userData.id,
			username: userData.username,
			planet: userData.pid,
			count: count,
			unit: units.list[units.currUnit]._id
		};

		if(fleet === -1) {
			unit.fleetName = units.fname;
			unit.fleet = -1;
		} else if(fleet === -2) {
			unit.fleet = -2;
		} else {
			unit.fleet = units.fleetList[fleet]._id;
		}

		socket.emit('unit-build', unit);
		ui.closeTab('#fleet-ship-build');

		preventFleetHUDClosing = false;
	}

	/**
	 * Draw the panel to create a new unit type
	 */
	static drawCreateTypePanel() {
		const unitsParts = [];
		let selectedType = '';
		let selectedShape = '';

		if(units.currUnit !== -1 && units.list[units.currUnit] !== undefined) {
			for(const i in units.list[units.currUnit].parts) {
				unitsParts[units.list[units.currUnit].parts[i].name] = units.list[units.currUnit].parts[i].tech;
			}

			selectedType = units.list[units.currUnit].shipType;
			selectedShape = units.list[units.currUnit].shipShape;
		}

		ui.hide('#fleet-type-create-cost div');

		document.getElementById('fleet-type-create-schematic').innerHTML = '';
		document.getElementById('fleet-type-create-selects').innerHTML = '';

		let selectContent = '';
		for(let i=0; i<unitTypes.length; i++) {
			let disabled = true;
			for(const index in shipShapesDetails[unitTypes[i]]) {
				if(shipResearchDependencies[index] === undefined || research.isSearched(shipResearchDependencies[index])) {
					disabled = false;
					break;
				}
			}
			if(disabled) { continue; }

			if(selectedType !== unitTypes[i]) {
				selectContent += '<option value="' + unitTypes[i] + '">' + fleetTranslate[unitTypes[i]] + '</option>';
			} else {
				selectContent += '<option value="' + unitTypes[i] + '" selected>' + fleetTranslate[unitTypes[i]] + '</option>';
			}
		}

		if(selectContent === '') { // No shape searched
			return;
		}
		selectContent = '<option disabled>' + fleetTranslate['SHIP_TYPE'] + '</option>' + selectContent;

		document.getElementById('fleet-type-create-shipType').innerHTML = selectContent;

		document.getElementById('fleet-type-create-shipShape').innerHTML = '<option disabled>' + fleetTranslate['SHIP_SHAPE'] + '</option>';

		units.changeShipType(unitsParts,selectedShape);

		preventFleetHUDClosing = true;

		ui.show('#fleet-type-create');
	}

	/**
	 * Re-draw unit creation UI when we change ship type
	 *
	 * @param      {<type>}  unitsParts     The units parts
	 * @param      {string}  selectedShape  The selected shape
	 */
	static changeShipType(unitsParts=[],selectedShape='') {
		let type = document.getElementById('fleet-type-create-shipType');
		type = type.options[type.selectedIndex].value;
		let shape = '';

		document.getElementById('fleet-type-create-name').value = '';

		let selectShipShape = '';
		for(const index in shipShapesDetails[type]) {
			if(shape === '') { shape = index; }
			if(shipResearchDependencies[index] !== undefined && !research.isSearched(shipResearchDependencies[index])) { continue; }
			if(index === selectedShape) {
				selectShipShape += '<option value="' + index + '" selected>' + fleetTranslate[index] + '</option>';
			} else {
				selectShipShape += '<option value="' + index + '">' + fleetTranslate[index] + '</option>';
			}
		}

		if(selectShipShape !== '') {
			selectShipShape = '<option disabled>' + fleetTranslate['SHIP_SHAPE'] + '</option>' + selectShipShape;

			ui.show('#fleet-type-create-shipType option[value='+type+']');

			document.getElementById('fleet-type-create-shipShape').innerHTML = selectShipShape;

			units.drawShipShape(shipShapesDetails[type][shape].svg,shipShapesDetails[type][shape].content,unitsParts);
			units.updateTypeCreateStats();
		} else {
			document.getElementById('fleet-type-create-shipType').value = document.querySelectorAll('#fleet-type-create-shipType option')[0].value;
			ui.hide('#fleet-type-create-shipType option[value='+type+']');
		}
	}

	/**
	 * Re-draw unit creation UI when we change ship shape
	 *
	 * @param      {<type>}  unitsParts     The units parts
	 * @param      {string}  selectedShape  The selected shape
	 */
	static changeShipShape() {
		let type = document.getElementById('fleet-type-create-shipType');
		type = type.options[type.selectedIndex].value;

		let shape = document.getElementById('fleet-type-create-shipShape');
		shape = shape.options[shape.selectedIndex].value;

		document.getElementById('fleet-type-create-name').value = '';

		units.drawShipShape(shipShapesDetails[type][shape].svg,shipShapesDetails[type][shape].content);
		units.updateTypeCreateStats();
	}

	/**
	 * Draw the svg ship shape (UI creation)
	 *
	 * @param      {(number|string)}  shape       The shape
	 * @param      {(number|string)}  content     The content
	 * @param      {<type>}           unitsParts  The units parts
	 */
	static drawShipShape(shape,content,unitsParts=[]) {
		document.getElementById('fleet-type-create-selects').innerHTML = '';
		let svgContent = '';
		const clickEvent = [];

		for(let i=0; i<shape.length; i++) {
			const id = i;

			// Draw shape
			switch(shape[i][1]) {
			case 'rect':
				svgContent += '<rect class="' + shape[i][0] + '" x="' + shape[i][2] + '" y="' + shape[i][3] + '" width="' + shape[i][4] + '" height="' + shape[i][5] + '"></rect>';
				break;
			case 'circle':
				svgContent += '<circle class="' + shape[i][0] + '" cx="' + shape[i][2] + '" cy="' + shape[i][3] + '" r="' + shape[i][4] + '"></circle>';
				break;
			case 'line':
				svgContent += '<line class="' + shape[i][0] + '" x1="' + shape[i][2] + '" y1="' + shape[i][3] + '" x2="' + shape[i][4] + '" y2="' + shape[i][5] + '"></line>';
				break;
			case 'path':
				svgContent += '<path class="' + shape[i][0] + '" d="';

				for(let j=2; j<shape[i].length; j++) {
					svgContent += shape[i][j] + ' ';
				}

				svgContent += '" ></path>';
				break;
			default: // Poly
				svgContent += '<polygon class="' + shape[i][0] + '" points="';

				for(let j=2; j<shape[i].length; j+=2) {
					svgContent += shape[i][j] + ',' + shape[i][j+1] + ' ';
				}

				svgContent += '" ></polygon>';
			}

			// Draw HTML
			if(shape[i][0] !== 'struct') {
				/* Hidden Select */
				let hiddenSelect = '<select id="part-selecting-hidden-' + i + '" partName="' + shape[i][6] + '" partType="' + shape[i][0] + '" style="display: none;">';
				for(let j=0; j<content[shape[i][0]].length; j++) {
					if(content[shape[i][0]][j] !== 'none' && shipResearchDependencies[content[shape[i][0]][j]] !== undefined && !research.isSearched(shipResearchDependencies[content[shape[i][0]][j]])) { continue; }
					if(unitsParts[shape[i][6]] !== undefined && unitsParts[shape[i][6]] === content[shape[i][0]][j]) {
						hiddenSelect += '<option value="' + content[shape[i][0]][j] + '" id="' + content[shape[i][0]][j] + '" selected>';
					} else {
						hiddenSelect += '<option value="' + content[shape[i][0]][j] + '" id="' + content[shape[i][0]][j] + '"></option>';
					}
				}
				hiddenSelect += '</select>';
				document.getElementById('fleet-type-create-selects').innerHTML += hiddenSelect;

				/* Seen Select */
				const source = document.getElementById('part-selecting-hidden-' + id);
				let selected = source.options[source.selectedIndex];
				if(!selected) {
					selected = source.options[0];
				}

				const selw = parseInt(window.getComputedStyle(document.getElementById('fleet-type-create-schematic')).width.slice(0, -2));
				const selh = parseInt(window.getComputedStyle(document.getElementById('fleet-type-create-schematic')).height.slice(0, -2));
				const w = shape[id][4]/800*selw - 12;
				const h = shape[id][5]/450*selh - 12;

				document.getElementById('fleet-type-create-selects').innerHTML +=
					'<dl id="part-selecting-seen-' + id + '" class="part-selecting dropdown" style="' +
						'left: ' + ((shape[id][2])/800)*selw + 'px;' +
						'top: ' + ((shape[id][3])/450)*selh + 'px;' +
						'width: ' + w + 'px;' +
						'height: ' + h + 'px;' +
					'"><dt>'+
					'<a href="#" value="' + selected.value + '" style="' +
						'background-image: url(\''+ cdnURL + 'img/units-modules/' + selected.value  + '.svg\'); ' +
						'background-size: 95%;' +
						'background-repeat: no-repeat;' +
						'background-position: left top;' +
						'display: block;' +
						'width: ' + w + 'px;' +
						'height: ' + h + 'px;' +
						'"></a></dt>' +
						'<dd><ul></ul></dd>' +
					'</dl>';

				for(let eltId=0; eltId<source.options.length; eltId++) {
					document.querySelector('#part-selecting-seen-' + id + ' dd ul').innerHTML += '<li><a href="#" value="' + source.options[eltId].id  + '"' +
						'style="background-image: url(\''+ cdnURL + 'img/units-modules/' + source.options[eltId].id + '.svg\');' +
						'background-size: 95%;background-repeat: no-repeat;background-position: left top;display: block;' +
						'width: ' + w + 'px;' +
						'height: ' + h + 'px;' +
						'"></a></li>';
				}

				clickEvent.push(id);
			}
		}
		document.getElementById('fleet-type-create-schematic').innerHTML = svgContent;


		// Click Events
		for(const i in clickEvent) {
			const id = clickEvent[i];

			document.querySelectorAll('#part-selecting-seen-' + id + ' dt a').forEach(function(elt) {
				elt.addEventListener('click', function() {
					document.querySelectorAll('#part-selecting-seen-' + id + ' dd ul').forEach(function(e) {
						if(e.style.display === 'none') {
							e.style.display = 'block';
						} else {
							e.style.display = 'none';
						}
					});
				});
			});

			document.addEventListener('click', function(e) {
				if(!ui.hasClass(e.target.parentNode.parentNode, 'dropdown')) {
					ui.hide('#part-selecting-seen-' + id + ' dd ul');
				}
			});

			document.querySelectorAll('#part-selecting-seen-' + id + ' dd ul li a').forEach(function(elt) {
				elt.addEventListener('click', function() {
					ui.hide('#part-selecting-seen-' + id + ' dd ul');

					const source = document.getElementById('part-selecting-hidden-' + id);

					if(source.getAttribute('parttype') === 'sub_propulsion' ||
						source.getAttribute('parttype') === 'sup_propulsion') {

						const selects = document.querySelectorAll('#fleet-type-create-selects select[parttype="' + source.getAttribute('parttype') +'"]');
						for(let currSelect=0; currSelect < selects.length; currSelect++) {
							selects[currSelect].value = this.getAttribute('value');

							for(let currStyle=0; currStyle<this.style.length; currStyle++) {
								document.querySelector('#' + selects[currSelect].id.split('hidden').join('seen') + ' dt a').style[this.style[currStyle]] = this.style[this.style[currStyle]];
							}
						}
					} else {
						source.value = this.getAttribute('value');

						for(let currSelect=0; currSelect<this.style.length; currSelect++) {
							document.querySelector('#part-selecting-seen-' + id + ' dt a').style[this.style[currSelect]] = this.style[this.style[currSelect]];
						}
					}

					units.updateTypeCreateStats();
				});
			});
		}
	}

	static updateTypeCreateStats() {
		let type = document.getElementById('fleet-type-create-shipType');
		type = type.options[type.selectedIndex].value;

		let shape = document.getElementById('fleet-type-create-shipShape');
		shape = shape.options[shape.selectedIndex].value;

		const partList = document.querySelectorAll('#fleet-type-create-selects select');

		const parts = [];

		for(let p=0; p<partList.length; p++) {
			parts.push({
				type: partList[p].getAttribute('parttype'),
				tech: partList[p].options[partList[p].selectedIndex].value,
			});
		}

		units.updateStats('fleet-type-create-stat', type, shape, parts);
	}

	/**
	 * Updates the statistics of current creating unit
	 *
	 * @param      {string}                          div     The div
	 * @param      {string}                          type    The type
	 * @param      {<type>}                          shape   The shape
	 * @param      {(Array|Function|number|string)}  parts   The parts
	 * @param      {(Function|number|string)}        note    The note
	 */
	static updateStats(div, type, shape, parts, note) {
		if(parts === undefined) { parts = []; } // Mines only

		const modules = {
			'sub_propulsion': 0,
			'sup_propulsion': 0,
			'hangar': 0,
		};

		let miss = 0; // @ADD: Calc miss

		// Hide some things if needed
		ui.show(div + ' div');

		for(let i=0; i<parts.length; i++) {
			if(parts[i].tech === 'none') { continue; }

			switch(parts[i].type) {
			case 'sub_propulsion':
				if(modules.sub_propulsion === 0) {
					modules.sub_propulsion = shipPartsSpeed[parts[i].tech][0]*10000 +
						shipPartsSpeed[parts[i].tech][1]*100 + shipPartsSpeed[parts[i].tech][2];
					modules.sub_propulsion = SYSTEM_AU_SIZE/(modules.sub_propulsion * 3600);
				} else {
					modules.sub_propulsion *= 1.5;
				}

				break;
			case 'sup_propulsion':
				if(modules.sup_propulsion === 0) {
					modules.sup_propulsion = shipPartsSpeed[parts[i].tech][0]*100 +
						shipPartsSpeed[parts[i].tech][1]*10 + shipPartsSpeed[parts[i].tech][2];
					modules.sup_propulsion = GALACTIC_PARSEC_SIZE/(modules.sup_propulsion * 3600);
				} else {
					modules.sup_propulsion *= 1.5;
				}
				break;
			case 'hangar':
				modules.hangar += hangarSize[parts[i].tech];
				miss -= hangarMiss[parts[i].tech];
				break;
			default:
				// Do nothing
			}
		}

		modules.sub_propulsion = modules.sub_propulsion.toFixed(3);
		modules.sup_propulsion = modules.sup_propulsion.toFixed(3);

		if(parseFloat(modules.sub_propulsion) === 0) {
			ui.hide('#' + div + '-subspeed');
		} else {
			ui.show('#' + div + '-subspeed');
			document.getElementById(div + '-subspeed-val').innerText = modules.sub_propulsion + 'au/s';
		}

		if(parseFloat(modules.sup_propulsion) === 0) {
			ui.hide('#' + div + '-supspeed');
		} else {
			ui.show('#' + div + '-supspeed');
			document.getElementById(div + '-supspeed-val').innerText = modules.sup_propulsion + 'pc/s';
		}

		if(parseFloat(modules.sup_propulsion) === 0 && parseFloat(modules.sub_propulsion) === 0) {
			ui.hide('#' + div + '-speed');
		} else {
			ui.show('#' + div + '-speed');
		}

		if(type !== 'SHIP_CARRIER') {
			ui.hide('#' + div + '-fcap');
		} else {
			ui.show('#' + div + '-fcap');
			document.getElementById(div + '-fcap-val').innerText = modules.hangar;
		}

		// Calcul des données si données
		if(note === undefined) {
			note = 'X.X'; // @ADD: Calc note
		}

		// Note
		document.getElementById(div + '-note-val').innerText = note;

		// Miss chance
		document.getElementById(div + '-miss-val').innerText = miss + '%';
	}

	/**
	 * Changes current selected unit (in unit type list)
	 *
	 * @param      {string}  id      The identifier
	 */
	static selectUnit(id) {
		units.currUnit = id = (id === undefined)?0:id;
		if(units.list[id] === undefined) { return; }

		document.getElementById('fleet-build-name').innerHTML = units.list[id].name;

		units.updateStats('fleet-build-stat', units.list[id].shipType, units.list[id].shipShape, units.list[id].parts, units.list[id].note);

		// Weapons
		let armesText = '';
		if(units.list[id].shipShape.substr(0,'SHIP_WEP_MINES'.length) !== 'SHIP_WEP_MINES') {
			const armes = {};
			for(let i=0; i<units.list[id].parts.length; i++) {
				if(units.list[id].parts[i].type !== 'cannon' && units.list[id].parts[i].type !== 'rocketLauncher') { continue; }
				if(units.list[id].parts[i].tech === 'none') { continue; }
				if(armes[units.list[id].parts[i].tech] === undefined) {
					armes[units.list[id].parts[i].tech] = 1;
				} else {
					armes[units.list[id].parts[i].tech]++;
				}
			}
			for(const i in armes) {
				if(armesText !== '') { armesText += ', '; }
				let translation = fleetTranslate[i];
				if(translation === undefined) {
					translation = fleetTranslate['missile_' + i];
				}
				armesText += armes[i] + 'x ' + translation;
			}
		}
		if(armesText !== '') {
			document.getElementById('fleet-build-stat-attack-val').innerText = armesText;
		} else {
			ui.hide('#fleet-build-stat-attack');
		}

		// Shields
		let shieldText = '';
		if(units.list[id].shipShape.substr(0,'SHIP_WEP_MINES'.length) !== 'SHIP_WEP_MINES') {
			const shields = {};
			for(let i=0; i<units.list[id].parts.length; i++) {
				if(units.list[id].parts[i].type !== 'shield') { continue; }
				if(units.list[id].parts[i].tech === 'none') { continue; }
				if(shields[units.list[id].parts[i].tech] === undefined) {
					shields[units.list[id].parts[i].tech] = 1;
				} else {
					shields[units.list[id].parts[i].tech]++;
				}
			}
			for(const i in shields) {
				if(shieldText !== '') { shieldText += ', '; }
				shieldText += shields[i] + 'x ' + fleetTranslate[i];
			}
		}
		if(shieldText !== '') {
			document.getElementById('fleet-build-stat-shield-val').innerText = shieldText;
		} else {
			ui.hide('#fleet-build-stat-shield');
		}

		// Boutons
		if(units.list[id].shipShape.substr(0,'SHIP_WEP_MINES'.length) === 'SHIP_WEP_MINES') {
			ui.hide('#fleet-build-type-copy');
			ui.hide('#fleet-build-type-delete');
			ui.hide('#fleet-build-rename');
		} else {
			ui.show('#fleet-build-type-copy', 'inline-block');
			ui.show('#fleet-build-type-delete', 'inline-block');
			ui.show('#fleet-build-rename', 'inline-block');
		}
	}

	/**
	 * Creates a new type
	 */
	static createNewType() {
		let errors = 0;
		let errorMessage = '';

		let shipType = document.getElementById('fleet-type-create-shipType');
		shipType = shipType.options[shipType.selectedIndex].value;

		let shipShape = document.getElementById('fleet-type-create-shipShape');
		shipShape = shipShape.options[shipShape.selectedIndex].value;

		const ship = {
			name: document.getElementById('fleet-type-create-name').value,
			type: shipType,
			shape: shipShape
		};

		/* Checks ... */
		if(ship.name.split(' ').join('') === '') {
			errors ++;
			errorMessage = 'SHIP_HAS_NO_NAME';
		}

		/* Get All parts */
		const parts = document.querySelectorAll('#fleet-type-create-selects select');
		for(let i=0; i<parts.length; i++) {
			const name = parts[i].getAttribute('partName');
			const type = parts[i].getAttribute('partType');
			const value = parts[i].value;

			if(value === undefined || value.split(' ').join('') === '') {
				errors++;
				errorMessage = 'SHIP_HAS_EMPTY_FIELD';
				break;
			}

			if(type === undefined || type.split(' ').join('') === '') {
				errors++;
				errorMessage = 'SHIP_HAS_INVALID_PARTS';
				break;
			}

			ship[name] = {value: value, type: type};
		}

		if(errors === 0) {
			ui.closeTab('#fleet-type-create',false);
			preventFleetHUDClosing = false;
			socket.emit('unit-type-create', { id: userData.id, username: userData.username, ship: ship });
		} else {
			ui.drawMessage(errorMessage);
		}
	}

	static countFleetCount(fleet) {
		let totalcount = 0;
		let fighterCount = 0;
		let fighterCap = 0;
		for(let j=0; j<fleet.units.length; j++) {
			totalcount += fleet.units[j][1];

			const currUnit = units.getUnitData(fleet.units[j][0]);
			if(currUnit.shipType === 'SHIP_FIGHTER') {
				fighterCount += (fighterWeight[currUnit.shipShape] * fleet.units[j][1]);
			} else if(currUnit.shipType === 'SHIP_CARRIER') {
				for(const p in currUnit.parts) {
					if(currUnit.parts[p].type === 'hangar') {
						fighterCap += (hangarSize[currUnit.parts[p].tech] * fleet.units[j][1]);
					}
				}
			}
		}

		return { totalcount, fighterCount, fighterCap };
	}

	static getFleetSpoilerDOM(fleet, type) {
		const counts = units.countFleetCount(fleet);

		let content = '<details class="fleet-show-global">' +
			'<summary id="' + fleet.id + '" class="fleet-show-name"><table class="fleet-show-table">' +
			// Nom flotte
			'<tr><td>' + fleet.name +
			'<img class="fleet-rename" alt="rename fleet" src="./cdn/img/ui/rename.svg" style="display: inline-block;">' +
			'</td>';

		// Fuel
		if(fleet.maxFuel > 0) {
			content += '<td class="text-center"><img class="fleet-show-fuel" src="./cdn/img/ui/fuel.svg"> ' + GetBetterUnit(fleet.fuel, '', -1, true) + '/' + GetBetterUnit(fleet.maxFuel) +
			'(~' + Math.round(100*fleet.fuel/fleet.maxFuel) + '%)</td>';
		} else {
			content += '<td></td>';
		}

		// Nb unités
		content += '<td class="text-right">' + counts.totalcount + ' ' + fleetTranslate['unit'] + '</td>';

		// Seconde ligne
		content += '</tr><tr>';

		// Hangar
		if(counts.fighterCount !== 0 || counts.fighterCap !== 0) {
			content += '<td>' + fleetTranslate['hangar'] + ': ' + counts.fighterCount + '/' + counts.fighterCap + '</td>';
		} else {
			content += '<td>&nbsp;</td>'; // Non-breaking space is here to force line height
		}

		// Prorité
		if(type === 'orbit' && fleet.maxFuel > 0 && planetData.highPriorityFleet === fleet._id) {
			content += '<td class="text-center"><span style="color: #0ec6c6;">✔</span>' + fleetTranslate['priorty-fuel'] + '</td>';
		} else if(type === 'orbit' && fleet.maxFuel > 0) {
			content += '<td class="text-center priority-fleet" id="' + fleet._id + '"><span style="color: #0ec6c6;">✖</span>' + fleetTranslate['no-priorty-fuel'] + '</td>';
		} else if(type === 'out') {
			content += '<td class="text-center">' + fleetTranslate['orbiting'] + ' ' + fleet.position + '</td>'; // @TODO: pname (username) instead of position
		}

		content +='</tr></table></summary>' +
			'<table class="unit-list-table">' + fleetListHeader + '<tbody>';

		for(let allUnitsId=0; allUnitsId<units.list.length; allUnitsId++) {
			let count = -1;
			for(let fleetUnitId=0; fleetUnitId<fleet.units.length; fleetUnitId++) {
				if(fleet.units[fleetUnitId][0] === units.list[allUnitsId]._id) {
					count = fleet.units[fleetUnitId][1];
					break;
				}
			}
			if(count < 0) { continue; }

			content +=  '<tr id="'+ units.list[allUnitsId]._id +'" class="table-line">' +
							'<td>' + units.list[allUnitsId].name + '</td>' +
							'<td>' + fleetTranslate[units.list[allUnitsId].shipType] + '</td>' +
							'<td>' + fleetTranslate[units.list[allUnitsId].shipShape] + '</td>' +
							'<td>' + count + '</td>';


			// Buttons
			content += '<td>';

			if(fleet.name !== 'SHIP_DEF' && fleet.name !== fleetTranslate['SHIP_DEF']) {
				content += '<img class="fleet-show-transferUnits" title="' + fleetTranslate['transferUnits'] + '" src="./cdn/img/ui/unit-transfer.svg">';
			}

			if(type === 'orbit') {
				content += '<img class="fleet-show-upgrade" title="' + fleetTranslate['upgrade'] + '" src="./cdn/img/ui/unit-upgrade.svg">' +
						'<img class="fleet-show-recycle" title="' + fleetTranslate['recycle'] + '" src="./cdn/img/ui/unit-recycle.svg">';
			}

			content += '</td></tr>';
		}

		let disableCSS = '';
		if(fleet.name === 'SHIP_DEF' || fleet.name === fleetTranslate['SHIP_DEF']) {
			disableCSS = ' style="opacity: 0;" disabled';
		}

		content += '</tbody></table><div class="fleet-show-buttonPanel">' +
			'<input type="button" class="fleet-show-button ui-medium-button fleet-show-mergeInto" value="' + fleetTranslate['mergeInto'] + '" ' + disableCSS + '>' +
			'<input type="button" class="fleet-show-button ui-medium-button fleet-show-mergeFrom" value="' + fleetTranslate['mergeFrom'] + '" ' + disableCSS + '>' +
			'<input type="button" class="fleet-show-button ui-medium-button fleet-show-editAI" value="' + fleetTranslate['editAI'] + '">' +
			'</div></details>';

		return content;
	}

	/**
	 * (Re)draw the fleets lists
	 */
	static drawFleetLists() {
		console.log('drawFleetLists');
		if(planetData.address === undefined) {
			setTimeout(function() {
				units.drawFleetLists();
			}, 500);

			return;
		}

		let orbitDOM = '';
		let movingDOM = '';
		let outDOM = '';

		for(let i=0; i<units.fleetList.length; i++) {
			if(units.fleetList[i].name === 'SHIP_DEF') { units.fleetList[i].name = fleetTranslate[units.fleetList[i].name]; }

			if(units.fleetList[i].position === planetData.address && units.fleetList[i].endMoveTime === -1) {

				if(units.fleetList[i].name === fleetTranslate['SHIP_DEF']) { // Defence fleet always first
					orbitDOM = units.getFleetSpoilerDOM(units.fleetList[i], 'orbit') + orbitDOM;
				} else {
					orbitDOM += units.getFleetSpoilerDOM(units.fleetList[i], 'orbit');
				}

			} else if(units.fleetList[i].endMoveTime !== -1) {
				movingDOM += units.getFleetSpoilerDOM(units.fleetList[i], 'moving');
			} else {
				outDOM += units.getFleetSpoilerDOM(units.fleetList[i], 'out');
			}
		}

		// On orbit
		if(orbitDOM === '') {
			orbitDOM = '<h2>' + fleetTranslate['no-orbit-unit'] + '</h2>';
		}
		document.getElementById('fleet-orbit-content').innerHTML = orbitDOM;

		// Moving
		if(movingDOM === '') {
			movingDOM = '<h2>' + fleetTranslate['no-orbit-unit'] + '</h2>';
		}
		document.getElementById('fleet-move-content').innerHTML = movingDOM;

		// Out
		if(outDOM === '') {
			outDOM = '<h2>' + fleetTranslate['no-orbit-unit'] + '</h2>';
		}
		document.getElementById('fleet-out-content').innerHTML = outDOM;

		const priorityElts = document.getElementsByClassName('priority-fleet');
		for(let i=0; i<priorityElts.length; i++) {
			priorityElts[i].addEventListener('click', function(e) {
				e.preventDefault();
				socket.emit('fleet-set-priority', {
					id: userData.id,
					username: userData.username,
					fleet: this.id,
					planet: planetData.address,
				});
			});
		}
	}

	/**
	 * Calculates the time and fuel of a movement
	 *
	 * @param      {<type>}  fleet   The fleet
	 * @return     {Object}  The time and fuel.
	 */
	static calcTimeAndFuel(fleet) {
		const now = Date.now();

		let systemeDepart = fleet.position.split('-');
		systemeDepart.pop();
		systemeDepart = systemeDepart.join('-');

		let systemeArrivee = units.planetTarget.split('-');
		systemeArrivee.pop();
		systemeArrivee = systemeArrivee.join('-');

		const planeteArrivee = map.planetData[systemeArrivee][units.planetTarget];

		let time;
		let minSpeed;
		if(systemeDepart === systemeArrivee) {
			const planeteDepart = map.planetData[systemeDepart][fleet.position];

			const unitList = [];
			for(let i=0; i<fleet.units.length; i++) {
				unitList[i] = units.getUnitData(fleet.units[i][0]);
			}

			minSpeed = Fleet.getMinSubSpeed(unitList, fleet.units);

			const baseDist = GameMap.getPlanetDistance(
				planeteDepart,
				planeteArrivee,
				now/TIME.SECONDS_TO_MS);
			if(Number.isNaN(baseDist) || baseDist < 0) { return; }
			const baseTravelTime = Fleet.calcMoveTime(baseDist, minSpeed.speed);

			const previewDist = GameMap.getPlanetDistance(
				planeteDepart,
				planeteArrivee,
				now/TIME.SECONDS_TO_MS + Math.round(baseTravelTime*360000)/100);
			if(Number.isNaN(previewDist) || previewDist < 0) { return; }
			const previewTime = Fleet.calcMoveTime(previewDist, minSpeed.speed);

			/* Final travel time:
				Average of ...
				 Time to travel to planet where it's now
				and
				 Time to travel to planet where it'll be when we arrive to this previous position
			*/
			time = (baseTravelTime + previewTime)/2;
		} else {
			let sector = fleet.position.split('-');
			sector = [sector[0],sector[1]].join('-');
			systemeDepart = map.xmlDoc[sector].querySelector('sy[id="' + systemeDepart + '"]');

			const unitList = [];
			const unitIdList = units.list.map((unit) => unit._id);
			for(const i in fleet.units) {
				const currUnitId = unitIdList.indexOf(fleet.units[i][0]);
				unitList.push(units.list[currUnitId]);
			}

			minSpeed = Fleet.getMinSupraSpeed(unitList, fleet.units);

			const dist = Math.sqrt(
				Math.pow(systemeDepart.getAttribute('x') - planeteArrivee.galacticPos[0],2) +
				Math.pow(systemeDepart.getAttribute('y') - planeteArrivee.galacticPos[1],2)
			);

			time = Fleet.calcMoveTime(dist, minSpeed.speed);
		}

		const fuel = [Fleet.calcFuelCost(minSpeed.engines) * time, fleet.fuel];

		return { time, fuel };
	}

	/**
	 * Opens the panel used to move fleet
	 *
	 * @param      {<type>}  moveType  The move type
	 */
	static openMovePanel(moveType) {
		let system = units.planetTarget.split('-');
		system.pop();
		system = system.join('-');

		units.moveType = moveType;

		// Fleet list
		let fleetListDOM = '';
		for(let i=0; i<units.fleetList.length; i++) {
			if(units.fleetList[i].name === 'SHIP_DEF' || units.fleetList[i].name === fleetTranslate['SHIP_DEF']) { continue; }
			if(units.fleetList[i].endMoveTime > 0) { continue; }
			if(units.fleetList[i].position === units.planetTarget) { continue; }

			const mt = units.calcTimeAndFuel(units.fleetList[i]);
			units.fleetTimes[units.fleetList[i]._id] = mt.time;
			units.fleetFuel[units.fleetList[i]._id] = mt.fuel;

			fleetListDOM += '<li id="' + units.fleetList[i]._id + '"';
			if(i === 0) {
				fleetListDOM += ' class="map-move-panel-list-active"';
			}
			fleetListDOM += ' >';

			if(units.fleetFuel[units.fleetList[i]._id][1] >= 2*units.fleetFuel[units.fleetList[i]._id][0]) {
				fleetListDOM += '<img src="' + cdnURL + 'img/ui/fuel-status-2.svg">';
			} else if(units.fleetFuel[units.fleetList[i]._id][1] >= units.fleetFuel[units.fleetList[i]._id][0]) {
				fleetListDOM += '<img src="' + cdnURL + 'img/ui/fuel-status-1.svg">';
			} else {
				fleetListDOM += '<img src="' + cdnURL + 'img/ui/fuel-status-0.svg">';
			}

			fleetListDOM += units.fleetList[i].name + '</li>';
		}
		document.getElementById('map-move-panel-list-ul').innerHTML = fleetListDOM;

		if(document.querySelector('.map-move-panel-list-active')) {
			units.currFleet = document.querySelector('.map-move-panel-list-active').id;
		} else {
			units.currFleet = -1;
		}

		document.querySelectorAll('#map-move-panel-list ul li').forEach(function(elt) {
			elt.addEventListener('click', function() {
				ui.toggleClass('.map-move-panel-list-active', 'map-move-panel-list-active', this);

				units.currFleet = this.id;

				units.updateMovePanel();
			});
		});

		units.updateMovePanel();

		// Destination
		const msgPt1 = translate['messages']['movePanelPt1'][moveType];

		if(map.planetData[system][units.planetTarget].ownerName !== null) {
			document.getElementById('map-move-panel-message').innerHTML =
				msgPt1 + ' <em>' +
				map.planetData[system][units.planetTarget].name + '</em> (<em>' +
				map.planetData[system][units.planetTarget].ownerName + '</em>)'
			;
		} else {
			document.getElementById('map-move-panel-message').innerHTML =
				msgPt1 + ' <em>' +
				units.planetTarget + '</em> (<em>' +
				'Aucun joueur' + '</em>)'
			;
		}

		// Display panel
		ui.show('#map-move-panel');
	}

	/**
	 * Update the fleet move panel
	 */
	static updateMovePanel() {
		const currentFleet = units.getFleetData(units.currFleet);

		let fighterCount = 0;
		let fighterCap = 0;
		if(currentFleet.units) {
			for(let j=0; j<currentFleet.units.length; j++) {
				const currUnit = units.getUnitData(currentFleet.units[j][0]);
				if(currUnit.shipType === 'SHIP_FIGHTER') {
					fighterCount += (fighterWeight[currUnit.shipShape] * currentFleet.units[j][1]);
				} else if(currUnit.shipType === 'SHIP_CARRIER') {
					for(const p in currUnit.parts) {
						if(currUnit.parts[p].type === 'hangar') {
							fighterCap += (hangarSize[currUnit.parts[p].tech] * currentFleet.units[j][1]);
						}
					}
				}
			}
		}

		// Time
		const time = (units.fleetTimes[units.currFleet]) ? getStringTime(units.fleetTimes[units.currFleet]) : '??:??:??';
		document.getElementById('map-move-panel-time').innerText = time;

		// Fuel
		let fFuel = [0,0];
		let ratio = '?';
		if(units.fleetFuel[units.currFleet]) {
			fFuel = units.fleetFuel[units.currFleet];
			ratio = Math.round(fFuel[0]/fFuel[1]*100);
		}
		if(Number.isNaN(ratio)) { ratio = '?'; fFuel = [0,0]; }
		document.getElementById('map-move-panel-fuel').innerHTML =
			GetBetterUnit(fFuel[0], 't', fFuel[1] + 1) +
			' (' + ratio + '% du reservoir)';

		// Hangar
		document.getElementById('map-move-panel-hangar').style.color = 'white';
		document.getElementById('map-move-panel-hangar').innerText = fighterCount + '/' + fighterCap;
		if(fighterCount > fighterCap) {
			document.getElementById('map-move-panel-hangar').style.color = 'red';
		}
	}
}