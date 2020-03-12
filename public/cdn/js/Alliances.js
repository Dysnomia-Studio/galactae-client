class Alliances {
	static loadUI() {
		document.getElementById('alliances-close').addEventListener('click', () => {
			ui.hide('#alliances-panel');
		});

		// Menu
		// @TODO: refacto to group up with fleet tabs
		document.querySelectorAll('#alliances-panel .ul-choice-line li').forEach(function(elt) {
			elt.addEventListener('click', () => {
				ui.toggleClass('#alliances-panel .ul-choice-line .ul-choice-line-li-active', 'ul-choice-line-li-active', elt);

				const buttonList = [
					'alliances-panel-info',
					'alliances-panel-members',
					'alliances-panel-newMembers',
					'alliances-panel-diplomacy',
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

	static updateDetails(newAllyDetails) {
		Alliances.details = newAllyDetails;
		console.log(Alliances.details);

		Alliances.writeDetails();
		Alliances.writeMembers();
		Alliances.writePacts();
	}

	static writeDetails() {
		document.getElementById('alliances-panel-info-name').innerText = Alliances.details.name;
		document.getElementById('alliances-panel-info-desc').innerText = Alliances.details.description;
		document.getElementById('alliances-panel-info-membersCount').innerText = Alliances.details.members.length;
	}

	static writePacts() {
		ui.empty('#alliances-panel-pacts-list');
		ui.empty('#alliances-panel-pacts-list');
		ui.empty('#alliances-panel-pacts-list');

		const ulOk = document.getElementById('alliances-panel-pacts-list');
		const ulAsk = document.getElementById('alliances-panel-pactsAsk-list');
		const ulInvit = document.getElementById('alliances-panel-pactsInvit-list');
		for(const pact of Alliances.details.pacts) {
			const li = document.createElement('li');

			let allyName = pact.ally_1_name;
			if(allyName === Alliances.details.name) {
				allyName = ally_1_name;
			}

			li.innerText = allyName;

			if(pact.accepted) {
				ulOk.appendChild(li);
			} else if(pact.ally_2_name === Alliances.details.name) {
				ulAsk.appendChild(li);
			} else {
				ulInvit.appendChild(li);
			}
		}

		if(!ulOk.firstChild) {
			const li = document.createElement('li');
			li.innerText = 'Aucun pacte en cours';

			ulOk.appendChild(li);
		}

		if(!ulAsk.firstChild) {
			const li = document.createElement('li');
			li.innerText = 'Aucune demande en cours';

			ulAsk.appendChild(li);
		}

		if(!ulInvit.firstChild) {
			const li = document.createElement('li');
			li.innerText = 'Aucune invitation en cours';

			ulInvit.appendChild(li);
		}
	}

	static writeMembers() {
		ui.empty('#alliances-panel-members-list');

		const tbody = document.getElementById('alliances-panel-members-list');
		const permsList = [
			'founder',
			'leader',
			'diplomacy',
		];
		const currUser = Alliances.details.members.filter((user) => user.name === userData.username)[0];

		for(const player of Alliances.details.members) {
			const tr = document.createElement('tr');

			// Name
			const tdName = document.createElement('td');
			tdName.innerText = player.name;
			tr.appendChild(tdName);

			// Perms
			for(const perm of permsList) {
				const checkBox = document.createElement('input');
				checkBox.setAttribute('type', 'radio');
				checkBox.setAttribute('permType', perm);

				if(player[perm]) {
					checkBox.setAttribute('checked', true);
				}

				if(currUser.founder || (currUser.leader && !player.founder && !player.leader)) {
					checkBox.setAttribute('disabled', true);
				}

				// TODO: set checkbox value
				// TODO: disable if no perm

				const tdCheckBox = document.createElement('td');
				tdCheckBox.appendChild(checkBox);

				tr.appendChild(tdCheckBox);
			}


			tbody.appendChild(tr);
		}

		const ulAsk = document.getElementById('alliances-panel-membersAsk-list');
		for(const player of Alliances.details.askToJoin) {
			const li = document.createElement('li');
			li.innerText = player.player;

			ulAsk.appendChild(li);
		}

		if(!ulAsk.firstChild) {
			const li = document.createElement('li');
			li.innerText = 'Aucune demande de joueur pour rejoindre l\'alliance';

			ulAsk.appendChild(li);
		}

		const ulInvit = document.getElementById('alliances-panel-membersInvit-list');
		for(const player of Alliances.details.invitations) {
			const li = document.createElement('li');
			li.innerText = player.player;

			ulInvit.appendChild(li);
		}

		if(!ulInvit.firstChild) {
			const li = document.createElement('li');
			li.innerText = 'Aucune invitation à rejoindre l\'alliance';

			ulInvit.appendChild(li);
		}
	}
}