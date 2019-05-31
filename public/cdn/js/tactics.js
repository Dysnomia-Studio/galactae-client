class tactics {
	static loadUI() {
		document.getElementById('fleet-tacticsManager-close').addEventListener('click', () => {
			ui.hide('#fleet-tacticsManager-panel');
		});

		document.getElementById('fleet-tacticsManager-addOrder').addEventListener('click', () => {
			tactics.currOrder = -1;
			tactics.drawOrders();
		});

		document.getElementById('fleet-tacticsManager-tacticSave').addEventListener('click', () => {
			tactics.submitTactic();
		});

		document.getElementById('fleet-tacticsManager-saveOrder').addEventListener('click', () => {
			tactics.saveOrder();
		});

		document.getElementById('fleet-tacticsManager-deleteOrder').addEventListener('click', () => {
			tactics.deleteOrder();
		});

		document.getElementById('fleet-tacticsManager-priorityLevel').addEventListener('change', function() {
			if(Number.isNaN(parseInt(this.value))) {
				this.value = 1;
				return;
			}

			if(this.value < 1) {
				this.value = 1;
			}

			if(this.value > 100) {
				this.value = 100;
			}
		});
	}

	static drawList() {
		let html = '';

		if(!tactics.tacticList || tactics.tacticList.length === 0) {
			html += '<h2>Aucune tactique</h2>';
		} else {
			html += '<table>';

			html += '<tr class="text-center">';
			html += '<th>Nom</th>';
			html += '<th>Ordres</th>';
			html += '<th class="tactics-edit"></th>';
			html += '<th class="tactics-remove"></th>';
			html += '</tr>';

			for(let i=0; i<tactics.tacticList.length; i++) {
				const currTactic = tactics.tacticList[i];

				html += '<tr id="tactics-' + i + '" class="text-center">';

				html += '<td>' + currTactic.name + '</td>';
				html += '<td>' + currTactic.orders.length + '</td>';

				html += '<td class="tactics-edit"><img alt="edit tactics" src="./cdn/img/ui/rename.svg"></td>';
				html += '<td class="tactics-remove">✖</td>';

				html += '</tr>';
			}

			html += '</table>';
		}

		document.getElementById('fleets-tactics-content').innerHTML = html;

		tactics.declareListEvents();
	}

	static declareListEvents() {
		document.getElementById('fleet-tactics-new').addEventListener('click', () => {
			tactics.openEditor();
		});

		Array.from(document.getElementsByClassName('tactics-remove')).forEach((elt) => elt.addEventListener('click', () => {
			tactics.openDeleteUI(parseInt(elt.parentNode.id.split('-')[1]));
		}));

		Array.from(document.getElementsByClassName('tactics-edit')).forEach((elt) => elt.addEventListener('click', () => {
			tactics.openEditor(parseInt(elt.parentNode.id.split('-')[1]));
		}));
	}

	static getName(tactic) {
		const tacticObj = tactics.getTacticById(tactic);

		if(tacticObj.name) {
			return tacticObj.name;
		}

		return fleetTranslate['defaultTactic'];
	}

	static isUsedByFleet(id) {
		for(const fleet of units.fleetList) {
			if(fleet.tactic === id) {
				return true;
			}
		}

		return false;
	}

	static sortCurrTactic() {
		tactics.currTactic.orders.sort((a,b) => {
			if(a.priority > b.priority) {
				return 1;
			} else if(a.priority === b.priority) {
				if(tactics.getTacticById(a.unit).name > tactics.getTacticById(b.unit).name) {
					return 1;
				} else if(tactics.getTacticById(a.unit).name === tactics.getTacticById(b.unit).name) {
					if(fleetTranslate[a.target] > fleetTranslate[b.target]) {
						return 1;
					}
				}
			}

			return -1;
		});
	}

	static openDeleteUI(id) {
		if(Number.isNaN(id) || !tactics.tacticList[id]) { return; }
		const currTactic = tactics.tacticList[id];

		if(tactics.isUsedByFleet(currTactic.id)) {
			ui.drawMessage('TACTIC_USED_BY_FLEET');
			return;
		}

		ui.confirm('Voulez vous supprimer la tactique ' + currTactic.name + ' ?', 'Oui', 'Non', () => {
			socket.emit('tactics-delete', {
				id: userData.id,
				username: userData.username,
				tacticId: currTactic.id
			});
		});
	}

	static getTacticById(id) {
		for(let i=0; i<tactics.tacticList.length; i++) {
			if(tactics.tacticList[i].id === id) {
				return tactics.tacticList[i];
			}
		}

		return {};
	}

	static drawCurrentOrder() {
		const currOrder = tactics.currTactic.orders[tactics.currOrder];

		let unitType = 0,
			unitTarget = 0,
			priorityLevel = 1;

		if(currOrder !== undefined) {
			// Unit Type
			for(let i=0; i<units.list.length; i++) {
				if(units.list[i].id === currOrder.unit) {
					unitType = i;
					break;
				}
			}

			// Unit Target
			for(let i=0; i<unitTypes.length; i++) {
				if(unitTypes[i] === currOrder.target) {
					unitTarget = i;
					break;
				}
			}

			// Priority
			priorityLevel = currOrder.priority;
		}

		document.getElementById('fleet-tacticsManager-unitType').selectedIndex = unitType;
		document.getElementById('fleet-tacticsManager-unitTarget').selectedIndex = unitTarget;
		document.getElementById('fleet-tacticsManager-priorityLevel').value = priorityLevel;
	}

	static drawSelects() {
		// Unit Types
		let unitTypesHTML = '';
		for(let i=0; i<units.list.length; i++) {
			if(units.list[i].id.includes('SHIP_WEP_MINES')) { continue; }

			unitTypesHTML += '<option value="' + i + '">' + units.list[i].name + '</option>';
		}
		document.getElementById('fleet-tacticsManager-unitType').innerHTML = unitTypesHTML;

		// Unit Targets
		let unitTargetsHTML = '';
		for(let i=0; i<unitTypes.length; i++) {
			unitTargetsHTML += '<option value="' + i + '">' + fleetTranslate[unitTypes[i]] + '</option>';
		}

		document.getElementById('fleet-tacticsManager-unitTarget').innerHTML = unitTargetsHTML;
	}

	static drawOrders() {
		const mainList = document.getElementById('fleet-tacticsManager-orderList');
		while (mainList.firstChild) {
			mainList.removeChild(mainList.firstChild);
		}

		if(tactics.currOrder < 0) {
			const listElt = document.createElement('li');
			listElt.id = -1;
			listElt.classList.add('active');
			listElt.innerText = translate['tactic']['orderNew'];

			mainList.appendChild(listElt);
		}

		for(let i=0; i<tactics.currTactic.orders.length; i++) {
			const listElt = document.createElement('li');
			listElt.id = i;

			if(i === tactics.currOrder) {
				listElt.classList.add('active');
			}

			listElt.innerText = '[' + tactics.currTactic.orders[i].priority + '] ' +
				units.getUnitName(tactics.currTactic.orders[i].unit) + ' -> ' + fleetTranslate[tactics.currTactic.orders[i].target];

			mainList.appendChild(listElt);
		}

		tactics.drawCurrentOrder();


		Array.from(document.querySelectorAll('#fleet-tacticsManager-orderList li')).forEach((elt) => elt.addEventListener('click', () => {
			const id = parseInt(elt.id);
			if(Number.isNaN(id)) { return; }
			tactics.currOrder = id;
			tactics.drawCurrentOrder();

			ui.toggleClass('#fleet-tacticsManager-orderList li.active', 'active', elt);
		}));
	}

	static openEditor(id=-1) {
		if(Number.isNaN(id) || !tactics.tacticList[id]) {
			tactics.currTactic = {
				name: '',
				owner: userData.id,
				orders: []
			};
		} else {
			tactics.currTactic = tactics.tacticList[id];
		}

		// Draw name
		document.getElementById('fleet-tacticsManager-tacticName').value = tactics.currTactic.name;

		// Draw orders
		tactics.currOrder = -1;
		tactics.drawSelects();
		tactics.drawOrders();

		// Draw panel
		ui.show('#fleet-tacticsManager-panel');
	}

	static saveOrder() {
		const eltUnitType   = document.getElementById('fleet-tacticsManager-unitType'),
			eltUnitTarget = document.getElementById('fleet-tacticsManager-unitTarget'),
			order = {
				unit: units.list[eltUnitType.options[eltUnitType.selectedIndex].value].id,
				target: unitTypes[eltUnitTarget.options[eltUnitTarget.selectedIndex].value],
				priority: parseInt(document.getElementById('fleet-tacticsManager-priorityLevel').value)
			};

		if(Number.isNaN(order.priority)) { return; }
		// @TODO: prevent duplicate orders

		if(!tactics.currTactic.orders[tactics.currOrder]) {
			tactics.currTactic.orders.push(order);
			tactics.currOrder = tactics.currTactic.orders.length - 1;
		} else {
			tactics.currTactic.orders[tactics.currOrder] = order;
		}

		tactics.sortCurrTactic();

		tactics.drawOrders();
	}

	static deleteOrder() {
		if(!tactics.currTactic.orders[tactics.currOrder]) { return; }

		tactics.currTactic.orders.splice(tactics.currOrder, 1);

		tactics.currOrder = -1;

		tactics.drawOrders();
	}

	static submitTactic() {
		if(document.getElementById('fleet-tacticsManager-tacticName').value.replace(/ /g, '') === '' ||
			tactics.currTactic.orders.length === 0) { return; }

		tactics.currTactic.name = document.getElementById('fleet-tacticsManager-tacticName').value;

		socket.emit('tactics-upsert', {
			id: userData.id,
			username: userData.username,
			tactic: tactics.currTactic
		});

		ui.hide('#fleet-tacticsManager-panel');
	}
}