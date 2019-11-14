class Reports extends _Reports {
	static init(reports) {
		Reports.reportList = reports.map((elt) => {
			elt.date = new Date(elt.date);

			return elt;
		}).sort((a, b) => {
			if(a.date.getTime() < b.date.getTime()) {
				return 1;
			}

			return -1;
		});
		Reports.cache = (!Reports.cache) ? [] : Reports.cache;

		for(const report of reports.filter((elt) => !elt.read)) {
			notifications.notify('report', {
				id: report.battleLogId
			});
		}

		Reports.displayList();

		document.getElementById('report-panel-close').addEventListener('click', () => {
			ui.closeTab('#report-panel');
			ui.reports = false;

			ui.show('#report-list-container');
			ui.hide('#report-preview-container');
		});

		document.getElementById('report-preview-back').addEventListener('click', () => {
			ui.show('#report-list-container');
			ui.hide('#report-preview-container');
		});

		document.getElementById('report-list-select-all').addEventListener('change', function() {
			for(const elt of document.querySelectorAll('#report-list input[type=checkbox]')) {
				elt.checked = this.checked;
			}
		});

		ui.hide('#report-preview-container');
	}

	static markRead(reportId) {
		for(const report of Reports.reportList) {
			if(report.battleLogId === reportId) {
				report.read = true;
			}
		}

		Reports.displayList();
	}

	static showReport(reportId) {
		notifications.removeInGameNotif(reportId);

		Reports.markRead(reportId);

		if(!Reports.cache[reportId]) {
			socket.emit('player-report-ask', { username: userData.username, id: userData.id,  reportId });
		} else {
			Reports.displayReport(reportId);
		}
	}

	static buildAtkText(report) {
		return report.atk_fleet_name + ' (' + report.atk_user_name + ')';
	}

	static buildDefText(report) {
		return report.location + ' (' + report.def_user_name + ')';
	}

	static generateLine(report) {
		const trElt = document.createElement('tr');

		// Case
		const tickTd = document.createElement('td');
		trElt.append(tickTd);

		const tickInput = document.createElement('input');
		tickInput.type = 'checkbox';
		tickInput.id = report.id;
		tickTd.append(tickInput);

		// Name
		const nameTd = document.createElement('td');
		trElt.append(nameTd);

		const aElt = document.createElement('a');
		nameTd.append(aElt);

		aElt.innerText = Reports.buildAtkText(report) + translate['messages']['REPORT_ATTACK'] + Reports.buildDefText(report);
		aElt.addEventListener('click', () => Reports.showReport(report.battleLogId));

		// Date
		const dateTd = document.createElement('td');
		dateTd.innerText = report.date.toLocaleDateString() + ' ' + report.date.toLocaleTimeString();
		trElt.append(dateTd);

		if(!report.read) {
			trElt.classList.add('unread');
		}

		return trElt;
	}

	static displayList() {
		const reportList = document.getElementById('report-list');

		while(reportList.firstChild) {
			reportList.removeChild(reportList.firstChild);
		}

		// If no report avaiable
		if(!Reports.reportList || !Array.isArray(Reports.reportList) || Reports.reportList.length === 0) {
			const line = document.createElement('tr');
			reportList.append(line);

			const column = document.createElement('td');
			line.append(column);

			const header = document.createElement('h2');
			column.append(header);
			header.innerText = translate['messages']['NO_REPORTS_AVAILABLE'];
			header.classList.add('text-center');
		}


		// @TODO: buttons "delete", "mark as read", "mark as not read"

		// Generate DOM
		for(const report of Reports.reportList) {
			reportList.append(Reports.generateLine(report));
		}
	}

	static generateFleetDetail(fleet, losts, atk) {
		const container = document.createElement('table');

		const headerTr = document.createElement('tr');
		container.append(headerTr);

		const headerTh = document.createElement('th');
		headerTr.append(headerTh);
		headerTh.setAttribute('colspan', 2);
		headerTh.innerText = fleet.name;

		for(const unit of fleet.units) {
			const lineTr = document.createElement('tr');
			container.append(lineTr);

			const unitName = document.createElement('td');
			unitName.innerText = unit.name;

			const unitCount = document.createElement('td');
			const previousCount = document.createElement('span');
			previousCount.innerText = unit.count;
			unitCount.append(previousCount);

			if(losts[unit.id]) {
				const lostUnits = document.createElement('span');
				lostUnits.innerText = ' -' + Math.floor(losts[unit.id]);
				lostUnits.style.color = 'red';
				unitCount.append(lostUnits);
			}

			if(atk) {
				lineTr.append(unitName);
				lineTr.append(unitCount);
			} else {
				lineTr.append(unitCount);
				lineTr.append(unitName);
			}
		}

		return container;
	}

	static displayReport(reportId) {
		if(!Reports.cache[reportId]) { return; }

		const report = Reports.cache[reportId];

		// Generate DOM

		// @TODO: buttons "delete", "mark as read", "mark as not read"

		document.getElementById('report-preview-atk').innerText = Reports.buildAtkText(report);
		document.getElementById('report-preview-def').innerText = Reports.buildDefText(report);

		if(report.defWins) {
			document.getElementById('report-preview-status').innerText = translate['messages']['REPORT_DEF_WINS'];
		} else {
			document.getElementById('report-preview-status').innerText = translate['messages']['REPORT_ATK_WINS'];
		}

		const losts = Reports.getAllLostUnitsInFleets(report);

		const atkFleetsDetail = document.getElementById('report-details-atk');
		ui.emptyElt(atkFleetsDetail);
		for(const fleet of report.atkFleets) {
			atkFleetsDetail.append(Reports.generateFleetDetail(fleet, losts[fleet.id], true));
		}

		const defFleetsDetail = document.getElementById('report-details-def');
		ui.emptyElt(defFleetsDetail);
		for(const fleet of report.defFleets) {
			defFleetsDetail.append(Reports.generateFleetDetail(fleet, losts[fleet.id], false));
		}

		// @TODO: manage empty def fleet

		// @TODO: resources stolen

		// @TODO: client simulation

		// Display
		ui.hide('#report-list-container');
		ui.show('#report-preview-container');
		ui.show('#report-panel');
	}
}