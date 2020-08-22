class Trading extends _Trading {
	static init(tradingList) {
		Trading.list = tradingList;

		Trading.showPanel('public');
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
		], () => false, Trading.showPanel);
	}

	static openPlanetPanel() {

	}

	static generateUniqueDetail(resourceName, value, negatif) {
		const details = ' ' +  resourcesIcons[resourceName] + ':';

		let unit = 't';
		if(resourceName !== 'credits' && resourceName !== 'planets') {
			unit = '';
		}

		return details + GetBetterUnit(value);
	}

	static generateDetailText(resDestination, resOrigin) {
		let details = '<div>→ ';

		for(const resourceName in resDestination) {
			details += Trading.generateUniqueDetail(resourceName, resDestination[resourceName]);
		}

		details += '</div><div>← ';

		for(const resourceName in resOrigin) {
			details += Trading.generateUniqueDetail(resourceName, resOrigin[resourceName]);
		}

		details += '</div>';

		return details;
	}

	static calcTimeTo(origin, destination) {
		const systemeDepart = GameMap.getSystemFromAdress(origin);
		const systemeArrivee = GameMap.getSystemFromAdress(destination);

		let time = 0;

		if(systemeDepart === systemeArrivee) {
			const baseDist = GameMap.getPlanetDistance(
				origin,
				destination,
				now/TIME.SECONDS_TO_MS);
			if(Number.isNaN(baseDist) || baseDist < 0) { return; }
			const baseTravelTime = Trading.calcSubMoveTime(baseDist);

			const previewDist = GameMap.getPlanetDistance(
				origin,
				destination,
				now/TIME.SECONDS_TO_MS + Math.round(baseTravelTime*TIME.HOUR_TO_SECONDS*100)/100);
			if(Number.isNaN(previewDist) || previewDist < 0) { return; }
			const previewTime = Trading.calcSubMoveTime(previewDist);

			/* Final travel time:
				Average of ...
				 Time to travel to planet where it's now
				and
				 Time to travel to planet where it'll be when we arrive to this previous position
			*/
			time = (baseTravelTime + previewTime)/2;
		} else {
			const secteurDepart = GameMap.getSectorFromAdress(origin);
			const secteurArrivee = GameMap.getSectorFromAdress(destination);

			// @TODO: load XMLs

			const systemeDepartDOM = map.xmlDoc[secteurDepart].querySelector('sy[id="' + systemeDepart + '"]');
			const systemeArriveeDOM = map.xmlDoc[secteurArrivee].querySelector('sy[id="' + systemeArrivee + '"]');

			const dist = Math.sqrt(
				Math.pow(systemeDepartDOM.getAttribute('x') - systemeArriveeDOM.getAttribute('x'),2) +
				Math.pow(systemeDepartDOM.getAttribute('y') - systemeArriveeDOM.getAttribute('y'),2)
			);

			time = Trading.calcSupMoveTime(dist);
		}

		return time;
	}

	static generateDistanceText(order) {
		if(order.new_user === null) {
			return '-';
		}

		const planets = [
			[order.prev_user_origin, order.new_user_destination],
			[order.new_user_origin, order.prev_user_destination],
		];

		const times = [];
		for(const duo of planets) {
			times.push(
				Trading.calcTimeTo(duo[0], duo[1]),
			);
		}

		if(getStringTime(times[0]) === getStringTime(times[1])) {
			return getStringTime(times[0]);
		}

		return getStringTime(times[0]) + ' / ' + getStringTime(times[1]);
	}

	static generateRepetitionText(tradingOrder) {
		if(tradingOrder.repetition_count === null) {
			return '-';
		}

		// @TODO: improve that
		return translate['trading'].eachDate + tradingOrder.repetition_interval + ' (' + tradingOrder.repetition_done + '/' + tradingOrder.repetition_count + ')';
	}

	static showPanel(type) {
		let tradeList = [];

		ui.hide('#trading-list-date');
		document.getElementById('trading-list').classList.remove('trading-list-ended');

		switch (type) {
			case 'public':
				tradeList = Trading.list.filter((elt) => elt.prev_user !== userData.username && !elt.accepted && !elt.aborted);
				break;
			case 'request':
				tradeList = Trading.list.filter((elt) => (elt.prev_user === userData.username || elt.new_user ===  userData.username) && !elt.accepted && !elt.aborted);
				break;
			case 'ongoing':
				tradeList = Trading.list.filter((elt) => elt.accepted && !elt.done);
				break;
			case 'ended':
				tradeList = Trading.list.filter((elt) => elt.done || elt.aborted).sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
				ui.show('#trading-list-date');
				document.getElementById('trading-list').classList.add('trading-list-ended');
				break;
			default:
				// Do nothing here
				break;
		}

		if(tradeList.length === 0) {
			ui.show('#trading-list-empty');
			ui.hide('#trading-list');
			return;
		}

		const table = document.getElementById('trading-list-tbody');

		ui.emptyElt(table);

		for(const tradeOrder of tradeList) {
			const tr = document.createElement('tr');


			let username = tradeOrder.prev_user;
			let ally = tradeOrder.prev_user_ally;

			if(username === userData.username) {
				username = tradeOrder.new_user;
				ally = tradeOrder.new_user_ally;
			}

			if(username === null) {
				username = '-';
			}

			if(!ally) {
				ally = '-';
			}

			tr.appendChild(ui.createTdText(username));
			tr.appendChild(ui.createTdText(ally));

			const detailsTd = document.createElement('td');
			detailsTd.innerHTML = Trading.generateDetailText(tradeOrder.resources_destination, tradeOrder.resources_origin, tradeOrder.new_user === userData.username);
			// @TODO: find a better way than innerHTML ...

			tr.appendChild(detailsTd);
			tr.appendChild(ui.createTdText(Trading.generateDistanceText(tradeOrder)));
			tr.appendChild(ui.createTdText(Trading.generateRepetitionText(tradeOrder)));

			if(type === 'ended') {
				const date = new Date(tradeOrder.date);
				tr.appendChild(ui.createTdText(date.toLocaleDateString() + ' ' + date.toLocaleTimeString()));
			}

			table.append(tr);
		}

		ui.hide('#trading-list-empty');
		ui.show('#trading-list');
	}
}