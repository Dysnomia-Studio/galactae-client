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

		/**
		 * Info page events
		 */
		document.getElementById('alliance-panel-info-quit').addEventListener('click', Alliances.quit);
		document.getElementById('alliance-panel-info-dissolve').addEventListener('click', Alliances.dissolve);

		// @TODO: alliance-edit

		/**
		 * Player page events
		 */
		document.getElementById('alliances-panel-membersInvit-input').addEventListener('keypress', Alliances.invitPlayer);
		document.getElementById('alliances-panel-pactsInvit-input').addEventListener('keypress', Alliances.askPact);


		// @TODO: alliance-search
		// @TODO: alliance-create
		// @TODO: alliance-join-ask
		// @TODO: alliance-join-remove
		// @TODO: alliance-invite-choice
		// @TODO: alliance-members-permissionsEdit
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
		ui.empty('#alliances-panel-pactsAsk-list');
		ui.empty('#alliances-panel-pactsInvit-list');

		const currentUser = Alliances.getCurrentUser();

		const ulOk = document.getElementById('alliances-panel-pacts-list');
		const ulAsk = document.getElementById('alliances-panel-pactsAsk-list');
		const ulInvit = document.getElementById('alliances-panel-pactsInvit-list');
		for(const pact of Alliances.details.pacts) {
			const li = document.createElement('li');

			let allyName = pact.ally_1_name;
			let allyId = pact.first;
			if(allyName === Alliances.details.name) {
				allyName =  pact.ally_2_name;
				allyId =  pact.second;
			}

			if(pact.accepted) {
				li.appendChild(ui.createSpanText(allyName));

				if(currentUser.founder || currentUser.leader || currentUser.diplomacy) {
					li.appendChild(ui.createSpanBtn('✗', () => { Alliances.stopPact(allyId); }, 'alliance-panel-cancel'));
				}

				ulOk.appendChild(li);
			} else if(pact.ally_2_name === Alliances.details.name) {
				li.appendChild(ui.createSpanText(allyName));

				if(currentUser.founder || currentUser.leader || currentUser.diplomacy) {
					li.appendChild(ui.createSpanBtn('✗', () => { Alliances.choicePact(allyId, false); }, 'alliance-panel-refuse'));
					li.appendChild(ui.createSpanBtn('✓', () => { Alliances.choicePact(allyId, true); }, 'alliance-panel-validate'));
				}

				ulAsk.appendChild(li);
			} else {
				li.appendChild(ui.createSpanText(allyName));

				if(currentUser.founder || currentUser.leader || currentUser.diplomacy) {
					li.appendChild(ui.createSpanBtn('✗', () => { Alliances.cancelPactInvite(allyId); }, 'alliance-panel-cancel'));
				}

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

		if(currentUser.founder || currentUser.leader || currentUser.diplomacy) {
			ui.show('#alliances-panel-pactsInvit-input');
		} else {
			ui.hide('#alliances-panel-pactsInvit-input');
		}
	}

	static renderMembers() {
		ui.empty('#alliances-panel-members-list');
		ui.empty('#alliances-panel-membersAsk-list');
		ui.empty('#alliances-panel-membersInvit-list');

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
				checkBox.addEventListener('click', (e) => Alliances.changePermission(player.name, perm, e));

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

			const tdKick = document.createElement('td');
			if(currUser.name !== player.name && (currUser.founder || (currUser.leader && (!player.founder && !player.leader)))) {
				tdKick.appendChild(ui.createSpanBtn('✗', () => { Alliances.kick(player.name); }, 'alliance-panel-kick'));
			}
			tr.appendChild(tdKick);

			tbody.appendChild(tr);
		}

		const ulAsk = document.getElementById('alliances-panel-membersAsk-list');
		for(const player of Alliances.details.askToJoin) {
			const li = document.createElement('li');
			li.appendChild(ui.createSpanText(player.player));

			if(currUser.founder || currUser.leader) {
				li.appendChild(ui.createSpanBtn('✗', () => { Alliances.choiceAskToJoin(player.player, false); }, 'alliance-panel-refuse'));
				li.appendChild(ui.createSpanBtn('✓', () => { Alliances.choiceAskToJoin(player.player, true); }, 'alliance-panel-validate'));
			}

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

			if(currUser.founder || currUser.leader) {
				li.appendChild(ui.createSpanBtn('✗', () => { Alliances.cancelPlayerInvitation(player.player); }, 'alliance-panel-cancel'));
			}

			ulInvit.appendChild(li);
		}

		if(!ulInvit.firstChild) {
			ulInvit.appendChild(ui.createLiText('Aucune invitation à rejoindre l\'alliance')); // @TODO: translate
		} else {
			ulInvit.prepend(ui.createLiText('Invitations à rejoindre l\'alliance:','alliance-panel-list-header')); // @TODO: translate
		}


		if(currUser.founder || currUser.leader) {
			ui.show('#alliances-panel-membersInvit-input');
		} else {
			ui.hide('#alliances-panel-membersInvit-input');
		}
	}

	/**
	 * Socket interactions
	 */
	static quit() {
		ui.confirm(
			'Voulez-vous vraiment quitter l\'alliance ?', // @TODO: translate
			translate['ui']['CONFIRM_YES'],
			translate['ui']['CONFIRM_NO'],

			() => { // Yes
				socket.emit(
					'alliance-leave',
					userData
				);
			}, () => { // No
				// Do nothing
			}
		);
	}

	static dissolve() {
		ui.confirm(
			'Voulez-vous vraiment dissoudre l\'alliance ?', // @TODO: translate
			translate['ui']['CONFIRM_YES'],
			translate['ui']['CONFIRM_NO'],

			() => { // Yes
				socket.emit(
					'alliance-disslove',
					userData
				);
			}, () => { // No
				// Do nothing
			}
		);
	}

	static invitPlayer(e) {
		if(e.key === 'Enter' && this.value.length > 0) {
			socket.emit(
				'alliance-invite-ask',
				{
					...userData,
					playerName: this.value,
				}
			);

			this.value = '';
		}
	}

	static choicePact(allyId, choice) {
		socket.emit(
			'alliance-pact-choice',
			{
				...userData,
				allyId,
				choice,
			}
		);
	}

	static cancelPactInvite(allyId) {
		socket.emit(
			'alliance-pact-cancelInvite',
			{
				...userData,
				allyId,
			}
		);
	}

	static askPact(e) {
		// @TODO: Autocomplete with available list of alliances (use search method)

		if(e.key === 'Enter' && this.value.length > 0) {
			socket.emit(
				'alliance-pact-ask',
				{
					...userData,
					allyName: this.value,
				}
			);

			this.value = '';
		}
	}

	static stopPact(allyId) {
		ui.confirm(
			'Voulez-vous vraiment stopper ce pacte ?', // @TODO: translate
			translate['ui']['CONFIRM_YES'],
			translate['ui']['CONFIRM_NO'],

			() => { // Yes
				socket.emit(
					'alliance-pact-stop',
					{
						...userData,
						allyId,
					}
				);
			}, () => { // No
				// Do nothing
			}
		);
	}

	static choiceAskToJoin(plyName, choice) {
		socket.emit(
			'alliance-join-choice',
			{
				...userData,
				plyName,
				choice,
			}
		);
	}

	static cancelPlayerInvitation(playerName) {
		socket.emit(
			'alliance-invite-remove',
			{
				...userData,
				playerName,
			}
		);
	}

	static changePermission(playerName, permission, e) {
		console.log(playerName);
		console.log(permission);

		const playerPerms = {
			playerName,
			founder: false,
			leader: false,
			diplomacy: false
		};

		switch (permission) {
			case 'founder':
				playerPerms.founder = true;
				break;
			case 'leader':
				playerPerms.leader = true;
				break;
			case 'diplomacy':
				playerPerms.diplomacy = true;
				break;
			default:
				// Do nothing
				break;
		}

		if(!playerPerms.founder) {
			socket.emit(
				'alliance-members-permissionsEdit',
				{
					...userData,
					...playerPerms,
				}
			);
		} else {
			ui.confirm(
				'Voulez-vous quitter votre rôle de fondateur de l\'alliance au profit de ' + playerName + ' ?', // @TODO: translate
				translate['ui']['CONFIRM_YES'],
				translate['ui']['CONFIRM_NO'],

				() => { // Yes
					socket.emit(
						'alliance-members-permissionsEdit',
						{
							...userData,
							...playerPerms,
						}
					);
				}, () => { // No
					Alliances.renderMembers(); // Roll back radio input
				}
			);
		}
	}

	static kick(playerName) {
		ui.confirm(
			'Voulez-vous vraiment exclure ' + playerName + ' de l\'alliance ?', // @TODO: translate
			translate['ui']['CONFIRM_YES'],
			translate['ui']['CONFIRM_NO'],

			() => { // Yes
				socket.emit(
					'alliance-members-kick',
					{
						...userData,
						playerName,
					}
				);
			}, () => { // No
				// Do nothing
			}
		);
	}
}