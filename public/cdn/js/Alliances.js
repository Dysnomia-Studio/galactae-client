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

	static getCurrentUser() {
		return Alliances.details.members.filter((user) => user.name === userData.username)[0];
	}

	static updateDetails(newAllyDetails) {
		Alliances.details = newAllyDetails;
		console.log(Alliances.details);

		Alliances.renderDetails();
		Alliances.renderMembers();
		Alliances.renderPacts();
	}

	static renderDetails() {
		document.getElementById('alliances-panel-info-name').innerText = Alliances.details.name;
		document.getElementById('alliances-panel-info-desc').innerText = Alliances.details.description;
		document.getElementById('alliances-panel-info-membersCount').innerText = Alliances.details.members.length;

		const currUser = Alliances.getCurrentUser();
		if(currUser.founder) {
			ui.show('#alliance-panel-info-dissolve');
			ui.hide('#alliance-panel-info-quit');
		} else {
			ui.show('#alliance-panel-info-quit');
			ui.hide('#alliance-panel-info-dissolve');
		}
	}

	static renderPacts() {
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
				allyName =  pact.ally_2_name;
			}

			if(pact.accepted) {
				li.innerText = allyName;
				ulOk.appendChild(li);
			} else if(pact.ally_2_name === Alliances.details.name) {
				const span = document.createElement('span');
				span.innerText = allyName;

				const validationButton = document.createElement('span');
				validationButton.classList.add('alliance-panel-validate');
				validationButton.innerText = '✓';
				validationButton.addEventListener('click', () => { Alliances.choicePact(allyName, true); });

				const refuseButton = document.createElement('span');
				refuseButton.classList.add('alliance-panel-refuse');
				refuseButton.innerText = '✗';
				refuseButton.addEventListener('click', () => { Alliances.choicePact(allyName, false); });

				li.appendChild(span);
				li.appendChild(refuseButton);
				li.appendChild(validationButton);
				ulAsk.appendChild(li);
			} else {
				const span = document.createElement('span');
				span.innerText = allyName;

				const cancelButton = document.createElement('span');
				cancelButton.classList.add('alliance-panel-cancel');
				cancelButton.innerText = '✗';
				cancelButton.addEventListener('click', () => { Alliances.cancelPactInvite(allyName); });

				li.appendChild(span);
				li.appendChild(cancelButton);
				ulInvit.appendChild(li);
			}
		}

		if(!ulOk.firstChild) {
			const li = document.createElement('li');
			li.innerText = 'Aucun pacte en cours';

			ulOk.appendChild(li);
		} else {
			const li = document.createElement('li');
			li.classList.add('alliance-panel-list-header');
			li.innerText = 'Pactes en cours:';

			ulOk.prepend(li);
		}

		if(!ulAsk.firstChild) {
			const li = document.createElement('li');
			li.innerText = 'Aucune demande en cours';

			ulAsk.appendChild(li);
		} else {
			const li = document.createElement('li');
			li.classList.add('alliance-panel-list-header');
			li.innerText = 'Demandes de pactes entrantes:';

			ulAsk.prepend(li);
		}

		if(!ulInvit.firstChild) {
			const li = document.createElement('li');
			li.innerText = 'Aucune invitation en cours';

			ulInvit.appendChild(li);
		} else {
			const li = document.createElement('li');
			li.classList.add('alliance-panel-list-header');
			li.innerText = 'Demandes de pactes sortantes:';

			ulInvit.prepend(li);
		}
	}

	static renderMembers() {
		ui.empty('#alliances-panel-members-list');

		const tbody = document.getElementById('alliances-panel-members-list');
		const permsList = [
			'founder',
			'leader',
			'diplomacy',
			'none',
		];
		const currUser = Alliances.getCurrentUser();

		for(const player of Alliances.details.members) {
			const tr = document.createElement('tr');

			// Name
			const tdName = document.createElement('td');
			tdName.innerText = player.name;
			tr.appendChild(tdName);

			// Perms
			let havePerm = false;
			for(const perm of permsList) {
				const checkBox = document.createElement('input');
				checkBox.setAttribute('name', player.name);
				checkBox.setAttribute('type', 'radio');
				checkBox.setAttribute('permType', perm);

				if(player[perm] || (!havePerm && perm === 'none')) {
					havePerm = true;
					checkBox.setAttribute('checked', true);
				}

				if(currUser.name === player.name || (!currUser.founder && (!currUser.leader || player.founder || player.leader))) {
					checkBox.setAttribute('disabled', true);
				}

				const tdCheckBox = document.createElement('td');
				tdCheckBox.appendChild(checkBox);

				tr.appendChild(tdCheckBox);
			}


			tbody.appendChild(tr);
		}

		const ulAsk = document.getElementById('alliances-panel-membersAsk-list');
		for(const player of Alliances.details.askToJoin) {
			const li = document.createElement('li');

			const span = document.createElement('span');
			span.innerText = player.player;

			const validationButton = document.createElement('span');
			validationButton.classList.add('alliance-panel-validate');
			validationButton.innerText = '✓';
			validationButton.addEventListener('click', () => { Alliances.choiceAskToJoin(allyName, true); });

			const refuseButton = document.createElement('span');
			refuseButton.classList.add('alliance-panel-refuse');
			refuseButton.innerText = '✗';
			refuseButton.addEventListener('click', () => { Alliances.choiceAskToJoin(allyName, false); });

			li.appendChild(span);
			li.appendChild(refuseButton);
			li.appendChild(validationButton);
			ulAsk.appendChild(li);
		}

		if(!ulAsk.firstChild) {
			const li = document.createElement('li');
			li.innerText = 'Aucune demande de joueur pour rejoindre l\'alliance';

			ulAsk.appendChild(li);
		} else {
			const li = document.createElement('li');
			li.classList.add('alliance-panel-list-header');
			li.innerText = 'Demandes de joueur à rejoindre l\'alliance:';

			ulAsk.prepend(li);
		}

		const ulInvit = document.getElementById('alliances-panel-membersInvit-list');
		for(const player of Alliances.details.invitations) {
			const li = document.createElement('li');
			const span = document.createElement('span');
			span.innerText = player.player;

			const cancelButton = document.createElement('span');
			cancelButton.classList.add('alliance-panel-cancel');
			cancelButton.innerText = '✗';
			cancelButton.addEventListener('click', () => { Alliances.cancelPlayerInvite(allyName); });

			li.appendChild(span);
			li.appendChild(cancelButton);
			ulInvit.appendChild(li);
		}

		if(!ulInvit.firstChild) {
			const li = document.createElement('li');
			li.innerText = 'Aucune invitation à rejoindre l\'alliance';

			ulInvit.appendChild(li);
		} else {
			const li = document.createElement('li');
			li.classList.add('alliance-panel-list-header');
			li.innerText = 'Invitations à rejoindre l\'alliance:';

			ulInvit.prepend(li);
		}
	}
}