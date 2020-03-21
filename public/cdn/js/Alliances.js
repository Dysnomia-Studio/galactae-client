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
		document.getElementById('alliances-panel-info-quit').addEventListener('click', Alliances.quit);
		document.getElementById('alliances-panel-info-dissolve').addEventListener('click', Alliances.dissolve);
		document.getElementById('alliances-panel-info-edit').addEventListener('click', Alliances.beginEdit);
		document.getElementById('alliances-panel-info-cancelEdit').addEventListener('click', () => Alliances.renderDetails());
		document.getElementById('alliances-panel-info-saveEdit').addEventListener('click', Alliances.saveEdit);

		/**
		 * Player page events
		 */
		document.getElementById('alliances-panel-membersInvit-input').addEventListener('keypress', Alliances.invitPlayer);
		document.getElementById('alliances-panel-pactsInvit-input').addEventListener('keypress', Alliances.askPact);
		document.getElementById('alliances-panel-search-input').addEventListener('keypress', Alliances.search);
		document.getElementById('alliances-panel-createBtn').addEventListener('click', () => { ui.show('#alliances-panel-create'); });
		document.getElementById('alliances-panel-createBtn-close').addEventListener('click', () => { ui.hide('#alliances-panel-create'); });
		document.getElementById('alliances-panel-createBtn-validate').addEventListener('click', Alliances.create);


		// @TODO: alliance-create
	}

	static getCurrentUser() {
		return Alliances.details.members.filter((user) => user.name === userData.username)[0];
	}

	static updateDetails(newAllyDetails) {
		Alliances.details = newAllyDetails;

		if(Alliances.details.name) {
			ui.show('#alliances-panel-haveAlly');
			ui.hide('#alliances-panel-haveNoAlly');

			Alliances.renderDetails();
			Alliances.renderMembers();
			Alliances.renderPacts();
		} else {
			ui.hide('#alliances-panel-haveAlly');
			ui.show('#alliances-panel-haveNoAlly');

			Alliances.renderNoAlliancePage();
			Alliances.updateSearchResults();
		}
	}

	static renderDetails() {
		document.getElementById('alliances-panel-info-name').innerText = Alliances.details.name;
		document.getElementById('alliances-panel-info-desc').innerText = Alliances.details.description;
		document.getElementById('alliances-panel-info-membersCount').innerText = Alliances.details.members.length;

		const currUser = Alliances.getCurrentUser();
		if(currUser.founder) {
			ui.show('#alliances-panel-info-dissolve');
			ui.hide('#alliances-panel-info-quit');
		} else {
			ui.show('#alliances-panel-info-quit');
			ui.hide('#alliances-panel-info-dissolve');
		}

		if(currUser.founder || currUser.leader) {
			ui.show('#alliances-panel-info-edit', 'inline');
		} else {
			ui.hide('#alliances-panel-info-edit');
		}

		ui.hide('#alliances-panel-info-cancelEdit');
		ui.hide('#alliances-panel-info-saveEdit');
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
					li.appendChild(ui.createSpanBtn('✗', () => { Alliances.stopPact(allyId); }, 'alliances-panel-cancel'));
				}

				ulOk.appendChild(li);
			} else if(pact.ally_2_name === Alliances.details.name) {
				li.appendChild(ui.createSpanText(allyName));

				if(currentUser.founder || currentUser.leader || currentUser.diplomacy) {
					li.appendChild(ui.createSpanBtn('✗', () => { Alliances.choicePact(allyId, false); }, 'alliances-panel-refuse'));
					li.appendChild(ui.createSpanBtn('✓', () => { Alliances.choicePact(allyId, true); }, 'alliances-panel-validate'));
				}

				ulAsk.appendChild(li);
			} else {
				li.appendChild(ui.createSpanText(allyName));

				if(currentUser.founder || currentUser.leader || currentUser.diplomacy) {
					li.appendChild(ui.createSpanBtn('✗', () => { Alliances.cancelPactInvite(allyId); }, 'alliances-panel-cancel'));
				}

				ulInvit.appendChild(li);
			}
		}

		if(!ulOk.firstChild) {
			ulOk.appendChild(ui.createLiText('Aucun pacte en cours')); // @TODO: translate
		} else {
			ulOk.prepend(ui.createLiText('Pactes en cours:','alliances-panel-list-header')); // @TODO: translate
		}

		if(!ulAsk.firstChild) {
			ulAsk.appendChild(ui.createLiText('Aucune demande en cours')); // @TODO: translate
		} else {
			ulAsk.prepend(ui.createLiText('Demandes de pactes entrantes:','alliances-panel-list-header')); // @TODO: translate
		}

		if(!ulInvit.firstChild) {
			ulInvit.appendChild(ui.createLiText('Aucune invitation en cours')); // @TODO: translate
		} else {
			ulInvit.prepend(ui.createLiText('Demandes de pactes sortantes','alliances-panel-list-header')); // @TODO: translate
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
				tdKick.appendChild(ui.createSpanBtn('✗', () => { Alliances.kick(player.name); }, 'alliances-panel-kick'));
			}
			tr.appendChild(tdKick);

			tbody.appendChild(tr);
		}

		const ulAsk = document.getElementById('alliances-panel-membersAsk-list');
		for(const player of Alliances.details.askToJoin) {
			const li = document.createElement('li');
			li.appendChild(ui.createSpanText(player.player));

			if(currUser.founder || currUser.leader) {
				li.appendChild(ui.createSpanBtn('✗', () => { Alliances.choiceAskToJoin(player.player, false); }, 'alliances-panel-refuse'));
				li.appendChild(ui.createSpanBtn('✓', () => { Alliances.choiceAskToJoin(player.player, true); }, 'alliances-panel-validate'));
			}

			ulAsk.appendChild(li);
		}

		if(!ulAsk.firstChild) {
			ulAsk.appendChild(ui.createLiText('Aucune demande de joueur pour rejoindre l\'alliance')); // @TODO: translate
		} else {
			ulAsk.prepend(ui.createLiText('Demandes de joueur à rejoindre l\'alliance:','alliances-panel-list-header')); // @TODO: translate
		}

		const ulInvit = document.getElementById('alliances-panel-membersInvit-list');
		for(const player of Alliances.details.invitations) {
			const li = document.createElement('li');
			li.appendChild(ui.createSpanText(player.player));

			if(currUser.founder || currUser.leader) {
				li.appendChild(ui.createSpanBtn('✗', () => { Alliances.cancelPlayerInvitation(player.player); }, 'alliances-panel-cancel'));
			}

			ulInvit.appendChild(li);
		}

		if(!ulInvit.firstChild) {
			ulInvit.appendChild(ui.createLiText('Aucune invitation à rejoindre l\'alliance')); // @TODO: translate
		} else {
			ulInvit.prepend(ui.createLiText('Invitations à rejoindre l\'alliance:','alliances-panel-list-header')); // @TODO: translate
		}


		if(currUser.founder || currUser.leader) {
			ui.show('#alliances-panel-membersInvit-input');
		} else {
			ui.hide('#alliances-panel-membersInvit-input');
		}
	}

	static renderNoAlliancePage() {
		ui.empty('#alliances-panel-noAlly-askToJoin');
		ui.empty('#alliances-panel-noAlly-invitations');

		const ulAsk = document.getElementById('alliances-panel-noAlly-askToJoin');
		for(const ask of Alliances.details.askToJoin) {
			const li = document.createElement('li');
			li.appendChild(ui.createSpanText(ask.alliance_name));

			li.appendChild(ui.createSpanBtn('✗', () => { Alliances.cancelAskToJoin(ask.alliance); }, 'alliances-panel-cancel'));

			ulAsk.appendChild(li);
		}

		if(!ulAsk.firstChild) {
			ulAsk.appendChild(ui.createLiText('Aucune demande pour rejoindre une alliance')); // @TODO: translate
		} else {
			ulAsk.prepend(ui.createLiText('Demandes de afin de rejoindre une alliance:','alliances-panel-list-header')); // @TODO: translate
		}

		const ulInvit = document.getElementById('alliances-panel-noAlly-invitations');
		for(const invitation of Alliances.details.invitations) {
			const li = document.createElement('li');
			li.appendChild(ui.createSpanText(invitation.alliance_name));

			li.appendChild(ui.createSpanBtn('✗', () => { Alliances.choiceInvite(invitation.alliance, false); }, 'alliances-panel-refuse'));
			li.appendChild(ui.createSpanBtn('✓', () => { Alliances.choiceInvite(invitation.alliance, true); }, 'alliances-panel-validate'));

			ulInvit.appendChild(li);
		}

		if(!ulInvit.firstChild) {
			ulInvit.appendChild(ui.createLiText('Aucune invitation à rejoindre une alliance')); // @TODO: translate
		} else {
			ulInvit.prepend(ui.createLiText('Invitations à rejoindre une alliance:','alliances-panel-list-header')); // @TODO: translate
		}
	}

	static updateSearchResults() {
		ui.empty('#alliance-search-results');

		if(!Alliances.searchResults) {
			return;
		}

		const cantAskAllys = [
			...Alliances.details.askToJoin.map((elt) => elt.alliance_name),
			...Alliances.details.invitations.map((elt) => elt.alliance_name),
		];

		const ulInvit = document.getElementById('alliance-search-results');
		for(const alliance of Alliances.searchResults) {
			const li = document.createElement('li');
			li.appendChild(ui.createSpanText(alliance.name));

			if(!cantAskAllys.find((elt) => elt === alliance.name)) {
				li.appendChild(ui.createSpanBtn('Demander à rejoindre', () => { Alliances.askToJoin(alliance.name); }, 'alliances-panel-askToJoin'));
			} else {
				li.appendChild(ui.createSpanText('-', 'alliances-panel-askToJoin'));
			}

			ulInvit.appendChild(li);
		}

		if(!ulInvit.firstChild) {
			ulInvit.appendChild(ui.createLiText('Aucun résultat')); // @TODO: translate
		} else {
			ulInvit.prepend(ui.createLiText('Résultats:','alliances-panel-list-header')); // @TODO: translate
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

	static search(e) {
		if(this.value.length > 2) {
			socket.emit(
				'alliance-search',
				{
					...userData,
					searchText: this.value,
				}
			);
		}
	}

	static create(e) {
		const name = document.getElementById('alliances-panel-create-name').value;
		const description = document.getElementById('alliances-panel-create-description').value;

		if(name.length > 2) { // @TODO: err message
			socket.emit(
				'alliance-create',
				{
					...userData,
					name,
					description,
				}
			);

			ui.hide('#alliances-panel-create');
		}
	}

	static askPact(e) {
		// @TODO: Autocomplete with available list of alliances (use search method)

		if(this.value.length > 0) {
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

	static askToJoin(allyName) {
		socket.emit(
			'alliance-join-ask',
			{
				...userData,
				allyName: allyName,
			}
		);
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

	static choiceInvite(allyId, choice) {
		socket.emit(
			'alliance-invite-choice',
			{
				...userData,
				allyId,
				choice,
			}
		);
	}

	static cancelAskToJoin(allyId) {
		socket.emit(
			'alliance-join-remove',
			{
				...userData,
				allyId,
			}
		);
	}

	static beginEdit() {
		const allyNameTd = document.getElementById('alliances-panel-info-name');
		allyNameTd.innerText = '';
		allyNameTd.appendChild(ui.createTextInput(Alliances.details.name, 'ui-small-input'));

		const allyDescTd = document.getElementById('alliances-panel-info-desc');
		allyDescTd.innerText = '';
		allyDescTd.appendChild(ui.createTextInput(Alliances.details.description, 'ui-small-input'));

		ui.hide('#alliances-panel-info-edit');
		ui.show('#alliances-panel-info-cancelEdit', 'inline-block');
		ui.show('#alliances-panel-info-saveEdit', 'inline-block');
	}

	static saveEdit() {
		const name = document.getElementById('alliances-panel-info-name').firstChild.value;
		const description = document.getElementById('alliances-panel-info-desc').firstChild.value;

		if(name === Alliances.details.name && description === Alliances.details.description) {
			Alliances.renderDetails();
			return;
		}

		socket.emit(
			'alliance-edit',
			{
				...userData,
				name,
				description,
			}
		);
	}
}