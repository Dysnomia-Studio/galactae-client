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
				// @TODO: stop pact button
				ulOk.appendChild(li);
			} else if(pact.ally_2_name === Alliances.details.name) {
				li.appendChild(ui.createSpanText(allyName));
				li.appendChild(ui.createSpanBtn('✗', () => { Alliances.choicePact(allyName, false); }, 'alliance-panel-refuse'));
				li.appendChild(ui.createSpanBtn('✓', () => { Alliances.choicePact(allyName, true); }, 'alliance-panel-validate'));
				ulAsk.appendChild(li);
			} else {
				li.appendChild(ui.createSpanText(allyName));
				li.appendChild(ui.createSpanBtn('✗', () => { Alliances.cancelPactInvite(allyName); }, 'alliance-panel-cancel'));
				ulInvit.appendChild(li);
			}
		}

		if(!ulOk.firstChild) {
			ulOk.appendChild(ui.createLiText('Aucun pacte en cours')); // @TODO: translate
		} else {
			ulOk.prepend(ui.createLiText('Pactes en cours:','alliance-panel-list-header')); // @TODO: translate
		}

		if(!ulAsk.firstChild) {
			ulAsk.appendChild(ui.createLiText('Aucune demande en cours')); // @TODO: translate
		} else {
			ulAsk.prepend(ui.createLiText('Demandes de pactes entrantes:','alliance-panel-list-header')); // @TODO: translate
		}

		if(!ulInvit.firstChild) {
			ulInvit.appendChild(ui.createLiText('Aucune invitation en cours')); // @TODO: translate
		} else {
			ulInvit.prepend(ui.createLiText('Demandes de pactes sortantes','alliance-panel-list-header')); // @TODO: translate
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
			li.appendChild(ui.createSpanText(player.player));
			li.appendChild(ui.createSpanBtn('✗', () => { Alliances.choiceAskToJoin(player.player, false); }, 'alliance-panel-refuse'));
			li.appendChild(ui.createSpanBtn('✓', () => { Alliances.choiceAskToJoin(player.player, true); }, 'alliance-panel-validate'));
			ulAsk.appendChild(li);
		}

		if(!ulAsk.firstChild) {
			ulAsk.appendChild(ui.createLiText('Aucune demande de joueur pour rejoindre l\'alliance')); // @TODO: translate
		} else {
			ulAsk.prepend(ui.createLiText('Demandes de joueur à rejoindre l\'alliance:','alliance-panel-list-header')); // @TODO: translate
		}

		const ulInvit = document.getElementById('alliances-panel-membersInvit-list');
		for(const player of Alliances.details.invitations) {
			const li = document.createElement('li');
			li.appendChild(ui.createSpanText(player.player));
			li.appendChild(ui.createSpanBtn('✗', () => { Alliances.cancelPlayerInvite(player.player); }, 'alliance-panel-cancel'));
			ulInvit.appendChild(li);
		}

		if(!ulInvit.firstChild) {
			ulInvit.appendChild(ui.createLiText('Aucune invitation à rejoindre l\'alliance')); // @TODO: translate
		} else {
			ulInvit.prepend(ui.createLiText('Invitations à rejoindre l\'alliance:','alliance-panel-list-header')); // @TODO: translate
		}
	}
}