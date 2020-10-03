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

		document.getElementById('report-list-select-all').checked = false;

		for(const report of reports.filter((elt) => !elt.read)) {
			notifications.notify('report', {
				id: report.battleLogId,
			});
		}

		Reports.displayList();

		// Main UI Buttons
		document.getElementById('report-panel-close').addEventListener('click', () => {
			ui.closeTab('#report-panel');
			ui.reports = false;

			Reports.backToList();
		});

		// Preview UI Buttons
		document.getElementById('report-preview-back').addEventListener('click', () => {
			Reports.backToList();
		});
		document.getElementById('report-preview-mark-unread').addEventListener('click', () => {
			Reports.serverMarkUnRead([Reports.currReport]);
		});
		document.getElementById('report-preview-delete').addEventListener('click', () => {
			ui.confirm(
				translate.messages['REPORT_DELETE_ONE'],
				translate['ui']['CONFIRM_YES'],
				translate['ui']['CONFIRM_NO'],
				() => Reports.serverDelete([Reports.currReport])
			);
		});

		// List UI Buttons
		document.getElementById('report-list-select-all').addEventListener('change', function() {
			for(const elt of document.querySelectorAll('#report-list input[type=checkbox]')) {
				elt.checked = this.checked;
			}
		});
		document.getElementById('report-list-mark-read').addEventListener('click', () => {
			Reports.serverMarkRead(
				Reports.getCheckedReports()
			);
		});
		document.getElementById('report-list-mark-unread').addEventListener('click', () => {
			Reports.serverMarkUnRead(
				Reports.getCheckedReports()
			);
		});
		document.getElementById('report-list-delete').addEventListener('click', () => {
			ui.confirm(
				translate.messages['REPORT_DELETE_ONE'],
				translate['ui']['CONFIRM_YES'],
				translate['ui']['CONFIRM_NO'],
				() => Reports.serverDelete(
					Reports.getCheckedReports()
				)
			);
		});

		ui.hide('#report-preview-container');
	}

	static backToList() {
		ui.show('#report-list-container');
		ui.hide('#report-preview-container');
	}

	static getCheckedReports() {
		return Array.from(document.querySelectorAll('#report-list input:checked')).map((elt) => elt.id);
	}

	static serverMarkRead(reports) {
		for(const report of reports) {
			notifications.removeInGameNotif(report);
		}

		socket.emit('player-report-set-read', {
			...webSockets.getUserData(),
			reports,
		});
	}

	static serverMarkUnRead(reports) {
		socket.emit('player-report-set-unread', {
			...webSockets.getUserData(),
			reports,
		});
	}

	static serverDelete(reports) {
		socket.emit('player-report-delete', {
			...webSockets.getUserData(),
			reports,
		});
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
			socket.emit('player-report-ask', {
				...webSockets.getUserData(),
				reportId,
			});
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
		tickInput.id = report.battleLogId;
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

		ui.emptyElt(reportList);

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

		// Generate DOM
		for(const report of Reports.reportList) {
			reportList.append(Reports.generateLine(report));
		}

		Reports.backToList();
	}

	static generateFleetDetail(fleet, losts, atk) {
		const container = document.createElement('table');

		const headerTr = document.createElement('tr');
		container.append(headerTr);

		const headerTh = document.createElement('th');
		headerTr.append(headerTh);
		headerTh.setAttribute('colspan', 2);
		if(fleetTranslate[fleet.name]) {
			fleet.name = fleetTranslate[fleet.name];
		}
		headerTh.innerText = fleet.name;

		for(const unit of fleet.units) {
			const lineTr = document.createElement('tr');
			container.append(lineTr);

			const unitName = document.createElement('td');
			if(fleetTranslate[unit.name]) {
				unit.name = fleetTranslate[unit.name];
			}
			unitName.innerText = unit.name;

			const unitCount = document.createElement('td');
			const previousCount = document.createElement('span');
			previousCount.innerText = unit.count;
			unitCount.append(previousCount);

			if(losts && losts[unit.id]) {
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
		if(!Reports.cache[reportId]) {
			return;
		}

		Reports.currReport = reportId;

		const report = Reports.cache[reportId];

		// Generate DOM
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
			defFleetsDetail.append(document.createElement('br'));
		}

		if(!document.getElementById('report-details-def').firstChild) {
			const emptyFleetTr = document.createElement('tr');
			const emptyFleetTd = document.createElement('td');
			emptyFleetTr.append(emptyFleetTd);

			emptyFleetTd.innerText = translate['messages']['REPORT_NO_FLEET'];

			defFleetsDetail.append(emptyFleetTr);
		}

		// @TODO: resources stolen

		// @TODO: client simulation

		// Display
		ui.hide('#report-list-container');
		ui.show('#report-preview-container');
		ui.show('#report-panel');
	}
}
