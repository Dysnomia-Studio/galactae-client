let preventFleetHUDClosing = false;
let preventUnitBuildPanelClose = false;

class units {
	/**
	 * Ask units from server
	 */
	static sync() {
		const data = userData;
		data.planet = planetData.id;
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
			if(units.list[i].id.substr(0, 'SHIP_WEP_MINES'.length) === 'SHIP_WEP_MINES') {
				units.list.splice(i, 1);
				i--;
			}
		}

		// Research depending unit type
		const researchUnitsTypes = ['SHIP_WEP_MINES', 'SHIP_WEP_MINES_IEM', 'SHIP_WEP_MINES_NUKE'];
		for(const unitType of researchUnitsTypes) {
			if(research.isSearched(shipResearchDependencies[unitType])) {
				units.list.push({
					id: unitType,
					name: fleetTranslate[unitType],
					note: 0, // @ADD: Note
					cost: shipCosts[unitType],
					shipShape: unitType,
					shipType: 'SHIP_DEF',
				});
			}
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
		tactics.drawList();
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

		// Fleet Menu
		document.querySelectorAll('.fleet-ul1 li').forEach(function(elt) {
			elt.addEventListener('click', function() {
				if(preventFleetHUDClosing) { return; }

				ui.toggleClass('.fleet-ul1 .ul-choice-line-li-active', 'ul-choice-line-li-active', this);

				const buttonList = [
					'fleet-build',
					'fleet-orbit',
					'fleet-move',
					'fleet-out',
					'fleet-tactics',
				];

				for(const buttonName of buttonList) {
					if(this.id === buttonName + '-button') {
						ui.show('#' + buttonName);
					} else {
						ui.hide('#' + buttonName);
					}
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

		units.unitTypePanelEvents();

		units.fleetBuildEvents();

		units.fleetListEvents();

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

	static unitTypePanelEvents() {
		document.getElementById('fleet-type-create-form').addEventListener('submit', function(e) {
			e.preventDefault();
			units.createNewType();
		});

		document.getElementById('fleet-type-create-close').addEventListener('click', function() {
			preventFleetHUDClosing = false;
			ui.closeTab('#fleet-type-create');
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

			ui.confirm(
				fleetTranslate['fleet-build-type-delete-confirmMessage'],
				translate['ui']['CONFIRM_YES'],
				translate['ui']['CONFIRM_NO'],

				() => { // Yes
					socket.emit('unit-type-delete', {
						id: userData.id,
						username: userData.username,
						unit: units.list[units.currUnit].id
					});
					preventFleetHUDClosing = false;

				}, () => { // No
					preventFleetHUDClosing = false;
				}
			);

			preventFleetHUDClosing = true;
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
				shipId: units.list[units.currUnit].id,
				shipNewName: document.getElementById('fleet-type-rename-newName').value
			});
			ui.hide('#fleet-type-rename');
			preventFleetHUDClosing = false;
		});
		document.getElementById('fleet-type-rename-close').addEventListener('click', function() {
			ui.hide('#fleet-type-rename');
			preventFleetHUDClosing = false;
		});
	}

	static fleetBuildEvents() {
		document.getElementById('fleet-build-openPanel').addEventListener('click', function() {
			if(preventFleetHUDClosing) { return; }

			preventFleetHUDClosing = true;
			units.drawBuildPanel();
		});
		document.getElementById('fleet-newFleet-submit').addEventListener('click', function() {
			units.validFleetName();
		});

		document.getElementById('fleet-newFleet-panel-close').addEventListener('click', function() {
			ui.hide('#fleet-newFleet-panel');
			preventUnitBuildPanelClose = false;
			units.regenerateSelectFleetLists();
		});

		document.getElementById('fleet-ship-build-upgrade').addEventListener('click', function() {
			units.askUnitBuild();
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

		document.getElementById('fleet-ship-build-close').addEventListener('click', function() {
			if(preventUnitBuildPanelClose) { return; }
			preventFleetHUDClosing = false;
			ui.closeTab('#fleet-ship-build');
		});
	}

	static fleetListEvents() {
		document.getElementById('fleet-rename-submit').addEventListener('click', function() {
			if(document.getElementById('fleet-rename-newName').value === '') { return; }

			socket.emit('fleet-rename', {
				id: userData.id,
				username: userData.username,
				fleetId: document.getElementById('fleet-rename').getAttribute('fleetId'),
				fleetNewName: document.getElementById('fleet-rename-newName').value
			});
			ui.hide('#fleet-rename');
			preventFleetHUDClosing = false;
		});
		document.getElementById('fleet-rename-close').addEventListener('click', function() {
			ui.hide('#fleet-rename');
			preventFleetHUDClosing = false;
		});

		document.getElementById('fleet-merge-submit').addEventListener('click', function() {
			if(document.getElementById('fleet-merge-fleetSelect').selectedIndex === '-2') { return; }

			let fleet = document.getElementById('fleet-merge-fleetSelect');
			fleet = parseInt(fleet.options[fleet.selectedIndex].id);
			fleet = units.fleetList[fleet];

			socket.emit('fleet-merge', {
				id: userData.id,
				username: userData.username,
				from: units.currFleet,
				to: fleet,
			});
			ui.hide('#fleet-merge-panel');
			preventFleetHUDClosing = false;
		});
		document.getElementById('fleet-merge-panel-close').addEventListener('click', function() {
			ui.hide('#fleet-merge-panel');
			preventFleetHUDClosing = false;
		});

		document.getElementById('fleet-units-transfer-submit').addEventListener('click', function() {
			const count = parseInt(document.getElementById('fleet-units-transfer-unitCount').value);

			if(document.getElementById('fleet-units-transfer-fleetSelect').selectedIndex === '-2') { return; }
			if(Number.isNaN(count) || count <= 0) { return; } // TODO: check max

			let fleet = document.getElementById('fleet-units-transfer-fleetSelect');
			fleet = parseInt(fleet.options[fleet.selectedIndex].id);
			fleet = units.fleetList[fleet];

			socket.emit('fleet-units-transfer', {
				id: userData.id,
				username: userData.username,
				from: units.currFleet,
				to: fleet,
				unitId: units.currTransferUnit,
				unitCount: count,
			});
			ui.hide('#fleet-units-transfer-panel');
			preventFleetHUDClosing = false;
		});
		document.getElementById('fleet-units-transfer-close').addEventListener('click', function() {
			ui.hide('#fleet-units-transfer-panel');
			preventFleetHUDClosing = false;
		});

		document.getElementById('fleet-transferFuel-submit').addEventListener('click', function() {
			const count = parseInt(document.getElementById('fleet-transferFuel-fuelCount').value);

			if(document.getElementById('fleet-transferFuel-fleetSelect').selectedIndex === '-2') { return; }
			if(Number.isNaN(count) || count <= 0) { return; } // TODO: check max

			let fleet = document.getElementById('fleet-transferFuel-fleetSelect');
			fleet = parseInt(fleet.options[fleet.selectedIndex].id);
			fleet = units.fleetList[fleet];

			socket.emit('fleet-transferFuel', {
				id: userData.id,
				username: userData.username,
				from: units.currFleet,
				to: fleet,
				fuelCount: count,
			});
			ui.hide('#fleet-transferFuel-panel');
			preventFleetHUDClosing = false;
		});
		document.getElementById('fleet-transferFuel-close').addEventListener('click', function() {
			ui.hide('#fleet-transferFuel-panel');
			preventFleetHUDClosing = false;
		});

		document.getElementById('fleet-assignTactic-submit').addEventListener('click', function() {
			const select = document.getElementById('fleet-assignTactic-tacticSelect');
			let currTactic = select.options[select.selectedIndex].id;

			if(currTactic === '-2') { return; }

			if(!currTactic || currTactic === '-1') {
				currTactic = '-1';
			} else {
				currTactic = tactics.tacticList[currTactic].id;
			}

			socket.emit('fleet-tactics-assign', {
				id: userData.id,
				username: userData.username,
				pid: planetData.id,
				fleetId: units.currFleet,
				tacticId: currTactic,
			});

			ui.hide('#fleet-assignTactic-panel');
			preventFleetHUDClosing = false;
		});
		document.getElementById('fleet-assignTactic-panel-close').addEventListener('click', function() {
			ui.hide('#fleet-assignTactic-panel');
			preventFleetHUDClosing = false;
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
			if(units.list[i].id === id) {
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
			if(units.fleetList[i].id === id) {
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

	static sortUnits(a, b) {
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
	}

	static drawCurrentInBuildingUnitMessage() {
		if(planetData.unitBuildingEndTime > (Date.now() + planetUI.deltaNow)) { // An unit is building
			const dateNow = new Date();
			const dateEnd = new Date(parseInt(planetData.unitBuildingEndTime) + planetUI.deltaNow);
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
		units.list.sort(units.sortUnits);

		for(let i=0; i<units.list; i++) {
			if(units.list[i].id === oldCurr.id) {
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

			document.getElementById('fleet-build-list-tbody').innerHTML = content;
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

			units.drawCurrentInBuildingUnitMessage();

			// Fleet Build
			const DOMElts = document.querySelectorAll('#fleet-build-list tbody tr');
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
	static regenerateSelectFleetLists() {
		units.fleetTimers = units.fleetTimers || [];
		for(let i=0; i<units.fleetTimers.length; i++) {
			clearTimeout(units.fleetTimers[i]);
		}
		units.fleetTimers = [];
		let u = 0;
		for(let i=0; i<units.fleetList.length; i++) {
			units.fleetList[i].endMoveTime = parseInt(units.fleetList[i].endMoveTime);
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
			if(units.fleetList[i].name === fleetTranslate['SHIP_DEF']) { continue; } // Def fleet
			if(units.fleetList[i].position !== planetData.address || units.fleetList[i].orbitPosition !== 0) { continue; } // Moving/Out fleets

			document.getElementById('fleet-ship-build-fleetSelect').innerHTML =
					document.getElementById('fleet-ship-build-fleetSelect').innerHTML + '<option id="' + i + '">' + units.fleetList[i].name + '</option>';
		}

		document.getElementById('fleet-merge-fleetSelect').innerHTML = document.getElementById('fleet-ship-build-fleetSelect').innerHTML;
		document.getElementById('fleet-units-transfer-fleetSelect').innerHTML = document.getElementById('fleet-ship-build-fleetSelect').innerHTML;
		document.getElementById('fleet-transferFuel-fleetSelect').innerHTML = document.getElementById('fleet-ship-build-fleetSelect').innerHTML;

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

		units.regenerateSelectFleetLists();

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
			unit: units.list[units.currUnit].id
		};

		if(fleet === -1) {
			unit.fleetName = units.fname;
			unit.fleet = -1;
		} else if(fleet === -2) {
			unit.fleet = -2;
		} else {
			unit.fleet = units.fleetList[fleet].id;
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

	static getTooltipText(type, tech, subEngineCount, supEngineCount) {
		let content = '';

		let desc = fleetTranslate[tech + '_desc'];
		if(type === 'sub_propulsion') {
			let refSpeed = shipPartsSpeed[tech][0]*10000 + shipPartsSpeed[tech][1]*100 + shipPartsSpeed[tech][2];
			refSpeed = SYSTEM_AU_SIZE/(refSpeed * TIME.HOUR_TO_SECONDS);
			refSpeed *= Math.pow(1.5, subEngineCount - 1);

			desc = desc.replace('%speed%', refSpeed.toFixed(3));
		} else if(type === 'sup_propulsion') {
			let refSpeed = shipPartsSpeed[tech][0]*100 + shipPartsSpeed[tech][1]*10 + shipPartsSpeed[tech][2];
			refSpeed = GALACTIC_PARSEC_SIZE/(refSpeed * TIME.HOUR_TO_SECONDS);
			refSpeed *= Math.pow(1.5, supEngineCount - 1);

			desc = desc.replace('%speed%', refSpeed.toFixed(3));
		} else if(type === 'hangar') {
			desc = desc.replace('%hangarCapacity%', hangarSize[tech]);
		}

		content += '<span style="color:#93fcfc">' + fleetTranslate[tech] + '</span><br/>';
		content += desc;

		return content;
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

		const subEngineCount = shape.filter(e => e[0] === 'sub_propulsion').length,
			supEngineCount = shape.filter(e => e[0] === 'sup_propulsion').length;

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
				const w = shape[id][4]/SHIP_SHAPE_SVG_WIDTH*selw - 12;
				const h = shape[id][5]/SHIP_SHAPE_SVG_HEIGHT*selh - 12;

				document.getElementById('fleet-type-create-selects').innerHTML +=
					'<dl id="part-selecting-seen-' + id + '" class="part-selecting dropdown" style="' +
						'left: ' + ((shape[id][2])/SHIP_SHAPE_SVG_WIDTH)*selw + 'px;' +
						'top: ' + ((shape[id][3])/SHIP_SHAPE_SVG_HEIGHT)*selh + 'px;' +
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
						'" class="tooltip">' +
						'<span class="tooltip-wrapper tooltip-wrapper-right"><span class="tooltip-content">' + units.getTooltipText(shape[i][0], content[shape[i][0]][0], subEngineCount, supEngineCount) + '</span></span></a></dt>' +
						'<dd><ul></ul></dd>' +
					'</dl>';

				for(let eltId=0; eltId<source.options.length; eltId++) {
					document.querySelector('#part-selecting-seen-' + id + ' dd ul').innerHTML += '<li><a href="#" value="' + source.options[eltId].id  + '"' +
						'style="background-image: url(\''+ cdnURL + 'img/units-modules/' + source.options[eltId].id + '.svg\');' +
						'background-size: 95%;background-repeat: no-repeat;background-position: left top;display: block;' +
						'width: ' + w + 'px;' +
						'height: ' + h + 'px;' +
						'"class="tooltip">' +
						'<span class="tooltip-wrapper tooltip-wrapper-right"><span class="tooltip-content">' + units.getTooltipText(shape[i][0], content[shape[i][0]][eltId], subEngineCount, supEngineCount) + '</span></span></a></li>';
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
					const selectedElement = document.querySelector('#part-selecting-seen-' + id + ' dt a');

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
							selectedElement.style[this.style[currSelect]] = this.style[this.style[currSelect]];
						}
					}

					// Replace element tooltip
					selectedElement.removeChild(selectedElement.firstChild);
					const dupTooltip = this.firstChild.cloneNode(true);
					selectedElement.appendChild(dupTooltip);

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
						modules.sub_propulsion = SYSTEM_AU_SIZE/(modules.sub_propulsion * TIME.HOUR_TO_SECONDS);
					} else {
						modules.sub_propulsion *= 1.5;
					}

					break;
				case 'sup_propulsion':
					if(modules.sup_propulsion === 0) {
						modules.sup_propulsion = shipPartsSpeed[parts[i].tech][0]*100 +
							shipPartsSpeed[parts[i].tech][1]*10 + shipPartsSpeed[parts[i].tech][2];
						modules.sup_propulsion = GALACTIC_PARSEC_SIZE/(modules.sup_propulsion * TIME.HOUR_TO_SECONDS);
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

	static getWeaponList(unitId) {
		const armes = {};
		for(let i=0; i<units.list[unitId].parts.length; i++) {
			if(units.list[unitId].parts[i].type !== 'cannon' && units.list[unitId].parts[i].type !== 'rocketLauncher') { continue; }
			if(units.list[unitId].parts[i].tech === 'none') { continue; }
			if(armes[units.list[unitId].parts[i].tech] === undefined) {
				armes[units.list[unitId].parts[i].tech] = 1;
			} else {
				armes[units.list[unitId].parts[i].tech]++;
			}
		}

		return armes;
	}

	static getDefenseList(unitId) {
		const defenses = {};
		for(let i=0; i<units.list[unitId].parts.length; i++) {
			if(units.list[unitId].parts[i].type !== 'shield') { continue; }
			if(units.list[unitId].parts[i].tech === 'none') { continue; }
			if(defenses[units.list[unitId].parts[i].tech] === undefined) {
				defenses[units.list[unitId].parts[i].tech] = 1;
			} else {
				defenses[units.list[unitId].parts[i].tech]++;
			}
		}

		return defenses;
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
		if(!units.list[id].shipShape.includes('SHIP_WEP_MINES')) {
			const armes = units.getWeaponList(id);
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
			ui.show('#fleet-build-stat-attack');
			document.getElementById('fleet-build-stat-attack-val').innerText = armesText;
		} else {
			ui.hide('#fleet-build-stat-attack');
		}

		// Shields
		let shieldText = '';
		if(!units.list[id].shipShape.includes('SHIP_WEP_MINES')) {
			const shields = units.getDefenseList(id);
			for(const i in shields) {
				if(shieldText !== '') { shieldText += ', '; }
				shieldText += shields[i] + 'x ' + fleetTranslate[i];
			}
		}
		if(shieldText !== '') {
			ui.show('#fleet-build-stat-shield');
			document.getElementById('fleet-build-stat-shield-val').innerText = shieldText;
		} else {
			ui.hide('#fleet-build-stat-shield');
		}

		// Boutons
		if(units.list[id].shipShape.includes('SHIP_WEP_MINES')) {
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
		for(const key in fleet.units) {
			totalcount += fleet.units[key];

			const currUnit = units.getUnitData(key);
			if(currUnit.shipType === 'SHIP_FIGHTER') {
				fighterCount += (fighterWeight[currUnit.shipShape] * fleet.units[key]);
			} else if(currUnit.shipType === 'SHIP_CARRIER') {
				for(const p in currUnit.parts) {
					if(currUnit.parts[p].type === 'hangar') {
						fighterCap += (hangarSize[currUnit.parts[p].tech] * fleet.units[key]);
					}
				}
			}
		}

		return { totalcount, fighterCount, fighterCap };
	}

	static getFleetSpoilerDOM(fleet, type, disableTransfers) {
		const counts = units.countFleetCount(fleet);

		let content = '<details class="fleet-show-global">' +
			'<summary id="' + fleet.id + '" class="fleet-show-name"><table class="fleet-show-table">' +
			// Nom flotte
			'<tr><td>' + fleet.name;

			if(fleet.name !== fleetTranslate['SHIP_DEF']) {
				content += '<img class="fleet-rename" alt="rename fleet" src="./cdn/img/ui/rename.svg" style="display: inline-block;">';
			}

		content += '</td>';

		// Fuel
		if(fleet.maxFuel > 0) {
			content += '<td class="text-center"><img class="fleet-show-fuel" src="./cdn/img/ui/fuel.svg"> ' + GetBetterUnit(fleet.fuel, '', -1, true) + '/' + GetBetterUnit(fleet.maxFuel) +
			'(~' + Math.round(100*fleet.fuel/fleet.maxFuel) + '%)</td>';
		} else {
			content += '<td></td>';
		}

		// Tactique
		content += '<td class="text-right">' + fleetTranslate['tactic'] + ': ' +  tactics.getName(fleet.tactic) + '</td>';

		// Seconde ligne
		content += '</tr><tr>';

		// Nb unités - Hangar
		if(counts.fighterCount !== 0 || counts.fighterCap !== 0) {
			content += '<td>' + counts.totalcount + ' ' + fleetTranslate['unit'] + ' - ' + fleetTranslate['hangar'] + ': ' + counts.fighterCount + '/' + counts.fighterCap + '</td>';
		} else {
			content += '<td>' + counts.totalcount + ' ' + fleetTranslate['unit'] + '</td>'; // Non-breaking space is here to force line height
		}

		// Prorité
		if(type === 'orbit' && fleet.maxFuel > 0 && planetData.highPriorityFleet === fleet.id) {
			content += '<td class="text-center"><span style="color: #0ec6c6;">✔</span>' + fleetTranslate['priorty-fuel'] + '</td>';
		} else if(type === 'orbit' && fleet.maxFuel > 0) {
			content += '<td class="text-center priority-fleet" id="' + fleet.id + '"><span style="color: #0ec6c6;">✖</span>' + fleetTranslate['no-priorty-fuel'] + '</td>';
		} else if(type === 'out') {
			content += '<td class="text-center">' + fleetTranslate['orbiting'] + ' ' + fleet.position + '</td>'; // @TODO: pname (username) instead of position
		} else if(type === 'moving') {
			let action = fleetTranslate['movingTo'];
			switch(fleet.orbitPosition) {
				case 1:
					action = fleetTranslate['attacking'];
					break;
				case 2:
					action = fleetTranslate['movingToDef'];
					break;
			}
			content += '<td class="text-center">' + action + ' ' + fleet.position + fleetTranslate['arriveAt'] + ' ' + getDateTime(new Date(fleet.endMoveTime)) + '</td>'; // @TODO: pname (username) instead of position
		}

		content +='</tr></table></summary>' +
			'<table class="unit-list-table">' + fleetListHeader + '<tbody>';

		for(let allUnitsId=0; allUnitsId<units.list.length; allUnitsId++) {
			const count = fleet.units[units.list[allUnitsId].id];
			if(!count) { continue; }

			content +=  '<tr id="'+ units.list[allUnitsId].id +'" class="table-line">' +
							'<td>' + units.list[allUnitsId].name + '</td>' +
							'<td>' + fleetTranslate[units.list[allUnitsId].shipType] + '</td>' +
							'<td>' + fleetTranslate[units.list[allUnitsId].shipShape] + '</td>' +
							'<td>' + count + '</td>';


			// Buttons
			content += '<td>';

			if(fleet.name !== fleetTranslate['SHIP_DEF'] && !disableTransfers) {
				content += '<img class="fleet-show-transferUnits" title="' + fleetTranslate['transferUnits'] + '" src="./cdn/img/ui/unit-transfer.svg">';
			}

			if(type === 'orbit') {
				content += '<img class="fleet-show-upgrade" title="' + fleetTranslate['upgrade'] + '" src="./cdn/img/ui/unit-upgrade.svg">' +
						'<img class="fleet-show-recycle" title="' + fleetTranslate['recycle'] + '" src="./cdn/img/ui/unit-recycle.svg">';
			}

			content += '</td></tr>';
		}

		let disableCSS = '';
		if(fleet.name === fleetTranslate['SHIP_DEF'] || disableTransfers) {
			disableCSS = ' style="opacity: 0;" disabled';
		}

		content += '</tbody></table><div class="fleet-show-buttonPanel">' +
			'<input type="button" class="fleet-show-button ui-medium-button fleet-show-mergeInto" value="' + fleetTranslate['mergeInto'] + '" ' + disableCSS + '>' +
			'<input type="button" class="fleet-show-button ui-medium-button fleet-show-transferFuel" value="' + fleetTranslate['transferFuel'] + '" ' + disableCSS + '>' +
			'<input type="button" class="fleet-show-button ui-medium-button fleet-show-assignTactic" value="' + fleetTranslate['assignTactic'] + '">' +
			'</div></details>';

		return content;
	}

	/**
	 * (Re)draw the fleets lists
	 */
	static drawFleetLists() {
		if(planetData.address === undefined) {
			setTimeout(function() {
				units.drawFleetLists();
			}, 500);

			return;
		}

		let orbitDOM = '';
		let movingDOM = '';
		let outDOM = '';

		const disableTransfers = units.fleetList.length < 2 ||
			(units.fleetList.length === 2 && (units.fleetList.map((f) => f.name).includes(fleetTranslate['SHIP_DEF'])));

		for(let i=0; i<units.fleetList.length; i++) {
			if(Object.entries(units.fleetList[i].units).length === 0 &&
				units.fleetList[i].units.constructor === Object) { continue; } // It's updated serverside, but not here ...

			if(units.fleetList[i].name === 'SHIP_DEF') { units.fleetList[i].name = fleetTranslate[units.fleetList[i].name]; }

			if(units.fleetList[i].position === planetData.address && units.fleetList[i].endMoveTime === -1) {

				if(units.fleetList[i].name === fleetTranslate['SHIP_DEF']) { // Defence fleet always first
					orbitDOM = units.getFleetSpoilerDOM(units.fleetList[i], 'orbit', disableTransfers) + orbitDOM;
				} else {
					orbitDOM += units.getFleetSpoilerDOM(units.fleetList[i], 'orbit', disableTransfers);
				}

			} else if(units.fleetList[i].endMoveTime !== -1) {
				movingDOM += units.getFleetSpoilerDOM(units.fleetList[i], 'moving', disableTransfers);
			} else {
				outDOM += units.getFleetSpoilerDOM(units.fleetList[i], 'out', disableTransfers);
			}
		}

		// On orbit
		if(orbitDOM === '') {
			orbitDOM = '<h2>' + fleetTranslate['no-orbit-unit'] + '</h2>';
		}
		document.getElementById('fleet-orbit').innerHTML = orbitDOM;

		// Moving
		if(movingDOM === '') {
			movingDOM = '<h2>' + fleetTranslate['no-orbit-unit'] + '</h2>';
		}
		document.getElementById('fleet-move').innerHTML = movingDOM;

		// Out
		if(outDOM === '') {
			outDOM = '<h2>' + fleetTranslate['no-orbit-unit'] + '</h2>';
		}
		document.getElementById('fleet-out').innerHTML = outDOM;

		// Fleet rename
		Array.from(document.getElementsByClassName('fleet-rename')).forEach((elt) => elt.addEventListener('click', function(event) {
			event.preventDefault();
			if(preventFleetHUDClosing) { return; }

			const fleetId = elt.parentNode.parentNode.parentNode.parentNode.parentNode.id; // Yeah, that's ugly ...
			const fleetNb = units.fleetList.map((fleet) => fleet.id).indexOf(fleetId);
			if(fleetNb < 0) { return; }

			const oldName = units.fleetList[fleetNb].name;
			document.getElementById('fleet-rename-name').innerText = oldName;
			document.getElementById('fleet-rename-newName').value = oldName;
			document.getElementById('fleet-rename').setAttribute('fleetId',
				elt.parentNode.parentNode.parentNode.parentNode.parentNode.id); // Yeah, that's ugly ...

			ui.show('#fleet-rename');
			preventFleetHUDClosing = true;
		}));

		Array.from(document.getElementsByClassName('fleet-show-mergeInto')).forEach((elt) => elt.addEventListener('click', function() {
			if(preventFleetHUDClosing) { return; }

			units.regenerateSelectFleetLists();

			const fleetId = elt.parentNode.parentNode.children[0].id; // Yeah, that's ugly ...
			const fleetNb = units.fleetList.map((fleet) => fleet.id).indexOf(fleetId);
			if(fleetNb < 0) { return; }

			document.getElementById('fleet-merge-name').innerText = units.getFleetData(fleetId).name;

			document.querySelector('#fleet-merge-panel option[id="' + fleetNb + '"]').disabled = true;
			units.currFleet=fleetId;

			ui.show('#fleet-merge-panel');
			preventFleetHUDClosing = true;
		}));

		Array.from(document.getElementsByClassName('fleet-show-transferFuel')).forEach((elt) => elt.addEventListener('click', function() {
			if(preventFleetHUDClosing) { return; }

			units.regenerateSelectFleetLists();

			const fleetId = elt.parentNode.parentNode.children[0].id; // Yeah, that's ugly ...
			const fleetNb = units.fleetList.map((fleet) => fleet.id).indexOf(fleetId);
			if(fleetNb < 0) { return; }

			document.querySelector('#fleet-transferFuel-panel option[id="' + fleetNb + '"]').disabled = true;
			units.currFleet=fleetId;

			document.getElementById('fleet-transferFuel-fuelCount').value = '';

			document.getElementById('fleet-transferFuel-name').innerText = units.getFleetData(fleetId).name;

			ui.show('#fleet-transferFuel-panel');
			preventFleetHUDClosing = true;
		}));

		Array.from(document.getElementsByClassName('fleet-show-transferUnits')).forEach((elt) => elt.addEventListener('click', function() {
			if(preventFleetHUDClosing) { return; }

			units.regenerateSelectFleetLists();

			const fleetId = elt.parentNode.parentNode.parentNode.parentNode.parentNode.children[0].id; // Yeah, that's ugly ...
			const fleetNb = units.fleetList.map((fleet) => fleet.id).indexOf(fleetId);
			if(fleetNb < 0) { return; }

			document.querySelector('#fleet-units-transfer-panel option[id="' + fleetNb + '"]').disabled = true;
			units.currFleet=fleetId;
			units.currTransferUnit=elt.parentNode.parentNode.id;

			document.getElementById('fleet-units-transfer-unitCount').value = '';

			document.getElementById('fleet-units-transfer-name').innerText = elt.parentNode.parentNode.children[0].innerText;

			ui.show('#fleet-units-transfer-panel');
			preventFleetHUDClosing = true;
		}));

		Array.from(document.getElementsByClassName('fleet-show-assignTactic')).forEach((elt) => elt.addEventListener('click', function(event) {
			if(preventFleetHUDClosing) { event.preventDefault(); }

			units.regenerateSelectFleetLists();

			const fleetId = elt.parentNode.parentNode.children[0].id; // Yeah, that's ugly ...
			units.currFleet = fleetId;
			document.getElementById('fleet-assignTactic-name').innerText = units.getFleetName(fleetId);

			const mainList = document.getElementById('fleet-assignTactic-tacticSelect');
			while (mainList.lastChild) {
				if(mainList.lastChild.id === '-1') { break; }
				mainList.removeChild(mainList.lastChild);
			}

			let i = 0;
			for(const tactic of tactics.tacticList) {
				const option = document.createElement('option');
				option.id = i++;
				option.innerText = tactic.name;

				mainList.appendChild(option);
			}

			ui.show('#fleet-assignTactic-panel');

			preventFleetHUDClosing = true;
		}));

		Array.from(document.getElementsByClassName('fleet-show-table')).forEach((elt) => elt.addEventListener('click', function(event) {
			if(preventFleetHUDClosing) { event.preventDefault(); }
		}));

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
			for(const key in fleet.units) {
				unitList.push(units.getUnitData(key));
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
				now/TIME.SECONDS_TO_MS + Math.round(baseTravelTime*TIME.HOUR_TO_SECONDS*100)/100);
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
			const unitIdList = units.list.map((unit) => unit.id);
			for(const key in fleet.units) {
				const currUnitId = unitIdList.indexOf(key);
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
			if(units.fleetList[i].name === fleetTranslate['SHIP_DEF']) { continue; }
			if(units.fleetList[i].endMoveTime > 0) { continue; }
			if(units.fleetList[i].position === units.planetTarget) { continue; }

			const mt = units.calcTimeAndFuel(units.fleetList[i]);
			units.fleetTimes[units.fleetList[i].id] = mt.time;
			units.fleetFuel[units.fleetList[i].id] = mt.fuel;

			fleetListDOM += '<li id="' + units.fleetList[i].id + '"';
			if(i === 0) {
				fleetListDOM += ' class="map-move-panel-list-active"';
			}
			fleetListDOM += ' >';

			if(units.fleetFuel[units.fleetList[i].id][1] >= 2*units.fleetFuel[units.fleetList[i].id][0]) {
				fleetListDOM += '<img src="' + cdnURL + 'img/ui/fuel-status-2.svg">';
			} else if(units.fleetFuel[units.fleetList[i].id][1] >= units.fleetFuel[units.fleetList[i].id][0]) {
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
				translate['ui']['no-player'] + '</em>)'
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
			for(const key in currentFleet.units) {
				const currUnit = units.getUnitData(key);
				if(currUnit.shipType === 'SHIP_FIGHTER') {
					fighterCount += (fighterWeight[currUnit.shipShape] * currentFleet.units[key]);
				} else if(currUnit.shipType === 'SHIP_CARRIER') {
					for(const p in currUnit.parts) {
						if(currUnit.parts[p].type === 'hangar') {
							fighterCap += (hangarSize[currUnit.parts[p].tech] * currentFleet.units[key]);
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
			' (' + ratio + '% ' + fleetTranslate['of-maxFuel'] + ')';

		// Hangar
		document.getElementById('map-move-panel-hangar').style.color = 'white';
		document.getElementById('map-move-panel-hangar').innerText = fighterCount + '/' + fighterCap;
		if(fighterCount > fighterCap) {
			document.getElementById('map-move-panel-hangar').style.color = 'red';
		}
	}
}